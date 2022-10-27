DROP DATABASE IF EXISTS EmployeeTrackerAN_db;
CREATE DATABASE EmployeeTrackerAN_db;
USE EmployeeTrackerAN_db;

-- ↓Table to hold departments
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

-- ↓Table to hold roles
CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    -- title
    title VARCHAR(30) NULL,
    -- salary
    salary DECIMAL(10,1) NULL,
    -- department_id
    department_id INTEGER NULL,
    PRIMARY KEY (id)
);

-- ↓Table to hold employees
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    -- employee name
    first_name VARCHAR(30) NULL,
    last_name VARCHAR(30) NULL,
    -- role_id
    role_id INT NULL,
    -- manager_id
    manager_id INT NULL,
    PRIMARY KEY (id)
);