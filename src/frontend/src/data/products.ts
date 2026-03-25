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
  imageRedirectUrl?: string;
  instrumentType?: string;
  specifications?: string;
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
    image: "/assets/generated/yamaha-f310-acoustic-guitar.dim_800x600.jpg",
    category: "Guitar",
    imageRedirectUrl:
      "https://www.amazon.in/Yamaha-F310-Acoustic-Guitar-Strings/dp/B07V5J7V1Q",
    instrumentType: "Acoustic",
    specifications:
      "Top: Spruce\nBack & Sides: Meranti\nNeck: Nato\nFingerboard: Rosewood\nScale Length: 634mm\nNut Width: 43mm\nTuning Machines: Die-cast chrome\nStrings: Yamaha strings included",
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
      "/assets/generated/squier-stratocaster-electric-guitar.dim_800x600.jpg",
    category: "Guitar",
    imageRedirectUrl: "https://www.amazon.in/s?k=Squier+Fender+Stratocaster",
    instrumentType: "Electric",
    specifications:
      "Body: Poplar\nNeck: Maple, C-shape\nFingerboard: Indian Laurel\nFrets: 21 medium jumbo\nPickups: 3x Single-coil\nBridge: 6-saddle vintage-style\nControls: 1V, 2T, 5-way switch",
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
    image: "/assets/generated/casio-cdp-s160-digital-piano.dim_800x600.jpg",
    category: "Piano",
    imageRedirectUrl: "https://www.amazon.in/s?k=Casio+CDP-S160+Digital+Piano",
    instrumentType: "Digital",
    specifications:
      "Keys: 88 Scaled Hammer Action\nPolyphony: 64 notes\nTones: 10 built-in\nSpeakers: 2x 8W\nConnectivity: USB, Headphone jack\nDimensions: 1322 x 232 x 76mm\nWeight: 10.5kg",
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
    image: "/assets/generated/pearl-export-drum-kit.dim_800x600.jpg",
    category: "Drums",
    imageRedirectUrl: "https://www.amazon.in/s?k=Pearl+Export+Drum+Kit",
    instrumentType: "Acoustic Kit",
    specifications:
      'Bass Drum: 22" x 18"\nSnare: 14" x 5.5"\nTom: 10" x 7" & 12" x 8"\nFloor Tom: 16" x 16"\nShell: Poplar/Mahogany\nHardware: 830 Series included\nCymbals: Not included',
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
    image: "/assets/generated/yamaha-yas-280-saxophone.dim_800x600.jpg",
    category: "Wind",
    imageRedirectUrl: "https://www.amazon.in/s?k=Yamaha+YAS-280+Alto+Saxophone",
    instrumentType: "Student",
    specifications:
      "Key: Eb Alto\nBody: Yellow brass\nFinish: Gold lacquer\nMouthpiece: Yamaha 4C included\nLigature: Metal\nCase: Included\nRange: Bb3 - F#6",
  },
  {
    id: 6,
    name: "Roland TD-1DMK Electronic Drums",
    price: "₹38,000",
    priceNum: 38000,
    description: "Electronic drum kit with mesh heads for quiet practice.",
    altText: "Roland TD-1DMK electronic drum kit mesh heads India buy",
    amazonUrl: "https://www.amazon.in/s?k=Roland+TD-1DMK+Electronic+Drums",
    image: "/assets/generated/roland-td1dmk-electronic-drums.dim_800x600.jpg",
    category: "Drums",
    imageRedirectUrl:
      "https://www.amazon.in/s?k=Roland+TD-1DMK+Electronic+Drums",
    instrumentType: "Electronic Kit",
    specifications:
      "Pads: Mesh snare + rubber toms\nCymbals: 3-zone ride, 2-zone hi-hat\nModule: TD-1DMK\nKick: KT-9 kick trigger\nSounds: 15 built-in drum kits\nConnectivity: USB, AUX in/out",
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
    image: "/assets/generated/ibanez-grx70qa-electric-guitar.dim_800x600.jpg",
    category: "Guitar",
    imageRedirectUrl:
      "https://www.amazon.in/s?k=Ibanez+GRX70QA+Electric+Guitar",
    instrumentType: "Electric",
    specifications:
      "Body: Poplar\nTop: Quilted Art Grain\nNeck: Maple\nFingerboard: Purpleheart\nFrets: 24 jumbo\nPickups: 2x Infinity R humbuckers\nBridge: GRX tremolo",
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
    image: "/assets/generated/casio-ct-s300-keyboard.dim_800x600.jpg",
    category: "Piano",
    imageRedirectUrl: "https://www.amazon.in/s?k=Casio+CT-S300+Keyboard",
    instrumentType: "Portable",
    specifications:
      "Keys: 61 standard\nTones: 61 built-in\nRhythms: 60 built-in\nSongs: 48 built-in\nPolyphony: 8 notes\nPower: 6 AA batteries or AC adapter\nWeight: 1.6kg",
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
    image: "/assets/generated/banjira-student-sitar.dim_800x600.jpg",
    category: "Indian Classical",
    imageRedirectUrl: "https://www.amazon.in/s?k=student+sitar+beginner",
    instrumentType: "Student",
    specifications:
      "Body: Teak/fiberglass\nStrings: 7 main + 13 sympathetic\nFrets: 20 movable brass\nTuning pegs: Bone\nGourd: Teak base\nFinish: Natural lacquer\nCase: Padded gig bag included",
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
    image: "/assets/generated/toca-freestyle-djembe.dim_800x600.jpg",
    category: "Percussion",
    imageRedirectUrl: "https://www.amazon.in/s?k=djembe+drum+beginner",
    instrumentType: "Hand Drum",
    specifications:
      'Head: 10" synthetic\nShell: Lightweight composite\nHeight: 24"\nRope tension system\nWeight: 2.5kg\nSuitable for ages 8+',
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
    image: "/assets/generated/yamaha-yfl-222-flute.dim_800x600.jpg",
    category: "Wind",
    imageRedirectUrl: "https://www.amazon.in/s?k=Yamaha+YFL-222+Flute",
    instrumentType: "Student",
    specifications:
      "Key: C\nBody: Silver-plated\nHeadJoint: Silver-plated\nMechanism: Offset G\nCut: Standard\nRange: C4 - D7\nCase: Hard case included",
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
    image: "/assets/generated/remo-fiberskyn-tabla.dim_800x600.jpg",
    category: "Indian Classical",
    imageRedirectUrl: "https://www.amazon.in/s?k=tabla+set+beginner",
    instrumentType: "Percussion",
    specifications:
      'Heads: Fiberskyn synthetic\nDayan diameter: 5.5"\nBayan diameter: 8"\nShell: Wood\nTuning: Strap and hammer\nIncludes: Hammer and cushion rings',
  },
];
