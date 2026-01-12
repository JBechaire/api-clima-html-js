
/**
 * Serviço de geocodificação usando Open-Meteo Geocoding.
 * Doc: https://open-meteo.com/en/docs/geocoding-api
 */
const GeoService = (() => {
  /**
   * Busca coordenadas por nome da cidade.
   * @param {string} name
   * @param {AbortSignal} [signal]
   * @returns {Promise<{ name: string, country?: string, admin1?: string, latitude: number, longitude: number }>}
   */
  async function searchCity(name, signal) {
    if (!name || !name.trim()) throw new Error("Informe uma cidade válida.");
    const url = `${CONFIG.GEO_BASE_URL}/search?name=${encodeURIComponent(name)}&count=1&language=${CONFIG.DEFAULT_LANG}`;
    const resp = await fetch(url, { signal });
    if (!resp.ok) throw new Error(`Falha no geocoding: ${resp.status}`);
    const data = await resp.json();
    const place = data?.results?.[0];
    if (!place) throw new Error("Cidade não encontrada.");
    return {
      name: place.name,
      country: place.country,
      admin1: place.admin1,
      latitude: place.latitude,
      longitude: place.longitude,
    };
  }

  return { searchCity };
})();

