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

        /**
         * 
         * CREATE TABLE IF NOT EXISTS owner_profile (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    shop_name TEXT,
    license_no TEXT,
    address TEXT
);
         */

        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                fname TEXT,
                lname TEXT,
                username VARCHAR(255) NOT NULL,
                password TEXT NOT NULL,
                type VARCHAR(10) NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

        `;
        
        await sql`
          CREATE TABLE IF NOT EXISTS vehicle (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                model TEXT NOT NULL,
                type TEXT NOT NULL,
                number TEXT NOT NULL UNIQUE,
                customer_id UUID NOT NULL REFERENCES users(id),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP
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
                FOREIGN KEY (owner_id) REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP
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
                payment_id VARCHAR(255),
                order_id VARCHAR(255),
                amount INTEGER,       
                customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                vehicle_id UUID NOT NULL REFERENCES vehicle(id) ON DELETE CASCADE,
                slot_id UUID NOT NULL REFERENCES parkingspot(id) ON DELETE CASCADE
          );

        `;
        await sql`
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                users_id UUID NOT NULL REFERENCES users(id),
                message TEXT NOT NULL,
                created_at TIMESTAMP NOT NULL,
                status VARCHAR(10) NOT NULL
            );
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS scheduled_task (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                spot_id UUID NOT NULL REFERENCES parkingspot(id),
                bike INTEGER,
                car INTEGER,
                created_at TIMESTAMP
            );
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS payout_accounts (
                owner_id UUID PRIMARY KEY REFERENCES users(id),
                contact_id VARCHAR(255) NOT NULL,
                fund_account_id VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await sql`
            CREATE TABLE IF NOT EXISTS pending_payouts (
                booking_id UUID PRIMARY KEY REFERENCES bookings(id),
                amount INTEGER NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                processed_at TIMESTAMP,
                owner_id UUID NOT NULL REFERENCES users(id)
            );

        `;
        console.log("Database initiated successfully");
    } catch (error) {
        console.log("Error initDb", error);
        throw error;
    }
}
