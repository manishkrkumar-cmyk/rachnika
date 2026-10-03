/**
 * Dispatches simulated SMS and Email confirmations to the buyer
 */
export const dispatchOrderNotifications = async (order) => {
  const buyerName = order.shippingAddress?.name || 'Manish Kumar';
  const buyerPhone = order.shippingAddress?.phone || '9876543210';
  const buyerEmail = 'manish.kumar@gmail.com';
  const orderId = order.orderNumber || 'RCK-' + Date.now();
  const total = Number(order.totalAmount || 0).toFixed(2);
  const craftTitle = order.items?.[0]?.title || 'Handcrafted Artisan Craft';

  // 1. Prepare Text SMS
  const smsBody = `Namaste ${buyerName}! Your Rachnika order #${orderId} for "${craftTitle}" (₹${total}) is CONFIRMED. Your artisan is preparing fragile eco-cushioning. Delivery: Sat, 03 Oct. Track live on Rachnika.`;

  // 2. Prepare Email Notification
  const emailNotification = {
    to: buyerEmail,
    subject: `Order Confirmed: #${orderId} - Rachnika Artisan Studio`,
    preview: `We have received your order for ${craftTitle} (Total: ₹${total}). Thank you for supporting authentic traditional craftmakers!`
  };

  // Log in browser console for verification
  console.log('%c📱 [SMS DISPATCHED TO ' + buyerPhone + ']:', 'color: #10b981; font-weight: bold;', smsBody);
  console.log('%c✉️ [EMAIL SENT TO ' + buyerEmail + ']:', 'color: #3b82f6; font-weight: bold;', emailNotification);

  // Show a non-blocking toast on the screen for the buyer
  if (typeof window !== 'undefined') {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-5 right-5 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 max-w-sm transition-all duration-500 animate-in fade-in slide-in-from-bottom';
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
          ✓
        </div>
        <div class="space-y-1">
          <p class="text-xs font-bold text-emerald-400 uppercase tracking-wider">SMS & Email Sent!</p>
          <p class="text-xs text-slate-200">Confirmation delivered to <strong>+91 ${buyerPhone}</strong> & <strong>${buyerEmail}</strong>.</p>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 500);
    }, 4500);
  }
};