<script>
  import { page } from "$app/state";
  import { onMount } from "svelte";
  let projects = [];
  let columns = ["Timesheet Id", "Name"];

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
  <div class="flex flex-col  gap-8 w-full bg-gray-100 p-4 overflow-auto h-screen">
      {#each projects as project}
          <section class="mx-auto w-1/2">

        <div class="flex flex-row justify-between m-2">
          <h1 class="text-3xl font-semibold my-auto">{project.project_id}: {project.name}</h1>
        </div>

        <table class=" w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed ">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="p-4">
                <div class="flex items-center">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600  "
                    on:change={(e) => {
                      const isChecked = e.target.checked;
                      document.querySelectorAll('tbody input[type="checkbox"]').forEach((checkbox) => {
                        checkbox.checked = isChecked;
                      });
                    }}
                  />
                  <label for="checkbox-all-search" class="sr-only">checkbox</label>
                </div>
              </th>
              <th scope="col" class="px-6 py-3 truncate"> Start Date </th>
              <th scope="col" class="px-6 py-3 truncate"> End Date </th>
              <th scope="col" class="px-6 py-3 truncate"> Total Hours </th>
            </tr>
          </thead>
          <tbody>
            {#each project.timesheets as row, rowIndex}
              <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 cursor-pointer">
                <th scope="col" class="p-4">
                  <div class="flex items-center">
                    <input
                      id="checkbox-all-search"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label for="checkbox-all-search" class="sr-only">checkbox</label>
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
        <button class="m-4 h-10 w-24 rounded-lg bg-blue-500 text-white">Submit</button>
            </section>

      {/each}
  </div>
{/if}
