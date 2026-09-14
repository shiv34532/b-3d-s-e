// Comprehensive Geographic & Cultural Database of India
// Covers all 28 States, 8 Union Territories, and Major Cities & 3D Landmarks

export const INDIA_OVERVIEW = {
  name: "Republic of India (Bharat)",
  subcontinent: "South Asia",
  capital: "New Delhi",
  coordinates: { lat: 20.5937, lng: 78.9629, altitudeMeters: 6500000 },
  area: "3,287,263 sq km (7th largest in world)",
  population: "1.44 Billion+",
  spaceAgency: "ISRO (Indian Space Research Organisation)",
  motto: "Satyameva Jayate (Truth Alone Triumphs)",
  spaceMissions: [
    { name: "Chandrayaan-3", type: "Lunar South Pole Lander", year: "2023", status: "Historic Success" },
    { name: "Aditya-L1", type: "Solar Observation Observatory", year: "2023", status: "Active (L1 Halo Orbit)" },
    { name: "Gaganyaan", type: "Human Spaceflight Mission", year: "2025-2026", status: "Upcoming" },
    { name: "NavIC / IRNSS", type: "Regional Satellite Navigation", year: "Operational", status: "7 Constellation Satellites" }
  ]
};

export const MAJOR_CITIES = [
  {
    id: "delhi",
    name: "New Delhi",
    hindiName: "नई दिल्ली",
    state: "National Capital Territory",
    region: "North",
    type: "National Capital of India",
    lat: 28.6129,
    lng: 77.2295,
    elevationM: 216,
    cameraHeightM: 1400,
    pitchDeg: -40,
    headingDeg: 25,
    highlight: "Seat of governance, Kartavya Path, India Gate, and millennia of architectural heritage.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@28.612912,77.22951,216a,1400d,35y,25h,55t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=India+Gate+New+Delhi&t=k&z=16&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "India Gate", type: "National War Memorial", heightM: 42 },
      { name: "Rashtrapati Bhavan", type: "Presidential Palace & Amrit Udyan", heightM: 50 },
      { name: "Qutub Minar", type: "UNESCO World Heritage Minaret", heightM: 73 },
      { name: "Lotus Temple", type: "Bahá'í House of Worship", heightM: 34 }
    ],
    terrain: "Indo-Gangetic alluvial plains, Yamuna river basin, ancient Aravalli Ridge outcrops"
  },
  {
    id: "mumbai",
    name: "Mumbai",
    hindiName: "मुंबई",
    state: "Maharashtra",
    region: "West",
    type: "Financial Capital of India",
    lat: 18.9220,
    lng: 72.8347,
    elevationM: 14,
    cameraHeightM: 1600,
    pitchDeg: -35,
    headingDeg: 15,
    highlight: "City of Dreams, Gateway of India, towering marine skylines along the Arabian Sea.",
    image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@18.9220,72.8347,14a,1600d,35y,15h,60t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Gateway+of+India+Mumbai&t=k&z=16&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Gateway of India", type: "Indo-Saracenic Basalt Arch", heightM: 26 },
      { name: "Marine Drive (Queen's Necklace)", type: "Iconic Seaside Promenade", heightM: 8 },
      { name: "Bandra-Worli Sea Link", type: "Cable-Stayed Coastal Bridge", heightM: 128 },
      { name: "Chhatrapati Shivaji Terminus", type: "Victorian Gothic UNESCO Landmark", heightM: 45 }
    ],
    terrain: "Salsette Island peninsula, deepwater Arabian Sea harbour, Konkan coastline"
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    hindiName: "हैदराबाद",
    state: "Telangana",
    region: "South",
    type: "City of Pearls & Cyberabad",
    lat: 17.3616,
    lng: 78.4747,
    elevationM: 542,
    cameraHeightM: 1200,
    pitchDeg: -45,
    headingDeg: 350,
    highlight: "The 430-year-old historic Charminar, Golconda diamond fort, and global IT technology corridors.",
    image: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@17.3616,78.4747,542a,1200d,35y,350h,55t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Charminar+Hyderabad&t=k&z=17&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Charminar", type: "1591 CE Grand Four-Minaret Arch", heightM: 56 },
      { name: "Golconda Fort", type: "Acoustic Diamond Citadel", heightM: 130 },
      { name: "HITEC City & Cyber Towers", type: "Technology Powerhouse", heightM: 110 },
      { name: "Hussain Sagar Buddha Statue", type: "Monolithic Stone Colossus", heightM: 18 }
    ],
    terrain: "Deccan Plateau granitic rock landscape, Musi river valley"
  },
  {
    id: "agra",
    name: "Agra",
    hindiName: "आगरा",
    state: "Uttar Pradesh",
    region: "North",
    type: "Jewel of World Heritage",
    lat: 27.1751,
    lng: 78.0421,
    elevationM: 171,
    cameraHeightM: 1100,
    pitchDeg: -35,
    headingDeg: 180,
    highlight: "Home to the immortal Taj Mahal—an ivory-white marble masterpiece on the sacred Yamuna River.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@27.1751,78.0421,171a,1100d,35y,180h,60t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Taj+Mahal+Agra&t=k&z=17&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Taj Mahal", type: "White Marble Mausoleum & Charbagh", heightM: 73 },
      { name: "Agra Fort", type: "Red Sandstone Imperial Citadel", heightM: 35 },
      { name: "Fatehpur Sikri", type: "Preserved Mughal City & Buland Darwaza", heightM: 54 }
    ],
    terrain: "Yamuna river floodplains, lush alluvial garden terraces"
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    hindiName: "बेंगलुरु",
    state: "Karnataka",
    region: "South",
    type: "Silicon Valley of India",
    lat: 12.9796,
    lng: 77.5907,
    elevationM: 920,
    cameraHeightM: 1500,
    pitchDeg: -40,
    headingDeg: 45,
    highlight: "ISRO Satellite Headquarters, Aerospace Capital, Garden City, and Vidhana Soudha legislative palace.",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@12.9796,77.5907,920a,1500d,35y,45h,50t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Vidhana+Soudha+Bengaluru&t=k&z=16&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Vidhana Soudha", type: "Neo-Dravidian Granite Palace", heightM: 45 },
      { name: "ISRO Headquarters", type: "National Space Science Centre", heightM: 35 },
      { name: "Bangalore Palace", type: "Tudor-Revival Royal Residence", heightM: 28 },
      { name: "Lalbagh Glass House", type: "Botanical Glass Pavilion", heightM: 22 }
    ],
    terrain: "Deccan Plateau elevated ridge, pleasant climate, lake basins"
  },
  {
    id: "varanasi",
    name: "Varanasi (Kashi)",
    hindiName: "वाराणसी (काशी)",
    state: "Uttar Pradesh",
    region: "North",
    type: "Spiritual Capital of India",
    lat: 25.3076,
    lng: 83.0107,
    elevationM: 80,
    cameraHeightM: 1300,
    pitchDeg: -40,
    headingDeg: 120,
    highlight: "One of the oldest continuously inhabited cities in human history along the sacred Ganges riverfront.",
    image: "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@25.3076,83.0107,80a,1300d,35y,120h,55t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Dashashwamedh+Ghat+Varanasi&t=k&z=16&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Dashashwamedh Ghat", type: "Historic Riverfront Ganga Aarti Steps", heightM: 20 },
      { name: "Kashi Vishwanath Corridor", type: "Golden Temple Sanctum", heightM: 48 },
      { name: "Sarnath Stupa", type: "Cradle of Buddhist Teachings", heightM: 43 }
    ],
    terrain: "Crescent bend of the sacred Ganges river, Gangetic alluvium"
  },
  {
    id: "jaipur",
    name: "Jaipur",
    hindiName: "जयपुर",
    state: "Rajasthan",
    region: "West",
    type: "The Pink City",
    lat: 26.9239,
    lng: 75.8267,
    elevationM: 431,
    cameraHeightM: 1400,
    pitchDeg: -45,
    headingDeg: 300,
    highlight: "Royal Rajput fortresses, Hawa Mahal Palace of Winds, and Jantar Mantar astronomical observatory.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@26.9239,75.8267,431a,1400d,35y,300h,55t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Hawa+Mahal+Jaipur&t=k&z=17&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Hawa Mahal", type: "5-Tier Pink Sandstone Palace of Winds", heightM: 15 },
      { name: "Amber Fort & Palace", type: "Hilltop Rajput Citadel", heightM: 95 },
      { name: "Jantar Mantar", type: "UNESCO Astronomical Equinoctial Sundial", heightM: 27 }
    ],
    terrain: "Aravalli Range rugged mountain ridges bordering the Thar Desert gateway"
  },
  {
    id: "kolkata",
    name: "Kolkata",
    hindiName: "कोलकाता",
    state: "West Bengal",
    region: "East",
    type: "Cultural Capital of India",
    lat: 22.5850,
    lng: 88.3468,
    elevationM: 9,
    cameraHeightM: 1500,
    pitchDeg: -40,
    headingDeg: 260,
    highlight: "The cantilever Howrah Bridge, Victoria Memorial, Rabindranath Tagore's literary soul on the Hooghly.",
    image: "https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@22.5850,88.3468,9a,1500d,35y,260h,55t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Howrah+Bridge+Kolkata&t=k&z=16&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Howrah Bridge", type: "Cantilever Steel River Span", heightM: 82 },
      { name: "Victoria Memorial", type: "White Marble Palace & Royal Hall", heightM: 56 },
      { name: "Dakshineswar Kali Temple", type: "Navaratna Sacred River Sanctuary", heightM: 30 }
    ],
    terrain: "Lower Gangetic delta, Hooghly riverfront, East Kolkata wetlands"
  },
  {
    id: "chennai",
    name: "Chennai",
    hindiName: "चेन्नई",
    state: "Tamil Nadu",
    region: "South",
    type: "Gateway to South India",
    lat: 13.0499,
    lng: 80.2824,
    elevationM: 6,
    cameraHeightM: 1600,
    pitchDeg: -40,
    headingDeg: 75,
    highlight: "Marina Beach (world's 2nd longest urban beach), ancient Dravidian temples, and automobile hub.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@13.0499,80.2824,6a,1600d,35y,75h,50t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Marina+Beach+Chennai&t=k&z=16&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Marina Beach", type: "13-km Natural Urban Shoreline", heightM: 5 },
      { name: "Kapaleeshwarar Temple", type: "Ancient Dravidian Sculpted Gopuram", heightM: 37 },
      { name: "San Thome Basilica", type: "Neo-Gothic Apostle Shrine", heightM: 47 }
    ],
    terrain: "Coromandel Coastal plain along the Bay of Bengal"
  },
  {
    id: "amritsar",
    name: "Amritsar",
    hindiName: "अमृतसर",
    state: "Punjab",
    region: "North",
    type: "Spiritual Center of Sikhism",
    lat: 31.6200,
    lng: 74.8765,
    elevationM: 234,
    cameraHeightM: 1100,
    pitchDeg: -45,
    headingDeg: 45,
    highlight: "Sri Harmandir Sahib (The Golden Temple) surrounded by the sacred Amrit Sarovar pool of nectar.",
    image: "https://images.unsplash.com/photo-1609946850849-c8503a79a834?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@31.6200,74.8765,234a,1100d,35y,45h,60t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Golden+Temple+Amritsar&t=k&z=17&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Golden Temple (Harmandir Sahib)", type: "24-Karat Gold Plated Sanctum", heightM: 22 },
      { name: "Jallianwala Bagh", type: "National Freedom Memorial", heightM: 15 },
      { name: "Attari-Wagah Border", type: "International Border Ceremonial Arena", heightM: 25 }
    ],
    terrain: "Fertile alluvial plains of the Punjab Majha river system"
  },
  {
    id: "srinagar",
    name: "Srinagar & Dal Lake",
    hindiName: "श्रीनगर",
    state: "Jammu & Kashmir",
    region: "North",
    type: "Paradise on Earth",
    lat: 34.0837,
    lng: 74.8450,
    elevationM: 1585,
    cameraHeightM: 2500,
    pitchDeg: -50,
    headingDeg: 10,
    highlight: "Snow-capped Himalayan peaks, floating gardens & shikaras on Dal Lake, and royal Mughal terraces.",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@34.0837,74.8450,1585a,2500d,35y,10h,65t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Dal+Lake+Srinagar&t=k&z=14&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Dal Lake & Shikaras", type: "Iconic Himalayan Alpine Waterbody", heightM: 5 },
      { name: "Shalimar Bagh & Nishat", type: "Mughal Terraced Cascades", heightM: 20 },
      { name: "Shankaracharya Temple", type: "Ancient Mountain Ridge Shrine", heightM: 300 }
    ],
    terrain: "Kashmir Valley encircled by the Pir Panjal and Great Himalayas"
  },
  {
    id: "leh",
    name: "Leh & Ladakh",
    hindiName: "लेह (लद्दाख)",
    state: "Ladakh",
    region: "North",
    type: "High-Altitude Himalayan Desert",
    lat: 34.1642,
    lng: 77.5840,
    elevationM: 3500,
    cameraHeightM: 3200,
    pitchDeg: -55,
    headingDeg: 120,
    highlight: "Trans-Himalayan high passes, crystal azure Pangong Tso, and 17th-century Tibetan Leh Palace.",
    image: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@34.1642,77.5840,3500a,3200d,35y,120h,70t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Leh+Palace+Ladakh&t=k&z=15&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Leh Palace", type: "9-Storey Dunhuang Tibetan Citadel", heightM: 58 },
      { name: "Shanti Stupa", type: "White-domed Buddhist Stupa on Chanspa Ridge", heightM: 35 },
      { name: "Khardung La", type: "One of the World's Highest Motorable Passes", heightM: 5359 }
    ],
    terrain: "Cold Trans-Himalayan desert, Indus River valley, barren ridges"
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad",
    hindiName: "अहमदाबाद",
    state: "Gujarat",
    region: "West",
    type: "UNESCO World Heritage City",
    lat: 23.0225,
    lng: 72.5714,
    elevationM: 53,
    cameraHeightM: 1400,
    pitchDeg: -40,
    headingDeg: 200,
    highlight: "Sabarmati Riverfront, Mahatma Gandhi's Ashram, and Narendra Modi Stadium (world's largest cricket stadium).",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@23.0225,72.5714,53a,1400d,35y,200h,50t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Sabarmati+Riverfront+Ahmedabad&t=k&z=16&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Sabarmati Riverfront & Atal Bridge", type: "Urban Riverfront Corridor", heightM: 25 },
      { name: "Narendra Modi Stadium", type: "132,000 Capacity Stadium", heightM: 50 },
      { name: "Sabarmati Ashram", type: "National Freedom Memorial", heightM: 10 }
    ],
    terrain: "Sabarmati River basin, semi-arid central Gujarat plains"
  },
  {
    id: "kochi",
    name: "Kochi",
    hindiName: "कोच्चि",
    state: "Kerala",
    region: "South",
    type: "Queen of the Arabian Sea",
    lat: 9.9656,
    lng: 76.2425,
    elevationM: 3,
    cameraHeightM: 1400,
    pitchDeg: -45,
    headingDeg: 310,
    highlight: "Kerala tranquil backwaters, Chinese fishing nets, spice trading ports, and colonial Fort Kochi.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@9.9656,76.2425,3a,1400d,35y,310h,55t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Fort+Kochi+Chinese+Fishing+Nets&t=k&z=16&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Chinese Fishing Nets", type: "Historic Shore Cantilever Nets", heightM: 12 },
      { name: "Fort Kochi", type: "Colonial Portuguese & Dutch Quarter", heightM: 20 },
      { name: "Vembanad Backwaters", type: "Serene Palm-fringed Lagoon", heightM: 2 }
    ],
    terrain: "Malabar coastal lagoons, estuarine mangrove islands"
  },
  {
    id: "kanyakumari",
    name: "Kanyakumari",
    hindiName: "कन्याकुमारी",
    state: "Tamil Nadu",
    region: "South",
    type: "Triveni Sangam of Three Oceans",
    lat: 8.0780,
    lng: 77.5550,
    elevationM: 2,
    cameraHeightM: 1200,
    pitchDeg: -45,
    headingDeg: 180,
    highlight: "Southernmost tip of the Indian subcontinent where the Indian Ocean, Arabian Sea, and Bay of Bengal converge.",
    image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80",
    googleEarthUrl: "https://earth.google.com/web/@8.0780,77.5550,2a,1200d,35y,180h,60t,0r",
    googleMapsEmbed: "https://maps.google.com/maps?q=Vivekananda+Rock+Memorial+Kanyakumari&t=k&z=16&ie=UTF8&iwloc=&output=embed",
    monuments: [
      { name: "Vivekananda Rock Memorial", type: "Sacred Sea Island Shrine", heightM: 30 },
      { name: "Thiruvalluvar Statue", type: "133-foot Monolithic Stone Colossus", heightM: 41 },
      { name: "Cape Comorin", type: "Confluence of Three Oceans", heightM: 5 }
    ],
    terrain: "Rocky coastline meeting the convergence of three vast oceanic bodies"
  }
];

export const ALL_INDIAN_STATES_UTS = [
  // 28 States
  { name: "Andhra Pradesh", capital: "Amaravati", lat: 16.5062, lng: 80.6480, region: "South", highlight: "Long eastern coastline, Tirupati Venkateswara, Krishna-Godavari Delta, and ISRO Sriharikota Spaceport (SDSC SHAR)." },
  { name: "Arunachal Pradesh", capital: "Itanagar", lat: 27.0844, lng: 93.6053, region: "North-East", highlight: "Land of the Dawn-lit Mountains, Tawang Monastery, and virgin Eastern Himalayan peaks." },
  { name: "Assam", capital: "Dispur (Guwahati)", lat: 26.1445, lng: 91.7362, region: "North-East", highlight: "Mighty Brahmaputra river valley, Kaziranga one-horned rhinoceros sanctuary, and lush Assam tea plantations." },
  { name: "Bihar", capital: "Patna", lat: 25.5941, lng: 85.1376, region: "East", highlight: "Ancient seat of Magadha, Nalanda University world heritage ruins, and Bodh Gaya Mahabodhi Tree." },
  { name: "Chhattisgarh", capital: "Raipur", lat: 21.2514, lng: 81.6296, region: "Central", highlight: "Chitrakote Falls (the Niagara of India), dense sal forests, and mineral-rich plateau." },
  { name: "Goa", capital: "Panaji", lat: 15.4909, lng: 73.8278, region: "West", highlight: "Pristine golden Arabian beaches, Dudhsagar cascading waterfalls, and UNESCO Portuguese basilicas." },
  { name: "Gujarat", capital: "Gandhinagar", lat: 23.2156, lng: 72.6369, region: "West", highlight: "Statue of Unity (world's tallest at 182m), Rann of Kutch white salt desert, and Asiatic lions in Gir." },
  { name: "Haryana", capital: "Chandigarh", lat: 30.7333, lng: 76.7794, region: "North", highlight: "Historic Kurukshetra battlefield, bustling Cyber City Gurugram, and agricultural powerhouse." },
  { name: "Himachal Pradesh", capital: "Shimla", lat: 31.1048, lng: 77.1734, region: "North", highlight: "Majestic snow-capped Dhauladhar ranges, Rohtang Pass, Spiti cold desert, and apple valleys." },
  { name: "Jharkhand", capital: "Ranchi", lat: 23.3441, lng: 85.3096, region: "East", highlight: "Land of forests, Chota Nagpur plateau, and spectacular waterfalls (Hundru, Dassam, Jonha)." },
  { name: "Karnataka", capital: "Bengaluru", lat: 12.9716, lng: 77.5946, region: "South", highlight: "Hampi UNESCO boulder ruins, Western Ghats biodiversity, coffee estates of Coorg, and ISRO HQ." },
  { name: "Kerala", capital: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366, region: "South", highlight: "God's Own Country, emerald Vembanad backwaters, Munnar tea hills, and Ayurvedic wellness heritage." },
  { name: "Madhya Pradesh", capital: "Bhopal", lat: 23.2599, lng: 77.4126, region: "Central", highlight: "The Heart of India, Khajuraho erotic temples, Sanchi Buddhist stupa, and Kanha tiger reserves." },
  { name: "Maharashtra", capital: "Mumbai", lat: 19.0760, lng: 72.8777, region: "West", highlight: "Ajanta & Ellora cave wonders, Shivaji Maharaj's Sahyadri hill forts, and India's economic engine." },
  { name: "Manipur", capital: "Imphal", lat: 24.8170, lng: 93.9368, region: "North-East", highlight: "Jeweled land with floating Loktak Lake, Keibul Lamjao national park, and classical Manipuri dance." },
  { name: "Meghalaya", capital: "Shillong", lat: 25.5788, lng: 91.8933, region: "North-East", highlight: "Abode of Clouds, living bio-engineered root bridges of Cherrapunji, and crystal Dawki river." },
  { name: "Mizoram", capital: "Aizawl", lat: 23.7271, lng: 92.7176, region: "North-East", highlight: "Land of rolling blue hills, bamboo forests, vibrant tribal customs, and high elevation ridge settlements." },
  { name: "Nagaland", capital: "Kohima", lat: 25.6751, lng: 94.1086, region: "North-East", highlight: "Land of Festivals, Hornbill celebrations, dramatic Dzukou Valley, and rich warrior Naga traditions." },
  { name: "Odisha", capital: "Bhubaneswar", lat: 20.2961, lng: 85.8245, region: "East", highlight: "Konark Sun Temple stone chariot, holy Puri Jagannath, Chilika lagoon, and rocket launch at Chandipur." },
  { name: "Punjab", capital: "Chandigarh", lat: 31.1471, lng: 75.3412, region: "North", highlight: "Land of Five Rivers, Golden Temple spiritual bliss, Bhangra beats, and golden wheat breadbasket." },
  { name: "Rajasthan", capital: "Jaipur", lat: 26.9124, lng: 75.7873, region: "West", highlight: "The Golden Thar desert, Jaisalmer fort, Udaipur Lake Palace, and indomitable Rajput valor." },
  { name: "Sikkim", capital: "Gangtok", lat: 27.3389, lng: 88.6065, region: "North-East", highlight: "Kanchenjunga (world's 3rd highest peak), sacred Gurudongmar Lake, and 100% organic farming paradise." },
  { name: "Tamil Nadu", capital: "Chennai", lat: 13.0827, lng: 80.2707, region: "South", highlight: "Thanjavur Brihadeeswara Big Temple, Madurai Meenakshi, Nilgiri hills, and ancient classical Tamil literature." },
  { name: "Telangana", capital: "Hyderabad", lat: 17.3850, lng: 78.4867, region: "South", highlight: "Ramappa UNESCO temple, Kakatiya Warangal fort, Charminar, and world-class Hyderabad tech hub." },
  { name: "Tripura", capital: "Agartala", lat: 23.8315, lng: 91.2868, region: "North-East", highlight: "Ujjayanta royal palace, Neermahal floating water citadel, and ancient rock carvings of Unakoti." },
  { name: "Uttar Pradesh", capital: "Lucknow", lat: 26.8467, lng: 80.9462, region: "North", highlight: "Taj Mahal, sacred Kashi Varanasi ghats, Ayodhya Ram Mandir, and Sangam confluence at Prayagraj." },
  { name: "Uttarakhand", capital: "Dehradun", lat: 30.3165, lng: 78.0322, region: "North", highlight: "Devbhoomi (Land of Gods), Nanda Devi, Kedarnath & Badrinath shrines, and Rishikesh yoga capital." },
  { name: "West Bengal", capital: "Kolkata", lat: 22.5726, lng: 88.3639, region: "East", highlight: "Sundarbans Royal Bengal tiger mangroves, Darjeeling tea toy train, and vibrant Durga Puja celebrations." },

  // 8 Union Territories
  { name: "Andaman and Nicobar Islands", capital: "Port Blair", lat: 11.6234, lng: 92.7265, region: "Islands", highlight: "Pristine turquoise Bay of Bengal atolls, Radhanagar beach, coral reefs, and historic Cellular Jail." },
  { name: "Chandigarh", capital: "Chandigarh", lat: 30.7333, lng: 76.7794, region: "North", highlight: "Le Corbusier modernist planned city, famous Rock Garden, and serene Sukhna Lake." },
  { name: "Dadra and Nagar Haveli and Daman and Diu", capital: "Daman", lat: 20.3974, lng: 72.8328, region: "West", highlight: "Portuguese sea-facing bastions of Daman and Diu, Arabian Sea coastal breezes." },
  { name: "Delhi (NCT)", capital: "New Delhi", lat: 28.6139, lng: 77.2090, region: "North", highlight: "National Capital Territory, Red Fort, Rajpath Kartavya Path, and Parliament of India." },
  { name: "Jammu and Kashmir", capital: "Srinagar / Jammu", lat: 34.0837, lng: 74.7973, region: "North", highlight: "Dal Lake shikaras, Gulmarg alpine ski slopes, and holy Vaishno Devi mountain shrine." },
  { name: "Ladakh", capital: "Leh", lat: 34.1526, lng: 77.5771, region: "North", highlight: "Pangong Tso high-altitude lake, Khardung La pass, Nubra Valley sand dunes, and Buddhist monasteries." },
  { name: "Lakshadweep", capital: "Kavaratti", lat: 10.5667, lng: 72.6417, region: "Islands", highlight: "Exotic Arabian Sea coral atolls, crystal turquoise lagoons, and untouched marine bio-reserves." },
  { name: "Puducherry", capital: "Pondicherry", lat: 11.9416, lng: 79.8083, region: "South", highlight: "French colonial boulevard, Promenade Beach, and the universal township of Auroville Matrimandir." }
];

export const SPACE_SATELLITES = [
  {
    name: "Chandrayaan-3 Propulsion Module",
    orbitRadius: 1.35,
    speed: 0.008,
    inclination: 0.35,
    color: "#ff9933",
    description: "Historic lunar explorer returning signals to Indian Space Science Data Centre (ISSDC)."
  },
  {
    name: "Aditya-L1 Solar Monitor",
    orbitRadius: 1.6,
    speed: 0.005,
    inclination: 0.1,
    color: "#ffd700",
    description: "Sun-observing spacecraft continuously monitoring solar flares and coronal mass ejections."
  },
  {
    name: "NavIC (IRNSS-1I)",
    orbitRadius: 1.45,
    speed: 0.007,
    inclination: 0.5,
    color: "#00e5ff",
    description: "India's indigenous satellite navigation constellation providing high-precision positioning."
  },
  {
    name: "Gaganyaan Orbital Testbed",
    orbitRadius: 1.2,
    speed: 0.012,
    inclination: 0.65,
    color: "#138808",
    description: "Paving the path for India's upcoming crewed human spaceflight missions."
  }
];

