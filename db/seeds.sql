USE EmployeeTrackerAN_db;

-- ↓Departments
INSERT INTO department (id, name)
VALUES
    (1, 'Manager'),
    (2, 'Assistant Manager'),
    (3, 'Team Lead'),
    (4, 'Team'),
    (5, 'Junior Team');

-- ↓Roles
INSERT INTO role (title, salary, department_id)
VALUES
    ('Producer', 550000, 1),
    ('Art Manager', 150000, 2),
    ('Lead Artist', 100000, 3),
    ('Lead Animator', 100000, 3),
    ('Artist', 25000, 4),
    ('Animator', 25000, 4),
    ('Junior Artist', 5000, 5),
    ('Junior Animator', 5000, 5);

-- ↓employees
INSERT INTO employee (first_name, last_name, role_id, manager_id, is_manager)
VALUES
    ('Adam', 'Vysper', 1, NULL, 1),
    ('Yulia', 'Nights', 2, 1, 1),
    ('Lucy', 'Lied', 2, 1, 1),
    ('Edward', 'Elric', 3, 2, 0),
    ('Rick', 'Sanchez', 3, 2, 0),
    ('Dexter', 'Morgan', 4, 3, 0),
    ('Diana', 'Prince', 4, 3, 0),
    ('Liliana', 'Pierse', 4, 3, 0),
    ('Leeroy', 'Jenkins', 4, 3, 0),
    ('Edward', 'Nashton', 5, 4, 0),
    ('Jerry', 'Tommason', 5, 4, 0),
    ('Morrigan', 'Flemeth', 5, 4, 0),
    ('Meghan', 'Richards', 5, 4, 0),