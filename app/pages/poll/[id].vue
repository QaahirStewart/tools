<script setup>
import { RealtimeChannel } from "@supabase/supabase-js";

const supabase = useSupabaseClient();

let realtimeChannel = RealtimeChannel;

const route = useRoute();
const pollId = route.params.id;

onMounted(() => {
    realtimeChannel = supabase
        .channel("public:polls")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "polls" },
            () => refreshPoll()
        );
    realtimeChannel.subscribe();
});

onMounted(() => {
    realtimeChannel = supabase
        .channel("public:options")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "options" },
            () => refreshOptions()
        );
    realtimeChannel.subscribe();
});

onMounted(() => {
    realtimeChannel = supabase
        .channel("public:poll_votes")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "poll_votes" },
            () => refreshVotes()
        );
    realtimeChannel.subscribe();
});

const { data: poll, refresh: refreshPoll } = await useAsyncData(
    "poll",
    async () => {
        const { data } = await supabase
            .from("polls")
            .select("*")
            .eq("id", pollId)
        return data;
    }
);

const { data: options, refresh: refreshOptions } = await useAsyncData(
    "options",
    async () => {
        const { data } = await supabase
            .from("options")
            .select("*")
            .eq("poll_id", pollId);
        return data;
    }
);

const { data: votes, refresh: refreshVotes } = await useAsyncData(
    "votes",
    async () => {
        const { data } = await supabase
            .from("poll_votes")
            .select("*")
            .eq("poll_id", pollId);
        return data;
    }
);


// const poll = ref(null);
const validationMessage = ref("");
const selectedOption = ref(null);
const selectedPlatform = ref(null);

const platforms = [
    { name: "Youtube", icon: "logos:youtube-icon" },
    { name: "Rumble", icon: "simple-icons:rumble", color: "red" },
    { name: "Facebook", icon: "logos:facebook" },
    { name: "Twitter", icon: "simple-icons:x" },
    { name: "Twitch", icon: "logos:twitch" },
];

const isVoteEnabled = computed(
    () => selectedOption.value !== null && selectedPlatform.value !== null
);

const totalVotes = computed(() => (votes.value ? votes.value.length : 0));

const voteData = computed(() => {
    if (!votes.value) {
        return [];
    }

    const groupedVotes = votes.value.reduce((acc, vote) => {
        if (acc[vote.option_id]) {
            acc[vote.option_id]++;
        } else {
            acc[vote.option_id] = 1;
        }
        return acc;
    }, {});

    const totalVotes = Object.values(groupedVotes).reduce(
        (sum, count) => sum + count,
        0
    );

    return options.value.map(option => {
        const count = groupedVotes[option.id] || 0;
        return {
            option_id: option.id, // Include the option_id
            option_text: option.option_text,
            count,
            percentage: totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(0) + "%" : "0%",
        };
    });
});

const submitVote = async () => {
    if (isVoteEnabled.value) {
        try {
            const response = await fetch(`/api/poll/${pollId}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    option_id: selectedOption.value,
                    viewing_platform: selectedPlatform.value,
                }),
            });
            const data = await response.json();
            if (data.error) {
                validationMessage.value = data.error;
            } else {
                fetchPollData();
                selectedOption.value = null;
                selectedPlatform.value = null;
            }
        } catch (error) {
            validationMessage.value = "Error submitting vote.";
        }
    }
};

const pollQuestion = computed(() => poll.value && poll.value.length > 0 ? poll.value[0].question : "");
const pollDate = computed(() => {
    if (poll.value && poll.value.length > 0 && poll.value[0].created_at) {
        const date = new Date(poll.value[0].created_at);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }
    return "No Date Available";
});

const highestVotedOption = computed(() => {
    if (!voteData.value || voteData.value.length === 0) {
        return "No Votes";
    }
    const result = voteData.value.reduce((highest, current) => {
        return (highest.count > current.count) ? highest : current;
    }, { count: 0 });

    return result.count > 0 ? result.option_text : "-";
});

const topViewingPlatform = computed(() => {
    const platformCounts = votes.value.reduce((acc, vote) => {
        acc[vote.viewing_platform] = (acc[vote.viewing_platform] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(platformCounts).reduce((a, b) => (a[1] > b[1] ? a : b), ['', 0])[0];
});

const topViewingPlatformIcon = computed(() => {
    const platform = platforms.find(p => p.name === topViewingPlatform.value);
    return platform ? platform.icon : '';
});
</script>

<template>
    <div class="container mx-auto overflow-auto">
        <div class="flex justify-evenly h-screen flex-col px-4 ">
            <!-- Poll Section -->
            <div class="flex flex-col max-w-xl w-full space-y-4 mx-auto">
                <NuxtLink to="/polls" class="flex my-4 items-end space-x-5">
                    <Icon name="fa6-solid:square-poll-vertical" size="60" />
                    <h1 class="text-6xl font-bold text-center">Poll</h1>
                </NuxtLink>

                <div class="flex justify-between">
                    <h1 class="text-lg text-md font-bold">{{ pollQuestion }}</h1>
                    <p>{{ pollDate }}</p>
                </div>

                <!-- Poll Options -->
                <div class="space-y-2">
                    <div v-for="(poll, index) in voteData" :key="index"
                        class="w-full bg-black/5 hover:bg-black/10 rounded-lg">
                        <button :class="{ selectedPollOption: selectedOption === poll.option_id }"
                            @click="selectedOption = poll.option_id"
                            class="w-full flex items-center justify-between rounded-lg relative">
                            <div :style="{ width: poll.percentage }"
                                class="flex items-center h-14 justify-between rounded-lg bg-black/10">
                                <p class="pl-6 flex-none">{{ poll.option_text }}</p>
                            </div>

                            <p class="absolute right-0 pr-6">{{ poll.percentage }}</p>
                        </button>
                    </div>
                </div>

                <!-- Selected Platform -->

                <div class="flex sm:flex-row flex-col justify-between items-center sm:space-y-0 space-y-4 sm:py-0 py-4">
                    <h2 class="text-lg font-bold">Viewing Platform:</h2>
                    <div class="flex flex-wrap space-x-4">
                        <button v-for="(platform, index) in platforms" :key="index"
                            @click="selectedPlatform = platform.name" :class="{
                                selectedViewingPlatform: selectedPlatform === platform.name,
                            }"
                            class="bg-black/5 hover:bg-black/10  sm:size-14 size-12 rounded-lg flex items-center justify-center space-x-2">
                            <UIcon :name="platform.icon" size="20"
                                :class="{ rumbleIconColor: platform.name === 'Rumble' }" />
                        </button>
                    </div>
                </div>

                <button :disabled="!isVoteEnabled" @click="submitVote"
                    class="bg-neutral-800 hover:bg-neutral-900 text-white font-bold h-14 rounded-lg disabled:bg-neutral-600 disabled:cursor-not-allowed">
                    Vote
                </button>
            </div>

            <!-- Stats Section -->
            <div class="max-w-xl w-full  mx-auto flex flex-col jutify-center py-8">
                <div class=" py-8 rounded-lg bg-black/5 w-full h-full flex flex-col justify-center">
                    <div class="mx-8 space-y-4 ">
                        <div class="flex items-center justify-center space-x-4 pb-2 ">
                            <Icon name="fa6-solid:envelope-open-text" size="30" class="" />
                            <p class="font-bold">Total Votes:&nbsp;{{ totalVotes }}</p>
                        </div>
                        <div class="space-y-2">
                            <div class="flex items-center space-x-4 h-14 px-4 bg-black/5 rounded-lg">
                                <Icon name="fa6-solid:trophy" size="24" class="text-yellow-400" />
                                <div class="flex">
                                    <p class="font-bold">Most Voted:&nbsp;</p>
                                    <p>{{ highestVotedOption }}</p>
                                </div>
                            </div>

                            <div class="flex items-center space-x-4 h-14 px-4 bg-black/5 rounded-lg">
                                <Icon :name="topViewingPlatformIcon" size="24"
                                    :class="{ rumbleIconColor: topViewingPlatform === 'Rumble' }" />

                                <p class="font-bold">Top Viewing Platform</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<style scoped>
.selectedPollOption {
    background-color: rgb(34 197 94 / 0.75);
}

.rumbleIconColor {
    color: #85C742;
}

.TwitterIconColor {
    color: black;
}

.selectedViewingPlatform {
    border-width: 3px;
    border-color: rgb(0 0 0 / 0.1);
    background: rgb(0 0 0 / 0.15);
}
</style>