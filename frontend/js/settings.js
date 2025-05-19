// Settings Management JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initSettings();
});

// Initialize Settings Page
function initSettings() {
    // Initialize tabs
    initSettingsTabs();

    // Set up form listeners
    setupSettingsForms();

    // Set up integration listeners
    setupIntegrationCards();
}

// Initialize Settings Tabs
function initSettingsTabs() {
    const tabs = document.querySelectorAll('.settings-tabs .tab');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabs.length === 0) return;

    // Add click event to each tab
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Get target content id
            const targetId = tab.dataset.target;

            // Hide all tab contents
            tabContents.forEach(content => {
                content.style.display = 'none';
            });

            // Show target content
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });

    // Activate first tab by default
    if (tabs.length > 0) {
        tabs[0].click();
    }
}

// Set up Settings Forms
function setupSettingsForms() {
    // Company Profile Form
    const companyForm = document.getElementById('company-form');
    if (companyForm) {
        companyForm.addEventListener('submit', handleCompanyFormSubmit);
    }

    // User Profile Form
    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', handleUserFormSubmit);
    }

    // Email Settings Form
    const emailForm = document.getElementById('email-form');
    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailFormSubmit);
    }

    // Security Settings Form
    const securityForm = document.getElementById('security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', handleSecurityFormSubmit);
    }

    // Upload logo button
    const uploadBtn = document.getElementById('upload-logo-btn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', handleLogoUpload);
    }
}

// Set up Integration Cards
function setupIntegrationCards() {
    // Connect/Disconnect buttons for each integration
    const integrationButtons = document.querySelectorAll('.integration-card .btn');

    integrationButtons.forEach(btn => {
        btn.addEventListener('click', handleIntegrationToggle);
    });

    // Settings buttons for each integration
    const integrationSettings = document.querySelectorAll('.integration-card .settings-btn');

    integrationSettings.forEach(btn => {
        btn.addEventListener('click', handleIntegrationSettings);
    });
}

// Handle Company Form Submit
function handleCompanyFormSubmit(e) {
    e.preventDefault();

    // In a real app, this would submit to an API
    alert('Company profile updated successfully!');
}

// Handle User Form Submit
function handleUserFormSubmit(e) {
    e.preventDefault();

    // In a real app, this would submit to an API
    alert('User profile updated successfully!');
}

// Handle Email Form Submit
function handleEmailFormSubmit(e) {
    e.preventDefault();

    // In a real app, this would submit to an API
    alert('Email settings updated successfully!');
}

// Handle Security Form Submit
function handleSecurityFormSubmit(e) {
    e.preventDefault();

    // In a real app, this would submit to an API
    alert('Security settings updated successfully!');
}

// Handle Logo Upload
function handleLogoUpload() {
    // In a real app, this would open a file dialog
    alert('Logo upload functionality would appear here');
}

// Handle Integration Toggle
function handleIntegrationToggle(e) {
    const btn = e.currentTarget;
    const card = btn.closest('.integration-card');
    const integrationName = card.querySelector('h3').textContent;

    if (btn.classList.contains('btn-primary')) {
        // Currently disconnected, connect
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-danger');
        btn.innerHTML = '<i class="fas fa-unlink"></i> Disconnect';
        card.classList.add('connected');

        alert(`Connected to ${integrationName} successfully!`);
    } else {
        // Currently connected, disconnect
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-primary');
        btn.innerHTML = '<i class="fas fa-link"></i> Connect';
        card.classList.remove('connected');

        alert(`Disconnected from ${integrationName}`);
    }
}

// Handle Integration Settings
function handleIntegrationSettings(e) {
    const card = e.currentTarget.closest('.integration-card');
    const integrationName = card.querySelector('h3').textContent;

    alert(`Configure ${integrationName} settings - This would open a settings modal`);
}

// Test SMTP Connection
function testSmtpConnection() {
    // In a real app, this would test the SMTP connection
    alert('Testing SMTP connection... This would verify your email settings');
}

// Handle API Key Regeneration
function regenerateApiKey() {
    // In a real app, this would regenerate the API key
    const apiKeyField = document.getElementById('api-key');
    if (apiKeyField) {
        // Generate a mock API key
        const newKey = 'api_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        apiKeyField.value = newKey;

        alert('API key regenerated successfully!');
    }
}

// Handle Import/Export Settings
function importSettings() {
    // In a real app, this would open a file dialog
    alert('Import Settings - This would allow you to upload a settings JSON file');
}

function exportSettings() {
    // In a real app, this would download a JSON file
    alert('Export Settings - This would download your current settings as a JSON file');
}

// Add all these functions as global window functions for use in button onclick attributes
window.testSmtpConnection = testSmtpConnection;
window.regenerateApiKey = regenerateApiKey;
window.importSettings = importSettings;
window.exportSettings = exportSettings; 