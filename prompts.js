module.exports = {
    TrackerPrompts: {

        type: 'list',
        name: 'functions',
        message: 'What would you like to do?:',
        choices:
            [
                'View employees',
                'View employees by manager',
                'View departments',
                'View departments budget',
                'View employees by department',
                'View roles',
                //////////////////////////////////
                'Add a new employee',
                'Add a new department',
                'Add a new role',
                //////////////////////////////////
                'Update employee role',
                'Update employee manager',
                //////////////////////////////////
                'Remove employee',
                'Remove department',
                'Remove role',
                //////////////////////////////////
                'Finish'
            ]
    },

    // View employee by manager.
    EmpByMgr: (EmpMgr) => [
        {
            type: 'list',
            name: 'MgrID',
            message: 'Please select a manager.',
            choices: EmpMgr
        }
    ],

    // View employee by department.
    EmpByDpt: (EmpDpt) => [
        {
            type: 'list',
            name: 'departmentId',
            message: 'Please select a department.',
            choices: EmpDpt
        }
    ],

    // Add a new employee.
    NewEmployee: (RoleList) => [
        // Employee's first_name
        {
            name: 'first_name',
            type: 'input',
            message: 'Please enter the first name of the employee.',
        },
        // Employee's last_name
        {
            name: 'last_name',
            type: 'input',
            message: 'Please enter the sur name of the employee.',
        },
        // Employee's role
        {
            name: 'role_id',
            type: 'list',
            message: 'What role would you like to assigned the employee to?',
            choices: RoleList,
        },
    ],

    // Add a new department.
    NewDpt: () => [
        {
            name: 'department',
            type: 'input',
            message: 'Please enter new department name'
        }
    ],

    // Add a new role.
    NewRole: (EmpDpt) => [
        {
            type: 'input',
            name: 'roleTitle',
            message: 'Please enter a name for the new role.',
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: 'Please specify the budget for the new role.',
        },
        {
            type: 'list',
            name: 'departmentId',
            message: 'Which department does this role belong to?',
            choices: EmpDpt
        }
    ],

    // Update employee role.
    EmpRoleUp: (RoleUp, Position) => [
        {
            type: 'list',
            name: 'role_update',
            message: 'Please choose an employee to update the role of.',
            choices: RoleUp,
        },
        {
            type: 'list',
            name: 'Job_Position',
            message: "Please choose the employee's job position.",
            Choices: Position,
        }
    ],

    // Update employee manager.
    EmpMgrUp: (EmpMgr) => [
        {
            type: 'list',
            name: 'update',
            message: 'Which employee manager would you like to update?',
            choices: EmpMgr
        },
        {
            type: 'list',
            name: 'manager',
            message: 'choose a new manager for the employee.',
            choices: EmpMgr
        }
    ],

    // Remove employee.
    EmpDelete: (RemoveEmp) => [
        {
            type: 'list',
            name: 'employeeId',
            message: 'Please select an employee to delete.',
            choices: RemoveEmp
        }
    ],

    // Remove department.
    DptDelete: (RemoveDpt) => [
        {
            type: 'list',
            name: 'departmentId',
            message: 'please select a department to delete.',
            choices: RemoveDpt
        }
    ],

    // Remove role.
    RoleDelete: (RemoveRole) => [
        {
            type: 'list',
            name: 'roleId',
            message: 'Please select a role to delete.',
            choices: RemoveRole
        }
    ],
};