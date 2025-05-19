// Quotes Management JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initQuotes();
});

// Initialize Quotes Page
function initQuotes() {
    // Load sample quotes data
    loadQuotes();

    // Set up event listeners
    const createQuoteBtn = document.querySelector('#quotes-page .btn-primary');
    if (createQuoteBtn) {
        createQuoteBtn.addEventListener('click', showAddQuoteModal);
    }

    const searchInput = document.getElementById('quotes-search');
    if (searchInput) {
        searchInput.addEventListener('input', filterQuotes);
    }

    const statusFilter = document.getElementById('filter-quote-status');
    if (statusFilter) {
        statusFilter.addEventListener('change', filterQuotes);
    }
}

// Load Quotes
function loadQuotes() {
    const quotesList = document.getElementById('quotes-list');
    if (!quotesList) return;

    // Clear current quotes
    quotesList.innerHTML = '';

    try {
        // In a real app, this would fetch from API
        // For demo, we'll use sample data
        const quotes = [
            {
                id: 'Q-2023-001',
                customer: 'Arjun Subramaniam',
                amount: 5250.00,
                createdDate: '2023-06-15',
                validUntil: '2023-07-15',
                status: 'Sent'
            },
            {
                id: 'Q-2023-002',
                customer: 'Priya Krishnamurthy',
                amount: 12800.00,
                createdDate: '2023-06-10',
                validUntil: '2023-07-10',
                status: 'Accepted'
            },
            {
                id: 'Q-2023-003',
                customer: 'Deepak Nair',
                amount: 3500.00,
                createdDate: '2023-06-05',
                validUntil: '2023-07-05',
                status: 'Draft'
            },
            {
                id: 'Q-2023-004',
                customer: 'Ananya Reddy',
                amount: 9700.00,
                createdDate: '2023-05-28',
                validUntil: '2023-06-28',
                status: 'Declined'
            },
            {
                id: 'Q-2023-005',
                customer: 'Karthik Venkatesh',
                amount: 7350.00,
                createdDate: '2023-05-20',
                validUntil: '2023-06-20',
                status: 'Accepted'
            }
        ];

        if (quotes.length === 0) {
            quotesList.innerHTML = '<tr><td colspan="7" class="text-center">No quotes found</td></tr>';
            return;
        }

        // Create rows for each quote
        quotes.forEach(quote => {
            const row = document.createElement('tr');

            // Format dates
            const createdDate = new Date(quote.createdDate).toLocaleDateString();
            const validUntil = new Date(quote.validUntil).toLocaleDateString();

            row.innerHTML = `
                <td>${quote.id}</td>
                <td>${quote.customer}</td>
                <td>₹${quote.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td>${createdDate}</td>
                <td>${validUntil}</td>
                <td><span class="badge badge-${quote.status.toLowerCase()}">${quote.status}</span></td>
                <td class="actions">
                    <button class="btn btn-icon btn-outline view-quote" data-id="${quote.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-icon btn-outline edit-quote" data-id="${quote.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon btn-outline delete-quote" data-id="${quote.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            quotesList.appendChild(row);
        });

        // Add event listeners to action buttons
        addQuoteActionListeners();

    } catch (error) {
        console.error('Error loading quotes:', error);
        quotesList.innerHTML = `<tr><td colspan="7" class="text-center">Error loading quotes: ${error.message}</td></tr>`;
    }
}

// Filter Quotes
function filterQuotes() {
    const searchTerm = document.getElementById('quotes-search').value.toLowerCase();
    const statusFilter = document.getElementById('filter-quote-status').value;

    const rows = document.querySelectorAll('#quotes-list tr');

    rows.forEach(row => {
        // Skip header or message rows
        if (row.querySelector('td[colspan]')) return;

        const quoteId = row.cells[0].textContent.toLowerCase();
        const customer = row.cells[1].textContent.toLowerCase();
        const status = row.cells[5].textContent.trim();

        const matchesSearch = quoteId.includes(searchTerm) || customer.includes(searchTerm);
        const matchesStatus = statusFilter === '' || status === statusFilter;

        if (matchesSearch && matchesStatus) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add Quote Action Listeners
function addQuoteActionListeners() {
    // View quote
    document.querySelectorAll('.view-quote').forEach(btn => {
        btn.addEventListener('click', () => {
            alert(`View Quote ${btn.dataset.id} - This would open the quote details view`);
        });
    });

    // Edit quote
    document.querySelectorAll('.edit-quote').forEach(btn => {
        btn.addEventListener('click', () => {
            alert(`Edit Quote ${btn.dataset.id} - This would open the quote edit modal`);
        });
    });

    // Delete quote
    document.querySelectorAll('.delete-quote').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete Quote ${btn.dataset.id}?`)) {
                // In a real app, this would send a delete request to the API
                alert(`Quote ${btn.dataset.id} has been deleted`);
                btn.closest('tr').remove();
            }
        });
    });
}

// Show Add Quote Modal
function showAddQuoteModal() {
    alert('Create Quote - This would open a modal to create a new quote');
} 