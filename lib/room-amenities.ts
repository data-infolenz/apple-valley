export const DEFAULT_AMENITIES = [
  'TV',
  'WiFi',
  'Water Heater',
  'Water Dispenser',
  'Balcony View',
  'Sitting Area',
];

export function getRoomAmenities(roomId: string): string[] {
  return roomId === 'honeymoon-suite'
    ? [...DEFAULT_AMENITIES, 'Refrigerator', 'Coffee Maker']
    : [...DEFAULT_AMENITIES];
}
