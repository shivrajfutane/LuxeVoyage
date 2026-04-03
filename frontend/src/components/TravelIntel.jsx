import React, { useState, useMemo } from 'react';
import { Shield, Phone, Globe2, Languages, Zap, AlertTriangle, Copy, Check, Car, Plug, Clock, Coins, ChevronDown, ChevronUp, Sun, Cloud, CloudRain, Thermometer, Wind } from 'lucide-react';

// ====== CURATED DATA MAPS ======

const COUNTRY_MAP = {
  // Asia
  'india': 'India', 'delhi': 'India', 'mumbai': 'India', 'goa': 'India', 'jaipur': 'India',
  'bangalore': 'India', 'kerala': 'India', 'manali': 'India', 'shimla': 'India', 'varanasi': 'India',
  'udaipur': 'India', 'agra': 'India', 'kolkata': 'India', 'chennai': 'India', 'hyderabad': 'India',
  'japan': 'Japan', 'tokyo': 'Japan', 'osaka': 'Japan', 'kyoto': 'Japan',
  'thailand': 'Thailand', 'bangkok': 'Thailand', 'phuket': 'Thailand', 'chiang mai': 'Thailand',
  'singapore': 'Singapore',
  'malaysia': 'Malaysia', 'kuala lumpur': 'Malaysia',
  'indonesia': 'Indonesia', 'bali': 'Indonesia', 'jakarta': 'Indonesia',
  'vietnam': 'Vietnam', 'hanoi': 'Vietnam', 'ho chi minh': 'Vietnam',
  'south korea': 'South Korea', 'seoul': 'South Korea',
  'china': 'China', 'beijing': 'China', 'shanghai': 'China',
  'nepal': 'Nepal', 'kathmandu': 'Nepal',
  'sri lanka': 'Sri Lanka', 'colombo': 'Sri Lanka',
  'maldives': 'Maldives', 'male': 'Maldives',
  'dubai': 'UAE', 'abu dhabi': 'UAE', 'uae': 'UAE',
  'turkey': 'Turkey', 'istanbul': 'Turkey', 'cappadocia': 'Turkey',
  // Europe
  'france': 'France', 'paris': 'France', 'nice': 'France',
  'italy': 'Italy', 'rome': 'Italy', 'venice': 'Italy', 'milan': 'Italy', 'florence': 'Italy',
  'spain': 'Spain', 'barcelona': 'Spain', 'madrid': 'Spain',
  'germany': 'Germany', 'berlin': 'Germany', 'munich': 'Germany',
  'netherlands': 'Netherlands', 'amsterdam': 'Netherlands',
  'greece': 'Greece', 'athens': 'Greece', 'santorini': 'Greece',
  'portugal': 'Portugal', 'lisbon': 'Portugal',
  'uk': 'UK', 'london': 'UK', 'edinburgh': 'UK', 'england': 'UK', 'scotland': 'UK',
  'switzerland': 'Switzerland', 'zurich': 'Switzerland', 'geneva': 'Switzerland',
  'czech republic': 'Czech Republic', 'prague': 'Czech Republic',
  'hungary': 'Hungary', 'budapest': 'Hungary',
  'austria': 'Austria', 'vienna': 'Austria',
  'iceland': 'Iceland', 'reykjavik': 'Iceland',
  // Americas
  'usa': 'USA', 'new york': 'USA', 'los angeles': 'USA', 'san francisco': 'USA',
  'las vegas': 'USA', 'miami': 'USA', 'hawaii': 'USA', 'chicago': 'USA',
  'canada': 'Canada', 'toronto': 'Canada', 'vancouver': 'Canada',
  'mexico': 'Mexico', 'cancun': 'Mexico', 'mexico city': 'Mexico',
  'brazil': 'Brazil', 'rio de janeiro': 'Brazil', 'sao paulo': 'Brazil',
  'argentina': 'Argentina', 'buenos aires': 'Argentina',
  'peru': 'Peru', 'lima': 'Peru', 'cusco': 'Peru',
  // Africa & Oceania
  'south africa': 'South Africa', 'cape town': 'South Africa',
  'egypt': 'Egypt', 'cairo': 'Egypt',
  'morocco': 'Morocco', 'marrakech': 'Morocco',
  'kenya': 'Kenya', 'nairobi': 'Kenya',
  'australia': 'Australia', 'sydney': 'Australia', 'melbourne': 'Australia',
  'new zealand': 'New Zealand', 'auckland': 'New Zealand',
};

const EMERGENCY_DATA = {
  'India': { police: '100', ambulance: '108', fire: '101', tourist: '1363' },
  'Japan': { police: '110', ambulance: '119', fire: '119', tourist: '050-3816-2787' },
  'Thailand': { police: '191', ambulance: '1669', fire: '199', tourist: '1155' },
  'Singapore': { police: '999', ambulance: '995', fire: '995' },
  'Malaysia': { police: '999', ambulance: '999', fire: '994' },
  'Indonesia': { police: '110', ambulance: '118', fire: '113' },
  'Vietnam': { police: '113', ambulance: '115', fire: '114' },
  'South Korea': { police: '112', ambulance: '119', fire: '119' },
  'China': { police: '110', ambulance: '120', fire: '119' },
  'Nepal': { police: '100', ambulance: '102', fire: '101' },
  'Sri Lanka': { police: '119', ambulance: '110', fire: '110' },
  'Maldives': { police: '119', ambulance: '102', fire: '118' },
  'UAE': { police: '999', ambulance: '998', fire: '997' },
  'Turkey': { police: '155', ambulance: '112', fire: '110' },
  'France': { police: '17', ambulance: '15', fire: '18', tourist: '112' },
  'Italy': { police: '113', ambulance: '118', fire: '115', tourist: '112' },
  'Spain': { police: '091', ambulance: '061', fire: '080', tourist: '112' },
  'Germany': { police: '110', ambulance: '112', fire: '112' },
  'Netherlands': { police: '112', ambulance: '112', fire: '112' },
  'Greece': { police: '100', ambulance: '166', fire: '199', tourist: '171' },
  'Portugal': { police: '112', ambulance: '112', fire: '112' },
  'UK': { police: '999', ambulance: '999', fire: '999' },
  'Switzerland': { police: '117', ambulance: '144', fire: '118' },
  'Czech Republic': { police: '158', ambulance: '155', fire: '150' },
  'Hungary': { police: '107', ambulance: '104', fire: '105' },
  'Austria': { police: '133', ambulance: '144', fire: '122' },
  'Iceland': { police: '112', ambulance: '112', fire: '112' },
  'USA': { police: '911', ambulance: '911', fire: '911' },
  'Canada': { police: '911', ambulance: '911', fire: '911' },
  'Mexico': { police: '911', ambulance: '911', fire: '911' },
  'Brazil': { police: '190', ambulance: '192', fire: '193' },
  'Argentina': { police: '101', ambulance: '107', fire: '100' },
  'Peru': { police: '105', ambulance: '116', fire: '116' },
  'South Africa': { police: '10111', ambulance: '10177', fire: '10177' },
  'Egypt': { police: '122', ambulance: '123', fire: '180' },
  'Morocco': { police: '19', ambulance: '15', fire: '15' },
  'Kenya': { police: '999', ambulance: '999', fire: '999' },
  'Australia': { police: '000', ambulance: '000', fire: '000' },
  'New Zealand': { police: '111', ambulance: '111', fire: '111' },
};

const PHRASES = {
  'India': { lang: 'Hindi', phrases: [
    ['Hello', 'Namaste (नमस्ते)'], ['Thank you', 'Dhanyavaad (धन्यवाद)'], ['Please', 'Kripaya (कृपया)'],
    ['Excuse me', 'Suniye (सुनिए)'], ['How much?', 'Kitne ka hai? (कितने का है?)'], ['Where is...?', 'Kahan hai? (कहाँ है?)'],
    ['Help!', 'Madad! (मदद!)'], ['Yes', 'Haan (हाँ)'], ['No', 'Nahi (नहीं)'], ['Water', 'Paani (पानी)']
  ]},
  'Japan': { lang: 'Japanese', phrases: [
    ['Hello', 'Konnichiwa (こんにちは)'], ['Thank you', 'Arigatou (ありがとう)'], ['Please', 'Onegaishimasu (お願いします)'],
    ['Excuse me', 'Sumimasen (すみません)'], ['How much?', 'Ikura desu ka? (いくらですか?)'], ['Where is...?', 'Doko desu ka? (どこですか?)'],
    ['Help!', 'Tasukete! (助けて!)'], ['Yes', 'Hai (はい)'], ['No', 'Iie (いいえ)'], ['Water', 'Mizu (水)']
  ]},
  'Thailand': { lang: 'Thai', phrases: [
    ['Hello', 'Sawasdee (สวัสดี)'], ['Thank you', 'Khop khun (ขอบคุณ)'], ['Please', 'Karuna (กรุณา)'],
    ['Excuse me', 'Khor thot (ขอโทษ)'], ['How much?', 'Thao rai? (เท่าไหร่?)'], ['Where is...?', 'Yuu thi nai? (อยู่ที่ไหน?)'],
    ['Help!', 'Chuay duay! (ช่วยด้วย!)'], ['Yes', 'Chai (ใช่)'], ['No', 'Mai (ไม่)'], ['Water', 'Nam (น้ำ)']
  ]},
  'France': { lang: 'French', phrases: [
    ['Hello', 'Bonjour'], ['Thank you', 'Merci'], ['Please', "S'il vous plaît"],
    ['Excuse me', 'Excusez-moi'], ['How much?', "C'est combien?"], ['Where is...?', 'Où est...?'],
    ['Help!', 'Au secours!'], ['Yes', 'Oui'], ['No', 'Non'], ['Water', 'Eau']
  ]},
  'Italy': { lang: 'Italian', phrases: [
    ['Hello', 'Ciao / Buongiorno'], ['Thank you', 'Grazie'], ['Please', 'Per favore'],
    ['Excuse me', 'Scusi'], ['How much?', 'Quanto costa?'], ['Where is...?', "Dov'è...?"],
    ['Help!', 'Aiuto!'], ['Yes', 'Sì'], ['No', 'No'], ['Water', 'Acqua']
  ]},
  'Spain': { lang: 'Spanish', phrases: [
    ['Hello', 'Hola'], ['Thank you', 'Gracias'], ['Please', 'Por favor'],
    ['Excuse me', 'Disculpe'], ['How much?', '¿Cuánto cuesta?'], ['Where is...?', '¿Dónde está...?'],
    ['Help!', '¡Ayuda!'], ['Yes', 'Sí'], ['No', 'No'], ['Water', 'Agua']
  ]},
  'Germany': { lang: 'German', phrases: [
    ['Hello', 'Hallo / Guten Tag'], ['Thank you', 'Danke'], ['Please', 'Bitte'],
    ['Excuse me', 'Entschuldigung'], ['How much?', 'Wie viel kostet das?'], ['Where is...?', 'Wo ist...?'],
    ['Help!', 'Hilfe!'], ['Yes', 'Ja'], ['No', 'Nein'], ['Water', 'Wasser']
  ]},
  'Turkey': { lang: 'Turkish', phrases: [
    ['Hello', 'Merhaba'], ['Thank you', 'Teşekkürler'], ['Please', 'Lütfen'],
    ['Excuse me', 'Affedersiniz'], ['How much?', 'Ne kadar?'], ['Where is...?', 'Nerede...?'],
    ['Help!', 'İmdat!'], ['Yes', 'Evet'], ['No', 'Hayır'], ['Water', 'Su']
  ]},
  'South Korea': { lang: 'Korean', phrases: [
    ['Hello', 'Annyeonghaseyo (안녕하세요)'], ['Thank you', 'Gamsahamnida (감사합니다)'], ['Please', 'Juseyo (주세요)'],
    ['Excuse me', 'Sillyehamnida (실례합니다)'], ['How much?', 'Eolmayeyo? (얼마예요?)'], ['Where is...?', 'Eodiyeyo? (어디예요?)'],
    ['Help!', 'Dowajuseyo! (도와주세요!)'], ['Yes', 'Ne (네)'], ['No', 'Aniyo (아니요)'], ['Water', 'Mul (물)']
  ]},
  'China': { lang: 'Mandarin', phrases: [
    ['Hello', 'Nǐ hǎo (你好)'], ['Thank you', 'Xièxiè (谢谢)'], ['Please', 'Qǐng (请)'],
    ['Excuse me', 'Duìbùqǐ (对不起)'], ['How much?', 'Duōshǎo qián? (多少钱?)'], ['Where is...?', 'Zài nǎr? (在哪儿?)'],
    ['Help!', 'Jiùmìng! (救命!)'], ['Yes', 'Shì (是)'], ['No', 'Bù (不)'], ['Water', 'Shuǐ (水)']
  ]},
  'Brazil': { lang: 'Portuguese', phrases: [
    ['Hello', 'Olá'], ['Thank you', 'Obrigado/a'], ['Please', 'Por favor'],
    ['Excuse me', 'Com licença'], ['How much?', 'Quanto custa?'], ['Where is...?', 'Onde fica...?'],
    ['Help!', 'Socorro!'], ['Yes', 'Sim'], ['No', 'Não'], ['Water', 'Água']
  ]},
  'Mexico': { lang: 'Spanish', phrases: [
    ['Hello', 'Hola'], ['Thank you', 'Gracias'], ['Please', 'Por favor'],
    ['Excuse me', 'Disculpe'], ['How much?', '¿Cuánto cuesta?'], ['Where is...?', '¿Dónde está...?'],
    ['Help!', '¡Ayuda!'], ['Yes', 'Sí'], ['No', 'No'], ['Water', 'Agua']
  ]},
  'Argentina': { lang: 'Spanish', phrases: [
    ['Hello', 'Hola'], ['Thank you', 'Gracias'], ['Please', 'Por favor'],
    ['Excuse me', 'Disculpá'], ['How much?', '¿Cuánto sale?'], ['Where is...?', '¿Dónde queda...?'],
    ['Help!', '¡Ayuda!'], ['Yes', 'Sí'], ['No', 'No'], ['Water', 'Agua']
  ]},
  'Peru': { lang: 'Spanish', phrases: [
    ['Hello', 'Hola'], ['Thank you', 'Gracias'], ['Please', 'Por favor'],
    ['Excuse me', 'Disculpe'], ['How much?', '¿Cuánto cuesta?'], ['Where is...?', '¿Dónde está...?'],
    ['Help!', '¡Ayuda!'], ['Yes', 'Sí'], ['No', 'No'], ['Water', 'Agua']
  ]},
  'Vietnam': { lang: 'Vietnamese', phrases: [
    ['Hello', 'Xin chào'], ['Thank you', 'Cảm ơn'], ['Please', 'Làm ơn'],
    ['Excuse me', 'Xin lỗi'], ['How much?', 'Bao nhiêu?'], ['Where is...?', 'Ở đâu?'],
    ['Help!', 'Cứu!'], ['Yes', 'Vâng'], ['No', 'Không'], ['Water', 'Nước']
  ]},
  'Indonesia': { lang: 'Indonesian', phrases: [
    ['Hello', 'Halo'], ['Thank you', 'Terima kasih'], ['Please', 'Tolong'],
    ['Excuse me', 'Permisi'], ['How much?', 'Berapa harganya?'], ['Where is...?', 'Di mana...?'],
    ['Help!', 'Tolong!'], ['Yes', 'Ya'], ['No', 'Tidak'], ['Water', 'Air']
  ]},
  'Egypt': { lang: 'Arabic', phrases: [
    ['Hello', 'Ahlan (أهلا)'], ['Thank you', 'Shukran (شكرا)'], ['Please', 'Min fadlak (من فضلك)'],
    ['Excuse me', 'Law samaht (لو سمحت)'], ['How much?', 'Bekam? (بكام?)'], ['Where is...?', 'Fein? (فين?)'],
    ['Help!', 'Elhaani! (إلحقني!)'], ['Yes', 'Aiwa (أيوا)'], ['No', 'La (لا)'], ['Water', 'Mayya (مية)']
  ]},
  'Morocco': { lang: 'Arabic / French', phrases: [
    ['Hello', 'Salam (سلام) / Bonjour'], ['Thank you', 'Shukran (شكرا) / Merci'], ['Please', 'Afak (عفاك)'],
    ['Excuse me', 'Smeh liya (سمح ليا)'], ['How much?', 'Beshhal? (بشحال?)'], ['Where is...?', 'Fin? (فين?)'],
    ['Help!', 'Awni! (عوني!)'], ['Yes', 'Iyeh (إيه)'], ['No', 'La (لا)'], ['Water', 'Lma (لما)']
  ]},
  'Greece': { lang: 'Greek', phrases: [
    ['Hello', 'Yia sas (Γεια σας)'], ['Thank you', 'Efcharistó (Ευχαριστώ)'], ['Please', 'Parakaló (Παρακαλώ)'],
    ['Excuse me', 'Signómi (Συγνώμη)'], ['How much?', 'Póso káni? (Πόσο κάνει?)'], ['Where is...?', 'Pou íne? (Πού είναι?)'],
    ['Help!', 'Voítheia! (Βοήθεια!)'], ['Yes', 'Ne (Ναι)'], ['No', 'Óchi (Όχι)'], ['Water', 'Neró (Νερό)']
  ]},
  // English-speaking fallback
  'USA': { lang: 'English', phrases: [] },
  'UK': { lang: 'English', phrases: [] },
  'Canada': { lang: 'English / French', phrases: [
    ['Hello', 'Bonjour (French)'], ['Thank you', 'Merci (French)'], ['Please', "S'il vous plaît"],
    ['Excuse me', 'Excusez-moi'], ['How much?', "C'est combien?"], ['Where is...?', 'Où est...?'],
    ['Help!', 'Au secours!'], ['Yes', 'Oui'], ['No', 'Non'], ['Water', 'Eau']
  ]},
  'Australia': { lang: 'English', phrases: [] },
  'New Zealand': { lang: 'English', phrases: [] },
  'Singapore': { lang: 'English', phrases: [] },
  'South Africa': { lang: 'English', phrases: [] },
  'Kenya': { lang: 'English / Swahili', phrases: [
    ['Hello', 'Jambo'], ['Thank you', 'Asante'], ['Please', 'Tafadhali'],
    ['Excuse me', 'Samahani'], ['How much?', 'Bei gani?'], ['Where is...?', 'Iko wapi?'],
    ['Help!', 'Msaada!'], ['Yes', 'Ndiyo'], ['No', 'Hapana'], ['Water', 'Maji']
  ]},
  'UAE': { lang: 'Arabic', phrases: [
    ['Hello', 'Marhaba (مرحبا)'], ['Thank you', 'Shukran (شكرا)'], ['Please', 'Min fadlak (من فضلك)'],
    ['Excuse me', 'Law samaht (لو سمحت)'], ['How much?', 'Kam? (كم?)'], ['Where is...?', 'Wein? (وين?)'],
    ['Help!', 'Musaada! (مساعدة!)'], ['Yes', 'Na\'am (نعم)'], ['No', 'La (لا)'], ['Water', 'Maa (ماء)']
  ]},
  'Nepal': { lang: 'Nepali', phrases: [
    ['Hello', 'Namaste (नमस्ते)'], ['Thank you', 'Dhanyabad (धन्यवाद)'], ['Please', 'Kripaya (कृपया)'],
    ['Excuse me', 'Hajur (हजुर)'], ['How much?', 'Kati ho? (कति हो?)'], ['Where is...?', 'Kaha chha? (कहाँ छ?)'],
    ['Help!', 'Guhar! (गुहार!)'], ['Yes', 'Ho (हो)'], ['No', 'Hoina (होइन)'], ['Water', 'Paani (पानी)']
  ]},
  'Sri Lanka': { lang: 'Sinhala', phrases: [
    ['Hello', 'Ayubowan (ආයුබෝවන්)'], ['Thank you', 'Istuti (ස්තුතියි)'], ['Please', 'Karunakara (කරුණාකර)'],
    ['Excuse me', 'Samavenna (සමාවෙන්න)'], ['How much?', 'Kiyada? (කීයද?)'], ['Where is...?', 'Koheda? (කොහෙද?)'],
    ['Help!', 'Udaw! (උදව්!)'], ['Yes', 'Ov (ඔව්)'], ['No', 'Naha (නැහැ)'], ['Water', 'Watura (වතුර)']
  ]},
  'Maldives': { lang: 'Dhivehi', phrases: [
    ['Hello', 'Assalaam Alaikum'], ['Thank you', 'Shukuriyya'], ['Please', 'Adhes kohfa'],
    ['Excuse me', 'Ma-aafu kurey'], ['How much?', 'Agu kihaavarakah?'], ['Where is...?', 'Kobaa?'],
    ['Help!', 'Ehee!'], ['Yes', 'Aan'], ['No', 'Noon'], ['Water', 'Fen']
  ]},
  'Netherlands': { lang: 'Dutch', phrases: [
    ['Hello', 'Hallo / Goedendag'], ['Thank you', 'Dank u wel'], ['Please', 'Alstublieft'],
    ['Excuse me', 'Pardon'], ['How much?', 'Hoeveel kost dit?'], ['Where is...?', 'Waar is...?'],
    ['Help!', 'Help!'], ['Yes', 'Ja'], ['No', 'Nee'], ['Water', 'Water']
  ]},
  'Portugal': { lang: 'Portuguese', phrases: [
    ['Hello', 'Olá'], ['Thank you', 'Obrigado/a'], ['Please', 'Por favor'],
    ['Excuse me', 'Com licença'], ['How much?', 'Quanto custa?'], ['Where is...?', 'Onde fica...?'],
    ['Help!', 'Socorro!'], ['Yes', 'Sim'], ['No', 'Não'], ['Water', 'Água']
  ]},
  'Czech Republic': { lang: 'Czech', phrases: [
    ['Hello', 'Dobrý den'], ['Thank you', 'Děkuji'], ['Please', 'Prosím'],
    ['Excuse me', 'Promiňte'], ['How much?', 'Kolik to stojí?'], ['Where is...?', 'Kde je...?'],
    ['Help!', 'Pomoc!'], ['Yes', 'Ano'], ['No', 'Ne'], ['Water', 'Voda']
  ]},
  'Hungary': { lang: 'Hungarian', phrases: [
    ['Hello', 'Szia / Jó napot'], ['Thank you', 'Köszönöm'], ['Please', 'Kérem'],
    ['Excuse me', 'Elnézést'], ['How much?', 'Mennyibe kerül?'], ['Where is...?', 'Hol van...?'],
    ['Help!', 'Segítség!'], ['Yes', 'Igen'], ['No', 'Nem'], ['Water', 'Víz']
  ]},
  'Austria': { lang: 'German', phrases: [
    ['Hello', 'Grüß Gott'], ['Thank you', 'Danke'], ['Please', 'Bitte'],
    ['Excuse me', 'Entschuldigung'], ['How much?', 'Wie viel kostet das?'], ['Where is...?', 'Wo ist...?'],
    ['Help!', 'Hilfe!'], ['Yes', 'Ja'], ['No', 'Nein'], ['Water', 'Wasser']
  ]},
  'Iceland': { lang: 'Icelandic', phrases: [
    ['Hello', 'Halló'], ['Thank you', 'Takk'], ['Please', 'Vinsamlegast'],
    ['Excuse me', 'Afsakið'], ['How much?', 'Hvað kostar?'], ['Where is...?', 'Hvar er...?'],
    ['Help!', 'Hjálp!'], ['Yes', 'Já'], ['No', 'Nei'], ['Water', 'Vatn']
  ]},
  'Malaysia': { lang: 'Malay', phrases: [
    ['Hello', 'Hai / Selamat'], ['Thank you', 'Terima kasih'], ['Please', 'Tolong / Sila'],
    ['Excuse me', 'Maafkan saya'], ['How much?', 'Berapa harganya?'], ['Where is...?', 'Di mana...?'],
    ['Help!', 'Tolong!'], ['Yes', 'Ya'], ['No', 'Tidak'], ['Water', 'Air']
  ]},
  'Switzerland': { lang: 'German / French', phrases: [
    ['Hello', 'Grüezi / Bonjour'], ['Thank you', 'Merci vielmal / Merci'], ['Please', 'Bitte / S\'il vous plaît'],
    ['Excuse me', 'Entschuldigung / Excusez-moi'], ['How much?', 'Wie viel? / Combien?'], ['Where is...?', 'Wo ist? / Où est?'],
    ['Help!', 'Hilfe! / Au secours!'], ['Yes', 'Ja / Oui'], ['No', 'Nein / Non'], ['Water', 'Wasser / Eau']
  ]},
};

const QUICK_FACTS = {
  'India': { drive: 'Left', plug: 'C/D/M (230V)', tip: '10% at restaurants', tz: 'IST (UTC+5:30)' },
  'Japan': { drive: 'Left', plug: 'A/B (100V)', tip: 'No tipping! Considered rude', tz: 'JST (UTC+9)' },
  'Thailand': { drive: 'Left', plug: 'A/B/C (220V)', tip: 'Not expected, round up', tz: 'ICT (UTC+7)' },
  'Singapore': { drive: 'Left', plug: 'G (230V)', tip: 'Not expected, 10% added', tz: 'SGT (UTC+8)' },
  'France': { drive: 'Right', plug: 'C/E (230V)', tip: 'Service included, round up', tz: 'CET (UTC+1)' },
  'Italy': { drive: 'Right', plug: 'C/F/L (230V)', tip: 'Round up or €1-2', tz: 'CET (UTC+1)' },
  'Spain': { drive: 'Right', plug: 'C/F (230V)', tip: 'Not expected, round up', tz: 'CET (UTC+1)' },
  'Germany': { drive: 'Right', plug: 'C/F (230V)', tip: '5-10% at restaurants', tz: 'CET (UTC+1)' },
  'UK': { drive: 'Left', plug: 'G (230V)', tip: '10-15% at restaurants', tz: 'GMT (UTC+0)' },
  'USA': { drive: 'Right', plug: 'A/B (120V)', tip: '15-20% expected', tz: 'Multiple (UTC-5 to -10)' },
  'Canada': { drive: 'Right', plug: 'A/B (120V)', tip: '15-20% expected', tz: 'Multiple (UTC-3.5 to -8)' },
  'Australia': { drive: 'Left', plug: 'I (230V)', tip: 'Not expected, 10% for good service', tz: 'Multiple (UTC+8 to +11)' },
  'UAE': { drive: 'Right', plug: 'C/D/G (220V)', tip: '10-15%, often added', tz: 'GST (UTC+4)' },
  'Turkey': { drive: 'Right', plug: 'C/F (220V)', tip: '5-10% at restaurants', tz: 'TRT (UTC+3)' },
  'Mexico': { drive: 'Right', plug: 'A/B (127V)', tip: '10-15% at restaurants', tz: 'Multiple (UTC-5 to -8)' },
  'Brazil': { drive: 'Right', plug: 'C/N (127/220V)', tip: '10% usually included', tz: 'BRT (UTC-3)' },
  'South Korea': { drive: 'Right', plug: 'C/F (220V)', tip: 'Not expected', tz: 'KST (UTC+9)' },
  'China': { drive: 'Right', plug: 'A/C/I (220V)', tip: 'Not expected', tz: 'CST (UTC+8)' },
  'Greece': { drive: 'Right', plug: 'C/F (230V)', tip: 'Round up 5-10%', tz: 'EET (UTC+2)' },
  'Netherlands': { drive: 'Right', plug: 'C/F (230V)', tip: 'Round up or 5-10%', tz: 'CET (UTC+1)' },
  'Switzerland': { drive: 'Right', plug: 'C/J (230V)', tip: 'Included, round up', tz: 'CET (UTC+1)' },
  'Indonesia': { drive: 'Left', plug: 'C/F (230V)', tip: '5-10% if not included', tz: 'Multiple (UTC+7 to +9)' },
  'Vietnam': { drive: 'Right', plug: 'A/C (220V)', tip: 'Not expected, 5-10% appreciated', tz: 'ICT (UTC+7)' },
  'Egypt': { drive: 'Right', plug: 'C/F (220V)', tip: '10-15%, baksheesh expected', tz: 'EET (UTC+2)' },
  'Morocco': { drive: 'Right', plug: 'C/E (220V)', tip: '10% or round up', tz: 'WET (UTC+1)' },
  'South Africa': { drive: 'Left', plug: 'C/M/N (230V)', tip: '10-15% at restaurants', tz: 'SAST (UTC+2)' },
  'Nepal': { drive: 'Left', plug: 'C/D/M (230V)', tip: '10% at restaurants', tz: 'NPT (UTC+5:45)' },
  'Malaysia': { drive: 'Left', plug: 'G (240V)', tip: 'Not expected, round up', tz: 'MYT (UTC+8)' },
  'Maldives': { drive: 'Left', plug: 'C/D/G/J/K/L (230V)', tip: '10% usually added', tz: 'MVT (UTC+5)' },
  'Sri Lanka': { drive: 'Left', plug: 'D/G (230V)', tip: '10% at restaurants', tz: 'SLST (UTC+5:30)' },
  'Argentina': { drive: 'Right', plug: 'C/I (220V)', tip: '10% at restaurants', tz: 'ART (UTC-3)' },
  'Peru': { drive: 'Right', plug: 'A/B/C (220V)', tip: '10% at restaurants', tz: 'PET (UTC-5)' },
  'Czech Republic': { drive: 'Right', plug: 'C/E (230V)', tip: 'Round up 5-10%', tz: 'CET (UTC+1)' },
  'Hungary': { drive: 'Right', plug: 'C/F (230V)', tip: '10% at restaurants', tz: 'CET (UTC+1)' },
  'Austria': { drive: 'Right', plug: 'C/F (230V)', tip: '5-10% at restaurants', tz: 'CET (UTC+1)' },
  'Portugal': { drive: 'Right', plug: 'C/F (230V)', tip: '5-10%, not expected', tz: 'WET (UTC+0)' },
  'Iceland': { drive: 'Right', plug: 'C/F (230V)', tip: 'Not expected', tz: 'GMT (UTC+0)' },
  'New Zealand': { drive: 'Left', plug: 'I (230V)', tip: 'Not expected', tz: 'NZST (UTC+12)' },
  'Kenya': { drive: 'Left', plug: 'G (240V)', tip: '10% at restaurants', tz: 'EAT (UTC+3)' },
};

const SCAM_ALERTS = {
  'India': ['Taxi meters "broken" — insist on the meter or agree on price before riding.', 'Gem/carpet shop scams where guides take you to overpriced stores for commission.', 'Street vendors quoting prices 5-10x higher for tourists — always bargain.'],
  'France': ['Friendship bracelet scam at Sacré-Cœur — someone ties one on your wrist then demands payment.', 'Petition signers at tourist spots — they distract while an accomplice pickpockets.', 'Gold ring scam — someone "finds" a ring and tries to sell it to you.'],
  'Thailand': ['Tuk-tuk drivers offering cheap tours that stop at gem/suit shops for commission.', '"Temple is closed today" — guides redirect you to shops instead.', 'Jet ski rental damage scams — pre-existing damage blamed on you.'],
  'Italy': ['Restaurant tourist menus near attractions are 3-5x overpriced — eat where locals eat.', 'Gladiators at Colosseum demand money for photos after posing.', 'Street sellers pushing roses or bracelets into your hands then demanding payment.'],
  'Turkey': ['Shoe-shine drop scam — someone drops their brush, you pick it up, they insist on shining your shoes for a fee.', 'Friendly locals inviting you to a bar where drinks have extreme markups.', 'Carpet shop guided tours with high-pressure sales.'],
  'Egypt': ['Unsolicited "guides" at pyramids — they show you around then demand large tips.', 'Camel ride scams — agreed price triples to get back down.', 'Perfume/papyrus shop detours during taxi rides for commission.'],
  'Japan': ['Very few scams — Japan is exceptionally safe. Watch for overcharging at some tourist izakayas in Shinjuku.'],
  'USA': ['NYC: Costumed characters in Times Square demand money for photos.', 'Fake ticket sellers outside popular venues.', 'ATM skimming — use ATMs inside bank branches.'],
  'UK': ['Pickpockets on the Tube — especially crowded tourist lines.', 'Fake charity collectors on busy streets.', 'Unlicensed cabs charging inflated rates — always use black cabs or Uber.'],
  'Spain': ['Bird poop scam — someone splashes your shoulder, "helpful" stranger cleans you while pickpocketing.', 'Beach thieves — never leave belongings unattended.', 'Fake police asking to see your wallet to "check for counterfeit bills."'],
};

// Weather simulation helper
function getSimulatedWeather(destination) {
  const dest = destination.toLowerCase();
  let baseTemp = 22;
  let condition = 'Sunny';
  let humidity = '45%';
  let rainProb = '5%';

  if (dest.includes('dubai') || dest.includes('miami') || dest.includes('goa') || dest.includes('cancun')) {
    baseTemp = 32;
    condition = 'Sunny';
    humidity = '65%';
  } else if (dest.includes('london') || dest.includes('seattle') || dest.includes('amsterdam') || dest.includes('paris')) {
    baseTemp = 14;
    condition = 'Cloudy';
    rainProb = '65%';
    humidity = '80%';
  } else if (dest.includes('tokyo') || dest.includes('seoul') || dest.includes('new york')) {
    baseTemp = 18;
    condition = 'Partly Cloudy';
    humidity = '50%';
  }

  const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'].map((day, i) => {
    const temp = baseTemp + Math.floor(Math.random() * 5) - 2;
    // Simple logic: if rainProb > 50, Day 2 or 3 might have rain
    const dayCondition = (i > 0 && Math.random() * 100 < parseInt(rainProb)) ? 'Rainy' : condition;
    return { day, temp, condition: dayCondition };
  });

  return { currentTemp: baseTemp, humidity, rainProb, condition, forecast: days };
}

function detectCountry(destination) {
  if (!destination) return null;
  const lower = destination.toLowerCase().trim();
  if (COUNTRY_MAP[lower]) return COUNTRY_MAP[lower];
  for (const [key, country] of Object.entries(COUNTRY_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return country;
  }
  return null;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} title="Copy" style={{
      background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
      color: copied ? '#22c55e' : 'rgba(255,255,255,0.3)', transition: 'color 0.2s',
      flexShrink: 0
    }}>
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

export default function TravelIntel({ destination }) {
  const [expandedSection, setExpandedSection] = useState('emergency');
  
  const country = useMemo(() => detectCountry(destination), [destination]);
  const weather = useMemo(() => getSimulatedWeather(destination), [destination]);
  const emergency = EMERGENCY_DATA[country] || null;
  const phraseData = PHRASES[country] || null;
  const facts = QUICK_FACTS[country] || null;
  const scams = SCAM_ALERTS[country] || null;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const SectionHeader = ({ id, icon, title, color, children }) => (
    <div style={{ marginBottom: '16px' }}>
      <button onClick={() => toggleSection(id)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderRadius: '14px',
        background: expandedSection === id ? `rgba(${color}, 0.08)` : 'rgba(255,255,255,0.02)',
        border: `1px solid ${expandedSection === id ? `rgba(${color}, 0.2)` : 'rgba(255,255,255,0.05)'}`,
        cursor: 'pointer', transition: 'all 0.3s ease', fontFamily: 'Outfit, sans-serif'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon}
          <span style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>{title}</span>
        </div>
        {expandedSection === id ? <ChevronUp size={18} color="rgba(255,255,255,0.4)" /> : <ChevronDown size={18} color="rgba(255,255,255,0.4)" />}
      </button>
      {expandedSection === id && (
        <div style={{ padding: '16px 20px 4px', animation: 'fadeIn 0.3s ease' }}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="glass animate-fade-in stagger-3" style={{ padding: '30px', marginBottom: '40px', borderTop: '4px solid #ef4444' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <Shield color="#f87171" size={28} />
        <h3 style={{ fontSize: '1.6rem', color: 'white', margin: 0 }}>Travel Intel</h3>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
        Essential safety info & local knowledge for <strong style={{ color: '#f87171' }}>{country || destination}</strong>
      </p>

      {!country ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
          <Globe2 size={40} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p>Destination not recognized. Travel intel is available for 50+ countries.</p>
        </div>
      ) : (
        <>
          {/* Emergency Numbers */}
          {emergency && (
            <SectionHeader id="emergency" icon={<Phone size={18} color="#f87171" />} title="Emergency Numbers" color="239,68,68">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { label: 'Police', number: emergency.police, color: '#60a5fa' },
                  { label: 'Ambulance', number: emergency.ambulance, color: '#f87171' },
                  { label: 'Fire', number: emergency.fire, color: '#fb923c' },
                  ...(emergency.tourist ? [{ label: 'Tourist Help', number: emergency.tourist, color: '#a78bfa' }] : [])
                ].map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '14px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px' }}>{item.label}</div>
                      <div style={{ color: item.color, fontSize: '1.2rem', fontWeight: '800', letterSpacing: '1px' }}>{item.number}</div>
                    </div>
                    <a href={`tel:${item.number}`} style={{
                      background: `rgba(${item.color === '#60a5fa' ? '96,165,250' : item.color === '#f87171' ? '248,113,113' : '251,146,60'}, 0.1)`,
                      border: 'none', borderRadius: '10px', padding: '8px',
                      color: item.color, cursor: 'pointer', display: 'flex'
                    }}>
                      <Phone size={16} />
                    </a>
                  </div>
                ))}
              </div>
            </SectionHeader>
          )}

          {/* Language Phrasebook */}
          {phraseData && phraseData.phrases.length > 0 && (
            <SectionHeader id="phrases" icon={<Languages size={18} color="#a78bfa" />} title={`${phraseData.lang} Phrasebook`} color="167,139,250">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {phraseData.phrases.map(([eng, local], i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 14px', background: 'rgba(0,0,0,0.15)',
                    borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)'
                  }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', width: '90px', flexShrink: 0 }}>{eng}</span>
                    <span style={{ color: '#c4b5fd', fontSize: '0.95rem', fontWeight: '600', flex: 1 }}>{local}</span>
                    <CopyButton text={local} />
                  </div>
                ))}
              </div>
            </SectionHeader>
          )}

          {/* Quick Facts */}
          {facts && (
            <SectionHeader id="facts" icon={<Zap size={18} color="#fbbf24" />} title="Quick Facts" color="251,191,36">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {[
                  { icon: <Car size={16} color="#fbbf24" />, label: 'Driving Side', value: facts.drive },
                  { icon: <Plug size={16} color="#fbbf24" />, label: 'Plug Type', value: facts.plug },
                  { icon: <Coins size={16} color="#fbbf24" />, label: 'Tipping', value: facts.tip },
                  { icon: <Clock size={16} color="#fbbf24" />, label: 'Time Zone', value: facts.tz }
                ].map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '14px 16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      {item.icon}
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</span>
                    </div>
                    <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </SectionHeader>
          )}

          {/* Scam Alerts */}
          {scams && (
            <SectionHeader id="scams" icon={<AlertTriangle size={18} color="#fb923c" />} title="Common Scams" color="251,146,60">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {scams.map((scam, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: '12px', padding: '14px 16px',
                    background: 'rgba(251,146,60,0.05)', borderRadius: '12px',
                    border: '1px solid rgba(251,146,60,0.1)'
                  }}>
                    <AlertTriangle size={16} color="#fb923c" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', lineHeight: '1.5' }}>{scam}</span>
                  </div>
                ))}
              </div>
            </SectionHeader>
          )}

          {/* AI Weather Intelligence */}
          <SectionHeader id="weather" icon={<CloudRain size={18} color="#60a5fa" />} title="AI Weather Intelligence" color="96,165,250">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
               {/* Current Stats */}
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                     <Thermometer size={16} color="#60a5fa" style={{ marginBottom: '8px' }} />
                     <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{weather.currentTemp}°C</div>
                     <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Avg. Temp</span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                     <Wind size={16} color="#60a5fa" style={{ marginBottom: '8px' }} />
                     <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{weather.humidity}</div>
                     <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Humidity</span>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
                     <CloudRain size={16} color="#60a5fa" style={{ marginBottom: '8px' }} />
                     <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{weather.rainProb}</div>
                     <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Rain Prob.</span>
                  </div>
               </div>

               {/* 5-Day Forecast */}
               <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }} className="hide-scrollbar">
                  {weather.forecast.map((f, i) => (
                    <div key={i} style={{ 
                      minWidth: '80px', flex: 1, background: 'rgba(255,255,255,0.03)', 
                      padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                    }}>
                       <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{f.day}</span>
                       {f.condition === 'Rainy' ? <CloudRain size={18} color="#60a5fa" /> : 
                        f.condition === 'Sunny' ? <Sun size={18} color="#fbbf24" /> : <Cloud size={18} color="#94a3b8" />}
                       <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{f.temp}°</span>
                    </div>
                  ))}
               </div>

               {/* AI Guard Insight */}
               <div style={{ 
                 background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', 
                 padding: '16px', borderRadius: '14px', display: 'flex', gap: '12px'
               }}>
                  <Zap size={20} color="#60a5fa" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h5 style={{ margin: '0 0 4px 0', color: '#60a5fa', fontSize: '0.9rem' }}>AI Weather Guard Insight</h5>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>
                      {parseInt(weather.rainProb) > 40 
                        ? `Caution: Higher chance of rain (${weather.rainProb}) in ${destination}. Consider swapping outdoor tours with museum visits on Day 3.` 
                        : `Perfect conditions! The moderate humidity (${weather.humidity}) is ideal for the walking tours planned in your itinerary.`}
                    </p>
                  </div>
               </div>
            </div>
          </SectionHeader>
        </>
      )}
    </div>
  );
}
