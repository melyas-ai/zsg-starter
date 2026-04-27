export interface CountryData {
  name: string;
  slug: string;
  overview: string;
  highlights: string[];
  quick_facts: {
    visa: string;
    currency: string;
    language: string;
    timezone: string;
    best_time: string;
  };
  map_center: { lat: number; lng: number };
  map_zoom: number;
}

export const countries: CountryData[] = [
  {
    name: "China",
    slug: "china",
    highlights: [
      "High-speed rail (高铁) connects major cities in 2-4 hours — more reliable than domestic flights",
      "VPN essential — Google, WhatsApp, Instagram all blocked on the mainland",
      "WeChat Pay / Alipay required — many places no longer accept cash or foreign cards",
      "Best time: April-May or September-October — avoid Golden Week (early Oct) and Chinese New Year",
      "Single timezone (UTC+8) nationwide despite spanning 5 geographic zones",
    ],
    overview: `China is the world's most populous country and the third largest by land area, stretching across East Asia from the Tibetan Plateau in the west to the Pacific coastline in the east. Its geography is extraordinarily diverse — towering mountain ranges, vast desert basins, subtropical river deltas, and over 14,500 km of coastline. The country divides loosely into three broad zones: the mountainous west including Tibet and Xinjiang; the central and northern plains dominated by the Yellow and Yangtze river systems; and the densely populated, economically dynamic eastern seaboard.

Administratively, China comprises 23 provinces, 5 autonomous regions, 4 direct-controlled municipalities (Beijing, Shanghai, Tianjin, Chongqing), and 2 Special Administrative Regions (Hong Kong and Macau). Each region carries its own culinary tradition, dialect, and cultural identity, making "China" less a single destination than a continent-scale mosaic of experiences compressed into one political entity.

For first-time visitors, a common approach is to anchor in one major city and take day or overnight trips to surrounding attractions. High-speed rail (高铁, gāotiě) has transformed domestic travel — journeys that once took 12 hours by overnight train now take 2-4 hours, making multi-city itineraries practical even on shorter trips. Domestic flights are plentiful but subject to delays; trains are generally more reliable and centrally located.

Connectivity requires preparation. Google, WhatsApp, Instagram, and most Western social platforms are blocked on the mainland. Download a reputable VPN before arrival (not after — VPN app stores are also blocked). WeChat and Alipay dominate daily transactions, and many vendors — including small street-food stalls — no longer accept cash. Linking a foreign card to WeChat Pay has become easier since 2023, but setting this up before you need it avoids friction.

The best time to visit most of the country is spring (April–May) and autumn (September–October), when temperatures are moderate and skies are clearer. Summer brings heavy rainfall to southern and central China, and the national holidays (Golden Week in early October and Chinese New Year in January/February) see massive domestic travel surges — book transport and accommodation well in advance or avoid those dates entirely.`,
    quick_facts: {
      visa: "Visa-free for many nationalities up to 15–30 days (verify current policy); others require advance visa",
      currency: "Chinese Yuan (CNY / RMB, ¥)",
      language: "Mandarin Chinese (Putonghua); Cantonese in Guangdong/Hong Kong",
      timezone: "China Standard Time (CST, UTC+8) — single timezone nationwide",
      best_time: "April–May and September–October",
    },
    map_center: { lat: 31.50, lng: 112.00 },
    map_zoom: 4,
  },
  {
    name: "Turkey",
    slug: "turkey",
    highlights: [
      "e-Visa required for most nationalities — apply at evisa.gov.tr before you fly",
      "Lira volatility means prices in tourist areas often quoted in EUR/USD — always confirm currency",
      "Intercity buses are cheap and comfortable; domestic flights surprisingly affordable on Pegasus/AnadoluJet",
      "Tipping ~10% at restaurants appreciated but not mandatory — round up for taxis",
      "Best seasons: April-June and September-November — peak summer is 40C+ in the interior",
    ],
    overview: `Turkey sits at the crossroads of Europe and Asia, a position that has shaped every aspect of its history, architecture, cuisine, and culture. The country spans two continents: a small northwestern strip (Thrace) lies in Europe, while the vast majority — Anatolia — occupies a large peninsula in western Asia. This geographic pivot point made Turkey the heart of successive empires: Hittite, Greek, Roman, Byzantine, and Ottoman, each leaving layers of monuments and cultural influence that are visible in virtually every major city.

The landscape ranges from the snow-capped peaks of eastern Anatolia (home to Mount Ararat at 5,137 m) to the sun-bleached Aegean and Mediterranean coastlines. The interior plateau is largely semi-arid with hot summers and cold winters, while the Black Sea coast receives surprisingly heavy rainfall year-round. Cappadocia, in central Anatolia, offers one of the world's most surreal landscapes: soft volcanic rock eroded into fairy-tale spires and cave dwellings that have been inhabited for millennia.

Istanbul, straddling the Bosphorus strait, is the country's cultural and commercial capital (though Ankara is the political capital). It remains one of the great cities of the world — a place where you can stand in a Roman cistern in the morning, pray in a Byzantine basilica turned Ottoman mosque at noon, and drink rakı by the Bosphorus at night. Beyond Istanbul, the Aegean coast towns of Izmir and Bodrum offer a more relaxed Mediterranean pace, while the southeast around Gaziantep and Mardin reveals an Arab-influenced heritage often overlooked by first-time visitors.

Transport within Turkey is well developed. Intercity buses (otobüs) are cheap, comfortable, and cover almost every destination. Domestic flights have expanded dramatically and are often surprisingly affordable. Istanbul has a growing metro network plus trams, ferries, and funiculars that make central navigation manageable once you get your bearings. The Istanbul Kart (rechargeable transit card) works across all public transport modes.

Turkish cuisine deserves its global reputation. Beyond the döner and kebab familiar abroad, local food varies enormously by region — rich southeastern stews, Aegean olive-oil dishes, Black Sea corn-based preparations, and Istanbul's world-class seafood meyhanes. Tea (çay) is the social lubricant of the country; coffee culture is strong in cities. Tipping at restaurants (around 10%) is appreciated but not mandatory.`,
    quick_facts: {
      visa: "e-Visa required for most nationalities — apply online before travel at evisa.gov.tr",
      currency: "Turkish Lira (TRY, ₺)",
      language: "Turkish",
      timezone: "Turkey Time (TRT, UTC+3) — no daylight saving since 2016",
      best_time: "April–June and September–November",
    },
    map_center: { lat: 39.92, lng: 32.85 },
    map_zoom: 6,
  },
];
