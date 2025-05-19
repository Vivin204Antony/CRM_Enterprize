// DOM Elements
// API_URL is defined in common.js

document.addEventListener('DOMContentLoaded', () => {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');

    // Add event listener to each nav link
    navLinks.forEach(link => {
        link.addEventListener('click', changePage);
    });

    // Initialize the app
    initApp();

    // Handle hash routing on initial load
    handleHashRouting();

    // Handle hash changes
    window.addEventListener('hashchange', handleHashRouting);

    // Expose changePage globally for use in common.js
    window.changePage = changePage;

    // Customer and Deal specific event listeners
    setupCustomerAndDealListeners();
});

// Initialize App
function initApp() {
    fetchCustomers();
    fetchDeals();

    // Add reload button functionality
    const reloadBtn = document.getElementById('reload-data-btn');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', function () {
            // Show loading indicator on the button
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Reloading...';
            this.disabled = true;

            // Reload data
            Promise.all([fetchCustomers(), fetchDeals()])
                .then(() => {
                    // Restore button
                    this.innerHTML = originalText;
                    this.disabled = false;

                    // Show success message
                    alert('Data reloaded successfully!');
                })
                .catch(error => {
                    console.error('Error reloading data:', error);
                    this.innerHTML = originalText;
                    this.disabled = false;
                    alert('Error reloading data. Please try again.');
                });
        });
    }

    // Initialize settings tabs
    initTabs();

    // Initialize report pages
    initReports();

    // Set up event listeners for buttons in all pages
    setupPageEventListeners();
}

// Handle hash routing
function handleHashRouting() {
    // Get the hash without the # symbol
    const hash = window.location.hash.substring(1);

    // Skip handling for leads and customers as they have dedicated pages
    if (hash && hash !== 'leads' && hash !== 'customers') {
        // Find the navigation link for this hash
        const targetLink = document.querySelector(`.nav-link[data-page="${hash}"]`);

        // If found, simulate a click to navigate to that page
        if (targetLink) {
            changePage({
                currentTarget: targetLink,
                preventDefault: () => { }
            });
        }
    }
}

// Setup event listeners for customers and deals
function setupCustomerAndDealListeners() {
    const customersList = document.getElementById('customers-list');
    const dealsList = document.getElementById('deals-list');
    const addCustomerBtn = document.getElementById('add-customer-btn');
    const addDealBtn = document.getElementById('add-deal-btn');
    const customerModal = document.getElementById('customer-modal');
    const dealModal = document.getElementById('deal-modal');
    const customerForm = document.getElementById('customer-form');
    const dealForm = document.getElementById('deal-form');
    const closeBtns = document.querySelectorAll('.close');
    const cancelBtns = document.querySelectorAll('.cancel-btn');

    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', showAddCustomerModal);
    }

    if (addDealBtn) {
        addDealBtn.addEventListener('click', showAddDealModal);
    }

    if (customerForm) {
        customerForm.addEventListener('submit', handleCustomerSubmit);
    }

    if (dealForm) {
        dealForm.addEventListener('submit', handleDealSubmit);
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    cancelBtns.forEach(btn => {
        btn.addEventListener('click', closeModals);
    });
}

// Change Page function - handles navigation
function changePage(e) {
    e.preventDefault();

    const targetPage = e.currentTarget.dataset.page;
    if (!targetPage) return;

    // Special handling for leads and customers - navigate directly to their dedicated pages
    if (targetPage === 'leads') {
        window.location.href = '/leads';
        return;
    }

    if (targetPage === 'customers') {
        window.location.href = '/customers';
        return;
    }

    // Update active nav link
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
        if (link.dataset.page === targetPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Show target page
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (page.id === `${targetPage}-page`) {
            page.classList.add('active');
        } else {
            page.classList.remove('active');
        }
    });

    // Update the URL hash without causing a page reload
    const newUrl = targetPage === 'dashboard'
        ? window.location.pathname
        : `${window.location.pathname}#${targetPage}`;

    window.history.pushState({ page: targetPage }, '', newUrl);

    // Special handling for report page to render charts
    if (targetPage === 'reports') {
        loadReports();
    }

    console.log(`Navigated to ${targetPage} page`);
}

// Set up event listeners for buttons in all pages
function setupPageEventListeners() {
    // Quotes page
    const createQuoteBtn = document.querySelector('#quotes-page .btn-primary');
    if (createQuoteBtn) {
        createQuoteBtn.addEventListener('click', () => {
            alert('Create Quote functionality would appear here');
        });
    }

    // Orders page
    const createOrderBtn = document.querySelector('#orders-page .btn-primary');
    if (createOrderBtn) {
        createOrderBtn.addEventListener('click', () => {
            alert('Create Order functionality would appear here');
        });
    }

    // Products page
    const addProductBtn = document.querySelector('#products-page .btn-primary');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            alert('Add Product functionality would appear here');
        });
    }

    // Inventory page
    const importBtn = document.querySelector('#inventory-page .btn-outline:first-child');
    const exportBtn = document.querySelector('#inventory-page .btn-outline:last-child');

    if (importBtn) {
        importBtn.addEventListener('click', () => {
            alert('Import Inventory functionality would appear here');
        });
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            alert('Export Inventory functionality would appear here');
        });
    }
}

// Fetch Customers
async function fetchCustomers() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        const customers = await response.json();

        populateCustomersList(customers);
        populateCustomerSelect(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
}

// Populate Customers List
function populateCustomersList(customers) {
    const customersList = document.getElementById('customers-list');
    if (!customersList) {
        console.warn('Customers list element not found');
        return;
    }

    customersList.innerHTML = '';

    if (customers.length === 0) {
        customersList.innerHTML = '<tr><td colspan="6" class="text-center">No customers found</td></tr>';
        return;
    }

    customers.forEach(customer => {
        const row = document.createElement('tr');

        row.innerHTML = `
      <td>${customer.name}</td>
      <td>${customer.email}</td>
      <td>${customer.phone || '-'}</td>
      <td>${customer.company || '-'}</td>
      <td><span class="badge badge-${customer.status.toLowerCase()}">${customer.status}</span></td>
      <td class="actions">
        <button class="btn btn-primary btn-small edit-customer" data-id="${customer._id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-danger btn-small delete-customer" data-id="${customer._id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

        customersList.appendChild(row);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-customer').forEach(btn => {
        btn.addEventListener('click', () => showEditCustomerModal(btn.dataset.id));
    });

    document.querySelectorAll('.delete-customer').forEach(btn => {
        btn.addEventListener('click', () => deleteCustomer(btn.dataset.id));
    });
}

// Populate Customer Select Dropdown
function populateCustomerSelect(customers) {
    const customerSelect = document.getElementById('customer');
    if (!customerSelect) {
        console.warn('Customer select element not found');
        return;
    }

    customerSelect.innerHTML = '<option value="">Select a customer</option>';

    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer._id;
        option.textContent = customer.name;
        customerSelect.appendChild(option);
    });
}

// Fetch Deals
async function fetchDeals() {
    try {
        const response = await fetch(`${API_URL}/deals`);
        const deals = await response.json();

        populateDealsList(deals);
    } catch (error) {
        console.error('Error fetching deals:', error);
    }
}

// Populate Deals List
function populateDealsList(deals) {
    const dealsList = document.getElementById('deals-list');
    if (!dealsList) {
        console.warn('Deals list element not found');
        return;
    }

    dealsList.innerHTML = '';

    if (deals.length === 0) {
        dealsList.innerHTML = '<tr><td colspan="6" class="text-center">No deals found</td></tr>';
        return;
    }

    deals.forEach(deal => {
        const row = document.createElement('tr');
        const closeDate = deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : '-';

        row.innerHTML = `
      <td>${deal.title}</td>
      <td>${deal.customer ? deal.customer.name : '-'}</td>
      <td>₹${deal.value.toFixed(2)}</td>
      <td><span class="badge badge-${deal.status.toLowerCase()}">${deal.status}</span></td>
      <td>${closeDate}</td>
      <td class="actions">
        <button class="btn btn-primary btn-small edit-deal" data-id="${deal._id}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-danger btn-small delete-deal" data-id="${deal._id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

        dealsList.appendChild(row);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-deal').forEach(btn => {
        btn.addEventListener('click', () => showEditDealModal(btn.dataset.id));
    });

    document.querySelectorAll('.delete-deal').forEach(btn => {
        btn.addEventListener('click', () => deleteDeal(btn.dataset.id));
    });
}

// Show Add Customer Modal
function showAddCustomerModal() {
    const customerModal = document.getElementById('customer-modal');
    const customerModalTitle = document.getElementById('customer-modal-title');
    const customerForm = document.getElementById('customer-form');
    const customerIdInput = document.getElementById('customer-id');

    if (!customerModal || !customerModalTitle || !customerForm || !customerIdInput) {
        console.warn('One or more customer modal elements not found');
        return;
    }

    customerModalTitle.textContent = 'Add Customer';
    customerForm.reset();
    customerIdInput.value = '';
    customerModal.style.display = 'block';
}

// Show Edit Customer Modal
async function showEditCustomerModal(customerId) {
    const customerModal = document.getElementById('customer-modal');
    const customerModalTitle = document.getElementById('customer-modal-title');
    const customerIdInput = document.getElementById('customer-id');

    if (!customerModal || !customerModalTitle || !customerIdInput) {
        console.warn('One or more customer modal elements not found');
        return;
    }

    customerModalTitle.textContent = 'Edit Customer';
    customerIdInput.value = customerId;

    try {
        const response = await fetch(`${API_URL}/customers/${customerId}`);
        const customer = await response.json();

        // Populate form with customer data
        document.getElementById('name').value = customer.name;
        document.getElementById('email').value = customer.email;
        document.getElementById('phone').value = customer.phone || '';
        document.getElementById('company').value = customer.company || '';
        document.getElementById('status').value = customer.status;
        document.getElementById('notes').value = customer.notes || '';

        customerModal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching customer:', error);
    }
}

// Show Add Deal Modal
function showAddDealModal() {
    const dealModal = document.getElementById('deal-modal');
    const dealModalTitle = document.getElementById('deal-modal-title');
    const dealForm = document.getElementById('deal-form');
    const dealIdInput = document.getElementById('deal-id');

    if (!dealModal || !dealModalTitle || !dealForm || !dealIdInput) {
        console.warn('One or more deal modal elements not found');
        return;
    }

    dealModalTitle.textContent = 'Add Deal';
    dealForm.reset();
    dealIdInput.value = '';
    dealModal.style.display = 'block';
}

// Show Edit Deal Modal
async function showEditDealModal(dealId) {
    const dealModal = document.getElementById('deal-modal');
    const dealModalTitle = document.getElementById('deal-modal-title');
    const dealIdInput = document.getElementById('deal-id');

    if (!dealModal || !dealModalTitle || !dealIdInput) {
        console.warn('One or more deal modal elements not found');
        return;
    }

    dealModalTitle.textContent = 'Edit Deal';
    dealIdInput.value = dealId;

    try {
        const response = await fetch(`${API_URL}/deals/${dealId}`);
        const deal = await response.json();

        // Populate form with deal data
        const titleInput = document.getElementById('title');
        const customerInput = document.getElementById('customer');
        const valueInput = document.getElementById('value');
        const dealStatusInput = document.getElementById('deal-status');
        const closeDateInput = document.getElementById('expected-close-date');
        const notesInput = document.getElementById('deal-notes');

        if (titleInput) titleInput.value = deal.title;
        if (customerInput && deal.customer) customerInput.value = deal.customer._id;
        if (valueInput) valueInput.value = deal.value;
        if (dealStatusInput) dealStatusInput.value = deal.status;

        // Format date for input
        if (closeDateInput && deal.expectedCloseDate) {
            const date = new Date(deal.expectedCloseDate);
            const formattedDate = date.toISOString().slice(0, 10);
            closeDateInput.value = formattedDate;
        } else if (closeDateInput) {
            closeDateInput.value = '';
        }

        if (notesInput) notesInput.value = deal.notes || '';

        dealModal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching deal:', error);
    }
}

// Handle Customer Form Submit
async function handleCustomerSubmit(e) {
    e.preventDefault();

    const customerIdInput = document.getElementById('customer-id');
    if (!customerIdInput) {
        console.warn('Customer ID input not found');
        return;
    }

    const customerId = customerIdInput.value;
    const isEditing = !!customerId;

    const formData = new FormData(e.target);
    const customerData = Object.fromEntries(formData.entries());

    try {
        const url = isEditing ? `${API_URL}/customers/${customerId}` : `${API_URL}/customers`;
        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customerData),
        });

        if (response.ok) {
            // Close modal
            closeModals();

            // Refresh customers list
            fetchCustomers();
        }
    } catch (error) {
        console.error('Error saving customer:', error);
    }
}

// Handle Deal Form Submit
async function handleDealSubmit(e) {
    e.preventDefault();

    const dealIdInput = document.getElementById('deal-id');
    if (!dealIdInput) {
        console.warn('Deal ID input not found');
        return;
    }

    const dealId = dealIdInput.value;
    const isEditing = !!dealId;

    const formData = new FormData(e.target);
    const dealData = Object.fromEntries(formData.entries());

    try {
        const url = isEditing ? `${API_URL}/deals/${dealId}` : `${API_URL}/deals`;
        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dealData),
        });

        if (response.ok) {
            // Close modal
            closeModals();

            // Refresh deals list
            fetchDeals();
        }
    } catch (error) {
        console.error('Error saving deal:', error);
    }
}

// Delete Customer
async function deleteCustomer(customerId) {
    if (!customerId) {
        console.warn('No customer ID provided for deletion');
        return;
    }

    const confirmed = confirm('Are you sure you want to delete this customer?');

    if (confirmed) {
        try {
            const response = await fetch(`${API_URL}/customers/${customerId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchCustomers();
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    }
}

// Delete Deal
async function deleteDeal(dealId) {
    if (!dealId) {
        console.warn('No deal ID provided for deletion');
        return;
    }

    const confirmed = confirm('Are you sure you want to delete this deal?');

    if (confirmed) {
        try {
            const response = await fetch(`${API_URL}/deals/${dealId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchDeals();
            }
        } catch (error) {
            console.error('Error deleting deal:', error);
        }
    }
}

// Close Modals
function closeModals() {
    const customerModal = document.getElementById('customer-modal');
    const dealModal = document.getElementById('deal-modal');

    if (customerModal) {
        customerModal.style.display = 'none';
    }

    if (dealModal) {
        dealModal.style.display = 'none';
    }
}

// Close modals when clicked outside
window.addEventListener('click', (e) => {
    const customerModal = document.getElementById('customer-modal');
    const dealModal = document.getElementById('deal-modal');

    if (customerModal && e.target === customerModal) {
        customerModal.style.display = 'none';
    }
    if (dealModal && e.target === dealModal) {
        dealModal.style.display = 'none';
    }
});

// Initialize tabs for settings and other tab-based UI components
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            const tabContainer = button.closest('.tab-navigation').nextElementSibling;

            // Remove active class from all buttons and panes in this container
            const siblingButtons = button.closest('.tab-navigation').querySelectorAll('.tab-btn');
            siblingButtons.forEach(btn => btn.classList.remove('active'));

            const siblingPanes = tabContainer.querySelectorAll('.tab-pane');
            siblingPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            tabContainer.querySelector(`#${tabId}`).classList.add('active');
        });
    });

    // Set up form submissions in settings
    const companyInfoForm = document.getElementById('company-info-form');
    if (companyInfoForm) {
        companyInfoForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Company information saved!');
        });
    }
}

// Initialize reports page
function initReports() {
    const periodSelects = document.querySelectorAll('#sales-report-period, #lead-source-period');

    periodSelects.forEach(select => {
        select.addEventListener('change', () => {
            loadReports();
        });
    });
}

// Load report charts
function loadReports() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded');
        return;
    }

    // Wait for the report page to be rendered fully
    setTimeout(() => {
        // Sales report chart
        const salesContainer = document.querySelector('#reports-page .card:nth-child(1) .chart-placeholder');
        if (salesContainer) {
            // Clear previous chart if exists
            salesContainer.innerHTML = '';

            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.id = 'sales-chart';
            salesContainer.appendChild(canvas);

            try {
                // Create chart
                new Chart(canvas, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Sales',
                            data: [12000, 19000, 15000, 25000, 22000, 30000],
                            borderColor: '#4361ee',
                            backgroundColor: 'rgba(67, 97, 238, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                console.log('Sales chart created successfully');
            } catch (error) {
                console.error('Error creating sales chart:', error);
            }
        }

        // Lead sources chart
        const sourcesContainer = document.querySelector('#reports-page .card:nth-child(2) .chart-placeholder');
        if (sourcesContainer) {
            // Clear previous chart if exists
            sourcesContainer.innerHTML = '';

            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.id = 'sources-chart';
            sourcesContainer.appendChild(canvas);

            try {
                // Create chart
                new Chart(canvas, {
                    type: 'pie',
                    data: {
                        labels: ['Website', 'Referral', 'Social Media', 'Email', 'Cold Call'],
                        datasets: [{
                            data: [30, 20, 25, 15, 10],
                            backgroundColor: [
                                '#4361ee',
                                '#f9c74f',
                                '#90be6d',
                                '#f8961e',
                                '#f94144'
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                console.log('Sources chart created successfully');
            } catch (error) {
                console.error('Error creating sources chart:', error);
            }
        }

        // Conversion rate chart
        const conversionContainer = document.querySelector('#reports-page .card:nth-child(3) .chart-placeholder');
        if (conversionContainer) {
            // Clear previous chart if exists
            conversionContainer.innerHTML = '';

            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.id = 'conversion-chart';
            conversionContainer.appendChild(canvas);

            try {
                // Create chart
                new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Conversion Rate (%)',
                            data: [15, 18, 21, 25, 22, 28],
                            backgroundColor: '#4cc9f0'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
                console.log('Conversion chart created successfully');
            } catch (error) {
                console.error('Error creating conversion chart:', error);
            }
        }

        // Top products chart
        const productsContainer = document.querySelector('#reports-page .card:nth-child(4) .chart-placeholder');
        if (productsContainer) {
            // Clear previous chart if exists
            productsContainer.innerHTML = '';

            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.id = 'products-chart';
            productsContainer.appendChild(canvas);

            try {
                // Create chart
                new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
                        datasets: [{
                            label: 'Sales',
                            data: [120, 90, 70, 50, 30],
                            backgroundColor: '#43aa8b'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        indexAxis: 'y'
                    }
                });
                console.log('Products chart created successfully');
            } catch (error) {
                console.error('Error creating products chart:', error);
            }
        }
    }, 300); // Small delay to ensure DOM is ready
} 