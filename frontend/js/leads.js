// API_URL is defined in common.js

// Drag and Drop handlers (defined in global scope)
function dragStart() {
    this.classList.add('dragging');
    setTimeout(() => {
        this.classList.add('hide');
    }, 0);
}

function dragEnd() {
    this.classList.remove('dragging', 'hide');
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function dragLeave() {
    this.classList.remove('drag-over');
}

function drop() {
    this.classList.remove('drag-over');
    const card = document.querySelector('.dragging');

    if (card) {
        this.appendChild(card);

        // Update lead status based on column
        const leadId = card.dataset.id;
        const columnId = this.id;
        let newStatus;

        switch (columnId) {
            case 'new-leads':
                newStatus = 'New';
                break;
            case 'contacted-leads':
                newStatus = 'Contacted';
                break;
            case 'qualified-leads':
                newStatus = 'Qualified';
                break;
            case 'proposal-leads':
                newStatus = 'Proposal';
                break;
            case 'negotiation-leads':
                newStatus = 'Negotiation';
                break;
            case 'won-leads':
                newStatus = 'Closed Won';
                break;
            case 'lost-leads':
                newStatus = 'Closed Lost';
                break;
        }

        if (newStatus) {
            updateLeadStatus(leadId, newStatus);
        }

        // Update column counts
        updateColumnCounts();
    }
}

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Load common components
    initSidebar();
    initHeader();

    // Initialize tabs and view options
    initViewOptions();

    // Initialize drag and drop for kanban view
    initKanbanDragAndDrop();

    // Load data
    loadLeads();
    loadUsers();

    // Event listeners
    const addLeadBtn = document.getElementById('add-lead-btn');
    if (addLeadBtn) {
        addLeadBtn.addEventListener('click', showAddLeadModal);
    }

    const leadSearch = document.getElementById('lead-search');
    if (leadSearch) {
        leadSearch.addEventListener('input', filterLeads);
    }

    const filterStatus = document.getElementById('filter-status');
    if (filterStatus) {
        filterStatus.addEventListener('change', filterLeads);
    }

    const filterSource = document.getElementById('filter-source');
    if (filterSource) {
        filterSource.addEventListener('change', filterLeads);
    }

    const filterAssigned = document.getElementById('filter-assigned');
    if (filterAssigned) {
        filterAssigned.addEventListener('change', filterLeads);
    }

    const sortLeadsSelect = document.getElementById('sort-leads');
    if (sortLeadsSelect) {
        sortLeadsSelect.addEventListener('change', sortLeads);
    }

    const selectAllLeads = document.getElementById('select-all-leads');
    if (selectAllLeads) {
        selectAllLeads.addEventListener('change', toggleSelectAllLeads);
    }

    // Modal actions
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', closeModals);
    });

    const saveLeadBtn = document.querySelector('.save-lead-btn');
    if (saveLeadBtn) {
        saveLeadBtn.addEventListener('click', saveLead);
    }

    const convertBtn = document.querySelector('.convert-btn');
    if (convertBtn) {
        convertBtn.addEventListener('click', convertLead);
    }

    // Toggle deal details visibility in convert modal
    const createDealCheck = document.getElementById('create-deal');
    if (createDealCheck) {
        createDealCheck.addEventListener('change', function () {
            const dealDetails = document.getElementById('deal-details');
            if (dealDetails) {
                dealDetails.style.display = this.checked ? 'block' : 'none';
            }
        });
    }
});

// Load Common Components
function initSidebar() {
    const sidebarContainer = document.getElementById('sidebar-container');
    if (!sidebarContainer) {
        console.error('Sidebar container not found');
        return;
    }

    // Use the sidebar HTML directly instead of trying to call window.loadSidebar
    sidebarContainer.innerHTML = `
    <aside class="sidebar">
        <div class="sidebar-header">
            <h1><i class="fas fa-project-diagram"></i> Enterprise CRM</h1>
        </div>
        <nav class="sidebar-nav">
            <ul>
                <li><a href="index.html" class="nav-link" data-page="dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                <li><a href="/leads" class="nav-link active" data-page="leads"><i class="fas fa-funnel-dollar"></i> Leads</a></li>
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
}

function initHeader() {
    const headerContainer = document.getElementById('header-container');
    if (!headerContainer) {
        console.error('Header container not found');
        return;
    }

    // Implement header directly
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

// Initialize View Options
function initViewOptions() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const viewContainers = document.querySelectorAll('.view-container');

    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;

            // Toggle active class on buttons
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show selected view container
            viewContainers.forEach(container => {
                if (container.id === `${view}-view`) {
                    container.classList.add('active');
                } else {
                    container.classList.remove('active');
                }
            });
        });
    });
}

// Initialize Kanban Drag and Drop
function initKanbanDragAndDrop() {
    const draggableCards = document.querySelectorAll('.kanban-card');
    const dropZones = document.querySelectorAll('.kanban-cards');

    draggableCards.forEach(card => {
        card.addEventListener('dragstart', dragStart);
        card.addEventListener('dragend', dragEnd);
    });

    dropZones.forEach(zone => {
        zone.addEventListener('dragover', dragOver);
        zone.addEventListener('dragenter', dragEnter);
        zone.addEventListener('dragleave', dragLeave);
        zone.addEventListener('drop', drop);
    });
}

// Load Leads
function loadLeads() {
    const leadsTable = document.getElementById('leads-list');
    if (!leadsTable) {
        console.error('Leads list table not found');
        return;
    }

    // Show loading indicator
    leadsTable.innerHTML = '<tr><td colspan="11" class="text-center">Loading leads...</td></tr>';

    // Fetch all customers from the API
    fetch(`${API_URL}/customers`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(customers => {
            // Filter to find leads - look for 'Lead' status 
            // (could also include 'New' or other lead-related statuses)
            const leads = customers.filter(customer =>
                customer.status === 'Lead' ||
                customer.status === 'New' ||
                customer.status === 'Prospect'
            );

            console.log('Found leads:', leads.length);

            // Clear existing leads
            leadsTable.innerHTML = '';

            if (leads.length === 0) {
                leadsTable.innerHTML = '<tr><td colspan="11" class="text-center">No leads found. You can add new leads using the "Add Lead" button.</td></tr>';
                return;
            }

            // Populate with data from MongoDB
            leads.forEach((lead, index) => {
                const row = document.createElement('tr');

                // Add the row HTML with lead data
                row.innerHTML = `
                    <td><input type="checkbox" class="select-lead" data-id="${lead._id || index}"></td>
                    <td>${lead.name || 'N/A'}</td>
                    <td>${lead.company || 'N/A'}</td>
                    <td>${lead.email || 'N/A'}</td>
                    <td>${lead.phone || 'N/A'}</td>
                    <td><span class="badge badge-${(lead.status || 'new').toLowerCase()}">${lead.status || 'New'}</span></td>
                    <td>${lead.source || 'N/A'}</td>
                    <td>${lead.score || '0'}</td>
                    <td>${lead.assignedTo || 'Unassigned'}</td>
                    <td>${formatDate(lead.createdAt) || 'N/A'}</td>
                    <td class="actions">
                        <button class="btn btn-icon btn-outline edit-lead" data-id="${lead._id || index}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-icon btn-outline convert-lead" data-id="${lead._id || index}">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="btn btn-icon btn-outline delete-lead" data-id="${lead._id || index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;

                leadsTable.appendChild(row);
            });

            // Add event listeners to the new buttons
            document.querySelectorAll('.edit-lead').forEach(btn => {
                btn.addEventListener('click', () => showEditLeadModal(btn.dataset.id));
            });

            document.querySelectorAll('.convert-lead').forEach(btn => {
                btn.addEventListener('click', () => showConvertLeadModal(btn.dataset.id));
            });

            document.querySelectorAll('.delete-lead').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this lead?')) {
                        deleteLead(btn.dataset.id);
                    }
                });
            });

            // Update kanban board if present
            if (document.getElementById('kanban-view')) {
                updateKanbanBoard(leads);
            }
        })
        .catch(error => {
            console.error('Error loading leads:', error);
            leadsTable.innerHTML = `<tr><td colspan="11" class="text-center text-danger">Error loading leads: ${error.message}</td></tr>`;
        });
}

// Update Kanban Board with real data
function updateKanbanBoard(leads) {
    // Clear all kanban columns
    document.querySelectorAll('.kanban-cards').forEach(column => {
        // Remove all cards but keep empty states
        const emptyState = column.querySelector('.kanban-empty-state');
        if (emptyState) {
            column.innerHTML = '';
            column.appendChild(emptyState);
        } else {
            column.innerHTML = '';
        }
    });

    // Group leads by status
    const statusColumns = {
        'Lead': 'new-leads',
        'Contacted': 'contacted-leads',
        'Qualified': 'qualified-leads',
        'Proposal': 'proposal-leads',
        'Negotiation': 'negotiation-leads',
        'Closed Won': 'won-leads',
        'Closed Lost': 'lost-leads'
    };

    // Add leads to appropriate columns
    leads.forEach((lead, index) => {
        // Default to "New" column if status doesn't match
        const columnId = statusColumns[lead.status] || 'new-leads';
        const column = document.getElementById(columnId);

        if (column) {
            // Remove empty state if it exists
            const emptyState = column.querySelector('.kanban-empty-state');
            if (emptyState) {
                emptyState.remove();
            }

            // Create lead card
            const card = document.createElement('div');
            card.className = 'kanban-card';
            card.draggable = true;
            card.dataset.id = lead._id;

            // Assign lead score between 60-95
            const score = 60 + Math.floor(Math.random() * 35);

            // Assign to either John Doe or Jane Smith based on index
            const assignedTo = index % 2 === 0 ? 'John Doe' : 'Jane Smith';

            // Assign source from common sources
            const sources = ['Website', 'Referral', 'LinkedIn', 'Email Campaign', 'Cold Call'];
            const source = sources[Math.floor(Math.random() * sources.length)];

            card.innerHTML = `
                <div class="kanban-card-header">
                    <span class="lead-name">${lead.name}</span>
                    <span class="lead-score">${score}</span>
                </div>
                <div class="kanban-card-body">
                    <p class="lead-company">${lead.company || 'N/A'}</p>
                    <p class="lead-contact">${lead.email}</p>
                </div>
                <div class="kanban-card-footer">
                    <span class="badge badge-sm">${source}</span>
                    <span class="assigned-to">${assignedTo}</span>
                </div>
            `;

            column.appendChild(card);

            // Add drag and drop event listeners
            card.addEventListener('dragstart', dragStart);
            card.addEventListener('dragend', dragEnd);
        }
    });

    // Update column counts
    updateColumnCounts();
}

// Load Users for Assigned To dropdown
function loadUsers() {
    // This would typically fetch users from the API
    // For now, we'll add some sample data
    const assignedToSelect = document.getElementById('filter-assigned');
    const userSelect = document.getElementById('assigned-to');

    const users = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Robert Johnson' }
    ];

    users.forEach(user => {
        const option1 = document.createElement('option');
        option1.value = user.id;
        option1.textContent = user.name;
        assignedToSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = user.id;
        option2.textContent = user.name;
        userSelect.appendChild(option2);
    });
}

// Filter Leads
function filterLeads() {
    const searchTerm = document.getElementById('lead-search').value.toLowerCase();
    const statusFilter = document.getElementById('filter-status').value;
    const sourceFilter = document.getElementById('filter-source').value;
    const assignedFilter = document.getElementById('filter-assigned').value;

    const rows = document.querySelectorAll('#leads-list tr');

    rows.forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        const company = row.cells[2].textContent.toLowerCase();
        const email = row.cells[3].textContent.toLowerCase();
        const status = row.cells[5].textContent.trim();
        const source = row.cells[6].textContent.trim();
        const assigned = row.cells[8].textContent.trim();

        const matchesSearch = name.includes(searchTerm) ||
            company.includes(searchTerm) ||
            email.includes(searchTerm);

        const matchesStatus = statusFilter === '' || status === statusFilter;
        const matchesSource = sourceFilter === '' || source === sourceFilter;
        const matchesAssigned = assignedFilter === '' || assigned === document.getElementById('filter-assigned').options[document.getElementById('filter-assigned').selectedIndex].text;

        if (matchesSearch && matchesStatus && matchesSource && matchesAssigned) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });

    updatePagination();
}

// Sort Leads
function sortLeads() {
    const sortOption = document.getElementById('sort-leads').value;
    const tbody = document.getElementById('leads-list');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    rows.sort((a, b) => {
        switch (sortOption) {
            case 'created-desc':
                return -1; // Assume newer leads are at the top already
            case 'created-asc':
                return 1;  // Reverse current order
            case 'name-asc':
                return a.cells[1].textContent.localeCompare(b.cells[1].textContent);
            case 'name-desc':
                return b.cells[1].textContent.localeCompare(a.cells[1].textContent);
            case 'score-desc':
                return parseInt(b.cells[7].textContent) - parseInt(a.cells[7].textContent);
            default:
                return 0;
        }
    });

    // Re-append in sorted order
    rows.forEach(row => tbody.appendChild(row));
}

// Toggle Select All Leads
function toggleSelectAllLeads() {
    const isChecked = document.getElementById('select-all-leads').checked;
    document.querySelectorAll('.select-lead').forEach(checkbox => {
        checkbox.checked = isChecked;
    });
}

// Update Lead Status
function updateLeadStatus(leadId, status) {
    // This would typically update the lead via the API
    console.log(`Updating lead ${leadId} status to ${status}`);

    // For now, just update the UI
    const leadRow = document.querySelector(`#leads-list tr button[data-id="${leadId}"]`).closest('tr');
    const statusCell = leadRow.cells[5];
    statusCell.innerHTML = `<span class="badge badge-${status.toLowerCase().replace(' ', '-')}">${status}</span>`;
}

// Update Column Counts in Kanban View
function updateColumnCounts() {
    const columns = document.querySelectorAll('.kanban-column');

    columns.forEach(column => {
        const cards = column.querySelectorAll('.kanban-card');
        const badge = column.querySelector('.badge');
        badge.textContent = cards.length;

        // Show/hide empty state
        const emptyState = column.querySelector('.kanban-empty-state');
        if (emptyState) {
            emptyState.style.display = cards.length > 0 ? 'none' : 'block';
        } else if (cards.length === 0) {
            const newEmptyState = document.createElement('div');
            newEmptyState.className = 'kanban-empty-state';
            newEmptyState.innerHTML = '<p>No leads in this stage</p>';
            column.querySelector('.kanban-cards').appendChild(newEmptyState);
        }
    });
}

// Update Pagination
function updatePagination() {
    const visibleRows = document.querySelectorAll('#leads-list tr:not([style*="display: none"])');
    const paginationInfo = document.querySelector('.pagination-info');

    if (paginationInfo) {
        paginationInfo.textContent = `Showing 1-${visibleRows.length} of ${visibleRows.length}`;
    }
}

// Show Add Lead Modal
function showAddLeadModal() {
    const modal = document.getElementById('lead-modal');
    const title = document.getElementById('lead-modal-title');
    const form = document.getElementById('lead-form');

    title.textContent = 'Add Lead';
    form.reset();
    document.getElementById('lead-id').value = '';

    modal.classList.add('active');
}

// Show Edit Lead Modal
function showEditLeadModal(leadId) {
    const modal = document.getElementById('lead-modal');
    const title = document.getElementById('lead-modal-title');
    const form = document.getElementById('lead-form');

    title.textContent = 'Edit Lead';

    // This would typically fetch the lead data from the API
    // For now, use dummy data based on the rows in the table
    const leadRow = document.querySelector(`#leads-list tr button[data-id="${leadId}"]`).closest('tr');

    const name = leadRow.cells[1].textContent.split(' ');
    const company = leadRow.cells[2].textContent;
    const email = leadRow.cells[3].textContent;
    const phone = leadRow.cells[4].textContent;
    const status = leadRow.cells[5].querySelector('.badge').textContent;
    const source = leadRow.cells[6].textContent;
    const score = leadRow.cells[7].textContent;
    const assignedTo = leadRow.cells[8].textContent;

    document.getElementById('lead-id').value = leadId;
    document.getElementById('first-name').value = name[0];
    document.getElementById('last-name').value = name[1] || '';
    document.getElementById('email').value = email;
    document.getElementById('phone').value = phone;
    document.getElementById('company').value = company;
    document.getElementById('lead-status').value = status;
    document.getElementById('lead-source').value = source;
    document.getElementById('lead-score').value = score;

    // Find the user ID that matches the name
    const userOptions = document.getElementById('assigned-to').options;
    for (let i = 0; i < userOptions.length; i++) {
        if (userOptions[i].text === assignedTo) {
            document.getElementById('assigned-to').value = userOptions[i].value;
            break;
        }
    }

    // Set notes and tags (would come from API in real implementation)
    document.getElementById('lead-notes').value = '';
    document.getElementById('lead-tags').value = '';

    modal.classList.add('active');
}

// Show Convert Lead Modal
function showConvertLeadModal(leadId) {
    const modal = document.getElementById('convert-lead-modal');

    // Get lead name
    const leadRow = document.querySelector(`#leads-list tr button[data-id="${leadId}"]`).closest('tr');
    const leadName = leadRow.cells[1].textContent;

    document.getElementById('convert-lead-name').textContent = leadName;

    // Prefill deal title
    document.getElementById('deal-title').value = `${leadName} Deal`;

    // Reset other fields
    document.getElementById('deal-value').value = '';
    document.getElementById('deal-status').value = 'New';
    document.getElementById('create-deal').checked = true;
    document.getElementById('deal-details').style.display = 'block';

    modal.classList.add('active');
}

// Save Lead
function saveLead() {
    const leadId = document.getElementById('lead-id').value;
    const isEditing = !!leadId;

    // Get form data
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const company = document.getElementById('company').value;
    const status = document.getElementById('lead-status').value;
    const source = document.getElementById('lead-source').value;
    const score = document.getElementById('lead-score').value;
    const assignedToId = document.getElementById('assigned-to').value;
    const assignedToName = document.getElementById('assigned-to').options[document.getElementById('assigned-to').selectedIndex].text;
    const notes = document.getElementById('lead-notes').value;
    const tags = document.getElementById('lead-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);

    // In a real application, you would send this data to the API
    console.log('Saving lead:', {
        id: leadId,
        firstName,
        lastName,
        email,
        phone,
        company,
        status,
        source,
        score,
        assignedTo: {
            id: assignedToId,
            name: assignedToName
        },
        notes,
        tags
    });

    // For demo purposes, update the UI directly
    if (isEditing) {
        // Update existing row
        const leadRow = document.querySelector(`#leads-list tr button[data-id="${leadId}"]`).closest('tr');

        leadRow.cells[1].textContent = `${firstName} ${lastName}`;
        leadRow.cells[2].textContent = company;
        leadRow.cells[3].textContent = email;
        leadRow.cells[4].textContent = phone;
        leadRow.cells[5].innerHTML = `<span class="badge badge-${status.toLowerCase().replace(' ', '-')}">${status}</span>`;
        leadRow.cells[6].textContent = source;
        leadRow.cells[7].textContent = score;
        leadRow.cells[8].textContent = assignedToName;

        // Also update the Kanban card if it exists
        const kanbanCard = document.querySelector(`.kanban-card[data-id="${leadId}"]`);
        if (kanbanCard) {
            kanbanCard.querySelector('.lead-name').textContent = `${firstName} ${lastName}`;
            kanbanCard.querySelector('.lead-company').textContent = company;
            kanbanCard.querySelector('.lead-contact').textContent = email;
            kanbanCard.querySelector('.lead-score').textContent = score;
            kanbanCard.querySelector('.badge-sm').textContent = source;
            kanbanCard.querySelector('.assigned-to').textContent = assignedToName;

            // Move card to correct column if status changed
            const currentColumn = kanbanCard.closest('.kanban-column');
            const currentStatus = currentColumn.querySelector('h3').textContent;

            if (currentStatus !== status) {
                const targetColumn = document.querySelector(`#${status.toLowerCase().replace(' ', '-')}-leads`);
                if (targetColumn) {
                    targetColumn.appendChild(kanbanCard);
                    updateColumnCounts();
                }
            }
        }
    } else {
        // Add new row to list view
        const tbody = document.getElementById('leads-list');
        const newRow = document.createElement('tr');

        // Generate a new ID (would be returned by API in real app)
        const newId = Date.now().toString();

        newRow.innerHTML = `
      <td><input type="checkbox" class="select-lead"></td>
      <td>${firstName} ${lastName}</td>
      <td>${company}</td>
      <td>${email}</td>
      <td>${phone}</td>
      <td><span class="badge badge-${status.toLowerCase().replace(' ', '-')}">${status}</span></td>
      <td>${source}</td>
      <td>${score}</td>
      <td>${assignedToName}</td>
      <td>Just now</td>
      <td class="actions">
        <button class="btn btn-icon btn-outline edit-lead" data-id="${newId}">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-icon btn-outline convert-lead" data-id="${newId}">
          <i class="fas fa-exchange-alt"></i>
        </button>
        <button class="btn btn-icon btn-outline delete-lead" data-id="${newId}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

        tbody.insertBefore(newRow, tbody.firstChild);

        // Add event listeners to new buttons
        newRow.querySelector('.edit-lead').addEventListener('click', () => showEditLeadModal(newId));
        newRow.querySelector('.convert-lead').addEventListener('click', () => showConvertLeadModal(newId));
        newRow.querySelector('.delete-lead').addEventListener('click', () => deleteLead(newId));

        // Add new card to kanban view
        const targetColumn = document.querySelector(`#${status.toLowerCase().replace(' ', '-')}-leads`);
        if (targetColumn) {
            // Remove empty state if it exists
            const emptyState = targetColumn.querySelector('.kanban-empty-state');
            if (emptyState) {
                emptyState.remove();
            }

            // Create and add new card
            const newCard = document.createElement('div');
            newCard.className = 'kanban-card';
            newCard.draggable = true;
            newCard.dataset.id = newId;

            newCard.innerHTML = `
        <div class="kanban-card-header">
          <span class="lead-name">${firstName} ${lastName}</span>
          <span class="lead-score">${score}</span>
        </div>
        <div class="kanban-card-body">
          <p class="lead-company">${company}</p>
          <p class="lead-contact">${email}</p>
        </div>
        <div class="kanban-card-footer">
          <span class="badge badge-sm">${source}</span>
          <span class="assigned-to">${assignedToName}</span>
        </div>
      `;

            targetColumn.appendChild(newCard);

            // Add drag and drop event listeners
            newCard.addEventListener('dragstart', function () {
                this.classList.add('dragging');
                setTimeout(() => {
                    this.classList.add('hide');
                }, 0);
            });

            newCard.addEventListener('dragend', function () {
                this.classList.remove('dragging', 'hide');
            });

            // Update column counts
            updateColumnCounts();
        }
    }

    // Close modal
    closeModals();
}

// Convert Lead
function convertLead() {
    // This would typically send a request to the API to convert the lead
    const leadName = document.getElementById('convert-lead-name').textContent;
    const createDeal = document.getElementById('create-deal').checked;

    let dealData = null;

    if (createDeal) {
        dealData = {
            title: document.getElementById('deal-title').value,
            value: document.getElementById('deal-value').value,
            status: document.getElementById('deal-status').value
        };
    }

    console.log('Converting lead:', leadName, 'Create deal:', createDeal, 'Deal data:', dealData);

    // Simulate success (would be API response in real app)
    alert(`Lead "${leadName}" has been successfully converted to a customer${createDeal ? ' and a new deal has been created' : ''}.`);

    // Close modal
    closeModals();
}

// Delete Lead
function deleteLead(leadId) {
    if (confirm('Are you sure you want to delete this lead?')) {
        // This would typically send a request to the API to delete the lead
        console.log('Deleting lead:', leadId);

        // Remove from list view
        const leadRow = document.querySelector(`#leads-list tr button[data-id="${leadId}"]`).closest('tr');
        leadRow.remove();

        // Remove from kanban view
        const kanbanCard = document.querySelector(`.kanban-card[data-id="${leadId}"]`);
        if (kanbanCard) {
            kanbanCard.remove();
            updateColumnCounts();
        }

        // Update pagination
        updatePagination();
    }
}

// Close Modals
function closeModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
} 