// ========== Dashboard Page Logic ==========
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});

async function loadDashboardData() {
    showLoading(true);
    try {
        const products = await getAllProducts();
        
        if (products.length === 0) {
            showToast('No products found. Start by adding some!', 'info');
            updateStats(products);
            displayFeaturedProducts([]);
            showLoading(false);
            return;
        }

        updateStats(products);
        displayFeaturedProducts(products.filter(p => p.featured));
        showToast(`Loaded ${products.length} products`, 'success');
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast('Failed to load dashboard data', 'error');
    } finally {
        showLoading(false);
    }
}

function updateStats(products) {
    const totalProducts = products.length;
    const avgPrice = products.length > 0 
        ? (products.reduce((sum, p) => sum + p.price, 0) / products.length).toFixed(2)
        : '0.00';
    const avgRating = products.length > 0 
        ? (products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)
        : '0';
    const featuredCount = products.filter(p => p.featured).length;

    document.getElementById('totalProductsStat').textContent = totalProducts;
    document.getElementById('avgPriceStat').textContent = `$${avgPrice}`;
    document.getElementById('avgRatingStat').textContent = avgRating;
    document.getElementById('featuredCountStat').textContent = featuredCount;
}

function displayFeaturedProducts(featured) {
    const container = document.getElementById('featuredProductsContainer');
    const noFeatured = document.getElementById('noFeaturedProducts');
    
    container.innerHTML = '';

    if (featured.length === 0) {
        noFeatured.style.display = 'block';
        return;
    }

    noFeatured.style.display = 'none';
    featured.forEach(product => {
        container.appendChild(createProductCard(product, true));
    });
}
