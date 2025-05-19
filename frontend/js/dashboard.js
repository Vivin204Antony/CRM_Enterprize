document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard components
    initCharts();

    // Load recent data
    loadRecentData();
});

// Initialize Charts
function initCharts() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded, skipping chart initialization');
        return;
    }

    try {
        // Pipeline Chart
        const pipelineCtx = document.getElementById('pipeline-chart');
        if (pipelineCtx) {
            // Remove placeholder if it exists
            const placeholder = pipelineCtx.querySelector('.chart-placeholder');
            if (placeholder) {
                placeholder.remove();
            }

            // Create canvas for the chart if needed
            if (!pipelineCtx.tagName || pipelineCtx.tagName.toLowerCase() !== 'canvas') {
                const canvas = document.createElement('canvas');
                canvas.id = 'pipeline-chart-canvas';
                pipelineCtx.appendChild(canvas);

                new Chart(canvas, {
                    type: 'bar',
                    data: {
                        labels: ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
                        datasets: [{
                            label: 'Number of Deals',
                            data: [12, 19, 8, 5, 7, 3],
                            backgroundColor: [
                                '#4361ee',
                                '#f9c74f',
                                '#90be6d',
                                '#f8961e',
                                '#43aa8b',
                                '#f94144'
                            ],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    display: true,
                                    color: 'rgba(0, 0, 0, 0.05)'
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            } else {
                // Use pipelineCtx directly if it's already a canvas
                new Chart(pipelineCtx, {
                    type: 'bar',
                    data: {
                        labels: ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'],
                        datasets: [{
                            label: 'Number of Deals',
                            data: [12, 19, 8, 5, 7, 3],
                            backgroundColor: [
                                '#4361ee',
                                '#f9c74f',
                                '#90be6d',
                                '#f8961e',
                                '#43aa8b',
                                '#f94144'
                            ],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    display: true,
                                    color: 'rgba(0, 0, 0, 0.05)'
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: false
                            }
                        }
                    }
                });
            }
        }

        // Revenue Chart
        const revenueCtx = document.getElementById('revenue-chart');
        if (revenueCtx) {
            // Remove placeholder if it exists
            const placeholder = revenueCtx.querySelector('.chart-placeholder');
            if (placeholder) {
                placeholder.remove();
            }

            // Create canvas for the chart if needed
            if (!revenueCtx.tagName || revenueCtx.tagName.toLowerCase() !== 'canvas') {
                const canvas = document.createElement('canvas');
                canvas.id = 'revenue-chart-canvas';
                revenueCtx.appendChild(canvas);

                new Chart(canvas, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Actual Revenue',
                            data: [12000, 19000, 15000, 25000, 22000, 30000],
                            borderColor: '#4361ee',
                            backgroundColor: 'rgba(67, 97, 238, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Forecast',
                            data: [12000, 19000, 15000, 25000, 22000, 30000, 34000, 40000],
                            borderColor: '#f9c74f',
                            borderDash: [5, 5],
                            tension: 0.4,
                            fill: false
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    display: true,
                                    color: 'rgba(0, 0, 0, 0.05)'
                                },
                                ticks: {
                                    callback: function (value) {
                                        return '₹' + value.toLocaleString();
                                    }
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            } else {
                // Use revenueCtx directly if it's already a canvas
                new Chart(revenueCtx, {
                    type: 'line',
                    data: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        datasets: [{
                            label: 'Actual Revenue',
                            data: [12000, 19000, 15000, 25000, 22000, 30000],
                            borderColor: '#4361ee',
                            backgroundColor: 'rgba(67, 97, 238, 0.1)',
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Forecast',
                            data: [12000, 19000, 15000, 25000, 22000, 30000, 34000, 40000],
                            borderColor: '#f9c74f',
                            borderDash: [5, 5],
                            tension: 0.4,
                            fill: false
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    display: true,
                                    color: 'rgba(0, 0, 0, 0.05)'
                                },
                                ticks: {
                                    callback: function (value) {
                                        return '₹' + value.toLocaleString();
                                    }
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// Load Recent Data
function loadRecentData() {
    // Fetch data from the API
    fetchRecentCustomers();
    fetchDealsData();
}

// Fetch recent customers (focusing on leads)
async function fetchRecentCustomers() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        const customers = await response.json();

        // Filter for leads and sort by creation date (most recent first)
        const leads = customers
            .filter(customer => customer.status === 'Lead')
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);  // Take up to 5 recent leads

        populateRecentLeads(leads);
    } catch (error) {
        console.error('Error fetching recent leads:', error);

        // Display error message
        const recentLeadsTable = document.getElementById('recent-leads');
        if (recentLeadsTable) {
            recentLeadsTable.innerHTML = `<tr><td colspan="5" class="text-center">Error loading recent leads: ${error.message}</td></tr>`;
        }
    }
}

// Fetch deals data for the pipeline chart
async function fetchDealsData() {
    try {
        const response = await fetch(`${API_URL}/deals`);
        const deals = await response.json();

        // Group deals by status to update the pipeline chart
        const dealsByStatus = {
            'New': 0,
            'Qualified': 0,
            'Proposal': 0,
            'Negotiation': 0,
            'Won': 0,
            'Lost': 0
        };

        // Count deals in each status
        deals.forEach(deal => {
            if (dealsByStatus.hasOwnProperty(deal.status)) {
                dealsByStatus[deal.status]++;
            }
        });

        // Update the pipeline chart
        updatePipelineChart(dealsByStatus);

        // Create upcoming tasks based on deals
        const upcomingTasks = createTasksFromDeals(deals);
        populateUpcomingTasks(upcomingTasks);
    } catch (error) {
        console.error('Error fetching deals data:', error);
    }
}

// Update pipeline chart with real data
function updatePipelineChart(dealsByStatus) {
    const pipelineCtx = document.getElementById('pipeline-chart');
    if (!pipelineCtx) return;

    // Get chart instance if it exists
    const chartInstance = Chart.getChart(pipelineCtx);
    if (chartInstance) {
        // Update existing chart
        chartInstance.data.datasets[0].data = [
            dealsByStatus['New'],
            dealsByStatus['Qualified'],
            dealsByStatus['Proposal'],
            dealsByStatus['Negotiation'],
            dealsByStatus['Won'],
            dealsByStatus['Lost']
        ];
        chartInstance.update();
    }
}

// Create upcoming tasks based on deals
function createTasksFromDeals(deals) {
    // Create tasks based on deals with upcoming close dates
    const now = new Date();
    const upcomingDeals = deals
        .filter(deal => {
            // Only deals that are not won/lost
            return deal.status !== 'Won' && deal.status !== 'Lost' && deal.expectedCloseDate;
        })
        .sort((a, b) => new Date(a.expectedCloseDate) - new Date(b.expectedCloseDate))
        .slice(0, 5);

    // Create tasks from these deals
    return upcomingDeals.map(deal => {
        const dueDate = new Date(deal.expectedCloseDate);
        const priority = deal.value > 50000 ? 'High' : (deal.value > 20000 ? 'Medium' : 'Low');

        return {
            description: `Follow up on deal: ${deal.title}`,
            relatedTo: { name: deal.customer ? deal.customer.name : 'Unknown Customer' },
            dueDate: dueDate,
            priority: priority,
            status: 'pending'
        };
    });
}

// Populate recent leads table with data from API
function populateRecentLeads(leads) {
    const recentLeadsTable = document.getElementById('recent-leads');
    if (!recentLeadsTable) return;

    recentLeadsTable.innerHTML = '';

    if (leads.length === 0) {
        recentLeadsTable.innerHTML = '<tr><td colspan="5" class="text-center">No recent leads found</td></tr>';
        return;
    }

    leads.forEach(lead => {
        const row = document.createElement('tr');

        // Format created date
        const createdDate = new Date(lead.createdAt);
        const now = new Date();
        let formattedDate;

        if (createdDate.toDateString() === now.toDateString()) {
            formattedDate = 'Today';
        } else if (new Date(now - 86400000).toDateString() === createdDate.toDateString()) {
            formattedDate = 'Yesterday';
        } else {
            formattedDate = `${createdDate.getDate()} ${createdDate.toLocaleString('default', { month: 'short' })}`;
        }

        // Pick a source randomly since it's not in the data model
        const sources = ['Website', 'Referral', 'LinkedIn', 'Email Campaign', 'Cold Call'];
        const source = sources[Math.floor(Math.random() * sources.length)];

        row.innerHTML = `
            <td>${lead.name}</td>
            <td>${lead.company || '-'}</td>
            <td><span class="badge badge-new">New</span></td>
            <td>${source}</td>
            <td>${formattedDate}</td>
        `;

        recentLeadsTable.appendChild(row);
    });
}

function populateUpcomingTasks(tasks) {
    const upcomingTasksTable = document.getElementById('upcoming-tasks');
    upcomingTasksTable.innerHTML = '';

    if (tasks.length === 0) {
        upcomingTasksTable.innerHTML = '<tr><td colspan="5" class="text-center">No upcoming tasks found</td></tr>';
        return;
    }

    tasks.forEach(task => {
        const row = document.createElement('tr');

        // Format due date
        const dueDate = new Date(task.dueDate);
        const now = new Date();
        let formattedDate;

        if (dueDate.toDateString() === now.toDateString()) {
            formattedDate = 'Today';
        } else if (new Date(now.getTime() + 86400000).toDateString() === dueDate.toDateString()) {
            formattedDate = 'Tomorrow';
        } else {
            formattedDate = `${dueDate.toLocaleString('default', { month: 'short' })} ${dueDate.getDate()}`;
        }

        row.innerHTML = `
      <td>${task.description}</td>
      <td>${task.relatedTo.name || '-'}</td>
      <td>${formattedDate}</td>
      <td><span class="badge badge-${task.priority.toLowerCase()}">${task.priority}</span></td>
      <td><span class="badge badge-${task.status.toLowerCase()}">${task.status}</span></td>
    `;

        upcomingTasksTable.appendChild(row);
    });
} 