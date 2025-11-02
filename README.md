# ShopHub - E-Commerce Website

The website will provide a smooth and engaging shopping experience with features such as product listing, detailed product pages.

A fully responsive, front-end e-commerce website that fetches data from the FakeStore API. Built with HTML, CSS, and JavaScript.

## Features

### 🏠 Homepage
- Attractive hero section introducing the store
- Featured products from the FakeStore API
- Smooth scrolling navigation

### 📦 Product Listing Page
- Display all products fetched from the API
- Beautiful grid layout with product cards
- Filter by category
- Filter by price range using slider
- Search functionality to find products by name or description
- Star ratings and review counts

### 🔍 Product Detail Modal
- Click any product to view detailed information
- High-quality product images
- Full product description
- Rating and review information
- Quick add to cart functionality

### 🛒 Shopping Cart
- Add items to cart
- Remove items from cart
- Update quantity with +/- buttons
- Persistent cart storage using localStorage
- Real-time total price calculation
- Empty cart message

### 🌓 Dark Mode
- Toggle between light and dark themes
- Theme preference saved in localStorage
- Smooth transitions between themes

### 📱 Responsive Design
- Fully responsive layout
- Mobile-friendly navigation
- Adaptive grid system
- Touch-friendly buttons and controls
- Optimized for tablets and desktops

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables and flexbox/grid
- **JavaScript (ES6+)** - Fetch API, localStorage, DOM manipulation
- **FakeStore API** - https://fakestoreapi.com

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/suhrudsharma/e-commerseWebsite.git
cd e-commerseWebsite
```

2. Open `index.html` in your web browser:
   - Simply double-click the file, or
   - Use a live server extension in VS Code, or
   - Run a local server (e.g., `python -m http.server`)

3. Start shopping! Browse products, search, filter, and add items to your cart.

## API Integration

The website uses the [FakeStore API](https://fakestoreapi.com/docs) to fetch:
- Products list
- Product details
- Categories
- Product ratings

## Browser Compatibility

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge
- Opera

## File Structure

```
e-commerseWebsite/
│
├── index.html      # Main HTML file with all page sections
├── styles.css      # Complete styling including dark mode
├── script.js       # All JavaScript functionality
└── README.md       # This file
```

## Key Features Implementation

### Search & Filter
- Real-time search as you type
- Category dropdown filter
- Price range slider filter
- Combined filtering (search + category + price)

### Cart Functionality
- Local storage persistence
- Quantity management
- Total price calculation
- Checkout simulation

### Responsive Breakpoints
- Desktop: > 768px
- Tablet: 481px - 768px
- Mobile: ≤ 480px

## Future Enhancements

Potential features for future development:
- User authentication
- Payment integration
- Order tracking
- User reviews and ratings
- Wishlist functionality
- Product comparison
- Advanced filtering options
- Admin panel

## License

This project is open source and available under the MIT License.

## Author

Developed as part of an e-commerce project.

## Credits

- [FakeStore API](https://fakestoreapi.com) for product data
- Modern CSS techniques and JavaScript best practices
