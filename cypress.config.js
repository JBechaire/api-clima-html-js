const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: false,
    // Não definimos baseUrl: os testes usam `cy.visit('index.html')` para carregar o arquivo estático
  },
});