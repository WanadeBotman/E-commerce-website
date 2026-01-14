const products = [
    { id: 1, name: "Suede Loafer", price: 240, img: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800", desc: "Handcrafted Italian suede with a cushioned cork insole for all-day comfort." },
    { id: 2, name: "Obsidian Watch", price: 450, img: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800", desc: "Minimalist slate face with a matte black steel mesh band." },
    { id: 3, name: "Cotton Parka", price: 180, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800", desc: "Water-resistant organic cotton blend with recycled brass hardware." },
    { id: 4, name: "Linen Tote", price: 95, img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800", desc: "Heavyweight Belgian linen with reinforced vegetable-tanned leather handles." },
    { id: 5, name: "Studio Chair", price: 890, img: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800", desc: "Ergonomic molded shell with sustainable oak legs." },
    { id: 6, name: "Brushed Lamp", price: 120, img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800", desc: "Dimmable LED with a brushed aluminum finish and woven cable." },
    { id: 7, name: "Wool Throw", price: 155, img: "https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=800", desc: "100% Merino wool in a waffle-knit pattern for ultimate warmth." },
    { id: 8, name: "Lucid Glass Vase", price: 145,  img: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800", desc: "A hand-blown crystal glass vase with a unique fluid silhouette. Designed to refract light and elevate any floral arrangement."}
];

let cart = JSON.parse(localStorage.getItem('aura_cart')) || [];

// Selectors
const productList = document.getElementById('product-list');
const cartCount = document.getElementById('cart-count');
const cartDrawer = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const modal = document.getElementById('modal-overlay');

function init() {
    renderProducts();
    updateUI();
}

// Render the grid
function renderProducts() {
    productList.innerHTML = products.map(p => `
        <div class="product-card" onclick="openModal(${p.id})">
            <div class="img-wrapper"><img src="${p.img}" alt="${p.name}"></div>
            <div class="card-info">
                <div>
                    <h4>${p.name}</h4>
                    <p style="color:#888; font-weight:500;">$${p.price.toLocaleString()}</p>
                </div>
                <button class="add-mini" onclick="event.stopPropagation(); addToCart(${p.id})">
                    <i class="ri-add-line"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Cart Logic
function addToCart(id) {
    const p = products.find(item => item.id === id);
    cart.push(p);
    save();
    toggleCart(true);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    save();
}

function save() {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
    updateUI();
}

function updateUI() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = cart.map((item, i) => `
        <div class="cart-item" style="display:flex; gap:15px; margin-bottom:20px; align-items:center;">
            <img src="${item.img}" style="width:70px; height:70px; border-radius:12px; object-fit:cover;">
            <div style="flex:1">
                <h5 style="font-size:0.95rem; font-weight:600;">${item.name}</h5>
                <p style="font-size:0.85rem; color:#888">$${item.price.toLocaleString()}</p>
            </div>
            <i class="ri-delete-bin-6-line" onclick="removeFromCart(${i})" style="cursor:pointer; color:#ff4d4d; font-size:1.1rem"></i>
        </div>
    `).join('');

    const total = cart.reduce((acc, item) => acc + item.price, 0);
    document.getElementById('cart-total').innerText = `$${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    cartCount.innerText = cart.length;
}

// UI Transitions
function toggleCart(open = null) {
    if (open === true) {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
    } else {
        cartDrawer.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }
}

// Detail Modal
function openModal(id) {
    const p = products.find(item => item.id === id);
    const body = document.getElementById('modal-content-body');
    body.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));">
            <div style="overflow:hidden; height:500px;">
                <img src="${p.img}" id="zoom-img" style="width:100%; height:100%; object-fit:cover; transition: transform 0.3s ease;">
            </div>
            <div style="padding:3.5rem; display:flex; flex-direction:column; justify-content:center;">
                <h2 style="font-size:2.8rem; margin-bottom:1rem; letter-spacing:-1px;">${p.name}</h2>
                <p style="font-size:1.4rem; color:#121212; font-weight:700; margin-bottom:1.5rem">$${p.price.toLocaleString()}</p>
                <p style="color:#555; line-height:1.7; margin-bottom:2.5rem;">${p.desc}</p>
                <button class="btn-primary" onclick="addToCart(${p.id}); closeModal();">Add to Bag</button>
            </div>
        </div>
    `;
    modal.classList.add('active');
}

function closeModal() { modal.classList.remove('active'); }

// Checkout Interaction
document.getElementById('checkout-trigger').addEventListener('click', function() {
    if (cart.length === 0) return alert("Your bag is empty!");
    
    this.innerText = "Processing...";
    this.disabled = true;

    setTimeout(() => {
        this.innerHTML = "Success! <i class='ri-check-line'></i>";
        this.style.background = "#556b2f";
        
        setTimeout(() => {
            cart = [];
            save();
            toggleCart(false);
            this.innerText = "Checkout Now";
            this.style.background = "";
            this.disabled = false;
        }, 2000);
    }, 1500);
});

// Listeners
document.getElementById('cart-btn').addEventListener('click', () => toggleCart());
document.getElementById('close-cart').addEventListener('click', () => toggleCart());
cartOverlay.addEventListener('click', () => toggleCart());
document.getElementById('close-modal').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => e.target === modal && closeModal());

init();