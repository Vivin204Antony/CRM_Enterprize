// Orders Management JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initOrders();
});

// Initialize Orders Page
function initOrders() {
    // Load sample orders data
    loadOrders();

    // Set up event listeners
    const createOrderBtn = document.querySelector('#orders-page .btn-primary');
    if (createOrderBtn) {
        createOrderBtn.addEventListener('click', showAddOrderModal);
    }

    const searchInput = document.getElementById('orders-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterOrders);
    }

    const statusFilter = document.getElementById('filter-order-status');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterOrders);
    }
}

// Load Orders
function loadOrders() {
    const ordersList = document.getElementById('orders-list');
    if (!ordersList) return;

    // Clear current orders
    ordersList.innerHTML = '';

    try {
        // In a real app, this would fetch from API
        // For demo, we'll use sample data
        const orders = [
            {
                id: 'ORD-2023-001',
                customer: 'Arjun Subramaniam',
                amount: 5250.00,
                orderDate: '2023-06-15',
                deliveryDate: '2023-06-28',
                status: 'Processing',
                paymentStatus: 'Paid'
            },
            {
                id: 'ORD-2023-002',
                customer: 'Priya Krishnamurthy',
                amount: 12800.00,
                orderDate: '2023-06-10',
                deliveryDate: '2023-06-25',
                status: 'Shipped',
                paymentStatus: 'Paid'
            },
            {
                id: 'ORD-2023-003',
                customer: 'Deepak Nair',
                amount: 3500.00,
                orderDate: '2023-06-05',
                deliveryDate: '2023-06-20',
                status: 'Delivered',
                paymentStatus: 'Paid'
            },
            {
                id: 'ORD-2023-004',
                customer: 'Ananya Reddy',
                amount: 9700.00,
                orderDate: '2023-05-28',
                deliveryDate: '2023-06-15',
                status: 'Cancelled',
                paymentStatus: 'Refunded'
            },
            {
                id: 'ORD-2023-005',
                customer: 'Karthik Venkatesh',
                amount: 7350.00,
                orderDate: '2023-05-20',
                deliveryDate: '2023-06-10',
                status: 'Delivered',
                paymentStatus: 'Paid'
            }
        ];

        if (orders.length === 0) {
            ordersList.innerHTML = '<tr><td colspan="8" class="text-center">No orders found</td></tr>';
            return;
        }

        // Create rows for each order
        orders.forEach(order => {
            const row = document.createElement('tr');

            // Format dates
            const orderDate = new Date(order.orderDate).toLocaleDateString();
            const deliveryDate = new Date(order.deliveryDate).toLocaleDateString();

            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>₹${order.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td>${orderDate}</td>
                <td>${deliveryDate}</td>
                <td><span class="badge badge-${order.status.toLowerCase()}">${order.status}</span></td>
                <td><span class="badge badge-${order.paymentStatus.toLowerCase().replace(' ', '-')}">${order.paymentStatus}</span></td>
                <td class="actions">
                    <button class="btn btn-icon btn-outline view-order" data-id="${order.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-icon btn-outline edit-order" data-id="${order.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon btn-outline delete-order" data-id="${order.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            ordersList.appendChild(row);
        });

        // Add event listeners to action buttons
        addOrderActionListeners();

    } catch (error) {
        console.error('Error loading orders:', error);
        ordersList.innerHTML = `<tr><td colspan="8" class="text-center">Error loading orders: ${error.message}</td></tr>`;
    }
}

// Filter Orders
function filterOrders() {
    const searchTerm = document.getElementById('orders-search').value.toLowerCase();
    const statusFilter = document.getElementById('filter-order-status').value;

    const rows = document.querySelectorAll('#orders-list tr');

    rows.forEach(row => {
        // Skip header or message rows
        if (row.querySelector('td[colspan]')) return;

        const orderId = row.cells[0].textContent.toLowerCase();
        const customer = row.cells[1].textContent.toLowerCase();
        const status = row.cells[5].textContent.trim();

        const matchesSearch = orderId.includes(searchTerm) || customer.includes(searchTerm);
        const matchesStatus = statusFilter === '' || status === statusFilter;

        if (matchesSearch && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add Order Action Listeners
function addOrderActionListeners() {
    // View order
    document.querySelectorAll('.view-order').forEach(btn => {
        btn.addEventListener('click', () => {
            alert(`View Order ${btn.dataset.id} - This would open the order details view`);
        });
    });

    // Edit order
    document.querySelectorAll('.edit-order').forEach(btn => {
        btn.addEventListener('click', () => {
            alert(`Edit Order ${btn.dataset.id} - This would open the order edit modal`);
        });
    });

    // Delete order
    document.querySelectorAll('.delete-order').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete Order ${btn.dataset.id}?`)) {
                // In a real app, this would send a delete request to the API
                alert(`Order ${btn.dataset.id} has been deleted`);
                btn.closest('tr').remove();
            }
        });
    });
}

// Show Add Order Modal
function showAddOrderModal() {
    alert('Create Order - This would open a modal to create a new order');
} 