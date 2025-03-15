<script setup>

import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

const df = new DateFormatter('en-US', {
    dateStyle: 'medium'
})

const modelValue = shallowRef(null)

const supabase = useSupabaseClient();

const question = ref("");
const validationMessage = ref("");
const showPollOptions = ref(false);

// Initialize options with a default number of options, e.g., 2 options
const options = ref(["", ""]);

function addOption() {
    if (options.value.length < 4) {
        options.value.push("");
    } else {
        console.log("Maximum of 4 options reached");
    }
}

const createPollAndOptions = async () => {
    // Check if the question is not empty and there are at least two non-empty options
    const validOptions = options.value.filter((option) => option.trim() !== "");
    if (question.value.trim() === "" || validOptions.length < 2) {
        validationMessage.value =
            "A Question and at least two options are required.";
        console.log("Question and at least two options are required.");
        return; // Exit the function if the condition is not met
    }
    try {
        // Create the poll and get its ID
        const { error: pollError } = await supabase.from("polls").insert([
            {
                question: question.value,
                options: validOptions, // Use only valid (non-empty) options
            },
        ]);
        if (pollError) throw pollError;
        // Navigate to /polls if the poll was created successfully
        navigateTo("/polls");
    } catch (error) {
        console.log(error);
        return null; // Return null in case of an error.
    }
};

const startDate = ref('');
const endDate = ref('');



const formatedStartdDate = computed(() => {
    if (startDate.value) {

        const date = new Date(startDate.value);
        // Format the date as "Month day, year"
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }
    return "No Date Available";
});

const formatedEndDate = computed(() => {
    if (endDate.value) {

        const date = new Date(endDate.value);
        // Format the date as "Month day, year"
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }
    return "No Date Available";
});

</script>

<template>
    <div class="container max-w-2xl mx-auto p-4 h-screen">
        <div class="my-12">
            <NuxtLink to="/polls" class="flex my-4 sm:items-end items-center  space-x-5">
                <Icon name="fa6-solid:square-plus" size="60" />
                <h1 class="sm:text-7xl text-5xl font-bold text-center">Create Poll</h1>
            </NuxtLink>
        </div>
        <div v-if="validationMessage"
            class="h-12 my-4 bg-red-600 rounded-lg font-bold text-white flex items-center justify-center">
            {{ validationMessage }}
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
            <div class="flex items-center space-x-3 h-12">

                <button @click="showPollOptions = !showPollOptions"
                    class="bg-black text-white px-4 h-12 rounded-lg font-bold">
                    Poll Options
                </button>
            </div>
        </div>

        <div v-if="showPollOptions" class="bg-slate-100 w-full p-8 my-8 rounded-xl">
            <div class="flex space-x-4 justify-between items-center">
                <button class="flex items-center bg-blue-500 font-bold px-4 rounded space-x-2 text-white h-12">
                    <Icon name="fa6-solid:clock" color="white" size="20" />
                    <p>Schedule</p>
                </button>
                <div class="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-4">
                    <!-- <div class="flex items-center space-x-2">
                        <Popover>
                            <PopoverTrigger as-child>
                                <Button class="bg-black/5 text-black hover:bg-black/10 space-x-2 h-12">
                                    <Icon name="fa6-solid:calendar" size="20" />
                                    <p>Start</p>
                                    <p v-if="startDate"> : {{ formatedStartdDate }}</p>

                                </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-auto p-0">
                                <Calendar v-model="startDate" initial-focus />
                            </PopoverContent>
                        </Popover>
                    </div> -->

                    <!-- <div class="flex items-center space-x-2 ">
                        <Popover>
                            <PopoverTrigger as-child>
                                <Button class="bg-black/5 text-black hover:bg-black/10 space-x-2 h-12 w-full">
                                    <Icon name="fa6-solid:calendar" size="20" />
                                    <p>End</p>
                                    <p v-if="endDate"> : {{ formatedEndDate }}</p>

                                </Button>
                            </PopoverTrigger>
                            <PopoverContent class="w-auto p-0">
                                <Calendar v-model="endDate" initial-focus />
                            </PopoverContent>
                        </Popover>
                    </div> -->
                    <UPopover>
                        <UButton color="neutral" variant="soft" icon="fa6-solid:calendar"
                            class="font-bold bg-black/5 h-12">
                            {{ modelValue ? 'Start: ' + df.format(modelValue.toDate(getLocalTimeZone())) : 'Start' }}
                        </UButton>

                        <template #content>
                            <UCalendar v-model="modelValue" class="p-2" />
                        </template>
                    </UPopover>
                    <UPopover>
                        <UButton color="neutral" variant="soft" icon="fa6-solid:calendar"
                            class="font-bold bg-black/5 h-12">
                            {{ modelValue ? 'End: ' + df.format(modelValue.toDate(getLocalTimeZone())) : 'End' }}
                        </UButton>

                        <template #content>
                            <UCalendar v-model="modelValue" class="p-2" />
                        </template>
                    </UPopover>
                </div>

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
