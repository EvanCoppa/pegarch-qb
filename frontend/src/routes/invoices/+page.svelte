<script>
  import { onMount } from "svelte";
  import InvoiceForm from "$lib/components/forms/invoice.svelte";
 
  let projects = [];
  let isShown = false;

  onMount(async () => {
    const res = await fetch("http://localhost:3000/api/invoices");
    if (res.ok) {
      projects = await res.json();
    }
  });

 
 </script>



<!-- Attach to the "New Invoice" button -->
<!-- <svelte:window
  on:keydown={(e) => {
    if (e.key === "Escape") let test = false;
  }}
/> -->

<div class=" flex flex-col w-full h-full overflow-scroll bg-white p-4 overflow-auto">

  <div class="flex flex-row justify-between m-4">
    <h1 class="text-3xl font-semibold my-auto">Invoices</h1>
    <button
      class="w-32 h-10 rounded-lg bg-blue-600 text-white hover:scale-105 hover:bg-blue-500 duration-100"
      on:click={() => {
        isShown = true;
      }}>New Invoice</button
    >
  </div>
  {#if !isShown}
  <div class="w-full text-left">
    <div class="bg-gray-100 rounded-2xl flex flex-row justify-between w-full">
      <div class="p-4 w-1/8">ID</div>
      <div class="p-4 w-1/6">Project Name</div>
      <div class="p-4 w-1/6">Client Name</div>
      <div class="p-4 w-1/6">Total Hours</div>

      <div class="p-4 w-1/6">Action</div>
    </div>
    <div>
      {#each projects as project}
        <div class="flex flex-row justify-between">
          <div class="p-4 w-1/8">
            <p class="block text-sm text-slate-800">
              {project.project_id}
            </p>
          </div>
          <div class="p-4 w-1/6">
            <p class="block text-sm text-slate-800">
              {project.name}
            </p>
          </div>
          <div class="p-4 w-1/6">
            <p class="block text-sm text-slate-800">
              {project.client_name}
            </p>
          </div>
          <div class="p-4 w-1/6">
            <p class="block text-sm text-slate-800">
              {project.total_hours}
            </p>
          </div>

          <div class="p-4 flex gap-4 w-1/6">
            <a href="#" class="block text-sm font-semibold text-blue-600 hover:underline"> Edit </a>
            <a href="#" class="block text-sm font-semibold text-blue-600 hover:underline"> Generate Invoice </a>
          </div>
        </div>
      {/each}
      
    </div>
  </div>
    {:else}
    <div class="w-full h-full flex">
        <div class="m-auto">
    <InvoiceForm />

        </div>

    </div>
      {/if}
      

</div>
