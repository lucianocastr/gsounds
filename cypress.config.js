require('dotenv').config(); // Asegurar que se cargan las variables de entorno
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    URL_BASE: process.env.URL_BASE,
    USERNAME: process.env.USERNAME,
    USERPASS: process.env.USERPASS,
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
