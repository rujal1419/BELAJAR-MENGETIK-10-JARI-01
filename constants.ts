import { Level, UserState } from './types';

export const INITIAL_STATE: UserState = {
  level: Level.LEVEL_1,
  history: [],
  timeRemaining: 30 * 60,
  targetDuration: 30 * 60,
  letterStats: {},
  totalSessions: 0,
};

export const LEVEL_CONFIG = {
  [Level.LEVEL_1]: { label: "Level 1: Baris Tengah (ASDF)", minWpm: 20 },
  [Level.LEVEL_2]: { label: "Level 2: Baris Atas (QWERTY)", minWpm: 25 },
  [Level.LEVEL_3]: { label: "Level 3: Baris Bawah (ZXCV)", minWpm: 30 },
  [Level.LEVEL_4]: { label: "Level 4: Kata Mutiara Pendek", minWpm: 40 },
  [Level.LEVEL_5]: { label: "Level 5: Kutipan Inspiratif", minWpm: 50 },
}

export const LEVELS: Record<Level, string[]> = {
  [Level.LEVEL_1]: [
    "aaaa ssss dddd ffff jjjj kkkk llll ;;;;",
    "asdf jkl; asdf jkl;",
    "sad sad lad lad fad fad dad dad",
    "jak jak lak lak kak kak sak sak",
    "fada jaga lada kaca",
    "saka dala faka jala",
    "a s d f j k l ;"
  ],
  [Level.LEVEL_2]: [
    "qwer poiu qwer poiu",
    "kias luas tuas puas",
    "tiga sapi lari pagi",
    "topi koki dari roti",
    "air putih itu suci",
    "polisi tidur di pos",
    "roti tawar rasa keju"
  ],
  [Level.LEVEL_3]: [
    "zxcv bnm, zxcv bnm,",
    "cari batu dari kali",
    "vivi beli vas baru",
    "baca buku cari ilmu",
    "nana main bola voli",
    "makan nasi cari cumi",
    "zamrud merah muda nampak"
  ],
  [Level.LEVEL_4]: [
    "Rajin pangkal pandai, hemat pangkal kaya.",
    "Sedikit demi sedikit, lama-lama menjadi bukit.",
    "Di mana ada kemauan, di situ pasti ada jalan.",
    "Kebersihan adalah sebagian dari iman.",
    "Bersatu kita teguh, bercerai kita runtuh.",
    "Pengalaman adalah guru yang paling berharga.",
    "Sedia payung sebelum hujan turun."
  ],
  [Level.LEVEL_5]: [
    "Bermimpilah setinggi langit. Jika engkau jatuh, engkau akan jatuh di antara bintang-bintang.",
    "Pendidikan adalah senjata paling mematikan di dunia, karena dengan pendidikan, Anda dapat mengubah dunia.",
    "Orang bijak belajar ketika mereka bisa. Orang bodoh belajar ketika mereka terpaksa.",
    "Jangan pernah menyerah. Pemenang tidak pernah menyerah, dan orang yang menyerah tidak pernah menang.",
    "Barangsiapa yang bersungguh-sungguh, maka dia akan mendapatkan kesuksesan.",
    "Masa depan adalah milik mereka yang percaya pada keindahan mimpi-mimpi mereka."
  ]
};

export const KEYBOARD_LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];