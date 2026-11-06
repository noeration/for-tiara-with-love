/**
 * ============================================================================
 *  "For Tiara, With Love" — PUSAT KONTEN
 * ============================================================================
 *  SEMUA teks, foto, karya, puisi, dan lagu diatur dari file ini.
 *  Kamu tidak perlu menyentuh komponen untuk mengganti isi.
 * ============================================================================
 * 
 *  MEDIA (taruh file dengan nama yang sama seperti di bawah):
 *    public/images/tiara/       → foto utama & cover lagu
 *    public/images/memories/    → foto kenangan
 *    public/images/artworks/    → karya seni Tiara
 *    public/audio/              → file lagu
 * 
 *  Setelah mengganti file, cukup sesuaikan `src`, `alt`, dan caption di sini.
 *  Tandai `placeholder: false` setelah memakai foto/karya asli.
 * 
 *  Tips: tambah atau hapus item di array sesuka hati — layout mengikuti.
 * ============================================================================
 */

export type IconName = "sparkles" | "heart" | "flower" | "star" | "moon";

export interface Wish {
  icon: IconName;
  title: string;
  text: string;
}

export interface Poem {
  title: string;
  lines: string[];
}

export interface Letter {
  greeting: string;
  paragraphs: string[];
  poem: Poem;
  closing: string;
  signature: string;
  from: string;
}

export interface Track {
  title: string;
  artist: string;
  src: string;
  cover: string;
  /** Kenapa lagu ini dipilih */
  note: string;
}

export interface Memory {
  id: string;
  /** Path dari folder public, contoh: "/images/memories/memory-01.png" */
  src: string;
  alt: string;
  caption: string;
  /** Bentuk kartu polaroid: portrait, square, atau landscape */
  aspect?: "portrait" | "square" | "landscape";
  /** true = masih memakai gambar placeholder */
  placeholder?: boolean;
  /** Tanggal (opsional) */
  date?: string;
}

export interface Artwork {
  id: string;
  src: string;
  alt: string;
  title: string;
  year: string;
  medium: string;
  description: string;
  aspect: number;
  placeholder?: boolean;
}

export interface MemoryConfig {
  /** Nama penerima — dipakai di banyak tempat */
  name: string;
  site: {
    title: string;
    description: string;
    /** Isi saat deploy, contoh: "https://for-tiara.vercel.app" (boleh kosong) */
    url: string;
  };
  opening: {
    overline: string;
    greeting: string;
    subtitle: string;
    cta: string;
    hint: string;
  };
  portrait: {
    src: string;
    alt: string;
    caption: string;
    placeholder?: boolean;
  };
  appearance: {
    background: string;
    accent: string;
    typography: "serif" | "sans";
    effects: boolean;
  };
  message: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    wishes: Wish[];
  };
  cake: {
    instruction: string;
    wishes: { title: string; text: string }[];
    allDoneMessage: string;
    continueLabel: string;
    nextId: string;
  };
  memories: {
    eyebrow: string;
    title: string;
    description: string;
    items: Memory[];
  };
  artworks: {
    eyebrow: string;
    title: string;
    description: string;
    items: Artwork[];
  };
  letter: {
    eyebrow: string;
    title: string;
    hint: string;
    content: Letter;
  };
  song: {
    eyebrow: string;
    title: string;
    description: string;
    track: Track;
  };
  finale: {
    eyebrow: string;
    title: string;
    message: string[];
    closing: string;
    signature: string;
    celebrate: string;
    replay: string;
  };
  nav: { id: string; label: string }[];
}

export const birthday: MemoryConfig = {
  "name": "Tiara",
  "site": {
    "title": "For Tiara, With Love",
    "description": "Hadiah digital kecil untuk Tiara — kenangan, karya, surat, dan lagu dalam satu taman ungu.",
    "url": ""
  },
  "opening": {
    "overline": "a little garden I grew for you",
    "greeting": "Happy Birthday, Tiara!",
    "subtitle": "Di antara semua hal indah yang pernah ada, aku bersyukur semesta mempertemukan aku denganmu.",
    "cta": "Open Your Little Surprise",
    "hint": "Nikmati perlahan — sebaiknya dengan suara menyala ♡"
  },
  "portrait": {
    "src": "/images/tiara/prabowo.jpg",
    "alt": "Tiara",
    "caption": "the loveliest person I know",
    "placeholder": true
  },
  "appearance": {
    "background": "#140a22",
    "accent": "#d8b4fe",
    "typography": "serif",
    "effects": true
  },
  "message": {
    "eyebrow": "for your special day",
    "title": "Selamat Ulang Tahun, Sayang",
    "paragraphs": [
      "Hari ini tentang kamu: tentang tawa yang selalu berhasil membuat hariku lebih ringan, tentang hati yang selalu punya ruang untuk orang lain, dan tentang cara kamu melihat dunia — lembut, jujur, dan penuh warna.",
      "Terima kasih sudah tumbuh menjadi manusia seindah ini. Terima kasih untuk semua hal kecil yang mungkin tidak kamu sadari: pesan-pesan singkat, cerita sebelum tidur, dan caramu mengingat hal-hal yang aku suka.",
      "Aku berharap tahun ini membawa lebih banyak hal yang membuatmu bangga pada dirimu sendiri. Dan kalau suatu hari dunia terasa berat, semoga kamu ingat bahwa ada seseorang yang selalu memilihmu, dengan seluruh hatinya."
    ],
    "wishes": [
      {
        "icon": "flower",
        "title": "Tumbuh Bahagia",
        "text": "Semoga kamu selalu dikelilingi hal-hal yang membuatmu merasa aman, dicintai, dan cukup."
      },
      {
        "icon": "star",
        "title": "Mimpi yang Menjadi",
        "text": "Semoga setiap hal yang kamu doakan diam-diam menemukan jalannya untuk nyata tahun ini."
      },
      {
        "icon": "heart",
        "title": "Selalu Dikagumi",
        "text": "Untuk semua versi dirimu — yang kuat, yang rapuh, yang sedang belajar. Semuanya berharga."
      }
    ]
  },
  "cake": {
    "instruction": "Tutup semua lilin, kemudian klik tombol continue.",
    "wishes": [
      {
        "title": "Tumbuh Bahagia",
        "text": "Semoga kamu selalu dikelilingi hal-hal yang membuatmu merasa aman, dicintai, dan cukup."
      },
      {
        "title": "Mimpi yang Menjadi",
        "text": "Semoga setiap hal yang kamu doakan diam-diam menemukan jalannya untuk nyata tahun ini."
      },
      {
        "title": "Selalu Dikagumi",
        "text": "Untuk semua versi dirimu — yang kuat, yang rapuh, yang sedang belajar. Semuanya berharga."
      }
    ],
    "allDoneMessage": "Tiara, kamu sudah sempurna!",
    "continueLabel": "Lanjutkan",
    "nextId": "cake"
  },
  "memories": {
    "eyebrow": "kenangan kita",
    "title": "Halaman Kenangan",
    "description": "Potret-potret kecil yang terukir di hati.",
    "items": [
      {
        "id": "memory-01",
        "src": "/images/memories/memory-01.png",
        "alt": "Kenangan 1",
        "caption": "Cerita kenangan pertama",
        "date": "Juni 2024",
        "aspect": "portrait",
        "placeholder": true
      },
      {
        "id": "memory-02",
        "src": "/images/memories/memory-02.png",
        "alt": "Kenangan 2",
        "caption": "Cerita kenangan kedua",
        "date": "Juli 2024",
        "aspect": "portrait",
        "placeholder": true
      },
      {
        "id": "memory-03",
        "src": "/images/memories/memory-03.png",
        "alt": "Kenangan 3",
        "caption": "Cerita kenangan ketiga",
        "date": "Agustus 2024",
        "aspect": "square",
        "placeholder": true
      },
      {
        "id": "memory-04",
        "src": "/images/memories/memory-04.png",
        "alt": "Kenangan 4",
        "caption": "Cerita kenangan keempat",
        "date": "September 2024",
        "aspect": "portrait",
        "placeholder": true
      },
      {
        "id": "memory-05",
        "src": "/images/memories/memory-05.png",
        "alt": "Kenangan 5",
        "caption": "Cerita kenangan kelima",
        "date": "Oktober 2024",
        "aspect": "landscape",
        "placeholder": true
      },
      {
        "id": "memory-06",
        "src": "/images/memories/memory-06.png",
        "alt": "Kenangan 6",
        "caption": "Cerita kenangan keenam",
        "date": "November 2024",
        "aspect": "portrait",
        "placeholder": true
      }
    ]
  },
  "artworks": {
    "eyebrow": "her little art gallery",
    "title": "Dunia yang Tiara Gambar",
    "description": "Karya-karya kecil yang membuatku percaya bahwa Tiara melihat dunia dengan cara yang berbeda — dan itu indah.",
    "items": [
      {
        "id": "artwork-01",
        "src": "/images/artworks/artwork-01.png",
        "alt": "Karya seni Tiara berjudul Orchid in Bloom",
        "title": "Orchid in Bloom",
        "year": "[tahun]",
        "medium": "[media, mis. cat air di kertas]",
        "description": "Tulis cerita di balik karya ini di data/birthday.ts — apa yang menginspirasi Tiara, dan apa yang kamu rasakan saat pertama kali melihatnya.",
        "aspect": 1.4,
        "placeholder": true
      }
    ]
  },
  "letter": {
    "eyebrow": "for your special day",
    "title": "Selamat Ulang Tahun, Sayang",
    "hint": "Isi ini opsional — teks pendek di bagian surat.",
    "content": {
      "greeting": "Sayangku Tiara,",
      "paragraphs": [
        "Hari ini aku ingin menulis sesuatu yang berbeda. Bukan sekadar ucapan selamat ulang tahun yang biasa, tapi cerita tentang betapa berartinya kamu bagiku.",
        "Setiap hari bersamamu adalah hadiah. Tawa kamu, cara kamu melihat dunia, ketulusan hatimu — semuanya membuat hidup ini terasa lebih ringan dan lebih berwarna.",
        "Aku tak sabar ingin melihat apa yang akan dibawa tahun ini untukmu. Tapi satu hal yang pasti: aku akan selalu di sini, menemanimu, mendukungmu, dan mencintaimu dengan sepenuh hati."
      ],
      "poem": {
        "title": "Untuk Tiara",
        "lines": [
          "Di taman ungu tempat bunga mekar",
          "Namamu tertulis di setiap kelopak",
          "Tiara, cahaya yang tak pernah pudar",
          "Selamat ulang tahun, sayangku."
        ]
      },
      "closing": "Dengan semua cinta,",
      "signature": "Kamu",
      "from": "Kamu"
    }
  },
  "song": {
    "eyebrow": "our song",
    "title": "Lagu Kita",
    "description": "Lagu yang selalu mengingatkan aku padamu.",
    "track": {
      "title": "Judul Lagu Kita",
      "artist": "Penyanyi",
      "src": "/audio/our-song.wav",
      "cover": "/images/tiara/song-cover.png",
      "note": "Tulis kenapa lagu ini spesial di sini."
    }
  },
  "finale": {
    "eyebrow": "the finale",
    "title": "Tiara, terima kasih telah menemani",
    "message": [
      "Terima kasih telah hadir di hari ini.",
      "Terima kasih telah menonton hingga akhir.",
      "Terima kasih telah menjadi bagian dari kisah ini."
    ],
    "closing": "Terima kasih telah menonton hingga akhir.",
    "signature": "Dibuat dengan cinta, untuk Tiara",
    "celebrate": "Tetap bersemangat!",
    "replay": "Ulangi"
  },
  "nav": [
    { "id": "pesan", "label": "Pesan" },
    { "id": "kenangan", "label": "Kenangan" },
    { "id": "karya", "label": "Karya" },
    { "id": "surat", "label": "Surat" },
    { "id": "lagu", "label": "Lagu" },
    { "id": "penutup", "label": "Penutup" }
  ]
};