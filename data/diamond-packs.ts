import type { DiamondPack } from "@/types";

/** Diamond nominal options for the checkout page. */
export const diamondPacks: DiamondPack[] = [
  { diamonds: 5, price: 1500 },
  { diamonds: 12, price: 3400 },
  { diamonds: 28, price: 7500 },
  { diamonds: 44, price: 11500 },
  { diamonds: 59, price: 15500 },
  { diamonds: 86, price: 22000, tag: "HEMAT" },
  { diamonds: 172, price: 44000 },
  { diamonds: 257, price: 65000 },
  { diamonds: 344, price: 86000, tag: "POPULER" },
  { diamonds: 429, price: 107000 },
  { diamonds: 514, price: 128000 },
  { diamonds: 706, price: 175000 },
  { diamonds: 1050, price: 255000, tag: "BEST VALUE" },
  { diamonds: 2195, price: 520000 },
];
