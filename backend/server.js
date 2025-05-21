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
app.post('/api/upload-csv', upload.single('file'), (req, res) => {
    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            // Pass results to your business/data layer for processing
            // await dataLayer.saveCsvData(results);
            fs.unlinkSync(filePath); // Clean up uploaded file
            res.json({ message: 'CSV data submitted successfully', count: results.length });
        })
        .on('error', (err) => {
            res.status(500).json({ error: 'Failed to process CSV file' });
        });
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

// get all the projects

app.get('/api/projects', async (req, res) => {
    try {
        const projects = await dataLayer.getProjects();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
}
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});