<script setup>

import { useRouter } from "vue-router";

const supabase = useSupabaseClient();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);

const login = async () => {
    errorMessage.value = "";
    isLoading.value = true;

    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });

        if (error) {
            errorMessage.value = error.message;
        } else {
            router.push("/polls"); // Redirect to polls page after successful login
        }
    } catch (error) {
        errorMessage.value = "An unexpected error occurred.";
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="bg-black h-screen flex items-center justify-center">
        <div class="w-full max-w-md bg-white/5 p-8 rounded-lg shadow-lg">
            <h1 class="text-3xl font-bold text-center text-white mb-6">Login</h1>
            <form @submit.prevent="login" class="space-y-4">
                <div>
                    <label for="email" class="block text-sm font-medium text-white mb-1">Email</label>
                    <input id="email" v-model="email" type="email" placeholder="Enter your email"
                        class="w-full h-12 p-4 bg-white/10 text-white rounded-lg" required />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-white mb-1">Password</label>
                    <input id="password" v-model="password" type="password" placeholder="Enter your password"
                        class="w-full h-12 p-4 bg-white/10 text-white rounded-lg" required />
                </div>
                <div v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</div>
                <button type="submit" :disabled="isLoading"
                    class="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed">
                    {{ isLoading ? "Logging in..." : "Login" }}
                </button>
            </form>
            <p class="text-center text-sm text-white mt-4">
                Don't have an account?
                <NuxtLink to="/register" class="text-blue-400 hover:underline">Register</NuxtLink>
            </p>
        </div>
    </div>
</template>

<style scoped>
/* Add any additional styles if needed */
</style>