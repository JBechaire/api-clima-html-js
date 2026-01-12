
const UI = (() => {
  const resultEl = document.getElementById("result");

  function showLoading(msg = "Carregando clima...") {
    resultEl.innerHTML = `<p class="loading">${msg}</p>`;
  }

  function showError(err) {
    const message = (err && err.message) || "Ocorreu um erro inesperado.";
    resultEl.innerHTML = `<div class="error">⚠️ ${message}</div>`;
  }

  /**
   * @param {object} weather
   * @param {string} locationName
   */
  function render(weather, locationName) {
    if (!weather) {
      resultEl.innerHTML = `<div class="error">Nenhum dado para exibir.</div>`;
      return;
    }

    resultEl.innerHTML = `
      <div class="result-header">
        <h2>${locationName}</h2>
        <div class="result-meta">
          Atualizado: ${weather.time.toLocaleString("pt-BR")}
        </div>
      </div>

      <div class="result-grid">
        <div class="card">
          <div style="display:flex; gap:0.75rem; align-items:center;">
            <div style="font-size:2rem; font-weight:700;">${weather.temp}°C</div>
            <div>
              <div>${weather.description}</div>
              <small>Vento: ${weather.windSpeed} km/h</small>
            </div>
          </div>
        </div>

        <div class="card">
          <strong>Umidade</strong>
          <div>${weather.humidity}%</div>
        </div>

        <div class="card">
          <strong>Fuso</strong>
          <div>${weather.meta.timezone || "auto"}</div>
        </div>
      </div>
    `;
  }

  return { showLoading, showError, render };
})();
