// Products Management JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
});

// Initialize Products Page
function initProducts() {
    // Load sample products data
    loadProducts();

    // Set up event listeners
    const addProductBtn = document.querySelector('#products-page .btn-primary');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', showAddProductModal);
    }

    const searchInput = document.getElementById('products-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    const categoryFilter = document.getElementById('filter-product-category');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
}

// Load Products
function loadProducts() {
    const productsList = document.getElementById('products-list');
    if (!productsList) return;

    // Clear current products
    productsList.innerHTML = '';

    try {
        // In a real app, this would fetch from API
        // For demo, we'll use sample data
        const products = [
            {
                id: 'PRD-001',
                name: 'Enterprise CRM Pro License',
                category: 'Software',
                price: 1299.99,
                sku: 'SW-CRM-PRO-01',
                stock: 'Unlimited',
                status: 'Active'
            },
            {
                id: 'PRD-002',
                name: 'Enterprise CRM Team License (5 users)',
                category: 'Software',
                price: 4999.95,
                sku: 'SW-CRM-TEAM-05',
                stock: 'Unlimited',
                status: 'Active'
            },
            {
                id: 'PRD-003',
                name: 'Cloud Storage Addon (1TB)',
                category: 'Service',
                price: 199.99,
                sku: 'SVC-CLOUD-1TB',
                stock: 'Unlimited',
                status: 'Active'
            },
            {
                id: 'PRD-004',
                name: 'Premium Support Package (Annual)',
                category: 'Service',
                price: 2500.00,
                sku: 'SVC-SUP-PREM-Y',
                stock: 'Limited',
                status: 'Active'
            },
            {
                id: 'PRD-005',
                name: 'CRM Implementation Consulting',
                category: 'Service',
                price: 5000.00,
                sku: 'SVC-IMPL-CRM',
                stock: 'Limited',
                status: 'Active'
            },
            {
                id: 'PRD-006',
                name: 'Legacy CRM Import Tool',
                category: 'Software',
                price: 499.99,
                sku: 'SW-CRM-IMP-01',
                stock: 'Unlimited',
                status: 'Discontinued'
            }
        ];

        if (products.length === 0) {
            productsList.innerHTML = '<tr><td colspan="7" class="text-center">No products found</td></tr>';
            return;
        }

        // Create rows for each product
        products.forEach(product => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>₹${product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td>${product.sku}</td>
                <td>${product.stock}</td>
                <td><span class="badge badge-${product.status.toLowerCase()}">${product.status}</span></td>
                <td class="actions">
                    <button class="btn btn-icon btn-outline view-product" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-icon btn-outline edit-product" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon btn-outline delete-product" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            productsList.appendChild(row);
        });

        // Add event listeners to action buttons
        addProductActionListeners();

    } catch (error) {
        console.error('Error loading products:', error);
        productsList.innerHTML = `<tr><td colspan="7" class="text-center">Error loading products: ${error.message}</td></tr>`;
    }
}

// Filter Products
function filterProducts() {
    const searchTerm = document.getElementById('products-search').value.toLowerCase();
    const categoryFilter = document.getElementById('filter-product-category').value;

    const rows = document.querySelectorAll('#products-list tr');

    rows.forEach(row => {
        // Skip header or message rows
        if (row.querySelector('td[colspan]')) return;

        const productName = row.cells[1].textContent.toLowerCase();
        const productCategory = row.cells[2].textContent;
        const productSku = row.cells[4].textContent.toLowerCase();

        const matchesSearch = productName.includes(searchTerm) || productSku.includes(searchTerm);
        const matchesCategory = categoryFilter === '' || productCategory === categoryFilter;

        if (matchesSearch && matchesCategory) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add Product Action Listeners
function addProductActionListeners() {
    // View product
    document.querySelectorAll('.view-product').forEach(btn => {
        btn.addEventListener('click', () => {
            alert(`View Product ${btn.dataset.id} - This would open the product details view`);
        });
    });

    // Edit product
    document.querySelectorAll('.edit-product').forEach(btn => {
        btn.addEventListener('click', () => {
            alert(`Edit Product ${btn.dataset.id} - This would open the product edit modal`);
        });
    });

    // Delete product
    document.querySelectorAll('.delete-product').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete Product ${btn.dataset.id}?`)) {
                // In a real app, this would send a delete request to the API
                alert(`Product ${btn.dataset.id} has been deleted`);
                btn.closest('tr').remove();
            }
        });
    });
}

// Show Add Product Modal
function showAddProductModal() {
    alert('Add Product - This would open a modal to add a new product');
} 