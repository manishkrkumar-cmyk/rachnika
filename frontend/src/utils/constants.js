export const APP_NAME = 'Rachnika';
export const API_BASE_URL = 'http://localhost:8091/api';

export const CATEGORIES = [
  { id: 1, name: 'Paintings & Wall Art', icon: '🎨' },
  { id: 2, name: 'Pottery & Ceramics', icon: '🏺' },
  { id: 3, name: 'Handmade Home Decor', icon: '✨' },
  { id: 4, name: 'Candles & Fragrances', icon: '🕯️' },
  { id: 5, name: 'Handloom & Textiles', icon: '🧵' },
  { id: 6, name: 'Artisan Jewelry', icon: '💎' },
  { id: 7, name: 'Resin & Custom Gifts', icon: '🎁' },
  { id: 8, name: 'DIY Craft Supplies', icon: '✂️' }
];

export const PAYMENT_METHODS = [
  { 
    id: 'RAZORPAY', 
    label: 'Razorpay UPI / Google Pay / PhonePe / QR Code',
    description: 'Instant secure payment via official gateway'
  },
  { 
    id: 'CARD', 
    label: 'Credit / Debit / ATM Card',
    description: 'Visa, MasterCard, RuPay & Maestro'
  },
  { 
    id: 'NET_BANKING', 
    label: 'Net Banking',
    description: 'All major Indian banks supported'
  },
  { 
    id: 'COD', 
    label: 'Cash on Delivery (COD)',
    description: 'Pay with cash upon receipt'
  }
];

export const ORDER_STATUSES = {
  CONFIRMED: 'Order Confirmed',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out For Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

export const RAZORPAY_CONFIG = {
  KEY_ID: 'rzp_test_T4E8EuAROM8wb4',
  CURRENCY: 'INR',
  STORE_NAME: 'Rachnika Art & Crafts'
};