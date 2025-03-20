<script setup>
const { data: polls } = useFetch("/api/polls", {
    transform: async (response) => {
        return response.polls.map((poll) => poll);
    },
});

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

// Find the pinned poll
const pinnedPoll = computed(() => {
    return polls.value.find((poll) => poll.pinned === true);
});
</script>

<template>
    <div class="container max-w-2xl mx-auto p-4 h-screen">
        <div class="flex items-center justify-between my-12">
            <NuxtLink to="/" class="flex my-4 items-end space-x-5">
                <Icon name="fa6-solid:square-poll-horizontal" size="60" />
                <h1 class="text-6xl font-bold text-center">Polls</h1>
            </NuxtLink>
            <NuxtLink to="/polls/setting" class="flex items-center justify-center my-4">
                <Icon name="fa6-solid:gear" size="60" />
            </NuxtLink>
        </div>

        <!-- Pinned Poll Section -->
        <div class="mt-4">
            <h2 class="text-3xl font-bold">Pinned</h2>
            <div class="mt-4">
                <div v-if="pinnedPoll" class="bg-black/5 p-8 w-full rounded-lg flex justify-between items-center">
                    <UButton :to="`/poll/${pinnedPoll.id}`" color="neutral" variant="soft"
                        class="flex w-full justify-between items-center bg-black/5 py-2 px-6 rounded-lg">
                        <div class="w-full flex-1">
                            <p class="font-bold text-lg w-full">{{ pinnedPoll.question }}</p>
                            <p class="text-xs">{{ formatDate(pinnedPoll.created_at) }}</p>
                        </div>
                        <UIcon name="fa6-solid:envelope-open-text" class="size-6" />
                    </UButton>
                </div>
                <div v-else class="font-bold">No Pinned Poll</div>
            </div>
        </div>

        <!-- Recent Polls Section -->
        <div class="mt-4">
            <h2 class="text-3xl font-bold">Recent</h2>
            <div class="mt-4">
                <div class="bg-gray-100 p-8 rounded-xl flex justify-between items-center">
                    <div class="space-y-2 w-full">
                        <div v-if="!recentPolls || recentPolls.length === 0" class="font-bold">No Polls</div>
                        <div v-for="(poll, index) in recentPolls" :key="index">
                            <UButton :to="`/poll/${poll.id}`" color="neutral" variant="soft"
                                class="flex justify-between items-center bg-black/5 py-2 px-6 rounded-lg">
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
            <h2 class="text-3xl font-bold">Archived</h2>
            <div class="mt-4">
                <div class="bg-gray-100 p-8 rounded-lg flex justify-between items-center">
                    <h3 class="text-lg font-bold">A collection of past polls.</h3>
                    <div>
                        <NuxtLink to="/polls/archived"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            View
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <NuxtLink to="/create"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold h-12 px-4 rounded flex items-center justify-center my-12">
            Create Poll
        </NuxtLink>
    </div>
</template>

<style scoped></style>