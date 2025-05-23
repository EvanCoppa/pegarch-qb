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
//     hours         REAL NOT NULL,
//     hourly_rate   REAL NOT NULL,
//     approved      INTEGER DEFAULT 0, -- 0 = unapproved, 1 = approved
//     notes         TEXT,
//     FOREIGN KEY (employee_id) REFERENCES Employee(employee_id),
//     FOREIGN KEY (project_id) REFERENCES Project(project_id)
// );

// CREATE TABLE "TimesheetItem" (
// 	"timesheet_item_id"	INTEGER,
// 	"timesheet_id"	INTEGER NOT NULL,
// 	"project_id"	INTEGER NOT NULL,
// 	"hours"	REAL NOT NULL,
// 	"notes"	TEXT,
// 	PRIMARY KEY("timesheet_item_id" AUTOINCREMENT),
// 	FOREIGN KEY("project_id") REFERENCES "Project"("project_id"),
// 	FOREIGN KEY("timesheet_id") REFERENCES "Timesheet"("timesheet_id")
// );

import Database from "better-sqlite3";
import e from "express";

let db;
try {
  db = new Database("../database.sqlite");
} catch (error) {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
}

// Print all tables and their rows
function printAllTables() {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';").all();
  console.log("Tables:", tables);
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
  return db.prepare("SELECT * FROM Employee").all();
}

// Get all clients
export function getClients() {
  return db.prepare("SELECT * FROM Client").all();
}

// Get all projects
export function getProjects() {
  return db
    .prepare(
      `
        SELECT 
            Project.*, 
            Client.name AS client_name,
            IFNULL(SUM(TimesheetItem.hours), 0) AS total_hours
        FROM Project
        JOIN Client ON Project.client_id = Client.client_id
        LEFT JOIN TimesheetItem ON TimesheetItem.project_id = Project.project_id
        GROUP BY Project.project_id
        `
    )
    .all();
}

function getProjectIdByName(name) {
  const stmt = db.prepare("SELECT project_id FROM Project WHERE name = ?");
  const project = stmt.get(name);
  return project;
}

// Get all timesheets
export function getTimeCards() {
    return db
        .prepare(
            `
                SELECT 
                        Timesheet.*, 
                        Employee.employee_id AS employee_id, 
                        Employee.name AS employee_name,
                        Employee.hourly_rate AS employee_hourly_rate,
                        IFNULL(SUM(TimesheetItem.hours), 0) AS hours
                FROM Timesheet
                JOIN Employee ON Timesheet.employee_id = Employee.employee_id
                LEFT JOIN TimesheetItem ON Timesheet.timesheet_id = TimesheetItem.timesheet_id
                GROUP BY Timesheet.timesheet_id
            `
        )
        .all();
}

// Get all timesheet items by timesheet ID
export function getTimeCardItemById(timesheet_id) {
    return db
        .prepare(
        `
            SELECT 
                TimesheetItem.*, 
                Project.name AS project_name,
                Employee.name AS employee_name
            FROM TimesheetItem
            JOIN Project ON TimesheetItem.project_id = Project.project_id
            JOIN Timesheet ON TimesheetItem.timesheet_id = Timesheet.timesheet_id
            JOIN Employee ON Timesheet.employee_id = Employee.employee_id
            WHERE TimesheetItem.timesheet_id = ?
        `
        )
        .all(timesheet_id);
    }

function getEmployeeByName(name) {
  const stmt = db.prepare("SELECT * FROM Employee WHERE name = ?");
  const employee = stmt.get(name);
  return employee;
}

// Get all invoices
export function getInvoices() {
  return db.prepare("SELECT * FROM Invoice").all();
}

// Get all invoice items
export function getInvoiceItems() {
  return db.prepare("SELECT * FROM InvoiceItem").all();
}

export function addEmployee({ name, email, role }) {
  const stmt = db.prepare("INSERT INTO Employee (name, email, role) VALUES (?, ?, ?)");
  const info = stmt.run(name, email, role);
  return info.lastInsertRowid;
}

export function addClient({ client_id, name, contact_name, contact_email }) {
  console.log("Adding client:", client_id, name, contact_name, contact_email);

  const intClientId = parseInt(client_id, 10);

  const stmt = db.prepare("INSERT INTO Client (client_id, name, contact_name, contact_email) VALUES (?, ?, ?, ?)");
  const info = stmt.run(intClientId, name, contact_name, contact_email);
  return info.lastInsertRowid;
}

export function addProject({ client_id, name, description }) {
  let stmt, info;

  stmt = db.prepare("INSERT INTO Project (client_id, name, description) VALUES (?, ?, ?)");
  info = stmt.run(client_id, name, description);

  return info.lastInsertRowid;
}

export function addTimesheet({ employee_id, approved = 0, notes, start_date, end_date }) {
  const stmt = db.prepare("INSERT INTO Timesheet (employee_id, approved, notes, start_date, end_date) VALUES (?, ?, ?, ?, ?)");
  const info = stmt.run(employee_id, approved, notes, start_date, end_date);
  return info.lastInsertRowid;
}

export function addTimesheetItem({ timesheet_id, project_id, hours, notes }) {
  console.log("Adding timesheet item:", timesheet_id);
  console.log("Project ID:", project_id);
  console.log("Hours:", hours);
  console.log("Notes:", notes);
  const stmt = db.prepare("INSERT INTO TimesheetItem (timesheet_id, project_id, hours, notes) VALUES (?, ?, ?, ?)");
  //   console.log(
  //     "Adding timesheet item:",
  //     timesheet_id,
  //     project_id,
  //     hours,
  //     notes
  //   );
  const info = stmt.run(timesheet_id, project_id, hours, notes);
  return info.lastInsertRowid;
}

export function addInvoice({ client_id, invoice_date, due_date, total_amount, status = "pending" }) {
  const stmt = db.prepare("INSERT INTO Invoice (client_id, invoice_date, due_date, total_amount, status) VALUES (?, ?, ?, ?, ?)");
  const info = stmt.run(client_id, invoice_date, due_date, total_amount, status);
  return info.lastInsertRowid;
}

export function addInvoiceItem({ invoice_id, timesheet_id, description, hours, hourly_rate, amount }) {
  const stmt = db.prepare("INSERT INTO InvoiceItem (invoice_id, timesheet_id, description, hours, hourly_rate, amount) VALUES (?, ?, ?, ?, ?, ?)");
  const info = stmt.run(invoice_id, timesheet_id, description, hours, hourly_rate, amount);
  return info.lastInsertRowid;
}



function ensureProject(project_name, client_id = 0) {
  const projects = getProjects();
  const numericClientId = Number(client_id);

  // console.log('Ensuring project:', project_name, 'for client:', numericClientId);
  const existingProjects = new Set(projects.map((p) => p.name));
  // console.log('Existing project names:', existingProjects);
  if (existingProjects.has(project_name)) {
    return;
  }
  // Create new project with same client and description, but new name
  addProject({
    client_id: numericClientId,
    name: project_name,
    description: "",
  });
}

function ensureClient(client_id) {
  const clients = getClients();
  const existingClients = new Set(clients.map((c) => Number(c.client_id)));
  const numericClientId = Number(client_id);

  let found = existingClients.has(numericClientId);

  if (!found && numericClientId !== 0) {
    addClient({
      client_id: numericClientId,
      name: "New Client",
      contact_name: "N/A",
      contact_email: "N/A",
    });
  }
}

export function saveFiles(files) {
  const projects = files.map((file) => file.data).flat();
  const name = projects[0].name;
  projects.splice(0, 1);
  const employee = getEmployeeByName(name);
  const timesheet_id = addTimesheet({ employee_id: employee.employee_id, approved: 0, notes: "", start_date: "2023-01-01", end_date: "2023-01-01",});
  for (const project of projects) {
    if (!project.Projects || project.Projects === "" || project.Projects === "Projects" || project.Projects === "Totals:") {
      continue;
    }
    const [client_id, ...nameParts] = project.Projects.split(" ");
    const project_name = nameParts.join(" ");

    ensureClient(client_id);
    ensureProject(project_name, client_id);
    delete project.Projects;
    if (project_name) {
      let hours = 0;
      for (let date in project) {
        if (date != "Pay Period Total" && !isNaN(parseFloat(project[date]))) {
          hours = hours + parseFloat(project[date]);
        }
      }
      addTimesheetItem({ timesheet_id: timesheet_id, project_id: getProjectIdByName(project_name).project_id, hours: hours, notes: "None", });
    }
  }

  return [];
}
