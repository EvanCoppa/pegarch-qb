<script>
	import '../app.css';
	
	let { children } = $props();
	import Header from '$lib/components/header.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';
</script>
<div class="overflow-hidden h-screen flex flex-col ">

<Header/>
<div class="flex overflow-hidden h-screen ">
 
<Sidebar/>

{@render children()}
</div>
</div>
