USE EmployeeTracker;

-- ↓Table to hold department names
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- ↓Table to hold roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    -- employee name
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    -- role_id
    role_id INT,
    is_manager BOOLEAN NOT NULL,
    CONSTRAINT fk_role
    FOREIGN KEY (role_id)
    REFERENCES roles(id)
    ON DELETE CASCADE,
    -- manager_id
    manager_id INTEGER,
    CONSTRAINT fk_manager
    FOREIGN KEY (manager_id)
    REFERENCES employees(id)
    ON DELETE SET NULL
);