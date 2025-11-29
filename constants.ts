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
  [Level.LEVEL_4]: { label: "Level 4: Kutipan Al-Quran (Pendek)", minWpm: 40 },
  [Level.LEVEL_5]: { label: "Level 5: Kutipan Al-Quran (Panjang)", minWpm: 50 },
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
    "Tunjukilah kami jalan yang lurus.",
    "Maka sesungguhnya bersama kesulitan ada kemudahan.",
    "Maka nikmat Tuhanmu yang manakah yang kamu dustakan?",
    "Berbuat baiklah, karena sesungguhnya Allah menyukai orang-orang yang berbuat baik.",
    "Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung.",
    "Janganlah kamu berputus asa dari rahmat Allah."
  ],
  [Level.LEVEL_5]: [
    "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
    "Sesungguhnya Allah tidak mengubah keadaan suatu kaum hingga mereka mengubah keadaan diri mereka sendiri.",
    "Jadikanlah sabar dan shalat sebagai penolongmu, sesungguhnya Allah beserta orang-orang yang sabar.",
    "Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku adalah dekat.",
    "Demi masa. Sesungguhnya manusia itu benar-benar dalam kerugian, kecuali orang-orang yang beriman.",
    "Dan janganlah kamu berjalan di muka bumi ini dengan sombong."
  ]
};

export const KEYBOARD_LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];