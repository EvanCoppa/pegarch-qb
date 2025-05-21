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