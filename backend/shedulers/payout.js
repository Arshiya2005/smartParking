import cron from 'node-cron';
import axios from "axios";
import { sql } from '../config/db.js';
import { io } from '../server.js';
import { connectedUsers } from '../sockets/socket.js';

cron.schedule('* * * * *', async () => {
  try {
    const now = new Date().toTimeString().split(' ')[0]; 
    console.log(now);
    const bookings = await sql`
      UPDATE bookings
      SET status = 'inactive'
      WHERE eTime < ${now} AND status = 'active'
      RETURNING *
    `;
    const account_number = "2323230000000001";
    for(const b of bookings) {
      const response = await sql`
          SELECT * FROM pending_payouts 
          INNER JOIN payout_accounts 
          ON pending_payouts.owner_id = payout_accounts.owner_id
          WHERE pending_payouts.booking_id = ${b.id} AND pending_payouts.status = 'pending';
      `;
      const p = response[0];
      console.log("pending payout : ");
      console.log(p);
      if(p) {
        const amount = p.amount;
        const fund_account_id = p.fund_account_id;
        try {
              await axios.post('https://api.razorpay.com/v1/payouts',
                  {
                      account_number,
                      fund_account_id,
                      amount,
                      currency: "INR",
                      mode: "IMPS",
                      purpose: "payout",
                      reference_id: `payout_${p.booking_id}`,
                      queue_if_low_balance: true,
                      narration: "SmartParking: Slot Rent"
                  },
                  {
                      auth: {
                      username: process.env.KEY_ID,
                      password: process.env.KEY_SECRET
                      },
                      headers: {
                      'Content-Type': 'application/json',
                      'X-Payout-Idempotency': crypto.randomUUID()
                      }
                  }
              );
              await sql`
                  UPDATE pending_payouts SET status = 'completed', processed_at = ${new Date()}
                  WHERE booking_id = ${p.booking_id};
              `;
              try {
                await paymentSuccessful(p.owner_id, amount);
              } catch (error) {
                console.error(`Failed to send payment notification to user ${p.owner_id}:`, error);
              }
            }catch(error) {
                console.log(p.booking_id + " : payout failed");
                if (error.response) {
                  console.error("Razorpay Error Response:", error.response.data);
                } else {
                  console.error("Payout Error:", error.message);
                }
                await sql`
                    UPDATE pending_payouts SET status = 'failed', processed_at = ${new Date()}
                    WHERE booking_id = ${p.booking_id};
                `;
            }
      }
    }
  } catch (error) {
    console.error("Razorpay Payout Error:", error.response?.data || error.message);
  }
});

export const paymentSuccessful = async (id, amount) => {
  try {
    const userSocketId = connectedUsers.get(id);
    const now = new Date();
    const message = `Payment Successful of ₹${(amount / 100).toFixed(2)}`;

    if (userSocketId) {
      io.to(userSocketId).emit('parking-payment', { message });
      await sql`
        INSERT INTO notifications (users_id, message, created_at, status)
        VALUES (${id}, ${message}, ${now}, 'read')
      `;
      console.log(`Payment notification sent to user ${id}`);
    } else {
      await sql`
        INSERT INTO notifications (users_id, message, created_at, status)
        VALUES (${id}, ${message}, ${now}, 'unread')
      `;
      console.log(`User ${id} not connected, notification saved`);
    }
  } catch (error) {
    throw error;
  }
};
