<script>
  import { page } from "$app/state";
  import { onMount } from "svelte";
    import { preloadData, goto } from "$app/navigation";

  const projectId = page.params.projectId;
  let timecards;
  let project = {name: ""};
    let columns = [
    "Id",
    "Name",
    "Hours",
    "Hourly Rate",
    "Start Date",
    "End Date",
    "Actions",
  ];
  function handleDoubbleClick(id) {
    console.log("Double clicked on timesheet with ID:", id);
    goto(`/timecards/${id}`);
  }

  onMount(async () => {
    const res = await fetch("http://localhost:3000/api/projects/" + projectId + "/timecards");
    // fetch project by the projectId
    const resProject = await fetch("http://localhost:3000/api/projects/" + projectId);
     if (res.ok) {
      project = await resProject.json();

      timecards = await res.json();
        console.log(project);
        console.log(timecards);
      timecards.sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        if (dateA < dateB) return -1;
        if (dateA > dateB) return 1;
        // If start dates are equal, sort by employee_name
        return a.employee_name.localeCompare(b.employee_name);
      });

    }
  });
</script>
<div class=" flex flex-col w-full h-full overflow-x-hidden bg-white p-4">
  <div class="flex flex-row justify-between m-4">
    <h1 class="text-3xl font-semibold my-auto">Timecards in {project.name}</h1>
    <div class="flex items-center gap-2">
      
      <div class="w-full md:w-72">
        <div class="relative h-10 w-full min-w-[200px]">
          <div
            class="absolute top-2/4 right-3 grid h-5 w-5 -translate-y-2/4 place-items-center text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              aria-hidden="true"
              class="h-5 w-5"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              ></path></svg
            >
          </div>
          <input  on:input={(e) => {
            projects = masterProjects; // Reset to original projects
            const searchTerm = e.target.value.toLowerCase();
            projects = projects.filter((project) =>
              project[1].toLowerCase().includes(searchTerm)
            );
            console.log(projects); // For debugging purposes
          }}
            class="peer   w-full rounded-[7px] !border-2 border-gray-200 border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-gray-700   outline-0 transition-all placeholder-shown:border placeholder-shown:border-gray-200 placeholder-shown:border-t-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-50"
            placeholder=" "
          /><label
            class=" pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 after:opacity-0 peer-focus:after:opacity-100"
            >Search</label
          >
        </div>
      </div>
    </div>
  </div>
  <div class="relative shadow-md sm:rounded-lg">
    <!-- svelte-ignore component_name_lowercase -->
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-100/70 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="p-4">
            <div class="flex items-center">
              <input
                id="checkbox-all-search"
                type="checkbox"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                on:change={(e) => {
                  const isChecked = e.target.checked;
                  document
                    .querySelectorAll('tbody input[type="checkbox"]')
                    .forEach((checkbox) => {
                      checkbox.checked = isChecked;
                    });
                }}
              />
              <label for="checkbox-all-search" class="sr-only">checkbox</label>
            </div>
          </th>
          {#each columns as column}
            <th scope="col" class="px-6 py-3">
              {column}
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each timecards as timecard, rowIndex}
        {#if timecard.total_hours != 0}
          
          
          
           <tr
            class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 cursor-pointer"
            on:dblclick={() => handleDoubbleClick(timecard.timesheet_id)}
           >
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label for="checkbox-all-search" class="sr-only">checkbox</label
                >
              </div>
            </th>
               <td class="px-6 py-4">
                {timecard.timesheet_id}
              </td>
              <td class="px-6 py-4">
                {timecard.employee_name}
              </td>
              <td class="px-6 py-4">
                {timecard.total_hours}
              </td>
              <td class="px-6 py-4">
                {timecard.employee_hourly_rate}
              </td>
              <td class="px-6 py-4">
                {timecard.start_date}
              </td>
              <td class="px-6 py-4">
                {timecard.end_date}
              </td>
               
             <!-- <td>
              <div
                  class="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-gray-500/20 text-blue-gray-900">
                  <span class="">offline</span>
                </div>
            </td> -->
            <td>
              <div class="flex gap-4">
                
                <button
                  class="text-sm font-semibold w-24 text-white hover:bg-red-500 hover:scale-[102%] duration-150   h-8 min-w-[60px] bg-red-400 rounded-lg"
                >
                  <a href="/" aria-label="Delete Details">Delete</a>
                </button>
              </div>
            </td>
          </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>
</div>

<!-- 
<div class=" flex flex-col w-full h-full overflow-x-hidden bg-white p-4">
  <div class="flex flex-row justify-between m-4">
    <h1 class="text-3xl font-semibold my-auto">All Timesheets from {project.name} </h1>
   </div>
  <div class="w-full text-left">
    <div class="bg-gray-100 rounded-2xl flex flex-row justify-between w-full">
      <div class="p-4 w-1/8">ID</div>
      <div class="p-4 w-1/6">Employee Name</div>
      <div class="p-4 w-1/6">Total Hours</div>
      <div class="p-4 w-1/6">Hourly Rate</div>
      
      <div class="p-4 w-1/6">Work Date</div>
      <div class="p-4 w-1/6">Action</div>
    </div>
    <div>
      {#each timecards as timecard}
        <div class="flex flex-row justify-between">
          <div class="p-4 border-slate-200 w-1/8">
            <a href="/timecards/{timecard.timesheet_id}" hover class="block text-sm text-slate-800 hover:underline">
              {timecard.timesheet_id}
            </a>
          </div>
          <div class="p-4 border-slate-200 w-1/6">
            <p class="block text-sm text-slate-800">
              {timecard.employee_name}
            </p>
          </div>
          <div class="p-4 border-slate-200 w-1/6">
            <p class="block text-sm text-slate-800">
              {timecard.total_hours}
            </p>
          </div>
          <div class="p-4 border-slate-200 w-1/6">
            <p class="block text-sm text-slate-800">
              {timecard.employee_hourly_rate}
            </p>
          </div>
          <div class="p-4 border-slate-200 w-1/6">
            <p class="block text-sm text-slate-800">
              {timecard.start_date + " - " + timecard.end_date}
            </p>
          </div>
          <div class="p-4 border-slate-200 flex gap-4 w-1/6 flex-wrap">
            <button class=" text-sm font-semibold text-white text-center hover:underline grow h-8 min-w-[60px] bg-blue-600 rounded-lg">
              <a href="/" aria-label="Edit Details">Edit</a>
            </button>
            <button class=" text-sm font-semibold text-white text-center hover:underline grow h-8 min-w-[60px] bg-red-600 rounded-lg">
              <a href="/" aria-label="Edit Details">Delete</a>
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div> -->
