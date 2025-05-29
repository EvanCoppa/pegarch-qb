<script>
  import { page } from "$app/state";
  import { onMount } from "svelte";
  const timecardId = page.params.timecardId;
  let timecard_items;
  let timecard = { approved: 0, employee_hourly_rate: 0, employee_id: 4, employee_name: "", end_date: "", notes: "", start_date: "", timesheet_id: 0, total_hours: 0 };
  let hoursArray = [];
  let finalBillablePrices = [];
  let row_count = 0;

function incrementRowCount() {
    row_count++;
  }

  onMount(async () => {
    const res = await fetch("http://localhost:3000/api/timecarditems/" + timecardId);
    const resTimecard = await fetch("http://localhost:3000/api/timecards/" + timecardId);
    if (res.ok) {
      timecard_items = await res.json();
      timecard = await resTimecard.json();

      let hours_result = timecard_items.map(item => item.hours);
      const response = await fetch("http://localhost:3000/api/calculate-billables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hours: hours_result,
          hourly_rate: timecard.employee_hourly_rate
        })
      });
      if (response.ok) {
        let data = await response.json();
        hoursArray = data.realHoursArray;
		console.log(hoursArray);
		 
	  } else {
		console.error("Failed to fetch billable hours");
        

	  }
      
    }
  });
</script>


<div class=" flex flex-col w-full h-full overflow-scroll bg-white p-4 ">
  <div class="flex flex-row justify-between m-4">
    <h1 class="text-3xl font-semibold my-auto">All Items from {timecard.employee_name}'s Timesheet {timecard.start_date} {timecard.end_date}</h1>
  </div>
  <div class="w-full text-left">
    <div class="bg-gray-100 rounded-2xl flex flex-row justify-between w-full">
      <div class="p-4 w-1/8">ID</div>
      <div class="p-4 w-1/6">Project Name</div>
      <div class="p-4 w-1/6">Total Hours</div>

      <div class="p-4 w-1/6">Total Billable Hours</div>

      <div class="p-4 w-1/6">Action</div>
    </div>
    <div>
      {#each timecard_items as timecard_item}
      {#if timecard_item.hours != 0}
      {incrementRowCount()}
        <div class="flex flex-row justify-between {row_count % 2 == 0 ? 'bg-gray-50' : ''}">
          <div class="p-4 w-1/8">
            <p class="block text-sm text-slate-800">
              {timecard_item.project_id}
            </p>
          </div>
          <div class="p-4 w-1/6">
            <p class="block text-sm text-slate-800">
              {timecard_item.project_name}
            </p>
          </div>
    
          <div class="p-4 w-1/6">
            <p class="block text-sm text-slate-800 text-right mr-24">
              {timecard_item.hours?.toFixed(1)}
            </p>
          </div>
		  {#if hoursArray[timecard_items.indexOf(timecard_item)]}
          <div class="p-4 w-1/6">
            <p class="block text-sm text-slate-800 mr-12 text-right">
				 
              {hoursArray[timecard_items.indexOf(timecard_item)]}
            </p>
          </div>
		  {/if}
          <div class="p-4 border-slate-200 flex gap-4 w-1/6 flex-wrap">
            <button class="text-sm font-semibold text-white text-center hover:underline grow h-8 min-w-[60px] bg-blue-600 rounded-lg">
              <a href="/" aria-label="Edit Details">Edit</a>
            </button>
            <button class="text-sm font-semibold text-white text-center hover:underline grow h-8 min-w-[60px] bg-red-600 rounded-lg">
              <a href="/" aria-label="Delete Details">Delete</a>
            </button>
          </div>
        </div>
      {/if}
    {/each}
    
    </div>
  </div>
</div>
