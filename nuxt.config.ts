// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/leaflet',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/turnstile',
    'nuxt-nodemailer',
  ],
  compatibilityDate: '2024-07-04',
  colorMode: {
    preference: 'light',
    fallback: 'light',
  },
  turnstile: {
    siteKey: '0x4AAAAAAAg074R3j11QboPw',
  },
  // build: {
  //   transpile: ['@mapbox'],
  // },

  runtimeConfig: {
    // databaseUrl: process.env.NUXT_DATABASE_URL,
    // supbaseURL: process.env.NUXT_SUPBASE_URL,
    // supabaseKEY: process.env.NUXT_SUPABASE_KEY,
    databaseUrl: process.env.NUXT_PUBLIC_DATABASE_URL,
    public: {
      test: process.env.NUXT_PUBLIC_TEST,
      supbaseURL: process.env.NUXT_PUBLIC_SUPBASE_URL,
      supabaseKEY: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      turnsiteSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY,
    },
    turnstile: {
      turnsiteSecretKey: process.env.NUXT_TURNSTILE_SECRET_KEY,
    },
  },

  nodemailer: {
    from: 'Mediconnect',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.NUXT_NODEMAILER_AUTH_EMAIL,
      pass: process.env.NUXT_NODEMAILER_AUTH_PASS,
    },
  },
});
