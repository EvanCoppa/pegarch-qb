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