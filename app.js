// ==========================================
// AGROMART MAIN APPLICATION
// ==========================================

const $ = id => document.getElementById(id);

const RATE = 3;

// Demo warehouse location: Tiptur
const WAREHOUSE = {
    lat: 13.2563,
    lon: 76.4770
};

let user = JSON.parse(
    localStorage.getItem("agromartUser") || "null"
);

let cart = JSON.parse(
    localStorage.getItem("agromartCart") || "[]"
);

let category = "All";
let picked = null;
let estimate = null;


// ==========================================
// COMMON FUNCTIONS
// ==========================================

function money(amount) {
    return "₹" + Number(amount).toFixed(2);
}

function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}

function toast(message) {
    $("toast").textContent = message;
    $("toast").classList.add("show");

    setTimeout(() => {
        $("toast").classList.remove("show");
    }, 2300);
}

function views(id) {
    document.querySelectorAll(".view").forEach(v => {
        v.hidden = true;
    });

    $(id).hidden = false;

    window.scrollTo(0, 0);
}

function home() {
    views("home");
}


// ==========================================
// CART COUNT
// ==========================================

function count() {
    $("cartCount").textContent = cart.reduce(
        (sum, item) => sum + item.qty,
        0
    );

    localStorage.setItem(
        "agromartCart",
        JSON.stringify(cart)
    );
}


// ==========================================
// CATEGORY DISPLAY
// ==========================================

function categories() {

    $("nav").innerHTML =
        `<button class="active" onclick="filter('All')">
            All products
        </button>` +

        CATEGORY_CONFIG.map(c => `
            <button onclick="filter('${esc(c.name)}')">
                ${c.emoji} ${esc(c.name)}
            </button>
        `).join("");

    $("cats").innerHTML =
        CATEGORY_CONFIG.map(c => `
            <button class="cat"
                onclick="filter('${esc(c.name)}')">

                <b>${c.emoji}</b>

                ${esc(c.name)}

                <small>200 listings</small>

            </button>
        `).join("");
}


// ==========================================
// PRODUCT CARD
// ==========================================

function card(p) {

    return `
        <article class="card">

            <div class="pic"
                onclick="detail(${p.id})">

                ${p.emoji}

            </div>

            <div class="info">

                <small>${esc(p.category)}</small>

                <h3 onclick="detail(${p.id})">
                    ${esc(p.name)}
                </h3>

                <p class="muted">
                    Stock: ${p.stock} ${p.unit}
                </p>

                <div class="price">
                    ${money(p.price)}
                    <small>/ ${p.unit}</small>
                </div>

                <small>${esc(p.pack)}</small>

                <div class="actions">

                    <button class="light"
                        onclick="detail(${p.id})">
                        Details
                    </button>

                    <button
                        ${p.stock <= 0 ? "disabled" : ""}
                        onclick="buy(${p.id})">
                        Buy now
                    </button>

                </div>

            </div>

        </article>
    `;
}


// ==========================================
// DISPLAY PRODUCTS
// ==========================================

function render(list) {

    let sort = $("sort").value;

    if (sort === "low") {
        list.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        list.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
        list.sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }

    $("products").innerHTML =
        list.slice(0, 80).map(card).join("");

    $("count").textContent =
        `Showing ${Math.min(list.length, 80)} of ${list.length} listings`;

    $("empty").hidden = list.length > 0;
}


// ==========================================
// CATEGORY FILTER
// ==========================================

function filter(c) {

    category = c;

    document.querySelectorAll("#nav button").forEach(b => {
        b.classList.toggle(
            "active",
            c === "All"
                ? b.textContent.includes("All")
                : b.textContent.includes(c)
        );
    });

    $("search").value = "";

    $("heading").textContent =
        c === "All" ? "All products" : c;

    render(
        PRODUCTS.filter(p =>
            c === "All" || p.category === c
        )
    );

    home();

    $("products").scrollIntoView({
        behavior: "smooth"
    });
}


// ==========================================
// SEARCH PRODUCTS
// ==========================================

function search() {

    let q = $("search").value.toLowerCase().trim();

    let result = PRODUCTS.filter(p => {

        let matchCategory =
            category === "All" ||
            p.category === category;

        let matchName =
            `${p.name} ${p.category} ${p.sku}`
                .toLowerCase()
                .includes(q);

        return matchCategory && matchName;
    });

    $("heading").textContent =
        q ? "Search results" : "All products";

    render(result);
}


// ==========================================
// PRODUCT DETAILS
// ==========================================

function detail(id) {

    let p = PRODUCTS.find(x => x.id === id);

    if (!p) return;

    picked = p;

    views("detail");

    $("detail").innerHTML = `

        <button class="back" onclick="home()">
            ← Back to shopping
        </button>

        <div class="detail">

            <div class="detailPic">
                ${p.emoji}
            </div>

            <div>

                <small>${esc(p.category)}</small>

                <h1>${esc(p.name)}</h1>

                <p>${esc(p.description)}</p>

                <h2 class="price">
                    ${money(p.price)} / ${p.unit}
                </h2>

                <p>
                    Available stock:
                    <b>${p.stock} ${p.unit}</b>
                </p>

                <p>Pack: ${esc(p.pack)}</p>

                <p>SKU: ${esc(p.sku)}</p>

                <p class="warning">
                    Sample product information.
                    Verify actual stock and supplier details.
                </p>

                <button class="light"
                    onclick="add(${p.id})">
                    Add to cart
                </button>

                <button onclick="buy(${p.id})">
                    Buy now
                </button>

            </div>

        </div>
    `;
}


// ==========================================
// BUY NOW CONFIRMATION
// ==========================================

function buy(id) {

    let p = PRODUCTS.find(x => x.id === id);

    if (!p || p.stock <= 0) {
        return toast("Product unavailable");
    }

    picked = p;

    $("modalText").textContent =
        `Do you want to buy ${p.name} for ${money(p.price)} per ${p.unit}?`;

    $("modal").hidden = false;
}


// ==========================================
// YES OR NO
// ==========================================

function confirmBuy(yes) {

    $("modal").hidden = true;

    if (!yes) {

        picked = null;

        return toast("Purchase cancelled");
    }

    // Quantity comes before login.
    quantity(picked);
}


// ==========================================
// PRODUCT QUANTITY
// ==========================================

function quantity(p) {

    picked = p;

    estimate = null;

    views("quantity");

    $("quantity").innerHTML = `

        <button class="back" onclick="home()">
            ← Back
        </button>

        <div class="panel">

            <h2>${p.emoji} ${esc(p.name)}</h2>

            <p>
                Available stock:
                ${p.stock} ${p.unit}
            </p>

            <p>
                Price:
                ${money(p.price)} per ${p.unit}
            </p>

            <label>
                Enter quantity (${p.unit})

                <input
                    class="quantityInput"
                    id="qty"
                    type="number"
                    min="0.01"
                    max="${p.stock}"
                    step="0.01"
                    placeholder="Enter quantity"
                >
            </label>

            <button onclick="calc()">
                Calculate estimated bill
            </button>

            <div id="estimate"></div>

        </div>
    `;
}


// ==========================================
// ESTIMATED BILL
// ==========================================

function calc() {

    let q = Number($("qty").value);

    if (!q || q <= 0 || q > picked.stock) {

        return toast(
            "Enter a valid quantity within available stock"
        );
    }

    estimate = {
        id: picked.id,
        qty: q
    };

    let subtotal = q * picked.price;

    $("estimate").innerHTML = `

        <div class="bill">

            <h3>Estimated bill</h3>

            <div class="line">

                <span>
                    ${esc(picked.name)} × ${q} ${picked.unit}
                </span>

                <b>${money(subtotal)}</b>

            </div>

            <div class="line total">

                <span>Product subtotal</span>

                <span>${money(subtotal)}</span>

            </div>

            <p class="muted">
                Delivery charge is calculated
                after entering your address.
            </p>

            <button onclick="checkoutSingle()">
                Continue to checkout
            </button>

        </div>
    `;
}


// ==========================================
// BUY SINGLE PRODUCT
// ==========================================

function checkoutSingle() {

    if (!estimate) return;

    cart = [estimate];

    count();

    checkout();
}


// ==========================================
// ADD TO CART
// ==========================================

function add(id) {

    let p = PRODUCTS.find(x => x.id === id);

    let item = cart.find(x => x.id === id);

    if (item) {

        if (item.qty + 1 > p.stock) {
            return toast("Maximum available stock reached");
        }

        item.qty++;

    } else {

        if (p.stock <= 0) {
            return toast("Product unavailable");
        }

        cart.push({
            id: id,
            qty: 1
        });
    }

    count();

    toast("Product added to cart");
}


// ==========================================
// CART PAGE
// ==========================================

function cartPage() {

    views("cart");

    if (!cart.length) {

        $("cart").innerHTML = `

            <h1>Your cart is empty</h1>

            <button onclick="home()">
                Shop now
            </button>
        `;

        return;
    }

    let total = 0;

    let html = `
        <button class="back" onclick="home()">
            ← Continue shopping
        </button>

        <h1>Shopping cart</h1>
    `;

    cart.forEach(item => {

        let p = PRODUCTS.find(x => x.id === item.id);

        if (!p) return;

        total += p.price * item.qty;

        html += `

            <div class="line">

                <span>
                    <b>${esc(p.name)}</b>
                    <br>
                    <small>
                        ${money(p.price)} per ${p.unit}
                    </small>
                </span>

                <span>

                    <button class="light"
                        onclick="changeQty(${p.id},-1)">
                        −
                    </button>

                    ${item.qty}

                    <button class="light"
                        onclick="changeQty(${p.id},1)">
                        +
                    </button>

                </span>

                <b>
                    ${money(p.price * item.qty)}
                </b>

            </div>
        `;
    });

    html += `

        <div class="bill">

            <h2>Subtotal: ${money(total)}</h2>

            <p class="muted">
                Delivery charge calculated at checkout.
            </p>

            <button onclick="checkout()">
                Proceed to checkout
            </button>

        </div>
    `;

    $("cart").innerHTML = html;
}


// ==========================================
// CHANGE CART QUANTITY
// ==========================================

function changeQty(id, change) {

    let item = cart.find(x => x.id === id);

    let p = PRODUCTS.find(x => x.id === id);

    if (!item || !p) return;

    let newQty = item.qty + change;

    if (newQty <= 0) {

        cart = cart.filter(x => x.id !== id);

    } else if (newQty <= p.stock) {

        item.qty = newQty;

    } else {

        return toast("Maximum stock reached");
    }

    count();

    cartPage();
}


// ==========================================
// LOGIN PAGE
// ==========================================

function account() {

    if (user) {

        views("account");

        $("account").innerHTML = `

            <button class="back" onclick="home()">
                ← Back
            </button>

            <div class="form">

                <h2>Hello ${esc(user.name)}</h2>

                <p>${esc(user.email)}</p>

                <button onclick="logout()">
                    Logout
                </button>

            </div>
        `;

    } else {

        login();
    }
}


// ==========================================
// LOGIN
// ==========================================

function login() {

    views("account");

    $("account").innerHTML = `

        <button class="back" onclick="home()">
            ← Back
        </button>

        <div class="form">

            <h1>Login to AgroMart</h1>

            <p>
                Browse freely. Login is needed
                when placing an order.
            </p>

            <form id="loginForm">

                <label>
                    Email

                    <input
                        id="email"
                        type="email"
                        required
                    >
                </label>

                <label>
                    Password

                    <input
                        id="pass"
                        type="password"
                        required
                    >
                </label>

                <button>Login (demo)</button>

            </form>

            <p>
                New customer?
                <button class="light" onclick="register()">
                    Register
                </button>
            </p>

            <p class="warning">
                Demo login only. Do not use a real password.
                Secure authentication requires a backend.
            </p>

        </div>
    `;

    $("loginForm").onsubmit = e => {

        e.preventDefault();

        let email = $("email").value;

        user = {
            email: email,
            name: localStorage.getItem("name:" + email)
                || email.split("@")[0]
        };

        localStorage.setItem(
            "agromartUser",
            JSON.stringify(user)
        );

        $("userLabel").textContent = user.name;

        toast("Demo login successful");

        checkout();
    };
}


// ==========================================
// REGISTRATION
// ==========================================

function register() {

    views("account");

    $("account").innerHTML = `

        <button class="back" onclick="login()">
            ← Back
        </button>

        <div class="form">

            <h1>Create account</h1>

            <form id="regForm">

                <label>
                    Name

                    <input id="rname" required>
                </label>

                <label>
                    Email

                    <input id="remail" type="email" required>
                </label>

                <label>
                    Mobile number

                    <input
                        id="rphone"
                        pattern="[0-9]{10}"
                        required
                    >
                </label>

                <label>
                    Password

                    <input
                        id="rpass"
                        type="password"
                        minlength="8"
                        required
                    >
                </label>

                <button>Create demo account</button>

            </form>

            <p class="warning">
                Demo registration only.
                No password is stored or securely authenticated.
            </p>

        </div>
    `;

    $("regForm").onsubmit = e => {

        e.preventDefault();

        let email = $("remail").value;

        localStorage.setItem(
            "name:" + email,
            $("rname").value
        );

        user = {
            email: email,
            name: $("rname").value,
            phone: $("rphone").value
        };

        localStorage.setItem(
            "agromartUser",
            JSON.stringify(user)
        );

        $("userLabel").textContent = user.name;

        toast("Demo account created");

        checkout();
    };
}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    user = null;

    localStorage.removeItem("agromartUser");

    $("userLabel").textContent = "Login";

    home();
}


// ==========================================
// CHECKOUT PAGE
// ==========================================

function checkout() {

    if (!cart.length) {
        return toast("Your cart is empty");
    }

    if (!user) {

        login();

        toast("Login is required to place your order");

        return;
    }

    views("checkout");

    $("checkout").innerHTML = `

        <button class="back" onclick="cartPage()">
            ← Back to cart
        </button>

        <h1>Delivery & Payment</h1>

        <form class="form" id="deliveryForm">

            <label>
                Full name

                <input
                    id="custName"
                    value="${esc(user.name || "")}"
                    required
                >
            </label>

            <label>
                Mobile number

                <input
                    id="custPhone"
                    value="${esc(user.phone || "")}"
                    pattern="[0-9]{10}"
                    required
                >
            </label>

            <label>
                Full delivery address

                <textarea
                    id="address"
                    required
                    placeholder="House, street, village, district, state"
                ></textarea>
            </label>

            <label>
                PIN code

                <input
                    id="pin"
                    pattern="[0-9]{6}"
                    required
                    placeholder="6-digit PIN code"
                >
            </label>

            <h3>Choose payment method</h3>

            <label class="radio">
                <input type="radio" name="pay"
                    value="UPI" required>
                UPI
            </label>

            <label class="radio">
                <input type="radio" name="pay"
                    value="Card">
                Debit / Credit Card
            </label>

            <label class="radio">
                <input type="radio" name="pay"
