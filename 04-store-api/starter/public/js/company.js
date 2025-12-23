// ========== Company Management Page Logic ==========
let selectedCompany = null;
let companyProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Company card selection
    document.querySelectorAll('.company-card').forEach(card => {
        card.addEventListener('click', () => selectCompany(card.dataset.company));
    });

    // Bulk action buttons
    document.getElementById('updateRatingBtn').addEventListener('click', handleUpdateRating);
    document.getElementById('markFeaturedBtn').addEventListener('click', () => handleMarkFeatured(true));
    document.getElementById('unmarkFeaturedBtn').addEventListener('click', () => handleMarkFeatured(false));
    document.getElementById('deleteAllBtn').addEventListener('click', handleDeleteAll);
}

async function selectCompany(company) {
    selectedCompany = company;
    document.getElementById('selectedCompanyName').textContent = company.charAt(0).toUpperCase() + company.slice(1);
    document.getElementById('selectedCompanySection').style.display = 'block';

    showLoading(true);
    try {
        companyProducts = await getProductsByCompany(company);
        displayCompanyProducts(companyProducts);
        showToast(`Loaded ${companyProducts.length} products from ${company}`, 'success');
    } finally {
        showLoading(false);
    }

    // Scroll to products section
    document.getElementById('selectedCompanySection').scrollIntoView({ behavior: 'smooth' });
}

function displayCompanyProducts(products) {
    const container = document.getElementById('companyProductsContainer');
    const noProducts = document.getElementById('noCompanyProducts');

    container.innerHTML = '';

    if (products.length === 0) {
        noProducts.style.display = 'block';
        return;
    }

    noProducts.style.display = 'none';
    products.forEach(product => {
        container.appendChild(createProductCard(product, true));
    });
}

async function handleUpdateRating() {
    const rating = parseFloat(document.getElementById('bulkRating').value);

    if (isNaN(rating) || rating < 0 || rating > 5) {
        showToast('Please enter a valid rating between 0 and 5', 'error');
        return;
    }

    if (!confirm(`Update rating to ${rating} for all ${selectedCompany} products?`)) {
        return;
    }

    showLoading(true);
    try {
        const success = await updateProductsByCompany(selectedCompany, { rating });
        if (success) {
            // Reload products
            companyProducts = await getProductsByCompany(selectedCompany);
            displayCompanyProducts(companyProducts);
            document.getElementById('bulkRating').value = '';
            showToast(`Updated rating for all ${selectedCompany} products!`, 'success');
        }
    } finally {
        showLoading(false);
    }
}

async function handleMarkFeatured(featured) {
    const action = featured ? 'mark as featured' : 'unmark as featured';
    if (!confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} all ${selectedCompany} products?`)) {
        return;
    }

    showLoading(true);
    try {
        const success = await updateProductsByCompany(selectedCompany, { featured });
        if (success) {
            // Reload products
            companyProducts = await getProductsByCompany(selectedCompany);
            displayCompanyProducts(companyProducts);
            showToast(`Updated ${companyProducts.length} product(s)!`, 'success');
        }
    } finally {
        showLoading(false);
    }
}

async function handleDeleteAll() {
    if (!confirm(`Are you sure you want to delete ALL ${companyProducts.length} products from ${selectedCompany}? This cannot be undone!`)) {
        return;
    }

    if (!confirm('CONFIRM: Delete all products? This is permanent!')) {
        return;
    }

    showLoading(true);
    try {
        const success = await deleteProductsByCompany(selectedCompany);
        if (success) {
            companyProducts = [];
            displayCompanyProducts([]);
            document.getElementById('selectedCompanySection').style.display = 'none';
            selectedCompany = null;
            showToast(`All products from ${selectedCompany} deleted!`, 'success');
        }
    } finally {
        showLoading(false);
    }
}

async function deleteProductHandler(productId, productName) {
    if (!confirm(`Delete "${productName}"?`)) return;

    showLoading(true);
    try {
        const success = await deleteProduct(productId);
        if (success) {
            companyProducts = companyProducts.filter(p => p._id !== productId);
            displayCompanyProducts(companyProducts);
            showToast(`"${productName}" deleted!`, 'success');
        }
    } finally {
        showLoading(false);
    }
}
