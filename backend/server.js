import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

import * as dataLayer from './data.js';
import * as businessLayer from './business.js';


// Import your business/data layer modules here
// const dataLayer = require('./dataLayer');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(cors());

// Route to submit CSV form
app.post('/api/upload-csv', upload.array('files'), async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
    }
    // if file is not a csv file
    if (!req.files.every(file => file.mimetype === 'text/csv')) {
        return res.status(400).json({ error: 'Only CSV files are allowed' });
    }
    try {
        const results = await businessLayer.processFiles(req.files);
        dataLayer.saveFiles(results);
        // res.json({ message: 'Files processed successfully', files: results });
        // Uncomment above lines if you want to save and respond
        res.json({ message: 'Files processed successfully', files: results });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process files' });
    }
});

// calculateFinalBillable endpoint
app.post('/api/calculate-billables', (req, res) => {
    const { hours, hourly_rate } = req.body;
    const pegarchBillableRate = 185; 
    const costMultiplier = 3; 
    let realHoursArray = [];
    let finalBillable = [];

    if (typeof hours !== 'object' || typeof hourly_rate !== 'number' || hourly_rate < 0) {
        return res.status(400).json({ error: 'Invalid input data' });
    }
    console.log('Received hours:', hours);
    console.log('Received hourly_rate:', hourly_rate);
    try {
        for (const project_hours of hours) {
            let realHours = businessLayer.calculateBillableHours(project_hours, hourly_rate, pegarchBillableRate, costMultiplier);
            realHoursArray.push(realHours);
            finalBillable.push(businessLayer.calculateFinalBillable(realHours, pegarchBillableRate));
        }
        res.json({realHoursArray , finalBillable });
    } catch (err) {
        res.status(500).json({ error: 'Failed to calculate billable amount ' + err.message });
    }
});

app.post('/api/calculate-billable', (req, res) => {
    const { hours, hourly_rate } = req.body;
    const pegarchBillableRate = 185; 
    const costMultiplier = 3; 
    let realHours = 0;
    let finalBillable = 0;

    if (typeof hours !== 'number' || typeof hourlyRate !== 'number' || hourlyRate < 0) {
        return res.status(400).json({ error: 'Invalid input data' });
    }
    try {
        realHours = businessLayer.calculateBillableHours(hours, hourlyRate, pegarchBillableRate, costMultiplier);
        finalBillable = businessLayer.calculateFinalBillable(realHours, pegarchBillableRate);
        res.json({ realHours, finalBillable });
    } catch (err) {
        res.status(500).json({ error: 'Failed to calculate billable amount' });
    }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
    try {
        const employees = await dataLayer.getEmployees();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

// Get all time cards
app.get('/api/timecards', async (req, res) => {
    try {
        const timecards = await dataLayer.getTimeCards();
        res.json(timecards);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch time cards' });
    }
});

// get time card by id
app.get('/api/timecards/:id', async (req, res) => {
    try {
        const timecard = await dataLayer.getTimeCardById(req.params.id);
        if (!timecard) {
            return res.status(404).json({ error: 'Time card not found' });
        }
        res.json(timecard);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch time card' });
    }
});

// get timecards by project id
app.get('/api/projects/:id/timecards', async (req, res) => {
    try {
        const timecards = await dataLayer.getTimeCardsByProjectId(req.params.id);
        res.json(timecards);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch time cards for project' });
    }
});

// Get a single employee by ID
app.get('/api/employees/:id', async (req, res) => {
    try {
        const employee = await dataLayer.getEmployeeById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch employee' });
    }
});

// Get time cards for a specific employee
app.get('/api/employees/:id/timecards', async (req, res) => {
    try {
        const timecards = await dataLayer.getTimeCardsByEmployeeId(req.params.id);
        res.json(timecards);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch time cards for employee' });
    }
});

app.get('/api/timecarditems/:id', async (req, res) => {
    try {
        
        const timecardItem = await dataLayer.getTimeCardItemById(req.params.id);
        
        res.json(timecardItem);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch time card item' });
    }
});

// get all invoice
app.get('/api/invoices', async (req, res) => {
    try {
        const invoices = await dataLayer.getInvoices();
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
}
);

// get all the invoices by id 
app.get('/api/invoices/:id', async (req, res) => {
    try {
        const invoice = await dataLayer.getInvoiceById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
}
);


// create a new invoice
app.post('/api/invoices', async (req, res) => {
    try {
        const { employee_id, date, amount } = req.body;
        const newInvoice = await dataLayer.createInvoice(employee_id, date, amount);
        res.status(201).json(newInvoice);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create invoice' });
    }
}
);

app.get('/api/projects', async (req, res) => {
    try {
        const projects = await dataLayer.getProjects();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
}
);

app.get('/api/projects/:id', async (req, res) => {
    try {
        const project = await dataLayer.getProjectById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
}
);

app.get('/api/projects/:id/timecard-dates', async (req, res) => {
    try {
        const dates = await dataLayer.getTimeCardDatesByProjectId(req.params.id);
         res.json(dates);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch time card dates for project' });
    }
});

app.post('/api/invoices', async (req, res) => {
    try {
        const { employee_id, date, amount } = req.body;
        if (!employee_id || !date || typeof amount !== 'number') {
            return res.status(400).json({ error: 'Missing or invalid invoice data' });
        }
        const newInvoice = await dataLayer.createInvoice(employee_id, date, amount);
        res.status(201).json(newInvoice);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});