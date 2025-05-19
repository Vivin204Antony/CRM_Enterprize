# Simple CRM

A basic Customer Relationship Management (CRM) system built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- Customer management (add, edit, delete)
- Deal management (add, edit, delete)
- Responsive design
- Simple and intuitive interface

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/simple-crm.git
cd simple-crm
```

2. Install dependencies:
```
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/crm-db
```

Note: Adjust the `MONGO_URI` if you're using MongoDB Atlas or a different configuration.

## Running the Application

1. Start MongoDB (if using local installation):
```
mongod
```

2. Start the application:
```
npm start
```

Or for development with auto-restart:
```
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5000
```

## Project Structure

- `server.js` - Main application entry point
- `routes/` - API routes
- `models/` - MongoDB models
- `frontend/` - Client-side code
  - `index.html` - Main HTML file
  - `css/` - Stylesheets
  - `js/` - JavaScript files

## API Endpoints

### Customers

- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get a specific customer
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer
- `DELETE /api/customers/:id` - Delete a customer

### Deals

- `GET /api/deals` - Get all deals
- `GET /api/deals/:id` - Get a specific deal
- `GET /api/deals/customer/:customerId` - Get deals for a specific customer
- `POST /api/deals` - Create a new deal
- `PUT /api/deals/:id` - Update a deal
- `DELETE /api/deals/:id` - Delete a deal

## License

MIT 

## Database Seeding

To populate your database with sample data including South Indian names:

1. Make sure MongoDB is running
2. Run the seed script:

```bash
node seed.js
```

This will add 13 sample customers and 13 deals to your database. The script will:
- Clear existing data from the customers and deals collections
- Add customers with South Indian names from various cities including Chennai, Bangalore, Hyderabad, Kochi, Madurai, etc.
- Create deals linked to these customers with various statuses and values
- Output confirmation when the seeding is complete

After running the seed script, start the application and you should see the sample data in the CRM interface. 