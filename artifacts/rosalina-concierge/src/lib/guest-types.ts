export interface GuestRecord {
  name: string;
  reservationNumber: string;
  property: string;
  arrivalDate: string;
  arrivalTime: string;
  departureDate: string;
  numGuests: string;
  earlyCheckin: boolean;
  luggageStorage: boolean;
  carStatus: string;
  preferredContact: string;
  specialRequests: string;
  createdAt: string;
  password: string;
  phone: string;
  email: string;
  additionalGuests: string;
  roomNumber: string;
  lockboxCode: string;
  staffNotes: string;
  status: "pre-arrival" | "checked-in" | "checked-out" | "no-show";
  packages: string[];
  beachExtras: string[];
}

export const PACKAGE_OPTIONS = [
  { id: "romantic", en: "Romantic Decoration Package", es: "Paquete Decoracion Romantica", price: "$75" },
  { id: "birthday", en: "Birthday Setup", es: "Decoracion de Cumpleanos", price: "$60" },
  { id: "anniversary", en: "Anniversary Package", es: "Paquete de Aniversario", price: "$85" },
  { id: "welcome-basket", en: "Welcome Basket", es: "Canasta de Bienvenida", price: "$45" },
  { id: "champagne", en: "Champagne & Flowers", es: "Champan y Flores", price: "$55" },
];

export const BEACH_EXTRAS = [
  { id: "chairs-2", en: "2 Beach Chairs", es: "2 Sillas de Playa", price: "$15/day" },
  { id: "chairs-4", en: "4 Beach Chairs", es: "4 Sillas de Playa", price: "$25/day" },
  { id: "umbrella", en: "Beach Umbrella", es: "Sombrilla de Playa", price: "$10/day" },
  { id: "combo", en: "2 Chairs + Umbrella Combo", es: "Combo 2 Sillas + Sombrilla", price: "$20/day" },
  { id: "cooler", en: "Beach Cooler with Ice", es: "Nevera de Playa con Hielo", price: "$8/day" },
];

export const LOCKBOX_CODES: Record<string, Record<string, string>> = {
  "Ocean Park": {
    "1": "236", "2": "159", "3": "489", "4": "895", "5": "621",
    "6": "984", "7": "685", "8": "564", "9": "346", "10": "962",
    "11": "256", "12": "379", "13": "423", "14": "678", "15": "598",
    "16": "756", "17": "851", "18": "964", "19": "874",
  },
  "Isla Verde": {
    "1": "289", "2": "368", "3": "478", "4": "563", "5": "426", "6": "657",
  },
};

export const SPECIAL_CODES: Record<string, Record<string, string>> = {
  "Ocean Park": {
    "P.Ofic (X)": "169",
    "P.Entd (Z)": "3457",
    "A": "350", "B": "156", "C": "367", "D": "651", "E": "075",
    "F": "641", "G": "352", "H": "084", "M": "580",
    "1J": "2357", "1Y (Yaris)": "7867",
  },
  "Isla Verde": {
    "K": "745", "L": "967", "SN": "752",
    "Doors 1-4": "2323#",
  },
};

export function getLockboxCode(property: string, roomNumber: string): string {
  const digits = roomNumber.replace(/\D/g, "");
  if (!digits) return "";
  const num = String(parseInt(digits, 10));
  const codes = LOCKBOX_CODES[property];
  if (codes && codes[num]) return codes[num];
  return "";
}

export function generatePassword(name: string, reservation: string): string {
  const firstPart = name.trim().replace(/\s+/g, "").slice(0, 4);
  const lastPart = reservation.replace(/\W/g, "").slice(-4);
  return `${firstPart}${lastPart}!`;
}

export function getGuests(): GuestRecord[] {
  const raw = JSON.parse(localStorage.getItem("rosalina_guests") || "[]") as any[];
  return raw.map((g) => ({
    phone: "",
    email: "",
    additionalGuests: "",
    roomNumber: "",
    lockboxCode: "",
    staffNotes: "",
    status: "pre-arrival" as const,
    packages: [],
    beachExtras: [],
    ...g,
  }));
}

export function saveGuests(guests: GuestRecord[]): void {
  localStorage.setItem("rosalina_guests", JSON.stringify(guests));
}

export function getGuestByReservation(resNum: string): GuestRecord | null {
  const guests = getGuests();
  return guests.find((g) => g.reservationNumber.toUpperCase() === resNum.toUpperCase()) || null;
}

export function updateGuest(resNum: string, updates: Partial<GuestRecord>): GuestRecord | null {
  const guests = getGuests();
  const idx = guests.findIndex((g) => g.reservationNumber.toUpperCase() === resNum.toUpperCase());
  if (idx < 0) return null;
  guests[idx] = { ...guests[idx], ...updates };
  saveGuests(guests);
  return guests[idx];
}

export const OCEAN_PARK_UNITS = 19;
export const ISLA_VERDE_UNITS = 6;

export const WHATSAPP_BUSINESS = "+1 (939) 793-8989";
export const WHATSAPP_LINK_NUMBER = "19397938989";
export const EMERGENCY_NUMBER = "787-438-9393";
export const EMERGENCY_LINK = "17874389393";
export const CONCIERGE_NUMBER = "787-304-3335";
