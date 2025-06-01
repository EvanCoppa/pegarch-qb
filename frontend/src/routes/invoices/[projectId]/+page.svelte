<script>
  import { page } from "$app/state";
  import { onMount } from "svelte";
  let projects = [];
  let dateCombinations = [];
  let columns = ["Timesheet Id", "Name"];

  function getUniqueDateCombos() {
    const combos = new Set();
    projects.forEach((project) => {
      if (project.timesheets) {
        project.timesheets.forEach((ts) => {
          combos.add(`${ts.start_date}|${ts.end_date}`);
        });
      }
    });
    return Array.from(combos).map((str) => {
      const [start_date, end_date] = str.split("|");
      return { start_date, end_date };
    });
  }

  function handleInvoiceGeneration() {
    // Select all checkboxes in the table body
    const checkboxes = document.querySelectorAll('tbody input[type="checkbox"]');
    let checkedCount = Array.from(checkboxes).filter((cb) => cb.checked).length;

    const selectedRows = [];
    checkboxes.forEach((cb, idx) => {
      if (cb.checked) {
        selectedRows.push(projects[idx]);
      }
    });
    console.log("Selected rows data:", selectedRows);
    if (selectedRows.length > 0) {
      const encoded = btoa(selectedRows.join("|"));
      goto(`/invoices/${encoded}`);
    }
  }

  function selectCheckboxesByDate(startDate, endDate) {
    // Find all rows in all tables
    document.querySelectorAll("tbody tr").forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 2) {
        const rowStart = cells[0].textContent.trim();
        const rowEnd = cells[1].textContent.trim();
        if (rowStart === startDate && rowEnd === endDate) {
          const checkbox = row.querySelector('input[type="checkbox"]');
          if (checkbox) {
            checkbox.checked = !checkbox.checked;
          }
        }
      }
    });
  }

  onMount(async () => {
    const results = page.params.projectId;
    let projectDetails = atob(results);
    projectDetails = projectDetails.split("|");
    projects = projectDetails.map((item) => {
      const [id, name, totalHours, tags] = item.split(",");
      return {
        project_id: parseInt(id),
        name: name,
        total_hours: parseFloat(totalHours),
        tags: tags ? tags.split(";") : [],
      };
    });
    // console.log("Project", projects);
    for (const project of projects) {
      // console.log(project);
      const res = await fetch(`http://localhost:3000/api/projects/${project.project_id}/timecard-dates`);
      if (res.ok) {
        const timesheet = await res.json(); // Assuming this is an array of timecards
        project.timesheets = timesheet; // Add as a new property to the project object
        projects = projects;
      }
    }
    dateCombinations = getUniqueDateCombos();
  });
</script>

<!-- 
{#if projects.length != 0}
  <div class="flex flex-col">
    {#each projects as project}
    <div class="flex flex-row justify-between m-2">
            <h1 class="text-3xl font-semibold my-auto">{project.project_id} {project.name}</h1>
          </div>
      {#if project.timesheets && project.timesheets.length > 0}
        <div class="flex flex-col w-full overflow-x-hidden bg-white p-4">
          {#each project.timesheets as timesheet}
            <h2>
              {timesheet.start_date} - {timesheet.end_date} - Total Hours: {timesheet.total_hours}
            </h2>
          {/each}
        </div>
      {:else}
        <div class="flex flex-col w-full h-full overflow-x-hidden bg-white p-2">
          <div class="flex flex-row justify-between m-4">
            <h1 class="text-3xl font-semibold my-auto">No Projects Found</h1>
          </div>
        </div>
      {/if}
    {/each}
  </div>
{/if} -->
{#if projects.length != 0}
  <div class="flex flex-row-reverse justify-between gap-4 p-4 bg-white ">
    <div class="rounded-2xl overflow-hidden flex flex-col w-1/3 bg-white">
      <img
        src="https://images.unsplash.com/photo-1655313491837-332c9d87c33a?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        class="w-full h-56"
      />
      <div class="flex m-4 gap-4">
        {#each dateCombinations as combination}
          <div class="h-12 w-24 flex bg-gray-100 rounded-xl text-center cursor-pointer">
            <span class="m-auto" on:click={() => selectCheckboxesByDate(combination.start_date, combination.end_date)}>{combination.start_date} - {combination.end_date}</span>
          </div>
        {/each}
      </div>
    </div>

    <div class="flex flex-col w-full max-h-screen h-screen overflow-auto scrollbar-hide max-w-2/3 pb-24  gap-4">
      <div class="flex flex-row justify-between m-4">
        <h1 class="text-2xl font-bold text-gray-800 my-auto">Projects</h1>
        <button
          class="px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          on:click={() => handleInvoiceGeneration()}
        >
          Submit All
        </button>
      </div>

      {#each projects as project}
        <form class=" bg-white p-4 rounded-2xl flex flex-col gap-4 border border-gray-200 border-dashed border-2 shadow-sm">
          <div class="flex flex-row justify-between">
            <h1 class="text-xl ml-2 font-semibold my-auto">{project.project_id}: {project.name}</h1>
            <div>
              <button class="h-8 w-24 border-2 border-gray-100 hover:border-gray-200 rounded-md text-sm text-gray-800 font-medium">
                Submit  
              </button>
              <!-- <button class="h-8 w-24 border-2 border-gray-100 hover:border-gray-200 rounded-md text-sm text-gray-800 font-medium">
                Submit All
              </button> -->
            </div>
          </div>

            <table class="w-full text-sm text-left   text-gray-500 dark:text-gray-400 table-fixed rounded-lg overflow-hidden ">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
              <tr>
              <th scope="col" class="p-4">
                <div class="flex items-center gap-4">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  on:change={(e) => {
                  const isChecked = e.target.checked;
                  document.querySelectorAll('tbody input[type="checkbox"]').forEach((checkbox) => {
                    checkbox.checked = isChecked;
                  });
                  }}
                />
                </div>
              </th>
              <th scope="col" class="px-6 py-3 truncate"> Start Date </th>
              <th scope="col" class="px-6 py-3 truncate"> End Date </th>
              <th scope="col" class="px-6 py-3 truncate"> Total Hours </th>
              </tr>
            </thead>
            <tbody>
              {#each project.timesheets as row, rowIndex}
              <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-100 cursor-pointer">
                <th scope="col" class="p-4">
                <div class="flex items-center gap-4">
                  <input
                  id="checkbox-all-search"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
                </th>
                <td class="px-6 py-4 truncate">
                {row.start_date}
                </td>
                <td class="px-6 py-4 truncate">
                {row.end_date}
                </td>
                <td class="px-6 py-4 truncate">
                {row.total_hours}
                </td>
              </tr>
              {/each}
            </tbody>
            </table>
         </form>
      {/each}
    </div>
  </div>
{/if}

<style>
  /* Hide scrollbar for Chrome, Safari and Opera */
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .scrollbar-hide {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
