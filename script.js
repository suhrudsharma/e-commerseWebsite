const { animate, stagger, inView } = Motion;
// Global variables
let products = [];
let filteredProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentPage = 1;
const productsPerPage = 6;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    updateCartCount();
    applyTheme();
    loadCategories();
});

// Load products from FakeStore API
async function loadProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        filteredProducts = products;
        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-grid').innerHTML = 
            '<div class="loading">Error loading products. Please try again later.</div>';
    }
}

// Load categories from API
async function loadCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await response.json();
        const categoryFilter = document.getElementById('category-filter');
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Display products in grid
function displayProducts(productsToDisplay) {
    const productsGrid = document.getElementById('products-grid');
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedItems = productsToDisplay.slice(startIndex, endIndex);
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = '<div class="loading">No products found matching your criteria.</div>';
        return;
    }
    
    productsGrid.innerHTML = paginatedItems.map(product => `
        <div class="product-card" onclick="openProductDetail(${product.id}, event)">
            <img src="${product.image}" alt="${product.title}" class="product-image">
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(Math.round(product.rating.rate))}${'☆'.repeat(5 - Math.round(product.rating.rate))}</span>
                    <span>(${product.rating.count})</span>
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        </div>
    `).join('');
    inView(
        ".product-card", 
        (info) => {
            // This code runs for EACH card as it enters the screen
            animate(
                info.target,
                { 
                    opacity: [0, 1], // Fade in
                    y: [10, 0]         // Slide up
                },
                { 
                    duration: 0.5, 
                    ease: "ease-out" 
                }
            );
        },
        {
            // Trigger animation when 20% of the card is visible
            amount: 0.2 
        }
    );
    renderPagination(productsToDisplay.length);
}

// Open product detail modal
// in script.js
async function openProductDetail(productId, event) {
    const cardElement = event.currentTarget;
    const product = products.find(p => p.id == productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const modalContent = modal.querySelector('.modal-content');
    const productDetail = document.getElementById('product-detail');

    // 1. Populate modal HTML
    productDetail.innerHTML = `
        <div class="product-detail-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-detail-info">
            <h2>${product.title}</h2>
            <div class="product-category">${product.category}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-rating">
                <span class="stars">${'★'.repeat(Math.round(product.rating.rate))}${'☆'.repeat(5 - Math.round(product.rating.rate))}</span>
                <span>(${product.rating.count} reviews)</span>
            </div>
            <div class="description">${product.description}</div>
            <div class="product-actions">
                <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;

    // 2. Hide internal content for fade-in
    const modalImage = productDetail.querySelector('.product-detail-image');
    const modalInfo = productDetail.querySelector('.product-detail-info');
    [modalImage, modalInfo].forEach(el => el.style.opacity = 0);

    // 3. Get positions
    const cardRect = cardElement.getBoundingClientRect();

    // Reset modal styles to measure its *final* centered position
    modalContent.style.transform = null;
    modalContent.style.opacity = null; 
    modal.style.display = 'block';
    
    const modalRect = modalContent.getBoundingClientRect();

    // 4. Calculate the 'from' state
    const deltaX = cardRect.left - modalRect.left;
    const deltaY = cardRect.top - modalRect.top;
    const scaleX = cardRect.width / modalRect.width;
    const scaleY = cardRect.height / modalRect.height;

    // 5. Run the new animation
    animate(
        modalContent,
        {
            // Start at the card's position and scale
            transform: [
                `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`,
                'none' // Animate to its default (centered) state
            ],
            opacity: [0, 1]
        },
        {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1] // A nice "quint" ease-out
        }
    );

    // 6. Fade in the modal's internal content
    animate(
        [modalImage, modalInfo],
        { opacity: [0, 1] },
        { delay: 0.2, duration: 0.3 }
    );
}

// Close modal
// in script.js
function closeModal() {
    const modal = document.getElementById('product-modal');
    const modalContent = modal.querySelector('.modal-content');
    const productDetail = document.getElementById('product-detail');
    
    // Animate the whole modal out
    animate(
        modal,
        { opacity: [1, 0] },
        { duration: 0.25, ease: 'ease-out' }
    ).finished.then(() => {
        // --- THIS IS THE CRITICAL RESET PART ---
        modal.style.display = 'none'; 
        modal.style.opacity = 1;      
        
        // Reset modal content for next open
        modalContent.style.opacity = null;
        modalContent.style.transform = null;

        // Clear out old content
        productDetail.innerHTML = '';
    });
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Render pagination

function renderPagination(totalItems) {
    const paginationControls = document.getElementById('pagination-controls');
    const totalPages = Math.ceil(totalItems / productsPerPage);

    // Clear old buttons
    paginationControls.innerHTML = '';

    // Don't show controls if there's only one page
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-btn');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        pageButton.onclick = () => {
            currentPage = i;
            displayProducts(filteredProducts); // Re-render products for the new page
            
            // Scroll to the top of the products section
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        };
        paginationControls.appendChild(pageButton);
    }
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
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Product added to cart!');
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCart();
}

// Update quantity in cart
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        displayCart();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart count badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Display cart items
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    
    cartTotal.textContent = total.toFixed(2);
}

// Handle search functionality
function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    const priceRange = parseInt(document.getElementById('price-range').value);
    
    filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                             product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
        const matchesPrice = product.price <= priceRange;
        
        return matchesSearch && matchesCategory && matchesPrice;
    });
    currentPage = 1;
    displayProducts(filteredProducts);
}

// Handle category filter
function handleCategoryFilter() {
    handleSearch();
}

// Handle price filter
function handlePriceFilter() {
    const priceValue = document.getElementById('price-range').value;
    document.getElementById('price-value').textContent = priceValue;
    handleSearch();
}

// Toggle dark/light theme
function toggleTheme() {
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');
    
    if (currentTheme === 'dark') {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        document.querySelector('.theme-toggle').textContent = '🌙';
    } else {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        document.querySelector('.theme-toggle').textContent = '☀️';
    }
}

// Apply saved theme
function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-toggle').textContent = '☀️';
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Order placed successfully!\nTotal: $${total.toFixed(2)}\n\nThank you for shopping with us!`);
    
    cart = [];
    saveCart();
    updateCartCount();
    displayCart();
}

// Show notification
function showNotification(message) {
    // Simple notification using alert
    // In a real app, you might want to use a toast notification library
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Navigate to cart
function navigateToCart() {
    document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
    displayCart();
}

// Update cart display when cart section is in view
const cartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            displayCart();
        }
    });
}, { threshold: 0.1 });

const cartSection = document.getElementById('cart');
if (cartSection) {
    cartObserver.observe(cartSection);
}

