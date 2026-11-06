/** Largest still YouTube has. Older videos answer with a 120px placeholder, so fall back. */
export const still = (id: string) => `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
export const stillFallback = (e: React.SyntheticEvent<HTMLImageElement>) => { const i = e.currentTarget; if (i.naturalWidth <= 120) i.src = i.src.replace('maxresdefault', 'hqdefault') }
