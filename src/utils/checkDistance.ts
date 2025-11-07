// const haversine = require('haversine-distance'); lib for location distancing algorithm

/**
 * Converts degrees to radians.
 * @param {number} deg - Angle in degrees.
 * @returns {number} Angle in radians.
 */
function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
}

interface Coordinates {
    lat: number;
    lon: number;
}

/**
 * Calculates the great-circle distance between two points (lat/lon) on Earth.
 * @param {number} lat1 - Latitude of point 1.
 * @param {number} lon1 - Longitude of point 1.
 * @param {number} lat2 - Latitude of point 2.
 * @param {number} lon2 - Longitude of point 2.
 * @returns {number} Distance in kilometers (km).
 */
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R: number = 6371; // Earth's radius in kilometers

    const dLat: number = deg2rad(lat2 - lat1);
    const dLon: number = deg2rad(lon2 - lon1);

    const a: number =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance: number = R * c; // Distance in km
    return distance;
}

// Example usage:
const latA = 34.0522; // Los Angeles
const lonA = -118.2437;
const latB = 40.7128; // New York
const lonB = -74.0060;

const distance = haversineDistance(latA, lonA, latB, lonB);

console.log(`Distance between LA and NY: ${distance.toFixed(2)} km`);
// Expected output: Distance between LA and NY: 3935.78 km (approx)