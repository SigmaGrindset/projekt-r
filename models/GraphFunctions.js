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
    try {
      client = await pool.connect();
      const result = {};
      for (const interval of intervalList) {
        const res = await client.query(
          `
                SELECT subject.name AS subject_name,
                    COALESCE(EXTRACT(EPOCH FROM SUM(ss.ended_at - ss.started_at))/60, 0) AS total_study_time
                FROM subject LEFT JOIN study_session ss
                ON subject.id = ss.subject_id AND ss.user_id = $1
                    AND (current_timestamp - ss.started_at) <= INTERVAL '1 ${interval}'
                WHERE subject.user_id = $1
                GROUP BY subject.name
                ORDER BY subject.name ASC
                `,
          [userId]
        );
        result[interval] = res.rows;
      }


      const dataByTimeframe = {};
      for (const interval of intervalList) {
        if (result[interval].length === 0) {
          dataByTimeframe[interval] = { "error": "no subjects found" };
          continue;
        }
        const x = [];
        const y = []
        for (const row of result[interval]) {
          x.push(row.subject_name);
          y.push(Number(row.total_study_time) || 0);
        }
        dataByTimeframe[interval] = [{ x, y, name: `Study Time in the last ${interval}`, type: 'bar' }];
      }
      return dataByTimeframe;
    } finally {
      if (client) client.release();
    }
  }

  // ucenje kroz vrijeme - ukupno vrijeme ucenja predmeta u nekon danu/tjednu
  // (y os je ukupno vrijeme ucrnja taj dan/tjedan, a x os je vrijeme; datum)
  static async getStudyOverTime(userId) {
    let client;
    const intervalList = ['week', 'month'];
    const subjectList = await Subject.getSubjectsForUser(userId);
    try {
      client = await pool.connect();
      const data = { "week": [], "month": [] };
      for (const subject of subjectList) {
        for (const interval of intervalList) {
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
          for (const row of res.rows) {
            x.push(row.study_date);
            y.push(Number(row.total_study_time) || 0);
          }
          data[interval].push({ x, y, name: subject.name, type: 'scatter' });
        }
      }
      return data;
    } finally {
      if (client) client.release();
    }
  }

  static async getStudyByDaysOfWeek(userId) {
    let client;
    const numByDay = { 0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday" };
    const x = [];
    const y = [];
    try {
      client = await pool.connect();
      const res = await client.query(
        `
                SELECT EXTRACT(DOW FROM ss.started_at) AS day_of_week,
                    EXTRACT(EPOCH FROM SUM(ss.ended_at - ss.started_at))/60 AS total_study_time
                FROM study_session ss
                WHERE ss.user_id = $1
                GROUP BY day_of_week
                ORDER BY day_of_week ASC
                `,
        [userId]
      )
      const dataByDay = {};
      for (const row of res.rows) {
        dataByDay[numByDay[row.day_of_week]] = Number(row.total_study_time) || 0;
      }
      const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      for (const day of allDays) {
        if (!(day in dataByDay)) {
          dataByDay[day] = 0;
        }
      }
      for (const day of allDays) {
        x.push(day);
        y.push(dataByDay[day]);
      }
      return [{ x, y, type: 'bar', name: 'Study Time by Days of the Week' }];

    } finally {
      if (client) client.release();
    }
  }

  static async getStudyByHours(userId) {
    let client;
    const studyByHour = {};
    for (let i = 0; i < 24; i++) {
      studyByHour[i] = 0;
    }

    try {
      client = await pool.connect();
      const res = await client.query(
        `
                SELECT ss.started_at, ss.ended_at
                FROM study_session ss
                WHERE ss.user_id = $1
                `,
        [userId]
      );

      for (const row of res.rows) {
        const startDate = new Date(row.started_at);
        const endDate = new Date(row.ended_at);

        let currentHour = startDate.getHours();
        let currentTime = new Date(startDate);

        while (currentTime < endDate) {
          const nextHour = new Date(currentTime);
          nextHour.setHours(currentTime.getHours() + 1, 0, 0, 0);

          const segmentEnd = nextHour < endDate ? nextHour : endDate;
          const minutesInHour = (segmentEnd - currentTime) / (1000 * 60);

          studyByHour[currentHour] += minutesInHour;

          currentTime = segmentEnd;
          currentHour = currentTime.getHours();
        }
      }

      const x = Object.keys(studyByHour).map(h => `${h}:00`);
      const y = Object.values(studyByHour);

      return [{ x, y, type: 'bar', name: 'Study Time by Hour of Day' }];

    } finally {
      if (client) client.release();
    }
  }

  static async githubActivity(userId) {
    let client;
    const data = [];
    try {
      client = await pool.connect();
      const res = await client.query(
        `
                WITH date_series AS (
                    SELECT generate_series(
                        CURRENT_DATE - INTERVAL '49 days',
                        CURRENT_DATE,
                        INTERVAL '1 day'
                    )::date AS datum
                )
                SELECT
                    ds.datum::text AS datum,
                    COALESCE(SUM(EXTRACT(EPOCH FROM (ss.ended_at - ss.started_at)) / 60), 0) AS ukupno_minuta
                FROM date_series ds
                LEFT JOIN study_session ss
                    ON DATE(ss.started_at) = ds.datum
                    AND ss.user_id = $1
                GROUP BY ds.datum
                ORDER BY ds.datum DESC;
                `,
        [userId]
      );
      for (const row of res.rows) {
        data.push({
          "date": row.datum,
          "minutes": Math.round(row.ukupno_minuta)
        })
      }
      return data;
    } finally {
      if (client) client.release();
    }
  }

  // ...existing code...

  static async plannedVsActualStudy(userId) {
    let client;
    const intervalList = ['day', 'week', 'month'];

    try {
      client = await pool.connect();
      const result = {};

      for (const interval of intervalList) {
        const res = await client.query(
          `
                SELECT
                    subject.name AS subject_name,
                    COALESCE(planned.total_planned, 0) AS planned_minutes,
                    COALESCE(actual.total_actual, 0) AS actual_minutes
                FROM subject
                LEFT JOIN (
                    SELECT
                        subject_id,
                        SUM(planned_minutes) AS total_planned
                    FROM calendar_item
                    WHERE user_id = $1
                      AND date >= CURRENT_DATE - INTERVAL '1 ${interval}'
                    GROUP BY subject_id
                ) planned ON subject.id = planned.subject_id
                LEFT JOIN (
                    SELECT
                        subject_id,
                        EXTRACT(EPOCH FROM SUM(
                            COALESCE(ended_at, CURRENT_TIMESTAMP) - started_at
                        )) / 60 AS total_actual
                    FROM study_session
                    WHERE user_id = $1
                      AND started_at >= CURRENT_TIMESTAMP - INTERVAL '1 ${interval}'
                    GROUP BY subject_id
                ) actual ON subject.id = actual.subject_id
                WHERE subject.user_id = $1
                ORDER BY subject.name ASC
                `,
          [userId]
        );

        result[interval] = res.rows;
      }

      const dataByTimeframe = {};

      for (const interval of intervalList) {
        if (result[interval].length === 0) {
          dataByTimeframe[interval] = { error: 'no subjects found' };
          continue;
        }

        const x = [];
        const planned = [];
        const actual = [];

        for (const row of result[interval]) {
          x.push(row.subject_name);
          planned.push(Number(row.planned_minutes) || 0);
          actual.push(Number(row.actual_minutes) || 0);
        }

        dataByTimeframe[interval] = [
          {
            x,
            y: planned,
            name: 'Planirano',
            type: 'bar'
          },
          {
            x,
            y: actual,
            name: 'Odrađeno',
            type: 'bar'
          }
        ];
      }

      return dataByTimeframe;

    } finally {
      if (client) client.release();
    }
  }


}

module.exports = GraphFunctions;
