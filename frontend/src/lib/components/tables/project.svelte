<script>
  import { onMount } from "svelte";

  let projects = [];

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
        <div class="flex flex-row justify-between">
          <div class="p-4 w-1/8">
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
            <a href="#" class="block text-sm font-semibold text-blue-600 hover:underline"> Edit </a>
            <a href="#" class="block text-sm font-semibold text-blue-600 hover:underline"> Generate Invoice </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
 