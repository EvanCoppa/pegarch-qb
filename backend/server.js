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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});