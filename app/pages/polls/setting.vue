<script setup>
import { groupBy } from "lodash";

const supabase = useSupabaseClient();
const polls = ref([]);
const filterMonth = ref("");
const filterYear = ref("");
const searchQuery = ref("");
const showFilters = ref(false);

const fetchPolls = async () => {
    const { data, error } = await supabase
        .from("polls")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching polls:", error);
    } else {
        polls.value = data;
    }
};

const deletePoll = async (pollId) => {
    const { error } = await supabase.from("polls").delete().eq("id", pollId);
    if (error) {
        console.error("Error deleting poll:", error);
    } else {
        polls.value = polls.value.filter((poll) => poll.id !== pollId);
    }
};

const pinPoll = async (pollId) => {
    try {
        // Set all polls' pinned value to false
        const { error: unpinError } = await supabase
            .from("polls")
            .update({ pinned: false })
            .neq("id", pollId); // Update all polls except the one being pinned

        if (unpinError) {
            console.error("Error unpinning polls:", unpinError);
            return;
        }

        // Set the selected poll's pinned value to true
        const { error: pinError } = await supabase
            .from("polls")
            .update({ pinned: true })
            .eq("id", pollId);

        if (pinError) {
            console.error("Error pinning poll:", pinError);
            return;
        }

        // Refresh the polls list
        fetchPolls();
    } catch (error) {
        console.error("Error pinning poll:", error);
    }
};

const toggleFilters = () => {
    showFilters.value = !showFilters.value;
    if (!showFilters.value) {
        clearFilters();
    }
};

const clearFilters = () => {
    filterMonth.value = "";
    filterYear.value = "";
    searchQuery.value = "";
};

const filteredPolls = computed(() => {
    let filtered = polls.value;
    if (filterMonth.value) {
        filtered = filtered.filter((poll) => {
            const pollDate = new Date(poll.created_at);
            return pollDate.getMonth() + 1 === parseInt(filterMonth.value);
        });
    }
    if (filterYear.value) {
        filtered = filtered.filter((poll) => {
            const pollDate = new Date(poll.created_at);
            return pollDate.getFullYear() === parseInt(filterYear.value);
        });
    }
    if (searchQuery.value) {
        filtered = filtered.filter((poll) =>
            poll.question.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }
    return filtered;
});

const groupedPolls = computed(() => {
    return groupBy(filteredPolls.value, (poll) =>
        new Date(poll.created_at).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        })
    );
});

onMounted(() => {
    fetchPolls();
});

const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
});
</script>

<template>
    <div class="bg-black">
        <div class="container max-w-2xl mx-auto p-4 h-screen">
            <div class="flex justify-start max-h-180 flex-col px-4 my-12">
                <NuxtLink to="/polls" class="flex my-4 items-end space-x-5">
                    <Icon name="fa6-solid:gear" size="60" class="text-white" />
                    <h1 class="text-6xl font-bold text-center text-white">Settings</h1>
                </NuxtLink>
                <div class="flex flex-col w-full space-y-4 mx-auto overflow-auto">
                    <div v-for="(polls, month) in groupedPolls" :key="month" class="w-full mb-4">
                        <h2 class="text-2xl font-semibold mb-2 text-white">{{ month }}</h2>
                        <div class="w-full bg-white/5 p-8 rounded-lg">
                            <div v-for="poll in polls" :key="poll.id"
                                class="w-full bg-white/5 hover:bg-white/10 rounded-lg py-2 px-6 mb-2 flex justify-between items-center">
                                <div>
                                    <h3 class="text-lg font-bold text-white">{{ poll.question }}</h3>
                                    <p class="text-xs text-white">
                                        {{ new Date(poll.created_at).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        }) }}
                                    </p>
                                </div>
                                <div class="flex space-x-2">
                                    <button @click="deletePoll(poll.id)"
                                        class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
                                        Delete
                                    </button>
                                    <button @click="pinPoll(poll.id)"
                                        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                                        Pin
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="px-4">
                <div class="flex justify-center items-center mt-4 space-x-2 px-4 bg-white/5 w-full p-4 my-4 rounded-xl">
                    <div class="flex justify-between items-center h-12 flex-1 space-x-2">
                        <input v-model="searchQuery" type="text" placeholder="Search by question"
                            class="w-full h-12 p-4 bg-white/10 text-white rounded-lg" />
                    </div>
                    <button @click="toggleFilters"
                        class="p-2 w-28 h-12 text-white rounded-lg bg-white/5 font-bold transition-colors">
                        {{ showFilters ? "Hide Filters" : "Show Filters" }}
                    </button>
                </div>
                <div v-if="showFilters" class="bg-white/5 w-full p-4 my-4 rounded-xl">
                    <div class="flex justify-between items-center h-12 space-x-2">
                        <USelect v-model="filterMonth" :items="months" placeholder="Month"
                            class="w-1/2 h-full rounded-lg" />
                        <USelect v-model="filterYear" :items="years" placeholder="Year"
                            class="w-1/2 h-full rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>