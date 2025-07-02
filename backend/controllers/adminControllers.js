import { sql } from "../config/db.js";

export const welcome = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const cust = await sql`
            SELECT * FROM users WHERE type = ${"customer"};
        `;
        const custCount = cust.length;
        const own = await sql`
            SELECT * FROM users WHERE type = ${"owner"};
        `;
        const ownCount = own.length;
        const book = await sql`
            SELECT * FROM bookings WHERE status != 'cancelled';
        `;
        const bookCount = book.length;
        const area = await sql`
            SELECT * FROM parkingspot WHERE is_active = true;
        `;
        let bikeSlots = 0;
        let carSlots = 0;
        for(const a of area) {
            bikeSlots = bikeSlots + a.bike;
            carSlots = carSlots + a.car;
        }
        return res.status(200).json({ custCount, ownCount, bookCount, bikeSlots, carSlots });
    } catch (error) {
        console.error("Error fetching counts in welcome:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const info = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        return res.status(200).json({ data: req.user });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const adminList = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const admins = await sql`
             SELECT * FROM users WHERE type = ${"admin"};
        `;
        return res.status(200).json({ data: admins });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const ownerInfo = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const own = await sql`
            SELECT * FROM users WHERE type = ${"owner"};
        `;
        return res.status(200).json({ data : own });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const ownerAreas = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const area = await sql`
            SELECT * FROM parkingspot WHERE owner_id = ${id};
        `;
        return res.status(200).json({ data : area });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const areaActiveBookings = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const response = await sql`
            SELECT * FROM bookings WHERE slot_id = ${id} AND date = ${today} AND status = 'active' ORDER BY sTime DESC
        `;
        if (response.length > 0) {
            return res.status(200).json({ data : response});
        }
        return res.status(200).json({ message: "No bookings" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const areaBookingHistory = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const response = await sql`
            SELECT * FROM bookings WHERE slot_id = ${id} ORDER BY date DESC, sTime DESC
        `;
        if (response.length > 0) {
            return res.status(200).json({ data : response});
        }
        return res.status(200).json({ message: "No bookings" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const customerInfo = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const cust = await sql`
            SELECT * FROM users WHERE type = ${"customer"};
        `;
        return res.status(200).json({ data : cust });
    } catch (error) {
        console.error("Error :", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const customerVehicles = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const vehicles = await sql`
            SELECT * FROM vehicle WHERE customer_id = ${id};
        `;
        return res.status(200).json({ data : vehicles });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const customerActiveBooking = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const response = await sql`
            SELECT * FROM bookings WHERE customer_id = ${id} AND date = ${today} AND status = 'active' ORDER BY sTime DESC
        `;
        if (response.length > 0) {
            return res.status(200).json({ data : response});
        }
        return res.status(200).json({ message: "No bookings" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const customerBookingHistory = async (req, res) => {
    try {
        if(req.user.type !== "admin") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        const response = await sql`
            SELECT * FROM bookings WHERE customer_id = ${id} ORDER BY date DESC, sTime DESC
        `;
        if (response.length > 0) {
            return res.status(200).json({ data : response});
        }
        return res.status(200).json({ message: "No bookings" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};