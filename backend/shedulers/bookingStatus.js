import cron from 'node-cron';
import { sql } from './config/db.js';

cron.schedule('* * * * *', async () => {
  const now = new Date().toTimeString().split(' ')[0]; // 'HH:MM:SS'
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

  await sql`
    UPDATE bookings
    SET status = 'inactive'
    WHERE date = ${today} AND eTime < ${now} AND status = 'active'
  `;
  
});


cron.schedule('* * * * *', async () => {
  const now = new Date();
  const in10min = new Date(now.getTime() + 10 * 60000);
  const targetTime = in10min.toTimeString().split(' ')[0];
  const today = now.toISOString().slice(0, 10);

  const bookings = await sql`
    SELECT * FROM bookings
    WHERE date = ${today} AND sTime = ${targetTime} AND status = 'active'
  `;

  bookings.forEach((b) => {
    console.log(`Reminder: Your booking starts at ${b.sTime}`);
    // Optionally: Emit with socket or send email
  });
});


cron.schedule('* * * * *', async () => {
  const now = new Date();
  const bookings = await sql`
    SELECT * FROM bookings WHERE status = 'active'
  `;

  bookings.forEach(booking => {
    const bookingEnd = new Date(`${booking.date}T${booking.eTime}`);
    const diffInMinutes = Math.floor((bookingEnd - now) / (1000 * 60));

    if (diffInMinutes === 15) {
      // 🔔 Emit notification via socket.io
      /**
      io.to(booking.customer_id).emit("reminder", {
        message: "Your booking ends in 15 minutes!"
      });
         */
      // Optionally: store in DB or send email/SMS
    }
  });
});
