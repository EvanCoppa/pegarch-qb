<script>
  import { onMount } from "svelte";

  let projects = [];
  let row_count = -1;

  function incrementRowCount() {
    row_count++;
  }
  

  onMount(async () => {
    const res = await fetch("http://localhost:3000/api/projects");
    if (res.ok) {
      projects = await res.json();
    }
  });
</script>

   <div class="flex flex-row justify-between m-4">
    <h1 class="text-3xl font-semibold my-auto">Projects</h1>
    
  </div>
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
        <div class="flex flex-row justify-between {row_count % 2 == 0 ? 'bg-gray-50' : ''}">
          <div class="p-4 w-1/8 ">
            <a href="/projects/{project.project_id}" class="block text-sm text-slate-800">
              {project.project_id}
            </a>
          </div>
          <div class="p-4 w-1/6">
            <a href="/projects/{project.project_id}" class="block text-sm text-slate-800">
              {project.name}
            </a>
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
            <a href="#" class="block text-sm font-semibold text-blue-600 hover:underline"> Deactivate </a>
            <a href="/invoices/{project.project_id}" class="block text-sm font-semibold text-blue-600 hover:underline"> Generate Invoice </a>
          </div>
        </div>
        {incrementRowCount()}

      {/each}
    </div>
  </div>
 