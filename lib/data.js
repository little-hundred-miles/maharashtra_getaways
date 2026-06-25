import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const EXPERIENCES_FILE = path.join(DATA_DIR, "experiences.json");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

export function isBookingPersistenceEnabled() {
  return process.env.VERCEL !== "1";
}

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

export function getExperiences() {
  return readJson(EXPERIENCES_FILE);
}

export function getBookings() {
  if (!isBookingPersistenceEnabled()) return Promise.resolve([]);
  return readJson(BOOKINGS_FILE);
}

export async function saveBookings(bookings) {
  if (!isBookingPersistenceEnabled()) return false;
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
  return true;
}

export function validateBooking(body, experiences) {
  const required = ["experienceId", "date", "guests", "name", "email", "phone"];
  const missing = required.filter((field) => !body[field]);
  if (missing.length) return `Missing fields: ${missing.join(", ")}`;
  if (!experiences.some((item) => item.id === body.experienceId)) return "Experience not found";
  if (!Number.isInteger(Number(body.guests)) || Number(body.guests) < 1 || Number(body.guests) > 20) {
    return "Guests must be between 1 and 20";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "Enter a valid email";
  const phoneDigits = String(body.phone).replace(/\D/g, "");
  if (!/^\+[\d\s-]+$/.test(body.phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
    return "Enter a valid phone number";
  }
  return null;
}

export function createBooking(body, experience) {
  const guests = Number(body.guests);
  const subtotal = experience.price * guests;
  const platformFee = Math.round(subtotal * 0.04);

  return {
    id: `MG-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
    createdAt: new Date().toISOString(),
    status: "confirmed",
    paymentStatus: "authorized",
    currency: "INR",
    amount: subtotal + platformFee,
    operatorPayout: subtotal,
    platformFee,
    ...body,
    guests,
    experienceTitle: experience.title,
    operator: experience.operator.name,
  };
}
