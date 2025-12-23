// ========== Products Page Logic ==========
let allProducts = [];
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('applyFilterBtn').addEventListener('click', applyFilter);
    document.getElementById('resetFilterBtn').addEventListener('click', resetFilter);
    document.getElementById('editProductForm').addEventListener('submit', handleUpdateProduct);
    document.querySelector('.close').addEventListener('click', closeEditModal);
    document.getElementById('cancelEditBtn').addEventListener('click', closeEditModal);

    window.addEventListener('click', (e) => {
        const modal = document.getElementById('editModal');
        if (e.target === modal) closeEditModal();
    });
}

async function loadProducts() {
    showLoading(true);
    try {
        allProducts = await getAllProducts();
        filteredProducts = [...allProducts];
        displayProducts(filteredProducts);
        showToast(`Loaded ${allProducts.length} products`, 'success');
    } catch (error) {
        console.error('Error loading products:', error);
        displayProducts([]);
    } finally {
        showLoading(false);
    }
}

function applyFilter() {
    const company = document.getElementById('companyFilter').value;
    const featured = document.getElementById('featuredFilter').value;

    filteredProducts = allProducts.filter(product => {
        let matchCompany = !company || product.company === company;
        let matchFeatured = true;

        if (featured === 'featured') matchFeatured = product.featured;
        if (featured === 'regular') matchFeatured = !product.featured;

        return matchCompany && matchFeatured;
    });

    displayProducts(filteredProducts);
    showToast(`Found ${filteredProducts.length} product(s)`, 'info');
}

function resetFilter() {
    document.getElementById('companyFilter').value = '';
    document.getElementById('featuredFilter').value = '';
    filteredProducts = [...allProducts];
    displayProducts(filteredProducts);
    showToast('Filters reset', 'info');
}

function displayProducts(products) {
    const container = document.getElementById('productsContainer');
    const noProducts = document.getElementById('noProducts');
    const count = document.getElementById('productCount');

    container.innerHTML = '';
    count.textContent = products.length;

    if (products.length === 0) {
        noProducts.style.display = 'block';
        return;
    }

    noProducts.style.display = 'none';
    products.forEach(product => {
        container.appendChild(createProductCard(product, true));
    });
}

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

    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('editProductForm').reset();
}

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

    if (!updatedProduct.name || !updatedProduct.price || !updatedProduct.company) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    showLoading(true);
    try {
        const result = await updateProduct(productId, updatedProduct);
        if (result) {
            const index = allProducts.findIndex(p => p._id === productId);
            if (index !== -1) allProducts[index] = result;
            filteredProducts = allProducts.filter(p => {
                const company = document.getElementById('companyFilter').value;
                const featured = document.getElementById('featuredFilter').value;
                let matchCompany = !company || p.company === company;
                let matchFeatured = true;
                if (featured === 'featured') matchFeatured = p.featured;
                if (featured === 'regular') matchFeatured = !p.featured;
                return matchCompany && matchFeatured;
            });
            displayProducts(filteredProducts);
            closeEditModal();
            showToast('Product updated successfully!', 'success');
        }
    } finally {
        showLoading(false);
    }
}

async function deleteProductHandler(productId, productName) {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    showLoading(true);
    try {
        const success = await deleteProduct(productId);
        if (success) {
            allProducts = allProducts.filter(p => p._id !== productId);
            filteredProducts = filteredProducts.filter(p => p._id !== productId);
            displayProducts(filteredProducts);
            showToast(`Product "${productName}" deleted successfully!`, 'success');
        }
    } finally {
        showLoading(false);
    }
}

function viewProductDetails(productId) {
    // Store the product ID in session storage for the details page
    sessionStorage.setItem('selectedProductId', productId);
    window.location.href = 'product-detail.html';
}
