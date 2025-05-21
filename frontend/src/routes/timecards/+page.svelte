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
                <div class="flex flex-row justify-between">
                    <div class="p-4 border-slate-200  w-1/8">
                        <p class="block text-sm text-slate-800">
                            {timecard.timesheet_id}
                        </p>
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
                            {timecard.work_date}
                        </p>
                    </div>
                    <div class="p-4 border-slate-200 flex gap-4 w-1/6 ">
                        <a href="#" class=" text-sm font-semibold text-blue-600 hover:underline text-center">
                            Edit
                        </a>
                        <a href="#" class=" text-sm font-semibold text-blue-600 hover:underline text-center">
                            Generate Invoice
                        </a>
                    </div>
                </div>
                {/each}
            </div>
        </div>
    </div>
