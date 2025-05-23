<script>
  import { page } from "$app/state";
  import { onMount } from "svelte";
  const timecardId = page.params.timecardId;
  let timecard_items;

  onMount(async () => {
    const res = await fetch("http://localhost:3000/api/timecarditems/" + timecardId);
    if (res.ok) {
     timecard_items = await res.json();
    }
  });
</script>

<p>this component is {timecardId}</p>
