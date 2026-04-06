/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_IMAGE_URL: string;
    readonly VITE_DJANGO_BASE_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}