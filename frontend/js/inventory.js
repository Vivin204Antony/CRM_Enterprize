// Inventory Management JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initInventory();
});

// Initialize Inventory Page
function initInventory() {
    // Load sample inventory data
    loadInventory();

    // Set up event listeners
    const importBtn = document.querySelector('#inventory-page .btn-outline:first-child');
    if (importBtn) {
        importBtn.addEventListener('click', handleImportInventory);
    }

    const exportBtn = document.querySelector('#inventory-page .btn-outline:last-child');
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExportInventory);
    }

    const searchInput = document.getElementById('inventory-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterInventory);
    }

    const statusFilter = document.getElementById('filter-inventory-status');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterInventory);
    }
}

// Load Inventory
function loadInventory() {
    const inventoryList = document.getElementById('inventory-list');
    if (!inventoryList) return;

    // Clear current inventory
    inventoryList.innerHTML = '';

    try {
        // In a real app, this would fetch from API
        // For demo, we'll use sample data
        const inventory = [
            {
                id: 'INV-001',
                product: 'Enterprise CRM Pro License',
                sku: 'SW-CRM-PRO-01',
                quantity: 'Unlimited',
                location: 'Digital Warehouse',
                lastUpdated: '2023-06-15',
                status: 'In Stock'
            },
            {
                id: 'INV-002',
                product: 'Enterprise CRM Team License (5 users)',
                sku: 'SW-CRM-TEAM-05',
                quantity: 'Unlimited',
                location: 'Digital Warehouse',
                lastUpdated: '2023-06-10',
                status: 'In Stock'
            },
            {
                id: 'INV-003',
                product: 'Cloud Storage Addon (1TB)',
                sku: 'SVC-CLOUD-1TB',
                quantity: 'Unlimited',
                location: 'Cloud Provider',
                lastUpdated: '2023-06-12',
                status: 'In Stock'
            },
            {
                id: 'INV-004',
                product: 'Premium Support Package (Annual)',
                sku: 'SVC-SUP-PREM-Y',
                quantity: '15',
                location: 'Support Department',
                lastUpdated: '2023-06-05',
                status: 'Limited'
            },
            {
                id: 'INV-005',
                product: 'CRM Implementation Consulting',
                sku: 'SVC-IMPL-CRM',
                quantity: '8',
                location: 'Consulting Division',
                lastUpdated: '2023-05-28',
                status: 'Limited'
            },
            {
                id: 'INV-006',
                product: 'Legacy CRM Import Tool',
                sku: 'SW-CRM-IMP-01',
                quantity: 'Unlimited',
                location: 'Digital Warehouse',
                lastUpdated: '2023-04-15',
                status: 'Discontinued'
            }
        ];

        if (inventory.length === 0) {
            inventoryList.innerHTML = '<tr><td colspan="7" class="text-center">No inventory items found</td></tr>';
            return;
        }

        // Create rows for each inventory item
        inventory.forEach(item => {
            const row = document.createElement('tr');

            // Format date
            const lastUpdated = new Date(item.lastUpdated).toLocaleDateString();

            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.product}</td>
                <td>${item.sku}</td>
                <td>${item.quantity}</td>
                <td>${item.location}</td>
                <td>${lastUpdated}</td>
                <td><span class="badge badge-${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span></td>
                <td class="actions">
                    <button class="btn btn-icon btn-outline update-inventory" data-id="${item.id}">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                    <button class="btn btn-icon btn-outline edit-inventory" data-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon btn-outline history-inventory" data-id="${item.id}">
                        <i class="fas fa-history"></i>
                    </button>
                </td>
            `;

            inventoryList.appendChild(row);
        });

        // Add event listeners to action buttons
        addInventoryActionListeners();

    } catch (error) {
        console.error('Error loading inventory:', error);
        inventoryList.innerHTML = `<tr><td colspan="8" class="text-center">Error loading inventory: ${error.message}</td></tr>`;
    }
}

// Filter Inventory
function filterInventory() {
    const searchTerm = document.getElementById('inventory-search').value.toLowerCase();
    const statusFilter = document.getElementById('filter-inventory-status').value;

    const rows = document.querySelectorAll('#inventory-list tr');

    rows.forEach(row => {
        // Skip header or message rows
        if (row.querySelector('td[colspan]')) return;

        const product = row.cells[1].textContent.toLowerCase();
        const sku = row.cells[2].textContent.toLowerCase();
        const status = row.cells[6].textContent.trim();

        const matchesSearch = product.includes(searchTerm) || sku.includes(searchTerm);
        const matchesStatus = statusFilter === '' || status === statusFilter;

        if (matchesSearch && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add Inventory Action Listeners
function addInventoryActionListeners() {
    // Update inventory
    document.querySelectorAll('.update-inventory').forEach(btn => {
        btn.addEventListener('click', () => {
            alert(`Update Inventory ${btn.dataset.id} - This would open an inventory update form`);
        });
    });

    // Edit inventory
    document.querySelectorAll('.edit-inventory').forEach(btn => {
        btn.addEventListener('click', () => {
            alert(`Edit Inventory ${btn.dataset.id} - This would open the inventory edit form`);
        });
    });

    // View history
    document.querySelectorAll('.history-inventory').forEach(btn => {
        btn.addEventListener('click', () => {
            alert(`View History for ${btn.dataset.id} - This would show inventory history`);
        });
    });
}

// Handle Import Inventory
function handleImportInventory() {
    alert('Import Inventory - This would open a file upload dialog for CSV/Excel import');
}

// Handle Export Inventory
function handleExportInventory() {
    alert('Export Inventory - This would generate and download a CSV/Excel file of inventory');
} 