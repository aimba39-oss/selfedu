const API_BASE_URL = "https://selfedu-api.onrender.com";

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}