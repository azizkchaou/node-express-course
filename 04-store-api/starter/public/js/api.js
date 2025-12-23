// ========== API Configuration ==========
const API_BASE_URL = 'http://localhost:5000/api/v1/products';

// ========== Toast Notification System ==========
function showToast(message, type = 'info') {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';

    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// ========== Loading Spinner ==========
function showLoading(show) {
    let spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'flex' : 'none';
    }
}

// ========== HTML Escape ==========
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== API Methods ==========

/**
 * Get all products
 */
async function getAllProducts() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching products:', error);
        showToast('Failed to load products. Make sure the server is running.', 'error');
        return [];
    }
}

/**
 * Get single product by ID
 */
async function getProductById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error fetching product:', error);
        showToast('Failed to load product', 'error');
        return null;
    }
}

/**
 * Create new product
 */
async function createProduct(productData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error creating product:', error);
        showToast('Failed to create product', 'error');
        return null;
    }
}

/**
 * Update product by ID
 */
async function updateProduct(id, productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error updating product:', error);
        showToast('Failed to update product', 'error');
        return null;
    }
}

/**
 * Delete product by ID
 */
async function deleteProduct(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product', 'error');
        return false;
    }
}

/**
 * Get products by company
 */
async function getProductsByCompany(company) {
    try {
        const response = await fetch(`${API_BASE_URL}/company/${company}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching products by company:', error);
        showToast('Failed to load products for this company', 'error');
        return [];
    }
}

/**
 * Delete all products by company
 */
async function deleteProductsByCompany(company) {
    try {
        const response = await fetch(`${API_BASE_URL}/company/${company}`, { method: 'DELETE' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return true;
    } catch (error) {
        console.error('Error deleting products by company:', error);
        showToast('Failed to delete products for this company', 'error');
        return false;
    }
}

/**
 * Update all products by company
 */
async function updateProductsByCompany(company, updateData) {
    try {
        const response = await fetch(`${API_BASE_URL}/company/${company}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return true;
    } catch (error) {
        console.error('Error updating products by company:', error);
        showToast('Failed to update products for this company', 'error');
        return false;
    }
}

/**
 * Get products by max price
 */
async function getProductsByPrice(maxPrice) {
    try {
        const response = await fetch(`${API_BASE_URL}/price/${maxPrice}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching products by price:', error);
        showToast('Failed to load products for this price range', 'error');
        return [];
    }
}

/**
 * Get products by name
 */
async function getProductsByName(name) {
    try {
        const response = await fetch(`${API_BASE_URL}/name/${name}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching products by name:', error);
        showToast('Failed to load products with that name', 'error');
        return [];
    }
}

// ========== Product Card Generator ==========
function createProductCard(product, showDetails = false) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const createdDate = new Date(product.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    let buttonsHtml = '';
    if (showDetails) {
        buttonsHtml = `
            <div class="product-card-footer">
                <button class="btn btn-primary" onclick="viewProductDetails('${product._id}')">View</button>
                <button class="btn btn-warning" onclick="openEditModal('${product._id}')">Edit</button>
                <button class="btn btn-danger" onclick="deleteProductHandler('${product._id}', '${escapeHtml(product.name)}')">Delete</button>
            </div>
        `;
    }

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
        ${buttonsHtml}
    `;

    return card;
}

// ========== Navigation Setup ==========
document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
});

function setupNavigation() {
    const navToggle = document.getElementById('navbarToggle');
    const navMenu = document.getElementById('navbarMenu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}
