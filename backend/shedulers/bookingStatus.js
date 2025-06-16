import cron from 'node-cron';
import { sql } from '../config/db.js';
import { io } from '../server.js';
import { connectedUsers } from '../sockets/socket.js';

cron.schedule('* * * * *', async () => {
  const now = new Date().toTimeString().split(' ')[0]; // 'HH:MM:SS'
  console.log(now);
  await sql`
    UPDATE bookings
    SET status = 'inactive'
    WHERE eTime < ${now} AND status = 'active'
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

  for (const b of bookings) {
    const userSocketId = connectedUsers.get(b.customer_id);
    if (userSocketId) {
      io.to(userSocketId).emit('booking-reminder', {
        message: `Your parking starts at ${b.sTime}`,
        booking: b
      });
      await sql`
        INSERT INTO notifications (customer_id, message, created_at, status)
        VALUES (${b.customer_id}, ${`Your booking at ${b.sTime} is about to start.`}, ${now}, 'read')
      `;
      console.log(`Reminder sent to user ${b.customer_id}`);
    } else {
      const now = new Date();
      await sql`
        INSERT INTO notifications (customer_id, message, created_at, status)
        VALUES (${b.customer_id}, ${`Your booking at ${b.sTime} is about to start.`}, ${now}, 'unread')
      `;
      console.log(`User ${b.customer_id} not connected, notification saved`);
    }
  }
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
