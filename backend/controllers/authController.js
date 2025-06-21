import passport from "passport";
import bcrypt from "bcrypt";


import { sql } from "../config/db.js";

export const register = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const type = req.body.type;
    const fname = req.body.firstName;
    const lname = req.body.lastName;


    try {
      var checkResult;
      if(type === "customer") {
        checkResult = await sql`
                SELECT * FROM customer WHERE username = ${username}
            `;
      }else {
        checkResult = await sql`
                SELECT * FROM owner WHERE username = ${username}
            `;
      }
        
        if (checkResult.length > 0) {
            console.log("Username already exist !! Try again.")
            return res.status(409).json({ error: "User already exists" });
        } else {
            const saltRounds = 10;
            const hash = await bcrypt.hash(password, saltRounds); 

            if(type === "customer") {
              await sql`
                INSERT INTO customer ( fname, lname, username, password) VALUES ( ${fname}, ${lname}, ${username}, ${hash})
              `;
            }else {
              await sql`
                INSERT INTO owner ( fname, lname, username, password) VALUES ( ${fname}, ${lname}, ${username}, ${hash})
              `;
            }
            
            return res.status(201).json({ message: "User registered successfully" });
            //go to landing page so one can login
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

export const login = async (req, res, next) =>  {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
          console.log(info);
          return res.status(401).json({ error: "user doesn't exist !!" });
        }
        if (!user) return res.status(401).json({ error: "Invalid credentials" });//re-login
        console.log(user);
        
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


export const ensureAuthenticated = async (req, res) => {
  //console.log(req.session);
  if (req.isAuthenticated()) {
    return res.status(200).json({ message: "authorised" , type: req.user.type});
  }
  return res.status(401).json({ error: "Unauthorized: Please log in" });
}

export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    return next(); // user is logged in
  }
  return res.status(401).json({ error: "Unauthorized(from middleware): Please log in" });
};


export async function verify(req, username, password, done) {
    console.log(username + " " + password);
    const type = req.body.type;
    console.log(type + "+++++++============");
    try {
      var result;
      if(type === "customer") {
        result = await sql`
            SELECT * FROM customer WHERE username = ${username}
        `;
      }else {
        result = await sql`
            SELECT * FROM owner WHERE username = ${username}
        `;
      }
        if (result.length > 0) {
          const user = result[0];
          const hash = user.password;
          bcrypt.compare(password, hash, async (err, res) => {
              if(err) {
                console.log(err.message);
                return done(err);
              }else {
                if(res) {
                    user.type = type;
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


export async function verifyusingGoogle(req, accessToken, refreshToken, profile, done) {
  try {
    //console.log(profile);
    const userType = req.session?.type || "customer";
    var result;
    if(userType === "customer") {
        result = await sql`
            SELECT * FROM customer WHERE username = ${profile.email}
        `;
      }else {
        result = await sql`
            SELECT * FROM owner WHERE username = ${profile.email}
        `;
      }
      
    if (result.length === 0) {
      var newUser;
      console.log("Profile in verifyusingGoogle : (for checking fname exists it or not)")
      console.log(profile);
      if(userType === "customer") {
        newUser = await sql`
          INSERT INTO customer ( username, password) 
          VALUES (${profile.email}, 'google') 
          RETURNING *
        `;
      }else {
        newUser = await sql`
          INSERT INTO owner (username, password) 
          VALUES ( ${profile.email}, 'google') 
          RETURNING *
        `;
      }
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
