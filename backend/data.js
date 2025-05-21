

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

export function addProject({ client_id, name, description }) {
    const stmt = db.prepare(
        'INSERT INTO Project (client_id, name, description) VALUES (?, ?, ?)'
    );
    const info = stmt.run(client_id, name, description);
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

// console.log('Employees:', getEmployees());
// console.log('Clients:', getClients());
// console.log('Projects:', getProjects());
// console.log('Timesheets:', getTimesheets());
// console.log('Invoices:', getInvoices());
// console.log('Invoice Items:', getInvoiceItems());