export interface Product {
  id: number;
  name: string;
  price: string;
  priceNum: number;
  description: string;
  altText: string;
  amazonUrl: string;
  image: string;
  category: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Yamaha F310 Acoustic Guitar",
    price: "₹12,500",
    priceNum: 12500,
    description:
      "The Yamaha F310 is one of the best beginner guitars in India, perfect for beginners and intermediate players.",
    altText: "Yamaha F310 best beginner acoustic guitar India",
    amazonUrl:
      "https://www.amazon.in/Yamaha-F310-Acoustic-Guitar-Strings/dp/B07V5J7V1Q",
    image:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80",
    category: "Guitar",
  },
  {
    id: 2,
    name: "Squier Fender Stratocaster",
    price: "₹18,000",
    priceNum: 18000,
    description:
      "Classic electric guitar for beginners with iconic Fender tone.",
    altText: "Squier Fender Stratocaster electric guitar for beginners India",
    amazonUrl: "https://www.amazon.in/s?k=Squier+Fender+Stratocaster",
    image:
      "https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=600&q=80",
    category: "Guitar",
  },
  {
    id: 3,
    name: "Casio CDP-S160 Digital Piano",
    price: "₹35,000",
    priceNum: 35000,
    description:
      "88 weighted keys with authentic piano sound, perfect for beginners in India.",
    altText: "Casio CDP-S160 digital piano beginner keyboard India best price",
    amazonUrl: "https://www.amazon.in/s?k=Casio+CDP-S160+Digital+Piano",
    image:
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600&q=80",
    category: "Piano",
  },
  {
    id: 4,
    name: "Pearl Export 5-Piece Drum Kit",
    price: "₹45,000",
    priceNum: 45000,
    description:
      "Complete drum kit for beginners with professional sound quality.",
    altText: "Pearl Export drum kit beginner drums India buy online",
    amazonUrl: "https://www.amazon.in/s?k=Pearl+Export+Drum+Kit",
    image:
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&q=80",
    category: "Drums",
  },
  {
    id: 5,
    name: "Yamaha YAS-280 Alto Saxophone",
    price: "₹52,000",
    priceNum: 52000,
    description:
      "Student saxophone with excellent intonation and easy playability.",
    altText: "Yamaha YAS-280 alto saxophone student beginner India",
    amazonUrl: "https://www.amazon.in/s?k=Yamaha+YAS-280+Alto+Saxophone",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&q=80",
    category: "Wind",
  },
  {
    id: 6,
    name: "Roland TD-1DMK Electronic Drums",
    price: "₹38,000",
    priceNum: 38000,
    description: "Electronic drum kit with mesh heads for quiet practice.",
    altText: "Roland TD-1DMK electronic drum kit mesh heads India buy",
    amazonUrl: "https://www.amazon.in/s?k=Roland+TD-1DMK+Electronic+Drums",
    image:
      "https://images.unsplash.com/photo-1573871669414-010dbf73ca84?w=600&q=80",
    category: "Drums",
  },
  {
    id: 7,
    name: "Ibanez GRX70QA Electric Guitar",
    price: "₹16,500",
    priceNum: 16500,
    description:
      "Stunning quilted art grain top with powerful humbuckers — a top pick for beginner electric guitarists in India.",
    altText: "Ibanez GRX70QA electric guitar beginner India buy online",
    amazonUrl: "https://www.amazon.in/s?k=Ibanez+GRX70QA+Electric+Guitar",
    image:
      "https://images.unsplash.com/photo-1605020420620-20c943cc4669?w=600&q=80",
    category: "Guitar",
  },
  {
    id: 8,
    name: "Casio CT-S300 Portable Keyboard",
    price: "₹4,500",
    priceNum: 4500,
    description:
      "61 keys, 48 built-in songs, and a slim design — the most affordable keyboard for beginners in India.",
    altText: "Casio CT-S300 portable keyboard beginner piano India affordable",
    amazonUrl: "https://www.amazon.in/s?k=Casio+CT-S300+Keyboard",
    image:
      "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&q=80",
    category: "Piano",
  },
  {
    id: 9,
    name: "Banjira Student Sitar",
    price: "₹8,500",
    priceNum: 8500,
    description:
      "Traditional Indian sitar crafted for students — ideal for beginners exploring classical Hindustani music.",
    altText: "Banjira student sitar Indian classical instrument beginner India",
    amazonUrl: "https://www.amazon.in/s?k=student+sitar+beginner",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    category: "Indian Classical",
  },
  {
    id: 10,
    name: "Toca Freestyle Djembe",
    price: "₹5,800",
    priceNum: 5800,
    description:
      "Lightweight djembe with warm tones — a great first hand percussion instrument for beginners and kids.",
    altText: "Toca Freestyle djembe hand drum beginner percussion India",
    amazonUrl: "https://www.amazon.in/s?k=djembe+drum+beginner",
    image:
      "https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?w=600&q=80",
    category: "Percussion",
  },
  {
    id: 11,
    name: "Yamaha YFL-222 Student Flute",
    price: "₹22,000",
    priceNum: 22000,
    description:
      "Silver-plated student flute with excellent response — trusted by music schools and beginners across India.",
    altText: "Yamaha YFL-222 student flute beginner wind instrument India",
    amazonUrl: "https://www.amazon.in/s?k=Yamaha+YFL-222+Flute",
    image:
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80",
    category: "Wind",
  },
  {
    id: 12,
    name: "Remo Fiberskyn Tabla Set",
    price: "₹6,200",
    priceNum: 6200,
    description:
      "Synthetic head tabla set for beginners — durable, easy to tune, and perfect for learning Indian classical rhythms.",
    altText:
      "Remo Fiberskyn tabla set Indian classical beginner percussion India",
    amazonUrl: "https://www.amazon.in/s?k=tabla+set+beginner",
    image:
      "https://images.unsplash.com/photo-1461784121038-f088ca1e7714?w=600&q=80",
    category: "Indian Classical",
  },
];
