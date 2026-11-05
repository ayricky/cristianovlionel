/** Each id was played from the live site on 2026-11-05. `embed: false` means the owner blocks playback off YouTube, so we link out. */
export interface Clip { id: string; title: string; channel: string; embed: boolean; secs: number }
export const CLIPS = {
  final2008: { id: 'm47Wd-U4Br8', title: 'The header in Moscow, 2008 final', channel: 'CBS Sports Golazo', embed: true, secs: 95 },
  wolfsburg2016: { id: '2YZiI5TL8kA', title: 'Hat-trick v Wolfsburg, 2016', channel: 'FOX Soccer', embed: false, secs: 66 },
  bayern2017: { id: 'mwR2TvF3k5w', title: 'Five goals against Bayern, 2017', channel: 'CBS Sports Golazo', embed: true, secs: 714 },
  atleti2017: { id: 'hA_RAfIDuDU', title: 'Hat-trick v Atlético, 2017', channel: 'TNT Sports Football', embed: true, secs: 237 },
  bicycle2018: { id: 'c_JlCriK3fY', title: 'The bicycle kick in Turin, 2018', channel: 'Real Madrid', embed: true, secs: 104 },
  atleti2019: { id: 'cLfSpFg6Pxg', title: 'Juventus 3-0 Atlético, 2019', channel: 'Juventus', embed: true, secs: 409 },
  hungary2016: { id: 'd8PJllUNy0U', title: 'Hungary 3-3 Portugal, Euro 2016', channel: 'UEFA', embed: false, secs: 102 },
  spain2018: { id: '1NzNzpWdAz8', title: 'Hat-trick v Spain, 2018 World Cup', channel: 'FIFA', embed: false, secs: 143 },
  swiss2019: { id: 'T2Xine9LYDA', title: 'Portugal 3-1 Switzerland, 2019', channel: 'UEFA', embed: false, secs: 92 },
  spain2025: { id: 'xbf5KeSFN7I', title: 'The equaliser v Spain, 2025 final', channel: 'FOX Soccer', embed: true, secs: 77 },
  sampdoria2019: { id: 'AunImole9HI', title: 'The leap at Sampdoria, 2019', channel: 'Serie A', embed: true, secs: 105 },
  damac2026: { id: 'SNK27spwCuA', title: 'Brace and the title v Damac, 2026', channel: 'Saudi Pro League', embed: true, secs: 433 },
  everyUcl: { id: 'UK5cu3LJ9qk', title: 'Every Champions League goal', channel: 'UEFA', embed: false, secs: 908 },
  messi2022: { id: 'zhEWqfP6V_w', title: 'Argentina v France, 2022 final', channel: 'FIFA', embed: false, secs: 128 },
  tottenham2009: { id: 'L0PG6FN01ZM', title: 'Man United 5-2 Tottenham, 2009', channel: 'Manchester United', embed: false, secs: 163 },
  kashima2016: { id: '3M94PcUeMtY', title: 'Real Madrid 4-2 Kashima, 2016 final', channel: 'FIFA', embed: false, secs: 219 },
  freekick2018: { id: 'KRqgjpiwrY8', title: 'The free kick v Spain, 2018', channel: 'FIFA', embed: false, secs: 50 },
  atalanta2021: { id: 'SS5hOm87qQw', title: 'Atalanta 2-2 Man United, 2021', channel: 'Manchester United', embed: false, secs: 137 },
  bayernAll: { id: 'pZu7NfA7HQg', title: 'All nine goals against Bayern', channel: 'UEFA', embed: false, secs: 110 },
  hat985: { id: 'Doiq12y4078', title: 'Hat-trick to reach 985, at 41', channel: 'Saudi Pro League', embed: true, secs: 578 },
  leftFoot: { id: 'FiqoNWsvdT4', title: 'Best left-footed goals', channel: 'Real Madrid', embed: true, secs: 266 },
  uclHats: { id: 'xCNbMlUtv0k', title: 'All Champions League hat-tricks', channel: 'UEFA', embed: false, secs: 140 },
  bicycle2025: { id: 'kwtjuNJgZw4', title: 'Bicycle kick at 40, all angles', channel: 'Saudi Pro League', embed: true, secs: 286 },
  ucl17: { id: 'PMdKpX_l7sA', title: 'The 17-goal Champions League season', channel: 'UEFA', embed: false, secs: 499 },
} satisfies Record<string, Clip>
export type ClipKey = keyof typeof CLIPS
