

// -- Employees (techs/workers)
// CREATE TABLE Employee (
//     employee_id   INTEGER PRIMARY KEY AUTOINCREMENT,
//     name          TEXT NOT NULL,
//     email         TEXT,
//     role          TEXT
// );

// -- Clients (customers)
// CREATE TABLE Client (
//     client_id     INTEGER PRIMARY KEY AUTOINCREMENT,
//     name          TEXT NOT NULL,
//     contact_name  TEXT,
//     contact_email TEXT
// );

// -- Projects (each job, optional but recommended for scalability)
// CREATE TABLE Project (
//     project_id    INTEGER PRIMARY KEY AUTOINCREMENT,
//     client_id     INTEGER NOT NULL,
//     name          TEXT NOT NULL,
//     description   TEXT,
//     FOREIGN KEY (client_id) REFERENCES Client(client_id)
// );

// -- Timesheets (where uploaded CSVs land, one entry per work log)
// CREATE TABLE Timesheet (
//     timesheet_id  INTEGER PRIMARY KEY AUTOINCREMENT,
//     employee_id   INTEGER NOT NULL,
//     project_id    INTEGER NOT NULL,
//     work_date     DATE NOT NULL,
//     hours         REAL NOT NULL,
//     hourly_rate   REAL NOT NULL,
//     approved      INTEGER DEFAULT 0, -- 0 = unapproved, 1 = approved
//     notes         TEXT,
//     FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
//     FOREIGN KEY (project_id) REFERENCES Project(project_id)
// );

// -- Invoices (one per client per billing period)
// CREATE TABLE Invoice (
//     invoice_id    INTEGER PRIMARY KEY AUTOINCREMENT,
//     client_id     INTEGER NOT NULL,
//     invoice_date  DATE NOT NULL,
//     due_date      DATE,
//     total_amount  REAL,
//     status        TEXT DEFAULT 'pending', -- e.g., 'pending', 'paid', 'overdue'
//     FOREIGN KEY (client_id) REFERENCES Client(client_id)
// );

// -- Invoice line items (links each invoice to the timesheet items being billed)
// CREATE TABLE InvoiceItem (
//     invoice_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
//     invoice_id      INTEGER NOT NULL,
//     timesheet_id    INTEGER,
//     description     TEXT,
//     hours           REAL,
//     hourly_rate     REAL,
//     amount          REAL,
//     FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id),
//     FOREIGN KEY (timesheet_id) REFERENCES Timesheet(timesheet_id)
// );

import Database from 'better-sqlite3';


let db;
try {
    db = new Database('../database.sqlite');
} catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
}

// Print all tables and their rows
function printAllTables() {
    const tables = db.prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';"
    ).all();
    console.log('Tables:', tables);
    for (const { name } of tables) {
        const rows = db.prepare(`SELECT * FROM ${name}`).all();
        console.log(`Table: ${name}`);
        console.table(rows);
    }
}

// Test: print all tables
// printAllTables();


// Get all employees
export function getEmployees() {
    return db.prepare('SELECT * FROM Employee').all();
}

// Get all clients
export function getClients() {
    return db.prepare('SELECT * FROM Client').all();
}

// Get all projects
export function getProjects() {
    return db.prepare(`
        SELECT 
            Project.*, 
            Client.name AS client_name,
            IFNULL(SUM(Timesheet.hours), 0) AS total_hours
        FROM Project
        JOIN Client ON Project.client_id = Client.client_id
        LEFT JOIN Timesheet ON Timesheet.project_id = Project.project_id
        GROUP BY Project.project_id
    `).all();
}

// Get all timesheets
export function getTimeCards() {
    return db.prepare(`
        SELECT 
            Timesheet.*, 
            Employee.employee_id AS employee_id, 
            Employee.name AS employee_name,
            Employee.hourly_rate AS employee_hourly_rate,
            Project.project_id AS project_id,
            Project.name AS project_name
        FROM Timesheet
        JOIN Employee ON Timesheet.employee_id = Employee.employee_id
        JOIN Project ON Timesheet.project_id = Project.project_id
    `).all();
}

function getEmployeeByName(name) {
    const stmt = db.prepare('SELECT * FROM Employee WHERE name = ?');
    const employee = stmt.get(name);
    return employee;
}

// Get all invoices
export function getInvoices() {
    return db.prepare('SELECT * FROM Invoice').all();
}

// Get all invoice items
export function getInvoiceItems() {
    return db.prepare('SELECT * FROM InvoiceItem').all();
}


export function addEmployee({ name, email, role }) {
    const stmt = db.prepare(
        'INSERT INTO Employee (name, email, role) VALUES (?, ?, ?)'
    );
    const info = stmt.run(name, email, role);
    return info.lastInsertRowid;
}

export function addClient({ name, contact_name, contact_email }) {
    const stmt = db.prepare(
        'INSERT INTO Client (name, contact_name, contact_email) VALUES (?, ?, ?)'
    );
    const info = stmt.run(name, contact_name, contact_email);
    return info.lastInsertRowid;
}

export function addProject({ project_id, client_id, name, description }) {
    let stmt, info;
    if (project_id !== undefined && project_id !== null) {
        stmt = db.prepare(
            'INSERT INTO Project (project_id, client_id, name, description) VALUES (?, ?, ?, ?)'
        );
        info = stmt.run(project_id, client_id, name, description);
    } else {
        stmt = db.prepare(
            'INSERT INTO Project (client_id, name, description) VALUES (?, ?, ?)'
        );
        info = stmt.run(client_id, name, description);
    }
    return info.lastInsertRowid;
}

export function addTimesheet({ employee_id, project_id, work_date, hours, hourly_rate, approved = 0, notes }) {
    const stmt = db.prepare(
        'INSERT INTO Timesheet (employee_id, project_id, work_date, hours, hourly_rate, approved, notes) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    const info = stmt.run(employee_id, project_id, work_date, hours, hourly_rate, approved, notes);
    return info.lastInsertRowid;
}

export function addInvoice({ client_id, invoice_date, due_date, total_amount, status = 'pending' }) {
    const stmt = db.prepare(
        'INSERT INTO Invoice (client_id, invoice_date, due_date, total_amount, status) VALUES (?, ?, ?, ?, ?)'
    );
    const info = stmt.run(client_id, invoice_date, due_date, total_amount, status);
    return info.lastInsertRowid;
}

export function addInvoiceItem({ invoice_id, timesheet_id, description, hours, hourly_rate, amount }) {
    const stmt = db.prepare(
        'INSERT INTO InvoiceItem (invoice_id, timesheet_id, description, hours, hourly_rate, amount) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const info = stmt.run(invoice_id, timesheet_id, description, hours, hourly_rate, amount);
    return info.lastInsertRowid;
}

// Ensure all projects are split and created if needed
export function conformProjects() {
    const projects = getProjects();
    const existingNames = new Set(projects.map(p => p.name));
    console.log('Existing project names:', existingNames);
    for (const project of projects) {
        console.log('Processing project:', project);
        // if (!project.name.includes(' ')) continue;
        // const [first, second, ...rest] = project.name.split(' ');
        // if (!second) continue;
        // const newName = second + (rest.length ? ' ' + rest.join(' ') : '');
        // if (existingNames.has(newName)) continue;
        // // Create new project with same client and description, but new name
        // addProject({
        //     client_id: project.client_id,
        //     name: newName,
        //     description: project.description
        // });
        // existingNames.add(newName);
    }
}

// Files: [
//   {
//     originalName: '1.06 - 1.19-Table 1.csv',
//     data: [
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object]
//     ]
//   }
// ]

export function saveFiles(files){
    const currentProjects = getProjects();
    const existingNames = new Set(currentProjects.map(p => p.name));
    // console.log('Existing project names:', existingNames);
    const projects = files.map(file => file.data).flat();
    const name = projects[0].name;
    projects.splice(0, 1);
    // get person by name from the database
    const employee = getEmployeeByName(name);
     console.log('Employee:', employee);

 
    // console.log('Projects:', projects);
    
    for (const project of projects) {
        const [project_id, ...nameParts] = project.Projects.split(' ');
        const project_name = nameParts.join(' ');
        delete project.Projects;
        if (project_name){
        // Check if the project already exists
        if (existingNames.has(project_name)) {
            // console.log('Project already exists:', project_name);
        }else{
            // Create new project with same client and description, but new name
            addProject({ project_id: project_id,
                client_id: 0,
                name: project_name,
                description: ""
            });}
            existingNames.add(project_name);
         // create a timesheet   
         for (let date in project){
            let hours = 0;
            if (date != 'Pay Period Total'){
                hours = hours + parseFloat(project[date]);
            // add up the hours work for each date and then get the real ours and add them to the timesheet as a time sheet line item
                // console.log(project_name + ': Date(' + date + ') ' + 'Hours(' + project[date] + ')');
            }
            // console.log('Adding timesheet for project:', project_name);
            // console.log('Hours:', hours);
        }
    }
    }

    return []
 }