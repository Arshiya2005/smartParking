import { sql } from "../config/db.js";
import { razorpay } from "../server.js"
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { console } from "inspector";

dotenv.config();

export const createOrder = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const { amount } = req.body;
        console.log("amount :"+ amount);
        const options = {
            amount: amount * 100,
            currency: 'INR',              
            receipt: `parking_${Date.now()}`
        };
        console.log(options);
        const order = await razorpay.orders.create(options);
        return res.status(200).json({ data: order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
    res.status(500).send("Internal server error");
    }
};


export const verifyPayment = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        console.log(req.body);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, id, amount } = req.body;
        
        const secret = process.env.KEY_SECRET;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256", secret).update(body.toString()).digest("hex");
        const isValid = expectedSignature === razorpay_signature;

        const newStatus = isValid ? 'active' : 'failed';

        await sql`
        UPDATE bookings SET 
            status = ${newStatus},
            payment_id = ${razorpay_payment_id},
            order_id = ${razorpay_order_id},
            amount = ${amount}
        WHERE id = ${id};
        `;
        
        if (isValid) {
            console.log("Payment verification successful");
            await sql`
                INSERT INTO pending_payouts ( amount, status, created_at, owner_id ) 
                VALUES ( ${amount}, ${'pending'}, ${new Date()}, ${req.user.id});
            `;
            return res.status(200).json({ message: 'Payment verification successful' });
        } else {
            console.log("Payment verification failed");
            return res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};


export const createFundAcc = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const razorpayAuth = Buffer.from(`${process.env.KEY_ID}:${process.env.KEY_SECRET}`).toString('base64');
        const { contact, bank_account } = req.body;
        const name = req.user.fname + " " + req.user.lname;
        const email = req.user.username;
        const contactResponse = await axios.post('https://api.razorpay.com/v1/contacts', 
            {name, email, contact, type : "owner",  },
            {
                headers: {
                Authorization: `Basic ${razorpayAuth}`,
                'Content-Type': 'application/json'
                }
            }
        );
        const contact_id = contactResponse.data.id;
        console.log("contact_id : " + contact_id);
        const fundAccountResponse = await axios.post('https://api.razorpay.com/v1/fund_accounts',
            {
                contact_id,
                account_type: 'bank_account',
                bank_account: {
                    name: bank_account.name,
                    ifsc: bank_account.ifsc,
                    account_number: bank_account.account_number
                }
            },
            {
                headers: {
                    Authorization: `Basic ${razorpayAuth}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const fund_account_id = fundAccountResponse.data.id;
        await sql`
        INSERT INTO payout_accounts ( owner_id, contact_id, fund_account_id , created_at) 
            VALUES ( ${req.user.id}, ${contact_id}, ${fund_account_id}, ${new Date()});
        `;
        return res.status(200).json({ data: order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
    res.status(500).send("Internal server error");
    }
};
