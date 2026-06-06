# User Guide

This guide explains the main QR Student workflows for owners, admins, and students. It is general project documentation for the public OSS repository and does not contain real credentials or private deployment data.

## 1. What The System Does

QR Student is a small QR-based attendance app for education workflows.

The basic flow is:

- an owner creates admins;
- an owner or admin creates classes, students, and lessons;
- a student signs in, scans a lesson QR code, and marks attendance;
- an owner or admin reviews the attendance table.

## 2. Roles

**Owner** manages admin access and can work with education data.

**Admin** creates classes, adds students, creates lessons, shows QR codes, and reviews attendance.

**Student** signs in, marks attendance through a QR code, and reviews their attendance and absences.

## 3. Sign In

1. Open the app in a browser.
2. Enter the login.
3. Enter the password.
4. Submit the sign-in form.

Owners and admins enter the admin area. Students enter the student dashboard.

## 4. Owner Workflow

To create an admin:

1. Sign in as the owner.
2. Open **Users**.
3. Enter the admin name.
4. Enter the admin login.
5. Use the suggested password or set a new one.
6. Copy the password.
7. Create the admin.
8. Share the login and password through a safe private channel.

Passwords must be saved when they are created. They cannot be viewed again later; access can only be replaced.

If a delete button is shown next to an admin, the owner can remove that admin. The owner account is not removed through the users list.

## 5. Admin Workflow

### Create A Class

1. Open **Classes**.
2. Enter the class name.
3. Select **Create class**.

### Open A Class

1. Open **Classes**.
2. Find the class in the list.
3. Select **Open**.

### Add A Student

1. Open the class.
2. Enter the student name.
3. Enter the student login.
4. Use the suggested password or set a new one.
5. Copy the password.
6. Select **Add**.
7. Share the login and password through a safe private channel.

Students do not self-register. They are added by the owner or an admin.

### Change A Student Password

If a student forgets a password:

1. Open the class.
2. Find the student.
3. Open the student card.
4. Set a new password in the password section.
5. Select **Change password**.
6. Share the new password with the student through a safe private channel.

The old password cannot be viewed.

### Delete A Student

If a delete button is shown next to a student, an admin can remove the student from the class.

Deleting a student also removes that student's attendance records.

## 6. Create A Lesson

1. Open the class.
2. Find the lesson creation form.
3. Enter the lesson name.
4. Select the lesson date.
5. Set the start time.
6. Set the check-in window in minutes.
7. Select **Create**.

**Name** is a clear lesson name, such as a topic or session type.

**Date** is the day when the lesson happens.

**Start time** is when students may begin checking in.

**Check-in window** is how many minutes after the start time a student may check in. For example, if a lesson starts at 10:00 and the window is 15 minutes, check-in is accepted from 10:00 to 10:15.

## 7. Open A Lesson And Show The QR Code

1. Open the class.
2. Find the lesson in the lessons list.
3. Select **Open**.
4. Show the QR code to students on a screen, projector, or other device.

The QR code can be opened before the lesson starts. Students may see the scan page early, but attendance is accepted only during the configured check-in window.

## 8. Student Check-In

1. The student opens the app.
2. The student signs in with their login and password.
3. The student scans the lesson QR code.
4. The app shows the check-in result.

If the check-in is accepted, the app saves the attendance record. A student cannot check in twice for the same lesson.

## 9. Common Messages

**Check-in has not started**  
The lesson has not started yet. Wait until the start time and open the QR code again.

**You are marked present**  
Attendance was saved. No extra action is needed.

**You already checked in**  
Attendance was already saved earlier. A repeated scan does not create another record.

**Check-in time is over**  
The allowed check-in window has ended. The app no longer accepts attendance for this lesson.

**This QR code is not for your class**  
The student opened a QR code for another class. Ask an admin to show the QR code for the correct class.

## 10. Attendance Table

1. Sign in as an owner or admin.
2. Open **Classes**.
3. Open the class.
4. Find the attendance table.

In the table:

- rows are students;
- columns are lessons;
- cells show the student's status for each lesson.

**Present** means the student checked in.

**Absent** means the lesson has passed and there is no attendance record for the student.

**Not finished yet** means the lesson has not ended or the check-in window is still open.

## 11. Student Attendance View

1. The student signs in.
2. The student dashboard opens.
3. The dashboard shows attendance and absence counts.
4. The lesson list shows the status for each lesson.

Future lessons are not counted as absences because students cannot check in before the allowed time.

## 12. Edit A Lesson

1. Open the class.
2. Open the lesson from the lesson list.
3. Change the name, date, start time, or check-in window.
4. Select **Save**.

The lesson QR link and existing attendance records remain in place after editing.

## 13. Delete A Lesson

1. Open the lesson page.
2. Select **Delete lesson**.
3. Confirm deletion.

Deleting a lesson also removes attendance records for that lesson.

## 14. Delete A Class

1. Open **Classes**.
2. Find the class.
3. Select **Delete**.
4. Confirm deletion.

Deleting a class also removes its students, lessons, and attendance records.

## 15. Forgotten Passwords

If a student forgets a password, an admin opens the student card and sets a new password.

If an admin forgets a password, the owner gives the admin new access.

If owner access is lost, use the documented owner credential update workflow in `DEPLOYMENT.md`.

Passwords cannot be viewed after creation. They can only be replaced.

## 16. FAQ

**Can I create multiple classes?**  
Yes. Open **Classes** and create as many classes as needed.

**Can I add multiple admins?**  
Yes. The owner can create multiple admins in **Users**.

**What should I do if a student forgets a password?**  
Open the student card and set a new password.

**What should I do if a lesson was created with incorrect data?**  
Open the lesson, correct the data, and select **Save**. Delete the lesson if it is no longer needed.

**Why does a student see an absence?**  
An absence appears when a lesson has passed and the student did not check in during the allowed time.

**Can a student check in twice?**  
No. Only one attendance record is saved for one student and one lesson.

**Can the QR code be opened early?**  
Yes. The QR code can be shown early, but attendance is accepted only during the configured check-in window.

**What if a student opens a QR code for another class?**  
Show the QR code for the student's correct class.

## 17. First Run Checklist

- Sign in as the owner.
- Create an admin.
- Share admin credentials privately.
- Create a class.
- Add students.
- Share student credentials privately.
- Create a lesson.
- Open the lesson and show the QR code.
- Test student sign-in.
- Test QR check-in.
- Open the attendance table and review the result.
