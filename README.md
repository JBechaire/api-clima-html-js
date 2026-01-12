
# 🌤️ Clima Agora — HTML + JavaScript (Open‑Meteo)


<p align="center">
  <img src="assets/images/imagem-api-clima.gif" alt="Imagem de fundo — Clima Agora" width="720" />
</p>

Aplicação front-end que consulta o **clima atual** por **cidade** ou pela **sua localização**, usando a API pública **Open‑Meteo** (sem necessidade de chave).  
✅ **Deploy:** [https://jbechaire.github.io/api-clima-html-js/](https://jbechaire.github.io/api-clima-html-js/)

---

## ✨ Recursos
- Busca por cidade com **geocoding** (Open‑Meteo Geocoding).
- Clima atual com **Open‑Meteo Forecast** (sem API key).
- Botão **“Usar minha localização”** (navigator.geolocation).
- UI amigável em cards, com estados de **carregando** e **erro**.
- Cache simples de última cidade e coordenadas (`localStorage`).

---

## 🗂️ Estrutura
api-clima-html-js/
├─ index.html
├─ assets/
│  ├─ css/styles.css
│  └─ js/
│     ├─ app.js
│     ├─ ui.js
│     └─ services/
│        ├─ config.js
│        ├─ geoService.js
│        └─ weatherService.js
└─ README.md

    ---

## 🚀 Como rodar localmente
```bash
# Opção 1: Live Server (VS Code)
# Instale a extensão e clique em "Go Live"

# Opção 2: Python
python -m http.server 5500

# Opção 3: Node
npx http-server .

#Acesse: http://localhost:5500
```

## 🧪 Testes (Jest + MSW)
Instale as dependências de teste e execute o Jest:

```bash
npm init -y
npm install -D jest msw whatwg-fetch @testing-library/dom @testing-library/user-event
# Opcional: adicionar script no package.json
# "scripts": { "test": "jest --watchAll=false" }

# Rodar testes
npx jest
```

Os testes de exemplo ficam em `tests/` (unitários e de integração), e usam MSW para mockar as APIs externas.

---

## ✅ Testes E2E com Cypress
Adicionei um conjunto de testes E2E usando **Cypress** que cobrem os seguintes cenários:

- Busca por uma **cidade válida** e exibição dos dados meteorológicos.
- Busca por uma **cidade inexistente** e mensagem de erro.
- **Entrada vazia** que exibe uma mensagem de erro informando para preencher a cidade.
- **Falha da API** (status 500) sendo exibida como mensagem de erro.

Como rodar os testes E2E:

```bash
# Instale dependências (se ainda não instalou)
npm install

# Rodar todos os testes E2E em modo headless
npm run e2e
```

O arquivo de testes está em `cypress/e2e/weather.cy.js`. Os testes usam `cy.intercept` para mockar as respostas das APIs externas (`/v1/search` e `/v1/forecast`).


## 🌐 APIs utilizadas

#Geocoding:
#https://geocoding-api.open-meteo.com/v1/search?name={cidade}&count=1&language=pt
#Forecast:
#https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto



