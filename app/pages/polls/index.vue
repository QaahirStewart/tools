<script setup>

const { data: recentPolls } = useFetch("/api/polls", {
    transform: async (response) => {
        return response.polls.slice(-3); // Return only the last 3 polls
    },
});

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

const { data: pinned } = useFetch("/api/polls", {
    transform: async (response) => {
        return response.pinnedPoll;
    },
});


</script>

<template>
    <div class="bg-black">
        <div class="bg-black container max-w-2xl mx-auto p-4 h-screen">
            <div class="flex items-center justify-between my-12">
                <NuxtLink to="/" class="flex my-4 items-end space-x-5 text-white">
                    <Icon name="fa6-solid:square-poll-horizontal" size="60" />
                    <div class="flex  w-34 justify-start ">
                        <PollsSvg class="h-14" />
                    </div>
                </NuxtLink>
                <NuxtLink to="/polls/setting" class="flex items-center justify-center my-4 text-white">
                    <UIcon name="fa6-solid:gear" size="60" />
                </NuxtLink>
            </div>

            <!-- Pinned Poll Section -->
            <div class="mt-4">
                <div class="flex  w-24 justify-start ">
                    <PinnedSvg class="h-10 " />
                </div>

                <div class="mt-4">
                    <div v-if="pinned"
                        class="bg-white/90 p-4 w-full rounded-xl flex justify-between items-center text-black">
                        <NuxtLink :to="`/poll/${pinned.id}`"
                            class="flex w-full justify-between items-center bg-black/5 hover:bg-black/15 py-2 px-6 rounded-lg">
                            <div class="w-full flex-1">
                                <p class="font-bold text-lg w-full">{{ pinned.question }}</p>
                                <p class="text-xs">{{ formatDate(pinned.created_at) }}</p>
                            </div>
                            <UIcon name="fa6-solid:envelope-open-text" class="size-6" />
                        </NuxtLink>
                    </div>
                    <div v-else class="font-bold">No Pinned Poll</div>
                </div>
            </div>

            <!-- Recent Polls Section -->
            <div class="mt-4">
                <div class="flex  w-24 justify-start ">
                    <RecentSvg class="h-10 " />
                </div>
                <div class="mt-4">
                    <div class="bg-white/90 p-4 rounded-xl flex justify-between items-center">
                        <div class="space-y-4 w-full">
                            <div v-if="!recentPolls || recentPolls.length === 0" class="font-bold">No Polls</div>
                            <div v-for="(poll, index) in recentPolls" :key="index">
                                <UButton :to="`/poll/${poll.id}`" color="neutral" variant="soft"
                                    class="flex justify-between items-center bg-black/5 hover:bg-black/15 py-2 px-6 rounded-lg">
                                    <div class="w-full flex-1">
                                        <p class="font-bold text-lg w-full">{{ poll.question }}</p>
                                        <p class="text-xs">{{ formatDate(poll.created_at) }}</p>
                                    </div>
                                    <UIcon name="fa6-solid:envelope-open-text" class="size-6" />
                                </UButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Archived Polls Section -->
            <div class="mt-4">
                <div class="flex  w-28 justify-start ">
                    <ArchievedSvg class="h-10 " />
                </div>
                <div class="mt-4">
                    <div class="bg-white/90 py-4 px-4 rounded-lg flex justify-between items-center">
                        <h3 class="text-lg font-bold">A collection of past polls.</h3>
                        <div>
                            <NuxtLink to="/polls/archived"
                                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6  rounded">
                                View
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <NuxtLink to="/create"
                class="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-4 rounded flex items-center justify-center my-12">
                Create Poll
            </NuxtLink>
        </div>
    </div>

</template>

<style scoped></style>