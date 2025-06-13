import express from "express";
import helmet from "helmet";//Helps secure your Express app by setting various HTTP headers.
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import session from "express-session"
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import { v4 as uuidv4 } from 'uuid';

import customerRoutes from "./routes/customerRoutes.js"; 
import authRoutes from "./routes/authRoutes.js"; 
import { sql } from "./config/db.js";
import { aj  } from "./lib/arcjet.js";

import { verify, verifyusingGoogle } from "./controllers/authController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: "http://localhost:5173", // Allow requests from your frontend
  credentials: true                // Allow cookies/session to be included
}));//Enables Cross-Origin Resource Sharing so your frontend can call your backend
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());app.use(helmet());
app.use(morgan("dev")); // logs requests

app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // specifies that each request consumes 1 token
    });

    if (decision.isDenied()) {
        
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot access denied" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }
    // check for spoofed bots (pretend to be like browsers or users)
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: "Spoofed bot detected" });
      return;
    }
    next();
  } catch (error) {
    console.log("Arcjet error", error);
    next(error);
  }
});

app.use(session({
  secret : process.env.SESSION_SECRET,
  resave : false,//this will store 'session' locally not on db(if stored on db then can retrieve even when we restart server)
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

//this should come only after session
app.use(passport.initialize());
app.use(passport.session());


app.use("/customer", customerRoutes);

app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to home page !!")
})
//passReqToCallback: true ensures that req is passed as the first parameter to your verify function.
passport.use("local", new Strategy({ 
    usernameField: 'username', 
    passwordField: 'password', 
    passReqToCallback: true 
  }, 
  verify));


passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5173/",//this should go to homepage react after succesful login
    passReqToCallback: true
  },
  verifyusingGoogle));

passport.serializeUser((user, cb) => {
  const safeUser = {
    id: user.id,
    fname: user.fname,
    lname: user.lname,
    username: user.username,
    type: user.type,
  };
  cb(null, { user: safeUser });
});

passport.deserializeUser((wrapped, cb) => {
  cb(null, wrapped.user);
});

async function initDb() {
    try {
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
        
        await sql`
            CREATE TABLE IF NOT EXISTS customer (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                fname TEXT NOT NULL, 
                lname TEXT NOT NULL, 
                username VARCHAR(255) NOT NULL UNIQUE,   
                password TEXT NOT NULL,  
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS owner (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                fname TEXT NOT NULL, 
                lname TEXT NOT NULL, 
                username VARCHAR(255) NOT NULL UNIQUE,   
                password TEXT NOT NULL,           
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `;

        await sql`
          CREATE TABLE IF NOT EXISTS vehicle (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              model TEXT NOT NULL,
              type TEXT NOT NULL,
              number TEXT NOT NULL UNIQUE,
              customer_id UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE
          );

        `;

        await sql`
          CREATE TABLE IF NOT EXISTS parkingspot (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name TEXT NOT NULL,
              lon DOUBLE PRECISION NOT NULL,
              lat DOUBLE PRECISION NOT NULL,
              bike INTEGER DEFAULT 0,      
              car INTEGER DEFAULT 0,       
              owner_id UUID NOT NULL,
              FOREIGN KEY (owner_id) REFERENCES owner(id)
          );
        `;

        await sql`
          CREATE TABLE IF NOT EXISTS bookings (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              type TEXT NOT NULL,
              sTime TIME NOT NULL,
              eTime TIME NOT NULL,
              date DATE NOT NULL DEFAULT CURRENT_DATE,
              slot_no INTEGER NOT NULL,
              customer_id UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
              owner_id UUID NOT NULL REFERENCES owner(id) ON DELETE CASCADE,
              vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
              slot_id UUID NOT NULL REFERENCES parkingspot(id) ON DELETE CASCADE
          );

        `;

        console.log("Database initiated successfully");
    } catch (error) {
        console.log("Error initDb", error);
    }
}
/**
 * 
 * INSERT INTO parkingspot (name, lon, lat, bike, car, owner_id) VALUES 
('Shivaji Nagar Parking',      76.0725624, 18.0223068, 5, 3, '<OWNER_UUID>'),
('FC Road Parking',            73.8412187, 18.5220938, 6, 2, '<OWNER_UUID>'),
('JM Road Parking',            73.8450956, 18.5191235, 4, 4, '<OWNER_UUID>'),
('Kothrud Stand Parking',      73.8134605, 18.4998613, 8, 5, '<OWNER_UUID>'),
('Viman Nagar Parking Lot',    73.9133336, 18.5703877, 10, 6, '<OWNER_UUID>'),
('Baner High Street Parking',  73.7697351, 18.5666887, 5, 3, '<OWNER_UUID>'),
('Palus Parking',    74.4515545, 17.0955099, 7, 4, '<OWNER_UUID>'),
('khatav Parking', 74.4017634, 17.6370491, 6, 5, '<OWNER_UUID>'),
 */
initDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server is running of " + PORT)
        }) 
    })
    .catch(() => {
        console.log("Server not started !")
    })
