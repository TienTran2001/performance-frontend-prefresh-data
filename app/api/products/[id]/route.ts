import { NextRequest, NextResponse } from 'next/server';

// Simulate slow API
async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Fake product database
const products = {
  '1': {
    id: 1,
    name: 'MacBook Pro M3',
    price: 2499,
    category: 'Laptop',
    stock: 15,
    rating: 4.8,
  },
  '2': {
    id: 2,
    name: 'iPhone 15 Pro',
    price: 1199,
    category: 'Phone',
    stock: 30,
    rating: 4.9,
  },
  '3': {
    id: 3,
    name: 'AirPods Pro',
    price: 249,
    category: 'Audio',
    stock: 50,
    rating: 4.7,
  },
  '4': {
    id: 4,
    name: 'iPad Air',
    price: 599,
    category: 'Tablet',
    stock: 20,
    rating: 4.6,
  },
  '5': {
    id: 5,
    name: 'Apple Watch Ultra',
    price: 799,
    category: 'Wearable',
    stock: 25,
    rating: 4.8,
  },
  '6': {
    id: 6,
    name: 'Mac Studio',
    price: 1999,
    category: 'Desktop',
    stock: 10,
    rating: 4.9,
  },
  '7': {
    id: 7,
    name: 'Studio Display',
    price: 1599,
    category: 'Monitor',
    stock: 12,
    rating: 4.5,
  },
  '8': {
    id: 8,
    name: 'Magic Keyboard',
    price: 149,
    category: 'Accessory',
    stock: 40,
    rating: 4.4,
  },
  '9': {
    id: 9,
    name: 'Magic Mouse',
    price: 99,
    category: 'Accessory',
    stock: 60,
    rating: 4.2,
  },
  '10': {
    id: 10,
    name: 'HomePod',
    price: 299,
    category: 'Audio',
    stock: 35,
    rating: 4.6,
  },
  '11': {
    id: 11,
    name: 'Apple TV 4K',
    price: 179,
    category: 'Media',
    stock: 45,
    rating: 4.7,
  },
  '12': {
    id: 12,
    name: 'AirTag 4-Pack',
    price: 99,
    category: 'Accessory',
    stock: 100,
    rating: 4.5,
  },
  '13': {
    id: 13,
    name: 'Mac Mini',
    price: 599,
    category: 'Desktop',
    stock: 18,
    rating: 4.7,
  },
  '14': {
    id: 14,
    name: 'MacBook Air M2',
    price: 1199,
    category: 'Laptop',
    stock: 22,
    rating: 4.8,
  },
  '15': {
    id: 15,
    name: 'iPhone 15',
    price: 799,
    category: 'Phone',
    stock: 40,
    rating: 4.7,
  },
  '16': {
    id: 16,
    name: 'iPad Pro',
    price: 1099,
    category: 'Tablet',
    stock: 15,
    rating: 4.9,
  },
  '17': {
    id: 17,
    name: 'AirPods Max',
    price: 549,
    category: 'Audio',
    stock: 20,
    rating: 4.6,
  },
  '18': {
    id: 18,
    name: 'Apple Pencil',
    price: 129,
    category: 'Accessory',
    stock: 55,
    rating: 4.8,
  },
  '19': {
    id: 19,
    name: 'MagSafe Charger',
    price: 39,
    category: 'Accessory',
    stock: 80,
    rating: 4.4,
  },
  '20': {
    id: 20,
    name: 'Thunderbolt Cable',
    price: 69,
    category: 'Accessory',
    stock: 70,
    rating: 4.5,
  },
};

type ProductId = keyof typeof products;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  // 🐌 Simulate slow API milliseconds
  await sleep(450);

  const product = products[id as ProductId];

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  console.log(`[API] 📦 Product ${id} fetched at ${new Date().toISOString()}`);

  return NextResponse.json({
    ...product,
    description: `This is a high-quality ${product.name} with excellent features and performance.`,
    features: [
      'Premium build quality',
      'Latest technology',
      'Fast performance',
      'Great customer reviews',
    ],
    fetchedAt: new Date().toISOString(),
  });
}
