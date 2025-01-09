const pkg = require("./package");
require("dotenv").config();

module.exports = {
  mode: "spa",

  /*
   ** Headers of the page
   */
  head: {
    title: "Tsebo-Rapid",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/hagul.ico" },
      { rel: "stylesheet", href: "/css/slim.min.css" },
      { rel: "stylesheet", href: "/lib/SpinKit/css/spinkit.min.css" },
      { rel: "stylesheet", href: "/lib/Ionicons/css/ionicons.css" }
    ],
    script: [
      {
        src: "https://code.jquery.com/jquery-3.3.1.slim.min.js",
        type: "text/javascript"
      },

    ],
    script: [
      {
        hid: 'clarity',
        innerHTML: `(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "n1gq4zzy6h");`,
        type: 'text/javascript',
        charset: 'utf-8'
      }
    ],
    __dangerouslyDisableSanitizersByTagID: {
      clarity: ['innerHTML']
    }
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "rgb(192, 0, 0)" },

  /*
   ** Global CSS
   */
  css: [
    "@/assets/css/tsebo-rapid.css",
    "@/assets/css/hagul.css",
    "@/assets/css/iot.css"
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/axios",
    "~/plugins/mixin",
    { src: "~/plugins/apexchart", ssr: false }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios", "@nuxtjs/dotenv", "@nuxtjs/pwa"],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API_BASE_URL,
    progress: false
  },
  // proxy: {
  //   '/': {
  //     target: process.env.API_BASE_URL,
  //   }
  // },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) { },
    babel: {
      presets({ isServer }) {
        const targets = isServer ? { node: "current" } : { ie: 11 };
        return [[require.resolve("@nuxt/babel-preset-app"), { targets }]];
      }
    }
  },

  /**
   * Routing Config
   */
  router: {
    extendRoutes(routes, resolve) {
      // customRoutes(routes, resolve)
    }
  },

  /**
   * Environment Variables
   */
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    APP_URL: process.env.APP_URL,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_DB_URL: process.env.FIREBASE_DB_URL,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_SENDER_ID: process.env.FIREBASE_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID
  }
};
