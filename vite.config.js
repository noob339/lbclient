import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/query": "http://localhost:8080",
            "/set_context": "http://localhost:8080",
            "/set_parameter": "http://localhost:8080",
            "/set_base_model": "http://localhost:8080",
            "/base_model_options": "http://localhost:8080",
            "/model_parameter_options": "http://localhost:8080",
        },
    },
});
