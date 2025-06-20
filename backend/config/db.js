import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

// creates a SQL connection using our env variables
export const sql = neon(
  `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require`
);
// this sql function we export is used as a tagged template literal, which allows us to write SQL queries safely


export async function initDb() {
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
              is_active BOOLEAN DEFAULT TRUE, 
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
              date DATE NOT NULL,
              slot_no INTEGER NOT NULL,
              status TEXT NOT NULL DEFAULT 'active',
              customer_id UUID NOT NULL REFERENCES customer(id) ON DELETE CASCADE,
              owner_id UUID NOT NULL REFERENCES owner(id) ON DELETE CASCADE,
              vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
              slot_id UUID NOT NULL REFERENCES parkingspot(id) ON DELETE CASCADE
          );

        `;
        await sql`
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                customer_id UUID NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL,
                status VARCHAR(10) NOT NULL
            );
        `;
       
        console.log("Database initiated successfully");
    } catch (error) {
        console.log("Error initDb", error);
    }
}
