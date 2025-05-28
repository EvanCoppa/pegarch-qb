<script>
    import { onMount } from "svelte";
    import table from "$lib/components/tables/table.svelte";
  import Table from "$lib/components/tables/table.svelte";
  let projects = [];

  onMount(async () => {
    const res = await fetch("http://localhost:3000/api/projects");
    if (res.ok) {
      projects = await res.json();
    projects = projects.map(({ project_id, client_name, name }) => [project_id, client_name, name]);
    //   console.log(projects);
    }
  });
</script>

<div class=" flex flex-col w-full h-full overflow-x-hidden bg-white p-4">
{#if projects.length === 0}
  <p class="text-center text-gray-500">No projects available.</p>
{:else}
<Table title="Test Table"
       columns={["Project Id", "client_name", "Name"]}
       data={projects}/>  
        {/if}


</div>