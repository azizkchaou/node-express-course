// ========== Add Product Page Logic ==========
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadRecentProducts();
});

function setupEventListeners() {
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
}

async function handleAddProduct(e) {
    e.preventDefault();

    const newProduct = {
        name: document.getElementById('productName').value.trim(),
        price: parseFloat(document.getElementById('productPrice').value),
        company: document.getElementById('productCompany').value,
        rating: parseFloat(document.getElementById('productRating').value) || 4.5,
        featured: document.getElementById('productFeatured').checked
    };

    // Validation
    if (!newProduct.name || !newProduct.price || !newProduct.company) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    if (newProduct.price < 0) {
        showToast('Price cannot be negative', 'error');
        return;
    }

    showLoading(true);
    try {
        const result = await createProduct(newProduct);
        if (result) {
            document.getElementById('addProductForm').reset();
            showToast(`Product "${newProduct.name}" added successfully!`, 'success');
            loadRecentProducts();
            
            // Scroll to form
            document.querySelector('.add-product-section').scrollIntoView({ behavior: 'smooth' });
        }
    } finally {
        showLoading(false);
    }
}

async function loadRecentProducts() {
    showLoading(true);
    try {
        const products = await getAllProducts();
        const recent = products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
        displayRecentProducts(recent);
    } finally {
        showLoading(false);
    }
}

function displayRecentProducts(products) {
    const container = document.getElementById('recentProductsContainer');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p class="no-products"><p>No products yet. Create your first product above!</p></p>';
        return;
    }

    products.forEach(product => {
        container.appendChild(createProductCard(product, false));
    });
}
