/* ==========================================
   AGROMART - MAIN APPLICATION
   FRONTEND JAVASCRIPT
========================================== */

// 1. APPLICATION SETTINGS

const SHOP_NAME = "AgroMart";

let cartItems = JSON.parse(
    localStorage.getItem("agromart_cart") || "[]"
);

let currentUser = JSON.parse(
    localStorage.getItem("agromart_user") || "null"
);

let selectedProduct = null;
let pendingOrder = null;
let selectedCategory = "All";

// 2. HELPER FUNCTIONS

function getElement(id) {
    return document.getElementById(id);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function saveCart() {
    localStorage.setItem(
        "agromart_cart",
        JSON.stringify(cartItems)
    );
}

function showToast(message) {
    const toast = getElement("toast");

    if (!toast) {
        alert(message);
        return;
    }

    toast.textContent = message;
    toast.hidden = false;

    clearTimeout(window.agroToastTimer);

    window.agroToastTimer = setTimeout(() => {
        toast.hidden = true;
    }, 2500);
}

// 3. PAGE NAVIGATION

function showView(viewId) {
    document.querySelectorAll(".view").forEach(section => {
        section.hidden = section.id !== viewId;
    });

    window.scrollTo(0, 0);
}

function home() {
    showView("home");
    displayProducts();
}

function cartPage() {
    renderCart();
    showView("cart");
}

function account() {
    renderAccount();
    showView("account");
}

// 4. DISPLAY PRODUCTS

function displayProducts(list = PRODUCTS) {
    const container = getElement("products");

    if (!container) return;

    container.innerHTML = "";

    if (list.length === 0) {
        getElement("empty").hidden = false;
        return;
    }

    getElement("empty").hidden = true;

    list.forEach(product => {
        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                ${escapeHTML(product.emoji || "🌱")}
            </div>

            <h3>${escapeHTML(product.name)}</h3>

            <p>${escapeHTML(product.category)}</p>

            <h3>
                ₹${Number(product.price).toFixed(2)}
                / ${escapeHTML(product.unit)}
            </h3>

            <small>
                Stock: ${Number(product.stock)}
                ${escapeHTML(product.unit)}
            </small>

            <button class="view-product">
                View Details
            </button>

            <button class="add-product">
                Add to Cart
            </button>
        `;

        card.querySelector(".view-product").onclick = () => {
            productDetails(product.id);
        };

        card.querySelector(".add-product").onclick = () => {
            addToCart(product.id);
        };

        container.appendChild(card);
    });

    if (getElement("heading")) {
        getElement("heading").textContent =
            selectedCategory === "All"
                ? "All products"
                : selectedCategory;
    }

    if (getElement("count")) {
        getElement("count").textContent =
            `${list.length} products available`;
    }
}

// 5. DISPLAY CATEGORIES

function displayCategories() {
    const container = getElement("cats");

    if (!container) return;

    const categories = [
        "All",
        ...new Set(PRODUCTS.map(p => p.category))
    ];

    container.innerHTML = "";

    categories.forEach(category => {
        const button = document.createElement("button");

        button.textContent = category;

        button.className =
            category === selectedCategory ? "active" : "";

        button.onclick = () => {
            selectedCategory = category;

            const results = category === "All"
                ? PRODUCTS
                : PRODUCTS.filter(
                    p => p.category === category
                );

            displayCategories();
            displayProducts(results);
        };

        container.appendChild(button);
    });
}

// 6. SEARCH PRODUCTS

function searchProducts(keyword) {
    const search = keyword.trim().toLowerCase();

    const results = PRODUCTS.filter(product =>
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search)
    );

    selectedCategory = "All";
    displayCategories();
    displayProducts(results);

    showView("home");
}

function setupSearch() {
    const form = getElement("searchForm");

    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        searchProducts(
            getElement("search").value
        );
    });
}

// 7. PRODUCT DETAILS

function productDetails(id) {
    const product = PRODUCTS.find(p => p.id === id);

    if (!product) return;

    selectedProduct = product;

    const section = getElement("detail");

    section.innerHTML = `
        <div class="product-details">

            <h2>
                ${escapeHTML(product.emoji || "🌱")}
                ${escapeHTML(product.name)}
            </h2>

            <p>
                Category:
                ${escapeHTML(product.category)}
            </p>

            <h3>
                ₹${Number(product.price).toFixed(2)}
                / ${escapeHTML(product.unit)}
            </h3>

            <p>
                ${escapeHTML(product.description || "")}
            </p>

            <p>
                Available stock:
                ${Number(product.stock)}
                ${escapeHTML(product.unit)}
            </p>

            <label>Quantity:</label>

            <input
                type="number"
                id="productQuantity"
                min="1"
                max="${Number(product.stock)}"
                value="1"
            >

            <button onclick="addSelectedProduct()">
                Add to Cart
            </button>

            <button onclick="home()">
                Continue Shopping
            </button>

        </div>
    `;

    showView("detail");
}

function addSelectedProduct() {
    if (!selectedProduct) return;

    const quantity = Number(
        getElement("productQuantity").value
    );

    if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > selectedProduct.stock
    ) {
        showToast("Please enter a valid quantity.");
        return;
    }

    addToCart(selectedProduct.id, quantity);
}

// 8. ADD TO CART

function addToCart(id, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === id);

    if (!product) return;

    const existing = cartItems.find(
        item => item.id === id
    );

    const currentQuantity = existing
        ? existing.quantity
        : 0;

    if (currentQuantity + quantity > product.stock) {
        showToast("Insufficient stock available.");
        return;
    }

    if (existing) {
        existing.quantity += quantity;
    } else {
        cartItems.push({
            id: id,
            quantity: quantity
        });
    }

    saveCart();
    updateCartCount();

    showToast("Product added to cart!");
}

// 9. UPDATE CART COUNT

function updateCartCount() {
    const count = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const element = getElement("cartCount");

    if (element) {
        element.textContent = count;
    }
}

// 10. DISPLAY CART

function renderCart() {
    const container = getElement("cart");

    if (!container) return;

    if (cartItems.length === 0) {
        container.innerHTML = `
            <h2>Your Shopping Cart</h2>
            <p>Your cart is empty.</p>
            <button onclick="home()">
                Continue Shopping
            </button>
        `;
        return;
    }

    let subtotal = 0;

    let html = `
        <h2>Your Shopping Cart</h2>
    `;

    cartItems.forEach(item => {
        const product = PRODUCTS.find(
            p => p.id === item.id
        );

        if (!product) return;

        const amount = product.price * item.quantity;

        subtotal += amount;

        html += `
            <div class="cart-item">

                <h3>${escapeHTML(product.name)}</h3>

                <p>
                    ₹${Number(product.price).toFixed(2)}
                    × ${item.quantity}
                    = ₹${amount.toFixed(2)}
                </p>

                <button onclick="changeQuantity(${item.id}, -1)">
                    -
                </button>

                <span>${item.quantity}</span>

                <button onclick="changeQuantity(${item.id}, 1)">
                    +
                </button>

                <button onclick="removeFromCart(${item.id})">
                    Remove
                </button>

            </div>
        `;
    });

    html += `
        <hr>

        <h3>Subtotal: ₹${subtotal.toFixed(2)}</h3>

        <p>
            Delivery charge will be calculated
            after address verification.
        </p>

        <button onclick="home()">
            Continue Shopping
        </button>

        <button onclick="startCheckout()">
            Proceed to Checkout
        </button>
    `;

    container.innerHTML = html;
}

// 11. CHANGE QUANTITY

function changeQuantity(id, change) {
    const item = cartItems.find(
        p => p.id === id
    );

    const product = PRODUCTS.find(
        p => p.id === id
    );

    if (!item || !product) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
        removeFromCart(id);
        return;
    }

    if (newQuantity > product.stock) {
        showToast("Maximum stock reached.");
        return;
    }

    item.quantity = newQuantity;

    saveCart();
    updateCartCount();
    renderCart();
}

// 12. REMOVE PRODUCT

function removeFromCart(id) {
    cartItems = cartItems.filter(
        item => item.id !== id
    );

    saveCart();
    updateCartCount();
    renderCart();

    showToast("Product removed.");
}

// 13. CUSTOMER ACCOUNT

function renderAccount() {
    const section = getElement("account");

    if (currentUser) {
        section.innerHTML = `
            <h2>My Account</h2>

            <p>
                Name: ${escapeHTML(currentUser.name)}
            </p>

            <p>
                Mobile: ${escapeHTML(currentUser.phone)}
            </p>

            <button onclick="logoutCustomer()">
                Logout
            </button>

            <button onclick="home()">
                Home
            </button>
        `;

        return;
    }

    section.innerHTML = `
        <h2>Login / Register</h2>

        <form id="loginForm">

            <label>Customer Name</label>

            <input
                type="text"
                id="customerName"
                required
                placeholder="Enter your name"
            >

            <label>Mobile Number</label>

            <input
                type="tel"
                id="customerPhone"
                required
                pattern="[6-9][0-9]{9}"
                maxlength="10"
                placeholder="10-digit mobile number"
            >

            <button type="submit">
                Continue
            </button>

        </form>
    `;

    getElement("loginForm").onsubmit = event => {
        event.preventDefault();

        currentUser = {
            name: getElement("customerName").value.trim(),
            phone: getElement("customerPhone").value.trim()
        };

        localStorage.setItem(
            "agromart_user",
            JSON.stringify(currentUser)
        );

        updateUserLabel();
        showToast("Account saved successfully!");

        renderAccount();
    };
}

function updateUserLabel() {
    const label = getElement("userLabel");

    if (label) {
        label.textContent = currentUser
            ? currentUser.name
            : "Login";
    }
}

function logoutCustomer() {
    currentUser = null;

    localStorage.removeItem("agromart_user");

    updateUserLabel();
    renderAccount();

    showToast("Logged out successfully.");
}

// 14. CHECKOUT

function startCheckout() {
    if (cartItems.length === 0) {
        showToast("Your cart is empty.");
        return;
    }

    if (!currentUser) {
        showToast("Please login before placing your order.");
        account();
        return;
    }

    renderCheckout();
    showView("checkout");
}

function renderCheckout() {
    const section = getElement("checkout");

    let subtotal = 0;

    cartItems.forEach(item => {
        const product = PRODUCTS.find(
            p => p.id === item.id
        );

        if (product) {
            subtotal += product.price * item.quantity;
        }
    });

    section.innerHTML = `
        <h2>Checkout</h2>

        <h3>Customer Details</h3>

        <p>Name: ${escapeHTML(currentUser.name)}</p>

        <p>Mobile: ${escapeHTML(currentUser.phone)}</p>

        <form id="checkoutForm">

            <label>Delivery Address</label>

            <textarea
                id="deliveryAddress"
                required
                placeholder="Enter complete delivery address"
            ></textarea>

            <h3>Order Subtotal</h3>

            <h2>₹${subtotal.toFixed(2)}</h2>

            <p>
                Delivery charge requires address-based
                distance verification by the backend.
            </p>

            <label>Payment Method</label>

            <select id="paymentMethod" required>

                <option value="">Select Payment</option>

                <option value="UPI">UPI</option>

                <option value="Card">
                    Debit / Credit Card
                </option>

                <option value="COD">
                    Cash on Delivery
                </option>

            </select>

            <button type="submit">
                Place Order
            </button>

            <button type="button" onclick="cartPage()">
                Back to Cart
            </button>

        </form>
    `;

    getElement("checkoutForm").onsubmit = event => {
        event.preventDefault();

        const address = getElement(
            "deliveryAddress"
        ).value.trim();

        const payment = getElement(
            "paymentMethod"
        ).value;

        if (!address || !payment) {
            showToast("Complete all checkout details.");
            return;
        }

        if (payment !== "COD") {
            showToast(
                "Online payment gateway will be connected in the backend."
            );
            return;
        }

        pendingOrder = {
            id: "AGRO" + Date.now(),
            customer: currentUser.name,
            phone: currentUser.phone,
            address: address,
            products: cartItems.map(item => {
                const p = PRODUCTS.find(
                    product => product.id === item.id
                );

                return {
                    name: p.name,
                    quantity: item.quantity,
                    price: p.price
                };
            }),
            subtotal: subtotal,
            deliveryCharge: null,
            payment: "Cash on Delivery",
            date: new Date().toLocaleString(),
            status: "Order Confirmed"
        };

        const modal = getElement("modal");

        getElement("modalText").textContent =
            `Confirm your COD order of ₹${subtotal.toFixed(2)}? Delivery charge will be verified separately.`;

        modal.hidden = false;
    };
}

// 15. CONFIRM PURCHASE

function confirmBuy(confirmed) {
    const modal = getElement("modal");

    modal.hidden = true;

    if (!confirmed || !pendingOrder) {
        pendingOrder = null;
        return;
    }

    const orders = JSON.parse(
        localStorage.getItem("agromart_orders") || "[]"
    );

    orders.push(pendingOrder);

    localStorage.setItem(
        "agromart_orders",
        JSON.stringify(orders)
    );

    showInvoice(pendingOrder);

    cartItems = [];

    saveCart();
    updateCartCount();

    pendingOrder = null;
}

// 16. ORDER INVOICE

function showInvoice(order) {
    const section = getElement("invoice");

    const productsHTML = order.products.map(p => `
        <p>
            ${escapeHTML(p.name)}
            × ${p.quantity}
            = ₹${(p.price * p.quantity).toFixed(2)}
        </p>
    `).join("");

    section.innerHTML = `
        <h2>🌱 AgroMart</h2>

        <h2>Order Confirmed!</h2>

        <p>Order ID: ${escapeHTML(order.id)}</p>

        <p>Customer: ${escapeHTML(order.customer)}</p>

        <p>Mobile: ${escapeHTML(order.phone)}</p>

        <p>Address: ${escapeHTML(order.address)}</p>

        <p>Date: ${escapeHTML(order.date)}</p>

        <hr>

        <h3>Ordered Products</h3>

        ${productsHTML}

        <hr>

        <h3>
            Subtotal: ₹${order.subtotal.toFixed(2)}
        </h3>

        <p>
            Delivery charge: To be verified
        </p>

        <p>Payment: Cash on Delivery</p>

        <h3>Status: Order Confirmed</h3>

        <button onclick="home()">
            Continue Shopping
        </button>

        <button onclick="window.print()">
            Print Invoice
        </button>
    `;

    showView("invoice");
}

// 17. SORT PRODUCTS

function setupSorting() {
    const sort = getElement("sort");

    if (!sort) return;

    sort.addEventListener("change", event => {
        const sorted = [...PRODUCTS];

        if (event.target.value === "low") {
            sorted.sort((a, b) => a.price - b.price);
        }

        if (event.target.value === "high") {
            sorted.sort((a, b) => b.price - a.price);
        }

        if (event.target.value === "name") {
            sorted.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        }

        if (event.target.value === "featured") {
            selectedCategory = "All";
            displayCategories();
            displayProducts();
            return;
        }

        selectedCategory = "All";
        displayCategories();
        displayProducts(sorted);
    });
}

// 18. INITIALIZE AGROMART

function initializeAgroMart() {

    if (typeof PRODUCTS === "undefined") {
        console.error("Products database not loaded!");
        showToast("Product database error.");
        return;
    }

    displayCategories();
    displayProducts();

    setupSearch();
    setupSorting();

    updateCartCount();
    updateUserLabel();

    if (getElement("year")) {
        getElement("year").textContent =
            new Date().getFullYear();
    }

    console.log(
        "AgroMart loaded successfully!",
        PRODUCTS.length,
        "products"
    );
}

document.addEventListener(
    "DOMContentLoaded",
    initializeAgroMart
);
