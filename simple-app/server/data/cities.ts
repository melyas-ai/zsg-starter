export interface CityData {
  name: string;
  slug: string;
  country_slug: string;
  overview: string;
  map_center: { lat: number; lng: number };
  map_zoom: number;
}

export const cities: CityData[] = [
  {
    name: "Beijing",
    slug: "beijing",
    country_slug: "china",
    overview: `Beijing is China's political and cultural capital, a city where imperial grandeur and modern ambition coexist across a vast grid of ring roads. At its center lies the Forbidden City — 980 buildings set within moated walls, the largest surviving palace complex on earth — flanked by Tiananmen Square to the south and the ancient drum and bell towers to the north. The hutongs (narrow lane neighborhoods) that radiate from this imperial core offer a street-level experience that still feels intimate despite the mega-city surrounding them.

The city rewards slow exploration. Beyond the obvious monuments, Beijing has a world-class contemporary art scene centered on the 798 Art District (a former East German industrial complex), thriving café culture in areas like Wudaoying Hutong and Sanlitun, and a restaurant landscape that spans every Chinese regional cuisine plus serious international dining. Peking duck is obligatory — the best versions require reservations. Subway coverage is excellent, making most attractions reachable without taxis.`,
    map_center: { lat: 39.9042, lng: 116.4074 },
    map_zoom: 12,
  },
  {
    name: "Shanghai",
    slug: "shanghai",
    country_slug: "china",
    overview: `Shanghai is China's financial engine and arguably its most cosmopolitan city, shaped by a unique history as a treaty port where concessions granted to Western powers from the 1840s onward created an architecture and cultural mix unlike anywhere else in the country. The Bund — a mile-long riverside promenade lined with Art Deco and neoclassical buildings — faces across the Huangpu River toward Pudong's extraordinary skyline of contemporary towers, making for one of the great urban panoramas anywhere.

The French Concession, a leafy neighborhood of plane-tree-lined streets, colonial villas, and converted lilong lane houses, anchors Shanghai's daily life for many visitors: boutiques, cafés, restaurants, and bars are densely packed into an eminently walkable area. Shanghai's pace is fast but its culture is refined — the city has exceptional contemporary art spaces (Power Station of Art, M+), a thriving live-music scene, and some of the country's most technically accomplished restaurants. The metro system is efficient and English-labeled, making navigation straightforward.`,
    map_center: { lat: 31.2304, lng: 121.4737 },
    map_zoom: 12,
  },
  {
    name: "Guangzhou",
    slug: "guangzhou",
    country_slug: "china",
    overview: `Guangzhou (Canton) is the capital of Guangdong province and the historic gateway to southern China — a trading hub whose commercial relationships with the outside world predate those of Shanghai by centuries. The city that exported Cantonese cuisine to the world takes its food seriously: dim sum culture here is practiced with near-religious devotion, and the range of seafood, roast meats, and rice noodle dishes available at every price level is extraordinary. Guangzhou is not a major tourist city in the international sense, but this actually makes it more rewarding — visitors encounter a working southern Chinese metropolis with genuine local character.

Architecturally, the city holds surprises: Shamian Island, a former foreign concession on the Pearl River, retains European colonial architecture in a quiet, almost sleepy enclave; the Liwan (Xiguan) neighborhoods preserve historic Cantonese townhouse culture; and Tianhe in the east presents one of China's most dramatic CBDs. Guangzhou's metro is fast, well-designed, and English-friendly, and proximity to Hong Kong (less than an hour by high-speed rail) makes it a natural addition to any Pearl River Delta itinerary.`,
    map_center: { lat: 23.1291, lng: 113.2644 },
    map_zoom: 12,
  },
  {
    name: "Hong Kong",
    slug: "hong-kong",
    country_slug: "china",
    overview: `Hong Kong occupies a special position — technically a Special Administrative Region of China but operating under a distinct legal system, currency, and administrative framework that has made it one of Asia's great cities. Built on steep hillsides descending to Victoria Harbour, the urban density is spectacular: Hong Kong Island and Kowloon are among the most densely inhabited places on earth, yet the SAR's territory is mostly country parks and undeveloped islands, creating a dramatic interplay of high-rises and hiking trails that is unique in the world.

The city runs on efficiency and appetite. The MTR metro is famously punctual and covers nearly every major destination. Cantonese dim sum is the breakfast ritual; the night food scene runs from Michelin-starred restaurants to open-air dai pai dong stalls. The Star Ferry across Victoria Harbour is still the most atmospheric five-minute journey in the region. While the political landscape has shifted significantly since 2019, Hong Kong remains a genuinely compelling destination with world-class museums (M+, Hong Kong Palace Museum), extraordinary urban hiking, and a retail and dining culture that continues to attract visitors from across Asia.`,
    map_center: { lat: 22.3193, lng: 114.1694 },
    map_zoom: 13,
  },
  {
    name: "Shenzhen",
    slug: "shenzhen",
    country_slug: "china",
    overview: `Shenzhen is arguably the most remarkable urban story of the twentieth century: a fishing village of 30,000 people in 1979 that became China's first Special Economic Zone and has grown into a metropolis of 17 million with one of the world's most dynamic technology ecosystems. The city is young — its median age is among the lowest of any major Chinese city — and this youthfulness pervades the culture: Shenzhen is where China's startups are born, where industrial design and hardware manufacturing reach the world, and where creative subcultures from street art to craft coffee have taken strong root.

Huaqiangbei, a dense neighborhood of electronics markets, is genuinely unlike anything else on earth — floors upon floors of components, gadgets, and manufacturing services that supply builders and tinkerers globally. OCT-LOFT and the surrounding creative parks offer a contrasting face: galleries, design studios, independent restaurants, and live-music venues in repurposed industrial buildings. Nanshan district, home to Tencent, DJI, and dozens of other tech giants, has developed a Sea World waterfront area that makes for a pleasant afternoon away from the urban core. Shenzhen is an easy day trip from Hong Kong (30 minutes by MTR), but rewards a full stay.`,
    map_center: { lat: 22.5431, lng: 114.0579 },
    map_zoom: 12,
  },
  {
    name: "Zhangjiajie",
    slug: "zhangjiajie",
    country_slug: "china",
    overview: `Zhangjiajie is one of China's most visually dramatic destinations, a city in Hunan province best known as the real-world inspiration for the floating mountains in the film Avatar. The Zhangjiajie National Forest Park — China's first national forest park, established in 1982 — contains thousands of sandstone and quartzite pillars rising from a sea of subtropical vegetation, many of them topped with hardy trees clinging to sheer vertical faces. Walking the ridge trails at sunrise or moving through clouds in light rain produces images that seem almost impossible.

The area's other major attraction is Tianmen Mountain, reached by the world's longest cable car (7.5 km) and famous for its 99-bend cliffside road and a natural arch through the peak. The infrastructure around Zhangjiajie has been heavily developed to accommodate Chinese domestic tourism — expect glass walkways, large cable cars, and crowded peak-season conditions at the main sights. Planning arrival on weekdays and moving early in the day makes a significant difference. The Maoyan River valley below the peaks offers a quieter, village-scale counterpoint and some of the region's best local food.`,
    map_center: { lat: 29.1170, lng: 110.4790 },
    map_zoom: 13,
  },
  {
    name: "Chongqing",
    slug: "chongqing",
    country_slug: "china",
    overview: `Chongqing is China's largest direct-controlled municipality and arguably its most vertically dramatic city: built on steep promontories at the confluence of the Yangtze and Jialing rivers, the urban fabric cascades down gorge walls in a way no flat-city map can prepare you for. The famous Hongyadong riverside complex — stilt houses climbing eleven stories up a cliff face — has become an icon, but the entire city operates on multiple levels, with monorail lines passing through apartment buildings and pedestrian routes that switchback down vertiginous stairways.

The city is the home of Chongqing hotpot, China's most unapologetically pungent culinary tradition: a roiling broth of numbing Sichuan pepper and dried chilis in which diners cook tripe, brain, thinly-sliced beef, and vegetables. It is an experience as much as a meal. Chongqing is also the departure point for Yangtze River cruises through the Three Gorges — a journey that passes through one of the most geologically spectacular river corridors on earth before reaching the enormous Three Gorges Dam. The city's metro has expanded rapidly and is well-suited to navigating the non-obvious topography.`,
    map_center: { lat: 29.5630, lng: 106.5516 },
    map_zoom: 12,
  },
  {
    name: "Hangzhou",
    slug: "hangzhou",
    country_slug: "china",
    overview: `Hangzhou is one of China's most celebrated cities, famously described in the Song dynasty proverb "Above there is heaven, below there are Suzhou and Hangzhou." The city's defining feature is West Lake (Xī Hú), a UNESCO World Heritage landscape of causeways, pagodas, islands, and willow-lined shores that has inspired Chinese poets and painters for over a thousand years. The lake is genuinely beautiful — not just historically significant — and the surrounding hills, temples, and tea plantations give Hangzhou a softer, more meditative atmosphere than the hyperkinetic commercial capitals of the coast.

Hangzhou is also the birthplace of Longjing (Dragon Well) green tea, considered China's finest. The terraced tea fields above the village of Longjing are walkable and atmospheric, and the local tradition of hand-roasting leaves continues in family-run operations. The city's food scene draws on Zhejiang cuisine (light, fresh, subtly sweet) — Dongpo pork, beggar's chicken, and West Lake vinegar fish are signatures. As the headquarters of Alibaba, Hangzhou is possibly the most cashless city on earth: QR code payments work everywhere, from Michelin-starred restaurants to temple donation boxes. The metro is clean and well-signed, and the city's public bike-share was one of the world's first.`,
    map_center: { lat: 30.2590, lng: 120.1530 },
    map_zoom: 13,
  },
  {
    name: "Istanbul",
    slug: "istanbul",
    country_slug: "turkey",
    overview: `Istanbul is the only city in the world that spans two continents, its historic peninsula on the European side separated from the Asian shore by the Bosphorus strait — a 30-kilometer channel that connects the Black Sea to the Sea of Marmara and has been one of the world's most strategically important waterways for millennia. The city has been continuously inhabited for at least 2,700 years and served as the capital of the Roman, Byzantine, and Ottoman empires in succession, accumulating one of the densest concentrations of monumental architecture on earth. Hagia Sophia, Topkapi Palace, the Blue Mosque, the Grand Bazaar, and the Galata Tower occupy a historic peninsula of just a few square kilometers.

Modern Istanbul is a city of 15 million that extends far beyond the tourist triangle, with the neighborhoods north of the Golden Horn — Beyoğlu, Cihangir, Karaköy, Galata — offering a more layered experience of daily urban life: independent bookshops, meyhane taverns, rooftop bars with Bosphorus views, and a café culture that runs from sunrise to well past midnight. The Asian side (Kadıköy, Moda, Üsküdar) is reached by a 15-minute ferry and reveals a slightly slower-paced version of the city popular with locals. Istanbul rewards multiple visits; even regular travelers discover new neighborhoods and layers of history on return trips.`,
    map_center: { lat: 41.0082, lng: 28.9784 },
    map_zoom: 12,
  },
];
