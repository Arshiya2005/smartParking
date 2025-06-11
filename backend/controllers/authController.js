import passport from "passport";
import bcrypt from "bcrypt";

import { sql } from "../config/db.js";

export const register = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const type = req.body.type;

    const validTypes = ["customer", "owner"];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid user type" });
    }

    try {
        const checkResult = await sql`
                SELECT * FROM ${sql(type)} WHERE username = ${username}
            `;
        if (checkResult.length > 0) {
            console.log("Username already exist !! Try again.")
            return res.status(409).json({ error: "User already exists" });
        } else {
            const saltRounds = 10;
            /*
            bcrypt.hash(password, saltround, async (err, hash) => {
                if(err) {
                    console.log(err.message);
                }else {
                    console.log(hash)
                    await sql`
                        INSERT INTO ${sql(type)} (username, hash) VALUES (${username}, ${hash})
                    `;
                }
            })*/
            const hash = await bcrypt.hash(password, saltRounds); 
            await sql`
                INSERT INTO ${sql(type)} (username, password) VALUES (${username}, ${hash})
            `;
            return res.status(201).json({ message: "User registered successfully" });
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
    //go to landing page
  });
};

export const login = async (req, res) =>  {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: "Invalid credentials" });//re-login
 
        if (user.type !== req.body.type) {
            console.log(`Login failed. User registered as ${user.type}, but tried as ${req.body.type}`);
            return res.status(400).json({ status: false, type: req.body.type});
            //return res.redirect('/login');
        }

        req.logIn(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({ status: true, type : user.type});
        //send homepage for user/owner
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

export async function verify(req, username, password, done) {
    console.log(username + " " + password);
    const type = req.body.type;
    console.log(type + "+++++++============");
    const validTypes = ["customer", "owner"];
    if (!validTypes.includes(type)) {
        return done("Invalid user type", false);
    }
    try {
        const result = await sql`
            SELECT * FROM ${sql(type)} WHERE username = ${username}
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
                return done("User Doesn't exist !! ", false);
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


export async function verifyusingGoogle(req, accessToken, refreshToken, profile, done) {
  try {
    //console.log(profile);
    const userType = req.session?.type || "customer";

    if (!["customer", "owner"].includes(userType)) {
      return done(null, false, { message: "Invalid user type." });
    }

    const result = await sql`
      SELECT * FROM ${sql(userType)} WHERE username = ${profile.email}
    `;

    if (result.length === 0) {
      const newUser = await sql`
        INSERT INTO ${sql(userType)} (username, password) 
        VALUES (${profile.email}, 'google') 
        RETURNING *
      `;
      return done(null, newUser[0]);
    }else {
      if (result[0].password !== 'google') {
        return done(null, false, { message: `Email already registered` });
      }
      return done(null, result[0]);
    }
  } catch (err) {
    return done(err);
  }
}