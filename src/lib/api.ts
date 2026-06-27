import { apiUrl } from './api-base';

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  brand?: {
    name: string;
  } | null;
  category?: {
    name: string;
  } | null;
  images: {
    imageUrl: string;
  }[];
  variants: {
    id: string;
    sku: string;
    name?: string | null;
    prices: {
      amount: string | number;
    }[];
    inventoryBalances: {
      onHandQty: number;
      reservedQty: number;
      damagedQty: number;
    }[];
  }[];
};

export type CatalogProductDetail = CatalogProduct & {
  description?: string | null;
  attributes: {
    id: string;
    attributeName: string;
    attributeValue: string;
  }[];
  images: {
    id?: string;
    imageUrl: string;
    altText?: string | null;
  }[];
  variants: (CatalogProduct['variants'][number] & {
    options: {
      id: string;
      name: string;
      value: string;
    }[];
  })[];
};

/**
 * Curated Hikvision catalog. Product names, SKUs, specs and the product photos
 * (under /public/products) are sourced from Hikvision's official datasheets.
 * Prices are local retail estimates in UZS and stock is illustrative.
 */
type HikSeed = {
  slug: string;
  name: string;
  sku: string;
  category: string;
  variantName: string;
  price: number;
  stock: number;
  image: string;
  description: string;
  attributes: [string, string][];
};

const HIK_SEED: HikSeed[] = [
  {
    slug: 'ds-2cd2143g2-i-4mp-dome',
    name: 'Hikvision DS-2CD2143G2-I — 4MP AcuSense Dome IP kamera',
    sku: 'DS-2CD2143G2-I',
    category: 'Tarmoq (IP) kameralar',
    variantName: '4MP / 2.8mm',
    price: 1150000,
    stock: 24,
    image: '/products/hik-dome-4mp.jpg',
    description:
      'AcuSense texnologiyali 4MP tarmoq dome kamerasi. Odam va transportni ajratib, ' +
      'soxta signallarni kamaytiradi. 120 dB WDR, IP67 va IK10 himoya, ' +
      'kechasi 30 m gacha IR yoritish. Ichki va tashqi muhitga mos.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2688 × 1520 @ 30 fps'],
      ['Sensor', '1/3" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm (sobit)'],
      ['Tungi rejim', 'Smart IR, 30 m'],
      ['WDR', '120 dB'],
      ['Himoya', 'IP67 · IK10'],
      ['Tahlil', 'AcuSense — odam/transport ajratish']
    ]
  },
  {
    slug: 'ds-2cd2087g2-lu-8mp-colorvu',
    name: 'Hikvision DS-2CD2087G2-LU — 8MP ColorVu Bullet IP kamera',
    sku: 'DS-2CD2087G2-LU',
    category: 'Tarmoq (IP) kameralar',
    variantName: '8MP (4K) / 2.8mm',
    price: 1790000,
    stock: 15,
    image: '/products/hik-bullet-8mp-colorvu.jpg',
    description:
      'ColorVu texnologiyasi bilan kechasi ham 24/7 rangli tasvir beruvchi 8MP (4K) ' +
      'bullet kamera. F1.0 yorug‘ obyektiv va ichki mikrofon. AcuSense bilan odam va ' +
      'transportni aniqlaydi. IP67 himoya — tashqi muhit uchun ideal.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '8 MP — 3840 × 2160 @ 20 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'ColorVu — doimiy oq nur, 40 m'],
      ['Audio', 'Ichki mikrofon'],
      ['Himoya', 'IP67'],
      ['Tahlil', 'AcuSense — odam/transport ajratish']
    ]
  },
  {
    slug: 'ds-2cd2047g2-lu-4mp-colorvu',
    name: 'Hikvision DS-2CD2047G2-LU — 4MP ColorVu Mini Bullet IP kamera',
    sku: 'DS-2CD2047G2-LU',
    category: 'Tarmoq (IP) kameralar',
    variantName: '4MP / 2.8mm',
    price: 1350000,
    stock: 18,
    image: '/products/hik-bullet-4mp-colorvu.png',
    description:
      '24/7 rangli tasvir beruvchi ixcham 4MP ColorVu mini bullet kamera. ' +
      'F1.0 obyektiv va yuqori sezgir sensor tufayli qorong‘uda ham aniq rangli kadr. ' +
      'Ichki mikrofon, 130 dB WDR va IP67 himoya.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2688 × 1520 @ 30 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'ColorVu — doimiy oq nur, 30 m'],
      ['WDR', '130 dB'],
      ['Audio', 'Ichki mikrofon'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2de4425iw-de-4mp-ptz',
    name: 'Hikvision DS-2DE4425IW-DE — 4MP 25× PTZ Speed Dome',
    sku: 'DS-2DE4425IW-DE',
    category: 'PTZ kameralar',
    variantName: '4MP / 25× optik zoom',
    price: 6200000,
    stock: 6,
    image: '/products/hik-ptz-4mp.jpg',
    description:
      'DarkFighter va AcuSense texnologiyali 4MP PTZ tezkor dome kamera. 25× optik zoom ' +
      'bilan keng hududni yaqindan kuzatadi, 100 m gacha IR yoritish. Avtomatik ' +
      'kuzatish (auto-tracking) va aniq pozitsiyalash. Tashqi muhit uchun IP66.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2560 × 1440 @ 25 fps'],
      ['Optik zoom', '25× (4.8–120 mm)'],
      ['Tungi rejim', 'IR, 100 m'],
      ['Harakat', 'Pan 360° · Tilt -15°…90°'],
      ['Tahlil', 'AcuSense + Auto-tracking'],
      ['Himoya', 'IP66']
    ]
  },
  {
    slug: 'ds-7608ni-i2-8p-nvr',
    name: 'Hikvision DS-7608NI-I2/8P — 8 kanalli 4K PoE NVR',
    sku: 'DS-7608NI-I2/8P',
    category: 'Yozib oluvchilar (NVR/DVR)',
    variantName: '8 kanal · 8 PoE · 2 HDD',
    price: 3400000,
    stock: 9,
    image: '/products/hik-nvr-8ch.png',
    description:
      '8 kanalli 4K tarmoq video yozib oluvchi (NVR), ichki 8 portli PoE switch bilan — ' +
      'kameralarni bitta kabel orqali ulang. 12 MP gacha kameralarni qo‘llaydi, 2 ta HDD ' +
      'uchun joy. AcuSense bilan odam/transport tahlili va aniq qidiruv.',
    attributes: [
      ['Kanallar', '8-ch IP, 12 MP gacha'],
      ['PoE', 'Ichki 8 port'],
      ['Chiqish', '1 × HDMI (4K) · 1 × VGA'],
      ['Disk', '2 × SATA HDD'],
      ['Tarmoq', 'Kiruvchi 80 Mbps'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-2ce76h0t-itpfs-5mp-turret',
    name: 'Hikvision DS-2CE76H0T-ITPFS — 5MP Turbo HD Turret (mikrofonli)',
    sku: 'DS-2CE76H0T-ITPFS',
    category: 'Turbo HD (analog) kameralar',
    variantName: '5MP / 2.8mm · audio',
    price: 520000,
    stock: 30,
    image: '/products/hik-turbo-turret-5mp.jpg',
    description:
      'Ichki mikrofonli 5MP Turbo HD turret kamera — bitta koaksial kabel orqali tasvir ' +
      'va ovozni uzatadi. Smart IR bilan 20 m gacha tungi yoritish. Hamyonbop va ' +
      'o‘rnatish oson — uy va kichik biznes uchun.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '5 MP — 2560 × 1944'],
      ['Format', 'Turbo HD / AHD / CVI / CVBS'],
      ['Obyektiv', '2.8 mm (sobit)'],
      ['Tungi rejim', 'Smart IR, 20 m'],
      ['Audio', 'Ichki mikrofon (koaksial orqali)'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2ce76h8t-itmf-5mp-turret',
    name: 'Hikvision DS-2CE76H8T-ITMF — 5MP Ultra Low Light Turbo HD Turret',
    sku: 'DS-2CE76H8T-ITMF',
    category: 'Turbo HD (analog) kameralar',
    variantName: '5MP / 2.8mm · Ultra Low Light',
    price: 690000,
    stock: 12,
    image: '/products/hik-turbo-turret-5mp-ull.jpg',
    description:
      'Ultra Low Light sensorli 5MP Turbo HD turret kamera — past yorug‘likda ham aniq ' +
      'tasvir. 130 dB WDR yorqin fonda obyektni ajratadi, EXIR 2.0 bilan 40 m gacha IR. ' +
      'Tashqi muhit uchun IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '5 MP — 2560 × 1944'],
      ['Sensor', 'Ultra Low Light'],
      ['Format', 'Turbo HD / AHD / CVI / CVBS'],
      ['Obyektiv', '2.8 mm (sobit)'],
      ['WDR', '130 dB'],
      ['Tungi rejim', 'EXIR 2.0, 40 m'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-7208hghi-k1-dvr',
    name: 'Hikvision DS-7208HGHI-K1 — 8 kanalli Turbo HD DVR',
    sku: 'DS-7208HGHI-K1',
    category: 'Yozib oluvchilar (NVR/DVR)',
    variantName: '8 kanal · 1 HDD',
    price: 1250000,
    stock: 14,
    image: '/products/hik-dvr-8ch.jpg',
    description:
      '8 kanalli Turbo HD DVR — analog (Turbo HD/AHD/CVI/CVBS) va IP kameralarni birga ' +
      'qo‘llaydi. H.265 Pro+ siqish bilan disk va tarmoqni tejaydi. Motion Detection 2.0 ' +
      'orqali odam/transportni ajratib soxta signalni kamaytiradi.',
    attributes: [
      ['Kanallar', '8-ch analog + IP kengaytma'],
      ['Yozish', '1080p Lite gacha'],
      ['Siqish', 'H.265 Pro+'],
      ['Chiqish', '1 × HDMI · 1 × VGA'],
      ['Disk', '1 × SATA HDD'],
      ['Tahlil', 'Motion Detection 2.0 (odam/transport)']
    ]
  },
  {
    slug: 'ds-2cd2347g2h-liu-4mp-colorvu-turret',
    name: 'Hikvision DS-2CD2347G2H-LIU — 4MP ColorVu Turret IP kamera',
    sku: 'DS-2CD2347G2H-LIU',
    category: 'Tarmoq (IP) kameralar',
    variantName: '4MP / 2.8mm · Smart Hybrid Light',
    price: 1450000,
    stock: 20,
    image: '/products/hik-turret-4mp-colorvu.jpg',
    description:
      'Smart Hybrid Light texnologiyali 4MP ColorVu turret kamera — kechasi avtomatik ' +
      'IR yoki oq nurni tanlaydi. F1.0 obyektiv bilan 24/7 rangli tasvir, ichki mikrofon. ' +
      'AcuSense odam/transport tahlili. IP67 himoya.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2688 × 1520 @ 30 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'Smart Hybrid Light (ColorVu + IR), 30 m'],
      ['Audio', 'Ichki mikrofon'],
      ['Tahlil', 'AcuSense — odam/transport'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2cd2387g2-lu-8mp-colorvu-turret',
    name: 'Hikvision DS-2CD2387G2-LU — 8MP ColorVu Turret IP kamera',
    sku: 'DS-2CD2387G2-LU',
    category: 'Tarmoq (IP) kameralar',
    variantName: '8MP (4K) / 2.8mm',
    price: 1850000,
    stock: 12,
    image: '/products/hik-turret-8mp-colorvu.jpg',
    description:
      'F1.0 obyektivli 8MP (4K) ColorVu turret kamera — kechasi ham yorqin rangli tasvir. ' +
      '130 dB WDR, ichki mikrofon va AcuSense odam/transport tahlili. Tashqi muhit uchun IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '8 MP — 3840 × 2160 @ 20 fps'],
      ['Sensor', '1/1.2" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'ColorVu — doimiy oq nur, 30 m'],
      ['WDR', '130 dB'],
      ['Audio', 'Ichki mikrofon'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2cd2186g2-isu-8mp-acusense-dome',
    name: 'Hikvision DS-2CD2186G2-ISU — 8MP AcuSense Dome IP kamera',
    sku: 'DS-2CD2186G2-ISU',
    category: 'Tarmoq (IP) kameralar',
    variantName: '8MP (4K) / 2.8mm',
    price: 1750000,
    stock: 10,
    image: '/products/hik-dome-8mp-acusense.jpg',
    description:
      'DarkFighter sensorli 8MP (4K) AcuSense dome kamera — past yorug‘likda aniq tasvir. ' +
      '120 dB WDR, ichki mikrofon va signal kirish/chiqishi, vandalga chidamli IK10 korpus. ' +
      'AcuSense odam/transportni ajratadi.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '8 MP — 3840 × 2160 @ 20 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS (DarkFighter)'],
      ['Obyektiv', '2.8 mm (sobit)'],
      ['Tungi rejim', 'EXIR, 30 m'],
      ['WDR', '120 dB'],
      ['Audio/Signal', 'Mikrofon + alarm I/O'],
      ['Himoya', 'IP67 · IK10'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-2cd2086g2-iu-8mp-acusense-bullet',
    name: 'Hikvision DS-2CD2086G2-IU — 8MP AcuSense Bullet IP kamera',
    sku: 'DS-2CD2086G2-IU',
    category: 'Tarmoq (IP) kameralar',
    variantName: '8MP (4K) / 2.8mm',
    price: 1690000,
    stock: 14,
    image: '/products/hik-bullet-8mp-acusense.jpg',
    description:
      '8MP (4K) AcuSense bullet kamera — EXIR bilan 40 m gacha tungi yoritish. 120 dB WDR, ' +
      'ichki mikrofon. AcuSense odam/transport tahlili bilan soxta signallarni kamaytiradi. IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '8 MP — 3840 × 2160 @ 20 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm (sobit)'],
      ['Tungi rejim', 'EXIR, 40 m'],
      ['WDR', '120 dB'],
      ['Audio', 'Ichki mikrofon'],
      ['Himoya', 'IP67'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-2cd2586g2-is-8mp-acusense-minidome',
    name: 'Hikvision DS-2CD2586G2-IS — 8MP AcuSense Mini Dome IP kamera',
    sku: 'DS-2CD2586G2-IS',
    category: 'Tarmoq (IP) kameralar',
    variantName: '8MP (4K) / 2.8mm · vandalbardosh',
    price: 1990000,
    stock: 8,
    image: '/products/hik-minidome-8mp-acusense.jpg',
    description:
      'Ixcham, vandalga chidamli 8MP (4K) AcuSense mini dome kamera — yopiq va yarim ochiq ' +
      'joylar uchun ideal. EXIR 30 m, 120 dB WDR, signal kirish/chiqishi. AcuSense tahlili.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '8 MP — 3840 × 2160 @ 20 fps'],
      ['Sensor', '1/2.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm (sobit)'],
      ['Tungi rejim', 'EXIR, 30 m'],
      ['WDR', '120 dB'],
      ['Himoya', 'IP67 · IK08 (vandalbardosh)'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-2cd2146g2-isu-4mp-acusense-dome',
    name: 'Hikvision DS-2CD2146G2-ISU — 4MP AcuSense Dome IP kamera',
    sku: 'DS-2CD2146G2-ISU',
    category: 'Tarmoq (IP) kameralar',
    variantName: '4MP / 2.8mm',
    price: 1290000,
    stock: 22,
    image: '/products/hik-dome-4mp-acusense.jpg',
    description:
      '4MP AcuSense dome kamera — ichki mikrofon va signal kirish/chiqishi bilan. EXIR 30 m, ' +
      '120 dB WDR. Vandalga chidamli IK10 korpus. AcuSense odam/transport tahlili.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2688 × 1520 @ 30 fps'],
      ['Sensor', '1/3" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm (sobit)'],
      ['Tungi rejim', 'EXIR, 30 m'],
      ['WDR', '120 dB'],
      ['Audio/Signal', 'Mikrofon + alarm I/O'],
      ['Himoya', 'IP67 · IK10'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-7216hghi-k1-16ch-dvr',
    name: 'Hikvision DS-7216HGHI-K1 — 16 kanalli Turbo HD DVR',
    sku: 'DS-7216HGHI-K1',
    category: 'Yozib oluvchilar (NVR/DVR)',
    variantName: '16 kanal · 1 HDD',
    price: 2150000,
    stock: 7,
    image: '/products/hik-dvr-16ch.jpg',
    description:
      '16 kanalli Turbo HD DVR — analog (Turbo HD/AHD/CVI/CVBS) va IP kameralarni birga ' +
      'qo‘llaydi. H.265 Pro+ siqish, Motion Detection 2.0 odam/transport tahlili. ' +
      'Katta obyektlar uchun mos.',
    attributes: [
      ['Kanallar', '16-ch analog + IP kengaytma'],
      ['Yozish', '1080p Lite gacha'],
      ['Siqish', 'H.265 Pro+'],
      ['Chiqish', '1 × HDMI · 1 × VGA'],
      ['Disk', '1 × SATA HDD'],
      ['Tahlil', 'Motion Detection 2.0 (odam/transport)']
    ]
  },
  {
    slug: 'ds-2ce16d0t-it3e-2mp-turbo-bullet',
    name: 'Hikvision DS-2CE16D0T-IT3E — 2MP Turbo HD Bullet (PoC)',
    sku: 'DS-2CE16D0T-IT3E',
    category: 'Turbo HD (analog) kameralar',
    variantName: '2MP / 2.8mm · PoC',
    price: 470000,
    stock: 25,
    image: '/products/hik-turbo-bullet-2mp.jpg',
    description:
      'PoC (Power over Coax) qo‘llab-quvvatlovchi 2MP Turbo HD bullet kamera — quvvat va tasvir ' +
      'bitta koaksial kabel orqali. EXIR bilan 40 m gacha tungi yoritish, 4-in-1 chiqish. ' +
      'Tashqi muhit uchun IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '2 MP — 1920 × 1080'],
      ['Format', 'Turbo HD / AHD / CVI / CVBS (4-in-1)'],
      ['Obyektiv', '2.8 mm (sobit)'],
      ['Tungi rejim', 'EXIR, 40 m'],
      ['Quvvat', 'PoC (koaksial orqali) / 12 VDC'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2cd2123g2-i-2mp-acusense-dome',
    name: 'Hikvision DS-2CD2123G2-I — 2MP AcuSense Dome IP kamera',
    sku: 'DS-2CD2123G2-I',
    category: 'Tarmoq (IP) kameralar',
    variantName: '2MP / 2.8mm',
    price: 950000,
    stock: 26,
    image: '/products/hik-dome-2mp-acusense.jpg',
    description:
      'Hamyonbop 2MP AcuSense dome kamera — odam/transport tahlili bilan soxta signallarni ' +
      'kamaytiradi. EXIR 30 m tungi yoritish, 120 dB WDR. Vandalga chidamli, ichki va ' +
      'tashqi muhitга mos.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '2 MP — 1920 × 1080 @ 30 fps'],
      ['Sensor', '1/2.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm (sobit)'],
      ['Tungi rejim', 'EXIR, 30 m'],
      ['WDR', '120 dB'],
      ['Himoya', 'IP67 · IK10'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-2cd2043g2-li2u-4mp-hybrid-bullet',
    name: 'Hikvision DS-2CD2043G2-LI2U — 4MP Smart Hybrid Light Bullet IP kamera',
    sku: 'DS-2CD2043G2-LI2U',
    category: 'Tarmoq (IP) kameralar',
    variantName: '4MP / 2.8mm · Smart Hybrid Light',
    price: 1390000,
    stock: 16,
    image: '/products/hik-bullet-4mp-hybrid.jpg',
    description:
      'Smart Hybrid Light texnologiyali 4MP bullet kamera — kechasi IR yoki oq nurni ' +
      'avtomatik tanlaydi. Ichki mikrofon, 130 dB WDR va AcuSense odam/transport tahlili. ' +
      'IP67 himoya.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2688 × 1520 @ 30 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'Smart Hybrid Light (IR + oq nur), 40 m'],
      ['WDR', '130 dB'],
      ['Audio', 'Ichki mikrofon'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2cd2t87g2-l-8mp-colorvu-bullet',
    name: 'Hikvision DS-2CD2T87G2-L — 8MP ColorVu Bullet IP kamera (Pro)',
    sku: 'DS-2CD2T87G2-L',
    category: 'Tarmoq (IP) kameralar',
    variantName: '8MP (4K) / 2.8mm',
    price: 1990000,
    stock: 9,
    image: '/products/hik-bullet-8mp-colorvu-pro.jpg',
    description:
      'Yuqori sinf 8MP (4K) ColorVu bullet kamera — F1.0 obyektiv bilan kechasi yorqin ' +
      'rangli tasvir. 130 dB WDR, uzoq masofali oq nur yoritish. Katta perimetr va ' +
      'avtoturargohlar uchun ideal. IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '8 MP — 3840 × 2160 @ 20 fps'],
      ['Sensor', '1/1.2" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'ColorVu — doimiy oq nur, 60 m'],
      ['WDR', '130 dB'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-7716ni-k4-16ch-nvr',
    name: 'Hikvision DS-7716NI-K4 — 16 kanalli 4K NVR',
    sku: 'DS-7716NI-K4',
    category: 'Yozib oluvchilar (NVR/DVR)',
    variantName: '16 kanal · 4 HDD',
    price: 4900000,
    stock: 5,
    image: '/products/hik-nvr-16ch.jpg',
    description:
      '16 kanalli 4K tarmoq video yozib oluvchi (NVR) — 4 ta HDD uchun joy, uzoq muddatli ' +
      'arxiv. 8 MP gacha kameralarni qo‘llaydi, 1U korpus. Katta obyektlar (do‘kon, ombor, ' +
      'zavod) uchun. Tashqi PoE switch bilan ishlatiladi.',
    attributes: [
      ['Kanallar', '16-ch IP, 8 MP gacha'],
      ['Disk', '4 × SATA HDD'],
      ['Chiqish', '1 × HDMI (4K) · 1 × VGA'],
      ['Tarmoq', 'Kiruvchi 160 Mbps'],
      ['Format', 'H.265+ / H.265 / H.264+ / H.264']
    ]
  },
  {
    slug: 'ds-2ce56d0t-irmf-2mp-turbo-turret',
    name: 'Hikvision DS-2CE56D0T-IRMF — 2MP Turbo HD Turret',
    sku: 'DS-2CE56D0T-IRMF',
    category: 'Turbo HD (analog) kameralar',
    variantName: '2MP / 2.8mm',
    price: 380000,
    stock: 30,
    image: '/products/hik-turbo-turret-2mp.jpg',
    description:
      'Hamyonbop 2MP Turbo HD turret kamera — Smart IR bilan 25 m gacha tungi yoritish. ' +
      '4-in-1 chiqish (TVI/AHD/CVI/CVBS), ixcham metall korpus. Uy va kichik biznes uchun ' +
      'eng arzon yechim. IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '2 MP — 1920 × 1080'],
      ['Format', 'Turbo HD / AHD / CVI / CVBS (4-in-1)'],
      ['Obyektiv', '2.8 mm (sobit)'],
      ['Tungi rejim', 'Smart IR, 25 m'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2ce10df3t-f-2mp-colorvu-turbo-bullet',
    name: 'Hikvision DS-2CE10DF3T-F — 2MP ColorVu Turbo HD Bullet',
    sku: 'DS-2CE10DF3T-F',
    category: 'Turbo HD (analog) kameralar',
    variantName: '2MP / 2.8mm · ColorVu',
    price: 520000,
    stock: 20,
    image: '/products/hik-turbo-colorvu-bullet-2mp.jpg',
    description:
      'ColorVu texnologiyali 2MP Turbo HD mini bullet — kechasi ham 24/7 rangli tasvir. ' +
      'F1.0 obyektiv va doimiy oq nur. Analog tizimlarni rangli tungi ko‘rishga yangilash ' +
      'uchun hamyonbop yechim. IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '2 MP — 1920 × 1080'],
      ['Format', 'Turbo HD / AHD / CVI / CVBS (4-in-1)'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'ColorVu — doimiy oq nur, 20 m'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2de2a404iw-de3-4mp-mini-ptz',
    name: 'Hikvision DS-2DE2A404IW-DE3 — 4MP 4× Mini PTZ kamera',
    sku: 'DS-2DE2A404IW-DE3',
    category: 'PTZ kameralar',
    variantName: '4MP / 4× optik zoom',
    price: 3950000,
    stock: 6,
    image: '/products/hik-ptz-mini-4mp.jpg',
    description:
      'Ixcham 4MP mini PTZ kamera — 4× optik zoom va 360° aylanish bilan keng hududni ' +
      'kuzatadi. IR 20 m tungi yoritish, tez va aniq pozitsiyalash. Kichik obyektlar uchun ' +
      'qulay PTZ yechim. IP66.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2560 × 1440 @ 25 fps'],
      ['Optik zoom', '4× (2.8–12 mm)'],
      ['Tungi rejim', 'IR, 20 m'],
      ['Harakat', 'Pan 350° · Tilt 90°'],
      ['Himoya', 'IP66']
    ]
  },
  {
    slug: 'ds-2cd2347g2-lsu-sl-4mp-colorvu-strobe-turret',
    name: 'Hikvision DS-2CD2347G2-LSU/SL — 4MP ColorVu Strobe Turret IP kamera',
    sku: 'DS-2CD2347G2-LSU/SL',
    category: 'Tarmoq (IP) kameralar',
    variantName: '4MP / 2.8mm · Strobe + Audio',
    price: 1650000,
    stock: 12,
    image: '/products/hik-turret-4mp-colorvu-strobe.jpg',
    description:
      'Faol himoyali 4MP ColorVu turret — chaqnoq (strobe) va ovozli ogohlantirish bilan ' +
      'buzg‘unchini qo‘rqitadi. 24/7 rangli tasvir, ichki mikrofon va karnay. AcuSense ' +
      'odam/transport tahlili. IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2688 × 1520 @ 30 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'ColorVu — doimiy oq nur, 30 m'],
      ['Faol himoya', 'Strobe chaqnoq + ovozli ogohlantirish'],
      ['Audio', 'Ichki mikrofon + karnay'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2cd2t47g2-lsu-sl-4mp-colorvu-strobe-bullet',
    name: 'Hikvision DS-2CD2T47G2-LSU/SL — 4MP ColorVu Strobe Bullet IP kamera',
    sku: 'DS-2CD2T47G2-LSU/SL',
    category: 'Tarmoq (IP) kameralar',
    variantName: '4MP / 2.8mm · Strobe + Audio',
    price: 1750000,
    stock: 14,
    image: '/products/hik-bullet-4mp-colorvu-strobe-t.jpg',
    description:
      'Faol himoyali 4MP ColorVu bullet kamera — chaqnoq (strobe) va ovozli ogohlantirish ' +
      'bilan buzg‘unchini qo‘rqitadi. F1.0 obyektiv, 24/7 rangli tasvir, ichki mikrofon va ' +
      'karnay. AcuSense odam/transport tahlili. Tashqi muhit uchun IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2688 × 1520 @ 30 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'ColorVu — doimiy oq nur, 60 m'],
      ['Faol himoya', 'Strobe chaqnoq + ovozli ogohlantirish'],
      ['Audio', 'Ichki mikrofon + karnay'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2cd2786g2-izs-8mp-varifocal-dome',
    name: 'Hikvision DS-2CD2786G2-IZS — 8MP AcuSense Motorli Varifokal Dome IP kamera',
    sku: 'DS-2CD2786G2-IZS',
    category: 'Tarmoq (IP) kameralar',
    variantName: '8MP (4K) / 2.8–12mm motorli',
    price: 2650000,
    stock: 8,
    image: '/products/hik-dome-8mp-vf.jpg',
    description:
      'DarkFighter sensorli 8MP (4K) AcuSense dome kamera — 2.8–12 mm motorli varifokal ' +
      'obyektiv bilan ko‘rish burchagi va masshtabni masofadan sozlash mumkin. 120 dB WDR, ' +
      'EXIR 40 m. Vandalbardosh IK10. AcuSense odam/transport tahlili.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '8 MP — 3840 × 2160 @ 20 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS (DarkFighter)'],
      ['Obyektiv', '2.8–12 mm motorli varifokal'],
      ['Tungi rejim', 'EXIR, 40 m'],
      ['WDR', '120 dB'],
      ['Himoya', 'IP66 · IK10'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-2cd2746g2-izs-4mp-varifocal-dome',
    name: 'Hikvision DS-2CD2746G2-IZS — 4MP AcuSense Motorli Varifokal Dome IP kamera',
    sku: 'DS-2CD2746G2-IZS',
    category: 'Tarmoq (IP) kameralar',
    variantName: '4MP / 2.8–12mm motorli',
    price: 1950000,
    stock: 12,
    image: '/products/hik-dome-4mp-vf.jpg',
    description:
      '4MP AcuSense dome kamera — 2.8–12 mm motorli varifokal obyektiv bilan o‘rnatishda ' +
      'qulay sozlash. 120 dB WDR, EXIR 40 m tungi yoritish. Vandalbardosh IK10 korpus. ' +
      'AcuSense odam/transportni ajratadi.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2688 × 1520 @ 30 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8–12 mm motorli varifokal'],
      ['Tungi rejim', 'EXIR, 40 m'],
      ['WDR', '120 dB'],
      ['Himoya', 'IP66 · IK10'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-2cd2663g2-izs-6mp-varifocal-bullet',
    name: 'Hikvision DS-2CD2663G2-IZS — 6MP AcuSense Motorli Varifokal Bullet IP kamera',
    sku: 'DS-2CD2663G2-IZS',
    category: 'Tarmoq (IP) kameralar',
    variantName: '6MP / 2.8–12mm motorli',
    price: 2250000,
    stock: 9,
    image: '/products/hik-bullet-6mp-vf.jpg',
    description:
      '6MP AcuSense bullet kamera — 2.8–12 mm motorli varifokal obyektiv bilan istalgan ' +
      'masofaga moslashadi. 120 dB WDR, EXIR 50 m gacha tungi yoritish. IP67 va IK10. ' +
      'AcuSense odam/transport tahlili soxta signallarni kamaytiradi.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '6 MP — 3200 × 1800 @ 25 fps'],
      ['Sensor', '1/2.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8–12 mm motorli varifokal · F1.6'],
      ['Tungi rejim', 'EXIR, 50 m'],
      ['WDR', '120 dB'],
      ['Himoya', 'IP67 · IK10'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-2cd2147g2-lsu-4mp-colorvu-dome',
    name: 'Hikvision DS-2CD2147G2-LSU — 4MP ColorVu Fixed Dome IP kamera',
    sku: 'DS-2CD2147G2-LSU',
    category: 'Tarmoq (IP) kameralar',
    variantName: '4MP / 2.8mm',
    price: 1450000,
    stock: 18,
    image: '/products/hik-dome-4mp-colorvu.jpg',
    description:
      'F1.0 obyektivli 4MP ColorVu dome kamera — kechasi ham 24/7 rangli tasvir. Ichki ' +
      'mikrofon, 130 dB WDR. AcuSense odam/transport tahlili. Ichki va yarim ochiq joylar ' +
      'uchun ixcham yechim.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2688 × 1520 @ 30 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'ColorVu — doimiy oq nur, 30 m'],
      ['WDR', '130 dB'],
      ['Audio', 'Ichki mikrofon'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2cd2387g2-lsu-sl-8mp-colorvu-strobe-turret',
    name: 'Hikvision DS-2CD2387G2-LSU/SL — 8MP ColorVu Strobe Turret IP kamera',
    sku: 'DS-2CD2387G2-LSU/SL',
    category: 'Tarmoq (IP) kameralar',
    variantName: '8MP (4K) / 2.8mm · Strobe + Audio',
    price: 2100000,
    stock: 10,
    image: '/products/hik-turret-8mp-colorvu-strobe.jpg',
    description:
      'Faol himoyali 8MP (4K) ColorVu turret — chaqnoq (strobe) va ovozli ogohlantirish ' +
      'bilan buzg‘unchini qo‘rqitadi. F1.0 obyektiv, 24/7 rangli tasvir, ichki mikrofon va ' +
      'karnay. AcuSense odam/transport tahlili. IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '8 MP — 3840 × 2160 @ 20 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'ColorVu — doimiy oq nur, 30 m'],
      ['Faol himoya', 'Strobe chaqnoq + ovozli ogohlantirish'],
      ['Audio', 'Ichki mikrofon + karnay'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2cd2683g2-izs-8mp-varifocal-bullet',
    name: 'Hikvision DS-2CD2683G2-IZS — 8MP AcuSense Motorli Varifokal Bullet IP kamera',
    sku: 'DS-2CD2683G2-IZS',
    category: 'Tarmoq (IP) kameralar',
    variantName: '8MP (4K) / 2.8–12mm motorli',
    price: 2750000,
    stock: 7,
    image: '/products/hik-bullet-8mp-vf.jpg',
    description:
      '8MP (4K) AcuSense bullet kamera — 2.8–12 mm motorli varifokal obyektiv bilan keng ' +
      'perimetrni qamrab oladi. 140 dB WDR, EXIR 60 m gacha tungi yoritish. IP67 · IK10. ' +
      'AcuSense odam/transport tahlili.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '8 MP — 3840 × 2160 @ 20 fps'],
      ['Sensor', '1/1.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8–12 mm motorli varifokal'],
      ['Tungi rejim', 'EXIR, 60 m'],
      ['WDR', '140 dB'],
      ['Himoya', 'IP67 · IK10'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-2cd2723g2-izs-2mp-varifocal-dome',
    name: 'Hikvision DS-2CD2723G2-IZS — 2MP AcuSense Motorli Varifokal Dome IP kamera',
    sku: 'DS-2CD2723G2-IZS',
    category: 'Tarmoq (IP) kameralar',
    variantName: '2MP / 2.8–12mm motorli',
    price: 1550000,
    stock: 16,
    image: '/products/hik-dome-2mp-vf.jpg',
    description:
      'Hamyonbop 2MP AcuSense dome kamera — 2.8–12 mm motorli varifokal obyektiv. 120 dB ' +
      'WDR, EXIR 40 m tungi yoritish. Vandalbardosh IK10. AcuSense odam/transport tahlili ' +
      'soxta signallarni kamaytiradi.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '2 MP — 1920 × 1080 @ 30 fps'],
      ['Sensor', '1/2.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8–12 mm motorli varifokal'],
      ['Tungi rejim', 'EXIR, 40 m'],
      ['WDR', '120 dB'],
      ['Himoya', 'IP67 · IK10'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-2cd2763g2-izs-6mp-varifocal-dome',
    name: 'Hikvision DS-2CD2763G2-IZS — 6MP AcuSense Motorli Varifokal Dome IP kamera',
    sku: 'DS-2CD2763G2-IZS',
    category: 'Tarmoq (IP) kameralar',
    variantName: '6MP / 2.8–12mm motorli',
    price: 2150000,
    stock: 9,
    image: '/products/hik-dome-6mp-vf.jpg',
    description:
      '6MP AcuSense dome kamera — 2.8–12 mm motorli varifokal obyektiv bilan o‘rnatishda ' +
      'qulay. 120 dB WDR, EXIR 40 m. Vandalbardosh IK10 korpus. AcuSense odam/transport ' +
      'tahlili.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '6 MP — 3200 × 1800 @ 25 fps'],
      ['Sensor', '1/2.8" Progressive Scan CMOS'],
      ['Obyektiv', '2.8–12 mm motorli varifokal'],
      ['Tungi rejim', 'EXIR, 40 m'],
      ['WDR', '120 dB'],
      ['Himoya', 'IP67 · IK10'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-2xs2t41g1-id-4g-4mp-solar-bullet',
    name: 'Hikvision DS-2XS2T41G1-ID/4G — 4MP Quyosh + 4G Bullet kamera',
    sku: 'DS-2XS2T41G1-ID/4G',
    category: 'Tarmoq (IP) kameralar',
    variantName: '4MP / 4G · quyosh paneli + akkumulyator',
    price: 4900000,
    stock: 5,
    image: '/products/hik-solar-4g-bullet.jpg',
    description:
      'Quyosh paneli va ichki akkumulyatorli 4MP bullet kamera — elektr va internet ' +
      'tarmog‘i yo‘q joylar uchun. 4G SIM orqali ulanadi, PIR sensori bilan harakatni ' +
      'aniqlaydi, ColorVu rangli tungi tasvir. To‘liq simsiz mustaqil ishlash.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2560 × 1440'],
      ['Ulanish', '4G LTE (SIM) + Wi-Fi'],
      ['Quvvat', 'Quyosh paneli + ichki akkumulyator'],
      ['Sensor', 'PIR harakat detektori'],
      ['Tungi rejim', 'ColorVu / IR'],
      ['Himoya', 'IP66']
    ]
  },
  {
    slug: 'ds-2de5425iw-ae-4mp-25x-ptz',
    name: 'Hikvision DS-2DE5425IW-AE — 4MP 25× DarkFighter PTZ Speed Dome',
    sku: 'DS-2DE5425IW-AE',
    category: 'PTZ kameralar',
    variantName: '4MP / 25× optik zoom',
    price: 7900000,
    stock: 5,
    image: '/products/hik-ptz-5in-4mp.jpg',
    description:
      'DarkFighter va AcuSense texnologiyali 4MP PTZ tezkor dome — 25× optik zoom bilan ' +
      'keng hududni yaqindan kuzatadi, 150 m gacha IR. Avtomatik kuzatish (auto-tracking) ' +
      'va aniq pozitsiyalash. Tashqi muhit uchun IP66.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '4 MP — 2560 × 1440 @ 25 fps'],
      ['Optik zoom', '25× (4.8–120 mm)'],
      ['Tungi rejim', 'IR, 150 m'],
      ['Harakat', 'Pan 360° · Tilt -20°…90°'],
      ['Tahlil', 'AcuSense + Auto-tracking'],
      ['Himoya', 'IP66']
    ]
  },
  {
    slug: 'ds-2de7232iw-ae-2mp-32x-ptz',
    name: 'Hikvision DS-2DE7232IW-AE — 2MP 32× IR PTZ Speed Dome',
    sku: 'DS-2DE7232IW-AE',
    category: 'PTZ kameralar',
    variantName: '2MP / 32× optik zoom',
    price: 9500000,
    stock: 4,
    image: '/products/hik-ptz-7in-2mp.jpg',
    description:
      '2MP 32× optik zoomli IR PTZ tezkor dome — uzoq masofadagi obyektlarni yaqindan ' +
      'ko‘rsatadi, 150 m gacha IR yoritish. Aniq pan/tilt boshqaruvi va preset/patrul ' +
      'rejimlari. Katta perimetr va ochiq maydonlar uchun. IP66.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '2 MP — 1920 × 1080 @ 30 fps'],
      ['Optik zoom', '32× (4.8–153 mm)'],
      ['Tungi rejim', 'IR, 150 m'],
      ['Harakat', 'Pan 360° · Tilt -15°…90°'],
      ['Funksiyalar', 'Preset · patrul · pattern'],
      ['Himoya', 'IP66']
    ]
  },
  {
    slug: 'ds-7608ni-k2-8p-8ch-poe-nvr',
    name: 'Hikvision DS-7608NI-K2/8P — 8 kanalli 4K PoE NVR',
    sku: 'DS-7608NI-K2/8P',
    category: 'Yozib oluvchilar (NVR/DVR)',
    variantName: '8 kanal · 8 PoE · 2 HDD',
    price: 2950000,
    stock: 9,
    image: '/products/hik-nvr-8ch-k2.jpg',
    description:
      '8 kanalli 4K tarmoq video yozib oluvchi (NVR), ichki 8 portli PoE switch bilan — ' +
      'kameralarni bitta kabel orqali ulang. 8 MP gacha kameralarni qo‘llaydi, 2 ta HDD ' +
      'uchun joy. AcuSense tahlili va aniq qidiruv.',
    attributes: [
      ['Kanallar', '8-ch IP, 8 MP gacha'],
      ['PoE', 'Ichki 8 port'],
      ['Chiqish', '1 × HDMI (4K) · 1 × VGA'],
      ['Disk', '2 × SATA HDD'],
      ['Tarmoq', 'Kiruvchi 80 Mbps'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-7616ni-k2-16p-16ch-poe-nvr',
    name: 'Hikvision DS-7616NI-K2/16P — 16 kanalli 4K PoE NVR',
    sku: 'DS-7616NI-K2/16P',
    category: 'Yozib oluvchilar (NVR/DVR)',
    variantName: '16 kanal · 16 PoE · 2 HDD',
    price: 4300000,
    stock: 6,
    image: '/products/hik-nvr-16ch-k2.jpg',
    description:
      '16 kanalli 4K tarmoq video yozib oluvchi (NVR), ichki 16 portli PoE switch bilan. ' +
      '8 MP gacha kameralarni qo‘llaydi, 2 ta HDD uchun joy. Plug & Play — kameralar ' +
      'avtomatik ulanadi. O‘rta va katta obyektlar uchun.',
    attributes: [
      ['Kanallar', '16-ch IP, 8 MP gacha'],
      ['PoE', 'Ichki 16 port'],
      ['Chiqish', '1 × HDMI (4K) · 1 × VGA'],
      ['Disk', '2 × SATA HDD'],
      ['Tarmoq', 'Kiruvchi 160 Mbps'],
      ['Format', 'H.265+ / H.265 / H.264+ / H.264']
    ]
  },
  {
    slug: 'ds-7604ni-k1-4p-4ch-mini-nvr',
    name: 'Hikvision DS-7604NI-K1/4P — 4 kanalli 4K Mini PoE NVR',
    sku: 'DS-7604NI-K1/4P',
    category: 'Yozib oluvchilar (NVR/DVR)',
    variantName: '4 kanal · 4 PoE · 1 HDD',
    price: 1350000,
    stock: 16,
    image: '/products/hik-nvr-4ch-mini.jpg',
    description:
      'Ixcham 4 kanalli 4K Mini NVR, ichki 4 portli PoE switch bilan — uy va kichik biznes ' +
      'uchun ideal. 8 MP gacha kameralarni qo‘llaydi, 1 ta HDD. Plug & Play, AcuSense ' +
      'odam/transport tahlili.',
    attributes: [
      ['Kanallar', '4-ch IP, 8 MP gacha'],
      ['PoE', 'Ichki 4 port'],
      ['Chiqish', '1 × HDMI (4K) · 1 × VGA'],
      ['Disk', '1 × SATA HDD'],
      ['Tarmoq', 'Kiruvchi 40 Mbps'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ids-7208hqhi-m1-s-8ch-acusense-dvr',
    name: 'Hikvision iDS-7208HQHI-M1/S — 8 kanalli AcuSense Turbo HD DVR',
    sku: 'iDS-7208HQHI-M1/S',
    category: 'Yozib oluvchilar (NVR/DVR)',
    variantName: '8 kanal · 1 HDD · AcuSense',
    price: 1750000,
    stock: 11,
    image: '/products/hik-dvr-8ch-acusense.jpg',
    description:
      '8 kanalli AcuSense Turbo HD DVR — analog (Turbo HD/AHD/CVI/CVBS) va IP kameralarni ' +
      'birga qo‘llaydi. Motion Detection 2.0 va chuqur o‘rganish (deep learning) bilan ' +
      'odam/transportni ajratib, soxta signalni keskin kamaytiradi. H.265 Pro+.',
    attributes: [
      ['Kanallar', '8-ch analog + IP kengaytma'],
      ['Yozish', '3K/5MP Lite gacha'],
      ['Siqish', 'H.265 Pro+'],
      ['Chiqish', '1 × HDMI · 1 × VGA'],
      ['Disk', '1 × SATA HDD'],
      ['Tahlil', 'AcuSense — odam/transport']
    ]
  },
  {
    slug: 'ds-2ce16d0t-irf-2mp-turbo-bullet',
    name: 'Hikvision DS-2CE16D0T-IRF — 2MP Turbo HD Bullet kamera',
    sku: 'DS-2CE16D0T-IRF',
    category: 'Turbo HD (analog) kameralar',
    variantName: '2MP / 2.8mm',
    price: 320000,
    stock: 30,
    image: '/products/hik-turbo-bullet-2mp-irf.jpg',
    description:
      'Hamyonbop 2MP Turbo HD bullet kamera — Smart IR bilan 25 m gacha tungi yoritish. ' +
      '4-in-1 chiqish (TVI/AHD/CVI/CVBS), metall korpus. Uy va kichik biznes uchun eng ' +
      'arzon tashqi yechim. IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '2 MP — 1920 × 1080'],
      ['Format', 'Turbo HD / AHD / CVI / CVBS (4-in-1)'],
      ['Obyektiv', '2.8 mm (sobit)'],
      ['Tungi rejim', 'Smart IR, 25 m'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2ce72df3t-f-2mp-colorvu-turbo-turret',
    name: 'Hikvision DS-2CE72DF3T-F — 2MP ColorVu Turbo HD Turret kamera',
    sku: 'DS-2CE72DF3T-F',
    category: 'Turbo HD (analog) kameralar',
    variantName: '2MP / 2.8mm · ColorVu',
    price: 540000,
    stock: 22,
    image: '/products/hik-turbo-colorvu-turret-2mp.jpg',
    description:
      'ColorVu texnologiyali 2MP Turbo HD turret — kechasi ham 24/7 rangli tasvir. F1.0 ' +
      'obyektiv va doimiy oq nur 40 m gacha. 130 dB WDR. Analog tizimni rangli tungi ' +
      'ko‘rishga yangilash uchun hamyonbop yechim. IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '2 MP — 1920 × 1080'],
      ['Format', 'Turbo HD / AHD / CVI / CVBS (4-in-1)'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'ColorVu — doimiy oq nur, 40 m'],
      ['WDR', '130 dB'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2ce72uf3t-e-4k-colorvu-turbo-turret',
    name: 'Hikvision DS-2CE72UF3T-E — 4K ColorVu PoC Turbo HD Turret kamera',
    sku: 'DS-2CE72UF3T-E',
    category: 'Turbo HD (analog) kameralar',
    variantName: '8MP (4K) / 2.8mm · ColorVu PoC',
    price: 850000,
    stock: 14,
    image: '/products/hik-turbo-colorvu-turret-4k.jpg',
    description:
      '4K (8MP) ColorVu Turbo HD turret — analog tizimda ham 4K aniqlik va 24/7 rangli ' +
      'tasvir. F1.0 obyektiv, PoC (koaksial orqali quvvat) qo‘llab-quvvatlaydi. Eng yuqori ' +
      'sifatli analog yechim. IP67.',
    attributes: [
      ['Ruxsat (rezolyutsiya)', '8 MP (4K) — 3840 × 2160'],
      ['Format', 'Turbo HD / AHD / CVI / CVBS (4-in-1)'],
      ['Obyektiv', '2.8 mm · F1.0'],
      ['Tungi rejim', 'ColorVu — doimiy oq nur, 40 m'],
      ['Quvvat', 'PoC (koaksial orqali) / 12 VDC'],
      ['Himoya', 'IP67']
    ]
  },
  {
    slug: 'ds-2td1217-2-qa-thermal-turret',
    name: 'Hikvision DS-2TD1217-2/QA — Termal + Optik Bi-spektral Turret kamera',
    sku: 'DS-2TD1217-2/QA',
    category: 'Termal kameralar',
    variantName: 'Termal 160×120 + 4MP optik',
    price: 11500000,
    stock: 3,
    image: '/products/hik-thermal-turret.jpg',
    description:
      'Termal va optik (bi-spektral) turret kamera — qorong‘ulik, tutun va tumanda ham ' +
      'harorat bo‘yicha aniqlaydi. Yong‘inni erta sezish va harorat o‘lchash, chuqur ' +
      'o‘rganish bilan obyekt tahlili. Ombor, ishlab chiqarish va perimetr uchun.',
    attributes: [
      ['Termal sensor', '160 × 120 px, far-infrared'],
      ['Optik sensor', '4 MP — 2688 × 1520'],
      ['Funksiya', 'Yong‘in/harorat aniqlash (VCA)'],
      ['Tungi rejim', 'Termal — 0 lyuksda ishlaydi'],
      ['Tahlil', 'Deep learning xulq-atvor tahlili'],
      ['Himoya', 'IP66']
    ]
  },
  {
    slug: 'ds-kv6113-wpe1-villa-door-station',
    name: 'Hikvision DS-KV6113-WPE1 — Videodomofon Villa Tashqi Paneli',
    sku: 'DS-KV6113-WPE1',
    category: 'Domofon (videodomofon)',
    variantName: '2MP · PoE · Mifare',
    price: 1450000,
    stock: 12,
    image: '/products/hik-intercom-villa-door.jpg',
    description:
      'Villa va xususiy uylar uchun IP videodomofon tashqi paneli — 2MP keng burchakli ' +
      'kamera, IR tungi yoritish, ichki Mifare karta o‘qigich. PoE bilan bitta kabel orqali ' +
      'ishlaydi, IP65 himoya. Hik-Connect ilovasi orqali telefonga qo‘ng‘iroq.',
    attributes: [
      ['Kamera', '2 MP, keng burchak'],
      ['Tungi rejim', 'IR yoritish'],
      ['Karta', 'Ichki Mifare o‘qigich'],
      ['Ulanish', 'Standart PoE / 12 VDC'],
      ['Ilova', 'Hik-Connect (mobil qo‘ng‘iroq)'],
      ['Himoya', 'IP65']
    ]
  },
  {
    slug: 'ds-kh6320-wte1-indoor-station',
    name: 'Hikvision DS-KH6320-WTE1 — Videodomofon Ichki Monitori (7")',
    sku: 'DS-KH6320-WTE1',
    category: 'Domofon (videodomofon)',
    variantName: '7" sensorli ekran · PoE',
    price: 1650000,
    stock: 10,
    image: '/products/hik-intercom-indoor-7in.jpg',
    description:
      '7 dyumli sensorli ekranli IP videodomofon ichki monitori — tashqi paneldan ' +
      'qo‘ng‘iroqni qabul qiladi, eshikni masofadan ochadi. PoE bilan ishlaydi, Hik-Connect ' +
      'orqali telefonga uzatish. Zamonaviy va qulay interfeys.',
    attributes: [
      ['Ekran', '7" sensorli (1024 × 600)'],
      ['Ulanish', 'Standart PoE / 12 VDC'],
      ['Funksiya', 'Video qo‘ng‘iroq · eshik ochish'],
      ['Ilova', 'Hik-Connect (mobil uzatish)'],
      ['Xotira', 'microSD (suratga olish)']
    ]
  },
  {
    slug: 'ds-kd8003-ime1-module-door-station',
    name: 'Hikvision DS-KD8003-IME1 — Modulli Videodomofon Tashqi Paneli',
    sku: 'DS-KD8003-IME1',
    category: 'Domofon (videodomofon)',
    variantName: '2MP fisheye · modulli · PoE',
    price: 1250000,
    stock: 9,
    image: '/products/hik-intercom-module-door.jpg',
    description:
      'KD8 seriyali modulli videodomofon tashqi paneli — 2MP fisheye kamera, IR yoritish, ' +
      'bitta chaqiruv tugmasi. Qo‘shimcha modullar (klaviatura, karta) bilan kengaytirish ' +
      'mumkin. Ikki qulfni boshqaradi, PoE, IP65.',
    attributes: [
      ['Kamera', '2 MP fisheye, IR'],
      ['Tugma', '1 ta chaqiruv tugmasi'],
      ['Kengaytirish', 'Modulli (klaviatura/karta moduli)'],
      ['Qulf', '2 ta qulf boshqaruvi'],
      ['Ulanish', 'Standart PoE'],
      ['Himoya', 'IP65']
    ]
  },
  {
    slug: 'ds-kis603-p-video-intercom-kit',
    name: 'Hikvision DS-KIS603-P — IP Videodomofon To‘plami (Komplekt)',
    sku: 'DS-KIS603-P',
    category: 'Domofon (videodomofon)',
    variantName: 'Tashqi panel + 7" monitor',
    price: 3200000,
    stock: 8,
    image: '/products/hik-intercom-kit.jpg',
    description:
      'Tayyor IP videodomofon to‘plami — villa tashqi paneli (2MP kamera) va 7 dyumli ' +
      'sensorli ichki monitor birga. O‘rnatish oson, PoE bilan ishlaydi. Hik-Connect orqali ' +
      'telefonga qo‘ng‘iroq. Xususiy uy uchun to‘liq yechim.',
    attributes: [
      ['Tarkib', 'Tashqi panel + 7" ichki monitor'],
      ['Kamera', '2 MP, IR tungi yoritish'],
      ['Ekran', '7" sensorli'],
      ['Ulanish', 'Standart PoE'],
      ['Ilova', 'Hik-Connect (mobil qo‘ng‘iroq)']
    ]
  },
  {
    slug: 'ds-k1t341am-s-face-recognition-terminal',
    name: 'Hikvision DS-K1T341AM-S — Yuzni Tanish Kirish Terminali',
    sku: 'DS-K1T341AM-S',
    category: 'Kirishni boshqarish',
    variantName: 'Yuz + karta + parol',
    price: 2650000,
    stock: 7,
    image: '/products/hik-access-face-terminal.jpg',
    description:
      'Chuqur o‘rganish (deep learning) algoritmli yuzni tanish kirish terminali — 0.2 ' +
      'soniyada yuzni aniqlaydi (99%+ aniqlik). Yuz, karta va parol bilan autentifikatsiya. ' +
      '3000 ta yuz sig‘imi. Ofis, biznes va davomatni hisobga olish uchun.',
    attributes: [
      ['Tanish usuli', 'Yuz · karta · parol'],
      ['Aniqlash vaqti', '< 0.2 s, 99%+ aniqlik'],
      ['Sig‘im', '3000 yuz / 3000 karta'],
      ['Ekran', '2.4" displey'],
      ['Funksiya', 'Davomat (attendance) hisobi'],
      ['Aloqa', 'TCP/IP · Wi-Fi']
    ]
  },
  {
    slug: 'ds-k1t342mfx-minmoe-face-terminal',
    name: 'Hikvision DS-K1T342MFX — MinMoe Yuzni Tanish Terminali',
    sku: 'DS-K1T342MFX',
    category: 'Kirishni boshqarish',
    variantName: 'MinMoe yuz + Mifare karta',
    price: 2900000,
    stock: 6,
    image: '/products/hik-access-minmoe.jpg',
    description:
      'MinMoe yuzni tanish terminali — 4.3 dyumli ekran, chuqur o‘rganishli tezkor va aniq ' +
      'yuz tanish (niqob bilan ham). Mifare karta o‘qigich, jonlilikni aniqlash (anti-spoof). ' +
      'Ofis kirishi va davomat uchun zamonaviy yechim.',
    attributes: [
      ['Tanish usuli', 'Yuz · Mifare karta · parol'],
      ['Ekran', '4.3" LCD'],
      ['Aniqlash vaqti', '< 0.2 s'],
      ['Sig‘im', '6000 yuz / 10000 karta'],
      ['Himoya', 'Jonlilikni aniqlash (anti-spoofing)'],
      ['Aloqa', 'TCP/IP']
    ]
  },
  {
    slug: 'ds-k1t804amf-fingerprint-terminal',
    name: 'Hikvision DS-K1T804AMF — Barmoq Izi Kirish Terminali',
    sku: 'DS-K1T804AMF',
    category: 'Kirishni boshqarish',
    variantName: 'Barmoq izi + Mifare karta',
    price: 2400000,
    stock: 8,
    image: '/products/hik-access-fingerprint.jpg',
    description:
      'Barmoq izi va Mifare karta bilan ishlovchi kirishni boshqarish terminali — klaviatura ' +
      'orqali parol ham kiritiladi. Mustaqil yoki tarmoqqa ulangan holda ishlaydi, davomatni ' +
      'hisoblaydi. Ofis va ishlab chiqarish uchun ishonchli yechim.',
    attributes: [
      ['Tanish usuli', 'Barmoq izi · karta · parol'],
      ['Sig‘im', '3000 barmoq izi / karta'],
      ['Klaviatura', 'Bor (parol kiritish)'],
      ['Funksiya', 'Davomat (attendance) hisobi'],
      ['Aloqa', 'TCP/IP · Wiegand']
    ]
  },
  {
    slug: 'ds-pdpg12p-eg2-pir-glass-detector',
    name: 'Hikvision DS-PDPG12P-EG2 — Simsiz PIR + Oyna Sinishi Detektori',
    sku: 'DS-PDPG12P-EG2-WB',
    category: 'Signalizatsiya',
    variantName: 'AX PRO · PIR + glass-break',
    price: 520000,
    stock: 20,
    image: '/products/hik-alarm-pir-glass.jpg',
    description:
      'AX PRO simsiz signalizatsiya detektori — bir vaqtning o‘zida harakatni (PIR, 12 m) ' +
      'va oyna sinishini aniqlaydi. 30 kg gacha uy hayvonlariga befarq (pet immunity). ' +
      'Ilova orqali sozlanadi. Uy va ofis xavfsizligi uchun.',
    attributes: [
      ['Aniqlash', 'PIR 12 m / 85.9° + oyna sinishi 8 m'],
      ['Pet immunity', '30 kg gacha'],
      ['Protokol', 'Tri-X simsiz, AES-128'],
      ['Sozlash', 'Hik-Connect / AX PRO ilova'],
      ['Quvvat', 'Batareya (uzoq muddat)']
    ]
  },
  {
    slug: 'ds-3e0310hp-e-8port-poe-switch',
    name: 'Hikvision DS-3E0310HP-E — 8 portli boshqarilmaydigan PoE Switch',
    sku: 'DS-3E0310HP-E',
    category: 'Tarmoq uskunalari',
    variantName: '8 PoE + 2 Gigabit uplink',
    price: 1150000,
    stock: 15,
    image: '/products/hik-switch-8poe.jpg',
    description:
      '8 portli boshqarilmaydigan (unmanaged) PoE switch — kameralarni quvvat va tarmoq ' +
      'bilan bitta kabel orqali ta’minlaydi. 802.3bt Hi-PoE, bitta portda 90 Wt gacha, ' +
      'jami 120 Wt. 2 ta Gigabit uplink, 300 m gacha uzatish, 6 kV chaqmoq himoyasi.',
    attributes: [
      ['Portlar', '8 × PoE (10/100) + 2 × Gigabit RJ45'],
      ['PoE quvvati', 'Jami 120 Wt · porti 90 Wt gacha'],
      ['Standart', 'IEEE 802.3af/at/bt'],
      ['Masofa', '300 m gacha (PoE rejimda)'],
      ['Himoya', '6 kV chaqmoqdan himoya'],
      ['Korpus', 'Metall · ventilyatorsiz']
    ]
  },
  {
    slug: 'ds-d5024fn-24-monitor',
    name: 'Hikvision DS-D5024FN — 23.8" Full HD Kuzatuv Monitori',
    sku: 'DS-D5024FN',
    category: 'Monitorlar',
    variantName: '23.8" · 1920×1080 · HDMI/VGA',
    price: 1550000,
    stock: 12,
    image: '/products/hik-monitor-24.jpg',
    description:
      '23.8 dyumli Full HD LED kuzatuv monitori — videokuzatuv tizimlari uchun 24/7 ' +
      'uzluksiz ishlashga mo‘ljallangan. HDMI va VGA kirishlari, keng ko‘rish burchagi. ' +
      'NVR/DVR’ga to‘g‘ridan-to‘g‘ri ulanadi.',
    attributes: [
      ['Ekran', '23.8" LED, 1920 × 1080'],
      ['Kirishlar', '1 × HDMI · 1 × VGA'],
      ['Ish rejimi', '24/7 uzluksiz'],
      ['Yangilanish', '60 Hz'],
      ['Quvvat', '100–240 VAC']
    ]
  }
];

const hikvisionCatalog: CatalogProductDetail[] = HIK_SEED.map((seed) => ({
  id: seed.slug,
  name: seed.name,
  slug: seed.slug,
  brand: { name: 'Hikvision' },
  category: { name: seed.category },
  images: [{ id: `${seed.slug}-img`, imageUrl: seed.image, altText: seed.name }],
  description: seed.description,
  attributes: seed.attributes.map(([attributeName, attributeValue], i) => ({
    id: `${seed.slug}-attr-${i}`,
    attributeName,
    attributeValue
  })),
  variants: [
    {
      id: `${seed.slug}-v1`,
      sku: seed.sku,
      name: seed.variantName,
      prices: [{ amount: seed.price }],
      inventoryBalances: [
        { onHandQty: seed.stock, reservedQty: 0, damagedQty: 0 }
      ],
      options: []
    }
  ]
}));

export async function getProductBySlug(slug: string): Promise<CatalogProductDetail | null> {
  return hikvisionCatalog.find((p) => p.slug === slug) ?? null;
}

export type OtpRequestResult = {
  phone: string;
  expiresIn: number;
  devCode?: string;
};

export type OtpSession = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: { id: string; phone: string; roles: string[] };
};

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string };

async function postJson<T>(
  path: string,
  body: unknown
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(apiUrl(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const json = (await res.json().catch(() => null)) as
      | (T & { code?: string; message?: string })
      | null;
    if (!res.ok || !json) {
      return {
        ok: false,
        code: json?.code ?? 'REQUEST_FAILED',
        message: json?.message ?? 'So‘rov bajarilmadi. Qayta urinib ko‘ring.'
      };
    }
    return { ok: true, data: json };
  } catch {
    return {
      ok: false,
      code: 'NETWORK_ERROR',
      message: 'Internetga ulanishda muammo. Ulanishni tekshiring.'
    };
  }
}

/** Requests an OTP code for staff (operator/admin) phone login. */
export function requestOtp(phone: string) {
  return postJson<OtpRequestResult>('/api/v1/auth/otp/request', { phone });
}

/** Verifies the OTP code and returns a session. */
export function verifyOtp(phone: string, code: string, deviceName?: string) {
  return postJson<OtpSession>('/api/v1/auth/otp/verify', {
    phone,
    code,
    deviceName
  });
}

export type TelegramOrderIntentItem = {
  name: string;
  sku: string;
  variantName?: string;
  quantity: number;
};

export type TelegramOrderIntentResult = {
  token: string;
  /** `https://t.me/<bot>?start=<token>` — null if the bot username is unknown. */
  url: string | null;
};

/**
 * Hands a guest checkout off to the Telegram order bot. The server stashes the
 * order under a short token and returns a `t.me/<bot>?start=<token>` deep link;
 * opening it and pressing Start makes the bot post the order to the operators.
 */
export function createTelegramOrderIntent(payload: {
  fullName: string;
  phone: string;
  items: TelegramOrderIntentItem[];
}) {
  return postJson<TelegramOrderIntentResult>(
    '/api/v1/checkout/telegram-intent',
    payload
  );
}

export async function getCatalogProducts(query?: string): Promise<CatalogProduct[]> {
  const q = query?.trim().toLowerCase();
  if (!q) return hikvisionCatalog;

  return hikvisionCatalog.filter((p) => {
    const haystack = [
      p.name,
      p.brand?.name ?? '',
      p.category?.name ?? '',
      ...p.variants.map((v) => v.sku)
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}
