/* =====================================
   AGROMART - PRODUCT DATABASE
===================================== */

const PRODUCTS = [

  // SEEDS
  {
    id: 1,
    name: "Rice Seeds",
    category: "Seeds",
    price: 80,
    unit: "kg",
    stock: 100,
    emoji: "🌾",
    description: "High quality rice seeds for farming."
  },
  {
    id: 2,
    name: "Wheat Seeds",
    category: "Seeds",
    price: 65,
    unit: "kg",
    stock: 100,
    emoji: "🌾",
    description: "Quality wheat seeds."
  },
  {
    id: 3,
    name: "Maize Seeds",
    category: "Seeds",
    price: 90,
    unit: "kg",
    stock: 100,
    emoji: "🌽",
    description: "High yielding maize seeds."
  },
  {
    id: 4,
    name: "Tomato Seeds",
    category: "Seeds",
    price: 120,
    unit: "packet",
    stock: 50,
    emoji: "🍅",
    description: "Quality tomato seeds."
  },
  {
    id: 5,
    name: "Chilli Seeds",
    category: "Seeds",
    price: 150,
    unit: "packet",
    stock: 50,
    emoji: "🌶️",
    description: "Good quality chilli seeds."
  },
  {
    id: 6,
    name: "Cotton Seeds",
    category: "Seeds",
    price: 180,
    unit: "kg",
    stock: 70,
    emoji: "🌱",
    description: "Cotton seeds for agriculture."
  },
  {
    id: 7,
    name: "Groundnut Seeds",
    category: "Seeds",
    price: 110,
    unit: "kg",
    stock: 80,
    emoji: "🥜",
    description: "Groundnut seeds for cultivation."
  },
  {
    id: 8,
    name: "Soybean Seeds",
    category: "Seeds",
    price: 100,
    unit: "kg",
    stock: 80,
    emoji: "🌱",
    description: "Quality soybean seeds."
  },

  // FERTILIZERS
  {
    id: 9,
    name: "Urea Fertilizer",
    category: "Fertilizers",
    price: 270,
    unit: "bag",
    stock: 100,
    emoji: "🧪",
    description: "Nitrogen fertilizer."
  },
  {
    id: 10,
    name: "DAP Fertilizer",
    category: "Fertilizers",
    price: 450,
    unit: "bag",
    stock: 80,
    emoji: "🌿",
    description: "Phosphorus based fertilizer."
  },
  {
    id: 11,
    name: "NPK Fertilizer",
    category: "Fertilizers",
    price: 350,
    unit: "kg",
    stock: 100,
    emoji: "🌱",
    description: "Balanced plant nutrition."
  },
  {
    id: 12,
    name: "Potash Fertilizer",
    category: "Fertilizers",
    price: 300,
    unit: "kg",
    stock: 70,
    emoji: "🌿",
    description: "Potassium fertilizer."
  },
  {
    id: 13,
    name: "Organic Manure",
    category: "Fertilizers",
    price: 150,
    unit: "bag",
    stock: 100,
    emoji: "🍃",
    description: "Organic soil improvement."
  },
  {
    id: 14,
    name: "Vermicompost",
    category: "Fertilizers",
    price: 180,
    unit: "bag",
    stock: 70,
    emoji: "🌱",
    description: "Natural organic manure."
  },
  {
    id: 15,
    name: "Neem Cake",
    category: "Fertilizers",
    price: 180,
    unit: "kg",
    stock: 70,
    emoji: "🍃",
    description: "Neem based organic fertilizer."
  },
  {
    id: 16,
    name: "Bone Meal",
    category: "Fertilizers",
    price: 220,
    unit: "kg",
    stock: 50,
    emoji: "🌿",
    description: "Phosphorus rich soil amendment."
  },

  // PESTICIDES
  {
    id: 17,
    name: "Neem Oil",
    category: "Pesticides",
    price: 200,
    unit: "litre",
    stock: 50,
    emoji: "🍃",
    description: "Neem based pest management product."
  },
  {
    id: 18,
    name: "Bio Pesticide",
    category: "Pesticides",
    price: 250,
    unit: "litre",
    stock: 50,
    emoji: "🧴",
    description: "Biological pest management product."
  },
  {
    id: 19,
    name: "Plant Fungicide",
    category: "Pesticides",
    price: 300,
    unit: "kg",
    stock: 40,
    emoji: "🧪",
    description: "For management of plant fungal diseases."
  },
  {
    id: 20,
    name: "Insect Control",
    category: "Pesticides",
    price: 280,
    unit: "litre",
    stock: 40,
    emoji: "🌱",
    description: "Crop insect management product."
  },

  // SOIL AND MANURE
  {
    id: 21,
    name: "Garden Soil",
    category: "Soil & Manure",
    price: 100,
    unit: "bag",
    stock: 80,
    emoji: "🪴",
    description: "Soil for gardening."
  },
  {
    id: 22,
    name: "Cocopeat",
    category: "Soil & Manure",
    price: 120,
    unit: "block",
    stock: 60,
    emoji: "🌱",
    description: "Growing medium for plants."
  },

  // FARMING TOOLS
  {
    id: 23,
    name: "Water Sprayer",
    category: "Farming Tools",
    price: 350,
    unit: "piece",
    stock: 30,
    emoji: "🚿",
    description: "Sprayer for agricultural use."
  },
  {
    id: 24,
    name: "Garden Hoe",
    category: "Farming Tools",
    price: 250,
    unit: "piece",
    stock: 30,
    emoji: "🔨",
    description: "Tool for soil preparation."
  },

  // IRRIGATION
  {
    id: 25,
    name: "Drip Irrigation Kit",
    category: "Irrigation",
    price: 450,
    unit: "kit",
    stock: 25,
    emoji: "💧",
    description: "Water saving irrigation kit."
  }

];

console.log("AgroMart products loaded:", PRODUCTS.length);
