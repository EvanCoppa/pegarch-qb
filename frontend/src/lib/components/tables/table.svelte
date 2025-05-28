<script>
  import { onMount } from "svelte";

  export let title = "Projects"; // Dynamic title
  export let columns = []; // Dynamic column headers
  export let data = []; // Dynamic data
  console.log("Table component initialized with title:", data);


</script>
<div class="flex flex-row justify-between m-4">
  <h1 class="text-3xl font-semibold my-auto">{title}</h1>
  
</div>
<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
  <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        {#each columns as column}
          <th scope="col" class="px-6 py-3">
            {column}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data as row, rowIndex}
        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
          {#each row as cell, cellIndex}
            <td class="px-6 py-4">
              {cell}
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
