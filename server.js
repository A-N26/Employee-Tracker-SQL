const CTable = require('console.table');
require('dotenv').config();

// ↓Module Imports
const connection = require('./connection.js');
const prompt = require('./prompts.js');

// ↓title screen
const inquirer = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');

    // connection.connect()
    connection.connect((err) => {
        if (err) throw err;

        console.log(chalk.magentaBright.bold('==========================================================================================================================================='));
        console.log(``);
        console.log(chalk.cyanBright.bold(figlet.textSync("EMPLOYEE TRACKER")));
        console.log(``);
        console.log(`                          ` + chalk.bgYellowBright.bold('A CONTENT MANAGEMENT SYSTEM (CMS) database'));
        console.log(``);
        console.log(chalk.magentaBright.bold('==========================================================================================================================================='));

        TrackerPrompts();
    });

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓Prompt functions
const TrackerPrompts = () => {
    inquirer.prompt(prompt.TrackerPrompts)
        .then(({ functions }) => {
            switch (functions) {
                case 'View employees':
                    viewEmployeeInfo();
                    break;

                case 'View employees by manager':
                    ViewEmpByMgr();
                    break;

                case 'View departments':
                    viewDptInfo();
                    break;

                case "View departments budget":
                    viewDptBudget();
                    break;

                case 'View employees by department':
                    ViewEmployeeByDpt();
                    break;

                case 'View roles':
                    viewRoleInfo();
                    break;

            //////////////////////////////////////

                case 'Add a new employee':
                    addNewName();
                    break;

                case 'Add a new department':
                    addNewDpt();
                    break;

                case 'Add a new role':
                    addNewRole();
                    break;

            //////////////////////////////////////

                case 'Update employee role':
                    updateRole();
                    break;

                case 'Update employee manager':
                    updateEmpMgr();
                    break;

            //////////////////////////////////////

                case 'Remove employee':
                    deleteName();
                    break;

                case 'Remove department':
                    deleteDpt();
                    break;

                case 'Remove role':
                    deleteRole();
                    break;

            //////////////////////////////////////

                case 'Finish':
                    console.log(chalk.bgGreenBright('task completed.'));

                    connection.end(console.log(chalk.redBright.bold(figlet.textSync('Good BYE !'))));
                    break;
            }
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓To see list employee info.

const viewEmployeeInfo = () => {
    console.log(chalk.blueBright('Showing available employee Info\n...'));

    var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
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
        console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

        TrackerPrompts();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓To see list of employees by Manager.

const ViewEmpByMgr = () => {
    console.log(chalk.blueBright('Showing a list of employees by manager\n...'));

    var query = `SELECT e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
    ON m.id = e.manager_id
    GROUP BY e.manager_id`;

    connection.query(query, (err, res) => {
        if (err) throw err;

        const EmpMgr = res
            .filter((mgr) => mgr.manager_id)
            .map(({ manager_id, manager }) => ({
                value: manager_id,
                name: manager,
            }));

        inquirer.prompt(prompt.EmpByMgr(EmpMgr))
            .then((answer) => {
                console.log(answer);

                var query = `SELECT * FROM employee ORDER BY manager_id DESC`;

                connection.query(query, answer.managerId, (err, res) => {
                    if (err) throw err;

                    console.table(res);
                    console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

                    TrackerPrompts();
                });
            });
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓ To see department info.

const viewDptInfo = () => {
    console.log(chalk.blueBright('Showing list of departments...\n'));

    var query = 'SELECT * FROM department';

    connection.query(query, (err, res) => {
        if (err) throw err;

        console.log(chalk.blue(`\nDepartments:\n`));

        res.forEach((department) => {
            console.log(chalk.blue(`ID: ${department.id} > ${department.name} Department`));
        });

        console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

        TrackerPrompts();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓ To see department's budget.

const viewDptBudget = () => {
    console.log(chalk.blueBright('Disclosing budget by department...\n'));

    var query =
        `SELECT department_id, role.salary FROM role`;

    connection.query(query, (err, res) => {
        if (err) throw err;

        console.log(chalk.blue(`\nDepartment Budgets:\n`));

        res.forEach((role) => {
            console.log(chalk.blue(`${role.department_id} | Salary: ${ role.salary }\n`));
        });

        console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

        TrackerPrompts();
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓To see list of employees by department.

const ViewEmployeeByDpt = () => {
    console.log(chalk.blueBright('Showing a list  employees by department\n...'));

    var query = `SELECT d.id, d.name
    FROM employee e
    LEFT JOIN role r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`;

    connection.query(query, (err, res) => {
        if (err) throw err;

        const EmpDpt = res
            .map((data) => ({
            value: data.id,
            name: data.name,
            }));

        inquirer.prompt(prompt.EmpByDpt(EmpDpt))
            .then((answer) => {
                console.log(answer);

                var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department
                FROM employee e
                JOIN role r
                ON e.role_id = r.id
                JOIN department d
                ON d.id = r.department_id
                WHERE d.id =?`;

                connection.query(query, answer.departmentId, (err, res) => {
                    if (err) throw err;

                    console.table(res);
                    console.log(chalk.bgBlueBright('Please select a new prompt!\n'));

                    TrackerPrompts();
                });
            })
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓ To see role info.

const viewRoleInfo = () => {
    console.log(chalk.blueBright('Listing all roles...\n'));

    var query =
        // `SELECT * FROM role`;

        `SELECT r.id, r.title, d.name department, r.salary
        FROM role r
        JOIN department d
        ON r.department_id = d.id`;

    connection.query(query, (err, res) => {
        if (err) throw err;

        console.log(chalk.blue(`\nRoles:\n`));

        res.forEach((role) => {
            console.log(chalk.blue(`id: ${role.id} > title: ${role.title}\n salary: ${role.salary}\n`));
        });

        console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

        TrackerPrompts();
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓To add a new employee.

const addNewName = () => {
    console.log(chalk.blueBright('Adding a new employee\n...'));

    // Employee's role
    let RoleList = [];

    connection.query(`SELECT * FROM role`, (err, res) => {
        if (err) throw err;

        res.forEach((role) => {
            RoleList.push(`${ role.id } | ${ role.title }`);
        });
        // Employee's info
        inquirer.prompt(prompt.NewEmployee(RoleList))
            .then((answer) => {
                const query = `INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)`;

                const answers = [ answer.first_name, answer.last_name, answer.role_id ];

                connection.query(query, answers,
                    (err, res) => {
                        if (err) throw err;

                        console.log('\n' + res.affectedRows + 'employee info logged');

                        console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

                        TrackerPrompts();
                    },
                );
            });
    });

};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓To add a new department.

const addNewDpt = () => {
    console.log(chalk.blueBright('Adding a new department\n...'));

    inquirer.prompt(prompt.NewDpt())
        .then((answer) => {
            var query = `INSERT INTO department (name) VALUES (?)`;

            connection.query(query, [answer.department], (err, res) => {
                if (err) throw err;

                console.log(`New department added: ${answer.department.toUpperCase()}`);
            });
            console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

            TrackerPrompts();
        });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓To add a new role.

const addNewRole = () => {
    console.log(chalk.blueBright('Adding a new role\n...'));

    var query = `SELECT * FROM department`;

    connection.query(query, (err, res) => {
        if (err) throw err;

        const EmpDpt = res.map(({ id, name }) => ({
            value: id,
            name: `${id} | ${name}`,
        }));

        inquirer.prompt(prompt.NewRole(EmpDpt))
            .then((answer) => {
                var query = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

                connection.query(query,
                    {
                        title: answer.roleName,
                        Salary: answer.rolePay,
                        department_id: answer.departmentId,
                    },
                    (err, res) => {
                        if (err) throw err;

                        console.log('\n' + res.affectedRows + ''+ 'New role created.');

                        console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

                        TrackerPrompts();
                    },
                );
            });
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓To update employee role.

const updateRole = () => {
    console.log(chalk.blueBright('Updating role(s)\n...'));
    let RoleUp = [];
    connection.query(`SELECT id, first_name, last_name FROM employee`, (err, res) => {
        if (err) throw err;

        res.forEach((detail) => {
            RoleUp.push(`${ detail.id } | ${ detail.first_name } | ${ detail.last_name }`);
        });
        let Position = [];
        connection.query(`SELECT id, title FROM role`, (err, res) => {
            if (err) throw err;

            res.forEach((detail) => {
                Position.push(`${detail.id} | ${ detail.title }`);
            });

            inquirer.prompt(prompt.EmpRoleUp(RoleUp, Position))
                .then((answer) => {
                    let idNum = parseInt(answer.role_update);
                    let roleNum = parseInt(answer.job_position);

                    connection.query(`UPDATE employee SET role_id = ${roleNum} WHERE id = ${idNum}`, (err, res) => {
                            if (err) throw err;

                            console.log('\n') + res.affectedRows + 'Update successful.';

                            console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

                            TrackerPrompts();
                        }
                    );
                });
        });
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓To update employee manager.

const updateEmpMgr = () => {
    console.log(chalk.blueBright('Updating employee manager(s)\n...'));
    let EmpMgr = [];

    connection.query(`SELECT id, first_name, last_name FROM employee`,
        (err, res) => {
            res.forEach((detail) => {
                EmpMgr.push(`${ detail.id } | ${ detail.first_name} | ${ detail.last_name }`);
            });

            inquirer.prompt(prompt.EmpMgrUp(EmpMgr))
                .then((answer) => {
                    let idNum = parseInt(answer.update);
                    let managerNum = parseInt(answer.manager);

                    connection.query(`UPDATE employee SET manager_id = ${ managerNum } WHERE id = ${ idNum }`, (err, res) => {
                        if (err) throw err;

                        console.log('\n') + res.affectedRows + 'Update successful.';

                        console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

                        TrackerPrompts();
                    },
                );
            });
        },
    );
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓To remove employee.

const deleteName = () => {
    console.log(chalk.blueBright('Deleting Employee(s)\n...'));

    var query = `SELECT e.id, e.first_name, e.last_name FROM employee e`;

    connection.query(query, (err, res) => {
        if (err) throw err;

        const RemoveEmp = res.map(({
            id, first_name, last_name }) => ({
            value: id,
            name: `${id} | ${first_name} | ${last_name}`,
        }));

        inquirer.prompt(prompt.EmpDelete(RemoveEmp))
            .then((answer) => {
                var query = `DELETE FROM employee WHERE ?`;

                connection.query(query, { Id: answer.employeeId},(err, res) => {
                    if (err) throw err;

                    console.log('\n') + res.affectedRows + 'Employee deleted.';

                    console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

                    TrackerPrompts();
                });
            });
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓To remove department.

const deleteDpt = () => {
    console.log(chalk.blueBright('Deleting department(s)\n...'));

    var query = `SELECT e.id, e.name FROM department e`;

    connection.query(query, (err, res) => {
        if (err) throw err;

        const RemoveDpt = res.map(({ id, name }) => ({
            value: id,
            name: `${id} | ${name}`,
        }));

        inquirer.prompt(prompt.DptDelete(RemoveDpt))
            .then((answer) => {
                var query = `DELETE FROM department WHERE ?`;

                connection.query(query, { id: answer.departmentId }, (err, res) => {
                    if (err) throw err;

                    console.log('\n') + res.affectedRows + 'department deleted.';

                    console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

                    TrackerPrompts();
                });
            });
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// ↓To remove role.

const deleteRole = () => {
    console.log(chalk.blueBright('Deleting role(s)\n...'));

    var query = `SELECT e.id, e.title, e.salary, e.department_id FROM role e`;

    connection.query(query, (err, res) => {
        if (err) throw err;

        const RemoveRole = res.map(({ id, title }) => ({
            value: id,
            name: `${id} | ${title}`,
        }));

        inquirer.prompt(prompt.RoleDelete(RemoveRole))
            .then((answer) => {
                var query = `DELETE FROM role WHERE ?`;

                connection.query(query, { id: answer.roleId }, (err, res) => {
                    if (err) throw err;

                    console.log('\n') + res.affectedRows + 'role removed.';

                    console.log(chalk.bgBlueBright('\nPlease select a new prompt!\n'));

                    TrackerPrompts();
                });
            });
    });
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
