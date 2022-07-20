import {defineNuxtConfig} from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    css: ['vuetify/lib/styles/main.sass',
        '@fortawesome/fontawesome-svg-core/styles.css',
    '~/layouts/main.css'],
    build: {
        transpile: ['vuetify', '@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/vue-fontawesome'],
    },
    vite: {
        define: {
            'process.env.DEBUG': false,
        },
    },
    runtimeConfig: {
        apiRoot: "http://localhost:5000"
    }
})
