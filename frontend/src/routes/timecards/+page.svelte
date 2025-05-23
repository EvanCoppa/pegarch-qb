<script>
    import { onMount } from 'svelte';

    let timecards = [];

    onMount(async () => {
        const res = await fetch('http://localhost:3000/api/timecards');
        if (res.ok) {
            timecards = await res.json();
        }
    });
</script>



    <div class=" flex flex-col w-full h-full overflow-scroll  bg-white     p-4 ">
        <div class="w-full text-left    ">
            <div class="bg-gray-100 rounded-2xl  flex flex-row justify-between w-full">
                     <div class="p-4   w-1/8">
                             ID
                     </div>
                    <div class="p-4   w-1/6">
                             Employee Name
                     </div>
                    <div class="p-4   w-1/6">
                             Total Hours
                     </div>
                    <div class="p-4   w-1/6">
                             Hourly Rate
                     </div>
                    <div class="p-4   w-1/6">
                             Work Date
                     </div>
                    <div class="p-4   w-1/6">
                             Action
                     </div>
             </div>
            <div>
                {#each timecards as timecard}
                <div class="flex flex-row justify-between ">
                    <div class="p-4 border-slate-200  w-1/8">
                        <a href="/timecards/{timecard.timesheet_id}" hover class="block text-sm text-slate-800 hover:underline">
                            {timecard.timesheet_id}
                        </a>
                    </div>
                    <div class="p-4 border-slate-200 w-1/6">
                        <p class="block text-sm text-slate-800">
                            {timecard.employee_name}
                        </p>
                    </div>
                    <div class="p-4 border-slate-200 w-1/6">
                        <p class="block text-sm text-slate-800">
                            {timecard.hours}
                        </p>
                    </div>
                    <div class="p-4 border-slate-200 w-1/6">
                        <p class="block text-sm text-slate-800">
                            {timecard.employee_hourly_rate}
                        </p>
                    </div>
                    <div class="p-4 border-slate-200 w-1/6">
                        <p class="block text-sm text-slate-800">
                            {timecard.start_date + ' - ' + timecard.end_date}
                        </p>
                    </div>
                    <div class="p-4 border-slate-200 flex gap-4 w-1/6 flex-wrap ">
                        <button  class=" text-sm font-semibold text-white text-center hover:underline  grow h-8 min-w-[60px]  bg-blue-600 rounded-lg">
                            <a href="/" aria-label="Edit Details">Edit</a>
                        </button>
                        <button  class=" text-sm font-semibold text-white text-center hover:underline grow h-8 min-w-[60px] bg-red-600 rounded-lg">
                            <a href="/" aria-label="Edit Details">Delete</a>
                        </button>
                    </div>
                </div>
                {/each}
            </div>
        </div>
    </div>
