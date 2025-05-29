<script>
  import { onMount } from "svelte";
  import { preloadData, goto } from '$app/navigation';

  import table from "$lib/components/tables/table.svelte";
import Table from "$lib/components/tables/table.svelte";
let projects = [];
let masterProjects = [];
let columns=["Project Id", "Project Name", "Total Hours", "Tags" ,"Actions"]

onMount(async () => {
  const res = await fetch("http://localhost:3000/api/projects");
  if (res.ok) {
    projects = await res.json();
  projects = projects.map(({ project_id, name,  total_hours, tags}) => [project_id, name, total_hours, tags]);
  //   console.log(projects);
  masterProjects = projects; // Store the original projects array

  }
});
</script>

<div class=" flex flex-col w-full h-full overflow-x-hidden bg-white p-4">
  
 
  
  <div class="flex flex-row justify-between m-4">
    <h1 class="text-3xl font-semibold my-auto">Projects</h1>
    <div class="flex items-center gap-2">
      <label for="search" class="text-sm font-medium text-gray-700">Search</label>
      <input
      id="search"
      type="text"
      class="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Search projects..."
      on:input={(e) => {
        projects = masterProjects; // Reset to original projects
        const searchTerm = e.target.value.toLowerCase();
        projects = projects.filter(project =>
        project[1].toLowerCase().includes(searchTerm));
        console.log(projects); // For debugging purposes
      }}
      />
    </div>
  </div>
  <div class="relative shadow-md sm:rounded-lg">
    <!-- svelte-ignore component_name_lowercase -->
    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        
        <tr>
          <th scope="col" class="p-4">
            <div class="flex items-center">
              <input 
                id="checkbox-all-search" 
                type="checkbox" 
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                on:change={(e) => {
                const isChecked = e.target.checked;
                document.querySelectorAll('tbody input[type="checkbox"]').forEach(checkbox => {
                  checkbox.checked = isChecked;
                });
                }}
              >
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

        {#each projects as row, rowIndex}
            <!-- svelte-ignore a11y_mouse_events_have_key_events -->
            <tr 
            class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 cursor-pointer"
            on:dblclick={() => goto(`/projects/${row[0]}`)}
            on:mouseenter={() => preloadData(`/projects/${row[0]}`)}
            >
            <th scope="col" class="p-4">
              <div class="flex items-center" >
                  <input  id="checkbox-all-search" type="checkbox" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
                  <label for="checkbox-all-search" class="sr-only" >checkbox</label>
              </div>
          </th>
            {#each row as cell, cellIndex}
  
              <td class="px-6 py-4">
                {cell}
              </td>
            {/each}
            <!-- <td>
              <div
                  class="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-gray-500/20 text-blue-gray-900">
                  <span class="">offline</span>
                </div>
            </td> -->
            <td>
              <div class="flex gap-4">
                <button class="text-sm font-semibold text-white   grow h-8 min-w-[60px] hover:bg-blue-500 hover:scale-[102%] duration-150 bg-blue-400 rounded-lg">
                  <a href="/" aria-label="Edit Details">Edit</a>
                </button>
                <button class="text-sm font-semibold text-white  hover:bg-red-500 hover:scale-[102%] duration-150 grow h-8 min-w-[60px] bg-red-400 rounded-lg">
                  <a href="/" aria-label="Delete Details">Delete</a>
                </button>
              </div>
            </td>
          </tr>
        {/each}
  
      </tbody>
    </table>
  </div>

</div>
