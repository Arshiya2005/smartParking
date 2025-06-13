import axios from "axios";
import dotenv from "dotenv";
import { sql } from "../config/db.js";

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
            SELECT * FROM vehicle WHERE customer_id = ${id}
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
        const name = req.body.name;
        const no = req.body.no;
        const type = req.body.type;
        const id = req.user.id;

        await sql`
            INSERT INTO vehicle (model, type, number, customer_id) VALUES (${name}, ${type}, ${no}, ${id})
        `;
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
            DELETE FROM vehicle 
            WHERE id = ${id} AND customer_id = ${userId}
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
        const id = req.user.id;
        await sql`
            UPDATE customer
            SET fname = ${fname}
            WHERE id = ${id}
        `;
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
            SET fname = ${lname}
            WHERE id = ${id}
        `;
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
            lat = data[0].lat;
            lon = data[0].lon;
        } else {
            return res.status(404).json({message: "Location not found"});
        }
    }else {
        lat = req.body.lat;
        lon = req.body.lon;
    }

    if (!lat || !lon) {
        return res.status(400).json({ error: "Missing location coordinates" });
    }

    const allSpots = await sql`SELECT id, name, lat, lon, bike, car FROM parkingspot`;

    const results = [];

    for (const spot of allSpots) {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${process.env.ORS_API_KEY}&start=${lon},${lat}&end=${spot.lon},${spot.lat}`;

      const response = await axios.get(url, {
        headers: {
          "Accept": "application/json",
        },
      });
      console.log("from search nearby : ");
      console.log(response.data.routes[0].summary);
      const distance = response.data.routes[0].summary.distance; 
      const duration = response.data.routes[0].summary.duration;
      if((Vtype === "bike" && spot.bike !== 0) || (Vtype === "car" && spot.car !== 0)) {
        results.push({
            id: spot.id,
            name: spot.name,
            lat: spot.lat,
            lon: spot.lon,
            distance,
            duration,
        });
      }
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
        const id = req.body.id;
        const sTime = req.body.sTime;
        const eTime = req.body.eTime;

        await sql`
            UPDATE customer
            SET fname = ${lname}
            WHERE id = ${id}
        `;
        return res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: "internal server error" });
    }
};
