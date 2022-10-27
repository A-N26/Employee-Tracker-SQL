USE EmployeeTrackerAN_db;

-- ↓Departments
INSERT INTO department (id, name)
VALUES
    (1, 'Manager'),
    (2, 'Assistant Manager'),
    (3, 'Team Lead'),
    (4, 'Team Supervisor'),
    (5, 'Junior Team');

-- ↓Roles
INSERT INTO role (title, salary, department_id)
VALUES
    -- Mgr
    ('Producer', 550000, 1),
    -- Assistant Mgr
    ('Art Manager', 150000, 2),
    -- Team Lead
    ('Lead Artist', 100000, 3),
    ('Lead Animator', 100000, 3),
    -- Team Supervisor
    ('Artist', 25000, 4),
    ('Animator', 25000, 4),
    -- Junior Team
    ('Junior Artist', 5000, 5),
    ('Junior Animator', 5000, 5);

-- ↓employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    -- Manager - Producer
    ('Adam', 'Vysper', 1, NULL),
    -- Assistant Mgr - Art Mgr
    ('Yulia', 'Nights', 2, 1),
    ('Lucy', 'Lied', 2, 1),
    -- Team Lead - Lead Artist & Animator
    ('Edward', 'Elric', 3, 2),
    ('Rick', 'Sanchez', 3, 2),
    -- Team Supervisor - Artist & Animator
    ('Dexter', 'Morgan', 4, 3),
    ('Diana', 'Prince', 4, 3),
    ('Liliana', 'Pierse', 4, 3),
    ('Leeroy', 'Jenkins', 4, 3),
    -- Junior Team - Junior Artist & Animator
    ('Edward', 'Nashton', 5, 4),
    ('Jerry', 'Tommason', 5, 4),
    ('Morrigan', 'Flemeth', 5, 4),
    ('Meghan', 'Richards', 5, 4),