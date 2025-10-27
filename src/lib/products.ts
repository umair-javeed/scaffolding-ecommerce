export interface Product {
  id: number;
  name: string;
  description: string;
  pricePerKg: number;
  pricePerLb: number;
  image: string;
  category: string;
  stock: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "MS Scaffolding Pipes",
    description: "High-quality mild steel scaffolding pipes available in various sizes - durable and corrosion resistant",
    pricePerKg: 2.50,
    pricePerLb: 1.13,
    image: "/images/ms-pipes.jpg",
    category: "Pipes",
    stock: 5000
  },
  {
    id: 2,
    name: "Scaffold Clamps & Couplers",
    description: "Heavy-duty scaffolding clamps and couplers - secure connections for safe construction",
    pricePerKg: 3.80,
    pricePerLb: 1.72,
    image: "/images/scaffold-clamps.jpg",
    category: "Accessories",
    stock: 10000
  },
  {
    id: 3,
    name: "Complete Scaffold Frame System",
    description: "Pre-assembled scaffold frame system with adjustable height - perfect for construction projects",
    pricePerKg: 2.20,
    pricePerLb: 1.00,
    image: "/images/scaffold-frame.jpg",
    category: "Systems",
    stock: 50000
  },
  {
    id: 4,
    name: "Professional Scaffold Structure",
    description: "Complete scaffolding structure package with pipes, clamps, and platforms - ready to install",
    pricePerKg: 2.10,
    pricePerLb: 0.95,
    image: "/images/scaffold-structure.jpg",
    category: "Systems",
    stock: 75000
  },
  {
    id: 5,
    name: "Bulk Scaffolding Materials",
    description: "Wholesale scaffolding pipes and materials - perfect for large construction projects",
    pricePerKg: 1.90,
    pricePerLb: 0.86,
    image: "/images/scaffolding-yard.jpg",
    category: "Bulk",
    stock: 100000
  }
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};