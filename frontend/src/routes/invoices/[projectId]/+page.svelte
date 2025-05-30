<script>
  import { page } from "$app/state";
  import { onMount } from "svelte";
  const projectId = page.params.projectId;
  console.log(projectId);

  /** @type {import('./$types').PageLoad} */
export function load({ params }) {
  const encoded = params.encoded; // e.g. 'MjM1OSwyNDAzLDI0MDQ='
  const decoded = atob(encoded); // e.g. '2359,2403,2404'
  const projectIds = decoded.split(',').map(id => parseInt(id));
  console.log(projectIds);
  return {
    projectIds
  };
}
</script>
