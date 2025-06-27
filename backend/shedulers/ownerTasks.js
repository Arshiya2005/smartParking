import cron from "node-cron";
import { sql } from "../config/db.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled deletion job...");

  try {
    const spotsToDelete = await sql`
      SELECT * FROM scheduled_task WHERE status = 'pending';
    `;
    const now = new Date();
    for (const spot of spotsToDelete) {
        const { spot_id,  bike, car } = spot;
        if(bike === null && car === null) {
            await sql`
                UPDATE parkingspot
                SET is_active = FALSE, status = 'completed', completed_at = ${now}
                WHERE id = ${spot_id};
            `;
        }else {
            await sql`
                UPDATE parkingspot SET bike = ${bike}, car = ${car}, status = 'completed', completed_at = ${now}  WHERE id = ${spot_id};
            `;
        }
        
    }

    console.log(`completed ${spotsToDelete.length} scheduled tasks.`);
  } catch (err) {
    console.error("Error running deletion job:", err);
  }
});
