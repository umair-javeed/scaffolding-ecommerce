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
  },
  // ⬇️ NEW PRODUCTS - ADD THESE
  {
    id: 6,
    name: "Mobile Step Ladder Scaffolding Tower",
    description: "Professional-grade mobile scaffolding tower with wheels and multiple working platforms - yellow powder-coated steel construction",
    pricePerKg: 2.00,
    pricePerLb: 0.91,
    image: "/products/step_ladder.jpg",
    category: "Systems",
    stock: 15
  },
  {
    id: 7,
    name: "Metal Shuttering Planks",
    description: "High-quality galvanized metal shuttering planks with pre-drilled holes - durable and reusable for concrete formwork",
    pricePerKg: 1.32,
    pricePerLb: 0.60,
    image: "/products/shuttering_plants.jpg",
    category: "Formwork",
    stock: 500
  },
  {
    id: 8,
    name: "New 20ft MS Scaffolding Pipe",
    description: "Brand new 20 feet mild steel scaffolding pipes - high-quality construction-grade with uniform thickness",
    pricePerKg: 2.80,
    pricePerLb: 1.27,
    image: "/products/new_20_ft_ms_pipe.jpg",
    category: "Pipes",
    stock: 1000
  },
  {
    id: 9,
    name: "Shuttering Plate 2ft x 3ft",
    description: "Heavy-duty metal shuttering plates for concrete formwork - standard 2x3 feet size with reinforced edges",
    pricePerKg: 2.50,
    pricePerLb: 1.13,
    image: "/products/plate_2ftby3ft.jpg",
    category: "Formwork",
    stock: 800
  },
  {
    id: 10,
    name: "Adjustable Pipe Jack / Base Plate Jack",
    description: "Heavy-duty adjustable pipe jack with base plate - threaded rod design for easy height adjustment and leveling",
    pricePerKg: 3.20,
    pricePerLb: 1.45,
    image: "/products/pipe_jack.jpg",
    category: "Accessories",
    stock: 500
  },
  {
    id: 11,
    name: "Used 20ft Shuttering Pipe (Good Condition)",
    description: "Quality used 20 feet shuttering pipes in good working condition - cost-effective solution inspected for quality",
    pricePerKg: 2.00,
    pricePerLb: 0.91,
    image: "/products/use_20_ft_shuttering_pipe.jpg",
    category: "Pipes",
    stock: 2000
  },
  // ⬆️ END OF NEW PRODUCTS
];

export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

// New helper: Get all categories
export const getCategories = (): string[] => {
  return Array.from(new Set(products.map(product => product.category)));
};

// New helper: Get products by stock status
export const getLowStockProducts = (threshold: number = 50): Product[] => {
  return products.filter(product => product.stock <= threshold);
};