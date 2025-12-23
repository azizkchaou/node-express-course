// ========== Advanced Filters Page Logic ==========
let allProducts = [];
let currentFilters = {
    name: '',
    price: '',
    company: ''
};

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadAllProducts();
});

function setupEventListeners() {
    document.getElementById('searchByNameBtn').addEventListener('click', searchByName);
    document.getElementById('searchByPriceBtn').addEventListener('click', searchByPrice);
    document.getElementById('searchByCompanyBtn').addEventListener('click', searchByCompany);
    document.getElementById('resetFiltersBtn').addEventListener('click', resetAllFilters);
    document.getElementById('loadAllBtn').addEventListener('click', loadAndDisplayAll);

    // Allow Enter key to trigger search
    document.getElementById('nameInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchByName();
    });
    document.getElementById('priceInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchByPrice();
    });
}

async function loadAllProducts() {
    showLoading(true);
    try {
        allProducts = await getAllProducts();
        displayResults(allProducts);
    } finally {
        showLoading(false);
    }
}

async function loadAndDisplayAll() {
    resetAllFilters();
    await loadAllProducts();
    showToast(`Loaded all ${allProducts.length} products`, 'success');
}

async function searchByName() {
    const name = document.getElementById('nameInput').value.trim();

    if (!name) {
        showToast('Please enter a product name', 'error');
        return;
    }

    showLoading(true);
    try {
        currentFilters = { name, price: '', company: '' };
        const results = await getProductsByName(name);
        displayResults(results);
        updateActiveFilters(`Product name contains "${name}"`);
        showToast(`Found ${results.length} product(s) matching "${name}"`, 'success');
    } finally {
        showLoading(false);
    }
}

async function searchByPrice() {
    const price = document.getElementById('priceInput').value;

    if (!price || parseFloat(price) < 0) {
        showToast('Please enter a valid price', 'error');
        return;
    }

    showLoading(true);
    try {
        currentFilters = { name: '', price, company: '' };
        const results = await getProductsByPrice(price);
        displayResults(results);
        updateActiveFilters(`Price at or below $${price}`);
        showToast(`Found ${results.length} product(s)`, 'success');
    } finally {
        showLoading(false);
    }
}

async function searchByCompany() {
    const company = document.getElementById('companySelect').value;

    if (!company) {
        showToast('Please select a company', 'error');
        return;
    }

    showLoading(true);
    try {
        currentFilters = { name: '', price: '', company };
        const results = await getProductsByCompany(company);
        displayResults(results);
        updateActiveFilters(`Company: ${company.charAt(0).toUpperCase() + company.slice(1)}`);
        showToast(`Found ${results.length} product(s) from ${company}`, 'success');
    } finally {
        showLoading(false);
    }
}

function resetAllFilters() {
    document.getElementById('nameInput').value = '';
    document.getElementById('priceInput').value = '';
    document.getElementById('companySelect').value = '';
    currentFilters = { name: '', price: '', company: '' };
    document.getElementById('activeFilters').style.display = 'none';
    displayResults(allProducts);
    showToast('Filters reset', 'info');
}

function displayResults(products) {
    const container = document.getElementById('resultsContainer');
    const noResults = document.getElementById('noResults');
    const count = document.getElementById('resultCount');

    container.innerHTML = '';
    count.textContent = products.length;

    if (products.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    products.forEach(product => {
        container.appendChild(createProductCard(product, true));
    });
}

function updateActiveFilters(filterText) {
    const activeFiltersDiv = document.getElementById('activeFilters');
    document.getElementById('activeFiltersText').textContent = filterText;
    activeFiltersDiv.style.display = 'block';
}

async function deleteProductHandler(productId, productName) {
    if (!confirm(`Delete "${productName}"?`)) return;

    showLoading(true);
    try {
        const success = await deleteProduct(productId);
        if (success) {
            allProducts = allProducts.filter(p => p._id !== productId);
            const container = document.getElementById('resultsContainer');
            const cards = container.querySelectorAll('.product-card');
            const matchingCard = Array.from(cards).find(card => 
                card.textContent.includes(productName)
            );
            if (matchingCard) matchingCard.remove();
            
            showToast(`"${productName}" deleted!`, 'success');
        }
    } finally {
        showLoading(false);
    }
}

function viewProductDetails(productId) {
    sessionStorage.setItem('selectedProductId', productId);
    window.location.href = 'product-detail.html';
}
