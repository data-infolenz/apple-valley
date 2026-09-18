const gallery = (files: string[]) =>
  files.map((file) => `/src/Exclusive%20packages/${encodeURIComponent(file)}`);

export const packageImages: Record<string, string[]> = {
  'couple-misty-stay': gallery([
    'Couple misty stay (1).png',
    'Couple misty stay (2).png',
    'Couple misty stay (3).png',
    'Couple misty stay (1).jpg',
  ]),
  'family-vacation': gallery([
    'family vacation package (1).png',
    'family vacation package (2).png',
    'family vacation package (3).png',
    'family vacation package (1).jpg',
  ]),
  'honeymoon-hill-view': gallery([
    'honeymoon package (1).jpeg',
    'honeymoon package (2).jpeg',
    'honeymoon package (3).jpeg',
  ]),
};
