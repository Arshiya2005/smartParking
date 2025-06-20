import axios from "axios";
import dotenv from "dotenv";
import { sql } from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

export const welcome = async (req, res) => {
    try {
        if(req.user.type === "owner") {
            return res.status(200).json({ data: req.user });
        }else {
            return res.status(401).json({ error: "no active user" });
        }
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const info = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        return res.status(200).json({ data: req.user });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const editFname = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const fname = req.body.fname;
        console.log(fname);
        const id = req.user.id;
        await sql`
            UPDATE customer
            SET fname = ${fname}
            WHERE id = ${id}
        `;
        req.user.fname = fname;
        console.log(req.user);
        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const editLname = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const lname = req.body.lname;
        const id = req.user.id;
        await sql`
            UPDATE customer
            SET lname = ${lname}
            WHERE id = ${id}
        `;
        req.user.lname = lname;
        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const addArea = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const {lon, lat, bike, car, name} = req.body;
        await sql`
            INSERT INTO parkingspot (name, lon, lat, bike, car, owner_id) VALUES (${name}, ${lon}, ${lat}, ${bike}, ${car}, ${req.user.id})
        `;
        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const parkingAreas = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.user.id;
        const response = await sql`
            SELECT * FROM parkingspot WHERE owner_id = ${id}
        `;
        return res.status(200).json({ data : response });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};


export const availableSlot = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const area = JSON.parse(decodeURIComponent(req.query.area)); // ✅ safely parse
        const bike = area.bike;
        const car = area.car;
        const id = area.id;
        var occBike = 0;
        var occCar = 0;
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const time = now.toTimeString().split(' ')[0];
        for(var i = 0; i < bike; i++) {
            const response = await sql`
                SELECT * FROM bookings WHERE slot_id = ${id} AND date = ${today} AND sTime <= ${time} AND eTime >= ${time} AND type = ${'bike'} AND slot_no = ${i} AND status = 'active';
            `;
            if(response.length > 0) {
                occBike++;
            }
        }
        for(var i = 0; i < car; i++) {
            const response = await sql`
                SELECT * FROM bookings WHERE slot_id = ${id} AND date = ${today} AND sTime <= ${time} AND eTime >= ${time} AND type = ${'car'} AND slot_no = ${i} AND status = 'active';
            `;
            if(response.length > 0) {
                occCar++;
            }
        }
        return res.status(200).json({ bikedata : {occ : occBike, bike}, cardata : {occ : occCar, car}});
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};


export const activeBookingInArea = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const area = JSON.parse(decodeURIComponent(req.query.area)); // ✅ safely parse
        const response = await sql`
            SELECT * FROM bookings WHERE slot_id = ${area.id} AND date = ${today} AND status = 'active' ORDER BY sTime ASC

        `;
        return res.status(200).json({ data : response });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const bookingHistoryInArea = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const area = JSON.parse(decodeURIComponent(req.query.area)); // ✅ safely parse
        const response = await sql`
            SELECT * FROM bookings WHERE slot_id = ${area.id} ORDER BY date ASC, sTime ASC

        `;
        return res.status(200).json({ data : response });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};
