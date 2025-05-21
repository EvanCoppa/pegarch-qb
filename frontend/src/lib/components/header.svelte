<script>
    import logo from "$lib/assets/logo.svg";
</script>

<header
    class="flex flex-row justify-between bg-[#ffffff] h-12 px-4 text-black p-2 border-b-1 border-[#e3e4e8]"
>
    <div class="flex flex-row gap-3 w-1/3">
        <div class=" bg-black h-6 w-6 rounded-sm flex my-auto">
            <img
                class="m-auto object-contain h-4 w-4"
                src={logo}
                alt=""
                style="filter:  invert(1);"
            />
        </div>
        <div class="flex">
            <span class="m-auto text-sm">Pegarch Studio</span>
        </div>
        <div class="bg-gray-100 flex h-6 my-auto rounded-sm px-2 mx-2 border-1 border-gray-200 hover:bg-gray-200 hover:border-gray-300">
            <a href="/upload" class="m-auto text-sm text-gray-700">
                <span>Create</span>
                <span>+</span>
            </a>
        </div>
    </div>
    <nav class="flex w-1/3">
        <ul class="flex flex-row gap-4 m-auto text-sm text-gray-700">
            <li><a href="/">Home</a></li>
            <li><a href="/upload">Upload</a></li>
            <li><a href="/contact">Dash</a></li>
        </ul>
    </nav>
    <div class="flex w-1/3 gap-2">
        <button class="bg-gray-200 text-black text-sm px-4 rounded ml-auto">
            Sign Up
        </button>
        <button class="bg-[#141414] text-white text-sm px-4 rounded">
            Sign In
        </button>
    </div>
</header>
