# Scaffolding E-Commerce

A modern e-commerce application built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Product Catalog**: Browse through a collection of products
- **Shopping Cart**: Add/remove items and update quantities
- **User Authentication**: Login and signup pages
- **Checkout Process**: Complete order flow with shipping and payment forms
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 📁 Project Structure

```
scaffolding-ecommerce/
├── public/
│   └── images/          # Product images
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── layout.tsx   # Root layout
│   │   ├── page.tsx     # Home page
│   │   ├── login/       # Login page
│   │   ├── signup/      # Signup page
│   │   ├── cart/        # Shopping cart page
│   │   └── checkout/    # Checkout page
│   ├── components/      # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ProductCard.tsx
│   ├── lib/             # Utilities and data
│   │   └── products.ts  # Product data and types
│   └── styles/
│       └── globals.css  # Global styles
└── Configuration files
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd scaffolding-ecommerce
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization

### Adding Products

Edit `src/lib/products.ts` to add or modify products:

```typescript
export const products: Product[] = [
  {
    id: 1,
    name: "Product Name",
    description: "Product description",
    price: 99.99,
    image: "/images/product.jpg",
    category: "Category",
    stock: 50
  },
  // Add more products...
];
```

### Styling

The project uses Tailwind CSS. Customize colors and theme in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Customize primary color shades
      },
    },
  },
}
```

### Adding Product Images

Place your product images in the `public/images/` directory and reference them in the products data.

## 🔐 Environment Variables

Create a `.env.local` file for environment-specific variables:

```env
NEXT_PUBLIC_APP_NAME=Your Store Name
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📦 Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI library

## 🚧 Future Enhancements

- [ ] Add database integration
- [ ] Implement real authentication
- [ ] Add payment gateway (Stripe/PayPal)
- [ ] Product search and filtering
- [ ] User profile and order history
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

**Note:** This is a scaffolding project for learning purposes. For production use, you'll need to implement proper authentication, database integration, and payment processing.
