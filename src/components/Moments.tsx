import { img } from '../lib/variant'

const SHOTS: [string, string, string, string][] = [
  ['p-ballon.jpg', "Ballon d'Or at 23", "Ronaldo with the Ballon d'Or", '60% 50%'],
  ['p-lift.jpg', 'Five Champions Leagues', 'Ronaldo lifting the Champions League trophy through the confetti in Lisbon, 2014', '50% 50%'],
  ['p-bike.jpg', '450 in 438 for Real Madrid', "Ronaldo's bicycle kick for Real Madrid at Juventus, April 2018", '40% 30%'],
  ['p-sochi.jpg', 'Scored at six World Cups', 'Ronaldo after his hat-trick against Spain at the 2018 World Cup', '50% 30%'],
  ['p-paris.jpg', "Euro 2016, Portugal's first", 'Ronaldo holding the Euro 2016 trophy with his Portugal team-mates in Paris', '42% 50%'],
  ['p-arms.jpg', 'Still scoring at 41', 'Ronaldo celebrating a goal for Portugal in Yerevan in 2025', '55% 30%'],
]

export function Moments() {
  return <div className="moments">{SHOTS.map(([f, t, alt, at]) => <figure key={f}><img src={img(f)} alt={alt} loading="lazy" style={{ objectPosition: at }} /><figcaption>{t}</figcaption></figure>)}</div>
}
