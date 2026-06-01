CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE "user_role" AS ENUM ('admin', 'student');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "attendance_status" AS ENUM ('present');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "classes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL,
  "login" text NOT NULL,
  "password_hash" text NOT NULL,
  "role" "user_role" NOT NULL,
  "class_id" uuid,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "lessons" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "class_id" uuid NOT NULL,
  "title" text NOT NULL,
  "date" date NOT NULL,
  "start_time" time NOT NULL,
  "check_in_minutes" integer DEFAULT 15 NOT NULL,
  "qr_token" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "lessons_check_in_minutes_positive" CHECK ("check_in_minutes" > 0)
);

CREATE TABLE IF NOT EXISTS "attendance" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "lesson_id" uuid NOT NULL,
  "student_id" uuid NOT NULL,
  "status" "attendance_status" DEFAULT 'present' NOT NULL,
  "scanned_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

DO $$ BEGIN
  ALTER TABLE "users"
    ADD CONSTRAINT "users_class_id_classes_id_fk"
    FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE SET NULL;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "lessons"
    ADD CONSTRAINT "lessons_class_id_classes_id_fk"
    FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "attendance"
    ADD CONSTRAINT "attendance_lesson_id_lessons_id_fk"
    FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "attendance"
    ADD CONSTRAINT "attendance_student_id_users_id_fk"
    FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "users_login_unique" ON "users" ("login");
CREATE INDEX IF NOT EXISTS "users_class_id_idx" ON "users" ("class_id");
CREATE UNIQUE INDEX IF NOT EXISTS "lessons_qr_token_unique" ON "lessons" ("qr_token");
CREATE INDEX IF NOT EXISTS "lessons_class_id_idx" ON "lessons" ("class_id");
CREATE UNIQUE INDEX IF NOT EXISTS "attendance_lesson_student_unique" ON "attendance" ("lesson_id", "student_id");
CREATE INDEX IF NOT EXISTS "attendance_student_id_idx" ON "attendance" ("student_id");
