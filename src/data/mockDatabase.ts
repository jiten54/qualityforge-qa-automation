import { UserAccount, ProductItem, CartItem, OrderRecord } from '../types/qa';

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    sku: "PRD-AUD-001",
    name: "Aura ANC Studio Wireless Headphones",
    category: "Audio",
    price: 199.99,
    stock: 24,
    rating: 4.8,
    reviewsCount: 142,
    description: "Flagship active noise cancellation with 40mm titanium drivers and 45-hour playback.",
    imageUrl: "/src/assets/images/aut_product_headphones_1792107931785.jpg",
    badge: "Best Seller"
  },
  {
    id: 2,
    sku: "PRD-INP-002",
    name: "Vanguard Tenkeyless Mechanical Keyboard",
    category: "Peripherals",
    price: 129.50,
    stock: 18,
    rating: 4.9,
    reviewsCount: 88,
    description: "Custom hot-swappable tactile switches with dye-sub PBT keycaps and acoustic gasket mount.",
    imageUrl: "/src/assets/images/aut_product_keyboard_1792107932685.jpg",
    badge: "Top Rated"
  },
  {
    id: 3,
    sku: "PRD-INP-003",
    name: "Precision Ergonomic Wireless Mouse",
    category: "Peripherals",
    price: 79.99,
    stock: 35,
    rating: 4.7,
    reviewsCount: 64,
    description: "Dual thumb scroll wheel, 4000 DPI Darkfield sensor, and hyper-fast inertial scrolling.",
    imageUrl: "/src/assets/images/aut_product_mouse_1792107932503.jpg"
  },
  {
    id: 4,
    sku: "PRD-WBL-004",
    name: "Chronos Titanium GPS Smartwatch",
    category: "Wearables",
    price: 249.00,
    stock: 12,
    rating: 4.6,
    reviewsCount: 51,
    description: "Aerospace-grade titanium chassis, dual-band GNSS, sapphire crystal, and 100m water resistance.",
    imageUrl: "/src/assets/images/aut_product_watch_1792107932341.jpg",
    badge: "New Release"
  }
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 101,
    email: "sarah.qa@strivelogic.com",
    passwordHash: "pbkdf2$test$e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    fullName: "Sarah Jenkins",
    role: "qa_tester",
    createdAt: "2026-09-01T08:00:00Z",
    phone: "555-0199",
    address: "742 Evergreen Terrace",
    city: "Springfield",
    zipCode: "97477"
  },
  {
    id: 102,
    email: "john.customer@example.com",
    passwordHash: "pbkdf2$test$5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    fullName: "John Doe",
    role: "customer",
    createdAt: "2026-09-15T14:22:10Z",
    phone: "555-0144",
    address: "100 Market St Suite 400",
    city: "San Francisco",
    zipCode: "94105"
  },
  {
    id: 103,
    email: "alex.admin@strivelogic.com",
    passwordHash: "pbkdf2$test$4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    fullName: "Alex Rivera",
    role: "admin",
    createdAt: "2026-08-10T11:00:00Z"
  }
];

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: "ORD-9021",
    userId: 101,
    orderNumber: "QFG-2026-9021",
    subtotal: 199.99,
    tax: 16.00,
    shipping: 0.00,
    total: 215.99,
    shippingAddress: {
      fullName: "Sarah Jenkins",
      street: "742 Evergreen Terrace",
      city: "Springfield",
      state: "OR",
      zipCode: "97477",
      country: "USA"
    },
    paymentMethod: "Credit Card (ending 4242)",
    status: "Delivered",
    createdAt: "2026-10-02T10:14:20Z",
    items: [
      {
        productId: 1,
        productName: "Aura ANC Studio Wireless Headphones",
        quantity: 1,
        unitPrice: 199.99,
        lineTotal: 199.99
      }
    ]
  },
  {
    id: "ORD-9022",
    userId: 102,
    orderNumber: "QFG-2026-9022",
    subtotal: 209.49,
    tax: 16.76,
    shipping: 12.00,
    total: 238.25,
    shippingAddress: {
      fullName: "John Doe",
      street: "100 Market St Suite 400",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "USA"
    },
    paymentMethod: "Credit Card (ending 1111)",
    status: "Processing",
    createdAt: "2026-10-10T16:45:00Z",
    items: [
      {
        productId: 2,
        productName: "Vanguard Tenkeyless Mechanical Keyboard",
        quantity: 1,
        unitPrice: 129.50,
        lineTotal: 129.50
      },
      {
        productId: 3,
        productName: "Precision Ergonomic Wireless Mouse",
        quantity: 1,
        unitPrice: 79.99,
        lineTotal: 79.99
      }
    ]
  }
];

export const INITIAL_CART: CartItem[] = [
  {
    id: 1,
    userId: 101,
    productId: 3,
    product: INITIAL_PRODUCTS[2],
    quantity: 1
  }
];

// Active deliberate defect flags for controlled QA reproduction
export interface DefectToggles {
  bugCartTotalGlitch: boolean;      // Bug #1 (DEF-001): Cart total does not recompute when quantity changes
  bugZipValidationBypass: boolean;  // Bug #2 (DEF-002): Checkout accepts invalid alphanumeric/short postal codes
  bugDuplicateOrderSubmit: boolean; // Bug #3 (DEF-003): Rapid submit creates duplicate order records
}

export const DEFAULT_DEFECT_TOGGLES: DefectToggles = {
  bugCartTotalGlitch: true,
  bugZipValidationBypass: true,
  bugDuplicateOrderSubmit: true
};
