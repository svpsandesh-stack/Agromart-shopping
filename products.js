// ========================================
// AGROMART PRODUCT DATABASE
// 200 PRODUCTS IN EACH CATEGORY
// TOTAL: 1200 SAMPLE LISTINGS
// ========================================

const CATEGORY_CONFIG = [

    // 1. SEEDS
    {
        name: "Seeds",
        emoji: "🌾",
        base: 45,
        unit: "kg",
        stock: 240,

        items: [
            "Rice Seeds",
            "Wheat Seeds",
            "Maize Seeds",
            "Tomato Seeds",
            "Chilli Seeds",
            "Cotton Seeds",
            "Groundnut Seeds",
            "Soybean Seeds",
            "Onion Seeds",
            "Okra Seeds",
            "Cucumber Seeds",
            "Watermelon Seeds",
            "Sunflower Seeds",
            "Ragi Seeds",
            "Bajra Seeds",
            "Mustard Seeds",
            "Cabbage Seeds",
            "Brinjal Seeds",
            "Carrot Seeds",
            "Beans Seeds"
        ]
    },

    // 2. FERTILIZERS
    {
        name: "Fertilizers",
        emoji: "🧪",
        base: 90,
        unit: "kg",
        stock: 180,

        items: [
            "Urea Fertilizer",
            "DAP Fertilizer",
            "NPK 19:19:19",
            "Potash Fertilizer",
            "Organic Compost",
            "Vermicompost",
            "Neem Cake",
            "Bone Meal",
            "Micronutrient Mix",
            "Zinc Sulphate",
            "Magnesium Sulphate",
            "Bio Fertilizer",
            "Seaweed Granules",
            "Phosphate Fertilizer",
            "Gypsum",
            "Sulphur",
            "Calcium Nitrate",
            "Rock Phosphate",
            "City Compost",
            "Humic Granules"
        ]
    },

    // 3. PESTICIDES
    {
        name: "Pesticides",
        emoji: "🍃",
        base: 110,
        unit: "litre",
        stock: 95,

        items: [
            "Neem Based Plant Care",
            "Bio Insect Control",
            "Copper Fungicide",
            "Yellow Sticky Trap",
            "Blue Sticky Trap",
            "Plant Disease Care",
            "Mite Control",
            "Weed Control",
            "Trichoderma Bio Control",
            "Beauveria Bio Control",
            "Bacillus Bio Control",
            "Fruit Fly Trap",
            "Seed Treatment",
            "Botanical Crop Care",
            "Fungal Disease Care",
            "Insect Monitoring Trap",
            "Bio Larvicide",
            "Plant Protection Soap",
            "Horticulture Oil",
            "Pheromone Trap"
        ]
    },

    // 4. FARMING TOOLS
    {
        name: "Farming Tools",
        emoji: "🛠️",
        base: 75,
        unit: "piece",
        stock: 60,

        items: [
            "Hand Sprayer",
            "Knapsack Sprayer",
            "Garden Hoe",
            "Hand Trowel",
            "Pruning Shear",
            "Harvesting Knife",
            "Seed Dibber",
            "Weeding Fork",
            "Garden Rake",
            "Watering Can",
            "Hand Cultivator",
            "Sickle",
            "Soil Auger",
            "Farming Gloves",
            "Harvest Basket",
            "Measuring Cup",
            "Plant Support",
            "Nursery Tray",
            "Drip Punch Tool",
            "Farm Tool Kit"
        ]
    },

    // 5. SOIL AND MANURE
    {
        name: "Soil & Manure",
        emoji: "🌱",
        base: 35,
        unit: "kg",
        stock: 300,

        items: [
            "Red Soil",
            "Garden Soil",
            "Cocopeat",
            "Vermicompost",
            "Farmyard Manure",
            "Potting Mix",
            "Perlite",
            "Expanded Clay",
            "Leaf Compost",
            "Neem Compost",
            "Coir Pith",
            "Seedling Mix",
            "Mulching Material",
            "Organic Soil Mix",
            "Biochar",
            "Sand Mix",
            "Compost Mix",
            "Raised Bed Mix",
            "Worm Castings",
            "Soil Conditioner"
        ]
    },

    // 6. IRRIGATION
    {
        name: "Irrigation",
        emoji: "💧",
        base: 25,
        unit: "piece",
        stock: 150,

        items: [
            "Drip Pipe",
            "Drip Emitter",
            "Sprinkler Head",
            "Micro Sprinkler",
            "PVC Connector",
            "Filter Unit",
            "Water Timer",
            "Garden Hose",
            "Hose Connector",
            "Venturi Injector",
            "Drip Lateral",
            "Mainline Pipe",
            "End Cap",
            "Irrigation Valve",
            "Mini Sprinkler",
            "Rain Gun",
            "Watering Nozzle",
            "Pipe Clamp",
            "Grommet",
            "Irrigation Starter Kit"
        ]
    }

];

// ========================================
// GENERATE 200 LISTINGS PER CATEGORY
// ========================================

const PRODUCTS = [];

let productId = 1;

CATEGORY_CONFIG.forEach((category, categoryIndex) => {

    for (let i = 0; i < 200; i++) {

        const itemIndex = i % category.items.length;

        const typeNumber =
            Math.floor(i / category.items.length) + 1;

        const productName =
            category.items[itemIndex] +
            (typeNumber > 1 ? " - Type " + typeNumber : "");

        const productPrice =
            category.base +
            (i % 17) * 11 +
            categoryIndex * 7;

        const productStock =
            Math.max(
                0,
                category.stock - (i % 31) * 2
            );

        let packSize;

        if (category.unit === "kg") {

            packSize =
                i % 2 === 0 ? "1 kg pack" : "5 kg pack";

        } else if (category.unit === "litre") {

            packSize =
                i % 2 === 0 ? "1 litre bottle" : "500 ml bottle";

        } else {

            packSize = "1 piece";

        }

        const product = {

            id: productId++,

            name: productName,

            category: category.name,

            emoji: category.emoji,

            price: productPrice,

            unit: category.unit,

            stock: productStock,

            pack: packSize,

            sku:
                "AG" +
                (categoryIndex + 1) +
                "-" +
                (i + 1),

            description:
                "Sample catalogue listing. Check the supplier label and instructions before use."

        };

        PRODUCTS.push(product);

    }

});

// ========================================
// PRODUCT DATABASE COMPLETED
// ========================================

console.log("AgroMart Product Database Loaded");

console.log(
    "Total Products: " + PRODUCTS.length
);

console.log(
    "Total Categories: " + CATEGORY_CONFIG.length
);
