// ========== Product Detail Page Logic ==========
let currentProduct = null;

document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('editProductBtn').addEventListener('click', showEditForm);
    document.getElementById('deleteProductBtn').addEventListener('click', handleDeleteProduct);
    document.getElementById('editProductForm').addEventListener('submit', handleUpdateProduct);
    document.getElementById('cancelEditBtn').addEventListener('click', hideEditForm);
}

async function loadProductDetails() {
    showLoading(true);
    try {
        const productId = sessionStorage.getItem('selectedProductId');
        
        if (!productId) {
            document.getElementById('productDetailsSection').style.display = 'none';
            document.getElementById('noProduct').style.display = 'block';
            showToast('No product selected', 'error');
            showLoading(false);
            return;
        }

        const product = await getProductById(productId);
        
        if (!product) {
            document.getElementById('productDetailsSection').style.display = 'none';
            document.getElementById('noProduct').style.display = 'block';
            showLoading(false);
            return;
        }

        currentProduct = product;
        displayProductDetails(product);
        showToast('Product loaded successfully', 'success');
    } finally {
        showLoading(false);
    }
}

function displayProductDetails(product) {
    const createdDate = new Date(product.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const updatedDate = product.updatedAt 
        ? new Date(product.updatedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : 'Not updated';

    document.getElementById('productName').textContent = product.name;
    document.getElementById('productId').textContent = product._id;
    document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('productCompany').textContent = product.company.charAt(0).toUpperCase() + product.company.slice(1);
    document.getElementById('productRating').textContent = `⭐ ${product.rating}`;
    document.getElementById('productFeatured').textContent = product.featured ? '✅ Yes' : '❌ No';
    document.getElementById('productCreatedAt').textContent = createdDate;
    document.getElementById('productUpdatedAt').textContent = updatedDate;

    // Populate edit form
    document.getElementById('editName').value = product.name;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editCompany').value = product.company;
    document.getElementById('editRating').value = product.rating;
    document.getElementById('editFeatured').checked = product.featured;

    document.getElementById('productDetailsSection').style.display = 'block';
    document.getElementById('noProduct').style.display = 'none';
}

function showEditForm() {
    document.getElementById('editFormSection').style.display = 'block';
    document.getElementById('editFormSection').scrollIntoView({ behavior: 'smooth' });
}

function hideEditForm() {
    document.getElementById('editFormSection').style.display = 'none';
}

async function handleUpdateProduct(e) {
    e.preventDefault();

    const updatedData = {
        name: document.getElementById('editName').value.trim(),
        price: parseFloat(document.getElementById('editPrice').value),
        company: document.getElementById('editCompany').value,
        rating: parseFloat(document.getElementById('editRating').value),
        featured: document.getElementById('editFeatured').checked
    };

    if (!updatedData.name || !updatedData.price || !updatedData.company) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    showLoading(true);
    try {
        const result = await updateProduct(currentProduct._id, updatedData);
        if (result) {
            currentProduct = result;
            displayProductDetails(result);
            hideEditForm();
            showToast('Product updated successfully!', 'success');
        }
    } finally {
        showLoading(false);
    }
}

async function handleDeleteProduct() {
    if (!confirm(`Are you sure you want to delete "${currentProduct.name}"?`)) {
        return;
    }

    if (!confirm('This action cannot be undone. Delete anyway?')) {
        return;
    }

    showLoading(true);
    try {
        const success = await deleteProduct(currentProduct._id);
        if (success) {
            showToast('Product deleted successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1500);
        }
    } finally {
        showLoading(false);
    }
}
