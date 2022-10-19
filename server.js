// mysql connection
const mysql = require('mysql2');
require('console.table');
require('dotenv').config();
// Mysql connection using .env variables
const connection = mysql.createConnection({
    host: 'localhost',
    // Replace port # with your port number.
    port: process.env.DB_PORT || 8080,
    // Replace user with your username in env variables file.
    user: process.env.DB_USER,
    // Replace password in env variables file with your password.
    password: process.env.DB_PW,
    // database created in schema.sql
    // Replace name in env variables file with your db name.
    database: process.env.DB_NAME,
});

////////////////////////////////////////////////////

// title screen
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
// connection.connect()
connection.connect(() => {
    console.log(chalk.blackBright.bold('==========================================================================================================================================='));
    console.log(``);
    console.log(chalk.cyanBright.bold(figlet.textSync("EMPLOYEE TRACKER")));
    console.log(``);
    console.log(`` + chalk.yellowBright.bold('A CONTENT MANAGEMENT SYSTEM (CMS) database!'));
    console.log(``);
    console.log(chalk.blackBright.bold('==========================================================================================================================================='));
    OpeningPrompts();
});

////////////////////////////////////////////////////

// ↓Initial selection prompts.
const OpeningPrompts = () => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'functions',
            message: 'What would you like to do?',
            choices:
                [
                'View Employees',
                'Show employees by department',
                'Add new employee',
                'Remove employees',
                'Update employee roles',
                'Add role',
                'Finish',
                ],
        },
    )
    .then(({ functions }) => {
        switch (functions) {
            case 'View employees':
                viewEmployeeInfo();
                break;

            case 'Show employees by department':
                ShowEmployeeByDpt();
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
                connection.end(console.log(chalk.redBright.bold(figlet.textSync('BYE!'))));
            }
    });
};

////////////////////////////////////////////////////

// ↓To see employee info.
viewEmployeeInfo = () => {
    console.log('Showing available employee Info\n...');

    var query = `
        SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, join(m.first_name +, '', + m.last_name) AS manager
        FROM employee e
        LEFT JOIN role r
        ON e.role_id = r.id
        LEFT JOIN department d
        ON d.id = r.department_id
        LEFT JOIN employee m
        ON m.id = e.manager_id`;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        console.log('Showing available employee Info!\n');

        OpeningPrompts();
    });
};
////////////////////////////////////////////////////
// ↓Select department prompt.
DptPrompt = (DptPromptChoices) => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'DptID',
            message: 'Please select a department.',
            choices: DptPromptChoices
        }
    )
    .then((answer) => {
            console.log('answer', answer.dptId);

            var query = `
                SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
                FROM employee e
                JOIN role r
                ON e.role_id = r.id
                JOIN department d
                ON d.id = r.department_id
                WHERE d.id = ?`

            connection.query(query, answer.dptID, (err, res) => {
                if (err) throw err;
                console.table('result', res);
                console.log(res.Row + "employee name charting by departments done!\n");

                OpeningPrompts();
            })
    })
};
// ↓To view employee info by department.
ShowEmployeeByDpt = () => {
    console.log('Viewing employee info by department!\n');

    var query =`
        SELECT d.id, d.name, r.salary AS budget
        FROM employee e
        LEFT JOIN role r
        ON e.role_id = r.id
        LEFT JOIN department d
        ON d.id = r.department_id
        GROUP BY d.id, d.name`

    connection.query(query, (err, res) => {
        if (err) throw err;
        const DptPrompt = res.map(data => ({
            value: data.id, name: data.name
        }));
        console.table(res);
        console.log('Showing employee info by department!\n');

        DptPrompt (DptPromptChoices)
    });
};
////////////////////////////////////////////////////
// ↓Add employee prompt.
rolePrompt = (rolePromptChoices) => {
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

            var query = `INSERT INTO employee SET ?`

            connection.query(query,
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.roleId,
                    manager_id: answer.managerId,
                },
                (err, res) => {
                    if (err) throw err;

                    console.table(res);
                    console.log(res.newRow + 'successfully added.\n');

                    OpeningPrompts();
                }
            )
        });
};
// ↓To add an employee.
addNewName = () => {
    console.log('Adding employee...');

    var query = `
        SELECT r.id, r.title, r.salary
        FROM role r`

    connection.query(query, (err, res) => {
        if (err) throw err;

        const rolePromptChoices = res.map((id, title, salary) => ({
            value: id, title: `${ title }`, salary: `${ salary }`
        })
        );
        console.table(res);
        console.log('Showing employee...\n');

        rolePrompt(rolePromptChoices)
    });
};
////////////////////////////////////////////////////
// ↓Delete employee prompt.
deleteNamePrompt = (deleteNamePromptChoices) => {
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
            var options = `DELETE FROM employee Where ?`;

            connection.query(options, { id: answer.employeeId },
                (err, res) => {
                    if (err) throw err;

                    console.table(res);
                    console.log(res.Row + 'Removed\n');

                    OpeningPrompts();
                }
            )
        });
};
// ↓To remove/DELETE an employee.
deleteName = () => {
    console.log('Removing employee...');

    var query = `
        SELECT e.id, e.first_name, e.last_name
        FROM employee e`

    connection.query(query, (err, res) => {
        if (err) throw err;

        const deleteNamePromptChoices = res.map((id, first_name, last_name) => ({
            value: id, name: `${ id } ${ first_name } ${ last_name }`
        })
        );
        console.table(res);
        console.log('Deleting employee info...\n');

        deleteNamePrompt(deleteNamePromptChoices);
    });
};
////////////////////////////////////////////////////
// ↓Update employee role prompt.
employeeRoleUpdatePrompt = (updateRoleChoices, updateEmployeeRole) => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'employeeId',
            message: 'Which employee would you like to update the role of?',
            choices: updateEmployeeRole
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'Which role would you like to update?',
            choices: updateRoleChoices
        },
    )
        .then((answer) => {
            console.log(answer);

            var query = `
            UPDATE employee SET role_id = ?
            WHERE id = ?`

            connection.query(query, [answer.roleId, answer.employeeId], (err, res) => {
                if (err) throw err;

                console.table(res);
                console.log(res.Row + 'successfully updated.');

                OpeningPrompts();
            }
            );
        });
};
// ↓To UPDATE an employee role.
updateRole = () => {
    employeeList();
};
employeeList = () => {
    console.log("Updating employee role");

    var query = `
        SELECT  e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, join(m.first_name, + '', + m.last_name) AS manager
        FROM employee e
        JOIN role r
        ON e.role_id = r.id
        JOIN department d
        ON d.id = r.department_id
        JOIN employee m
        ON m.id = e.manager_id`

    connection.query(query, (err, res) => {
        if (err) throw err;

        const updateEmployeeRole = res.map((id, first_name, last_name) => ({
            value: id, name: `${ first_name } ${ last_name }`
        })
        );
        console.table(res);
        console.log('New employee role update\n')

        updateRoleList(updateEmployeeRole);
    });
};
updateRoleList = (updateEmployeeRole) => {
    console.log('Updating role...');

    var query = `
    SELECT r.id, r.title, r.salary
    FROM role r`

    let updateRoleChoices;

    connection.query(query, (err, res) => {
        if (err) throw err;

        updateRoleChoices = res.map((id, title, salary) => ({
            value: id, title: `${ title }`, salary: `${ salary }`
        })
        );
        console.table(res);
        console.log('Role update\n')

        employeeRoleUpdatePrompt(updateRoleChoices, updateEmployeeRole);
    });
};
////////////////////////////////////////////////////
// ↓Add new Role prompt.
newRolePrompt = (DptPromptChoices) => {
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
            choices: DptPromptChoices
        },
    )
        .then(answer => {
            var query = ` INSERT INTO role SET ?`

            connection.query(query, {
                title: answer.title,
                salary: answer.salary,
                department_id: answer.departmentId
            },
                (err, res) => {
                    if (err) throw err;
                    console.table(res);
                    console.log('New role added.');

                    openingPrompts();
                }
            );
        });
};
// ↓To add a new role (CREATE: INSERT INTO)
newRole = () => {
    console.log('Creating role...');

    var query = `
    SELECT d.id, d.name, r.salary AS
    budget
    FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`

    connection.query(query, (err, res) => {
        if (err) throw err;

        const DptPromptChoices = res.map((id, name) => ({
            value: id, name: `${ id } ${ name }`,
        })
        );
        console.table(res);
        console.log('');

        newRolePrompt(DptPromptChoices);
    });
};
