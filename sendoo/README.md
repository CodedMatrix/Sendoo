# Sendoo - Package Delivery Service

![Sendoo Logo](public/images/logo.png)

## 📦 Introduction

Sendoo is a modern, user-friendly package delivery service web application designed to provide seamless shipping experiences. The platform offers real-time tracking, offline capabilities, and a responsive interface for managing deliveries from any device.

**Live Demo:** [https://sendoo.netlify.app/](https://sendoo.netlify.app/)

**Project Blog:** [Building a Modern Delivery Service Platform](https://medium.com/@umuhozaallyk/building-a-modern-delivery-service-platform-with-javascript-and-pwa-features)

**Author:** [Umuhoza Ally Khaled](https://www.linkedin.com/in/umuhozaallyk/)

![Sendoo Dashboard Screenshot](public/images/screenshots/dashboard.png)

## ✨ Features

- **Real-time Delivery Tracking**: Monitor your package's journey with live updates
- **Offline Support**: Continue using the app even without an internet connection
- **Progressive Web App (PWA)**: Install on your device for a native app-like experience
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive client-side validation for all forms
- **User Authentication**: Secure login and registration system
- **Interactive Dashboard**: Visual representation of delivery statistics and history

## 🚀 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **PWA Features**: Service Workers, Web Manifest, IndexedDB
- **Real-time Updates**: WebSockets
- **Responsive Design**: CSS Grid, Flexbox
- **Form Validation**: Custom validation library
- **Deployment**: Netlify

## 🛠️ Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/CodedMatrix/Sendoo.git
   cd Sendoo
   ```

2. If you're using a package manager (optional):
   ```bash
   # Using npm
   npm install

   # Using yarn
   yarn install
   ```

3. Start a local development server:
   ```bash
   # If you have Node.js installed
   npx serve public

   # Or use any static file server
   python -m http.server 8000 --directory public
   ```

4. Open your browser and navigate to `http://localhost:8000` or the port specified by your server.

## 📱 Usage

### Creating a Delivery

1. Navigate to the "Send Package" page
2. Fill in the package details (weight, dimensions, etc.)
3. Enter pickup and delivery addresses
4. Add recipient information
5. Choose a delivery method
6. Complete payment
7. Receive a tracking number for your shipment

### Tracking a Package

1. Go to the "Track" page
2. Enter your tracking number (format: SD-XXXXXX-XXXX)
3. View real-time status updates and delivery information

### Using Offline Features

1. The app will automatically detect when you're offline
2. You can still browse previously loaded pages
3. Create deliveries that will sync when you're back online
4. Access cached tracking information

![Sendoo Tracking Screenshot](public/images/screenshots/tracking.png)

## 🧩 Project Structure

```
sendoo/
├── public/               # Public-facing files
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   │   ├── main.js       # Main application logic
│   │   ├── validation.js # Form validation utilities
│   │   ├── socket.js     # WebSocket connections
│   │   └── auth.js       # Authentication logic
│   ├── images/           # Images and icons
│   ├── pages/            # HTML pages
│   ├── service-worker.js # Service worker for offline support
│   ├── manifest.json     # PWA manifest
│   ├── offline.html      # Offline fallback page
│   └── index.html        # Main entry point
├── server/               # Server-side code (if applicable)
├── docs/                 # Documentation
└── README.md             # Project documentation
```

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

### Development Guidelines

- Follow the existing code style and naming conventions
- Write descriptive commit messages
- Update documentation for any new features
- Add appropriate comments to your code
- Test your changes thoroughly before submitting a pull request

## 🔗 Related Projects

- [Sendoo Mobile App](https://github.com/CodedMatrix/sendoo-mobile) - Native mobile application for Sendoo
- [Sendoo API](https://github.com/CodedMatrix/sendoo-api) - Backend API for Sendoo services
- [Sendoo Admin Dashboard](https://github.com/CodedMatrix/sendoo-admin) - Administrative interface for Sendoo

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Umuhoza Ally Khaled

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgements

- [Font Awesome](https://fontawesome.com/) for the icons
- [Netlify](https://www.netlify.com/) for hosting the application
- All contributors who have helped improve this project
- Special thanks to the open-source community for their invaluable resources

---

Made with ❤️ by [Umuhoza Ally Khaled](https://github.com/CodedMatrix) 
