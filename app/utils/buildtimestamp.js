// utils/buildTimestamp.js
export const buildTimestamp = Date.now();
export const formattedDateTime = new Date(buildTimestamp).toLocaleString();