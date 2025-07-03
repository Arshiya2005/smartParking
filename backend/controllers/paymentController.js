import { sql } from "../config/db.js";
import { razorpay } from "../server.js"
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

export const createOrder = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const { amount } = req.body;
        const options = {
            amount: amount * 100,
            currency: 'INR',              
            receipt: `parking_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        console.log("created order successfully!")
        return res.status(200).json({ data: order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
    res.status(500).send("Internal server error");
    }
};


export const verifyPayment = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            console.log("authentication failed!");
            return res.status(401).json({ error: "no active user" });
        }
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, id, amount } = req.body;
        
        const secret = process.env.KEY_SECRET;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256", secret).update(body.toString()).digest("hex");
        const isValid = expectedSignature === razorpay_signature;
        const newStatus = isValid ? 'active' : 'failed';

        const data = await sql`
            UPDATE bookings SET 
                status = ${newStatus},
                payment_id = ${razorpay_payment_id},
                order_id = ${razorpay_order_id},
                amount = ${amount}
            WHERE id = ${id}
            RETURNING *;
            `;
        if (isValid) {
            await sql`
                INSERT INTO pending_payouts (booking_id, amount, status, created_at, owner_id ) 
                VALUES ( ${id}, ${amount * 0.9}, ${'pending'}, ${new Date()}, ${data[0].owner_id});
            `;
            return res.status(200).json({ message: 'Payment verification successful' });
        } else {
            return res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "internal server error" });
    }
};



export const createRazorpayFundAccount = async (user, bank_account) => {
    if (user.type !== "owner") {
        throw new Error("Unauthorized: User is not an owner");
    }
    const razorpayAuth = Buffer.from(`${process.env.KEY_ID}:${process.env.KEY_SECRET}`).toString('base64');
    const name = user.fname + " " + user.lname;
    const email = user.username;
    const contact = user.contact;
    
    try {
        const contactResponse = await axios.post(
            'https://api.razorpay.com/v1/contacts',
            { name, email, contact, type: "vendor" },
            {
                headers: {
                    Authorization: `Basic ${razorpayAuth}`,
                    'Content-Type': 'application/json',
                }
            }
        );
        const contact_id = contactResponse.data.id;

        const fundAccountResponse = await axios.post(
            'https://api.razorpay.com/v1/fund_accounts',
            {
                contact_id,
                account_type: 'bank_account',
                bank_account: {
                    name: bank_account.name,
                    ifsc: bank_account.ifsc,
                    account_number: bank_account.account_number,
                },
            },
            {
                headers: {
                    Authorization: `Basic ${razorpayAuth}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        const fund_account_id = fundAccountResponse.data.id;
        
        await sql`
            INSERT INTO payout_accounts ( owner_id, contact_id, fund_account_id, created_at ) 
            VALUES ( ${user.id}, ${contact_id}, ${fund_account_id}, ${new Date()});
        `;

        return { contact_id, fund_account_id };
    } catch (error) {
        console.error("Razorpay Contact Error:", error.response?.data || error.message);
        throw error;
    }
    
};
