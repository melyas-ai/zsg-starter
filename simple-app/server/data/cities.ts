export interface CityData {
  name: string;
  slug: string;
  country_slug: string;
  overview: string;
  highlights: string[];
  map_center: { lat: number; lng: number };
  map_zoom: number;
}

export const cities: CityData[] = [
  {
    name: "Beijing",
    slug: "beijing",
    country_slug: "china",
    highlights: [
      "Forbidden City and Tiananmen require half a day minimum — book tickets online in advance",
      "Subway covers all major sights and is the fastest way around — avoid driving",
      "Great Wall: Mutianyu (tourist-friendly) or Jinshanling (fewer crowds, better hiking) — skip Badaling",
      "Peking duck at Siji Minfu or Da Dong requires reservations, especially on weekends",
    ],
    overview: `Beijing is China's political and cultural capital, a city where imperial grandeur and modern ambition coexist across a vast grid of ring roads. At its center lies the Forbidden City — 980 buildings set within moated walls, the largest surviving palace complex on earth — flanked by Tiananmen Square to the south and the ancient drum and bell towers to the north. The hutongs (narrow lane neighborhoods) that radiate from this imperial core offer a street-level experience that still feels intimate despite the mega-city surrounding them.

The city rewards slow exploration. Beyond the obvious monuments, Beijing has a world-class contemporary art scene centered on the 798 Art District (a former East German industrial complex), thriving café culture in areas like Wudaoying Hutong and Sanlitun, and a restaurant landscape that spans every Chinese regional cuisine plus serious international dining. Peking duck is obligatory — the best versions require reservations. Subway coverage is excellent, making most attractions reachable without taxis.`,
    map_center: { lat: 39.9042, lng: 116.4074 },
    map_zoom: 12,
  },
  {
    name: "Shanghai",
    slug: "shanghai",
    country_slug: "china",
    highlights: [
      "The Bund is best at night — walk from Nanjing Road to the old Bund for the full Pudong skyline",
      "French Concession is the walkable heart of the city for cafes, bars, and restaurants",
      "Metro is English-labeled and covers everything — Line 2 connects both airports",
      "Shanghai's food scene peaks late — dinner reservations from 8pm, bars open until 2am+",
    ],
    overview: `Shanghai is China's financial engine and arguably its most cosmopolitan city, shaped by a unique history as a treaty port where concessions granted to Western powers from the 1840s onward created an architecture and cultural mix unlike anywhere else in the country. The Bund — a mile-long riverside promenade lined with Art Deco and neoclassical buildings — faces across the Huangpu River toward Pudong's extraordinary skyline of contemporary towers, making for one of the great urban panoramas anywhere.

The French Concession, a leafy neighborhood of plane-tree-lined streets, colonial villas, and converted lilong lane houses, anchors Shanghai's daily life for many visitors: boutiques, cafés, restaurants, and bars are densely packed into an eminently walkable area. Shanghai's pace is fast but its culture is refined — the city has exceptional contemporary art spaces (Power Station of Art, M+), a thriving live-music scene, and some of the country's most technically accomplished restaurants. The metro system is efficient and English-labeled, making navigation straightforward.`,
    map_center: { lat: 31.2304, lng: 121.4737 },
    map_zoom: 12,
  },
  {
    name: "Guangzhou",
    slug: "guangzhou",
    country_slug: "china",
    highlights: [
      "Dim sum capital of the world — go before 10am for the best selection at traditional teahouses",
      "47 min to Hong Kong by high-speed rail from Guangzhou South station",
      "Shamian Island is a quiet colonial-era enclave perfect for an afternoon walk",
      "Summer is brutally hot and humid (35C+) — spring and autumn are far more comfortable",
    ],
    overview: `Guangzhou (Canton) is the capital of Guangdong province and the historic gateway to southern China — a trading hub whose commercial relationships with the outside world predate those of Shanghai by centuries. The city that exported Cantonese cuisine to the world takes its food seriously: dim sum culture here is practiced with near-religious devotion, and the range of seafood, roast meats, and rice noodle dishes available at every price level is extraordinary. Guangzhou is not a major tourist city in the international sense, but this actually makes it more rewarding — visitors encounter a working southern Chinese metropolis with genuine local character.

Architecturally, the city holds surprises: Shamian Island, a former foreign concession on the Pearl River, retains European colonial architecture in a quiet, almost sleepy enclave; the Liwan (Xiguan) neighborhoods preserve historic Cantonese townhouse culture; and Tianhe in the east presents one of China's most dramatic CBDs. Guangzhou's metro is fast, well-designed, and English-friendly, and proximity to Hong Kong (less than an hour by high-speed rail) makes it a natural addition to any Pearl River Delta itinerary.`,
    map_center: { lat: 23.1291, lng: 113.2644 },
    map_zoom: 12,
  },
  {
    name: "Hong Kong",
    slug: "hong-kong",
    country_slug: "china",
    highlights: [
      "Octopus card works on MTR, buses, ferries, 7-Eleven, and most restaurants — get one immediately",
      "Star Ferry across Victoria Harbour costs HK$2.50 and beats any sightseeing cruise",
      "Separate visa regime from mainland China — most nationalities get 90-180 days visa-free",
      "Hiking trails like Dragon's Back are 30 min from Central by bus — carry water, humidity is intense",
    ],
    overview: `Hong Kong occupies a special position — technically a Special Administrative Region of China but operating under a distinct legal system, currency, and administrative framework that has made it one of Asia's great cities. Built on steep hillsides descending to Victoria Harbour, the urban density is spectacular: Hong Kong Island and Kowloon are among the most densely inhabited places on earth, yet the SAR's territory is mostly country parks and undeveloped islands, creating a dramatic interplay of high-rises and hiking trails that is unique in the world.

The city runs on efficiency and appetite. The MTR metro is famously punctual and covers nearly every major destination. Cantonese dim sum is the breakfast ritual; the night food scene runs from Michelin-starred restaurants to open-air dai pai dong stalls. The Star Ferry across Victoria Harbour is still the most atmospheric five-minute journey in the region. While the political landscape has shifted significantly since 2019, Hong Kong remains a genuinely compelling destination with world-class museums (M+, Hong Kong Palace Museum), extraordinary urban hiking, and a retail and dining culture that continues to attract visitors from across Asia.`,
    map_center: { lat: 22.3193, lng: 114.1694 },
    map_zoom: 13,
  },
  {
    name: "Shenzhen",
    slug: "shenzhen",
    country_slug: "china",
    highlights: [
      "30 min from Hong Kong by MTR — easy day trip, but Huaqiangbei alone is worth a full day",
      "Huaqiangbei electronics market is unlike anything else on earth — floors of components and gadgets",
      "OCT-LOFT creative district has the best independent cafes, galleries, and live music venues",
      "The city is almost 100% cashless — set up WeChat Pay or Alipay before arriving",
    ],
    overview: `Shenzhen is arguably the most remarkable urban story of the twentieth century: a fishing village of 30,000 people in 1979 that became China's first Special Economic Zone and has grown into a metropolis of 17 million with one of the world's most dynamic technology ecosystems. The city is young — its median age is among the lowest of any major Chinese city — and this youthfulness pervades the culture: Shenzhen is where China's startups are born, where industrial design and hardware manufacturing reach the world, and where creative subcultures from street art to craft coffee have taken strong root.

Huaqiangbei, a dense neighborhood of electronics markets, is genuinely unlike anything else on earth — floors upon floors of components, gadgets, and manufacturing services that supply builders and tinkerers globally. OCT-LOFT and the surrounding creative parks offer a contrasting face: galleries, design studios, independent restaurants, and live-music venues in repurposed industrial buildings. Nanshan district, home to Tencent, DJI, and dozens of other tech giants, has developed a Sea World waterfront area that makes for a pleasant afternoon away from the urban core. Shenzhen is an easy day trip from Hong Kong (30 minutes by MTR), but rewards a full stay.`,
    map_center: { lat: 22.5431, lng: 114.0579 },
    map_zoom: 12,
  },
  {
    name: "Zhangjiajie",
    slug: "zhangjiajie",
    country_slug: "china",
    highlights: [
      "Go on weekdays and arrive by 7am — weekend crowds at the Avatar pillars are overwhelming",
      "Tianmen Mountain cable car is 7.5 km long — allow 4-5 hours for the full mountain visit",
      "Light rain and mist actually improve the scenery — don't cancel plans for overcast weather",
      "Maoyan River valley below the peaks is quieter and has the best local Hunan food",
    ],
    overview: `Zhangjiajie is one of China's most visually dramatic destinations, a city in Hunan province best known as the real-world inspiration for the floating mountains in the film Avatar. The Zhangjiajie National Forest Park — China's first national forest park, established in 1982 — contains thousands of sandstone and quartzite pillars rising from a sea of subtropical vegetation, many of them topped with hardy trees clinging to sheer vertical faces. Walking the ridge trails at sunrise or moving through clouds in light rain produces images that seem almost impossible.

The area's other major attraction is Tianmen Mountain, reached by the world's longest cable car (7.5 km) and famous for its 99-bend cliffside road and a natural arch through the peak. The infrastructure around Zhangjiajie has been heavily developed to accommodate Chinese domestic tourism — expect glass walkways, large cable cars, and crowded peak-season conditions at the main sights. Planning arrival on weekdays and moving early in the day makes a significant difference. The Maoyan River valley below the peaks offers a quieter, village-scale counterpoint and some of the region's best local food.`,
    map_center: { lat: 29.1170, lng: 110.4790 },
    map_zoom: 13,
  },
  {
    name: "Chongqing",
    slug: "chongqing",
    country_slug: "china",
    highlights: [
      "Chongqing hotpot is the real deal — order 鸳鸯锅 (half-and-half) if you can't handle full spice",
      "The city is built vertically on cliffs — GPS navigation struggles, follow locals and metro signs",
      "Hongyadong is best seen at night when the stilt-house complex is lit up along the cliff face",
      "Departure point for Yangtze Three Gorges cruises — 3-4 day trips downstream to Yichang",
    ],
    overview: `Chongqing is China's largest direct-controlled municipality and arguably its most vertically dramatic city: built on steep promontories at the confluence of the Yangtze and Jialing rivers, the urban fabric cascades down gorge walls in a way no flat-city map can prepare you for. The famous Hongyadong riverside complex — stilt houses climbing eleven stories up a cliff face — has become an icon, but the entire city operates on multiple levels, with monorail lines passing through apartment buildings and pedestrian routes that switchback down vertiginous stairways.

The city is the home of Chongqing hotpot, China's most unapologetically pungent culinary tradition: a roiling broth of numbing Sichuan pepper and dried chilis in which diners cook tripe, brain, thinly-sliced beef, and vegetables. It is an experience as much as a meal. Chongqing is also the departure point for Yangtze River cruises through the Three Gorges — a journey that passes through one of the most geologically spectacular river corridors on earth before reaching the enormous Three Gorges Dam. The city's metro has expanded rapidly and is well-suited to navigating the non-obvious topography.`,
    map_center: { lat: 29.5630, lng: 106.5516 },
    map_zoom: 12,
  },
  {
    name: "Hangzhou",
    slug: "hangzhou",
    country_slug: "china",
    highlights: [
      "West Lake is walkable in 2-3 hours — rent a bike for the full causeway loop, or take a boat at sunset",
      "Longjing village tea terraces are a 20-min taxi from the lake — buy tea direct from farmers",
      "Possibly the most cashless city on earth (Alibaba HQ) — QR payments work everywhere including temples",
      "1 hour from Shanghai by high-speed rail — easy day trip or 2-night add-on",
    ],
    overview: `Hangzhou is one of China's most celebrated cities, famously described in the Song dynasty proverb "Above there is heaven, below there are Suzhou and Hangzhou." The city's defining feature is West Lake (Xī Hú), a UNESCO World Heritage landscape of causeways, pagodas, islands, and willow-lined shores that has inspired Chinese poets and painters for over a thousand years. The lake is genuinely beautiful — not just historically significant — and the surrounding hills, temples, and tea plantations give Hangzhou a softer, more meditative atmosphere than the hyperkinetic commercial capitals of the coast.

Hangzhou is also the birthplace of Longjing (Dragon Well) green tea, considered China's finest. The terraced tea fields above the village of Longjing are walkable and atmospheric, and the local tradition of hand-roasting leaves continues in family-run operations. The city's food scene draws on Zhejiang cuisine (light, fresh, subtly sweet) — Dongpo pork, beggar's chicken, and West Lake vinegar fish are signatures. As the headquarters of Alibaba, Hangzhou is possibly the most cashless city on earth: QR code payments work everywhere, from Michelin-starred restaurants to temple donation boxes. The metro is clean and well-signed, and the city's public bike-share was one of the world's first.`,
    map_center: { lat: 30.2590, lng: 120.1530 },
    map_zoom: 13,
  },
  {
    name: "Xi'an",
    slug: "xian",
    country_slug: "china",
    highlights: [
      "Terracotta Warriors are 45 min by bus from the city — book a half-day, go early to beat tour groups",
      "The Muslim Quarter (Huimin Jie) has the best street food in China — lamb skewers, roujiamo, biang biang noodles",
      "Cycling the full 14km ancient city wall takes about 90 minutes — rent a bike at any gate",
      "Xi'an is the eastern terminus of the Silk Road and the starting point for many Silk Road-themed trips west",
    ],
    overview: `Xi'an served as the capital of thirteen Chinese dynasties and is one of the most historically significant cities in the world. It was the eastern anchor of the Silk Road, and for over a thousand years one of the most important cities on earth. The Terracotta Warriors — an underground army of 8,000 life-sized figures buried with the first emperor Qin Shi Huang in 210 BCE — remain one of archaeology's most astonishing discoveries.

The city itself rewards exploration beyond the warriors. The intact Ming-dynasty city wall (one of the best-preserved in China) is wide enough to cycle on and encloses a grid of streets centered on the Bell and Drum Towers. The Muslim Quarter, home to the city's Hui community for centuries, is a sensory overload of halal street food — lamb skewers, roujiamo (Chinese hamburger), hand-pulled biang biang noodles, and persimmon cakes. Xi'an's food scene alone justifies a visit. High-speed rail connects to Beijing (4.5 hours), Chengdu (3 hours), and Shanghai (6 hours).`,
    map_center: { lat: 34.2658, lng: 108.9541 },
    map_zoom: 13,
  },
  {
    name: "Chengdu",
    slug: "chengdu",
    country_slug: "china",
    highlights: [
      "Giant Panda Breeding Base: arrive at opening (7:30am) — pandas are active in the morning and hide by noon",
      "Sichuan food is the spiciest in China — say 微辣 (wēi là, 'mild spice') if you're not ready for full heat",
      "Teahouse culture is the social fabric — People's Park teahouse is the best place to watch local life unfold",
      "Gateway to western Sichuan's mountains and Tibetan plateau — Kangding and Jiuzhaigou accessible by bus",
    ],
    overview: `Chengdu is the capital of Sichuan province and one of China's most liveable cities, famous for a laid-back culture that stands in sharp contrast to the hustle of the eastern seaboard. The city is best known internationally as the home of the giant panda, but residents will tell you the real identity is food: Sichuan cuisine, built on the numbing-spicy combination of Sichuan peppercorn and dried chili, is arguably China's most complex and addictive culinary tradition. Hotpot, mapo tofu, dan dan noodles, and kung pao chicken all originate here.

The teahouse tradition runs deep — the bamboo-chair teahouses in People's Park and along the Jin River are where Chengdu's social life happens, with ear-cleaning services, mahjong, and endless refills of jasmine tea. The Jinli and Kuanzhai Xiangzi historic lanes are tourist-oriented but atmospheric, and the surrounding Wuhou district has excellent local restaurants. Chengdu is also the primary gateway to western Sichuan's extraordinary mountain landscapes, Tibetan communities, and Jiuzhaigou National Park.`,
    map_center: { lat: 30.5728, lng: 104.0668 },
    map_zoom: 12,
  },
  {
    name: "Guilin & Yangshuo",
    slug: "guilin",
    country_slug: "china",
    highlights: [
      "Li River cruise from Guilin to Yangshuo (4-5 hours) is one of China's most scenic journeys — book in advance",
      "Yangshuo is the real base — better food, cheaper accommodation, and karst scenery right outside your door",
      "Rent an e-bike in Yangshuo to explore the countryside — Yulong River bamboo rafting is quieter than the Li",
      "Cormorant fishing at dusk is staged for tourists but genuinely atmospheric — worth seeing once",
    ],
    overview: `The Guilin-Yangshuo corridor in Guangxi province contains some of the most iconic landscapes in China: thousands of karst limestone pinnacles rising from flat rice paddies and winding rivers, a scenery so distinctive it appears on the 20 yuan banknote. The Li River cruise from Guilin to Yangshuo passes through the heart of this landscape and is one of the country's great travel experiences.

Guilin is the transport hub (airport, high-speed rail) but Yangshuo, a small town 65km downstream, is where most travelers base themselves. The surrounding countryside is best explored by e-bike or bicycle — the Yulong River valley, Ten-Mile Gallery, and surrounding villages offer karst scenery without the cruise-boat crowds. Rock climbing has developed here into one of Asia's top climbing destinations. The local food centers on Guilin rice noodles (mifen) — a breakfast-to-midnight staple available everywhere.`,
    map_center: { lat: 24.9384, lng: 110.3738 },
    map_zoom: 11,
  },
  {
    name: "Kunming",
    slug: "kunming",
    country_slug: "china",
    highlights: [
      "Called 'Spring City' — temperatures hover around 15-25°C year-round, perfect escape from summer heat",
      "Gateway to Yunnan's diversity: Dali, Lijiang, and Shangri-La are all reachable by train or bus",
      "Crossing-the-bridge noodles (过桥米线) is the signature dish — try it at Jianxin Garden for the classic version",
      "Stone Forest (Shilin) is 90 min by bus — impressive karst formations, go on weekdays to avoid crowds",
    ],
    overview: `Kunming is the capital of Yunnan, China's most ethnically and geographically diverse province. Known as the "Spring City" for its mild year-round climate, Kunming sits at 1,900 meters on a fertile plateau surrounded by mountains, giving it a freshness that makes it a welcome contrast to China's often sweltering or freezing major cities.

The city itself is pleasant rather than spectacular — Green Lake Park, the Bird & Flower Market, and Yuantong Temple are worth a morning each. But Kunming's real value is as a gateway: Yunnan province stretches from tropical borders with Laos and Myanmar in the south to Tibetan highlands in the northwest, and Kunming is the transport hub connecting it all. Dali (3 hours by train), Lijiang (4 hours), and the Stone Forest karst landscape (90 minutes by bus) are the most popular side trips. Yunnan cuisine emphasizes fresh ingredients, wild mushrooms, and rice noodles — crossing-the-bridge noodles (过桥米线) is the unmissable local specialty.`,
    map_center: { lat: 25.0389, lng: 102.7183 },
    map_zoom: 12,
  },
  {
    name: "Lijiang",
    slug: "lijiang",
    country_slug: "china",
    highlights: [
      "Old Town is a UNESCO site but extremely touristy — stay in Shuhe or Baisha for a quieter experience",
      "Jade Dragon Snow Mountain (5,596m) is a day trip — cable car to 4,506m, no climbing experience needed",
      "Tiger Leaping Gorge is one of the world's great hikes — 2 days, book a guesthouse on the high trail",
      "Altitude is 2,400m — take it easy the first day, drink water, skip alcohol for the first night",
    ],
    overview: `Lijiang is an ancient Naxi-culture town in northwest Yunnan, set at 2,400 meters against the backdrop of Jade Dragon Snow Mountain (5,596m). The Old Town, a UNESCO World Heritage site of cobblestone lanes, wooden bridges, and flowing canals, is one of the most photogenic historic towns in China — though it has become heavily commercialized with bars, souvenir shops, and tourist crowds.

The real draw is the surrounding landscape. Tiger Leaping Gorge, a two-day trek through one of the world's deepest river canyons, is among China's best hikes. Jade Dragon Snow Mountain can be reached by cable car to 4,506m for non-climbers. The smaller villages of Shuhe and Baisha, both within cycling distance of Lijiang, preserve more of the traditional Naxi atmosphere. The Dongba culture — with its unique pictographic script — is still practiced by elderly Naxi shamans. High-speed rail from Kunming takes about 3.5 hours.`,
    map_center: { lat: 26.8721, lng: 100.2299 },
    map_zoom: 13,
  },
  {
    name: "Suzhou",
    slug: "suzhou",
    country_slug: "china",
    highlights: [
      "Classical gardens are UNESCO-listed — Humble Administrator's Garden and Lingering Garden are the must-sees",
      "30 min from Shanghai by high-speed rail — perfect day trip or overnight",
      "Pingjiang Road canal walk is the best-preserved historic street — skip the tourist boats, walk instead",
      "Suzhou silk has been prized for 2,000 years — the Silk Museum is free and genuinely interesting",
    ],
    overview: `Suzhou has been celebrated as a garden city for over a thousand years — the classical Chinese gardens here, nine of which are UNESCO World Heritage sites, represent the pinnacle of Chinese landscape design. Unlike the grand imperial gardens of Beijing, Suzhou's gardens are intimate private retreats: scholars' retreats built behind courtyard walls, using rocks, water, plants, and architecture to create miniature landscapes that embody philosophical ideals.

The Humble Administrator's Garden and Lingering Garden are the most famous, but smaller gardens like the Master of the Nets Garden (especially its evening performance) offer a more contemplative experience. Beyond gardens, Suzhou's canal-threaded old town along Pingjiang Road preserves a sense of the water-town culture that once defined the Yangtze delta. The city is also synonymous with silk production and has a distinctive cuisine emphasizing freshwater fish and subtle sweetness. At just 30 minutes from Shanghai by high-speed rail, Suzhou works as a day trip but rewards an overnight stay.`,
    map_center: { lat: 31.2990, lng: 120.5853 },
    map_zoom: 13,
  },
  {
    name: "Dali",
    slug: "dali",
    country_slug: "china",
    highlights: [
      "Erhai Lake is best explored by e-bike — the 120km loop takes a full day with stops for Bai villages",
      "Bai ethnic cuisine is distinct from the rest of Yunnan — try rushan (milk fan cheese) and erkuai rice cakes",
      "Old Town is touristy but Xizhou and Shaxi (2 hours north) are the quieter, more authentic alternatives",
      "Altitude is 2,000m with strong UV — sunscreen and sunglasses essential even on cloudy days",
    ],
    overview: `Dali is a small city in western Yunnan set between Erhai Lake and the Cangshan mountain range (peaks to 4,122m), home to the Bai ethnic minority whose distinctive white architecture, dairy-based cuisine, and tie-dye traditions give the area a cultural flavor quite different from Han Chinese mainstream.

The Old Town, rebuilt after an earthquake, has become a well-established backpacker and digital-nomad hub — cafes, guesthouses, and small bars are plentiful. The real character lies outside the walls: Xizhou, a Bai market town on the lake's north shore, has better-preserved traditional architecture and a legendary morning market. The Erhai Lake circuit by e-bike passes through farming villages, temples, and shoreline wetlands. Dali is quieter and more contemplative than Lijiang, and many travelers who visit both prefer it. Three Pagodas temple complex and the Cangshan mountain cable car are the main structured attractions.`,
    map_center: { lat: 25.6065, lng: 100.2676 },
    map_zoom: 13,
  },
  {
    name: "Istanbul",
    slug: "istanbul",
    country_slug: "turkey",
    highlights: [
      "Spans two continents — 15-min ferry connects European and Asian sides (Kadikoy is worth the trip)",
      "Istanbul Kart works on all transit: metro, tram, ferry, funicular — buy at any kiosk",
      "Meyhane culture peaks after 9pm — arrive early for popular spots in Beyoglu and Balik Pazari",
      "Hagia Sophia and Topkapi require 2-3 hours each — book Topkapi tickets online to skip the line",
    ],
    overview: `Istanbul is the only city in the world that spans two continents, its historic peninsula on the European side separated from the Asian shore by the Bosphorus strait — a 30-kilometer channel that connects the Black Sea to the Sea of Marmara and has been one of the world's most strategically important waterways for millennia. The city has been continuously inhabited for at least 2,700 years and served as the capital of the Roman, Byzantine, and Ottoman empires in succession, accumulating one of the densest concentrations of monumental architecture on earth. Hagia Sophia, Topkapi Palace, the Blue Mosque, the Grand Bazaar, and the Galata Tower occupy a historic peninsula of just a few square kilometers.

Modern Istanbul is a city of 15 million that extends far beyond the tourist triangle, with the neighborhoods north of the Golden Horn — Beyoğlu, Cihangir, Karaköy, Galata — offering a more layered experience of daily urban life: independent bookshops, meyhane taverns, rooftop bars with Bosphorus views, and a café culture that runs from sunrise to well past midnight. The Asian side (Kadıköy, Moda, Üsküdar) is reached by a 15-minute ferry and reveals a slightly slower-paced version of the city popular with locals. Istanbul rewards multiple visits; even regular travelers discover new neighborhoods and layers of history on return trips.`,
    map_center: { lat: 41.0082, lng: 28.9784 },
    map_zoom: 12,
  },
];
