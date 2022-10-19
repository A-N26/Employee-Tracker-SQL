DROP DATABASE IF EXISTS EmployeeTrackerAN_db;
CREATE DATABASE EmployeeTrackerAN_db;
USE EmployeeTrackerAN_db;

-- ↓Table to hold department names
CREATE TABLE department (
    id INT AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

-- ↓Table to hold roles
CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- title
    title VARCHAR(30) NOT NULL,
    -- salary
    salary DECIMAL(10,1) NOT NULL,
    -- department_id
    department_id INTEGER,
    CONSTRAINT fk_department
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE CASCADE
);

-- ↓Table to hold employees
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    -- employee name
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    -- role_id
    role_id INT,
    CONSTRAINT fk_role
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE CASCADE,
    -- manager_id
    manager_id INTEGER,
    CONSTRAINT fk_manager
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);