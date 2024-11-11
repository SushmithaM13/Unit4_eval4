let timeout;
const debounceDelay = 300;

async function fetchProductsAndReviews() {
    try {
        const productResponse = await fetch(`https://evaluation-98bd1-default-rtdb.firebaseio.com/products.json`);
        const reviewResponse = await fetch(`https://evalution3-9b867-default-rtdb.firebaseio.com/users.json`);

        const productData = await productResponse.json();
        const reviewData = await reviewResponse.json();

        console.log("Raw Product Data:", productData); 
        console.log("Review Data:", reviewData);  

        const products = Array.isArray(productData.products) ? productData.products : Object.values(productData);

        if (products.length > 0) {
            displayProducts(products);
        } else {
            console.error("No products found.");
        }
        return products;
    } catch (error) {
        console.error("Error fetching products or reviews:", error);
    }
}

function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; 

    products.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        
        productElement.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price} <del>$${product.strikePrice}</del></p>
            <p>Category: ${product.category}</p>
            <div>
                ${product.images.filter(img => img).map(img => `<img src="${img}" width="100" alt="${product.title}">`).join('')}
            </div>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(productElement);
    });
}

async function handleSearch(input) {
    clearTimeout(timeout);

    timeout = setTimeout(async () => {
        const query = input.value.trim().toLowerCase();

        if (query.length === 0) {
            fetchProductsAndReviews(); 
            return;
        }

        const allProducts = await fetchProductsAndReviews(); 
        const filteredProducts = allProducts.filter(product => 
            product.title.toLowerCase().includes(query)
        );
        
        displayProducts(filteredProducts);
        displaySuggestions(filteredProducts, query);
    }, debounceDelay);
}

function displaySuggestions(products, query) {
    const suggestions = document.getElementById("suggestions");
    suggestions.innerHTML = "";

    const matchedProducts = products.slice(0,5);
    
    matchedProducts.forEach(product => {
        const suggestion = document.createElement("div");
        suggestion.classList.add("suggestion-item");
        suggestion.innerHTML = product.title;

        suggestion.addEventListener("click", () => {
            displayProducts([product]); 
            suggestions.innerHTML = ""; 
        });

        suggestions.appendChild(suggestion);
    });
}

document.getElementById("productSearch").addEventListener("input", (e) => {
    handleSearch(e.target);
});

window.onload = fetchProductsAndReviews;