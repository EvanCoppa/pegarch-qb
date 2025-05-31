<script>
  import { page } from "$app/state";
  import { onMount } from "svelte";
  let projects = [];

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

{#if projects.length != 0}
  <div class="flex flex-col">
    {#each projects as project}
      {#if project.timesheets && project.timesheets.length > 0}
        <div class="flex flex-col w-full overflow-x-hidden bg-white p-4">
          <div class="flex flex-row justify-between m-4">
            <h1 class="text-3xl font-semibold my-auto">{project.project_id} {project.name}</h1>
          </div>
          {#each project.timesheets as timesheet}
            <h2>
              {timesheet.start_date} - {timesheet.end_date} - Total Hours: {timesheet.total_hours}
            </h2>
          {/each}
        </div>
      {:else}
        <div class="flex flex-col w-full h-full overflow-x-hidden bg-white p-4">
          <div class="flex flex-row justify-between m-4">
            <h1 class="text-3xl font-semibold my-auto">No Projects Found</h1>
          </div>
        </div>
      {/if}
    {/each}
  </div>
{/if}
