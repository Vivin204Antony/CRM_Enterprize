// API URL
const API_URL = '/api';

// Load Common Components
document.addEventListener('DOMContentLoaded', () => {
    loadSidebar();
    loadHeader();
});

// Load Sidebar
function loadSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');

    if (sidebarContainer) {
        sidebarContainer.innerHTML = `
        <aside class="sidebar">
            <div class="sidebar-header">
                <h1><i class="fas fa-project-diagram"></i> Enterprise CRM</h1>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="index.html" class="nav-link" data-page="dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                    <li><a href="/leads" class="nav-link" data-page="leads"><i class="fas fa-funnel-dollar"></i> Leads</a></li>
                    <li><a href="/customers" class="nav-link" data-page="customers"><i class="fas fa-users"></i> Customers</a></li>
                    <li><a href="index.html#deals" class="nav-link" data-page="deals"><i class="fas fa-handshake"></i> Deals</a></li>
                    <li><a href="index.html#quotes" class="nav-link" data-page="quotes"><i class="fas fa-file-invoice-dollar"></i> Quotes</a></li>
                    <li><a href="index.html#orders" class="nav-link" data-page="orders"><i class="fas fa-shopping-cart"></i> Orders</a></li>
                    <li><a href="index.html#products" class="nav-link" data-page="products"><i class="fas fa-box"></i> Products</a></li>
                    <li><a href="index.html#inventory" class="nav-link" data-page="inventory"><i class="fas fa-warehouse"></i> Inventory</a></li>
                    <li><a href="index.html#reports" class="nav-link" data-page="reports"><i class="fas fa-chart-bar"></i> Reports</a></li>
                    <li><a href="index.html#settings" class="nav-link" data-page="settings"><i class="fas fa-cog"></i> Settings</a></li>
                </ul>
            </nav>
            <div class="sidebar-footer">
                <button id="reload-data-btn" class="btn btn-outline" title="Reload Data">
                    <i class="fas fa-sync-alt"></i> Reload Data
                </button>
            </div>
        </aside>
        `;

        // Set active link based on current page
        const currentPage = window.location.pathname.split('/').pop().split('.')[0];
        if (currentPage) {
            const activeLink = sidebarContainer.querySelector(`.nav-link[data-page="${currentPage}"]`) ||
                sidebarContainer.querySelector(`.nav-link[href*="${currentPage}"]`);

            if (activeLink) {
                const allLinks = sidebarContainer.querySelectorAll('.nav-link');
                allLinks.forEach(link => link.classList.remove('active'));
                activeLink.classList.add('active');
            }
        }

        // Add event listeners to sidebar nav links for index.html page to enable SPA navigation
        if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
            const navLinks = sidebarContainer.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                const page = link.dataset.page;
                // Only add event listeners to links that should use hash navigation
                // Skip links to dedicated pages like /leads and /customers
                if (page && !link.href.includes('/leads') && !link.href.includes('/customers')) {
                    link.addEventListener('click', function (e) {
                        if (link.href.includes('index.html')) {
                            e.preventDefault();
                            changePage({ currentTarget: link, preventDefault: () => { } });
                        }
                    });
                }
            });
        }
    }
}

// Load Header
function loadHeader() {
    const headerContainer = document.getElementById('header-container');

    if (headerContainer) {
        headerContainer.innerHTML = `
        <header class="top-header">
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Search...">
            </div>
            <div class="user-actions">
                <div class="notifications">
                    <i class="fas fa-bell"></i>
                    <span class="notification-badge">3</span>
                </div>
                <div class="user-profile">
                    <img src="img/avatar.png" alt="User Avatar">
                    <span>John Doe</span>
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
        </header>
        `;
    }
}

// Function to handle page navigation (will be defined in app.js but referenced here)
function changePage(e) {
    if (typeof window.changePage === 'function') {
        window.changePage(e);
    } else {
        e.preventDefault();
        const targetPage = e.currentTarget.dataset.page;

        if (targetPage) {
            // If the function isn't available, manually navigate
            const hashPart = targetPage !== 'dashboard' ? `#${targetPage}` : '';
            window.location.href = `index.html${hashPart}`;
        }
    }
}

// Toggle User Dropdown
function toggleUserDropdown() {
    // Create dropdown if it doesn't exist
    let dropdown = document.querySelector('.user-dropdown');

    if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
      <ul>
        <li><a href="#"><i class="fas fa-user"></i> My Profile</a></li>
        <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
        <li><a href="#"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
      </ul>
    `;

        document.querySelector('.user-profile').appendChild(dropdown);
    } else {
        dropdown.classList.toggle('active');
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function closeDropdown(e) {
        if (!e.target.closest('.user-profile')) {
            dropdown.classList.remove('active');
            document.removeEventListener('click', closeDropdown);
        }
    });
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now - 86400000);

    if (date.toDateString() === now.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

// Error Handling
function showError(message) {
    // Create error toast
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-exclamation-circle"></i>
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

// API Helpers
async function apiGet(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Get Error:', error);
        showError('Failed to fetch data from the server.');
        throw error;
    }
}

async function apiPost(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Post Error:', error);
        showError('Failed to save data to the server.');
        throw error;
    }
}

async function apiPut(endpoint, data) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Put Error:', error);
        showError('Failed to update data on the server.');
        throw error;
    }
}

async function apiDelete(endpoint) {
    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Delete Error:', error);
        showError('Failed to delete data from the server.');
        throw error;
    }
}

// Expose key functions globally
window.loadSidebar = loadSidebar;
window.loadHeader = loadHeader;
window.formatDate = formatDate;
window.formatCurrency = formatCurrency;
window.formatNumber = formatNumber; 