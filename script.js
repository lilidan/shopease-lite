// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "High-quality wireless headphones with noise cancellation",
        price: 99.99,
        emoji: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        description: "Feature-rich smartwatch with health monitoring",
        price: 199.99,
        emoji: "⌚"
    },
    {
        id: 3,
        name: "Portable Speaker",
        description: "Waterproof portable speaker with 360° sound",
        price: 79.99,
        emoji: "🔊"
    },
    {
        id: 4,
        name: "Phone Charger",
        description: "Fast charging USB-C phone charger",
        price: 24.99,
        emoji: "🔋"
    },
    {
        id: 5,
        name: "Laptop Stand",
        description: "Adjustable aluminum laptop stand for better ergonomics",
        price: 49.99,
        emoji: "💻"
    },
    {
        id: 6,
        name: "Desk Lamp",
        description: "LED desk lamp with adjustable brightness",
        price: 39.99,
        emoji: "💡"
    }
];

// Shopping cart state
let cart = [];

// DOM elements
const productsContainer = document.getElementById('products-container');
const cartButton = document.getElementById('cart-button');
const cartCount = document.getElementById('cart-count');
const cartSection = document.getElementById('cart-section');
const productsSection = document.getElementById('products-section');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');
const checkoutSection = document.getElementById('checkout-section');
const checkoutForm = document.getElementById('checkout-form');
const confirmationSection = document.getElementById('confirmation-section');
const orderIdElement = document.getElementById('order-id');
const continueShoppingButton = document.getElementById('continue-shopping');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartDisplay();
    
    // Event listeners
    cartButton.addEventListener('click', toggleCart);
    checkoutButton.addEventListener('click', showCheckout);
    checkoutForm.addEventListener('submit', processPayment);
    continueShoppingButton.addEventListener('click', showProducts);
});

// Render products to the page
function renderProducts() {
    productsContainer.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product-card';
        productElement.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productsContainer.appendChild(productElement);
    });
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    
    // Show visual feedback
    const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.backgroundColor = '#28a745';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 1000);
}

// Update cart display
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cartSection.classList.contains('hidden')) return;
    
    renderCartItems();
}

// Render cart items
function renderCartItems() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                <button class="remove-item" data-id="${item.id}">×</button>
            </div>
        `;
        cartItems.appendChild(cartItemElement);
    });
    
    cartTotal.textContent = total.toFixed(2);
    
    // Add event listeners to cart item buttons
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            updateQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            updateQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            removeFromCart(productId);
        });
    });
}

// Update item quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

// Toggle cart visibility
function toggleCart() {
    if (cartSection.classList.contains('hidden')) {
        showCart();
    } else {
        showProducts();
    }
}

// Show products section
function showProducts() {
    productsSection.classList.remove('hidden');
    cartSection.classList.add('hidden');
    checkoutSection.classList.add('hidden');
    confirmationSection.classList.add('hidden');
}

// Show cart section
function showCart() {
    productsSection.classList.add('hidden');
    cartSection.classList.remove('hidden');
    checkoutSection.classList.add('hidden');
    confirmationSection.classList.add('hidden');
    renderCartItems();
}

// Show checkout section
function showCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    productsSection.classList.add('hidden');
    cartSection.classList.add('hidden');
    checkoutSection.classList.remove('hidden');
    confirmationSection.classList.add('hidden');
}

// Process payment
function processPayment(e) {
    e.preventDefault();
    
    // In a real app, this would send data to a payment processor
    // For this demo, we'll just simulate a successful payment
    
    // Generate a random order ID
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    orderIdElement.textContent = orderId;
    
    // Show confirmation
    productsSection.classList.add('hidden');
    cartSection.classList.add('hidden');
    checkoutSection.classList.add('hidden');
    confirmationSection.classList.remove('hidden');
    
    // Clear cart
    cart = [];
    updateCartDisplay();
}