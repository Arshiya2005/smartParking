import passport from "passport";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { sql } from "../config/db.js";
import {createRazorpayFundAccount} from "./paymentController.js"

dotenv.config();

export const register = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const type = req.body.type;
    const fname = req.body.firstName;
    const lname = req.body.lastName;
    const today = new Date();
    
    if(type === "admin" && process.env.ADMIN_SECRET != req.body.secret) {
      return res.status(401).json({ error: "Unauthorised" });
    }
    
    const contact = type == "owner" ? req.body.contact : "NA";
    try {
      const checkResult = await sql`
          SELECT * FROM users WHERE username = ${username} AND type = ${type}
      `;
      if (checkResult.length > 0) {
          console.log("Username already exist !! Try again.")
          return res.status(409).json({ error: "User already exists" });
      } else {
        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds); 
        const data = await sql`
          INSERT INTO users ( fname, lname, username, password, contact,  type, created_at) VALUES ( ${fname}, ${lname}, ${username}, ${hash}, ${contact}, ${type}, ${today})
          RETURNING *
        `;

        if(type == "owner") {
          const {contact, bank_account} = req.body;
          await createRazorpayFundAccount(data[0], bank_account);
        }

        return res.status(200).json({ message: "User registered successfully" });
      }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const logout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
};

export const login = async (req, res, next) =>  {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
          return res.status(401).json({ error: "user doesn't exist !!" });
        }
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        req.logIn(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({ status: true, type : user.type});
        });
  })(req, res, next);
}

//this is when u click on contionue with google
export const gauth = async (req, res, next) => {
    const { type } = req.query;
    if (type) {
        req.session.type = type; 
    }
    passport.authenticate('google', { scope: ["profile", "email"] })(req, res, next);
}


export const ensureAuthenticated = async (req, res) => {
  if (req.isAuthenticated()) {
    const { username, fname, lname, type } = req.user;
    return res.status(200).json({ username, fname, lname, type });
  }
  return res.status(401).json({ error: "Unauthorized: Please log in" });
};

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    return next(); // user is logged in
  }
  return res.status(401).json({ error: "Unauthorized(from middleware): Please log in" });
};


export async function verify(req, username, password, done) {
    const type = req.body.type;
    try {
      const result = await sql`
          SELECT * FROM users WHERE username = ${username} AND type = ${type}
      `;
      if (result.length > 0) {
        const user = result[0];
        const hash = user.password;
        bcrypt.compare(password, hash, async (err, res) => {
            if(err) {
              console.log(err.message);
              return done(err);
            }else {
              if(res) {
                  return done(null, user);
              }else {
                  return done("User Doesn't exist !! ", false, { message: "Incorrect password" });
              }
              
            }
        })
      } else {
        
          return done("User Doesn't exist !! ", false);
      }
    } catch (err) {
        return done(err);
    }
};

/**
 * You're using req.session.type to remember if the Google login is for a "customer" or "owner", 
 * before the actual account is created. Then after login, you can access the logged-in user via req.user.
 */
export async function verifyusingGoogle(req, accessToken, refreshToken, profile, done) {
  try {
    const userType = req.session?.type || "customer";
    const result = await sql`
      SELECT * FROM users WHERE username = ${profile.email} AND type = ${userType};
    `;
    if (result.length === 0) {
      const today = new Date();
      const newUser = await sql`
          INSERT INTO users (username, password, type, created_at) VALUES (${profile.email}, 'google', ${userType}, ${today}) RETURNING *
        `;
      return done(null, newUser[0]);
    }else {
      return done(null, result[0]);
    }
  } catch (err) {
    return done(err);
  }
}
