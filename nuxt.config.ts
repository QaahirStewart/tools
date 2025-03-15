// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-27",
  devtools: { enabled: true },
  supabase: { redirect: false },

  modules: ["@nuxt/ui", "@nuxt/eslint", "@nuxtjs/supabase"],

  css: ["~/assets/css/main.css"],

  ui: {
    fonts: true,
    colorMode: false,
  },

  future: {
    compatibilityVersion: 4,
  },
});
