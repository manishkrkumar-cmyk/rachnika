import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ChevronRight, 
  ChevronUp, 
  ChevronDown, 
  Copy, 
  Check, 
  Sparkles, 
  Home, 
  Package, 
  Palette, 
  ShieldCheck, 
  Download, 
  MessageSquare, 
  X, 
  Send, 
  HeartHandshake
} from 'lucide-react';

export default function OrdersPage({ lastOrder, onShopMore }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(true);
  const [showPriceDetails, setShowPriceDetails] = useState(true);

  // Studio & Artisan Support Chat Drawer State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Namaste! Welcome to Rachnika Artisan Care. Need help with crafting status, fragile packaging, or courier tracking?' }
  ]);
  const [userInput, setUserInput] = useState('');

  // Dynamically load orders isolated per logged-in user account
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('rachnika_user_session') || '{}');
    const userPhone = currentUser.phone || 'default';
    const storageKey = `rachnika_orders_${userPhone}`;

    const stored = localStorage.getItem(storageKey);
    let localOrders = stored ? JSON.parse(stored) : [];

    // Fallback to general order history if isolated user key is empty
    if (localOrders.length === 0) {
      const generalOrders = localStorage.getItem('rachnika_order_history');
      if (generalOrders) {
        try {
          localOrders = JSON.parse(generalOrders);
        } catch {
          localOrders = [];
        }
      }
    }

    // Append last placed order if newly received
    if (lastOrder && !localOrders.some((o) => o.orderNumber === lastOrder.orderNumber)) {
      localOrders = [lastOrder, ...localOrders];
      localStorage.setItem(storageKey, JSON.stringify(localOrders));
    }

    setOrders(localOrders);

    if (lastOrder) {
      setSelectedOrder(lastOrder);
    }
  }, [lastOrder]);

  const copyOrderId = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSendMessage = (textToSend = null) => {
    const text = textToSend || userInput;
    if (!text.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user', text }];
    setChatMessages(newMsgs);
    setUserInput('');

    setTimeout(() => {
      let botReply = 'Your handmade piece is safely padded in fragile eco-packaging and scheduled for courier pickup.';
      const lower = text.toLowerCase();
      if (lower.includes('cancel')) {
        botReply = 'Custom artisan orders can be altered or canceled within 4 hours of studio induction. We have logged your request.';
      } else if (lower.includes('invoice') || lower.includes('bill')) {
        botReply = 'The GST Artisan invoice is generated and ready to download from the Order Details panel.';
      } else if (lower.includes('artisan') || lower.includes('care') || lower.includes('clean')) {
        botReply = 'Care instructions: Dust lightly with a dry microfiber cloth. Avoid direct sun exposure and harsh chemical cleaners.';
      }
      setChatMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 700);
  };

  // Direct Browser PDF Tax Invoice Generator
  const downloadInvoice = (order) => {
    const item = order.items?.[0] || order;
    const totalAmount = Number(order.totalAmount || order.price || 0);
    const taxAmount = (totalAmount * 0.05).toFixed(2); // 5% Handicraft GST
    const baseAmount = (totalAmount - taxAmount).toFixed(2);
    const invoiceNo = 'INV-' + (order.orderNumber || 'RCK-' + Date.now()).slice(-8);

    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Tax Invoice - ${invoiceNo}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #292524; padding: 40px; margin: 0; background: #fff; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #78350f; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: 900; color: #78350f; letter-spacing: -0.5px; }
            .tagline { font-size: 11px; color: #78716c; margin-top: 2px; }
            .inv-title { font-size: 20px; font-weight: 700; text-align: right; color: #1c1917; }
            .inv-meta { font-size: 12px; color: #78716c; text-align: right; margin-top: 4px; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; font-size: 12px; }
            .details-box h4 { margin: 0 0 8px 0; text-transform: uppercase; font-size: 11px; color: #78350f; letter-spacing: 0.5px; }
            .details-box p { margin: 3px 0; color: #44403c; line-height: 1.4; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
            th { background: #f5f5f4; text-align: left; padding: 10px; border-bottom: 1px solid #d6d3d1; font-weight: 700; color: #44403c; }
            td { padding: 12px 10px; border-bottom: 1px solid #e7e5e4; }
            .text-right { text-align: right; }
            .summary { margin-top: 25px; margin-left: auto; width: 280px; font-size: 12px; }
            .summary-row { display: flex; justify-content: space-between; padding: 6px 0; color: #57534e; }
            .summary-row.total { border-top: 2px solid #78350f; font-weight: 800; font-size: 14px; color: #1c1917; padding-top: 8px; margin-top: 4px; }
            .footer { margin-top: 60px; border-top: 1px solid #e7e5e4; padding-top: 15px; font-size: 10px; color: #a8a29e; text-align: center; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">Rachnika</div>
              <div class="tagline">Artisan & Handcrafted Marketplace</div>
              <div style="font-size: 11px; color: #78716c; margin-top: 6px;">GSTIN: 29AAACR1234A1Z5</div>
            </div>
            <div>
              <div class="inv-title">TAX INVOICE</div>
              <div class="inv-meta">Invoice No: <strong>${invoiceNo}</strong></div>
              <div class="inv-meta">Order Date: ${order.orderDate || '30 Sep 2026'}</div>
              <div class="inv-meta">Payment Mode: ${order.paymentMethod || 'Razorpay UPI'}</div>
            </div>
          </div>

          <div class="details-grid">
            <div class="details-box">
              <h4>Billed & Shipped To:</h4>
              <p><strong>${order.shippingAddress?.name || 'Customer'}</strong></p>
              <p>${order.shippingAddress?.addressLine || order.shippingAddress?.line || '#42, Niladri Road, Electronic City Phase 1'}</p>
              <p>${order.shippingAddress?.city || 'Bengaluru'}, ${order.shippingAddress?.state || 'Karnataka'} - ${order.shippingAddress?.pincode || '560100'}</p>
              <p>Phone: ${order.shippingAddress?.phone || '9876543210'}</p>
            </div>
            <div class="details-box">
              <h4>Sold & Dispatched By:</h4>
              <p><strong>${item.artisan || 'Rachnika Master Crafts Guild'}</strong></p>
              <p>Studio Registration: RCK-IND-8849</p>
              <p>Handicraft Cluster Hub, Electronic City</p>
              <p>Bengaluru, Karnataka - 560100</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>HSN / SAC</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${item.title || 'Handcrafted Art Work'}</strong><br/>
                  <span style="font-size: 10px; color: #78716c;">Verified 100% Genuine Handcrafted Item</span>
                </td>
                <td>9701</td>
                <td class="text-right">${item.quantity || 1}</td>
                <td class="text-right">₹${baseAmount}</td>
                <td class="text-right">₹${baseAmount}</td>
              </tr>
            </tbody>
          </table>

          <div class="summary">
            <div class="summary-row">
              <span>Taxable Amount:</span>
              <span>₹${baseAmount}</span>
            </div>
            <div class="summary-row">
              <span>IGST / CGST+SGST (5%):</span>
              <span>₹${taxAmount}</span>
            </div>
            <div class="summary-row">
              <span>Shipping & Handling:</span>
              <span style="color: #15803d; font-weight: bold;">FREE</span>
            </div>
            <div class="summary-row total">
              <span>Grand Total:</span>
              <span>₹${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            This is a computer-generated tax invoice for handicraft goods and requires no physical signature.<br/>
            Thank you for supporting traditional Indian artisans through Rachnika.
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    invoiceWindow.document.close();
  };

  /* -------------------------------------------------------------
     VIEW 1: ARTISAN ORDER DETAILS & CRAFT TRACKING
  ------------------------------------------------------------- */
  if (selectedOrder) {
    const firstItem = selectedOrder.items?.[0] || selectedOrder;
    const orderIdStr = selectedOrder.orderNumber || 'RCK-2026-90412';
    const totalCost = Number(selectedOrder.totalAmount || selectedOrder.price || 0);

    const craftSteps = [
      { title: 'Craft Order Received', desc: 'Studio acknowledged & reserved', done: true },
      { title: 'Artisan Quality Check & Packing', desc: 'Protected with fragile eco-wrap', done: true },
      { title: 'Handed to Courier Partner', desc: 'Ekart / Delhivery Handcrafted transit', done: false },
      { title: 'Delivered to your Doorstep', desc: 'Handed over with signature', done: false }
    ];

    return (
      <div className="max-w-6xl mx-auto px-4 py-8 font-sans antialiased text-stone-800">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-xs font-bold text-amber-900 hover:text-amber-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Craft Orders</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsChatOpen(true)}
              className="bg-amber-100/70 hover:bg-amber-100 text-amber-950 border border-amber-300/80 px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-amber-800" />
              <span>Contact Artisan Studio</span>
            </button>
            <button 
              type="button"
              onClick={() => downloadInvoice(selectedOrder)}
              className="border border-stone-300 hover:bg-stone-100 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>Invoice</span>
            </button>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column: Item Information & Tracking Stepper */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="flex gap-4">
                  <img
                    src={firstItem.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80'}
                    alt={firstItem.title}
                    className="w-20 h-20 object-cover rounded-xl border border-stone-200 shadow-inner flex-shrink-0"
                  />
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full mb-1">
                      <Sparkles className="w-2.5 h-2.5" /> Authenticated Handmade
                    </span>
                    <h2 className="text-sm font-bold text-stone-900 leading-snug">
                      {firstItem.title || 'Artisan Handcrafted Piece'}
                    </h2>
                    <p className="text-xs text-stone-500 mt-1">
                      Artisan: <strong className="text-stone-700 font-semibold">{firstItem.artisan || 'Rachnika Master Craftsmen'}</strong>
                    </p>
                    <p className="text-xs font-bold text-stone-900 mt-1">
                      ₹{totalCost.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[11px] text-stone-500">Order Reference</div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-stone-800 mt-0.5">
                    <span>{orderIdStr}</span>
                    <button
                      type="button"
                      onClick={() => copyOrderId(orderIdStr)}
                      className="text-stone-400 hover:text-amber-800 transition cursor-pointer"
                      title="Copy Order ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Handcrafted Stepper Pipeline */}
              <div className="pt-6 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-6 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-amber-800" />
                  Artisan Journey & Delivery Progress
                </h3>

                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-amber-200">
                  {craftSteps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div
                        className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 ${
                          step.done
                            ? 'bg-amber-800 border-amber-800 text-white'
                            : 'bg-white border-stone-300 text-transparent'
                        }`}
                      >
                        {step.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold ${step.done ? 'text-stone-900' : 'text-stone-400'}`}>
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-stone-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fragile Packaging Guarantee */}
              <div className="mt-6 bg-stone-50 rounded-xl p-3.5 border border-stone-200/80 flex items-start gap-3 text-xs text-stone-600">
                <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-800 font-bold block">100% Damage-Free Guarantee on Fragile Crafts</strong>
                  Protected with multi-layered shock cushioning and water-resistant wrap. In the rare case of transit damage, an instant replacement or full refund is provided.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Address, Payment & Action Modules */}
          <div className="space-y-5">
            {/* Delivery Destination */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm">
              <div 
                onClick={() => setShowDeliveryDetails(!showDeliveryDetails)}
                className="flex items-center justify-between cursor-pointer"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-amber-800" />
                  Delivery Destination
                </h3>
                {showDeliveryDetails ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </div>

              {showDeliveryDetails && (
                <div className="mt-3 pt-3 border-t border-stone-100 text-xs text-stone-600 space-y-1.5 leading-relaxed">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">{selectedOrder.shippingAddress?.name || 'Customer'}</span>
                    <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                      {selectedOrder.shippingAddress?.type || 'Home'}
                    </span>
                  </div>
                  <p>{selectedOrder.shippingAddress?.addressLine || selectedOrder.shippingAddress?.line || '#42, Niladri Road, Electronic City Phase 1, Bengaluru'}</p>
                  <p className="text-stone-500 font-medium">Phone: {selectedOrder.shippingAddress?.phone || '9876543210'}</p>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm">
              <div 
                onClick={() => setShowPriceDetails(!showPriceDetails)}
                className="flex items-center justify-between cursor-pointer"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Payment Summary
                </h3>
                {showPriceDetails ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </div>

              {showPriceDetails && (
                <div className="mt-3 pt-3 border-t border-stone-100 text-xs space-y-2 text-stone-600">
                  <div className="flex justify-between">
                    <span>Artisan Craft Price</span>
                    <span>₹{totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Artisan Fair Delivery</span>
                    <span className="font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Mode</span>
                    <span className="font-semibold text-stone-800">{selectedOrder.paymentMethod || 'Razorpay Gateway'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-100">
                    <span>Total Paid</span>
                    <span>₹{totalCost.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="w-full bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-xs uppercase py-3 rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-amber-800" />
                <span>Chat with Studio Support</span>
              </button>

              <button
                type="button"
                onClick={onShopMore}
                className="w-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs uppercase py-3 rounded-xl shadow-md transition cursor-pointer"
              >
                Explore More Handcrafted Collections
              </button>
            </div>
          </div>
        </div>

        {/* Studio & Care Support Assistant Drawer */}
        {isChatOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs">
            <div className="bg-white w-full max-w-md h-[82vh] sm:h-[560px] rounded-t-2xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-stone-200">
              
              {/* Drawer Header */}
              <div className="bg-amber-900 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-800 flex items-center justify-center text-sm font-bold shadow-inner">
                    🎨
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">Rachnika Artisan Care Desk</h3>
                    <p className="text-[10px] text-amber-200">Connected to Order #{orderIdStr.slice(-8)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full cursor-pointer transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fdfbf7]">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-amber-900 text-white rounded-br-none'
                          : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Inquiries */}
              <div className="p-2.5 bg-white border-t border-stone-100 flex gap-2 overflow-x-auto scrollbar-none text-[11px]">
                <button
                  type="button"
                  onClick={() => handleSendMessage('What is the crafting status of my item?')}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full whitespace-nowrap cursor-pointer transition"
                >
                  🛠️ Crafting Status
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('How should I care for and clean this craft?')}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full whitespace-nowrap cursor-pointer transition"
                >
                  ✨ Care Instructions
                </button>
                <button
                  type="button"
                  onClick={() => handleSendMessage('I need invoice and artisan certificate')}
                  className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full whitespace-nowrap cursor-pointer transition"
                >
                  📜 Artisan Certificate
                </button>
              </div>

              {/* Message Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask a question about your craft order..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs outline-none focus:border-amber-800"
                />
                <button
                  type="submit"
                  className="bg-amber-900 hover:bg-amber-950 text-white p-2.5 rounded-xl cursor-pointer transition shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* -------------------------------------------------------------
     VIEW 2: RACHNIKA CRAFT ORDERS LIST
  ------------------------------------------------------------- */
  const craftCategories = ['All', 'Paintings & Wall Art', 'Pottery & Ceramics', 'Home Decor', 'Handloom'];

  const filteredOrders = orders.filter((ord) => {
    const title = (ord.title || ord.items?.[0]?.title || '').toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || ord.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans antialiased text-stone-800">
      {/* Page Title & Back to Store */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-black text-stone-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-900" />
            My Craft Orders
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Track your artisan acquisitions, custom commissions, and handmade delivery timelines.
          </p>
        </div>

        <button
          type="button"
          onClick={onShopMore}
          className="self-start sm:self-auto text-xs font-bold text-amber-900 hover:text-amber-700 transition cursor-pointer flex items-center gap-1.5"
        >
          <span>Discover More Handmade Items</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Artisan Promo Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-stone-900 rounded-2xl p-5 text-white mb-6 shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <span className="bg-amber-400 text-stone-900 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
            Rachnika Artisan Trust
          </span>
          <h3 className="text-base font-bold leading-tight">Every purchase empowers independent Indian artisans</h3>
          <p className="text-xs text-amber-200/90">Direct studio packaging, transparent fair wages, and 100% verified craft origin.</p>
        </div>
        <div className="text-3xl hidden sm:block select-none">
          🏺
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-3 shadow-xs mb-6 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search through purchased crafts, paintings, pottery..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50/70 border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-800 outline-none focus:border-amber-800"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          {craftCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-amber-900 text-white shadow-xs font-bold'
                  : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-16 text-center shadow-xs">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-900 flex items-center justify-center text-2xl mx-auto mb-3">
            🎨
          </div>
          <h2 className="text-base font-bold text-stone-900">No craft orders found</h2>
          <p className="text-xs text-stone-500 mt-1 mb-5">
            Your handmade purchases and artisan commissions will appear here.
          </p>
          <button
            type="button"
            onClick={onShopMore}
            className="bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold uppercase px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer"
          >
            Explore Rachnika Gallery
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredOrders.map((ord) => {
            const firstItem = ord.items?.[0] || ord;
            const isDelivered = ord.statusType === 'DELIVERED';

            return (
              <div
                key={ord.orderNumber || ord.id}
                onClick={() => setSelectedOrder(ord)}
                className="bg-white border border-stone-200/90 hover:border-amber-700/60 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition group"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={firstItem.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&auto=format&fit=crop&q=80'}
                    alt={firstItem.title}
                    className="w-16 h-16 object-cover rounded-xl border border-stone-200 shadow-inner flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 group-hover:text-amber-900 transition line-clamp-1">
                      {firstItem.title || 'Handmade Artwork'}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Order #{ord.orderNumber || 'RCK-' + ord.id} • {ord.paymentMethod || 'Razorpay'}
                    </p>
                    <span className="text-xs font-bold text-stone-900 mt-1 block">
                      ₹{Number(ord.totalAmount || ord.price || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="text-left sm:text-right">
                    <span
                      className={`text-xs font-bold block ${
                        isDelivered ? 'text-emerald-700' : 'text-amber-900'
                      }`}
                    >
                      {ord.statusText || 'In Artisan Transit'}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Placed on {ord.orderDate || '30 Sep 2026'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-amber-900">
                    <span>Inspect</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}