# Sendoo

Sendoo is a web application for package delivery services, connecting users with drivers to send packages efficiently and securely.

## Overview

Sendoo allows users to:
- Send packages from one location to another
- Select appropriate vehicles based on package size and weight
- Track deliveries in real-time
- Manage payment methods securely
- Review delivery history and analytics

## Features

### User Authentication
- Secure login and registration system
- JWT-based authentication
- "Remember me" functionality
- Password encryption with bcrypt

### Package Delivery
- Multi-step form for creating delivery requests
- Package information collection (size, weight, quantity)
- Vehicle selection (bike, car, truck) based on package details
- Origin and destination location selection

### Location Services
- Integration with Google Maps API
- Address validation
- Distance calculation
- Route visualization
- Estimated delivery time calculator

### Delivery Tracking
- Real-time status updates
- Filtering options (In Progress, Waiting for Pickup, Delivered)
- Detailed view for each delivery
- Delivery confirmation
- Rating and feedback system

### Payment Processing
- Secure payment method management via Stripe
- Multiple payment methods support
- Payment calculation based on distance and vehicle type
- Receipt generation
- Payment history

### History and Analytics
- Complete delivery history
- Sorting and filtering options
- Usage statistics dashboard
- Spending summaries
- Route and vehicle preferences analytics

## Technical Architecture

### Frontend
- React.js for UI components
- Redux for state management
- Responsive design for mobile and desktop

### Backend
- Node.js with Express
- RESTful API architecture
- JWT for authentication

### Database
- MongoDB (NoSQL) for flexible data storage

### External APIs
- Google Maps API for location services
- Stripe API for payment processing

### API Endpoints

#### User Authentication
- `POST /api/user/login` - User login
- `POST /api/user/register` - User registration

#### Package Management
- `POST /api/package` - Create a new package delivery request
- `GET /api/package/{id}` - Get details of a specific package

#### Vehicle Selection
- `GET /api/vehicles` - Get available vehicles based on package details

## Data Models

### User
- Name
- Email
- Password (hashed)
- Contact information
- Payment methods
- Delivery history

### Package
- Origin address
- Destination address
- Package details (weight, size, quantity)
- Selected vehicle type
- Status (pending, picked up, delivered)
- Timestamps

### Vehicle
- Type (bike, car, truck)
- Capacity
- Price rates

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Google Maps API key
- Stripe API credentials

### Installation
1. Clone the repository
   ```
   git clone https://github.com/yourusername/sendoo.git
   cd sendoo
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Start the development server
   ```
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Deployment

The application can be deployed to platforms like Heroku, AWS, or DigitalOcean.

## Future Enhancements
- Driver application and management
- Subscription-based delivery plans
- International shipping options
- Integration with e-commerce platforms
- Mobile applications (iOS/Android)

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contributors
- UMUHOZA ALLY KHALED "umuhozaallykhaled@gmail.com"
