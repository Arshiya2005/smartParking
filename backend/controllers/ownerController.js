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
            UPDATE owner
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
            UPDATE owner
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
        const existing = await sql`
            SELECT * FROM parkingspot WHERE lat = ${lat} AND lon = ${lon};
        `;
        if (existing.length > 0) {
            const spot = existing[0];
            if (spot.is_active === false && spot.owner_id == req.user.id) {
                await sql`
                    UPDATE parkingspot 
                    SET is_active = TRUE, name = ${name}, bike = ${bike}, car = ${car}
                    WHERE id = ${spot.id};
                `;
                return res.status(200).json({ message: "Parking area reactivated successfully" });
            } else {
                return res.status(409).json({ error: "Parking area already exists" });
            }
        }
        await sql`
            INSERT INTO parkingspot (name, lon, lat, bike, car, owner_id) VALUES (${name}, ${lon}, ${lat}, ${bike}, ${car}, ${req.user.id})
        `;
        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        console.error("addArea error:", error);
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


export const Specificbooking = async (req, res) => {
    try {
      if (req.user.type !== "owner") {
        return res.status(401).json({ error: "no active user" });
      }
  
      const book = JSON.parse(decodeURIComponent(req.query.book)); // ✅ safely parse
      const vehicle = await sql`
        SELECT * FROM vehicle where id = ${book.vehicle_id}
      `;
      const spotdata = await sql`
            SELECT 
                p.*,  
                o.id AS owner_id,
                o.fname, o.lname, o.username
            FROM parkingspot p
            INNER JOIN owner o ON p.owner_id = o.id
            WHERE p.id = ${book.slot_id};
        `;
        const ownerdata = {
            id : spotdata[0].owner_id,
            fname : spotdata[0].fname,
            lname : spotdata[0].lname,
            username : spotdata[0].username
        }
      return res.status(200).json({
        book,
        spot: spotdata[0],
        vehicle: vehicle[0],
        owner: ownerdata,
      });
    } catch (error) {
      console.error("Specificbooking error:", error);
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

export const chnageSlotCount = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const now = new Date();
        const {bike, car, area} = req.body;
        await sql`
            INSERT INTO scheduled_task (spot_id, bike, car, created_at)
            VALUES (${area.id}, ${bike}, ${car}, ${now});
        `;
        return res.status(200).json({ message : "request is sent. slots will be be updated by tomorrow"});
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};


export const deleteArea = async (req, res) => {
    try {
        if(req.user.type !== "owner") {
            return res.status(401).json({ error: "no active user" });
        }
        const now = new Date();
        const area = req.body.area;
        await sql`
            INSERT INTO scheduled_task (spot_id, created_at) VALUES (${area.id}, ${now})
        `;
        return res.status(200).json({ message : "request is sent. Area will be be deleted by tomorrow" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};