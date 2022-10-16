// Require declarations
const mysql = require('mysql2');
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
require('console.table');
require('dotenv').config();


// Mysql connection using .env variables
const connection = mysql.createConnection({
    host: 'localhost',
    // Replace port # with your port number.
    port: process.env.DB_PORT || 3001,
    // Replace user with your username in env variables file.
    user: process.env.DB_USER,
    // Replace password in env variables file with your password.
    password: process.env.DB_PASSWORD,
    // database created in schema.sql
    // Replace name in env variables file with your db name.
    database: process.env.DB_NAME,
});

// connection.connect()
connection.connect((err) => {
    console.log(chalk.yellow.bold('==========================================================================================================================================='));
    console.log(``);
    console.log(chalk.redBright.bold(figlet.textSync("EMPLOYEE TRACKER")));
    console.log(``);
    console.log(`` + chalk.green.bold('A (C)ONTENT (M)ANAGEMENT (S)YSTEM database!'));
    console.log(``);
    console.log(chalk.yellow.bold('==========================================================================================================================================='));
});
// ↓Initial selection prompts.
Prompts = () => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'purpose',
            message: 'What would you like to do?',
            choices:
                [
                'View Employees',
                'View employees by department',
                'Add new employee',
                'Remove employees',
                'Update employee roles',
                'Add role',
                'Finish',
                ],
        },
    )
    .then(({ purpose }) => {
        switch (purpose) {
            case 'View employees':
                showInfo();
                break;

            case 'View employees by department':
                chartByDpt();
                break;

            case 'Add employees':
                addNewName();
                break;

            case 'Remove employees':
                deleteName();
                break;

            case 'Update role':
                updateRole();
                break;

            case 'Add role':
                newRole();
                break;

            case 'Finish':
                chalk.green(connection.end(console.log('Task Complete!.')));
            }
    });
};
// ↓Select department prompt.
DptPromptOptions = (DptPromptChoices) => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'Dpt',
            message: 'Please select a department.',
            choices: DptPromptChoices
        }
    )
    .then((answer) => {
            console.log('answer', answer.Dpt);

            let options = `
                SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
                FROM employee e
                JOIN role r
                ON e.role_id = r.id
                JOIN department d
                ON d.id = r.department_id
                WHERE d.id = ?`

            connection.options(options, answer.Dpt, (err, res) => {
                if (err) throw err;
                console.table('result', res);
                console.log(res.Row + "employee name charting by departments done!\n");


            })
    })
};
// ↓Add employee prompt.
function rolePromptOptions (rolePromptChoices) {
    inquirer.prompt(
        {
            type: 'input',
            name: 'Name',
            message: 'Please enter an employee name.'
        },
        {
            type: 'input',
            name: 'SurName',
            message: 'Please enter the surname of the employee.'
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Please choose a role for the employee.',
            choices: rolePromptChoices
        },
    )
        .then((answer) => {
            console.log(answer);

            let options = `INSERT INTO employee SET ?`

            connection.options(options,
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.roleId,
                    manager_id: answer.managerId,
                },
                (err, res) => {
                    if (err) throw err;

                    console.table(res);
                    console.log(res.Row + 'successfully added.\n');

                    Prompts();
                }
            )
        });
};
// ↓Delete employee prompt.
deleteNamePromptOptions = (deleteNamePromptChoices) => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'employeeId',
            messages: 'Please select a name to delete.',
            choices: deleteNamePromptChoices
        }
    )
        .then((answer) => {
            console.log(answer)
            let options = `DELETE FROM employee Where ?`;

            connection.options(options, { id: answer.employeeId },
                (err, res) => {
                    if (err) throw err;

                    console.table(res);
                    console.log(res.Row + 'Removed\n');

                    prompts();
                }
            )
        });
};
// ↓Update employee role prompt.
employeeRoleUpdatePromptOptions = (rolePromptChoices, updateRolePromptChoices) => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee would you like to update the role of?',
            choices: updateRolePromptChoices
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Which role would you like to update?',
            choices: rolePromptChoices
        },
    )
        .then((answer) => {
            console.log(answer);

            let options = `
            UPDATE employee SET role_id = ?
            WHERE id = ?`

            connection.options(options, [answer.roleId, answer.employeeId], (err, res) => {
                if (err) throw err;

                console.table(res);
                console.log(res.Row + 'successfully updated.');

                prompts();
            }
            );
        });
};
// ↓Add new Role prompt.
function newRolePromptOptions(newRoleChoices) {
    inquirer.prompt(
        {
            type: 'input',
            name: 'RoleName',
            message: 'What role would you like to add?',
        },
        {
            type: 'input',
            name: 'SalaryAmount',
            message: 'What is the salary of the new role?'
        },
        {
            type: 'list',
            name: 'Dpt name',
            message: 'Which department would you like to add the new role to?',
            choices: newRoleChoices
        },
    )
        .then(answer => {
            let options = ` INSERT INTO role SET ?`

            connection.options(options, {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.departmentId
            },
                (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    console.log('New role added.');

                    prompts();
                }
            );
        });
};

//↓Initial prompt choice case options.
// ↓To see employee info.
showInfo = () => {
    console.log('Showing available employee Info\n...');

    var options = `
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, join(m.first_name +, '', + m.last_name) AS manager
        FROM
        employee e
        LEFT JOIN role r
        ON e.role_id = r.id
        LEFT JOIN department d
        ON d.id = r.department_id
        LEFT JOIN employee m
        ON m.id = e.manager_id`

    connection.options(options, (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log('Showing available employee Info!\n');

        Prompts();
    });
};
// ↓To view employee info by department.
chartByDpt = () => {
    console.log('Viewing employee info by department!\n');

    var options =`
        SELECT d.id, d.name, r.salary AS budget
        FROM
        employee e
        LEFT JOIN role r
        ON e.role_id = r.id
        LEFT JOIN department d
        ON d.id = r.department_id
        GROUP BY d.id, d.name`

    connection.options(options, (err, res) => {
        if (err) throw err;
        const DptPromptOptions = res.map(data => ({
            value: data.id, name: data.name
        }));
        console.table(res);
        console.log('Showing employee info by department!\n');

        DptPromptOptions (DptPromptChoices)
    });
};
// ↓To add an employee.
addNewName = () => {
    console.log('Adding employee...');

    var options = `
    SELECT r.id, r.title, r.salary
    FROM role r`

    connection.options(options, (err, res) => {
        if (err) throw err;

        const rolePromptChoices = res.map((id, title, salary) => ({
            value: id, title: `${ title }`, salary: `${ salary }`
        })
        );
        console.table(res);
        console.log('Showing employee...\n');

        rolePromptOptions(rolePromptChoices)
    });
};
// ↓To remove/DELETE an employee.
deleteName = () => {
    console.log('Removing employee...');

    var options = `
    SELECT e.id, e.first_name, e.last_name
    FROM employee e`

    connection.options(options, (err, res) => {
        if (err) throw err;

        const deleteNamePromptChoices = res.map((id, first_name, last_name) => ({
            value: id, name: `${ id } ${ first_name } ${ last_name }`
        })
        );
        console.table(res);
        console.log('Deleting employee info...\n');

        deleteNamePromptOptions(deleteNamePromptChoices);
    });
};
// ↓To UPDATE an employee role.
updateRole = () => {
    employees_Array();
};
function employees_Array() {
    console.log("Updating employee role");

    var options = `
    SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, join(m.first_name, + '', + m.last_name) AS manager
    FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    JOIN employee m
    ON m.id = e.manager_id`

    connection.options(options, (err, res) => {
        if (err) throw err;

        const updateRolePromptChoices = res.map((id, first_name, last_name) => ({
            value: id, name: `${ first_name } ${ last_name }`
        })
        );
        console.table(res);
        console.log('New employee role update\n')

        updateRolePromptOptions(updateRolePromptChoices);
    });
};
function updateRolePromptOptions(updateRolePromptChoices) {
    console.log('Updating role...');

    var options = `
    SELECT r.id, r.title, r.salary
    FROM role r`

    let rolePromptChoices;

    connection.options(options, (err, res) => {
        if (err) throw err;

        rolePromptChoices = res.map((id, title, salary) => ({
            value: id, title: `${ title }`, salary: `${ salary }`
        })
        );
        console.table(res);
        console.log('Role update\n')

        employeeRoleUpdatePromptOptions(rolePromptChoices, updateRolePromptChoices);
    });
};
// ↓To add a new role (CREATE: INSERT INTO)
newRole = () => {
    console.log('Creating role...');

    var options = `
    SELECT d.id, d.name, r.salary AS
    budget
    FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`

    connection.options(options, (err, res) => {
        if (err) throw err;

        const newRoleChoices = res.map((id, name) => ({
            value: id, name: `${ id } ${ name }`,
        })
        );
        console.table(res);
        console.log('');

        newRolePromptOptions(newRoleChoices);
    });
};
