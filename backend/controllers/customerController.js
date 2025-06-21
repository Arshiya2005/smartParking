import axios from "axios";
import dotenv from "dotenv";
import { sql } from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

export const welcome = async (req, res) => {
    try {
        if(req.user.type === "customer") {
            return res.status(200).json({ data: req.user });
        }else {
            return res.status(401).json({ error: "no active user" });
        }
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const myVehicles = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.user.id;
        const result = await sql`
            SELECT * FROM vehicle WHERE customer_id = ${id} AND is_active = TRUE
        `;
        console.log(result);
        return res.status(200).json({ data: result });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const addVehicle = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        console.log(req.body);
        const name = req.body.name;
        const no = req.body.no.replace(/\s+/g, "").toUpperCase();
        const type = req.body.type;
        const id = req.user.id;
        const response = await sql`
            SELECT * FROM vehicle WHERE number = ${no};
        `;
        if(response.length > 0) {
            const data = response[0];
            if(data.is_active) {
                return res.status(409).json({ message: "Vehicle Already exists" });
            }else {
                await sql`
                    UPDATE vehicle SET is_active = true, model = ${name}, customer_id = ${id} WHERE id = ${data.id};
                `;
            }
        }else {
            await sql`
                INSERT INTO vehicle (model, type, number, customer_id) VALUES (${name}, ${type}, ${no}, ${id})
            `;
        }
        return res.status(200).json({ message: "Vehicle added successfully" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};


export const deleteVehicle = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.body.id;
        const userId = req.user.id;

        await sql`
            UPDATE vehicle SET is_active = FALSE  WHERE id = ${id} AND customer_id = ${userId};
        `;
        return res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

//info, editFname, editLname

export const info = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        return res.status(200).json({ data: req.user });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const editFname = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
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
        if(req.user.type !== "customer") {
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


export const searchNearby = async (req, res) => {
  try {
    if (req.user.type !== "customer") {
      return res.status(401).json({ error: "No active user" });
    }
    const location = req.body.location;
    var lat;
    var lon;
    const Vid = req.body.id;
    const Vtype = req.body.type;
    if(location) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${location}`;
        const response = await axios.get(url, {
        headers: {
            "User-Agent": "SmartParkingApp"
        }
        });
        const data = response.data;
        if (data.length > 0) {
            lat = parseFloat(data[0].lat);
            lon = parseFloat(data[0].lon);            
        } else {
            return res.status(404).json({message: "Location not found"});
        }
    }else {
        lat = parseFloat(req.body.lat);
        lon = parseFloat(req.body.lon);
    }

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ error: "Missing or invalid coordinates" });
    }

    let allSpots = [];
    let radiusInKm = 2;
    let attemptLimit = 4;
    do {
        allSpots = await sql`
        SELECT id, name, lat, lon, bike, car
        FROM parkingspot
        WHERE
            6371 * acos(
            cos(radians(${lat}))
            * cos(radians(lat))
            * cos(radians(lon) - radians(${lon}))
            + sin(radians(${lat})) * sin(radians(lat))
            ) < ${radiusInKm};
        `;
        radiusInKm += 1;
        attemptLimit--;
    } while(allSpots.length < 5&& attemptLimit > 0);
    const results = [];

    for (const spot of allSpots) {
        if ((Vtype === "bike" && spot.bike === 0) || (Vtype === "car" && spot.car === 0)) {
            continue;
        }
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.ORS_API_KEY}&start=${lon},${lat}&end=${spot.lon},${spot.lat}`;
      const response = await axios.get(url);
      const features = response.data.features;
      const summary = features[0].properties.segments[0];
      const distance = summary.distance; 
      const duration = summary.duration;
      results.push({
            id: spot.id,
            name: spot.name,
            lat: spot.lat,
            lon: spot.lon,
            distance,
            duration,
            Vid
        });
    }
    results.sort((a, b) => a.distance - b.distance);
    return res.status(200).json({ userloc : {lon ,lat }, data: results.slice(0, 5) });
  } catch (error) {
    console.error("Error in searchNearby:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const chooseSlot = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const spot = req.body.spot;
        const id = spot.id;
        const Vid = spot.Vid;
        const sTime = req.body.sTime;
        const eTime = req.body.eTime;
/**
        const spotdata = await sql`
            SELECT * FROM parkingspot where id = ${id}
        `;
        const owner = await sql`
            SELECT * FROM owner where id = ${spotdata[0].owner_id}
        `;
 */
        const spotdata = await sql`
            SELECT 
                p.*,  
                o.id AS owner_id,
                o.fname, o.lname, o.username
            FROM parkingspot p
            INNER JOIN owner o ON p.owner_id = o.id
            WHERE p.id = ${id};
        `;
        const ownerdata = {
            id : spotdata[0].owner_id,
            fname : spotdata[0].fname,
            lname : spotdata[0].lname,
            username : spotdata[0].username
        }
        console.log(spotdata);
        const vehicle = await sql`
            SELECT * FROM vehicle where id = ${Vid}
        `;
        const type = vehicle[0].type;
        
        const count = type === "bike" ? spotdata[0].bike : spotdata[0].car;
        const today = new Date().toISOString().slice(0, 10);
        for(var i = 1; i <= count; i++) {
            const response = await sql`
                SELECT * FROM bookings
                WHERE date = ${today} AND slot_id = ${id} AND slot_no = ${i} AND NOT (${eTime} <= sTime OR ${sTime} >= eTime ) AND status = ${'active'};
            `;
            if (response.length === 0) {
                return res.status(200).json({ user : req.user, slot : spotdata[0], vehicle, chosenSlotNo: i, ownerdata });
            }
        }
        return res.status(409).json({ message: "slot not available" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const activeBooking = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.user.id;
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        const time = now.toTimeString().split(' ')[0];
        const response = await sql`
            SELECT * FROM bookings
                WHERE date = ${today} AND customer_id = ${id} AND ${time} < eTime AND status = ${'active'};
            `;
        const spotdata = await sql`
            SELECT * FROM parkingspot where id = ${response[0].id}
        `;
        if (response.length > 0) {
            console.log("reached here ");
            console.log(response);
            return res.status(200).json({ data : response  , spot : spotdata[0]});
        }
        console.log("no data available !");
        return res.status(200).json({ message: "No active booking at this time" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const Specificbooking = async (req, res) => {
    try {
      if (req.user.type !== "customer") {
        return res.status(401).json({ error: "no active user" });
      }
  
      const book = JSON.parse(decodeURIComponent(req.query.book)); // ✅ safely parse
      console.log(book.date);
      const spotdata = await sql`
        SELECT * FROM parkingspot where id = ${book.slot_id}
      `;
      const vehicle = await sql`
        SELECT * FROM vehicle where id = ${book.vehicle_id}
      `;
      const owner = await sql`
        SELECT * FROM owner where id = ${book.owner_id}
      `;
  
      return res.status(200).json({
        book,
        spot: spotdata[0],
        vehicle: vehicle[0],
        owner: owner[0],
      });
    } catch (error) {
      console.error("Specificbooking error:", error);
      return res.status(500).json({ error: "internal server error" });
    }
  };

export const addbooking = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const now = new Date();
        const today = now.toISOString().slice(0, 10);
        console.log(today);
        const {slot, vehicle, chosenSlotNo, owner} = req.body;
        await sql`
            INSERT INTO bookings (
                type, sTime, eTime, date, slot_no,
                customer_id, owner_id, vehicle_id, slot_id
            ) VALUES (
                ${vehicle.type}, ${slot.sTime}, ${slot.eTime}, ${today}, ${chosenSlotNo},
                ${req.user.id}, ${owner.id}, ${vehicle.id}, ${slot.id}
            )
        `;
        return res.status(200).json({message : "booked successfully"});
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const bookingHistory = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.user.id;
        const response = await sql`
            SELECT * FROM bookings WHERE customer_id = ${id};
            `;
        const spotdata = await sql`
            SELECT * FROM parkingspot where id = ${response[0].id}
        `;
        if (response.length > 0) {
            return res.status(200).json({ data : response  , spot : spotdata});
        }
        return res.status(200).json({ message: "No bookings" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        if(req.user.type !== "customer") {
            return res.status(401).json({ error: "no active user" });
        }
        const id = req.query.id;
        await sql`
            UPDATE bookings
            SET status = 'cancelled'
            WHERE id = ${id}
        `;
        return res.status(200).json({ message: "booking cancelled successfully !" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};