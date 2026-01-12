
(function init() {
  const form = document.getElementById("cityForm");
  const input = document.getElementById("cityInput");
  const geoBtn = document.getElementById("geoBtn");

  let currentController = null;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = input.value.trim();
    if (!query) {
      UI.showError(new Error("Informe uma cidade válida."));
      return;
    }

    // Cancela requisição anterior (se houver)
    if (currentController) currentController.abort();
    currentController = new AbortController();

    UI.showLoading(`Buscando "${query}"...`);
    try {
      const place = await GeoService.searchCity(query, currentController.signal);
      UI.showLoading(`Buscando clima para ${place.name}...`);
      const weather = await WeatherService.getCurrent(
        place.latitude,
        place.longitude,
        currentController.signal
      );
      const locationName = `${place.name}${place.admin1 ? `, ${place.admin1}` : ""}${place.country ? `, ${place.country}` : ""}`;
      UI.render(weather, locationName);

      // Cache simples
      localStorage.setItem("lastCity", query);
    } catch (err) {
      UI.showError(err);
    } finally {
      currentController = null;
    }
  });

  geoBtn.addEventListener("click", () => {
    if (!("geolocation" in navigator)) {
      UI.showError(new Error("Geolocalização não suportada neste navegador."));
      return;
    }
    if (currentController) currentController.abort();
    currentController = new AbortController();

    UI.showLoading("Obtendo sua localização...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        UI.showLoading("Buscando clima para sua localização...");
        try {
          const weather = await WeatherService.getCurrent(
            latitude,
            longitude,
            currentController.signal
          );
          UI.render(weather, "Sua localização");
          localStorage.setItem("lastCoords", JSON.stringify({ latitude, longitude }));
        } catch (err) {
          UI.showError(err);
        } finally {
          currentController = null;
        }
      },
      () => {
        UI.showError(new Error("Não foi possível obter sua localização. Autorize o acesso ao GPS."));
        currentController = null;
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

  // Auto-carregar última pesquisa (se houver)
  const lastCity = localStorage.getItem("lastCity");
  if (lastCity) {
    input.value = lastCity;
    form.dispatchEvent(new Event("submit"));
    return;
  }

  // Sugestão inicial: Porto Alegre
  input.value = "Porto Alegre";
  form.dispatchEvent(new Event("submit"));
})();
