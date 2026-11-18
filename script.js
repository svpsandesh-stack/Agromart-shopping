/* =========================================
   AGROMART - AGRICULTURE E-COMMERCE
   COMPLETE FRONTEND JAVASCRIPT
========================================= */

// 1. PRODUCT DATABASE

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

const STORE_LAT = 13.2563;
const STORE_LON = 76.4770;
const DELIVERY_RATE = 3;

// 3. SAVED DATA

function loadSavedData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (error) {
    return fallback;
  }
}

let cart = loadSavedData("agromart_cart", []);
let currentUser = loadSavedData("agromart_user", null);
let selectedProduct = null;

// 4. COMMON FUNCTIONS

function get(id) {
  return document.getElementById(id);
}

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

// 5. PAGE NAVIGATION

function showPage(pageId) {
  document.querySelectorAll(".view").forEach(section => {
    section.hidden = true;
    section.style.display = "";
  });

  const page = get(pageId);

  if (page) {
    page.hidden = false;
  }

  window.scrollTo(0, 0);
}

function home() {
  showPage("home");
}

// 6. DISPLAY PRODUCTS

function displayProducts(list = PRODUCTS) {
  const container = get("products");
  if (!container) return;

  container.innerHTML = "";

  if (get("count")) {
    get("count").textContent = list.length + " products";
  }

  if (get("empty")) {
    get("empty").hidden = list.length !== 0;
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

// 7. SEARCH PRODUCTS

function searchProducts(keyword) {
  const search = keyword.trim().toLowerCase();

  const results = PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(search) ||
    product.category.toLowerCase().includes(search)
  );

  displayProducts(results);

  if (get("heading")) {
    get("heading").textContent = search
      ? "Search results"
      : "All products";
  }

  showPage("home");
}

// 8. CATEGORY BUTTONS

function filterCategory(category) {
  const results = category === "All"
    ? PRODUCTS
    : PRODUCTS.filter(product => product.category === category);

  displayProducts(results);

  if (get("heading")) {
    get("heading").textContent = category;
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
    "Soil & Manure",
    "Farming Tools",
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

// 9. PRODUCT DETAILS

function showProductDetails(id) {
  const product = PRODUCTS.find(item => item.id === id);
  if (!product) return;

  selectedProduct = product;

  const detail = get("detail");
  if (!detail) return;

  detail.innerHTML = `
    <h2>${product.emoji} ${product.name}</h2>
    <p>Category: ${product.category}</p>
    <h3>Price: ₹${product.price} per ${product.unit}</h3>
    <p>Available stock: ${product.stock} ${product.unit}</p>

    <label for="detailQty">Quantity:</label>
    <input
      type="number"
      id="detailQty"
      value="1"
      min="1"
      max="${product.stock}"
    >

    <button id="detailAdd">Add to Cart</button>
    <button onclick="home()">Continue Shopping</button>
  `;

  showPage("detail");

  get("detailAdd").onclick = () => {
    const quantity = Number(get("detailQty").value);

    if (!Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > product.stock) {
      showToast("Please enter a valid quantity.");
      return;
    }

    addToCart(product.id, quantity);
  };
}
// =========================================
// 10. CUSTOMER LOGIN
// =========================================

function loginCustomer() {
  const name = prompt("Enter your full name:");

  if (!name || !name.trim()) {
    showToast("Login cancelled.");
    return false;
  }

  const phone = prompt("Enter your 10-digit mobile number:");

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

// =========================================
// 11. ACCOUNT PAGE
// =========================================

function account() {
  if (!currentUser) {
    if (!loginCustomer()) return;
  }

  const section = get("account");
  if (!section) return;

  section.innerHTML = `
    <h2>👤 My Account</h2>
    <p>Welcome to AgroMart!</p>
    <p id="accountName"></p>
    <p id="accountPhone"></p>

    <button onclick="home()">Continue Shopping</button>
    <button onclick="logoutCustomer()">Logout</button>
  `;

  get("accountName").textContent =
    "Customer Name: " + currentUser.name;

  get("accountPhone").textContent =
    "Mobile Number: " + currentUser.phone;

  showPage("account");
}

// =========================================
// 12. LOGOUT
// =========================================

function logoutCustomer() {
  currentUser = null;

  localStorage.removeItem("agromart_user");

  if (get("userLabel")) {
    get("userLabel").textContent = "Login";
  }

  showToast("Logged out successfully.");

  showPage("home");
}

// =========================================
// 13. ADD PRODUCT TO CART
// =========================================

function addToCart(id, quantity = 1) {
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) return;

  const existing = cart.find(item => item.id === id);

  const newQuantity =
    (existing ? existing.quantity : 0) + quantity;

  if (newQuantity > product.stock) {
    showToast("Insufficient stock available.");
    return;
  }

  if (existing) {
    existing.quantity = newQuantity;
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

// =========================================
// 14. DISPLAY CART
// =========================================

function updateCart() {
  const container = get("cart");

  let totalItems = 0;
  let subtotal = 0;

  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);

    if (!product) return;

    totalItems += item.quantity;
    subtotal += product.price * item.quantity;
  });

  if (get("cartCount")) {
    get("cartCount").textContent = totalItems;
  }

  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <h2>🛒 My Shopping Cart</h2>
      <p>Your cart is empty.</p>
      <button onclick="home()">Continue Shopping</button>
    `;
    return;
  }

  const itemsHTML = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);

    if (!product) return "";

    const amount = product.price * item.quantity;

    return `
      <div class="product-card">
        <h3>${product.emoji} ${product.name}</h3>
        <p>Price: ₹${product.price} / ${product.unit}</p>
        <p>Amount: ₹${amount.toFixed(2)}</p>

        <button onclick="changeQuantity(${item.id}, -1)">−</button>
        <span>${item.quantity}</span>
        <button onclick="changeQuantity(${item.id}, 1)">+</button>

        <button onclick="removeFromCart(${item.id})">
          Remove
        </button>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <h2>🛒 My Shopping Cart</h2>

    ${itemsHTML}

    <h3>Subtotal: ₹${subtotal.toFixed(2)}</h3>

    <button onclick="home()">Continue Shopping</button>

    <button onclick="checkout()">
      Proceed to Checkout
    </button>
  `;
}

// =========================================
// 15. CART PAGE
// =========================================

function cartPage() {
  updateCart();
  showPage("cart");
}

// =========================================
// 16. CHANGE PRODUCT QUANTITY
// =========================================

function changeQuantity(id, change) {
  const item = cart.find(p => p.id === id);
  const product = PRODUCTS.find(p => p.id === id);

  if (!item || !product) return;

  const newQuantity = item.quantity + change;

  if (newQuantity > product.stock) {
    showToast("Maximum stock reached.");
    return;
  }

  if (newQuantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  } else {
    item.quantity = newQuantity;
  }

  saveCart();
  updateCart();
}

// =========================================
// 17. REMOVE PRODUCT
// =========================================

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);

  saveCart();
  updateCart();

  showToast("Product removed from cart.");
}
// =========================================
// 18. DELIVERY DISTANCE CALCULATION
// =========================================

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(
    Math.sqrt(a),
    Math.sqrt(1 - a)
  );
}

// =========================================
// 19. CHECKOUT
// =========================================

async function checkout() {

  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  if (!currentUser) {
    if (!loginCustomer()) return;
  }

  const address = prompt("Enter your complete delivery address:");

  if (!address || !address.trim()) return;

  let distance = 0;

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

  const subtotal = cart.reduce((sum, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);

    return sum + (
      product ? product.price * item.quantity : 0
    );
  }, 0);

  const deliveryCharge = distance * DELIVERY_RATE;
  const total = subtotal + deliveryCharge;

  const payment = prompt(
    "SELECT PAYMENT METHOD\n\n" +
    "1. UPI\n" +
    "2. Debit / Credit Card\n" +
    "3. Cash on Delivery"
  );

  const methods = {
    "1": "UPI",
    "2": "Debit/Credit Card",
    "3": "Cash on Delivery"
  };

  if (!methods[payment]) {
    showToast("Invalid payment method.");
    return;
  }

  if (payment !== "3") {
    showToast(
      "Online payment requires a payment gateway and backend."
    );
    return;
  }

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
    payment: methods[payment],
    date: new Date().toLocaleString(),
    status: "Order Confirmed"
  };

  const orders = loadSavedData("agromart_orders", []);

  orders.push(order);

  localStorage.setItem(
    "agromart_orders",
    JSON.stringify(orders)
  );

  cart = [];
  saveCart();
  updateCart();

  showInvoice(order);

  showToast("Your order is confirmed!");
}

// =========================================
// 20. ORDER INVOICE
// =========================================

function showInvoice(order) {

  const invoice = get("invoice");

  if (!invoice) {
    alert("Order Confirmed!\nOrder ID: " + order.id);
    return;
  }

  invoice.innerHTML = `
    <h2>🌱 AgroMart</h2>
    <h3>Order Confirmed!</h3>

    <p><b>Order ID:</b> ${order.id}</p>
    <p><b>Customer:</b> ${order.customer}</p>
    <p><b>Phone:</b> ${order.phone}</p>
    <p><b>Address:</b> ${order.address}</p>
    <p><b>Date:</b> ${order.date}</p>

    <h3>Ordered Products</h3>

    ${order.products.map(p => `
      <p>
        ${p.name} × ${p.quantity}
        = ₹${(p.price * p.quantity).toFixed(2)}
      </p>
    `).join("")}

    <hr>

    <p>Subtotal: ₹${order.subtotal.toFixed(2)}</p>
    <p>Estimated distance: ${order.distance.toFixed(2)} km</p>
    <p>Delivery charge: ₹${order.deliveryCharge.toFixed(2)}</p>

    <h2>Total: ₹${order.total.toFixed(2)}</h2>

    <p>Payment: ${order.payment}</p>
    <p>Status: ${order.status}</p>

    <button onclick="window.print()">Print Invoice</button>
    <button onclick="home()">Continue Shopping</button>
  `;

  showPage("invoice");
}

// =========================================
// 21. SORT PRODUCTS
// =========================================

function sortProducts(type) {

  const sorted = [...PRODUCTS];

  if (type === "low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (type === "high") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (type === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  displayProducts(sorted);
}

// =========================================
// 22. INITIALIZE WEBSITE
// =========================================

document.addEventListener("DOMContentLoaded", () => {

  createCategoryButtons();
  displayProducts();
  updateCart();

  if (currentUser && get("userLabel")) {
    get("userLabel").textContent = currentUser.name;
  }

  if (get("searchForm")) {
    get("searchForm").addEventListener("submit", event => {
      event.preventDefault();

      searchProducts(get("search").value);
    });
  }

  if (get("sort")) {
    get("sort").addEventListener("change", event => {
      sortProducts(event.target.value);
    });
  }

  if (get("year")) {
    get("year").textContent = new Date().getFullYear();
  }

  console.log("AgroMart loaded successfully!");
});
