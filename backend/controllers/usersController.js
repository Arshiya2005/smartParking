import { sql } from "../config/db.js";

export const notifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await sql`
            SELECT * FROM notifications WHERE users_id = ${userId} ORDER BY created_at DESC;
        `;
        await sql`
            UPDATE notifications  SET status = 'read' WHERE users_id = ${userId} AND status = 'unread';
        `;

        return res.status(200).json({ notifications: result });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const unreadNotificationCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await sql`
            SELECT * FROM notifications WHERE users_id = ${userId} AND status = 'unread';
        `;

        return res.status(200).json({ count: result.length });
    } catch (error) {
        console.error("Error counting unread notifications:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};