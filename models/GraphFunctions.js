const { pool } = require('../config/db');
const Subject = require('./Subject');

//ukupno vrijeme ucenja po predmetu (tjedan/misec) - koliko smo min ucili predmet u nekom periodu
// (x os su predmeti, y os je ukupno vrijeme ucenja u nekom periodu) 
class GraphFunctions {

    static async getStudyTimePerSubject(userId) {
        let client;
        //vracat cu odmah objekt za dan, objekt za tjedan i objekt za mjesec da ne moramo imat
        //vise poziva
        const intervalList = ['day', 'week', 'month'];
        try{
            client = await pool.connect();
            const result = {};
            for(const interval of intervalList){
                const res = await client.query(
                `
                SELECT subject.name AS subject_name, EXTRACT(EPOCH FROM SUM(ss.ended_at - ss.started_at))/60 AS total_study_time
                FROM study_session ss
                JOIN subject ON subject.id = ss.subject_id
                WHERE ss.user_id = $1 AND (current_timestamp - ss.started_at) <= INTERVAL '1 ${interval}'
                GROUP BY subject.name
                ORDER BY subject.name ASC
                `,
                [userId]
                );
                result[interval] = res.rows;
            }


            const dataByTimeframe = {};
            for (const interval of intervalList){
                if (result[interval].length === 0) {
                    dataByTimeframe[interval] = "no-data";
                    continue;
                }
                const x = [];
                const y = [];
                for (const row of result[interval]){
                    x.push(row.subject_name);
                    y.push(Number(row.total_study_time));
                }
                dataByTimeframe[interval] = [{ x, y, name: `Study Time in the last ${interval}`,type: 'bar'}];
            }
            return dataByTimeframe;
        } finally {
            if (client) client.release();
        }
    }

    // ucenje kroz vrijeme - ukupno vrijeme ucenja predmeta u nekon danu/tjednu 
    // (y os je ukupno vrijeme ucrnja taj dan/tjedan, a x os je vrijeme; datum) 
    static async getStudyOverTime(userId){
        let client;
        const intervalList = ['week', 'month'];
        const subjectList = await Subject.getSubjectsForUser(userId);
        try{
            client = await pool.connect();
            const data = {"week" : [], "month" : []};
            for(const subject of subjectList){
                for(const interval of intervalList){
                    const res = await client.query(
                        `
                        SELECT ss.started_at::date AS study_date,
                            EXTRACT(EPOCH FROM SUM(ss.ended_at - ss.started_at))/60 AS total_study_time
                        FROM study_session ss
                        WHERE ss.user_id = $1 AND ss.subject_id = $2 
                            AND (current_timestamp - ss.started_at) <= INTERVAL '1 ${interval}'
                        GROUP BY study_date
                        ORDER BY study_date ASC
                        `,
                        [userId, subject.id]
                    )
                    const x = [];
                    const y = [];
                    for(const row of res.rows){
                        x.push(row.study_date);
                        y.push(Number(row.total_study_time));
                    }
                    data[interval].push({ x, y, name: subject.name, type: 'scatter' });
                }
            }
            return data; 
        } finally {
            if (client) client.release();
        }
    }
}

module.exports = GraphFunctions;