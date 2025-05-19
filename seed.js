const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Customer = require('./models/Customer');
const Deal = require('./models/Deal');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crm-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected for seeding'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Sample data with South Indian names
const customers = [
    {
        name: 'Arjun Subramaniam',
        email: 'arjun@chennaitech.com',
        phone: '(555) 789-1234',
        company: 'Chennai Tech Solutions',
        status: 'Active',
        notes: 'Key decision maker for their enterprise software needs'
    },
    {
        name: 'Priya Krishnamurthy',
        email: 'priya@bangaloresoft.com',
        phone: '(555) 234-5678',
        company: 'Bangalore Software Solutions',
        status: 'Active',
        notes: 'Looking for CRM and ERP integration'
    },
    {
        name: 'Vijay Rajendran',
        email: 'vijay@hyderabadtech.in',
        phone: '(555) 345-6789',
        company: 'Hyderabad Technologies',
        status: 'Lead',
        notes: 'Interested in cloud migration services'
    },
    {
        name: 'Lakshmi Venkatesh',
        email: 'lakshmi@kochidata.com',
        phone: '(555) 456-7890',
        company: 'Kochi Data Systems',
        status: 'Active',
        notes: 'Current client for data analytics platform'
    },
    {
        name: 'Karthik Narayanan',
        email: 'karthik@maduraisoft.in',
        phone: '(555) 567-8901',
        company: 'Madurai Software Labs',
        status: 'Inactive',
        notes: 'Previous client, potential for reactivation'
    },
    {
        name: 'Deepa Chandrasekhar',
        email: 'deepa@trivandrumit.com',
        phone: '(555) 678-9012',
        company: 'Trivandrum IT Solutions',
        status: 'Lead',
        notes: 'Referred by Lakshmi Venkatesh'
    },
    {
        name: 'Raja Murugan',
        email: 'raja@coimbatoreweb.com',
        phone: '(555) 789-0123',
        company: 'Coimbatore Web Development',
        status: 'Active',
        notes: 'Web development partner for multiple projects'
    },
    {
        name: 'Ananya Padmanabhan',
        email: 'ananya@mysoreai.in',
        phone: '(555) 890-1234',
        company: 'Mysore AI Research',
        status: 'Lead',
        notes: 'Interested in AI integration services'
    },
    {
        name: 'Ganesh Ramaswamy',
        email: 'ganesh@tiruchiinfotech.com',
        phone: '(555) 901-2345',
        company: 'Tiruchi InfoTech',
        status: 'Active',
        notes: 'Long-term client for infrastructure services'
    },
    {
        name: 'Meena Iyengar',
        email: 'meena@mangaloredata.in',
        phone: '(555) 012-3456',
        company: 'Mangalore Data Analytics',
        status: 'Active',
        notes: 'Recently upgraded to premium support plan'
    },
    // Add some international clients for diversity
    {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        company: 'Acme Corporation',
        status: 'Active',
        notes: 'Global partner for enterprise solutions'
    },
    {
        name: 'Sarah Johnson',
        email: 'sarah@techcorp.com',
        phone: '(555) 987-6543',
        company: 'Tech Corporation',
        status: 'Active',
        notes: 'Interested in expanding technology stack'
    },
    {
        name: 'Michael Brown',
        email: 'michael@globalhealth.org',
        phone: '(555) 456-7890',
        company: 'Global Health',
        status: 'Inactive',
        notes: 'Previous healthcare industry client'
    }
];

// Seed deals function (will be called after customers are seeded)
const seedDeals = async (customerMap) => {
    const deals = [
        {
            title: 'ERP Implementation',
            customer: customerMap.get('arjun@chennaitech.com'),
            value: 75000,
            status: 'Qualified',
            expectedCloseDate: new Date(2023, 11, 30), // Dec 30, 2023
            notes: 'Full ERP system implementation with custom modules'
        },
        {
            title: 'CRM Integration',
            customer: customerMap.get('priya@bangaloresoft.com'),
            value: 45000,
            status: 'Proposal',
            expectedCloseDate: new Date(2023, 10, 15), // Nov 15, 2023
            notes: 'Integration with existing systems'
        },
        {
            title: 'Cloud Migration Assessment',
            customer: customerMap.get('vijay@hyderabadtech.in'),
            value: 12000,
            status: 'New',
            expectedCloseDate: new Date(2023, 11, 15), // Dec 15, 2023
            notes: 'Initial assessment phase for cloud migration'
        },
        {
            title: 'Data Analytics Platform Upgrade',
            customer: customerMap.get('lakshmi@kochidata.com'),
            value: 35000,
            status: 'Negotiation',
            expectedCloseDate: new Date(2023, 9, 30), // Oct 30, 2023
            notes: 'Upgrade to latest version with new ML features'
        },
        {
            title: 'Support Renewal',
            customer: customerMap.get('karthik@maduraisoft.in'),
            value: 8000,
            status: 'Negotiation',
            expectedCloseDate: new Date(2023, 10, 10), // Nov 10, 2023
            notes: 'Annual support contract renewal with potential upgrade'
        },
        {
            title: 'IT Infrastructure Audit',
            customer: customerMap.get('deepa@trivandrumit.com'),
            value: 15000,
            status: 'New',
            expectedCloseDate: new Date(2023, 11, 5), // Dec 5, 2023
            notes: 'Comprehensive IT audit with security assessment'
        },
        {
            title: 'Web Application Development',
            customer: customerMap.get('raja@coimbatoreweb.com'),
            value: 65000,
            status: 'Won',
            expectedCloseDate: new Date(2023, 8, 15), // Sep 15, 2023 (already won)
            notes: 'E-commerce platform development with payment integration'
        },
        {
            title: 'AI Integration Prototype',
            customer: customerMap.get('ananya@mysoreai.in'),
            value: 22000,
            status: 'Proposal',
            expectedCloseDate: new Date(2023, 11, 20), // Dec 20, 2023
            notes: 'Proof of concept for AI integration with existing systems'
        },
        {
            title: 'Infrastructure Upgrade',
            customer: customerMap.get('ganesh@tiruchiinfotech.com'),
            value: 95000,
            status: 'Won',
            expectedCloseDate: new Date(2023, 7, 30), // Aug 30, 2023 (already won)
            notes: 'Complete infrastructure refresh with new servers and networking'
        },
        {
            title: 'Premium Support Plan',
            customer: customerMap.get('meena@mangaloredata.in'),
            value: 12000,
            status: 'Won',
            expectedCloseDate: new Date(2023, 9, 10), // Oct 10, 2023 (already won)
            notes: 'Upgrade to premium 24/7 support plan'
        },
        {
            title: 'Global Expansion Consultation',
            customer: customerMap.get('john@example.com'),
            value: 45000,
            status: 'Qualified',
            expectedCloseDate: new Date(2023, 11, 10), // Dec 10, 2023
            notes: 'Consulting services for global market expansion'
        },
        {
            title: 'Legacy System Migration',
            customer: customerMap.get('sarah@techcorp.com'),
            value: 85000,
            status: 'Proposal',
            expectedCloseDate: new Date(2023, 10, 25), // Nov 25, 2023
            notes: 'Migration from legacy systems to modern architecture'
        },
        {
            title: 'Healthcare Data Solution',
            customer: customerMap.get('michael@globalhealth.org'),
            value: 55000,
            status: 'Lost',
            expectedCloseDate: new Date(2023, 8, 20), // Sep 20, 2023 (already lost)
            notes: 'Lost to competitor with more healthcare-specific experience'
        }
    ];

    try {
        await Deal.deleteMany({});
        const createdDeals = await Deal.insertMany(deals);
        console.log(`${createdDeals.length} deals successfully seeded`);
    } catch (error) {
        console.error('Error seeding deals:', error);
    }
};

// Main seed function
const seedDatabase = async () => {
    try {
        // Clear existing data
        await Customer.deleteMany({});
        console.log('Previous customers cleared');

        // Seed customers
        const createdCustomers = await Customer.insertMany(customers);
        console.log(`${createdCustomers.length} customers successfully seeded`);

        // Create a map of email to customer ID for easier reference when creating deals
        const customerMap = new Map();
        createdCustomers.forEach(customer => {
            customerMap.set(customer.email, customer._id);
        });

        // Seed deals using the customer IDs
        await seedDeals(customerMap);

        console.log('Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase(); 