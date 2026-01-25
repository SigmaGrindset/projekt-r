CREATE EXTENSION IF NOT EXISTS pgcrypto;


CREATE TABLE users
(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(250) UNIQUE NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE subject
(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE (user_id, name)
);

-- session ucenja nekog predmeta
CREATE TABLE study_session
(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMP NOT NULL,
  ended_at TIMESTAMP NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subject(id) ON DELETE CASCADE,
  CHECK (ended_at > started_at)
);

-- plan za neki predmet na specificni dan.
CREATE TABLE calendar_item
(
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planned_minutes INT NOT NULL CHECK (planned_minutes >= 0),
  description TEXT,
  date DATE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subject(id) ON DELETE CASCADE,
  UNIQUE (date, subject_id, user_id)
);


-- za login - username: testuser, password: testuser
INSERT INTO users (id, password_hash, email, username)
VALUES ('1096f956-9012-4024-9e21-2868692da93b', '$2b$10$zLPCdC0zsRZ.ItPqgUOs2umMl9HrEknaPXZN3UEA5kyKkubcIyQom', 'testuser@gmail.com', 'testuser');


INSERT INTO subject (name, user_id) VALUES
('Programsko inženjerstvo', '1096f956-9012-4024-9e21-2868692da93b'),
('Prevođenje programskih jezika', '1096f956-9012-4024-9e21-2868692da93b');




-- Dnevni planovi (calendar_item) Programsko inženjerstvo
INSERT INTO calendar_item (planned_minutes, description, date, user_id, subject_id) VALUES
(60, 'Pregled osnovnih koncepata', '2026-01-10', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(75, 'Rješavanje zadataka iz vježbi', '2026-01-11', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(90, 'Čitanje bilješki i primjeri', '2026-01-12', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(60, 'Pregled predavanja', '2026-01-13', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(120, 'Rad na mini projektu', '2026-01-14', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(80, 'Analiza koda i rješavanje zadataka', '2026-01-15', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(70, 'Praktikum i vježbe', '2026-01-16', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(90, 'Rad na domaćem zadatku', '2026-01-17', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(100, 'Konzultacije i pregled predavanja', '2026-01-18', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(60, 'Vježbe programiranja', '2026-01-19', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(85, 'Praktikum i analiza koda', '2026-01-20', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(95, 'Mini projekt i rješavanje zadataka', '2026-01-21', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(70, 'Pregled teorije i primjeri', '2026-01-22', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(80, 'Vježbe i rješavanje problema', '2026-01-23', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(60, 'Analiza koda i vježbe', '2026-01-24', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
(90, 'Pregled i završni zadaci', '2026-01-25', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo'));

-- Dnevni planovi (calendar_item) Prevođenje programskih jezika
INSERT INTO calendar_item (planned_minutes, description, date, user_id, subject_id) VALUES
(45, 'Pregled teorije prevoditelja', '2026-01-10', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(50, 'Vježbe: prevođenje izraza', '2026-01-11', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(55, 'Rješavanje zadataka i primjeri', '2026-01-12', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(60, 'Analiza sintakse i semantike', '2026-01-13', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(50, 'Praktikum: implementacija prevoditelja', '2026-01-14', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(60, 'Vježbe i rješavanje problema', '2026-01-15', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(45, 'Pregled primjera iz predavanja', '2026-01-16', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(55, 'Vježbe prevođenja izraza', '2026-01-17', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(60, 'Analiza koda i rješavanje zadataka', '2026-01-18', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(50, 'Pregled sintakse', '2026-01-19', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(55, 'Vježbe i praktični zadaci', '2026-01-20', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(60, 'Rješavanje kompleksnijih primjera', '2026-01-21', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(50, 'Pregled primjera iz bilježaka', '2026-01-22', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(55, 'Vježbe prevođenja i analiza', '2026-01-23', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(60, 'Praktikum: zadaci iz predavanja', '2026-01-24', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
(50, 'Pregled i završni zadaci', '2026-01-25', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika'));

-- Study sessions (Programsko inženjerstvo)
INSERT INTO study_session (started_at, ended_at, description, user_id, subject_id) VALUES
('2026-01-10 09:00', '2026-01-10 10:00', 'Pregled osnovnih koncepata', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-11 09:15', '2026-01-11 10:30', 'Rješavanje zadataka', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-12 10:00', '2026-01-12 11:30', 'Čitanje bilješki', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-13 09:30', '2026-01-13 10:15', 'Pregled predavanja', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-14 11:00', '2026-01-14 12:45', 'Rad na mini projektu', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-15 08:30', '2026-01-15 09:50', 'Analiza koda i zadaci', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-16 10:00', '2026-01-16 11:10', 'Praktikum i vježbe', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-17 09:15', '2026-01-17 10:45', 'Rad na domaćem zadatku', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-18 09:00', '2026-01-18 10:40', 'Konzultacije i pregled', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-19 09:30', '2026-01-19 10:30', 'Vježbe programiranja', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-20 09:15', '2026-01-20 10:40', 'Praktikum i analiza', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-21 09:00', '2026-01-21 10:35', 'Mini projekt i zadaci', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-22 09:20', '2026-01-22 10:30', 'Pregled teorije', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-23 09:10', '2026-01-23 10:30', 'Vježbe i rješavanje problema', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-24 09:00', '2026-01-24 10:20', 'Analiza koda i vježbe', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo')),
('2026-01-25 09:15', '2026-01-25 10:45', 'Pregled i završni zadaci', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Programsko inženjerstvo'));

-- Study sessions (Prevođenje programskih jezika)
INSERT INTO study_session (started_at, ended_at, description, user_id, subject_id) VALUES
('2026-01-10 14:00', '2026-01-10 14:45', 'Pregled teorije prevoditelja', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-11 14:15', '2026-01-11 15:05', 'Vježbe: prevođenje izraza', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-12 14:00', '2026-01-12 14:55', 'Rješavanje zadataka i primjeri', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-13 14:10', '2026-01-13 15:10', 'Analiza sintakse i semantike', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-14 14:00', '2026-01-14 14:50', 'Praktikum: implementacija prevoditelja', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-15 14:20', '2026-01-15 15:20', 'Vježbe i rješavanje problema', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-16 14:05', '2026-01-16 14:50', 'Pregled primjera iz predavanja', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-17 14:00', '2026-01-17 14:55', 'Vježbe prevođenja izraza', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-18 14:15', '2026-01-18 15:15', 'Analiza koda i rješavanje zadataka', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-19 14:00', '2026-01-19 14:50', 'Pregled sintakse', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-20 14:10', '2026-01-20 15:05', 'Vježbe i praktični zadaci', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-21 14:00', '2026-01-21 14:55', 'Rješavanje kompleksnijih primjera', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-22 14:05', '2026-01-22 15:00', 'Pregled primjera iz bilježaka', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-23 14:00', '2026-01-23 14:50', 'Vježbe prevođenja i analiza', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-24 14:15', '2026-01-24 15:10', 'Praktikum: zadaci iz predavanja', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika')),
('2026-01-25 14:00', '2026-01-25 14:50', 'Pregled i završni zadaci', '1096f956-9012-4024-9e21-2868692da93b', (SELECT id FROM subject WHERE name='Prevođenje programskih jezika'));

