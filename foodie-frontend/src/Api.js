import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9090",
  withCredentials: true
});

// 🔁 Auto refresh token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refresh = await axios.post(
          "http://localhost:9090/auth/refresh",
          {},
          { withCredentials: true }
        );

        const newToken = refresh.data.accessToken;
        localStorage.setItem("token", newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return axios(original);

      } catch {
        localStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(err);
  }
);

export default api;
