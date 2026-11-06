export type Variant = 'floodlight' | 'monument' | 'backpage' | 'broadcast'
export const VARIANT = (import.meta.env.VITE_VARIANT ?? 'floodlight') as Variant

/** Light colours for the WebGL field, as GLSL vec3 strings. */
export const LIGHTS: Record<Variant, { r: string; m: string; hot: string }> = {
  floodlight: { r: '1.0, 0.745, 0.2', m: '0.45, 0.82, 1.0', hot: '1.0, 0.33, 0.14' },
  monument: { r: '0.86, 0.68, 0.28', m: '0.6, 0.6, 0.62', hot: '1.0, 0.86, 0.5' },
  backpage: { r: '1.0, 0.16, 0.14', m: '0.92, 0.9, 0.85', hot: '1.0, 0.86, 0.1' },
  broadcast: { r: '1.0, 0.86, 0.1', m: '0.1, 0.9, 1.0', hot: '1.0, 0.1, 0.5' },
}
export const img = (name: string) => `${import.meta.env.BASE_URL}img/${name}`
