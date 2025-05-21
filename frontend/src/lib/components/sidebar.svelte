<script>
    import { page } from '$app/stores';
    import { derived } from 'svelte/store';

    const activeRoute = derived(page, ($page) => {
        const path = $page.url.pathname;
        if (path.startsWith('/projects')) return 'projects';
        if (path.startsWith('/timecards')) return 'timecards';
        if (path.startsWith('/employees')) return 'employees';
        return '';
    });
</script>

<div class="h-screen w-1/6 bg-white text-black border-r-1 border-[#e3e4e8] p-4 gap-5 flex flex-col">
    <div class="flex gap-2">
        <h2 class="font-semibold dark:text-white text-lg ">
            Portland Team 
        </h2>
        <img class="h-4 w-4 my-auto" src="https://img.icons8.com/?size=100&id=39786&format=png&color=000000" alt="">
    </div>
  
    <div class="text-lg">
        <ul class="flex flex-col gap-2 text-md text-zinc-800">
            <li class="flex gap-1.5 p-1 rounded-md"
                class:bg-zinc-100={$activeRoute === 'projects'}>
                <img class="h-6 w-6 my-auto" src="https://img.icons8.com/?size=100&id=abkJPDVb45pz&format=png&color=27272a" alt="">
                <a href="/projects" class=""> Projects</a>
            </li>
            <li class="flex gap-1.5 p-1 rounded-md"
                class:bg-zinc-100={$activeRoute === 'timecards'}>
                <img class="h-6 w-6 my-auto" src="https://img.icons8.com/?size=100&id=FUtYT5lI7IQN&format=png&color=27272a" alt="">
                <a href="/timecards" class=" ">Timecards</a>
            </li>
            <li class="flex gap-1.5 p-1 rounded-md"
                class:bg-zinc-100={$activeRoute === 'employees'}>
                <img class="h-6 w-6 my-auto" src="https://img.icons8.com/?size=100&id=aqA6WUt1iktl&format=png&color=27272a" alt="">
                <a href="/employees" class="">Employees</a>
            </li>
        </ul>
    </div>
</div>
