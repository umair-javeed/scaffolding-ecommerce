const API_URL = 'https://844b95xljc.execute-api.us-east-1.amazonaws.com/prod'; // Replace with your API URL

export interface OrderItem {
  id: number;
  name: string;
  weight: number;
  unit: 'kg' | 'lb';
  pricePerUnit: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  orderId?: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress?: ShippingAddress;
  status?: string;
  createdAt?: number;
}

export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createOrder = async (order: Order) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrder = async (orderId: string) => {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`);
    if (!response.ok) throw new Error('Failed to fetch order');
    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};