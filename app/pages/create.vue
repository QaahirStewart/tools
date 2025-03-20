<script setup>

import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const df = new DateFormatter('en-US', {
    dateStyle: 'medium'
})

const startDateValue = shallowRef(null)
const endDateValue = shallowRef(null)

const supabase = useSupabaseClient();

const question = ref("");
const description = ref("");
const createdBy = ref(""); // Example: You can set this to the current user's ID or name
const validationMessage = ref("");
const limitMessage = ref("Maximum of 4 options reached");
const displayLimitMessage = ref(false);
const showPollOptions = ref(false);
const options = ref(["", ""]);

const pollDuration = ref(""); // Stores the selected duration in minutes
const showDurationOptions = ref(false); // Toggles the duration options section
const durationOptions = [
    { label: "5 Minutes", value: 5 },
    { label: "10 Minutes", value: 10 },
    { label: "15 Minutes", value: 15 },
    { label: "30 Minutes", value: 30 },
    { label: "60 Minutes", value: 60 },
];

function addOption() {
    if (options.value.length < 4) {
        options.value.push("");
    } else {
        displayLimitMessage.value = true;
        setTimeout(() => {
            displayLimitMessage.value = false;
        }, 3000);
    }
}

const createPollAndOptions = async () => {
    const validOptions = options.value.filter((option) => option.trim() !== "");
    if (question.value.trim() === "" || validOptions.length < 2) {
        validationMessage.value = "A Question and at least two options are required.";
        setTimeout(() => {
            validationMessage.value = "";
        }, 3000);
        return;
    }

    const now = new Date();
    const calculatedEndDate = pollDuration.value
        ? new Date(now.getTime() + pollDuration.value * 60 * 1000).toISOString()
        : endDateValue.value
            ? endDateValue.value.toDate(getLocalTimeZone()).toISOString()
            : null;

    try {
        const { data: poll, error: pollError } = await supabase.from("polls").insert([
            {
                question: question.value,
                description: description.value,
                created_by: createdBy.value,
                start_date: startDateValue.value ? startDateValue.value.toDate(getLocalTimeZone()).toISOString() : null,
                end_date: calculatedEndDate,
                vote_count: 0, // Initialize vote count to 0
                pinned: false
            },
        ]).select().single();
        if (pollError) throw pollError;

        const pollId = poll.id;
        const optionsData = validOptions.map(option => ({
            poll_id: pollId,
            option_text: option,
        }));

        const { error: optionsError } = await supabase.from("options").insert(optionsData);
        if (optionsError) throw optionsError;

        navigateTo("/polls");
    } catch (error) {
        console.log(error);
        return null;
    }
};

const formatedStartdDate = computed(() => {
    if (startDateValue.value) {
        const date = startDateValue.value.toDate(getLocalTimeZone());
        return df.format(date);
    }
    return "No Date Available";
});

const formatedEndDate = computed(() => {
    if (endDateValue.value) {
        const date = endDateValue.value.toDate(getLocalTimeZone());
        return df.format(date);
    }
    return "No Date Available";
});

</script>

<template>
    <div class="container max-w-2xl mx-auto p-4 h-screen">
        <div class="my-12">
            <NuxtLink to="/polls" class="flex my-4 sm:items-end items-center space-x-5">
                <Icon name="fa6-solid:square-plus" size="60" />
                <h1 class="sm:text-6xl text-5xl font-bold text-center">Create Poll</h1>
            </NuxtLink>
        </div>
        <div v-if="validationMessage"
            class="h-12 my-4 bg-red-600 rounded-lg font-bold text-white flex items-center justify-center">
            {{ validationMessage }}
        </div>
        <div v-if="displayLimitMessage"
            class="h-12 my-4 bg-red-600 rounded-lg font-bold text-white flex items-center justify-center">
            {{ limitMessage }}
        </div>
        <div class="mb-4">
            <label for="question" class="block mb-2">Question:</label>
            <input v-model="question" type="text" id="question" class="border px-2 h-12 w-full rounded-lg"
                placeholder="Enter your question" />
        </div>
        <div v-for="(option, index) in options" :key="index" class="mb-4 flex items-center space-x-3">
            <label class="block flex-none">Option {{ index + 1 }}:</label>
            <input v-model="options[index]" type="text" class="border px-2 h-12 w-full rounded-lg"
                placeholder="Enter an option" />
        </div>

        <div class="flex justify-between space-x-4">
            <button @click="addOption"
                class="bg-green-500 hover:bg-green-600 text-white px-4 h-12 rounded-lg font-bold flex items-center space-x-2">
                <Icon name="fa6-solid:square-plus" size="20" />
                <P>Add</P>
            </button>
            <div class="flex space-x-2">
                <div class="flex justify-between space-x-4">
                    <button @click="showDurationOptions = !showDurationOptions"
                        class="bg-black text-white px-4 h-12 rounded-lg font-bold">
                        Duration Options
                    </button>
                </div>
                <div class="flex items-center space-x-3 h-12">
                    <button @click="showPollOptions = !showPollOptions"
                        class="bg-black text-white px-4 h-12 rounded-lg font-bold">
                        Poll Options
                    </button>
                </div>
            </div>

        </div>

        <div v-if="showPollOptions" class="bg-slate-100 w-full p-4 my-4 rounded-xl">
            <div
                class="flex md:flex-row flex-col md:space-x-4 md:space-y-0 space-y-4 md:justify-between md:items-center">
                <button
                    class="flex items-center bg-blue-500 font-bold px-4 rounded space-x-2 text-white h-12 text-center justify-center">
                    <Icon name="fa6-solid:clock" color="white" size="20" />
                    <p>Schedule</p>
                </button>
                <div class="flex w-full space-x-4 ">
                    <UPopover>
                        <UButton color="neutral" variant="soft" icon="fa6-solid:calendar"
                            class="font-bold bg-black/5 h-12 flex-1">
                            {{ startDateValue ? 'Start: ' + formatedStartdDate : 'Start' }}
                        </UButton>

                        <template #content>
                            <UCalendar v-model="startDateValue" color="secondary" class="p-2" />
                        </template>
                    </UPopover>
                    <UPopover>
                        <UButton color="neutral" variant="soft" icon="fa6-solid:calendar"
                            class="font-bold bg-black/5 h-12 flex-1">
                            {{ endDateValue ? 'End: ' + formatedEndDate : 'End' }}
                        </UButton>

                        <template #content>
                            <UCalendar v-model="endDateValue" color="secondary" class="p-2" />
                        </template>
                    </UPopover>
                </div>
            </div>
        </div>

        <div v-if="showDurationOptions" class="bg-slate-100 w-full p-4 my-4 rounded-xl">
            <div class="flex flex-col space-y-4">
                <label for="duration" class="block mb-2">Select Duration:</label>
                <select v-model="pollDuration" id="duration" class="border px-2 h-12 w-full rounded-lg">
                    <option value="" disabled>Select Duration</option>
                    <option v-for="option in durationOptions" :key="option.value" :value="option.value">
                        {{ option.label }}
                    </option>
                </select>
            </div>
        </div>



        <div class="w-full pb-2">
            <button @click="createPollAndOptions"
                class="bg-black text-white font-bold h-12 px-4 rounded flex items-center justify-center w-full my-12">
                Create Poll
            </button>
        </div>

    </div>
</template>

<style scoped></style>