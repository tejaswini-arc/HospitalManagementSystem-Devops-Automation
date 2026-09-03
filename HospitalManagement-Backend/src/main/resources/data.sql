1. signup   INSERT INTO hospitaldb.app_user (username, password, provider_id, provider_type)
            VALUES ('admin@hospital.com', '$2a$12$8nQMBqJrMjFkCzFkCzFkCeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', NULL, 'EMAIL');

2. Then assign the ADMIN role:
INSERT INTO hospitaldb.user_roles (user_id, roles)
VALUES (LAST_INSERT_ID(), 'ADMIN');





INSERT INTO patient (name, gender, birth_date, email, blood_group)
VALUES
    ('Aarav Sharma', 'MALE', '1990-05-10', 'aarav.sharma@example.com', 'O_POSITIVE'),
    ('Diya Patel', 'FEMALE', '1995-08-20', 'diya.patel@example.com', 'A_POSITIVE'),
    ('Dishant Verma', 'MALE', '1988-03-15', 'dishant.verma@example.com', 'A_POSITIVE'),
    ('Neha Iyer', 'FEMALE', '1992-12-01', 'neha.iyer@example.com', 'AB_POSITIVE'),
    ('Kabir Singh', 'MALE', '1993-07-11', 'kabir.singh@example.com', 'O_POSITIVE');

INSERT INTO doctor (name, specialization, email)
VALUES
    ('Dr. Rakesh Mehta', 'Cardiology', 'rakesh.mehta@example.com'),
    ('Dr. Sneha Kapoor', 'Dermatology', 'sneha.kapoor@example.com'),
    ('Dr. Arjun Nair', 'Orthopedics', 'arjun.nair@example.com');

INSERT INTO appointment (appointment_time, reason, doctor_id, patient_id)
VALUES
  ('2025-07-01 10:30:00', 'General Checkup', 1, 2),
  ('2025-07-02 11:00:00', 'Skin Rash', 2, 2),
  ('2025-07-03 09:45:00', 'Knee Pain', 3, 3),
  ('2025-07-04 14:00:00', 'Follow-up Visit', 1, 1),
  ('2025-07-05 16:15:00', 'Consultation', 1, 4),
  ('2025-07-06 08:30:00', 'Allergy Treatment', 2, 5);


  Create patient request body:
  {
    "name": "Aarav Sharma",
    "gender": "MALE",
    "birthDate": "1990-05-10",
    "email": "aarav.sharma@example.com",
    "bloodGroup": "O_POSITIVE"
  }

Update patient request body (only send fields you want to change):

{
  "name": "Aarav Sharma Updated",
  "bloodGroup": "A_POSITIVE"
}

step 1 :

-- assign ADMIN
INSERT INTO hospitaldb.user_roles (user_id, roles) VALUES (<your_user_id>, 'ADMIN');

step2 :
users signup default as patient
1	$2a$10$r1JaWfuwqn2tSs1q5w8aJ.nKNgatQu8FMVNqA2ZUbYzAJmjhKiZ3e		EMAIL	admin@hospital.com
2	$2a$10$XNcYJi5r7YyH9W3HA.vDuO9w4wI9eKggdQAgrqLyrYRKeD3OeSb.u		EMAIL	doctor1@hospital.com
3	$2a$10$/i3fZyaJJuBe9cSYu97sV.O8F7Ru113SvIDjXeoPTr1dwcNlEMbey		EMAIL	doctor2@hospital.com
4	$2a$10$ch5nBV79kz1FNk1kEodjNegz1Lbj1yrz69xyjFqDjNSE9RVkFATSy		EMAIL	patient1@hospital.com
5	$2a$10$SzTgfnhPLFV9QqUhDvxtjOpUWoTnTZeFTsoCbsy2gojnQ7J/wYv3.		EMAIL	patient2@hospital.com

step3 : Admin onboards a doctor , for that he changes his userid -> role Doctor
then send this request http://localhost:8080/api/v1/admin/onBoardNewDoctor
{
    "userId":2,
    "specialization":"Cardiology",
    "name":"doctor1"
}

// for making appointment flow
trigger of make appointment api goes to oauth - google page takes sign in as new patient /create patient
then appointment is created with that patient id
http://localhost:8080/api/v1/patients/appointments
{
    "doctorId": 2,
    "patientId": 8,
    "appointmentTime": "2026-03-20T10:30:00",
    "reason": "Routine checkup"
}
means making appointment can be 2 ways
1. logged in patient makes appointment
2. any New user who is not registered or signup can make appointment by default patient record gets created and
user credential are taken from gmail login /oauth2



*************************************
Now If iam receptionalist and my login was created using oauth2
then i need to login with following url

GET http://localhost:8080/api/v1/oauth2/authorization/google
from which i will get jwt token


