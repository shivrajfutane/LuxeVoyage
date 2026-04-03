import React, { useMemo } from 'react';
import { CloudRain, Sun, Users, DollarSign, Calendar, Thermometer, Info, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

// ====== CURATED SEASONALITY DATA MAPS ======

const SEASON_DATA = {
  'India': {
    best: ['Nov', 'Dec', 'Jan', 'Feb'],
    months: [
      { month: 'Jan', temp: '22° / 8°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Feb', temp: '26° / 11°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Mar', temp: '32° / 17°', rain: 'Low', crowd: 'Mod', price: 'Mod' },
      { month: 'Apr', temp: '37° / 22°', rain: 'Low', crowd: 'Low', price: 'Low' },
      { month: 'May', temp: '41° / 26°', rain: 'Low', crowd: 'Low', price: 'Low' },
      { month: 'Jun', temp: '38° / 28°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Jul', temp: '34° / 26°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Aug', temp: '33° / 26°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Sep', temp: '33° / 25°', rain: 'High', crowd: 'Mod', price: 'Low' },
      { month: 'Oct', temp: '32° / 19°', rain: 'Low', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '28° / 13°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Dec', temp: '24° / 9°', rain: 'Low', crowd: 'High', price: 'High' },
    ],
    verdict: "November to February is the golden period. Perfect weather for palaces, forts, and beaches.",
    tips: {
      Spring: "Holi Festival (March) is vibrant but getting hot.",
      Summer: "Avoid the plains; head to the Himalayas (Shimla, Manali).",
      Monsoon: "Kerala and Goa turn lush green, great for budget travelers.",
      Winter: "Peak season. Festivals everywhere. Book 3 months ahead."
    }
  },
  'Japan': {
    best: ['Mar', 'Apr', 'Oct', 'Nov'],
    months: [
      { month: 'Jan', temp: '10° / 2°', rain: 'Low', crowd: 'Mod', price: 'Mod' },
      { month: 'Feb', temp: '10° / 2°', rain: 'Low', crowd: 'Mod', price: 'Mod' },
      { month: 'Mar', temp: '14° / 5°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Apr', temp: '19° / 10°', rain: 'Mod', crowd: 'V.High', price: 'V.High' },
      { month: 'May', temp: '23° / 15°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Jun', temp: '26° / 19°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Jul', temp: '30° / 23°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Aug', temp: '31° / 24°', rain: 'High', crowd: 'High', price: 'High' },
      { month: 'Sep', temp: '27° / 20°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Oct', temp: '22° / 14°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Nov', temp: '17° / 8°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Dec', temp: '12° / 4°', rain: 'Low', crowd: 'Mod', price: 'Mod' },
    ],
    verdict: "Cherry Blossoms (April) and Autumn Foliage (November) are spectacular but very crowded.",
    tips: {
      Spring: "Cherry Blossom season! Golden Week (early May) is extremely busy.",
      Summer: "Hot, humid, and rainy. Great for mountain hiking and festivals.",
      Autumn: "Best weather. Clear skies and stunning maples in Kyoto.",
      Winter: "Ski season in Hokkaido. Tokyo is cold but beautifully illuminated."
    }
  },
  'France': {
    best: ['May', 'Jun', 'Sep', 'Oct'],
    months: [
      { month: 'Jan', temp: '7° / 2°', rain: 'Mod', crowd: 'Low', price: 'Low' },
      { month: 'Feb', temp: '8° / 3°', rain: 'Low', crowd: 'Low', price: 'Low' },
      { month: 'Mar', temp: '12° / 5°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Apr', temp: '16° / 7°', rain: 'Mod', crowd: 'High', price: 'Mod' },
      { month: 'May', temp: '20° / 11°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Jun', temp: '23° / 14°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Jul', temp: '25° / 16°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Aug', temp: '25° / 15°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Sep', temp: '21° / 12°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Oct', temp: '16° / 9°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '11° / 5°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Dec', temp: '8° / 3°', rain: 'Mod', crowd: 'High', price: 'High' },
    ],
    verdict: "Late Spring and early Autumn offer the best balance of weather and crowd levels.",
    tips: {
      Spring: "Paris in bloom. Perfect for sidewalk cafes. Bring a light coat.",
      Summer: "Peak tourist season. Bastille Day (July 14). Locals leave in August.",
      Autumn: "Wine harvest season. Golden light makes for great photos.",
      Winter: "Cold and gray, but Christmas markets in Alsace are legendary."
    }
  },
  'Thailand': {
    best: ['Nov', 'Dec', 'Jan', 'Feb'],
    months: [
      { month: 'Jan', temp: '32° / 23°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Feb', temp: '33° / 24°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Mar', temp: '34° / 26°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Apr', temp: '35° / 27°', rain: 'Mod', crowd: 'V.High', price: 'High' },
      { month: 'May', temp: '34° / 26°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Jun', temp: '33° / 26°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Jul', temp: '33° / 26°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Aug', temp: '33° / 26°', rain: 'V.High', crowd: 'Low', price: 'Low' },
      { month: 'Sep', temp: '32° / 25°', rain: 'V.High', crowd: 'Low', price: 'Low' },
      { month: 'Oct', temp: '32° / 25°', rain: 'High', crowd: 'Mod', price: 'Low' },
      { month: 'Nov', temp: '32° / 24°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Dec', temp: '31° / 23°', rain: 'Low', crowd: 'High', price: 'High' },
    ],
    verdict: "The dry season is the best. Avoid September/October for island trips due to monsoons.",
    tips: {
      Spring: "Songkran (Water Festival) in April is a massive, wet street party.",
      Summer: "Rainy season, but showers are usually quick. Great prices.",
      Autumn: "Monsoon peaks. Some islands and national parks may close.",
      Winter: "Ideal conditions. Clear blue waters. Perfect for Krabi & Phuket."
    }
  },
  'USA': {
    best: ['May', 'Jun', 'Sep', 'Oct'],
    months: [
      { month: 'Jan', temp: '4° / -3°', rain: 'Mod', crowd: 'Low', price: 'Low' },
      { month: 'Feb', temp: '5° / -2°', rain: 'Mod', crowd: 'Low', price: 'Low' },
      { month: 'Mar', temp: '10° / 2°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Apr', temp: '16° / 7°', rain: 'Mod', crowd: 'High', price: 'Mod' },
      { month: 'May', temp: '22° / 12°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Jun', temp: '27° / 18°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Jul', temp: '29° / 20°', rain: 'Mod', crowd: 'V.High', price: 'V.High' },
      { month: 'Aug', temp: '29° / 20°', rain: 'High', crowd: 'High', price: 'V.High' },
      { month: 'Sep', temp: '24° / 15°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Oct', temp: '18° / 9°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '12° / 4°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Dec', temp: '6° / -1°', rain: 'Mod', crowd: 'High', price: 'High' },
    ],
    verdict: "Spring and Autumn offer the best weather across the country without summer heat.",
    tips: {
      Spring: "Cherry blossoms in DC. Pleasant weather in the South and California.",
      Summer: "National Parks at their best. Very crowded. Hurricane season starts.",
      Autumn: "Fall foliage in New England. Cool, crisp air. Harvest festivals.",
      Winter: "Ski season in Rockies. NYC is magical at Xmas. Cold elsewhere."
    }
  },
  'Italy': {
    best: ['Apr', 'May', 'Sep', 'Oct'],
    months: [
      { month: 'Jan', temp: '12° / 3°', rain: 'Mod', crowd: 'Low', price: 'Low' },
      { month: 'Feb', temp: '13° / 4°', rain: 'Mod', crowd: 'Low', price: 'Low' },
      { month: 'Mar', temp: '16° / 7°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Apr', temp: '19° / 10°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'May', temp: '24° / 14°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Jun', temp: '28° / 18°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Jul', temp: '31° / 21°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Aug', temp: '31° / 21°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Sep', temp: '27° / 18°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Oct', temp: '22° / 13°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '16° / 8°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Dec', temp: '13° / 4°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
    ],
    verdict: "Spring and early Autumn are ideal — perfect weather and manageable crowds before or after the summer rush.",
    tips: {
      Spring: "Easter in Rome is spectacular but very busy.",
      Summer: "Beaches are packed. Head to the Dolomites for cooler air.",
      Autumn: "Harvest festivals, truffle season, and golden vineyards.",
      Winter: "Christmas markets in Rome and Florence. Low prices, easy museum access."
    }
  },
  'Spain': {
    best: ['Apr', 'May', 'Sep', 'Oct'],
    months: [
      { month: 'Jan', temp: '12° / 4°', rain: 'Mod', crowd: 'Low', price: 'Low' },
      { month: 'Feb', temp: '14° / 5°', rain: 'Mod', crowd: 'Low', price: 'Low' },
      { month: 'Mar', temp: '17° / 8°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Apr', temp: '20° / 11°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'May', temp: '24° / 14°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Jun', temp: '28° / 18°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Jul', temp: '33° / 22°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Aug', temp: '33° / 22°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Sep', temp: '28° / 18°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Oct', temp: '22° / 14°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '16° / 9°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Dec', temp: '12° / 6°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
    ],
    verdict: "Spring and Autumn are the sweet spots — warm, festive, and far less crowded than peak summer.",
    tips: {
      Spring: "Semana Santa (Easter) and Feria de Abril in Seville are unmissable.",
      Summer: "Scorching heat inland. Beach resorts overflow with tourists.",
      Autumn: "La Tomatina (Aug) and wine harvest festivals. Perfect city weather.",
      Winter: "Mild in the South. Ski season in the Pyrenees. Christmas lights in Madrid."
    }
  },
  'UK': {
    best: ['May', 'Jun', 'Sep'],
    months: [
      { month: 'Jan', temp: '8° / 2°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Feb', temp: '8° / 2°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Mar', temp: '11° / 4°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Apr', temp: '13° / 6°', rain: 'Mod', crowd: 'High', price: 'Mod' },
      { month: 'May', temp: '17° / 9°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Jun', temp: '20° / 12°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Jul', temp: '22° / 14°', rain: 'Mod', crowd: 'V.High', price: 'V.High' },
      { month: 'Aug', temp: '22° / 14°', rain: 'Mod', crowd: 'V.High', price: 'V.High' },
      { month: 'Sep', temp: '18° / 11°', rain: 'Mod', crowd: 'Mod', price: 'High' },
      { month: 'Oct', temp: '14° / 8°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '10° / 5°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Dec', temp: '8° / 3°', rain: 'High', crowd: 'High', price: 'High' },
    ],
    verdict: "Late Spring (May-June) offers the best balance of daylight, warmth and bearable crowds.",
    tips: {
      Spring: "Chelsea Flower Show (May). Long daylight hours begin.",
      Summer: "Wimbledon, Glastonbury, and warm pub gardens. Very busy.",
      Autumn: "Dramatic Scottish Highlands. Great for museums and theatre in London.",
      Winter: "Christmas markets in Bath and Edinburgh. Very cold but festive."
    }
  },
  'Bali': {
    best: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    months: [
      { month: 'Jan', temp: '30° / 23°', rain: 'V.High', crowd: 'Mod', price: 'Mod' },
      { month: 'Feb', temp: '30° / 23°', rain: 'V.High', crowd: 'Low', price: 'Low' },
      { month: 'Mar', temp: '30° / 23°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Apr', temp: '31° / 23°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'May', temp: '31° / 22°', rain: 'Low', crowd: 'Mod', price: 'Mod' },
      { month: 'Jun', temp: '30° / 21°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Jul', temp: '29° / 21°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Aug', temp: '29° / 21°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Sep', temp: '30° / 21°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Oct', temp: '31° / 22°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '31° / 23°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Dec', temp: '30° / 23°', rain: 'V.High', crowd: 'High', price: 'High' },
    ],
    verdict: "Dry season (May–September) is best. July–August peak brings crowds and premium prices.",
    tips: {
      Spring: "Nyepi (Silent Day) in March — the island literally shuts down. Unique experience.",
      Summer: "Peak season. Book villas 3 months ahead. Surf is best on west coast.",
      Autumn: "Shoulder season is sweet — dry, fewer crowds, great value.",
      Winter: "Wet season brings lush green terraces and great surf on the east coast."
    }
  },
  'Singapore': {
    best: ['Feb', 'Mar', 'Jul', 'Aug'],
    months: [
      { month: 'Jan', temp: '30° / 24°', rain: 'High', crowd: 'Mod', price: 'High' },
      { month: 'Feb', temp: '31° / 24°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Mar', temp: '31° / 25°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Apr', temp: '32° / 25°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'May', temp: '32° / 25°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Jun', temp: '31° / 25°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Jul', temp: '31° / 25°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Aug', temp: '31° / 25°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Sep', temp: '31° / 24°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Oct', temp: '31° / 24°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '30° / 24°', rain: 'V.High', crowd: 'High', price: 'High' },
      { month: 'Dec', temp: '30° / 24°', rain: 'High', crowd: 'High', price: 'High' },
    ],
    verdict: "Singapore is a year-round destination. February and July offer the driest conditions.",
    tips: {
      Spring: "Chinese New Year (Jan/Feb) is spectacular — light-ups and street markets.",
      Summer: "Great F1 Night Race (Sep). Hot but mostly dry Jul–Aug.",
      Autumn: "Deepavali light-up in Little India (Oct/Nov) is stunning.",
      Winter: "Christmas on Orchard Road is magical. Short rain bouts in Dec."
    }
  },
  'Dubai': {
    best: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    months: [
      { month: 'Jan', temp: '23° / 14°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Feb', temp: '25° / 15°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Mar', temp: '28° / 18°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Apr', temp: '34° / 23°', rain: 'Low', crowd: 'Mod', price: 'Mod' },
      { month: 'May', temp: '39° / 27°', rain: 'Low', crowd: 'Low', price: 'Low' },
      { month: 'Jun', temp: '42° / 30°', rain: 'Low', crowd: 'Low', price: 'Low' },
      { month: 'Jul', temp: '43° / 31°', rain: 'Low', crowd: 'Low', price: 'Low' },
      { month: 'Aug', temp: '43° / 31°', rain: 'Low', crowd: 'Low', price: 'Low' },
      { month: 'Sep', temp: '40° / 28°', rain: 'Low', crowd: 'Low', price: 'Low' },
      { month: 'Oct', temp: '35° / 23°', rain: 'Low', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '29° / 18°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Dec', temp: '24° / 14°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
    ],
    verdict: "November to March is the golden window — perfect outdoor weather. Summer is brutally hot.",
    tips: {
      Spring: "Dubai Shopping Festival (Mar). Still comfortable in the mornings.",
      Summer: "Extreme heat (43°C+). Indoor malls and water parks only. Huge discounts.",
      Autumn: "Temperatures finally drop. Desert safaris are great in October.",
      Winter: "Peak season. Outdoor dining, beach clubs, and the Dubai World Cup."
    }
  },
  'Australia': {
    best: ['Sep', 'Oct', 'Nov', 'Mar', 'Apr'],
    months: [
      { month: 'Jan', temp: '26° / 18°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Feb', temp: '26° / 19°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Mar', temp: '24° / 17°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Apr', temp: '22° / 14°', rain: 'Mod', crowd: 'High', price: 'Mod' },
      { month: 'May', temp: '18° / 11°', rain: 'Mod', crowd: 'Mod', price: 'Low' },
      { month: 'Jun', temp: '16° / 9°', rain: 'High', crowd: 'Mod', price: 'Low' },
      { month: 'Jul', temp: '15° / 8°', rain: 'Mod', crowd: 'Mod', price: 'Low' },
      { month: 'Aug', temp: '16° / 9°', rain: 'Mod', crowd: 'Mod', price: 'Low' },
      { month: 'Sep', temp: '19° / 11°', rain: 'Mod', crowd: 'High', price: 'Mod' },
      { month: 'Oct', temp: '22° / 14°', rain: 'Mod', crowd: 'High', price: 'Mod' },
      { month: 'Nov', temp: '24° / 16°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Dec', temp: '26° / 18°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
    ],
    verdict: "Spring (Sep–Nov) is spectacular — wildflowers, warm weather, and pre-peak prices.",
    tips: {
      Spring: "Wildflowers in Western Australia. Great Barrier Reef visibility is excellent.",
      Summer: "Jan is peak beach season. Bush fire risk inland. Very expensive.",
      Autumn: "Cooler and quieter. Ideal for the Outback and Red Centre (Uluru).",
      Winter: "Whale watching on both coasts. Skiing in the Alpine region."
    }
  },
  'Greece': {
    best: ['May', 'Jun', 'Sep', 'Oct'],
    months: [
      { month: 'Jan', temp: '13° / 6°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Feb', temp: '14° / 7°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Mar', temp: '16° / 8°', rain: 'Mod', crowd: 'Low', price: 'Low' },
      { month: 'Apr', temp: '20° / 12°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'May', temp: '25° / 16°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Jun', temp: '30° / 21°', rain: 'Low', crowd: 'V.High', price: 'High' },
      { month: 'Jul', temp: '34° / 24°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Aug', temp: '33° / 24°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Sep', temp: '28° / 20°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Oct', temp: '22° / 15°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '17° / 11°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Dec', temp: '14° / 8°', rain: 'High', crowd: 'Low', price: 'Low' },
    ],
    verdict: "May and September are magic — warm seas, clear skies, fewer crowds, and better prices.",
    tips: {
      Spring: "Easter (Orthodox) is a big celebration. Spring wildflowers and mild hiking.",
      Summer: "Santorini and Mykonos overflow. Book 6 months ahead.",
      Autumn: "Sea is warm, crowds thin out. Perfect island-hopping weather.",
      Winter: "Very quiet. Great for Athens museums and archaeology without the crowds."
    }
  },
  'Turkey': {
    best: ['Apr', 'May', 'Sep', 'Oct'],
    months: [
      { month: 'Jan', temp: '8° / 3°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Feb', temp: '9° / 3°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Mar', temp: '12° / 5°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Apr', temp: '17° / 9°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'May', temp: '22° / 13°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Jun', temp: '27° / 18°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Jul', temp: '29° / 21°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Aug', temp: '29° / 22°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Sep', temp: '25° / 18°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Oct', temp: '20° / 14°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '14° / 9°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Dec', temp: '10° / 5°', rain: 'High', crowd: 'Low', price: 'Low' },
    ],
    verdict: "Spring and Autumn are perfect for Istanbul and Cappadocia. Coast beaches peak in summer.",
    tips: {
      Spring: "Tulip Festival in Istanbul (April). Cappadocia balloon rides have best visibility.",
      Summer: "Aegean and Mediterranean coast are at their finest. Very hot inland.",
      Autumn: "Harvest season in Cappadocia. Cooler and romantic balloon flights.",
      Winter: "Grand Bazaar and Hagia Sophia nearly crowd-free. Cold but atmospheric."
    }
  },
  'Mexico': {
    best: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    months: [
      { month: 'Jan', temp: '25° / 14°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Feb', temp: '27° / 16°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Mar', temp: '30° / 19°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Apr', temp: '32° / 22°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'May', temp: '33° / 24°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Jun', temp: '32° / 24°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Jul', temp: '31° / 24°', rain: 'High', crowd: 'High', price: 'High' },
      { month: 'Aug', temp: '31° / 23°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Sep', temp: '30° / 23°', rain: 'V.High', crowd: 'Low', price: 'Low' },
      { month: 'Oct', temp: '29° / 22°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Nov', temp: '28° / 19°', rain: 'Low', crowd: 'Mod', price: 'Mod' },
      { month: 'Dec', temp: '26° / 16°', rain: 'Low', crowd: 'High', price: 'High' },
    ],
    verdict: "Winter and spring offer the best beach weather. Avoid September for hurricane season.",
    tips: {
      Spring: "Spring Break (March) floods Cancún. Día de los Muertos (Nov 1-2) is extraordinary.",
      Summer: "Hurricane season affects Yucatán. Mexico City is pleasant and less touristy.",
      Autumn: "Best time for Mexico City and Oaxaca. November food and culture festivals.",
      Winter: "Peak season on the coast. Whale watching in Baja California is world-class."
    }
  },
  'Maldives': {
    best: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'],
    months: [
      { month: 'Jan', temp: '30° / 25°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Feb', temp: '31° / 25°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Mar', temp: '31° / 26°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Apr', temp: '31° / 26°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'May', temp: '30° / 26°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Jun', temp: '30° / 26°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Jul', temp: '29° / 26°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Aug', temp: '29° / 25°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Sep', temp: '29° / 25°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Oct', temp: '29° / 25°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '29° / 25°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Dec', temp: '30° / 25°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
    ],
    verdict: "The dry season (Nov–Apr) delivers crystal-clear visibility for snorkelling and diving.",
    tips: {
      Spring: "April is the transition month — lower prices, still mostly sunny.",
      Summer: "Wet season brings swells ideal for surfing. Bioluminescent nights are magical.",
      Autumn: "Manta ray season (May–Oct). Great for experienced divers. Best prices.",
      Winter: "Peak luxury overwater villa season. Whale sharks gather Nov–Dec near South Atolls."
    }
  },
  'Vietnam': {
    best: ['Jan', 'Feb', 'Mar', 'Nov', 'Dec'],
    months: [
      { month: 'Jan', temp: '22° / 16°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Feb', temp: '23° / 17°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Mar', temp: '26° / 19°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Apr', temp: '29° / 22°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'May', temp: '34° / 25°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Jun', temp: '34° / 25°', rain: 'High', crowd: 'Mod', price: 'Low' },
      { month: 'Jul', temp: '34° / 24°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Aug', temp: '33° / 24°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Sep', temp: '31° / 23°', rain: 'V.High', crowd: 'Low', price: 'Low' },
      { month: 'Oct', temp: '28° / 21°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Nov', temp: '25° / 18°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Dec', temp: '22° / 15°', rain: 'Low', crowd: 'High', price: 'High' },
    ],
    verdict: "Northern Vietnam is best Nov–Apr. South shines Dec–Apr. A country for every season.",
    tips: {
      Spring: "Tết (Lunar New Year, Jan/Feb) is vibrant but some shops close. Book early.",
      Summer: "Monsoon season. Hội An gets flooded in Oct. Ho Chi Minh City stays dryer.",
      Autumn: "Flooding risk in central Vietnam. Great for Cu Chi Tunnels in the south.",
      Winter: "Peak season. Sapa treks are cold but stunning with snow-capped peaks."
    }
  },
  'Nepal': {
    best: ['Oct', 'Nov', 'Mar', 'Apr'],
    months: [
      { month: 'Jan', temp: '10° / -1°', rain: 'Low', crowd: 'Low', price: 'Low' },
      { month: 'Feb', temp: '13° / 2°', rain: 'Low', crowd: 'Mod', price: 'Low' },
      { month: 'Mar', temp: '18° / 7°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Apr', temp: '23° / 11°', rain: 'Mod', crowd: 'V.High', price: 'High' },
      { month: 'May', temp: '27° / 15°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Jun', temp: '28° / 18°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Jul', temp: '28° / 19°', rain: 'V.High', crowd: 'Low', price: 'Low' },
      { month: 'Aug', temp: '28° / 19°', rain: 'V.High', crowd: 'Low', price: 'Low' },
      { month: 'Sep', temp: '26° / 17°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Oct', temp: '22° / 11°', rain: 'Low', crowd: 'V.High', price: 'High' },
      { month: 'Nov', temp: '17° / 5°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Dec', temp: '12° / 0°', rain: 'Low', crowd: 'Low', price: 'Low' },
    ],
    verdict: "October is the trekking crown jewel — crystal clear Himalaya views and perfect trail conditions.",
    tips: {
      Spring: "Rhododendrons bloom on Everest and Annapurna trails. Second best trekking season.",
      Summer: "Monsoon makes trails muddy and leechy. Not recommended for trekking.",
      Autumn: "Peak trekking season. Pre-book permits and lodges months in advance.",
      Winter: "Cold but quiet. Lower Everest Base Camp trail is feasible with proper gear."
    }
  },
  'Morocco': {
    best: ['Mar', 'Apr', 'Oct', 'Nov'],
    months: [
      { month: 'Jan', temp: '17° / 6°', rain: 'Mod', crowd: 'Low', price: 'Low' },
      { month: 'Feb', temp: '19° / 8°', rain: 'Mod', crowd: 'Low', price: 'Low' },
      { month: 'Mar', temp: '22° / 10°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Apr', temp: '25° / 13°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'May', temp: '29° / 17°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Jun', temp: '33° / 21°', rain: 'Low', crowd: 'Mod', price: 'Mod' },
      { month: 'Jul', temp: '37° / 24°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Aug', temp: '37° / 24°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Sep', temp: '33° / 21°', rain: 'Low', crowd: 'Mod', price: 'Mod' },
      { month: 'Oct', temp: '26° / 15°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Nov', temp: '21° / 10°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Dec', temp: '18° / 7°', rain: 'Mod', crowd: 'Low', price: 'Low' },
    ],
    verdict: "Spring and Autumn are ideal for the souks, sahara, and Atlas Mountains. Summer is scorching.",
    tips: {
      Spring: "Rose Festival in Kalaat M'Gouna (May). Wildflowers in the Atlas.",
      Summer: "Head to the coast (Essaouira, Agadir). Marrakech is stiflingly hot.",
      Autumn: "Sahara desert nights are magical in Oct. Harvest dates in the oases.",
      Winter: "Snow in the High Atlas. Marrakech medina is peaceful and atmospheric."
    }
  },
  'South Korea': {
    best: ['Apr', 'May', 'Sep', 'Oct'],
    months: [
      { month: 'Jan', temp: '2° / -5°', rain: 'Low', crowd: 'Low', price: 'Low' },
      { month: 'Feb', temp: '5° / -3°', rain: 'Low', crowd: 'Mod', price: 'Low' },
      { month: 'Mar', temp: '11° / 2°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Apr', temp: '18° / 8°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'May', temp: '23° / 13°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Jun', temp: '27° / 18°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Jul', temp: '29° / 22°', rain: 'V.High', crowd: 'Low', price: 'Mod' },
      { month: 'Aug', temp: '30° / 23°', rain: 'High', crowd: 'Mod', price: 'Mod' },
      { month: 'Sep', temp: '25° / 17°', rain: 'Mod', crowd: 'High', price: 'High' },
      { month: 'Oct', temp: '18° / 10°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Nov', temp: '11° / 3°', rain: 'Low', crowd: 'Mod', price: 'Mod' },
      { month: 'Dec', temp: '4° / -2°', rain: 'Low', crowd: 'Low', price: 'Low' },
    ],
    verdict: "Cherry blossoms in April and autumn foliage in October are Korea's most celebrated seasons.",
    tips: {
      Spring: "Cherry blossoms in Gyeongju and Jinhae. Bukchon Hanok Village at its best.",
      Summer: "Monsoon rains (Jangma) bring humidity. Beach season on Jeju Island.",
      Autumn: "Foliage turns golden in Seoraksan NP. Chuseok harvest festival.",
      Winter: "Ski resorts at Alpensia and Pyeongchang. Seoul at Christmas is vibrant."
    }
  },
  'Portugal': {
    best: ['May', 'Jun', 'Sep', 'Oct'],
    months: [
      { month: 'Jan', temp: '15° / 8°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Feb', temp: '16° / 9°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Mar', temp: '18° / 10°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Apr', temp: '20° / 12°', rain: 'Mod', crowd: 'High', price: 'Mod' },
      { month: 'May', temp: '23° / 14°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Jun', temp: '27° / 17°', rain: 'Low', crowd: 'V.High', price: 'High' },
      { month: 'Jul', temp: '30° / 19°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Aug', temp: '30° / 20°', rain: 'Low', crowd: 'V.High', price: 'V.High' },
      { month: 'Sep', temp: '27° / 18°', rain: 'Low', crowd: 'High', price: 'High' },
      { month: 'Oct', temp: '22° / 14°', rain: 'Mod', crowd: 'Mod', price: 'Mod' },
      { month: 'Nov', temp: '17° / 11°', rain: 'High', crowd: 'Low', price: 'Low' },
      { month: 'Dec', temp: '14° / 9°', rain: 'High', crowd: 'Low', price: 'Low' },
    ],
    verdict: "Europe's sunniest country shines from May to October. Budget-friendly off-season in winter.",
    tips: {
      Spring: "Pink jacaranda trees bloom in Lisbon (May). Santos Populares festival in June.",
      Summer: "Algarve beaches are peak gorgeous. Atlantic surf on west coast year-round.",
      Autumn: "Wine harvest in the Douro Valley. Porto is magical with fewer tourists.",
      Winter: "Mild and rainy in Lisbon. Great for Fado shows and pastéis de nata by a fire."
    }
  },
};

const COUNTRY_MAP = {
  // India
  'india': 'India', 'delhi': 'India', 'mumbai': 'India', 'goa': 'India', 'jaipur': 'India',
  'bangalore': 'India', 'kerala': 'India', 'manali': 'India', 'shimla': 'India',
  'varanasi': 'India', 'udaipur': 'India', 'agra': 'India', 'kolkata': 'India',
  'chennai': 'India', 'hyderabad': 'India', 'cochin': 'India', 'kochi': 'India',
  // Japan
  'japan': 'Japan', 'tokyo': 'Japan', 'osaka': 'Japan', 'kyoto': 'Japan',
  'hiroshima': 'Japan', 'hokkaido': 'Japan', 'nara': 'Japan', 'sapporo': 'Japan',
  // France
  'france': 'France', 'paris': 'France', 'nice': 'France', 'lyon': 'France',
  'marseille': 'France', 'bordeaux': 'France', 'strasbourg': 'France',
  // Thailand
  'thailand': 'Thailand', 'bangkok': 'Thailand', 'phuket': 'Thailand',
  'krabi': 'Thailand', 'chiang mai': 'Thailand', 'koh samui': 'Thailand',
  // USA
  'usa': 'USA', 'new york': 'USA', 'los angeles': 'USA', 'san francisco': 'USA',
  'miami': 'USA', 'las vegas': 'USA', 'chicago': 'USA', 'hawaii': 'USA',
  'boston': 'USA', 'washington': 'USA', 'seattle': 'USA', 'new orleans': 'USA',
  // Italy
  'italy': 'Italy', 'rome': 'Italy', 'venice': 'Italy', 'milan': 'Italy',
  'florence': 'Italy', 'naples': 'Italy', 'amalfi': 'Italy', 'sicily': 'Italy',
  'cinque terre': 'Italy', 'tuscany': 'Italy',
  // Spain
  'spain': 'Spain', 'barcelona': 'Spain', 'madrid': 'Spain', 'seville': 'Spain',
  'granada': 'Spain', 'valencia': 'Spain', 'ibiza': 'Spain', 'mallorca': 'Spain',
  // UK
  'uk': 'UK', 'london': 'UK', 'edinburgh': 'UK', 'england': 'UK',
  'scotland': 'UK', 'wales': 'UK', 'manchester': 'UK', 'oxford': 'UK',
  'bath': 'UK', 'cambridge': 'UK', 'liverpool': 'UK',
  // Bali / Indonesia
  'bali': 'Bali', 'ubud': 'Bali', 'seminyak': 'Bali', 'canggu': 'Bali',
  'indonesia': 'Bali', 'lombok': 'Bali',
  // Singapore
  'singapore': 'Singapore',
  // Dubai / UAE
  'dubai': 'Dubai', 'abu dhabi': 'Dubai', 'uae': 'Dubai', 'sharjah': 'Dubai',
  // Australia
  'australia': 'Australia', 'sydney': 'Australia', 'melbourne': 'Australia',
  'brisbane': 'Australia', 'perth': 'Australia', 'cairns': 'Australia',
  'gold coast': 'Australia', 'uluru': 'Australia', 'great barrier reef': 'Australia',
  // Greece
  'greece': 'Greece', 'athens': 'Greece', 'santorini': 'Greece', 'mykonos': 'Greece',
  'crete': 'Greece', 'rhodes': 'Greece', 'corfu': 'Greece', 'thessaloniki': 'Greece',
  // Turkey
  'turkey': 'Turkey', 'istanbul': 'Turkey', 'cappadocia': 'Turkey',
  'antalya': 'Turkey', 'bodrum': 'Turkey', 'ephesus': 'Turkey', 'ankara': 'Turkey',
  // Mexico
  'mexico': 'Mexico', 'cancun': 'Mexico', 'mexico city': 'Mexico',
  'tulum': 'Mexico', 'playa del carmen': 'Mexico', 'oaxaca': 'Mexico',
  'guadalajara': 'Mexico', 'cabo san lucas': 'Mexico',
  // Maldives
  'maldives': 'Maldives', 'male': 'Maldives', 'maafushi': 'Maldives',
  // Vietnam
  'vietnam': 'Vietnam', 'hanoi': 'Vietnam', 'ho chi minh': 'Vietnam',
  'saigon': 'Vietnam', 'hoi an': 'Vietnam', 'da nang': 'Vietnam',
  'ha long': 'Vietnam', 'halong': 'Vietnam', 'sapa': 'Vietnam',
  // Nepal
  'nepal': 'Nepal', 'kathmandu': 'Nepal', 'pokhara': 'Nepal',
  'everest': 'Nepal', 'annapurna': 'Nepal', 'chitwan': 'Nepal',
  // Morocco
  'morocco': 'Morocco', 'marrakech': 'Morocco', 'fes': 'Morocco',
  'casablanca': 'Morocco', 'chefchaouen': 'Morocco', 'sahara': 'Morocco',
  'essaouira': 'Morocco', 'agadir': 'Morocco',
  // South Korea
  'south korea': 'South Korea', 'korea': 'South Korea', 'seoul': 'South Korea',
  'busan': 'South Korea', 'jeju': 'South Korea', 'gyeongju': 'South Korea',
  'incheon': 'South Korea',
  // Portugal
  'portugal': 'Portugal', 'lisbon': 'Portugal', 'porto': 'Portugal',
  'algarve': 'Portugal', 'sintra': 'Portugal', 'madeira': 'Portugal',
  'azores': 'Portugal', 'faro': 'Portugal',
};

function detectCountry(destination) {
  if (!destination) return null;
  const lower = destination.toLowerCase().trim();
  if (COUNTRY_MAP[lower]) return COUNTRY_MAP[lower];
  for (const [key, country] of Object.entries(COUNTRY_MAP)) {
    if (lower.includes(key)) return country;
  }
  return null;
}

export default function Seasonality({ destination }) {
  const country = useMemo(() => detectCountry(destination), [destination]);
  const data = SEASON_DATA[country] || null;

  const currentMonth = new Date().toLocaleString('en-US', { month: 'short' });
  const isBestTime = data?.best.includes(currentMonth);

  if (!data) {
    return (
      <div className="glass animate-fade-in" style={{ padding: '40px', textAlign: 'center', marginBottom: '30px' }}>
        <Calendar size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
        <h3 style={{ color: 'white' }}>Seasonality Insight</h3>
        <p style={{ color: 'var(--text-muted)' }}>Climate and crowd data is available for 20+ destinations including India, Japan, Thailand, France, Italy, Spain, UK, Bali, Dubai, Greece, Turkey, Australia, Vietnam, Nepal, Morocco, South Korea, Portugal, Mexico, Maldives, and Singapore.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ marginBottom: '40px' }}>
      
      {/* 1. Header & Verdict */}
      <div className="glass" style={{ padding: '30px', marginBottom: '24px', borderLeft: `6px solid ${isBestTime ? '#22c55e' : '#f59e0b'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <TrendingUp size={24} color={isBestTime ? '#22c55e' : '#f59e0b'} />
              <h3 style={{ fontSize: '1.5rem', color: 'white', margin: 0 }}>Weather & Crowd Verdict</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '500px' }}>{data.verdict}</p>
          </div>
          
          <div style={{ 
            background: isBestTime ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${isBestTime ? '#22c55e' : '#f59e0b'}`,
            padding: '15px 25px', borderRadius: '16px', textAlign: 'center'
          }}>
            <div style={{ color: isBestTime ? '#22c55e' : '#f59e0b', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {isBestTime ? 'Highly Recommended' : 'Should you go?'}
            </div>
            <div style={{ color: 'white', fontSize: '1.3rem', fontWeight: '800' }}>
               {isBestTime ? `Yes! It's ${currentMonth}` : `Maybe (It's ${currentMonth})`}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* 2. Monthly Trend Chart */}
        <div className="glass" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Calendar size={18} color="var(--primary)" />
            <h4 style={{ color: 'white', margin: 0, fontSize: '1rem' }}>Monthly Trends</h4>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }} className="custom-scrollbar">
            {data.months.map((m, i) => (
              <div key={i} style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
                background: m.month === currentMonth ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${m.month === currentMonth ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: '12px'
              }}>
                <div style={{ width: '40px', fontWeight: 'bold', color: m.month === currentMonth ? 'var(--primary)' : 'white' }}>{m.month}</div>
                
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Thermometer size={14} color="rgba(255,255,255,0.3)" />
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>{m.temp}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div title="Crowd Level" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={12} color="rgba(255,255,255,0.3)" />
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: m.crowd === 'Low' ? '#22c55e' : m.crowd === 'High' || m.crowd === 'V.High' ? '#ef4444' : '#f59e0b' }}>
                        {m.crowd}
                      </span>
                    </div>
                    <div title="Price Indicator" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <DollarSign size={12} color="rgba(255,255,255,0.3)" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: m.price === 'Low' ? '#22c55e' : m.price === 'High' || m.price === 'V.High' ? '#ef4444' : '#f59e0b' }}>
                        {m.price === 'V.High' ? '$$$' : m.price === 'High' ? '$$' : '$'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Season Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {[
            { tag: 'Spring', icon: <Sun size={18} color="#4ade80" />, desc: data.tips.Spring },
            { tag: 'Summer', icon: <Sun size={18} color="#fbbf24" />, desc: data.tips.Summer },
            { tag: 'Autumn', icon: <Sun size={18} color="#f97316" />, desc: data.tips.Autumn },
            { tag: 'Winter', icon: <Thermometer size={18} color="#60a5fa" />, desc: data.tips.Winter }
          ].map((season, i) => (
            <div key={i} className="glass" style={{ padding: '20px', borderRadius: '18px', display: 'flex', gap: '15px' }}>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {season.icon}
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '4px' }}>{season.tag}</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, lineHeight: '1.5' }}>{season.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

