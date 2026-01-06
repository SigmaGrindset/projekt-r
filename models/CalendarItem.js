const { pool } = require('../config/db');

class CalendarItem {

    static async getPlanForDate(userID, date) {
        let client;

        try {
            client = await pool.connect();

            const res = await client.query(
                `
        SELECT ci.id, ci.date, ci.planned_minutes, ci.description,
               subject.id AS subject_id, subject.name AS subject_name
        FROM calendar_item ci
        JOIN subject ON subject.id = ci.subject_id
        WHERE ci.user_id = $1 AND ci.date = $2
        ORDER BY subject.name ASC
        `,
                [userID, date]
            );

            return res.rows;
        }
        finally {
            if (client) client.release();
        }
    }


    static async createPlanItem(userID, data) {
        let client;

        try {
            const subjectID = data?.subject_id;
            const date = data?.date;
            const plannedMinutes = Number(data?.planned_minutes);
            const description = (data?.description || '').trim();

            if (!subjectID) throw new Error("Predmet je obavezan.");
            if (!date) throw new Error("Datum je obavezan.");
            if (!Number.isFinite(plannedMinutes) || plannedMinutes < 0) {
                throw new Error("Planirane minute moraju biti broj >= 0.");

            }

            client = await pool.connect();

            const res = await client.query(
                `
        INSERT INTO calendar_item (planned_minutes, description, date, user_id, subject_id)
        SELECT $1, $2, $3::date, $4, $5
        WHERE EXISTS (
          SELECT 1 FROM subject s
          WHERE s.id = $5 AND s.user_id = $4
        )
        RETURNING id 
        `,
                [plannedMinutes, description || null, date, userID, subjectID]
            );


            if (res.rows.length === 0) {
                throw new Error("Neispravan predmet (ne pripada korisniku)");
            }
            return res.rows[0];
        } catch (err) {
            if (err.code === '23505') {
                throw new Error("Plan za taj predmet i datum već postoji.");
            }
            throw err;
        } finally {
            if (client) client.release();
        }
    }


    static async deletePlanItem(userID, itemID) {
        let client;

        try {
            client = await pool.connect();

            const res = await client.query(
                'DELETE FROM calendar_item WHERE id = $1 AND user_id = $2 RETURNING id',
                [itemID, userID]
            );

            return res.rows.length > 0;

        } finally {
            if (client) client.release();
        }
    }

    static async updatePlanItem(userID, itemID, data) {
        let client;
        try {
            const plannedMinutes = Number(data?.planned_minutes);
            const description = (data?.description || '').trim();

            if (!Number.isFinite(plannedMinutes) || plannedMinutes < 0) {
                throw new Error("Planirane minute moraju biti broj >= 0.");
            }

            client = await pool.connect();

            const res = await client.query(
                `
      UPDATE calendar_item
      SET planned_minutes = $1,
          description = $2
      WHERE id = $3 AND user_id = $4
      RETURNING id
      `,
                [plannedMinutes, description || null, itemID, userID]
            );

            return res.rows[0] || null;
        } finally {
            if (client) client.release();
        }
    }

}



module.exports = CalendarItem;