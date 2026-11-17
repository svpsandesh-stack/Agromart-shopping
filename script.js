const products = [
    {
        name: "Rice Seeds",
        price: 120,
        image: "🌾"
    },
    {
        name: "Wheat Seeds",
        price: 100,
        image: "🌱"
    },
    {
        name: "Urea Fertilizer",
        price: 270,
        image: "🧪"
    },
    {
        name: "Neem Pesticide",
        price: 160,
        image: "🍃"
    }
];

const productList = document.getElementById("productList");

products.forEach(product => {

    productList.innerHTML += `
        <div class="product">
            <h2>${product.image}</h2>
            <h3>${product.name}</h3>
            <p>Price: ₹${product.price}</p>
            <button onclick="buyProduct('${product.name}')">
                Buy Now
            </button>
        </div>
    `;

});

function buyProduct(name) {
    alert("Thank you for selecting " + name);
}
