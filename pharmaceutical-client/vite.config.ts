import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import relay from "vite-plugin-relay";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: "/",
    plugins: [react(), relay],
    server: {
      host: true,
      port: 3301,
      proxy: {
        "/graphql": "http://server:8501",
        "/api": env.VITE_API_URL,
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(mode),
    },
  };
});
