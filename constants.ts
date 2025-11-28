import { Level, UserState } from './types';

export const INITIAL_STATE: UserState = {
  level: Level.PEMULA,
  history: [],
  timeRemaining: 30 * 60,
  targetDuration: 30 * 60,
  letterStats: {},
  totalSessions: 0,
};

export const LEVELS: Record<Level, string[]> = {
  [Level.PEMULA]: [
    "aaaa ssss dddd ffff jjjj kkkk llll ;;;;",
    "asdf jkl; asdf jkl; fdsa ;lkj",
    "fjfj dkdk slsl a;a; fjdk sla;",
    "jafaj kadak ladal safas",
    "ada apa saja lada kaca jala fasa",
    "dadal jajal kakak salak falah"
  ],
  [Level.MENENGAH]: [
    "Gajah itu duduk di atas batu besar.",
    "Jalan kaki ke pasar membeli buah naga.",
    "Hujan turun rintik membasahi tanah kering.",
    "Si kancil anak nakal suka mencuri timun.",
    "Lampu merah berhenti, lampu hijau jalan."
  ],
  [Level.MAHIR]: [
    "Fungsi f(x) = 2x + 5 adalah persamaan linear sederhana.",
    "Jangan lupa: 'Password' Anda harus > 8 karakter & unik!",
    "PT. Kereta Api Indonesia (Persero) melayani rute Jawa & Sumatera.",
    "HTML5, CSS3, dan ES6+ adalah standar web development 2024.",
    "Harga saham BBCA naik 2.5% menjadi Rp9.850 per lembar."
  ]
};

export const KEYBOARD_LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];