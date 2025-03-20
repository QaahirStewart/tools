<template>
  <div class="bg-black mx-auto p-4 h-screen flex flex-col justify-center items-center ">
    <div class=" font-bold text-center my-25 w-full flex justify-center items-center ">
      <ToolsSvg class="md:w-full w-sm" />
    </div>

    <div class="flex justify-center items-center  space-x-12 w-full ">
      <NuxtLink to="/polls"
        class="md:size-36 size-30  items-center justify-center bg-[#BFD6E8] hover:bg-[#6097BE] text-[#4A79A5] hover:text-[#2A517A] md:text-2xl text-lg font-bold rounded-lg flex flex-col space-y-2">
        <Icon name="fa6-solid:square-poll-horizontal" size="50" />
        <p>Polls</p>
      </NuxtLink>
      <NuxtLink to="/"
        class="md:size-36 size-30  items-center justify-center bg-[#EED6BC] hover:bg-[#F0BC80] text-[#F2A64E] hover:text-[#EE651D] md:text-2xl text-lg font-bold rounded-lg flex flex-col space-y-2">
        <Icon name="fa6-solid:calculator" size="50" />
        <p>Calculator</p>
      </NuxtLink>
      <NuxtLink to="/"
        class="md:size-36 size-30  items-center justify-center bg-[#AEEC9F] hover:bg-[#88D177] text-[#66B154] hover:text-[#275E1A] md:text-2xl text-lg font-bold rounded-lg flex flex-col space-y-2">
        <Icon name="fa6-solid:chart-simple" size="50" />
        <p>Stats</p>
      </NuxtLink>
    </div>


  </div>

</template>
