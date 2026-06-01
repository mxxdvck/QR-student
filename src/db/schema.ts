import {
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  time,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const userRole = pgEnum("user_role", ["owner", "admin", "student"]);
export const attendanceStatus = pgEnum("attendance_status", ["present"]);

export const classes = pgTable("classes", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    login: text("login").notNull(),
    passwordHash: text("password_hash").notNull(),
    role: userRole("role").notNull(),
    classId: uuid("class_id").references(() => classes.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_login_unique").on(table.login),
    index("users_class_id_idx").on(table.classId),
  ],
);

export const lessons = pgTable(
  "lessons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    date: date("date").notNull(),
    startTime: time("start_time", { withTimezone: false }).notNull(),
    checkInMinutes: integer("check_in_minutes").notNull().default(15),
    qrToken: text("qr_token").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("lessons_qr_token_unique").on(table.qrToken),
    index("lessons_class_id_idx").on(table.classId),
    check("lessons_check_in_minutes_positive", sql`${table.checkInMinutes} > 0`),
  ],
);

export const attendance = pgTable(
  "attendance",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    lessonId: uuid("lesson_id")
      .notNull()
      .references(() => lessons.id, { onDelete: "cascade" }),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    status: attendanceStatus("status").notNull().default("present"),
    scannedAt: timestamp("scanned_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("attendance_lesson_student_unique").on(table.lessonId, table.studentId),
    index("attendance_student_id_idx").on(table.studentId),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;
export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
export type Attendance = typeof attendance.$inferSelect;
export type NewAttendance = typeof attendance.$inferInsert;
