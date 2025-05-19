// Reports Management JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initReports();
});

// Initialize Reports Page
function initReports() {
    // Set up event listeners for report types
    setupReportTypeListeners();

    // Load the default report (Sales by Period)
    loadSalesReport();
}

// Set up report type listeners
function setupReportTypeListeners() {
    const reportTypes = document.querySelectorAll('.report-type');

    if (reportTypes) {
        reportTypes.forEach(type => {
            type.addEventListener('click', function () {
                // Remove active class from all report types
                reportTypes.forEach(t => t.classList.remove('active'));

                // Add active class to clicked report type
                this.classList.add('active');

                // Get report type
                const reportType = this.dataset.report;

                // Load the appropriate report
                loadReport(reportType);
            });
        });
    }
}

// Load appropriate report based on type
function loadReport(reportType) {
    // Hide all report containers
    document.querySelectorAll('.report-container').forEach(container => {
        container.style.display = 'none';
    });

    // Show appropriate container
    const container = document.getElementById(`${reportType}-container`);
    if (container) {
        container.style.display = 'block';
    }

    // Load the report data
    switch (reportType) {
        case 'sales':
            loadSalesReport();
            break;
        case 'leads':
            loadLeadsReport();
            break;
        case 'customers':
            loadCustomersReport();
            break;
        case 'products':
            loadProductsReport();
            break;
        default:
            loadSalesReport();
    }
}

// Load Sales Report
function loadSalesReport() {
    try {
        // Get report container
        const container = document.getElementById('sales-chart');
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        // Get period selector
        const periodSelector = document.getElementById('sales-period');
        const period = periodSelector ? periodSelector.value : 'monthly';

        // Generate data based on period
        const data = generateSalesData(period);

        // Create canvas for chart
        const canvas = document.createElement('canvas');
        canvas.id = 'sales-chart-canvas';
        container.appendChild(canvas);

        // Draw chart (using chartjs mockup)
        drawSalesChart(canvas, data, period);

    } catch (error) {
        console.error('Error loading sales report:', error);
        const container = document.getElementById('sales-chart');
        if (container) {
            container.innerHTML = `<div class="error-message">Error loading sales report: ${error.message}</div>`;
        }
    }

    // Add event listener to period selector
    const periodSelector = document.getElementById('sales-period');
    if (periodSelector) {
        periodSelector.addEventListener('change', loadSalesReport);
    }

    // Add event listener to export button
    const exportBtn = document.querySelector('#sales-container .export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            alert('Export Sales Report - This would download a PDF or CSV of the report');
        });
    }
}

// Load Leads Report
function loadLeadsReport() {
    try {
        // Similar pattern to sales report but for leads data
        const container = document.getElementById('leads-chart');
        if (!container) return;

        container.innerHTML = '';

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'leads-chart-canvas';
        container.appendChild(canvas);

        // Draw chart
        drawLeadsChart(canvas);

        // Add event listener to export button
        const exportBtn = document.querySelector('#leads-container .export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                alert('Export Leads Report - This would download a PDF or CSV of the report');
            });
        }
    } catch (error) {
        console.error('Error loading leads report:', error);
        const container = document.getElementById('leads-chart');
        if (container) {
            container.innerHTML = `<div class="error-message">Error loading leads report: ${error.message}</div>`;
        }
    }
}

// Load Customers Report 
function loadCustomersReport() {
    try {
        const container = document.getElementById('customers-chart');
        if (!container) return;

        container.innerHTML = '';

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'customers-chart-canvas';
        container.appendChild(canvas);

        // Draw chart
        drawCustomersChart(canvas);

        // Add event listener to export button
        const exportBtn = document.querySelector('#customers-container .export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                alert('Export Customers Report - This would download a PDF or CSV of the report');
            });
        }
    } catch (error) {
        console.error('Error loading customers report:', error);
        const container = document.getElementById('customers-chart');
        if (container) {
            container.innerHTML = `<div class="error-message">Error loading customers report: ${error.message}</div>`;
        }
    }
}

// Load Products Report
function loadProductsReport() {
    try {
        const container = document.getElementById('products-chart');
        if (!container) return;

        container.innerHTML = '';

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'products-chart-canvas';
        container.appendChild(canvas);

        // Draw chart
        drawProductsChart(canvas);

        // Add event listener to export button
        const exportBtn = document.querySelector('#products-container .export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                alert('Export Products Report - This would download a PDF or CSV of the report');
            });
        }
    } catch (error) {
        console.error('Error loading products report:', error);
        const container = document.getElementById('products-chart');
        if (container) {
            container.innerHTML = `<div class="error-message">Error loading products report: ${error.message}</div>`;
        }
    }
}

// Generate Sample Sales Data
function generateSalesData(period) {
    // This would be fetched from API in a real app
    let labels, values;

    switch (period) {
        case 'weekly':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            values = [12500, 14200, 8900, 9600, 16700, 7800, 4500];
            break;
        case 'quarterly':
            labels = ['Q1', 'Q2', 'Q3', 'Q4'];
            values = [245000, 312000, 287000, 368000];
            break;
        case 'yearly':
            labels = ['2018', '2019', '2020', '2021', '2022', '2023'];
            values = [780000, 925000, 875000, 1050000, 1230000, 960000];
            break;
        case 'monthly':
        default:
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            values = [78000, 82000, 91000, 85000, 72000, 79000, 95000, 88000, 92000, 87000, 94000, 99000];
    }

    return { labels, values };
}

// Draw Sales Chart (mock - in real app would use Chart.js)
function drawSalesChart(canvas, data, period) {
    // In a real app, this would use Chart.js or similar library
    // For now, we'll mock it with a simple visualization

    const ctx = canvas.getContext('2d');
    const { labels, values } = data;

    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 300;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw title
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(`Sales Report (${period})`, canvas.width / 2, 30);

    // Draw simple bar chart
    const barWidth = (canvas.width - 80) / labels.length;
    const maxValue = Math.max(...values);
    const scaleY = (canvas.height - 100) / maxValue;

    // Draw bars
    for (let i = 0; i < labels.length; i++) {
        const x = 40 + i * barWidth;
        const barHeight = values[i] * scaleY;
        const y = canvas.height - 60 - barHeight;

        // Draw bar
        ctx.fillStyle = '#4a6cf7';
        ctx.fillRect(x, y, barWidth - 10, barHeight);

        // Draw label
        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + barWidth / 2 - 5, canvas.height - 40);

        // Draw value
        ctx.font = '10px Arial';
        ctx.fillText('₹' + values[i].toLocaleString(), x + barWidth / 2 - 5, y - 5);
    }

    // Draw mock axes
    ctx.beginPath();
    ctx.moveTo(40, 40);
    ctx.lineTo(40, canvas.height - 40);
    ctx.lineTo(canvas.width - 40, canvas.height - 40);
    ctx.strokeStyle = '#999';
    ctx.stroke();
}

// Draw Leads Chart (mock)
function drawLeadsChart(canvas) {
    // Similar mock implementation for leads
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 300;

    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Leads by Source (Mock Data)', canvas.width / 2, 30);

    // Draw pie chart
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;

    const data = [
        { label: 'Website', value: 45, color: '#4a6cf7' },
        { label: 'Social Media', value: 25, color: '#6577F3' },
        { label: 'Referral', value: 15, color: '#8064A2' },
        { label: 'Email', value: 10, color: '#79C7E3' },
        { label: 'Other', value: 5, color: '#A3A1FB' }
    ];

    let startAngle = 0;
    let total = data.reduce((sum, item) => sum + item.value, 0);

    // Draw pie segments
    data.forEach(item => {
        const sliceAngle = (2 * Math.PI * item.value) / total;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();

        ctx.fillStyle = item.color;
        ctx.fill();

        startAngle += sliceAngle;
    });

    // Draw legend
    let legendY = centerY - radius / 2;
    const legendX = centerX + radius + 20;

    data.forEach(item => {
        ctx.beginPath();
        ctx.rect(legendX, legendY, 15, 15);
        ctx.fillStyle = item.color;
        ctx.fill();

        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.fillText(`${item.label} (${item.value}%)`, legendX + 20, legendY + 12);

        legendY += 25;
    });
}

// Draw Customers Chart (mock)
function drawCustomersChart(canvas) {
    // Simple mock implementation
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 300;

    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Customer Growth (Mock Data)', canvas.width / 2, 30);

    // Draw line chart
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const values = [120, 135, 142, 160, 178, 193];

    const chartWidth = canvas.width - 80;
    const chartHeight = canvas.height - 100;
    const xStep = chartWidth / (months.length - 1);

    const maxValue = Math.max(...values);
    const scaleY = chartHeight / maxValue;

    // Draw line
    ctx.beginPath();
    months.forEach((month, i) => {
        const x = 40 + i * xStep;
        const y = canvas.height - 60 - (values[i] * scaleY);

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        // Draw point
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#4a6cf7';
        ctx.fill();

        // Draw label
        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText(month, x, canvas.height - 40);

        // Draw value
        ctx.font = '10px Arial';
        ctx.fillText('₹' + values[i].toLocaleString(), x, y - 10);
    });

    ctx.strokeStyle = '#4a6cf7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(40, 40);
    ctx.lineTo(40, canvas.height - 40);
    ctx.lineTo(canvas.width - 40, canvas.height - 40);
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Draw Products Chart (mock)
function drawProductsChart(canvas) {
    // Simple mock implementation
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 300;

    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Product Sales (Mock Data)', canvas.width / 2, 30);

    // Draw horizontal bar chart
    const products = [
        'Enterprise CRM Pro',
        'Team License',
        'Cloud Storage',
        'Support Package',
        'Implementation'
    ];

    const values = [45000, 35000, 28000, 22000, 18000];

    const maxValue = Math.max(...values);
    const barHeight = 30;
    const barSpacing = 15;
    const chartHeight = products.length * (barHeight + barSpacing);
    const scaleX = (canvas.width - 200) / maxValue;

    let y = (canvas.height - chartHeight) / 2;

    products.forEach((product, i) => {
        const barWidth = values[i] * scaleX;

        // Draw bar
        ctx.fillStyle = '#4a6cf7';
        ctx.fillRect(100, y, barWidth, barHeight);

        // Draw product name
        ctx.font = '12px Arial';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'right';
        ctx.fillText(product, 90, y + barHeight / 2 + 4);

        // Draw value
        ctx.textAlign = 'left';
        ctx.fillText('₹' + values[i].toLocaleString(), barWidth + 110, y + barHeight / 2 + 4);

        y += barHeight + barSpacing;
    });
} 