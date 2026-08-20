// Base API URL from environment variables, or empty string (same-origin) in production
export const API_BASE_URL = import.meta.env.VITE_API_URL 
  || (import.meta.env.PROD ? "" : "http://localhost:3005");

export function getApiUrl(url) {
  if (!url) return API_BASE_URL;

  // Normalize legacy hardcoded localhost URLs
  if (url.startsWith("http://localhost:3005") || url.startsWith("http://localhost:3000")) {
    const cleaned = url.replace(/^https?:\/\/localhost:\d+/, "");
    return `${API_BASE_URL}${cleaned}`;
  }

  // Pass through external full URLs
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Prepend API_BASE_URL for relative paths
  const normalizedPath = url.startsWith("/") ? url : `/${url}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  
  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Auto stringify JSON bodies if headers demand or if it's an object
  let body = options.body;
  if (body && typeof body === "object" && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(body);
  }

  const targetUrl = getApiUrl(url);

  const response = await fetch(targetUrl, {
    ...options,
    headers,
    body,
  });

  return response;
}

