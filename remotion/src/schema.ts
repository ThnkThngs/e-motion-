import { z } from "zod";

export const featuresSchema = z.object({
  rsvp: z.object({
    enabled: z.boolean(),
    deadline: z.string(), // YYYY-MM-DD
  }),
  map: z.object({
    enabled: z.boolean(),
    googleMapsUrl: z.string(),
    wazeUrl: z.string(),
  }),
  countdown: z.object({
    enabled: z.boolean(),
    eventDateTime: z.string(), // ISO 8601
  }),
  gallery: z.object({
    enabled: z.boolean(),
    images: z.array(z.string()),
  }),
  ucapan: z.object({
    enabled: z.boolean(),
  }),
  salamKaut: z.object({
    enabled: z.boolean(),
    items: z.array(z.string()),
  }),
});

export type Features = z.infer<typeof featuresSchema>;

export const invitationSchema = z.object({
  brideName: z.string(),
  brideShort: z.string(),
  brideFather: z.string(),
  groomName: z.string(),
  groomShort: z.string(),
  groomFather: z.string(),
  parents: z.string(),
  inviteBody: z.string(),
  date: z.string(),
  dateLong: z.string(),
  venue: z.string(),
  venueAddress: z.string(),
  scheduleMeal: z.string(),
  scheduleArrival: z.string(),
  rsvpUrl: z.string(),
  brandLine: z.string(),
  features: featuresSchema,
});

export type InvitationProps = z.infer<typeof invitationSchema>;

export const defaultFeatures: Features = {
  rsvp: { enabled: true, deadline: "2024-01-20" },
  map: {
    enabled: true,
    googleMapsUrl: "https://maps.google.com/?q=Dewan+Mahligai+Harmoni",
    wazeUrl: "https://waze.com/ul?q=Dewan+Mahligai+Harmoni",
  },
  countdown: {
    enabled: true,
    eventDateTime: "2024-01-27T11:30:00+08:00",
  },
  gallery: {
    enabled: true,
    images: [],
  },
  ucapan: { enabled: true },
  salamKaut: {
    enabled: true,
    items: [
      "Barakallahu lakuma wa baraka 'alaikuma wa jama'a bainakuma fi khair",
      "Semoga Allah memberkati pernikahan kalian",
      "Selamat pengantin baru",
      "Sakinah, mawaddah, warahmah",
    ],
  },
};

export const defaultInvitationProps: InvitationProps = {
  brideName: "Nelydia Sofiyaa",
  brideShort: "Sofiya",
  brideFather: "Mohd Nassir",
  groomName: "Muhammad Yassin",
  groomShort: "Yassin",
  groomFather: "Hj. Zainal Abidin",
  parents: "ENCIK MOHD NASSIR MOKHTAR  &  PUAN SAYANA BINTI IBRAHIM",
  inviteBody:
    "Dengan hormatnya ingin menjemput\nTuan / Puan sekeluarga ke\nmajlis perkahwinan puteri kami\ndengan pasangannya",
  date: "27 . 01 . 2024",
  dateLong: "27 JANUARI 2024",
  venue: "Dewan Mahligai Harmoni",
  venueAddress: "Kampung Jasa, Ulu Kuang Chemor",
  scheduleMeal: "11:30 am - 4:00 pm",
  scheduleArrival: "12:30 pm",
  rsvpUrl: "https://e-motion.my/rsvp/sofiya-yassin",
  brandLine: "Jempot Motion",
  features: defaultFeatures,
};
