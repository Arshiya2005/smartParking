import cron from 'node-cron';
import { sql } from '../config/db.js';
import { io } from '../server.js';
import { connectedUsers } from '../sockets/socket.js';

cron.schedule('* * * * *', async () => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const targetTime = now.toTimeString().split(' ')[0];
  const bookings = await sql`
    SELECT bookings.*, parkingspot.name FROM bookings
    INNER JOIN parkingspot ON bookings.slot_id = parkingspot.id
    WHERE bookings.date = ${today} AND bookings.sTime = ${targetTime} AND bookings.status = 'active';
  `;
  
  for (const b of bookings) {
    const userSocketId = connectedUsers.get(b.customer_id);
    if (userSocketId) {
      io.to(userSocketId).emit('booking-reminder', {
        message: `Your parking at ${b.name} starts at ${b.stime}`,
      });
      await sql`
        INSERT INTO notifications (users_id, message, created_at, status)
        VALUES (${b.customer_id}, ${`Your parking at ${b.name} starts at ${b.stime}`}, ${now}, 'read')
      `;
      console.log(`Reminder sent to user ${b.customer_id}`);
    } else {
      await sql`
        INSERT INTO notifications (users_id, message, created_at, status)
        VALUES (${b.customer_id}, ${`Your parking at ${b.name} starts at ${b.stime}`}, ${now}, 'unread')
      `;
      console.log(`User ${b.customer_id} not connected, notification saved`);
    }
  }
});


cron.schedule('* * * * *', async () => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const targetETime = new Date(now.getTime() + 15 * 60000)
    .toTimeString()
    .split(' ')[0];
  const bookings = await sql`
    SELECT bookings.*, parkingspot.name FROM bookings
    INNER JOIN parkingspot ON bookings.slot_id = parkingspot.id
    WHERE bookings.date = ${today} AND bookings.eTime = ${targetETime} AND bookings.status = 'active';
  `;

  for (const b of bookings) {
    const message = `Your parking at ${b.name} is ending in 15 minutes (at ${b.etime}).`;
    const userSocketId = connectedUsers.get(b.customer_id);
    if (userSocketId) {
      io.to(userSocketId).emit('booking-end-reminder', {
        message,
      });

      await sql`
        INSERT INTO notifications (users_id, message, created_at, status)
        VALUES (${b.customer_id}, ${message}, ${now}, 'read')
      `;
      console.log(`End reminder sent to user ${b.customer_id}`);
    } else {
      await sql`
        INSERT INTO notifications (users_id, message, created_at, status)
        VALUES (${b.customer_id}, ${message}, ${now}, 'unread')
      `;
      console.log(`User ${b.customer_id} not connected, end notification saved`);
    }
  }
});

cron.schedule('* * * * *', async () => {
  
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const targetTime = now.toTimeString().split(' ')[0];
  const bookings = await sql`
    SELECT bookings.*, parkingspot.name FROM bookings
    INNER JOIN parkingspot ON bookings.slot_id = parkingspot.id
    WHERE bookings.date = ${today} AND bookings.eTime = ${targetTime} AND bookings.status = 'active';
  `;
  
  for (const b of bookings) {
    const userSocketId = connectedUsers.get(b.customer_id);
    if (userSocketId) {
      io.to(userSocketId).emit('booking-ended', {
        message: `Your parking at ${b.name} has ended`,
      });
      await sql`
        INSERT INTO notifications (users_id, message, created_at, status)
        VALUES (${b.customer_id}, ${`Your parking at ${b.name} has ended`}, ${now}, 'read')
      `;
      console.log(`Reminder sent to user ${b.customer_id}`);
    } else {
      await sql`
        INSERT INTO notifications (users_id, message, created_at, status)
        VALUES (${b.customer_id}, ${`Your parking at ${b.name} has ended.`}, ${now}, 'unread')
      `;
      console.log(`User ${b.customer_id} not connected, notification saved`);
    }
  }
});

