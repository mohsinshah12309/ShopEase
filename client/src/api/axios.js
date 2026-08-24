import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 and 429 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      } else if (error.response.status === 429) {
        const msg = error.response.data?.message || "Rate limit reached. Please pause and try again in a few moments.";
        console.warn("[Rate Limit Exceeded]:", msg);
        // Show non-blocking alert banner if in DOM context
        if (typeof window !== "undefined" && !document.getElementById("rate-limit-banner")) {
          const banner = document.createElement("div");
          banner.id = "rate-limit-banner";
          banner.className = "rate-limit-toast";
          banner.innerText = "⚡ " + msg;
          document.body.appendChild(banner);
          setTimeout(() => {
            if (banner.parentNode) banner.parentNode.removeChild(banner);
          }, 5000);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
