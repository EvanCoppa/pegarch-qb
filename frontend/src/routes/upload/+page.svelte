<script lang="ts">
    import Confetti from 'svelte-confetti';
    let files: File[] = [];
    let fileInput: HTMLInputElement;
    let isDragging = false;
          let isConfettiActive = false;

    

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        isDragging = false;
        isConfettiActive = true;
        setTimeout(() => {
            isConfettiActive = false;
        }, 3000);
        
        
        if (event.dataTransfer?.files) {
            files = Array.from(event.dataTransfer.files);
        }
    }

    function handleDragOver(event: DragEvent) {
        event.preventDefault();
    }

    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target.files) {
            files = Array.from(target.files);
        }
    }

    function openFileDialog() {
        fileInput.click();
    }

    async function uploadFiles() {
        if (files.length === 0) return;
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        try {
            const response = await fetch('http://localhost:3000/api/upload-csv', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                alert('Upload failed');
            } else {
                alert('Upload successful');
                files = [];
            }
        } catch (error) {
            alert('An error occurred during upload');
        }
    }
</script>
<div class="w-full h-screen bg-gray-50 flex">

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
    class="h-[60vh] w-[60vw] border-2 border-black border-dashed mx-auto mt-[15vh] flex flex-col justify-center items-center rounded-2xl transition-colors duration-200"
    class:bg-blue-100={isDragging}
     on:drop={handleDrop}
    on:dragover={handleDragOver}
    on:dragenter={() => isDragging = true}
>
{#if isConfettiActive}
<Confetti x={[-0.5, 0.5]} y={[-0.5, 0.5]}  fallDistance=50px  amount={75} />
    {/if}
    <div class="flex flex-row gap-2 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-4-4l4 4m0 0l-4 4m4-4H7" />
        </svg>
        <span>Drag and drop your timecards in csv format here! 🎉</span>
    </div>
    <input 
        type="file" 
        multiple 
        class="hidden" 
        bind:this={fileInput} 
        on:change={handleFileChange}
    />
    <div class="flex flex-row gap-2 mb-4">
        <button
            class="px-4 py-2 border rounded transition-colors duration-200 hover:bg-blue-500 hover:text-white active:scale-95"
            on:click={openFileDialog}
        >
            Select Files
        </button>
        <button
            class="px-4 py-2 border rounded transition-colors duration-200 hover:bg-indigo-500 hover:text-white active:scale-95"
            on:click={uploadFiles}
            disabled={files.length === 0}
        >
            Upload
        </button>
    </div>
    {#if files.length > 0}
        <ul class="mt-2">
            {#each files as file}
                <li>{file.name}</li>
            {/each}
        </ul>
    {/if}
</div>
</div>
