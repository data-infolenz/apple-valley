import familyRoom from '@/components/public/src/img/room pic 3.jpg';

const gallery = (folder: string, files: string[]) =>
  files.map((file) => `/src/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`);

export const roomImages: Record<string, string[]> = {
  deluxe: gallery('deluxe', ['7 (1).png', '7 (2).jpg', '7 (3).jpg', '7 (4).jpg', '7 (5).jpg', '7 (6).jpg', '7(7).jpg']),
  'super-deluxe': gallery('super delux', ['11 (1).jpg', '11 (1).png', '11 (2).png', '11 (3).png']),
  'triple-deluxe': gallery('triple deluxe', ['3.png', '4.png', '5.jpg', '6.png']),
  'honeymoon-suite': gallery('honeymoon', ['10 (1).png', '10 (2).png', '10 (3).png', '10 (4).png', '10 (5).png', '7(7).jpg']),
  'family-suite': [familyRoom.src],
};
