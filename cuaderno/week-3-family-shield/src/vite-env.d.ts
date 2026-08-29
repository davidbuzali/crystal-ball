/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ANALYSIS_MODE?: "live" | "simulated";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
