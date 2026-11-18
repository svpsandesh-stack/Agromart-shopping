/* =====================================
   AGROMART - AGRICULTURE E-COMMERCE
   FRONTEND JAVASCRIPT
===================================== */

// 1. PRODUCT DATABASE (DEMO)

const PRODUCTS = [
  {id:1,name:"Rice Seeds",category:"Seeds",price:80,unit:"kg",stock:100,emoji:"🌾"},
  {id:2,name:"Wheat Seeds",category:"Seeds",price:65,unit:"kg",stock:100,emoji:"🌾"},
  {id:3,name:"Maize Seeds",category:"Seeds",price:90,unit:"kg",stock:80,emoji:"🌽"},
  {id:4,name:"Tomato Seeds",category:"Seeds",price:120,unit:"packet",stock:50,emoji:"🍅"},
  {id:5,name:"Chilli Seeds",category:"Seeds",price:150,unit:"packet",stock:50,emoji:"🌶️"},
  {id:6,name:"Cotton Seeds",category:"Seeds",price:180,unit:"kg",stock:70,emoji:"🌱"},

  {id:7,name:"Urea Fertilizer",category:"Fertilizers",price:270,unit:"bag",stock:100,emoji:"🧪"},
  {id:8,name:"DAP Fertilizer",category:"Fertilizers",price:450,unit:"bag",stock:80,emoji:"🌿"},
  {id:9,name:"NPK Fertilizer",category:"Fertilizers",price:350,unit:"kg",stock:100,emoji:"🌱"},
  {id:10,name:"Organic Manure",category:"Fertilizers",price:150,unit:"bag",stock:60,emoji:"🌿"},
  {id:11,name:"Neem Cake",category:"Fertilizers",price:180,unit:"kg",stock:70,emoji:"🍃"},

  {id:12,name:"Neem Oil",category:"Pesticides",price:200,unit:"litre",stock:50,emoji:"🍃"},
  {id:13,name:"Bio Pesticide",category:"Pesticides",price:250,unit:"litre",stock:50,emoji:"🧴"},
  {id:14,name:"Plant Fungicide",category:"Pesticides",price:300,unit:"kg",stock:40,emoji:"🧪"},
  {id:15,name:"Insect Control",category:"Pesticides",price:280,unit:"litre",stock:40,emoji:"🌱"},

  {id:16,name:"Garden Soil",category:"Soil & Manure",price:100,unit:"bag",stock:80,emoji:"🪴"},
  {id:17,name:"Cocopeat",category:"Soil & Manure",price:120,unit:"block",stock:60,emoji:"🌱"},

  {id:18,name:"Water Sprayer",category:"Farming Tools",price:350,unit:"piece",stock:30,emoji:"🚿"},
  {id:19,name:"Drip Irrigation Kit",category:"Irrigation",price:450,unit:"kit",stock:25,emoji:"💧"}
];

// 2. STORE INFORMATION

const SHOP_NAME = "AgroMart";
const STORE_LAT = 13.2563;
const STORE_LON = 76.4770;
const DELIVERY_RATE = 3;

// 3. LOAD SAVED DATA

let cart = JSON.parse(localStorage.getItem("agromart_cart") || "[]");
let currentUser = JSON.parse(localStorage.getItem("agromart_user") || "null");
let selectedCategory = "All";
let selectedProduct = null;

// 4. HTML ELEMENTS

const get = id => document.getElementById(id);

function saveCart() {
  localStorage.setItem("agromart_cart", JSON.stringify(cart));
}

function showToast(message) {
  const toast = get("toast");

  if (toast) {
    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
      toast.style.display = "none";
    }, 2500);
  } else {
    alert(message);
  }
}

// 5. DISPLAY PRODUCTS

function displayProducts(list = PRODUCTS) {
  const container = get("products");
  if (!container) return;

  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">${product.emoji}</div>
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <h4>₹${product.price.toFixed(2)} / ${product.unit}</h4>
      <p>Stock: ${product.stock} ${product.unit}</p>
      <button class="view-btn">View Details</button>
      <button class="add-btn">Add to Cart</button>
    `;

    card.querySelector(".view-btn").onclick = () => {
      showProductDetails(product.id);
    };

    card.querySelector(".add-btn").onclick = () => {
      addToCart(product.id);
    };

    container.appendChild(card);
  });
}

// 6. SEARCH PRODUCTS

function searchProducts(keyword) {
  const search = keyword.trim().toLowerCase();

  const results = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(search) ||
    product.category.toLowerCase().includes(search)
  );

  displayProducts(results);
}

if (get("searchForm")) {
  get("searchForm").addEventListener("submit", event => {
    event.preventDefault();
    searchProducts(get("search")?.value || "");
  });
}

// 7. PRODUCT CATEGORIES

function filterCategory(category) {
  selectedCategory = category;

  if (category === "All") {
    displayProducts(PRODUCTS);
  } else {
    displayProducts(
      PRODUCTS.filter(p => p.category === category)
    );
  }
}

function createCategoryButtons() {
  const container = get("cats");
  if (!container) return;

  const categories = [
    "All",
    "Seeds",
    "Fertilizers",
    "Pesticides",
    "Farming Tools",
    "Soil & Manure",
    "Irrigation"
  ];

  container.innerHTML = "";

  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category;

    button.onclick = () => filterCategory(category);

    container.appendChild(button);
  });
}

// 8. PRODUCT DETAILS

function showProductDetails(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  selectedProduct = product;

  const detail = get("detail");

  if (detail) {
    detail.innerHTML = `
      <h2>${product.emoji} ${product.name}</h2>
      <p>Category: ${product.category}</p>
      <p>Price: ₹${product.price} per ${product.unit}</p>
      <p>Available Stock: ${product.stock}</p>
      <label>Quantity:</label>
      <input type="number" id="detailQty"
        value="1" min="1" max="${product.stock}">
      <button id="detailAdd">Add to Cart</button>
    `;

    detail.style.display = "block";

    get("detailAdd").onclick = () => {
      const qty = Number(get("detailQty").value);

      if (!Number.isInteger(qty) || qty < 1 || qty > product.stock) {
        showToast("Enter a valid quantity.");
        return;
      }

      addToCart(product.id, qty);
    };
  }
}

// 9. ADD PRODUCTS TO CART

function addToCart(id, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  const total = (existing ? existing.quantity : 0) + quantity;

  if (total > product.stock) {
    showToast("Sorry, insufficient stock.");
    return;
  }

  if (existing) {
    existing.quantity = total;
  } else {
    cart.push({
      id: product.id,
      quantity: quantity
    });
  }

  saveCart();
  updateCart();
  showToast("Product added to cart!");
}

// 10. UPDATE CART

function updateCart() {
  const container = get("cart");
  let totalItems = 0;
  let subtotal = 0;

  if (container) container.innerHTML = "";

  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;

    totalItems += item.quantity;
    const amount = product.price * item.quantity;
    subtotal += amount;

    if (container) {
      const row = document.createElement("div");

      row.innerHTML = `
        <h3>${product.name}</h3>
        <p>₹${product.price} × ${item.quantity} = ₹${amount.toFixed(2)}</p>
        <button class="minus">-</button>
        <span>${item.quantity}</span>
        <button class="plus">+</button>
        <button class="remove">Remove</button>
      `;

      row.querySelector(".minus").onclick = () =>
        changeQuantity(item.id, -1);

      row.querySelector(".plus").onclick = () =>
        changeQuantity(item.id, 1);

      row.querySelector(".remove").onclick = () =>
        removeFromCart(item.id);

      container.appendChild(row);
    }
  });

  if (get("cartCount")) {
    get("cartCount").textContent = totalItems;
  }

  if (get("cartTotal")) {
    get("cartTotal").textContent = "₹" + subtotal.toFixed(2);
  }
}

// 11. CHANGE QUANTITY

function changeQuantity(id, change) {
  const item = cart.find(p => p.id === id);
  const product = PRODUCTS.find(p => p.id === id);

  if (!item || !product) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  } else if (item.quantity > product.stock) {
    item.quantity = product.stock;
    showToast("Maximum available stock reached.");
  }

  saveCart();
  updateCart();
}

// 12. REMOVE PRODUCT

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCart();
  showToast("Product removed.");
}

// 13. CALCULATE DELIVERY DISTANCE

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 14. CUSTOMER LOGIN

function loginCustomer() {
  const name = prompt("Enter your full name:");
  if (!name || !name.trim()) return false;

  const phone = prompt("Enter your mobile number:");

  if (!phone || !/^[6-9]\d{9}$/.test(phone.trim())) {
    showToast("Enter a valid 10-digit mobile number.");
    return false;
  }

  currentUser = {
    name: name.trim(),
    phone: phone.trim()
  };

  localStorage.setItem(
    "agromart_user",
    JSON.stringify(currentUser)
  );

  if (get("userLabel")) {
    get("userLabel").textContent = currentUser.name;
  }

  showToast("Login successful!");
  return true;
}

// 15. CHECKOUT

async function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  if (!currentUser && !loginCustomer()) return;

  const address = prompt("Enter your complete delivery address:");
  if (!address || !address.trim()) return;

  let distance = 0;
  let deliveryCharge = 0;

  // Browser location is used as a demo origin.
  // Actual delivery-address geocoding needs a backend.

  if (navigator.geolocation) {
    distance = await new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve(
            calculateDistance(
              STORE_LAT,
              STORE_LON,
              position.coords.latitude,
              position.coords.longitude
            )
          );
        },
        () => resolve(0),
        { timeout: 8000 }
      );
    });
  }

  deliveryCharge = distance * DELIVERY_RATE;

  const subtotal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const total = subtotal + deliveryCharge;

  const payment = prompt(
    "Select Payment Method:\n1. UPI\n2. Debit/Credit Card\n3. Cash on Delivery"
  );

  const paymentMethods = {
    "1": "UPI",
    "2": "Debit/Credit Card",
    "3": "Cash on Delivery"
  };

  if (!paymentMethods[payment]) {
    showToast("Invalid payment method.");
    return;
  }

  if (payment !== "3") {
    showToast("Online payment gateway will be connected through backend.");
    return;
  }

  // COD demo order confirmation

  const order = {
    id: "AGRO" + Date.now(),
    customer: currentUser.name,
    phone: currentUser.phone,
    address: address.trim(),
    products: cart.map(item => {
      const p = PRODUCTS.find(product => product.id === item.id);
      return {
        name: p.name,
        quantity: item.quantity,
        price: p.price
      };
    }),
    subtotal: subtotal,
    distance: distance,
    deliveryCharge: deliveryCharge,
    total: total,
    payment: paymentMethods[payment],
    date: new Date().toLocaleString(),
    status: "Order Confirmed"
  };

  const orders = JSON.parse(
    localStorage.getItem("agromart_orders") || "[]"
  );

  orders.push(order);

  localStorage.setItem(
    "agromart_orders",
    JSON.stringify(orders)
  );

  showInvoice(order);

  cart = [];
  saveCart();
  updateCart();

}

// 16. ORDER INVOICE

function showInvoice(order) {
  const invoice = get("invoice");
  if (!invoice) {
    alert("Order Confirmed!\nOrder ID: " + order.id);
    return;
  }

  invoice.innerHTML = `
    <h2>🌾 AgroMart</h2>
    <h3>Order Confirmed!</h3>
    <p>Order ID: ${order.id}</p>
    <p>Customer: ${order.customer}</p>
    <p>Phone: ${order.phone}</p>
    <p>Address: ${order.address}</p>
    <p>Order Date: ${order.date}</p>
    <h4>Products</h4>
    ${order.products.map(p =>
      `<p>${p.name} × ${p.quantity} = ₹${p.price * p.quantity}</p>`
    ).join("")}
    <p>Subtotal: ₹${order.subtotal.toFixed(2)}</p>
    <p>Distance: ${order.distance.toFixed(2)} km (estimated)</p>
    <p>Delivery Charge: ₹${order.deliveryCharge.toFixed(2)}</p>
    <h3>Total: ₹${order.total.toFixed(2)}</h3>
    <p>Payment: ${order.payment}</p>
    <p>Status: ${order.status}</p>
    <p>Expected delivery: Please confirm with the seller.</p>
  `;

  invoice.style.display = "block";
}

// 17. LOGOUT

function logoutCustomer() {
  currentUser = null;
  localStorage.removeItem("agromart_user");

  if (get("userLabel")) {
    get("userLabel").textContent = "Login";
  }

  showToast("Logged out successfully.");
}

// 18. INITIALIZE WEBSITE

document.addEventListener("DOMContentLoaded", () => {

  createCategoryButtons();
  displayProducts();
  updateCart();

  if (currentUser && get("userLabel")) {
    get("userLabel").textContent = currentUser.name;
  }

  if (get("checkout")) {
    get("checkout").addEventListener("click", checkout);
  }

  if (get("sort")) {
    get("sort").addEventListener("change", event => {
      const sorted = [...PRODUCTS];

      if (event.target.value === "low") {
        sorted.sort((a, b) => a.price - b.price);
      } else if (event.target.value === "high") {
        sorted.sort((a, b) => b.price - a.price);
      }

      displayProducts(sorted);
    });
     /* =====================================
   AGROMART - AGRICULTURE E-COMMERCE
   FRONTEND JAVASCRIPT
===================================== */

// 1. PRODUCT DATABASE (DEMO)

const PRODUCTS = [
  {id:1,name:"Rice Seeds",category:"Seeds",price:80,unit:"kg",stock:100,emoji:"🌾"},
  {id:2,name:"Wheat Seeds",category:"Seeds",price:65,unit:"kg",stock:100,emoji:"🌾"},
  {id:3,name:"Maize Seeds",category:"Seeds",price:90,unit:"kg",stock:80,emoji:"🌽"},
  {id:4,name:"Tomato Seeds",category:"Seeds",price:120,unit:"packet",stock:50,emoji:"🍅"},
  {id:5,name:"Chilli Seeds",category:"Seeds",price:150,unit:"packet",stock:50,emoji:"🌶️"},
  {id:6,name:"Cotton Seeds",category:"Seeds",price:180,unit:"kg",stock:70,emoji:"🌱"},

  {id:7,name:"Urea Fertilizer",category:"Fertilizers",price:270,unit:"bag",stock:100,emoji:"🧪"},
  {id:8,name:"DAP Fertilizer",category:"Fertilizers",price:450,unit:"bag",stock:80,emoji:"🌿"},
  {id:9,name:"NPK Fertilizer",category:"Fertilizers",price:350,unit:"kg",stock:100,emoji:"🌱"},
  {id:10,name:"Organic Manure",category:"Fertilizers",price:150,unit:"bag",stock:60,emoji:"🌿"},
  {id:11,name:"Neem Cake",category:"Fertilizers",price:180,unit:"kg",stock:70,emoji:"🍃"},

  {id:12,name:"Neem Oil",category:"Pesticides",price:200,unit:"litre",stock:50,emoji:"🍃"},
  {id:13,name:"Bio Pesticide",category:"Pesticides",price:250,unit:"litre",stock:50,emoji:"🧴"},
  {id:14,name:"Plant Fungicide",category:"Pesticides",price:300,unit:"kg",stock:40,emoji:"🧪"},
  {id:15,name:"Insect Control",category:"Pesticides",price:280,unit:"litre",stock:40,emoji:"🌱"},

  {id:16,name:"Garden Soil",category:"Soil & Manure",price:100,unit:"bag",stock:80,emoji:"🪴"},
  {id:17,name:"Cocopeat",category:"Soil & Manure",price:120,unit:"block",stock:60,emoji:"🌱"},

  {id:18,name:"Water Sprayer",category:"Farming Tools",price:350,unit:"piece",stock:30,emoji:"🚿"},
  {id:19,name:"Drip Irrigation Kit",category:"Irrigation",price:450,unit:"kit",stock:25,emoji:"💧"}
];

// 2. STORE INFORMATION

const SHOP_NAME = "AgroMart";
const STORE_LAT = 13.2563;
const STORE_LON = 76.4770;
const DELIVERY_RATE = 3;

// 3. LOAD SAVED DATA

let cart = JSON.parse(localStorage.getItem("agromart_cart") || "[]");
let currentUser = JSON.parse(localStorage.getItem("agromart_user") || "null");
let selectedCategory = "All";
let selectedProduct = null;

// 4. HTML ELEMENTS

const get = id => document.getElementById(id);

function saveCart() {
  localStorage.setItem("agromart_cart", JSON.stringify(cart));
}

function showToast(message) {
  const toast = get("toast");

  if (toast) {
    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
      toast.style.display = "none";
    }, 2500);
  } else {
    alert(message);
  }
}

// 5. DISPLAY PRODUCTS

function displayProducts(list = PRODUCTS) {
  const container = get("products");
  if (!container) return;

  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">${product.emoji}</div>
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <h4>₹${product.price.toFixed(2)} / ${product.unit}</h4>
      <p>Stock: ${product.stock} ${product.unit}</p>
      <button class="view-btn">View Details</button>
      <button class="add-btn">Add to Cart</button>
    `;

    card.querySelector(".view-btn").onclick = () => {
      showProductDetails(product.id);
    };

    card.querySelector(".add-btn").onclick = () => {
      addToCart(product.id);
    };

    container.appendChild(card);
  });
}

// 6. SEARCH PRODUCTS

function searchProducts(keyword) {
  const search = keyword.trim().toLowerCase();

  const results = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(search) ||
    product.category.toLowerCase().includes(search)
  );

  displayProducts(results);
}

if (get("searchForm")) {
  get("searchForm").addEventListener("submit", event => {
    event.preventDefault();
    searchProducts(get("search")?.value || "");
  });
}

// 7. PRODUCT CATEGORIES

function filterCategory(category) {
  selectedCategory = category;

  if (category === "All") {
    displayProducts(PRODUCTS);
  } else {
    displayProducts(
      PRODUCTS.filter(p => p.category === category)
    );
  }
}

function createCategoryButtons() {
  const container = get("cats");
  if (!container) return;

  const categories = [
    "All",
    "Seeds",
    "Fertilizers",
    "Pesticides",
    "Farming Tools",
    "Soil & Manure",
    "Irrigation"
  ];

  container.innerHTML = "";

  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category;

    button.onclick = () => filterCategory(category);

    container.appendChild(button);
  });
}

// 8. PRODUCT DETAILS

function showProductDetails(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  selectedProduct = product;

  const detail = get("detail");

  if (detail) {
    detail.innerHTML = `
      <h2>${product.emoji} ${product.name}</h2>
      <p>Category: ${product.category}</p>
      <p>Price: ₹${product.price} per ${product.unit}</p>
      <p>Available Stock: ${product.stock}</p>
      <label>Quantity:</label>
      <input type="number" id="detailQty"
        value="1" min="1" max="${product.stock}">
      <button id="detailAdd">Add to Cart</button>
    `;

    detail.style.display = "block";

    get("detailAdd").onclick = () => {
      const qty = Number(get("detailQty").value);

      if (!Number.isInteger(qty) || qty < 1 || qty > product.stock) {
        showToast("Enter a valid quantity.");
        return;
      }

      addToCart(product.id, qty);
    };
  }
}

// 9. ADD PRODUCTS TO CART

function addToCart(id, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  const total = (existing ? existing.quantity : 0) + quantity;

  if (total > product.stock) {
    showToast("Sorry, insufficient stock.");
    return;
  }

  if (existing) {
    existing.quantity = total;
  } else {
    cart.push({
      id: product.id,
      quantity: quantity
    });
  }

  saveCart();
  updateCart();
  showToast("Product added to cart!");
}

// 10. UPDATE CART

function updateCart() {
  const container = get("cart");
  let totalItems = 0;
  let subtotal = 0;

  if (container) container.innerHTML = "";

  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return;

    totalItems += item.quantity;
    const amount = product.price * item.quantity;
    subtotal += amount;

    if (container) {
      const row = document.createElement("div");

      row.innerHTML = `
        <h3>${product.name}</h3>
        <p>₹${product.price} × ${item.quantity} = ₹${amount.toFixed(2)}</p>
        <button class="minus">-</button>
        <span>${item.quantity}</span>
        <button class="plus">+</button>
        <button class="remove">Remove</button>
      `;

      row.querySelector(".minus").onclick = () =>
        changeQuantity(item.id, -1);

      row.querySelector(".plus").onclick = () =>
        changeQuantity(item.id, 1);

      row.querySelector(".remove").onclick = () =>
        removeFromCart(item.id);

      container.appendChild(row);
    }
  });

  if (get("cartCount")) {
    get("cartCount").textContent = totalItems;
  }

  if (get("cartTotal")) {
    get("cartTotal").textContent = "₹" + subtotal.toFixed(2);
  }
}

// 11. CHANGE QUANTITY

function changeQuantity(id, change) {
  const item = cart.find(p => p.id === id);
  const product = PRODUCTS.find(p => p.id === id);

  if (!item || !product) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  } else if (item.quantity > product.stock) {
    item.quantity = product.stock;
    showToast("Maximum available stock reached.");
  }

  saveCart();
  updateCart();
}

// 12. REMOVE PRODUCT

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCart();
  showToast("Product removed.");
}

// 13. CALCULATE DELIVERY DISTANCE

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// 14. CUSTOMER LOGIN

function loginCustomer() {
  const name = prompt("Enter your full name:");
  if (!name || !name.trim()) return false;

  const phone = prompt("Enter your mobile number:");

  if (!phone || !/^[6-9]\d{9}$/.test(phone.trim())) {
    showToast("Enter a valid 10-digit mobile number.");
    return false;
  }

  currentUser = {
    name: name.trim(),
    phone: phone.trim()
  };

  localStorage.setItem(
    "agromart_user",
    JSON.stringify(currentUser)
  );

  if (get("userLabel")) {
    get("userLabel").textContent = currentUser.name;
  }

  showToast("Login successful!");
  return true;
}

// 15. CHECKOUT

async function checkout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  if (!currentUser && !loginCustomer()) return;

  const address = prompt("Enter your complete delivery address:");
  if (!address || !address.trim()) return;

  let distance = 0;
  let deliveryCharge = 0;

  // Browser location is used as a demo origin.
  // Actual delivery-address geocoding needs a backend.

  if (navigator.geolocation) {
    distance = await new Promise(resolve => {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve(
            calculateDistance(
              STORE_LAT,
              STORE_LON,
              position.coords.latitude,
              position.coords.longitude
            )
          );
        },
        () => resolve(0),
        { timeout: 8000 }
      );
    });
  }

  deliveryCharge = distance * DELIVERY_RATE;

  const subtotal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const total = subtotal + deliveryCharge;

  const payment = prompt(
    "Select Payment Method:\n1. UPI\n2. Debit/Credit Card\n3. Cash on Delivery"
  );

  const paymentMethods = {
    "1": "UPI",
    "2": "Debit/Credit Card",
    "3": "Cash on Delivery"
  };

  if (!paymentMethods[payment]) {
    showToast("Invalid payment method.");
    return;
  }

  if (payment !== "3") {
    showToast("Online payment gateway will be connected through backend.");
    return;
  }

  // COD demo order confirmation

  const order = {
    id: "AGRO" + Date.now(),
    customer: currentUser.name,
    phone: currentUser.phone,
    address: address.trim(),
    products: cart.map(item => {
      const p = PRODUCTS.find(product => product.id === item.id);
      return {
        name: p.name,
        quantity: item.quantity,
        price: p.price
      };
    }),
    subtotal: subtotal,
    distance: distance,
    deliveryCharge: deliveryCharge,
    total: total,
    payment: paymentMethods[payment],
    date: new Date().toLocaleString(),
    status: "Order Confirmed"
  };

  const orders = JSON.parse(
    localStorage.getItem("agromart_orders") || "[]"
  );

  orders.push(order);

  localStorage.setItem(
    "agromart_orders",
    JSON.stringify(orders)
  );

  showInvoice(order);

  cart = [];
  saveCart();
  updateCart();

}

// 16. ORDER INVOICE

function showInvoice(order) {
  const invoice = get("invoice");
  if (!invoice) {
    alert("Order Confirmed!\nOrder ID: " + order.id);
    return;
  }

  invoice.innerHTML = `
    <h2>🌾 AgroMart</h2>
    <h3>Order Confirmed!</h3>
    <p>Order ID: ${order.id}</p>
    <p>Customer: ${order.customer}</p>
    <p>Phone: ${order.phone}</p>
    <p>Address: ${order.address}</p>
    <p>Order Date: ${order.date}</p>
    <h4>Products</h4>
    ${order.products.map(p =>
      `<p>${p.name} × ${p.quantity} = ₹${p.price * p.quantity}</p>`
    ).join("")}
    <p>Subtotal: ₹${order.subtotal.toFixed(2)}</p>
    <p>Distance: ${order.distance.toFixed(2)} km (estimated)</p>
    <p>Delivery Charge: ₹${order.deliveryCharge.toFixed(2)}</p>
    <h3>Total: ₹${order.total.toFixed(2)}</h3>
    <p>Payment: ${order.payment}</p>
    <p>Status: ${order.status}</p>
    <p>Expected delivery: Please confirm with the seller.</p>
  `;

  invoice.style.display = "block";
}

// 17. LOGOUT

function logoutCustomer() {
  currentUser = null;
  localStorage.removeItem("agromart_user");

  if (get("userLabel")) {
    get("userLabel").textContent = "Login";
  }

  showToast("Logged out successfully.");
}

// 18. INITIALIZE WEBSITE

document.addEventListener("DOMContentLoaded", () => {

  createCategoryButtons();
  displayProducts();
  updateCart();

  if (currentUser && get("userLabel")) {
    get("userLabel").textContent = currentUser.name;
  }

  if (get("checkout")) {
    get("checkout").addEventListener("click", checkout);
  }

  if (get("sort")) {
    get("sort").addEventListener("change", event => {
      const sorted = [...PRODUCTS];

      if (event.target.value === "low") {
        sorted.sort((a, b) => a.price - b.price);
      } else if (event.target.value === "high") {
        sorted.sort((a, b) => b.price - a.price);
      }

      displayProducts(sorted);
    });
  }

  console.log("AgroMart website loaded successfully!");

});
  }

  console.log("AgroMart website loaded successfully!");

});
