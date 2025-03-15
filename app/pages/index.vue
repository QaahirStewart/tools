<template>
  <div class="container mx-auto p-4 h-screen flex flex-col items-center ">
    <h1 class="text-7xl font-bold text-center my-12 w-full ">TOOLS</h1>
    <div class="flex justify-center items-center  space-x-12 w-full flex-1">
      <NuxtLink to="/polls"
        class=" size-36  items-center justify-center bg-blue-500 text-2xl text-white font-bold rounded-lg flex flex-col space-y-2">
        <Icon name="fa6-solid:square-poll-vertical" size="50" />
        <p>Polls</p>
      </NuxtLink>
      <NuxtLink to="/"
        class=" size-36  items-center justify-center bg-blue-500 text-2xl text-white font-bold rounded-lg flex flex-col space-y-2">
        <Icon name="fa6-solid:calculator" size="50" />
        <p>Calculator</p>
      </NuxtLink>
    </div>


  </div>

</template>
