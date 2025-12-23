// ========== API Configuration ==========
const API_BASE_URL = 'http://localhost:5000/api/v1/products';

// ========== DOM Elements ==========
const productsContainer = document.getElementById('productsContainer');
const productCount = document.getElementById('productCount');
const loadingSpinner = document.getElementById('loadingSpinner');
const noProducts = document.getElementById('noProducts');
const toast = document.getElementById('toast');

// Filter elements
const companyFilter = document.getElementById('companyFilter');
const priceFilter = document.getElementById('priceFilter');
const nameSearch = document.getElementById('nameSearch');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');

// Form elements
const addProductForm = document.getElementById('addProductForm');
const editModal = document.getElementById('editModal');
const editProductForm = document.getElementById('editProductForm');
const closeModalBtn = document.querySelector('.close');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// ========== State ==========
let allProducts = [];
let currentFilters = {
    company: '',
    price: '',
    name: ''
};

// ========== Event Listeners ==========
document.addEventListener('DOMContentLoaded', () => {
    loadAllProducts();
    setupEventListeners();
});

function setupEventListeners() {
    applyFiltersBtn.addEventListener('click', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
    addProductForm.addEventListener('submit', handleAddProduct);
    editProductForm.addEventListener('submit', handleUpdateProduct);
    closeModalBtn.addEventListener('click', closeModal);
    cancelEditBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === editModal) {
            closeModal();
        }
    });
}

// ========== API Functions ==========

/**
 * Load all products from the backend
 */
async function loadAllProducts() {
    try {
        showLoading(true);
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allProducts = data.data || [];
        displayProducts(allProducts);
        showToast(`Loaded ${allProducts.length} products`, 'success');
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products. Make sure the server is running.', 'error');
        displayProducts([]);
    } finally {
        showLoading(false);
    }
}

/**
 * Apply filters to products
 */
async function applyFilters() {
    currentFilters.company = companyFilter.value;
    currentFilters.price = priceFilter.value;
    currentFilters.name = nameSearch.value;

    try {
        showLoading(true);
        let filteredProducts = [...allProducts];

        // Filter by company
        if (currentFilters.company) {
            filteredProducts = filteredProducts.filter(p => p.company === currentFilters.company);
        }

        // Filter by price
        if (currentFilters.price) {
            filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(currentFilters.price));
        }

        // Filter by name
        if (currentFilters.name) {
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(currentFilters.name.toLowerCase())
            );
        }

        displayProducts(filteredProducts);
        showToast(`Found ${filteredProducts.length} product(s)`, 'info');
    } catch (error) {
        console.error('Error applying filters:', error);
        showToast('Error applying filters', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Reset all filters
 */
function resetFilters() {
    companyFilter.value = '';
    priceFilter.value = '';
    nameSearch.value = '';
    currentFilters = { company: '', price: '', name: '' };
    displayProducts(allProducts);
    showToast('Filters reset', 'info');
}

/**
 * Display products in the grid
 */
function displayProducts(products) {
    productsContainer.innerHTML = '';
    productCount.textContent = products.length;

    if (products.length === 0) {
        noProducts.style.display = 'block';
        return;
    }

    noProducts.style.display = 'none';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

/**
 * Create a product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const createdDate = new Date(product.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    card.innerHTML = `
        <div class="product-card-header">
            <div class="product-card-title">${escapeHtml(product.name)}</div>
            <div class="product-card-meta">
                <span class="company-badge">${escapeHtml(product.company)}</span>
                <span>${createdDate}</span>
            </div>
        </div>
        <div class="product-card-body">
            <div class="product-info">
                <div class="product-info-row">
                    <span class="info-label">Price:</span>
                    <span class="info-value price">$${product.price.toFixed(2)}</span>
                </div>
                <div class="product-info-row">
                    <span class="info-label">Rating:</span>
                    <span class="info-value rating">⭐ ${product.rating}</span>
                </div>
                <div class="product-info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value">${product.featured ? '<span class="featured-badge">Featured</span>' : 'Regular'}</span>
                </div>
                <div class="product-info-row">
                    <span class="info-label">ID:</span>
                    <span class="info-value" style="font-size: 0.85em; font-family: monospace;">${product._id.substring(0, 8)}...</span>
                </div>
            </div>
        </div>
        <div class="product-card-footer">
            <button class="btn btn-warning" onclick="openEditModal('${product._id}')">Edit</button>
            <button class="btn btn-danger" onclick="handleDeleteProduct('${product._id}', '${escapeHtml(product.name)}')">Delete</button>
        </div>
    `;

    return card;
}

/**
 * Handle adding a new product
 */
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

    try {
        showLoading(true);
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allProducts.push(data.data);
        
        addProductForm.reset();
        displayProducts(allProducts);
        showToast(`Product "${newProduct.name}" added successfully!`, 'success');
    } catch (error) {
        console.error('Error adding product:', error);
        showToast('Failed to add product', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Open edit modal with product data
 */
function openEditModal(productId) {
    const product = allProducts.find(p => p._id === productId);
    
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }

    document.getElementById('editProductId').value = product._id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductCompany').value = product.company;
    document.getElementById('editProductRating').value = product.rating;
    document.getElementById('editProductFeatured').checked = product.featured;

    editModal.style.display = 'block';
}

/**
 * Close edit modal
 */
function closeModal() {
    editModal.style.display = 'none';
    editProductForm.reset();
}

/**
 * Handle updating a product
 */
async function handleUpdateProduct(e) {
    e.preventDefault();

    const productId = document.getElementById('editProductId').value;
    const updatedProduct = {
        name: document.getElementById('editProductName').value.trim(),
        price: parseFloat(document.getElementById('editProductPrice').value),
        company: document.getElementById('editProductCompany').value,
        rating: parseFloat(document.getElementById('editProductRating').value),
        featured: document.getElementById('editProductFeatured').checked
    };

    // Validation
    if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.company) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Update the product in allProducts
        const index = allProducts.findIndex(p => p._id === productId);
        if (index !== -1) {
            allProducts[index] = data.data;
        }

        closeModal();
        displayProducts(allProducts);
        showToast('Product updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating product:', error);
        showToast('Failed to update product', 'error');
    } finally {
        showLoading(false);
    }
}

/**
 * Handle deleting a product
 */
async function handleDeleteProduct(productId, productName) {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) {
        return;
    }

    try {
        showLoading(true);
        const response = await fetch(`${API_BASE_URL}/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        allProducts = allProducts.filter(p => p._id !== productId);
        displayProducts(allProducts);
        showToast(`Product "${productName}" deleted successfully!`, 'success');
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product', 'error');
    } finally {
        showLoading(false);
    }
}

// ========== Utility Functions ==========

/**
 * Show or hide loading spinner
 */
function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
