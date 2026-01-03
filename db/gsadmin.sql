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
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
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


