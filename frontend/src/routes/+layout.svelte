<script>
	import '../app.css';
	
	let { children } = $props();
	import Header from '$lib/components/header.svelte';
	import Sidebar from '$lib/components/sidebar.svelte';
</script>

<Header/>
<div class="flex ">
<Sidebar/>

{@render children()}
</div>
 