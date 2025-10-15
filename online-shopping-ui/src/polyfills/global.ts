// src/polyfills/global.ts

// This shims the 'global' object for libraries that expect it in a browser environment.
(window as any).global = window;
