import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const code = error.response?.data?.code;
        const legacyTokenMessage = error.response?.data?.message === "Invalid or expired token";
        const isInvalidSession = status === 401 && (
            code === "TOKEN_EXPIRED" ||
            code === "INVALID_TOKEN" ||
            legacyTokenMessage
        );

        if (isInvalidSession) {
            localStorage.removeItem("token");

            if (!window.location.pathname.startsWith("/login")) {
                const reason = code === "TOKEN_EXPIRED" ? "session-expired" : "session-invalid";
                window.location.replace(`/login?reason=${reason}`);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
