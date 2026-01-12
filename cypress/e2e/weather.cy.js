describe('Clima Agora - E2E', () => {
  beforeEach(() => {
    // Intercepts para a submissão automática inicial ao carregar a página
    cy.intercept('GET', '**/v1/search*', {
      statusCode: 200,
      body: {
        results: [
          { name: 'Porto Alegre', latitude: -30.03, longitude: -51.23 },
        ],
      },
    }).as('initialGeo');

    cy.intercept('GET', '**/v1/forecast*', {
      statusCode: 200,
      body: {
        timezone: 'America/Sao_Paulo',
        current: {
          temperature_2m: 20,
          relative_humidity_2m: 50,
          wind_speed_10m: 5,
          weather_code: 0,
          time: '2026-01-12T10:00:00Z',
        },
      },
    }).as('initialWeather');

    cy.visit('index.html');
    // Aguarda a submissão inicial completar
    cy.wait(['@initialGeo', '@initialWeather']);
  });

  it('busca por uma cidade válida e exibe os dados meteorológicos', () => {
    cy.intercept('GET', '**/v1/search*', {
      statusCode: 200,
      body: {
        results: [
          {
            name: 'Porto Alegre',
            country: 'BR',
            admin1: 'RS',
            latitude: -30.03,
            longitude: -51.23,
          },
        ],
      },
    }).as('geoSearch');

    cy.intercept('GET', '**/v1/forecast*', {
      statusCode: 200,
      body: {
        timezone: 'America/Sao_Paulo',
        current: {
          temperature_2m: 22.3,
          relative_humidity_2m: 60,
          wind_speed_10m: 10.5,
          weather_code: 1,
          time: '2026-01-12T12:00:00Z',
        },
      },
    }).as('weatherFetch');

    cy.get('#cityInput').clear().type('Porto Alegre');
    cy.get('#cityForm').submit();

    cy.wait('@geoSearch');
    cy.wait('@weatherFetch');

    cy.get('#result').within(() => {
      cy.get('.result-header h2').should('contain.text', 'Porto Alegre');
      cy.contains('°C').should('exist');
      cy.contains('Principalmente claro').should('exist');
    });
  });

  it('cidade inexistente retorna erro apropriado', () => {
    cy.intercept('GET', '**/v1/search*', {
      statusCode: 200,
      body: { results: [] },
    }).as('geoEmpty');

    cy.get('#cityInput').clear().type('CidadeImaginariaXYZ');
    cy.get('#cityForm').submit();

    cy.wait('@geoEmpty');

    cy.get('#result').within(() => {
      cy.get('.error').should('contain.text', 'Cidade não encontrada');
    });
  });

  it('entrada vazia exibe mensagem de erro', () => {
    cy.get('#cityInput').clear();
    cy.get('#cityForm').submit();

    cy.get('#result').within(() => {
      cy.get('.error').should('contain.text', 'Informe uma cidade válida.');
    });
  });

  it('falha da API de clima é apresentada como erro', () => {
    cy.intercept('GET', '**/v1/search*', {
      statusCode: 200,
      body: {
        results: [
          {
            name: 'Porto Alegre',
            latitude: -30.03,
            longitude: -51.23,
          },
        ],
      },
    }).as('geoSearch2');

    cy.intercept('GET', '**/v1/forecast*', {
      statusCode: 500,
      body: {},
    }).as('weatherFail');

    cy.get('#cityInput').clear().type('Porto Alegre');
    cy.get('#cityForm').submit();

    cy.wait('@geoSearch2');
    cy.wait('@weatherFail');

    cy.get('#result').within(() => {
      cy.get('.error').should('contain.text', 'Falha ao buscar clima: 500');
    });
  });
});