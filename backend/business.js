export function calculateBillableHours(hours, hourlyRate, pegarchBillableRate, costMultiplier) {
return Math.round(costMultiplier * hours * (hourlyRate / pegarchBillableRate));
}

export function calculateFinalBillable(billablelHours, pegarchBillableRate) {
  return Math.round(billablelHours * pegarchBillableRate * 100) / 100;
}

// Inputs
// const hours = 10;
// const hourlyRate = 24;
// const pegarchBillableRate = 185;
// const costMultiplier = 3;

// const realHours = calculateBillableHours(hours, hourlyRate, pegarchBillableRate, costMultiplier);
//  const finalBillable = calculateFinalBillable(realHours, pegarchBillableRate, costMultiplier);

// console.log(`Real Hours: ${realHours}`);    
// console.log(`Final Billable: $${finalBillable}`);       

import { promises as fs } from 'fs';

async function parseCSVFile(filePath) {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const lines = fileContent.trim().split('\n');
  const [first, last] = lines[0].split(' ').map(v => v.trim()).slice(0, 2);
  const name = `${first} ${last}`;
   

  const headers = lines[2].split(',').map(h => h.trim());
  const data = [];
  data.push({ name: name });

 
  for (let i = 1; i < lines.length; i++) {
     if (!lines[i].trim()) continue;
    const row = lines[i].split(',').map(cell => cell.trim());
     const obj = {};
    headers.forEach((header, idx) => {
      obj[header] = row[idx];
    });
    data.push(obj);
  }
  return data;
}


export async function processFiles(files) {
  // files = req.files from multer
  const results = [];
  for (const file of files) {
    const parsed = await parseCSVFile(file.path);
    // console.log('Parsed data:', parsed);
     results.push({
      originalName: file.originalname,
      data: parsed
    });
   }
   return await results;
}

 
    
