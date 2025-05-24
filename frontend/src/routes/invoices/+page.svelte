<script>
    import { onMount } from 'svelte';

    let projects = [];

    onMount(async () => {
        const res = await fetch('http://localhost:3000/api/invoices');
        if (res.ok) {
            projects = await res.json();
         }
    });
 
 
        let showModal = false;
        let form = {
            name: '',
            client_name: '',
            total_hours: ''
        };
        let error = '';

 
        async function submitInvoice() {
           
        }
    </script>

    {#if showModal}
    <div class="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 class="text-xl font-semibold mb-4">Create New Invoice</h2>
            {#if error}
                <div class="text-red-600 mb-2">{error}</div>
            {/if}
            <!-- <form on:submit|preventDefault={submitInvoice} class="flex flex-col gap-4">
                <input
                    class="border rounded p-2"
                    placeholder="Project Name"
                    bind:value={form.name}
                    required
                />
                <input
                    class="border rounded p-2"
                    placeholder="Client Name"
                    bind:value={form.client_name}
                    required
                />
                <input
                    class="border rounded p-2"
                    placeholder="Total Hours"
                    type="number"
                    min="0"
                    step="0.1"
                    bind:value={form.total_hours}
                    required
                />
                <div class="flex justify-end gap-2 mt-4">
                    <button type="button" class="px-4 py-2 rounded bg-gray-200" on:click={() => showModal = false}>Cancel</button>
                    <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white">Create</button>
                </div>
            </form> -->
        </div>
    </div>
    {/if}

    <button class="hidden" bind:this={modalButton}></button>
     
    <!-- Attach to the "New Invoice" button -->
    <svelte:window on:keydown={(e) => { if (e.key === 'Escape') showModal = false; }} />


    <div class=" flex flex-col w-full h-full overflow-scroll  bg-white    p-4 ">
        <div class="flex flex-row justify-between m-4">
            <h1 class="text-3xl font-semibold my-auto">Invoices</h1>
            <button class="w-32 h-12 rounded-lg bg-blue-600 text-white" on:click={() => {showModal = true}}>New Invoice</button>
        </div>
        <div class="w-full text-left    ">
            <div class="bg-gray-100 rounded-2xl  flex flex-row justify-between w-full">
                     <div class="p-4   w-1/8">
                            ID
                     </div>
                    <div class="p-4   w-1/6">
                             Project Name
                     </div>
                    <div class="p-4   w-1/6">
                             Client Name
                     </div>
                    <div class="p-4   w-1/6">
                             Total Hours
                     </div>
                     
                    <div class="p-4   w-1/6">
                             Action
                     </div>
             </div>
            <div>
                {#each projects as project}
                <div class="flex flex-row justify-between">
                    <div class="p-4   w-1/8">
                        <p class="block text-sm text-slate-800">
                            {project.project_id}
                        </p>
                    </div>
                    <div class="p-4  w-1/6">
                        <p class="block text-sm text-slate-800">
                            {project.name}
                        </p>
                    </div>
                    <div class="p-4  w-1/6">
                        <p class="block text-sm text-slate-800">
                            {project.client_name}
                        </p>
                    </div>
                    <div class="p-4  w-1/6">
                        <p class="block text-sm text-slate-800">
                            {project.total_hours}
                        </p>
                    </div>
                    
                    <div class="p-4  flex gap-4 w-1/6">
                        <a href="#" class="block text-sm font-semibold text-blue-600 hover:underline ">
                            Edit
                        </a>
                        <a href="#" class="block text-sm font-semibold text-blue-600 hover:underline  ">
                            Generate Invoice
                        </a>
                    </div>
                </div>
                {/each}
            </div>
        </div>
    </div>
