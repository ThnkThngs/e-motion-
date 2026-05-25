// Shared types for the Warisan card builder. Kept separate from the Remotion
// invitationSchema so this builder can iterate without touching the cinematic
// pipeline.

export type WarisanEvent = {
  date: string;
  time: string;
  venue: string;
  address: string;
  dress: string;
};

export type WarisanStory = { yr: string; title: string; desc: string };

export type WarisanCardForm = {
  templateId: string;       // heritage template id (e.g. "songket-riau")
  bride: string;
  brideShort: string;
  groom: string;
  groomShort: string;
  parents: string;
  intro: string;
  countdownAt: string;      // ISO datetime-local string ("YYYY-MM-DDTHH:mm")
  akad: WarisanEvent;
  resepsi: WarisanEvent;
  story: [WarisanStory, WarisanStory, WarisanStory];
  rsvpName: string;
  rsvpPhone: string;
  rsvpDeadline: string;
  bank: string;
  accName: string;
  accNo: string;
  ewallet: string;
  // Media — held as blob URLs in this session.
  audioUrl?: string;
  audioName?: string;
  videoUrl?: string;
  videoName?: string;
  galleryUrls: string[];    // up to 6
};

export const defaultWarisanCardForm: WarisanCardForm = {
  templateId: "songket-riau",
  bride: "Farah Nurliyana",
  brideShort: "Farah",
  groom: "Adam Hakimi",
  groomShort: "Adam",
  parents:
    "ENCIK ZAINAL ABIDIN  &  PUAN ROHANI BINTI HASSAN\nDR. AHMAD KAMIL  &  PUAN NORLIZA BINTI ISMAIL",
  intro:
    "Dengan penuh rasa syukur, kami menjemput Tuan / Puan sekeluarga ke majlis perkahwinan kami.",
  countdownAt: "2026-08-15T11:00",
  akad: {
    date: "15 Ogos 2026",
    time: "9:00 Pagi",
    venue: "Masjid Al-Falah",
    address: "Jalan Mahsuri, 11900 Bayan Lepas, Pulau Pinang",
    dress: "Pastel Putih",
  },
  resepsi: {
    date: "15 Ogos 2026",
    time: "11:30 Pagi",
    venue: "Dewan Mahligai Harmoni",
    address: "Jalan Mahsuri, 11900 Bayan Lepas, Pulau Pinang",
    dress: "Tema Emas",
  },
  story: [
    { yr: "2020", title: "Pertemuan Pertama", desc: "Bertemu di kampus USM, Pulau Pinang." },
    { yr: "2024", title: "Pertunangan", desc: "Lamaran rasmi di rumah keluarga pengantin perempuan." },
    { yr: "2026", title: "Hari Perkahwinan", desc: "Hari yang dinanti tiba." },
  ],
  rsvpName: "Kak Siti",
  rsvpPhone: "+60 12-345 6789",
  rsvpDeadline: "1 Ogos 2026",
  bank: "Maybank",
  accName: "Farah Nurliyana Binti Zainal",
  accNo: "1145 6789 0123",
  ewallet: "+60 12-345 6789",
  galleryUrls: [],
};
