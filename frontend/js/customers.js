// API_URL is defined in common.js

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    loadSidebar();
    loadHeader();

    // Initialize tabs
    initTabs();
    initFormTabs();

    // Load data
    loadCustomers();
    loadUsers();

    // Event listeners
    document.getElementById('add-customer-btn').addEventListener('click', showAddCustomerModal);
    document.getElementById('customer-search').addEventListener('input', filterCustomers);
    document.getElementById('filter-status').addEventListener('change', filterCustomers);
    document.getElementById('filter-industry').addEventListener('change', filterCustomers);
    document.getElementById('filter-account-manager').addEventListener('change', filterCustomers);
    document.getElementById('select-all-customers').addEventListener('change', toggleSelectAllCustomers);

    // Import/Export buttons
    document.getElementById('import-customers-btn').addEventListener('click', importCustomers);
    document.getElementById('export-customers-btn').addEventListener('click', exportCustomers);

    // Modal actions
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    document.querySelector('.save-customer-btn').addEventListener('click', saveCustomer);
    document.querySelector('.edit-customer-btn').addEventListener('click', () => {
        const customerId = document.querySelector('.edit-customer-btn').dataset.id;
        closeModals();
        showEditCustomerModal(customerId);
    });

    // Customer details tab actions
    document.getElementById('add-task-btn').addEventListener('click', showAddTaskModal);
    document.getElementById('add-note-btn').addEventListener('click', showAddNoteModal);
    document.getElementById('add-deal-btn').addEventListener('click', showAddDealModal);

    // Task checkboxes
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', toggleTaskStatus);
    });

    // Custom fields
    document.getElementById('add-custom-field-btn').addEventListener('click', addCustomField);

    // View customer tabs event listeners
    const customersTable = document.getElementById('customers-list');
    if (customersTable) {
        // View customer buttons
        const viewButtons = customersTable.querySelectorAll('.view-customer');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => showCustomerDetails(btn.dataset.id));
        });

        // Edit customer buttons
        const editButtons = customersTable.querySelectorAll('.edit-customer');
        editButtons.forEach(btn => {
            btn.addEventListener('click', () => showEditCustomerModal(btn.dataset.id));
        });

        // Delete customer buttons
        const deleteButtons = customersTable.querySelectorAll('.delete-customer');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', () => deleteCustomer(btn.dataset.id));
        });
    }
});

// Initialize Tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-navigation .tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;

            // Find the nearest tab-navigation parent to handle multiple tab groups
            const tabNavigation = btn.closest('.tab-navigation');
            const tabContent = tabNavigation.nextElementSibling;

            // Deactivate all tabs in this group
            tabNavigation.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabContent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            // Activate selected tab
            btn.classList.add('active');
            tabContent.querySelector(`#${tabId}`).classList.add('active');
        });
    });
}

// Initialize Form Tabs
function initFormTabs() {
    const formTabButtons = document.querySelectorAll('.form-tabs .tab-btn');

    formTabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission
            const tabId = btn.dataset.tab;

            // Find the nearest tab-navigation parent
            const tabNavigation = btn.closest('.tab-navigation');
            const tabContent = tabNavigation.nextElementSibling;

            // Deactivate all tabs in this group
            tabNavigation.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabContent.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

            // Activate selected tab
            btn.classList.add('active');
            tabContent.querySelector(`#${tabId}`).classList.add('active');
        });
    });
}

// Load Customers
function loadCustomers() {
    // Fetch customers from the API
    fetch(`${API_URL}/customers`)
        .then(response => response.json())
        .then(customers => {
            // Filter out leads for the customers view if needed
            const activeCustomers = customers.filter(customer => customer.status !== 'Lead');

            // Get the customers table
            const customersTable = document.getElementById('customers-list');
            customersTable.innerHTML = '';

            // Populate with data from MongoDB
            activeCustomers.forEach(customer => {
                const row = document.createElement('tr');

                // Calculate relative time for created date
                const createdDate = new Date(customer.createdAt);
                const now = new Date();
                const daysAgo = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
                let createdText = '';

                if (daysAgo === 0) {
                    createdText = 'Today';
                } else if (daysAgo === 1) {
                    createdText = 'Yesterday';
                } else if (daysAgo < 30) {
                    createdText = `${daysAgo} days ago`;
                } else if (daysAgo < 365) {
                    createdText = `${Math.floor(daysAgo / 30)} month(s) ago`;
                } else {
                    createdText = `${Math.floor(daysAgo / 365)} year(s) ago`;
                }

                // Assign account manager based on ID (alternating)
                const accountManagers = ['Jane Doe', 'Robert Brown', 'Emily Davis'];
                const accountManager = accountManagers[customer._id.toString().charCodeAt(0) % accountManagers.length];

                // Set industry if not available
                const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing'];
                const industry = customer.industry || industries[customer._id.toString().charCodeAt(1) % industries.length];

                row.innerHTML = `
                    <td><input type="checkbox" class="select-customer"></td>
                    <td>${customer.name}</td>
                    <td>${customer.email}</td>
                    <td>${customer.phone || 'N/A'}</td>
                    <td>${customer.company || 'N/A'}</td>
                    <td>${industry}</td>
                    <td><span class="badge badge-${customer.status.toLowerCase()}">${customer.status}</span></td>
                    <td>${accountManager}</td>
                    <td>${createdText}</td>
                    <td class="actions">
                        <button class="btn btn-icon btn-outline view-customer" data-id="${customer._id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-icon btn-outline edit-customer" data-id="${customer._id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-outline delete-customer" data-id="${customer._id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;

                customersTable.appendChild(row);
            });

            // Also populate the different customer tabs
            populateCustomerTabs(customers);

            // Add event listeners
            addCustomerRowEventListeners();
        })
        .catch(error => {
            console.error('Error fetching customers:', error);
            // Display error message
            const customersTable = document.getElementById('customers-list');
            customersTable.innerHTML = `<tr><td colspan="10" class="text-center">Error loading customers: ${error.message}</td></tr>`;
        });
}

// Populate different customer tabs with filtered data
function populateCustomerTabs(customers) {
    // Get the tab panes
    const activeCustomersPane = document.getElementById('active-customers');
    const inactiveCustomersPane = document.getElementById('inactive-customers');
    const leadsCustomersPane = document.getElementById('leads-customers');

    if (activeCustomersPane) {
        // Filter for active customers
        const activeCustomers = customers.filter(customer => customer.status === 'Active');

        // Create a table for active customers
        activeCustomersPane.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th><input type="checkbox" class="select-all-active"></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Industry</th>
                            <th>Account Manager</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="active-customers-list">
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <button class="btn btn-sm btn-outline" disabled>Previous</button>
                <span class="pagination-info">Showing 1-${activeCustomers.length} of ${activeCustomers.length}</span>
                <button class="btn btn-sm btn-outline" disabled>Next</button>
            </div>
        `;

        // Populate the active customers table
        const activeCustomersList = document.getElementById('active-customers-list');
        populateCustomerList(activeCustomersList, activeCustomers);
    }

    if (inactiveCustomersPane) {
        // Filter for inactive customers
        const inactiveCustomers = customers.filter(customer => customer.status === 'Inactive');

        // Create a table for inactive customers
        inactiveCustomersPane.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th><input type="checkbox" class="select-all-inactive"></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Industry</th>
                            <th>Account Manager</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="inactive-customers-list">
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <button class="btn btn-sm btn-outline" disabled>Previous</button>
                <span class="pagination-info">Showing 1-${inactiveCustomers.length} of ${inactiveCustomers.length}</span>
                <button class="btn btn-sm btn-outline" disabled>Next</button>
            </div>
        `;

        // Populate the inactive customers table
        const inactiveCustomersList = document.getElementById('inactive-customers-list');
        populateCustomerList(inactiveCustomersList, inactiveCustomers);
    }

    if (leadsCustomersPane) {
        // Filter for lead customers
        const leadCustomers = customers.filter(customer => customer.status === 'Lead');

        // Create a table for lead customers
        leadsCustomersPane.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th><input type="checkbox" class="select-all-leads"></th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Industry</th>
                            <th>Account Manager</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="leads-customers-list">
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <button class="btn btn-sm btn-outline" disabled>Previous</button>
                <span class="pagination-info">Showing 1-${leadCustomers.length} of ${leadCustomers.length}</span>
                <button class="btn btn-sm btn-outline" disabled>Next</button>
            </div>
        `;

        // Populate the lead customers table
        const leadsCustomersList = document.getElementById('leads-customers-list');
        populateCustomerList(leadsCustomersList, leadCustomers);
    }
}

// Helper function to populate a customer list
function populateCustomerList(listElement, customers) {
    if (!listElement) return;

    customers.forEach(customer => {
        const row = document.createElement('tr');

        // Calculate relative time for created date
        const createdDate = new Date(customer.createdAt);
        const now = new Date();
        const daysAgo = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
        let createdText = '';

        if (daysAgo === 0) {
            createdText = 'Today';
        } else if (daysAgo === 1) {
            createdText = 'Yesterday';
        } else if (daysAgo < 30) {
            createdText = `${daysAgo} days ago`;
        } else if (daysAgo < 365) {
            createdText = `${Math.floor(daysAgo / 30)} month(s) ago`;
        } else {
            createdText = `${Math.floor(daysAgo / 365)} year(s) ago`;
        }

        // Assign account manager based on ID (alternating)
        const accountManagers = ['Jane Doe', 'Robert Brown', 'Emily Davis'];
        const accountManager = accountManagers[customer._id.toString().charCodeAt(0) % accountManagers.length];

        // Set industry if not available
        const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing'];
        const industry = customer.industry || industries[customer._id.toString().charCodeAt(1) % industries.length];

        row.innerHTML = `
            <td><input type="checkbox" class="select-customer"></td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone || 'N/A'}</td>
            <td>${customer.company || 'N/A'}</td>
            <td>${industry}</td>
            <td>${accountManager}</td>
            <td>${createdText}</td>
            <td class="actions">
                <button class="btn btn-icon btn-outline view-customer" data-id="${customer._id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-icon btn-outline edit-customer" data-id="${customer._id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-icon btn-outline delete-customer" data-id="${customer._id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        listElement.appendChild(row);
    });

    // Add event listeners to the new rows
    addCustomerRowEventListeners();
}

// Load Users for Account Manager dropdown
function loadUsers() {
    // This would typically fetch users from the API
    // For now, we'll add some sample data
    const accountManagerSelect = document.getElementById('filter-account-manager');
    const customerAccountManagerSelect = document.getElementById('customer-account-manager');

    const users = [
        { id: 1, name: 'Jane Doe' },
        { id: 2, name: 'Robert Brown' },
        { id: 3, name: 'Emily Davis' }
    ];

    users.forEach(user => {
        // For filter dropdown
        const option1 = document.createElement('option');
        option1.value = user.id;
        option1.textContent = user.name;
        accountManagerSelect.appendChild(option1);

        // For form dropdown
        const option2 = document.createElement('option');
        option2.value = user.id;
        option2.textContent = user.name;
        customerAccountManagerSelect.appendChild(option2);
    });
}

// Add Event Listeners to Customer Rows
function addCustomerRowEventListeners() {
    const rows = document.querySelectorAll('#customers-list tr');

    rows.forEach(row => {
        const viewBtn = row.querySelector('.view-customer');
        const editBtn = row.querySelector('.edit-customer');
        const deleteBtn = row.querySelector('.delete-customer');

        if (viewBtn) {
            viewBtn.addEventListener('click', () => showCustomerDetails(viewBtn.dataset.id));
        }

        if (editBtn) {
            editBtn.addEventListener('click', () => showEditCustomerModal(editBtn.dataset.id));
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteCustomer(deleteBtn.dataset.id));
        }
    });
}

// Filter Customers
function filterCustomers() {
    const searchTerm = document.getElementById('customer-search').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const industryFilter = document.getElementById('filter-industry').value;
    const accountManagerFilter = document.getElementById('filter-account-manager').value;

    const rows = document.querySelectorAll('#customers-list tr');

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        const company = row.cells[4].textContent.toLowerCase();
        const industry = row.cells[5].textContent.trim();
        const status = row.cells[6].textContent.trim();
        const accountManager = row.cells[7].textContent.trim();

        const matchesSearch = name.includes(searchTerm) ||
            email.includes(searchTerm) ||
            company.includes(searchTerm);

        const matchesStatus = statusFilter === '' || status.includes(statusFilter);
        const matchesIndustry = industryFilter === '' || industry === industryFilter;
        const matchesAccountManager = accountManagerFilter === '' ||
            accountManager === document.getElementById('filter-account-manager')
                .options[document.getElementById('filter-account-manager')
                    .selectedIndex].text;

        if (matchesSearch && matchesStatus && matchesIndustry && matchesAccountManager) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    updatePagination();
}

// Toggle Select All Customers
function toggleSelectAllCustomers() {
    const isChecked = document.getElementById('select-all-customers').checked;
    document.querySelectorAll('.select-customer').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
}

// Update Pagination
function updatePagination() {
    const visibleRows = document.querySelectorAll('#customers-list tr:not([style*="display: none"])');
    const paginationInfo = document.querySelector('.pagination-info');

    if (paginationInfo) {
        paginationInfo.textContent = `Showing 1-${visibleRows.length} of ${visibleRows.length}`;
    }
}

// Show Customer Details
function showCustomerDetails(customerId) {
    const modal = document.getElementById('view-customer-modal');

    // In a real application, you would fetch customer details from the API
    // For now, we'll use data from the table row
    const customerRow = document.querySelector(`#customers-list tr button[data-id="${customerId}"]`).closest('tr');

    const name = customerRow.cells[1].textContent;
    const email = customerRow.cells[2].textContent;
    const phone = customerRow.cells[3].textContent;
    const company = customerRow.cells[4].textContent;
    const industry = customerRow.cells[5].textContent;
    const statusText = customerRow.cells[6].querySelector('.badge').textContent;
    const accountManager = customerRow.cells[7].textContent;

    // Set customer ID for the edit button
    document.querySelector('.edit-customer-btn').dataset.id = customerId;

    // Update modal title and company information
    document.getElementById('customer-name-title').textContent = name;
    document.getElementById('customer-company').textContent = company;

    // Update status badge
    const statusBadge = document.getElementById('customer-status');
    statusBadge.textContent = statusText;
    statusBadge.className = `badge badge-${statusText.toLowerCase()}`;

    // Update overview details
    document.getElementById('detail-contact-name').textContent = name;
    document.getElementById('detail-email').textContent = email;
    document.getElementById('detail-phone').textContent = phone;
    document.getElementById('detail-website').textContent = 'www.example.com'; // Would come from API
    document.getElementById('detail-industry').textContent = industry;
    document.getElementById('detail-size').textContent = 'Medium'; // Would come from API
    document.getElementById('detail-revenue').textContent = '$5M - $10M'; // Would come from API
    document.getElementById('detail-founded').textContent = '2005'; // Would come from API
    document.getElementById('detail-street').textContent = '123 Main St'; // Would come from API
    document.getElementById('detail-city').textContent = 'San Francisco'; // Would come from API
    document.getElementById('detail-state').textContent = 'CA'; // Would come from API
    document.getElementById('detail-postal').textContent = '94105'; // Would come from API
    document.getElementById('detail-country').textContent = 'USA'; // Would come from API
    document.getElementById('detail-account-manager').textContent = accountManager;
    document.getElementById('detail-status').textContent = statusText;
    document.getElementById('detail-customer-since').textContent = 'Jan 15, 2022'; // Would come from API

    // Show the modal
    modal.classList.add('active');
}

// Show Add Customer Modal
function showAddCustomerModal() {
    const modal = document.getElementById('customer-modal');
    const title = document.getElementById('customer-modal-title');
    const form = document.getElementById('customer-form');

    title.textContent = 'Add Customer';
    form.reset();

    // Clear custom fields
    document.getElementById('custom-fields-container').innerHTML = '';

    // Reset to first tab
    const firstTabBtn = document.querySelector('#customer-modal .tab-btn');
    const firstTabPane = document.querySelector('#customer-modal .tab-pane');

    document.querySelectorAll('#customer-modal .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('#customer-modal .tab-pane').forEach(pane => pane.classList.remove('active'));

    firstTabBtn.classList.add('active');
    firstTabPane.classList.add('active');

    // Clear hidden ID field
    document.getElementById('customer-id').value = '';

    // Show the modal
    modal.classList.add('active');
}

// Show Edit Customer Modal
function showEditCustomerModal(customerId) {
    const modal = document.getElementById('customer-modal');
    const title = document.getElementById('customer-modal-title');
    const form = document.getElementById('customer-form');

    title.textContent = 'Edit Customer';

    // This would typically fetch the customer data from the API
    // For now, use dummy data based on the rows in the table
    const customerRow = document.querySelector(`#customers-list tr button[data-id="${customerId}"]`).closest('tr');

    const name = customerRow.cells[1].textContent;
    const email = customerRow.cells[2].textContent;
    const phone = customerRow.cells[3].textContent;
    const company = customerRow.cells[4].textContent;
    const industry = customerRow.cells[5].textContent;
    const status = customerRow.cells[6].querySelector('.badge').textContent;
    const accountManager = customerRow.cells[7].textContent;

    // Reset to first tab
    const firstTabBtn = document.querySelector('#customer-modal .tab-btn');
    const firstTabPane = document.querySelector('#customer-modal .tab-pane');

    document.querySelectorAll('#customer-modal .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('#customer-modal .tab-pane').forEach(pane => pane.classList.remove('active'));

    firstTabBtn.classList.add('active');
    firstTabPane.classList.add('active');

    // Set hidden ID field
    document.getElementById('customer-id').value = customerId;

    // Set form values
    document.getElementById('customer-name').value = name;
    document.getElementById('customer-email').value = email;
    document.getElementById('customer-phone').value = phone;
    document.getElementById('customer-company-name').value = company;
    document.getElementById('customer-website').value = 'https://www.example.com'; // Would come from API
    document.getElementById('customer-status').value = status;

    // Find the account manager ID that matches the name
    const accountManagerOptions = document.getElementById('customer-account-manager').options;
    for (let i = 0; i < accountManagerOptions.length; i++) {
        if (accountManagerOptions[i].text === accountManager) {
            document.getElementById('customer-account-manager').value = accountManagerOptions[i].value;
            break;
        }
    }

    // Set industry
    document.getElementById('customer-industry').value = industry;

    // Set other values (would come from API in real implementation)
    document.getElementById('customer-size').value = 'Medium';
    document.getElementById('customer-revenue').value = '$5M - $10M';
    document.getElementById('customer-founded').value = '2005';
    document.getElementById('customer-street').value = '123 Main St';
    document.getElementById('customer-city').value = 'San Francisco';
    document.getElementById('customer-state').value = 'CA';
    document.getElementById('customer-postal').value = '94105';
    document.getElementById('customer-country').value = 'US';
    document.getElementById('customer-tags').value = 'VIP, Enterprise';
    document.getElementById('customer-source').value = 'Website';
    document.getElementById('customer-notes').value = 'Customer is interested in our new analytics feature.';

    // Clear custom fields
    document.getElementById('custom-fields-container').innerHTML = '';

    // Add sample custom fields
    addCustomField('Industry Segment', 'SaaS');
    addCustomField('Contract Type', 'Annual');

    // Show the modal
    modal.classList.add('active');
}

// Save Customer
function saveCustomer() {
    const customerId = document.getElementById('customer-id').value;
    const isEditing = !!customerId;

    // Get form data from all tabs
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const phone = document.getElementById('customer-phone').value;
    const company = document.getElementById('customer-company-name').value;
    const website = document.getElementById('customer-website').value;
    const status = document.getElementById('customer-status').value;
    const accountManagerId = document.getElementById('customer-account-manager').value;
    const accountManagerName = accountManagerId ?
        document.getElementById('customer-account-manager').options[document.getElementById('customer-account-manager').selectedIndex].text :
        '';

    const industry = document.getElementById('customer-industry').value;
    const size = document.getElementById('customer-size').value;
    const revenue = document.getElementById('customer-revenue').value;
    const founded = document.getElementById('customer-founded').value;

    const street = document.getElementById('customer-street').value;
    const city = document.getElementById('customer-city').value;
    const state = document.getElementById('customer-state').value;
    const postalCode = document.getElementById('customer-postal').value;
    const country = document.getElementById('customer-country').value;

    const tags = document.getElementById('customer-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const source = document.getElementById('customer-source').value;
    const notes = document.getElementById('customer-notes').value;

    // Get custom fields
    const customFieldsContainer = document.getElementById('custom-fields-container');
    const customFields = {};

    customFieldsContainer.querySelectorAll('.custom-field-row').forEach(row => {
        const key = row.querySelector('.custom-field-key').value;
        const value = row.querySelector('.custom-field-value').value;
        if (key && value) {
            customFields[key] = value;
        }
    });

    // In a real application, you would send this data to the API
    console.log('Saving customer:', {
        id: customerId,
        name,
        email,
        phone,
        company,
        website,
        status,
        accountManager: {
            id: accountManagerId,
            name: accountManagerName
        },
        industry,
        size,
        revenue,
        founded,
        address: {
            street,
            city,
            state,
            postalCode,
            country
        },
        tags,
        source,
        notes,
        customFields
    });

    // For demo purposes, update the UI directly
    if (isEditing) {
        // Update existing row
        const customerRow = document.querySelector(`#customers-list tr button[data-id="${customerId}"]`).closest('tr');

        customerRow.cells[1].textContent = name;
        customerRow.cells[2].textContent = email;
        customerRow.cells[3].textContent = phone;
        customerRow.cells[4].textContent = company;
        customerRow.cells[5].textContent = industry;
        customerRow.cells[6].innerHTML = `<span class="badge badge-${status.toLowerCase()}">${status}</span>`;
        customerRow.cells[7].textContent = accountManagerName;
    } else {
        // Add new row
        const tbody = document.getElementById('customers-list');
        const newRow = document.createElement('tr');

        // Generate a new ID (would be returned by API in real app)
        const newId = Date.now().toString();

        newRow.innerHTML = `
      <td><input type="checkbox" class="select-customer"></td>
      <td>${name}</td>
      <td>${email}</td>
      <td>${phone}</td>
      <td>${company}</td>
      <td>${industry}</td>
      <td><span class="badge badge-${status.toLowerCase()}">${status}</span></td>
      <td>${accountManagerName}</td>
      <td>Just now</td>
      <td class="actions">
        <button class="btn btn-icon btn-outline view-customer" data-id="${newId}">
          <i class="fas fa-eye"></i>
        </button>
        <button class="btn btn-icon btn-outline edit-customer" data-id="${newId}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-icon btn-outline delete-customer" data-id="${newId}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

        tbody.insertBefore(newRow, tbody.firstChild);

        // Add event listeners to new buttons
        const viewBtn = newRow.querySelector('.view-customer');
        const editBtn = newRow.querySelector('.edit-customer');
        const deleteBtn = newRow.querySelector('.delete-customer');

        viewBtn.addEventListener('click', () => showCustomerDetails(newId));
        editBtn.addEventListener('click', () => showEditCustomerModal(newId));
        deleteBtn.addEventListener('click', () => deleteCustomer(newId));
    }

    // Close modal
    closeModals();

    // Show success message
    showSuccess(`Customer ${isEditing ? 'updated' : 'added'} successfully!`);
}

// Delete Customer
function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
        // This would typically send a request to the API to delete the customer
        console.log('Deleting customer:', customerId);

        // For demo purposes, remove the row from the table
        const customerRow = document.querySelector(`#customers-list tr button[data-id="${customerId}"]`).closest('tr');
        customerRow.remove();

        // Update pagination
        updatePagination();

        // Show success message
        showSuccess('Customer deleted successfully!');
    }
}

// Import Customers
function importCustomers() {
    // Create a hidden file input and trigger it
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.xlsx,.xls';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real application, you would upload the file to the server
            console.log('Selected file for import:', file.name);

            // Show a processing message
            alert(`Importing customers from ${file.name}. This would be processed on the server in a real application.`);
        }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

// Export Customers
function exportCustomers() {
    // In a real application, you would get the data from the API and generate a file
    console.log('Exporting customers');

    // For demo purposes, create a fake CSV content
    const csvContent = `Name,Email,Phone,Company,Industry,Status,Account Manager
John Smith,john@example.com,(555) 123-4567,Acme Corporation,Technology,Active,Jane Doe
Sarah Johnson,sarah@techcorp.com,(555) 987-6543,Tech Corporation,Technology,Active,Robert Brown
Michael Brown,michael@globalhealth.org,(555) 456-7890,Global Health,Healthcare,Inactive,Jane Doe`;

    // Create a Blob object from the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a download link and trigger it
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'customers-export.csv');
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Show Add Task Modal
function showAddTaskModal() {
    alert('Add Task modal would appear here');
    // In a real application, you would show a modal for adding a task
}

// Show Add Note Modal
function showAddNoteModal() {
    alert('Add Note modal would appear here');
    // In a real application, you would show a modal for adding a note
}

// Show Add Deal Modal
function showAddDealModal() {
    alert('Add Deal modal would appear here');
    // In a real application, you would show a modal for adding a deal
}

// Toggle Task Status
function toggleTaskStatus() {
    this.classList.toggle('checked');

    const taskTitle = this.nextElementSibling.querySelector('.task-title');
    taskTitle.classList.toggle('completed');

    // In a real application, you would update the task status in the API
    console.log('Toggling task status:', this.dataset.id);
}

// Add Custom Field
function addCustomField(key = '', value = '') {
    const container = document.getElementById('custom-fields-container');
    const fieldRow = document.createElement('div');
    fieldRow.className = 'custom-field-row';

    fieldRow.innerHTML = `
    <div class="form-row">
      <div class="form-group">
        <input type="text" class="custom-field-key" placeholder="Field Name" value="${key}">
      </div>
      <div class="form-group">
        <input type="text" class="custom-field-value" placeholder="Field Value" value="${value}">
      </div>
      <div class="form-group-action">
        <button type="button" class="btn btn-icon btn-sm btn-outline remove-custom-field">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `;

    container.appendChild(fieldRow);

    // Add event listener to remove button
    fieldRow.querySelector('.remove-custom-field').addEventListener('click', () => {
        container.removeChild(fieldRow);
    });
}

// Close Modals
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// Show Success Message
function showSuccess(message) {
    // Create success toast
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    </div>
    <button class="toast-close">&times;</button>
  `;

    // Add to DOM
    document.body.appendChild(toast);

    // Add close button event
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });

    // Auto close after 5 seconds
    setTimeout(() => {
        toast.classList.add('toast-hiding');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 5000);
} 