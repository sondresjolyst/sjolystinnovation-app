/**
 * Brand colours as literals, for anything that renders outside the browser and cannot read CSS
 * custom properties. Keep in sync with `--color-*` in `src/app/globals.css`.
 */
export const BRAND = {
    background: '#ffffff',
    foreground: '#0f1115',
    primary: '#4f46e5',
} as const;
