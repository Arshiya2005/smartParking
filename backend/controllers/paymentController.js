import { sql } from "../config/db.js";
import { razorpay } from "../server.js"


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
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, id } = req.body;
        const secret = process.env.KEY_SECRET;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto.createHmac("sha256", secret).update(body.toString()).digest("hex");
        const isValid = expectedSignature === razorpay_signature;
        
        if (isValid) {
            console.log("Payment verification successful");
            return res.status(200).json({ message: 'Payment verification successful' });
        } else {
            console.log("Payment verification failed");
            await sql`
                UPDATE bookings SET status = 'failed'
                WHERE status = 'active' AND id = ${id}
            `;
            return res.status(400).json({ message: 'Payment verification failed' });
        }
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};
