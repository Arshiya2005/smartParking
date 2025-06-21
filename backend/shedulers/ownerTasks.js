import cron from "node-cron";
import { sql } from "../config/db.js";

cron.schedule("0 0 * * *", async () => {
  console.log("Running scheduled deletion job...");

  try {
    const spotsToDelete = await sql`
      SELECT * FROM scheduled_task;
    `;

    for (const spot of spotsToDelete) {
        const { spot_id,  bike, car } = spot;
        if(bike === null && car === null) {
            await sql`
                UPDATE parkingspot
                SET is_active = FALSE
                WHERE id = ${spot_id};
            `;
        }else {
            await sql`
                UPDATE parkingspot SET bike = ${bike}, car = ${car} WHERE id = ${spot_id};
            `;
        }
      

      await sql`
        DELETE FROM scheduled_task
        WHERE id = ${spot.id};
      `;
    }

    console.log(`Deleted ${spotsToDelete.length} scheduled spot(s).`);
  } catch (err) {
    console.error("Error running deletion job:", err);
  }
});
