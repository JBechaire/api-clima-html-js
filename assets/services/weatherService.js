
/**
 * Serviço de clima usando Open-Meteo Forecast.
 * Doc: https://open-meteo.com/en/docs
 */
const WeatherService = (() => {
  /**
   * Busca clima atual por coordenadas.
   * @param {number} lat
   * @param {number} lon
   * @param {AbortSignal} [signal]
   * @returns {Promise<object>}
   */
  async function getCurrent(lat, lon, signal) {
    if (typeof lat !== "number" || typeof lon !== "number") {
      throw new Error("Coordenadas inválidas.");
    }

    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current: "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
      timezone: CONFIG.DEFAULT_TIMEZONE,
      temperature_unit: CONFIG.TEMPERATURE_UNIT,
      wind_speed_unit: CONFIG.WIND_SPEED_UNIT,
    });

    const url = `${CONFIG.WEATHER_BASE_URL}?${params.toString()}`;
    const resp = await fetch(url, { signal });
    if (!resp.ok) throw new Error(`Falha ao buscar clima: ${resp.status}`);
    const data = await resp.json();

    return normalize(data);
  }

  function normalize(apiData) {
    const c = apiData?.current || {};
    return {
      temp: Math.round(c.temperature_2m),
      humidity: c.relative_humidity_2m,
      windSpeed: c.wind_speed_10m, // km/h
      code: c.weather_code,
      description: codeToDescription(c.weather_code),
      time: c.time ? new Date(c.time) : new Date(),
      // Mantemos para UI:
      meta: {
        timezone: apiData?.timezone,
      },
    };
  }

  // Mapeamento básico WMO → descrição (simplificado)
  function codeToDescription(code) {
    const map = {
      0: "Céu limpo ☀️",
      1: "Principalmente claro 🌤️",
      2: "Parcialmente nublado ⛅",
      3: "Nublado ☁️",
      45: "Neblina 🌫️",
      48: "Neblina com gelo 🌫️❄️",
      51: "Garoa fraca 🌦️",
      53: "Garoa moderada 🌦️",
      55: "Garoa intensa 🌧️",
      56: "Garoa congelante fraca 🌧️❄️",
      57: "Garoa congelante intensa 🌧️❄️",
      61: "Chuva fraca 🌦️",
      63: "Chuva moderada 🌧️",
      65: "Chuva intensa 🌧️",
      66: "Chuva congelante fraca 🌧️❄️",
      67: "Chuva congelante intensa 🌧️❄️",
      71: "Neve fraca ❄️",
      73: "Neve moderada ❄️",
      75: "Neve intensa ❄️",
      77: "Granizo ❄️",
      80: "Aguaceiros fracos 🌦️",
      81: "Aguaceiros moderados 🌧️",
      82: "Aguaceiros intensos 🌧️",
      85: "Aguaceiros de neve fraca ❄️",
      86: "Aguaceiros de neve intensa ❄️",
      95: "Trovoada ⛈️",
      96: "Trovoada com granizo ⛈️❄️",
      99: "Trovoada severa ⛈️",
    };
    return map[code] ?? "Condição desconhecida";
  }

  return { getCurrent };
})();

if (typeof module !== "undefined" && module.exports) {
  module.exports = { WeatherService };
} 

