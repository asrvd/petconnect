import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isWithinXKm(
  user1Coords: { latitude: number; longitude: number },
  user2Coords: { latitude: number; longitude: number },
  x: number
): boolean {
  const R = 6371; // Radius of the earth in km
  const { latitude: lat1, longitude: lon1 } = user1Coords;
  const { latitude: lat2, longitude: lon2 } = user2Coords;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d <= x;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}