<script>
  import { onMount } from "svelte";
  import { preloadData, goto } from "$app/navigation";

  import table from "$lib/components/tables/table.svelte";
  import Table from "$lib/components/tables/table.svelte";
  let projects = [];
  let masterProjects = [];
  let columns = [
    "Project Id",
    "Project Name",
    "Total Hours",
    "Tags",
    "Actions",
  ];

  onMount(async () => {
    const res = await fetch("http://localhost:3000/api/projects");
    if (res.ok) {
      projects = await res.json();
      projects = projects.map(({ project_id, name, total_hours, tags }) => [
        project_id,
        name,
        total_hours,
        tags,
      ]);
      //   console.log(projects);
      masterProjects = projects; // Store the original projects array
    }
  });
</script>

<div class=" flex flex-col w-full h-full overflow-x-hidden bg-white p-4">
  <div class="flex flex-row justify-between m-4">
    <h1 class="text-3xl font-semibold my-auto">Projects</h1>
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
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
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
        {#each projects as row, rowIndex}
          <!-- svelte-ignore a11y_mouse_events_have_key_events -->
          <tr
            class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200 cursor-pointer"
            on:dblclick={() => goto(`/projects/${row[0]}`)}
            on:mouseenter={() => preloadData(`/projects/${row[0]}`)}
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
                <button
                  class="text-sm font-semibold text-white grow h-8 min-w-[60px] hover:bg-blue-500 hover:scale-[102%] duration-150 bg-blue-400 rounded-lg"
                >
                  <a href="/" aria-label="Edit Details">Edit</a>
                </button>
                <button
                  class="text-sm font-semibold text-white hover:bg-red-500 hover:scale-[102%] duration-150 grow h-8 min-w-[60px] bg-red-400 rounded-lg"
                >
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
