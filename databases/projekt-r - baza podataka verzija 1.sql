CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE "user"
(
 user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 email VARCHAR(250) UNIQUE NOT NULL,
 username VARCHAR(30) UNIQUE NOT NULL
);
CREATE TABLE user_regular
(
 user_id UUID PRIMARY KEY REFERENCES "user"(user_id) ON DELETE CASCADE
);
CREATE TABLE user_admin
(
 user_id UUID PRIMARY KEY REFERENCES "user"(user_id) ON DELETE CASCADE
);
CREATE TABLE subject
(
 subject_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 subject_name TEXT NOT NULL,
 subject_ects INT CHECK (subject_ects >= 0),
 subject_active BOOLEAN NOT NULL DEFAULT FALSE,
 user_id UUID NOT NULL REFERENCES user_regular(user_id) ON DELETE CASCADE,
 UNIQUE(user_id, subject_name)
);
CREATE TABLE daily_plan
(
daily_plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
date_of_plan DATE NOT NULL,
notes TEXT,
user_regular_id UUID NOT NULL REFERENCES user_regular(user_id) ON DELETE CASCADE,
UNIQUE (user_regular_id, date_of_plan)
);
CREATE TABLE daily_study_session
(
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  description  TEXT,
  user_id UUID NOT NULL REFERENCES user_regular(user_id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subject(subject_id) ON DELETE CASCADE,
  CHECK (ended_at > started_at)
);

CREATE TABLE subject_plan
(
  subject_plan_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planned_minutes INT NOT NULL CHECK (planned_minutes >= 0),
  daily_plan_id UUID NOT NULL REFERENCES daily_plan(daily_plan_id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subject(subject_id) ON DELETE CASCADE,
  UNIQUE(daily_plan_id, subject_id)
);
CREATE TABLE study_type (
  study_type_id SMALLSERIAL PRIMARY KEY,
  type_name TEXT NOT NULL UNIQUE
);
CREATE TABLE session_study_type (
  session_id UUID NOT NULL REFERENCES daily_study_session(session_id) ON DELETE CASCADE,
  study_type_id  SMALLINT NOT NULL REFERENCES study_type(study_type_id) ON DELETE RESTRICT,
  PRIMARY KEY (session_id, study_type_id)
);

CREATE TABLE session_tag
(
  tag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_name TEXT NOT NULL UNIQUE
);
CREATE TABLE session_tag_map (
  session_id UUID NOT NULL REFERENCES daily_study_session(session_id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES session_tag(tag_id) ON DELETE RESTRICT,
  PRIMARY KEY (session_id, tag_id)
);