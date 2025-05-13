export async function apiRequest(path, options = {}, fallback) {
  const SERVER = "/api";
  //const SERVER = "http://polytech-smart-greenhouse-app:8080";
  //const SERVER = "http://localhost:8080";
  //const SERVER = "http://localhost:3000/api";
  try {
    const res = await fetch(SERVER + path, options);
    if (!res.ok) throw new Error(`Ошибка ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`[API fallback]: ${path}`, e.message);
    return fallback ? fallback() : Promise.reject(e);
  }
}
