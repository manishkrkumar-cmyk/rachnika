import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  Building2, 
  RefreshCw, 
  Truck
} from 'lucide-react';
import { dispatchOrderNotifications } from '../utils/notifications';
import axios from 'axios';

export default function CheckoutPage({ onNavigateToStore, onCancel, onOrderSuccess }) {
  const { cartItems, getCartTotal, clearCart } = useCart();

  // Accordion active step: 1: Login | 2: Address | 3: Summary | 4: Payment
  const [activeStep, setActiveStep] = useState(4);

  // Retrieve current active user session if available
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rachnika_user_session') || '{}');
    } catch {
      return {};
    }
  });

  // Dynamic Address State based on the logged-in user
  const [address, setAddress] = useState({
    name: currentUser.name || 'Manish Kumar',
    phone: currentUser.phone || '9876543210',
    pincode: '560100',
    locality: 'Electronic City Phase 1',
    addressLine: '#42, Niladri Road, Near Wipro Gate',
    city: 'Bengaluru',
    state: 'Karnataka',
    type: 'HOME'
  });

  // Inline Address Editing State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState({ ...address });

  // Payment Selection State
  const [selectedMethod, setSelectedMethod] = useState('RAZORPAY'); // 'RAZORPAY' | 'CARD' | 'NET_BANKING' | 'COD'
  const [upiSubTab, setUpiSubTab] = useState('GATEWAY'); // 'GATEWAY' | 'QR'

  // Card Inputs (Simulated Direct Entry)
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });

  // COD Captcha Verification State
  const [captchaCode, setCaptchaCode] = useState('482');
  const [enteredCaptcha, setEnteredCaptcha] = useState('');

  // Processing Animation Screen
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  const generateCaptcha = () => {
    const code = Math.floor(100 + Math.random() * 900).toString();
    setCaptchaCode(code);
    setEnteredCaptcha('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const totalAmount = getCartTotal ? getCartTotal() : 0;
  const originalTotal = cartItems.reduce((acc, i) => acc + (i.originalPrice || i.price || 0) * (i.quantity || 1), 0);
  const discountTotal = originalTotal > totalAmount ? originalTotal - totalAmount : 0;

  // Persist order records for "My Orders" screen & trigger notifications
  const finalizeOrder = (methodUsed, paymentId = null) => {
    const generatedOrderNumber = 'RCK-' + Date.now().toString().slice(-8);

    const completeOrderObj = {
      id: Date.now(),
      orderNumber: generatedOrderNumber,
      totalAmount: totalAmount,
      status: 'CONFIRMED',
      statusType: 'ACTIVE',
      statusText: 'In Artisan Studio — Quality Check & Packing',
      paymentMethod: methodUsed,
      paymentId: paymentId || ('PAY_' + Math.random().toString(36).substring(2, 9).toUpperCase()),
      shippingAddress: address,
      orderDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      estimatedDelivery: 'Sat, 03 Oct 2026',
      items: cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        originalPrice: item.originalPrice || item.price,
        discount: item.discount || 0,
        imageUrl: item.imageUrl,
        artisan: item.artisan || 'Rachnika Master Craftsmen',
        quantity: item.quantity || 1
      }))
    };

    // 1. Isolate order history by the logged-in user's phone number
    const activeSession = JSON.parse(localStorage.getItem('rachnika_user_session') || '{}');
    const userPhone = activeSession.phone || address.phone || 'default';
    const storageKey = `rachnika_orders_${userPhone}`;

    const existingOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');
    localStorage.setItem(storageKey, JSON.stringify([completeOrderObj, ...existingOrders]));

    // Also update generic fallback history so legacy components continue functioning smoothly
    const fallbackHistory = JSON.parse(localStorage.getItem('rachnika_order_history') || '[]');
    localStorage.setItem('rachnika_order_history', JSON.stringify([completeOrderObj, ...fallbackHistory]));

    // 2. Trigger SMS and Email alert to buyer
    dispatchOrderNotifications(completeOrderObj);

    // 3. Sync to backend if order endpoint is reachable
    axios
      .post('http://localhost:8091/api/orders', {
        userId: activeSession.id || 1,
        totalAmount: totalAmount,
        paymentMethod: methodUsed,
        shippingAddress: address,
        items: completeOrderObj.items
      })
      .catch(() => {
        // Handled silently via isolated localStorage
      });

    clearCart();
    setIsProcessing(false);

    if (onOrderSuccess) {
      onOrderSuccess(completeOrderObj);
    }
  };

  // Launch official Razorpay payment modal
  const launchRazorpayModal = async () => {
    setIsProcessing(true);
    setProcessingStatus('Creating secure Razorpay order...');

    let rzpKey = 'rzp_test_T4E8EuAROM8wb4';
    let rzpOrderId = null;

    try {
      const res = await axios.post('http://localhost:8091/api/payment/create-order', {
        amount: totalAmount
      });
      if (res.data?.orderId) {
        rzpOrderId = res.data.orderId;
        rzpKey = res.data.keyId || rzpKey;
      }
    } catch (err) {
      console.warn('Backend payment create-order failed, using direct key initialization:', err);
    }

    if (typeof window.Razorpay === 'undefined') {
      alert('Razorpay Checkout SDK is still loading or blocked. Please verify your internet connection or reload.');
      setIsProcessing(false);
      return;
    }

    const options = {
      key: rzpKey,
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      name: 'Rachnika Handcrafted Store',
      description: `Order Checkout - ₹${totalAmount.toFixed(2)}`,
      image: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
      ...(rzpOrderId && { order_id: rzpOrderId }),
      prefill: {
        name: address.name,
        contact: address.phone,
        email: currentUser.email || `${address.phone}@rachnika.in`
      },
      theme: {
        color: '#8B3A2B'
      },
      handler: async function (response) {
        setIsProcessing(true);
        setProcessingStatus('Verifying payment signature with bank...');

        try {
          await axios.post('http://localhost:8091/api/payment/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
        } catch (verifyErr) {
          console.warn('Backend signature check skipped or failed; persisting order:', verifyErr);
        }

        setTimeout(() => {
          finalizeOrder('Razorpay UPI', response.razorpay_payment_id);
        }, 600);
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      }
    };

    setIsProcessing(false);
    const rzpInstance = new window.Razorpay(options);
    rzpInstance.open();
  };

  const handleFinalPayment = async () => {
    if (selectedMethod === 'COD') {
      if (enteredCaptcha.trim() !== captchaCode.trim()) {
        alert('Please enter the exact characters displayed in the security captcha.');
        return;
      }
      setIsProcessing(true);
      setProcessingStatus('Verifying Cash on Delivery request...');
      setTimeout(() => {
        finalizeOrder('Cash on Delivery');
      }, 1000);
      return;
    }

    if (selectedMethod === 'RAZORPAY') {
      launchRazorpayModal();
      return;
    }

    // Direct Simulated Card or NetBanking
    setIsProcessing(true);
    setProcessingStatus(`Connecting with ${selectedMethod === 'CARD' ? 'Card Network' : 'Bank Gateway'}...`);
    setTimeout(() => {
      finalizeOrder(selectedMethod === 'CARD' ? 'Debit/Credit Card' : 'Net Banking');
    }, 1500);
  };

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-stone-200">
          <div className="w-14 h-14 border-4 border-amber-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-base font-bold text-stone-800">Processing Your Payment</h3>
          <p className="text-xs text-stone-500 mt-2">{processingStatus}</p>
          <div className="mt-6 text-[11px] text-amber-900 bg-amber-50 border border-amber-200 p-2.5 rounded-xl font-medium">
            ⚠️ Please do not refresh, close, or press back while the transaction is underway.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans antialiased text-stone-800">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Accordion Steps */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Step 1: User Account Header */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3.5">
              <span className="w-7 h-7 rounded-xl bg-stone-100 text-stone-600 text-xs font-bold flex items-center justify-center">
                1
              </span>
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">LOGIN ACCOUNT</span>
                <span className="text-sm font-bold text-stone-900">
                  {currentUser.name || address.name} <span className="font-normal text-stone-500 ml-1">+91 {currentUser.phone || address.phone}</span>
                </span>
              </div>
            </div>
            <button 
              type="button" 
              onClick={onCancel}
              className="text-xs font-bold text-amber-900 border border-stone-200 px-4 py-1.5 rounded-xl uppercase hover:bg-stone-50 transition cursor-pointer"
            >
              CHANGE
            </button>
          </div>

          {/* Step 2: Delivery Destination (Editable) */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div 
              onClick={() => {
                setActiveStep(activeStep === 2 ? 0 : 2);
                setIsEditingAddress(false);
              }}
              className="p-4 sm:p-5 bg-white flex items-center justify-between cursor-pointer border-b border-stone-100"
            >
              <div className="flex items-center gap-3.5">
                <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center transition ${
                  activeStep === 2 ? 'bg-amber-900 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  2
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900">DELIVERY DESTINATION</span>
              </div>
              {activeStep !== 2 && (
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStep(2);
                    setIsEditingAddress(true);
                    setTempAddress({ ...address });
                  }}
                  className="text-xs font-bold text-amber-900 uppercase hover:underline cursor-pointer"
                >
                  CHANGE / EDIT
                </button>
              )}
            </div>

            {activeStep === 2 ? (
              <div className="p-4 sm:p-5 bg-stone-50/60">
                {isEditingAddress ? (
                  /* Edit Address Form */
                  <div className="bg-white border border-amber-900/60 p-4 sm:p-5 rounded-2xl shadow-xs space-y-3.5">
                    <h4 className="text-xs font-bold uppercase text-stone-900 tracking-wider">Edit Artisan Delivery Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={tempAddress.name}
                          onChange={(e) => setTempAddress({ ...tempAddress, name: e.target.value })}
                          className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:border-amber-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">10-Digit Mobile Number</label>
                        <input
                          type="text"
                          value={tempAddress.phone}
                          onChange={(e) => setTempAddress({ ...tempAddress, phone: e.target.value })}
                          className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:border-amber-900 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">Flat, House no., Building, Street</label>
                        <input
                          type="text"
                          value={tempAddress.addressLine}
                          onChange={(e) => setTempAddress({ ...tempAddress, addressLine: e.target.value })}
                          className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:border-amber-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">Locality / Landmark</label>
                        <input
                          type="text"
                          value={tempAddress.locality}
                          onChange={(e) => setTempAddress({ ...tempAddress, locality: e.target.value })}
                          className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:border-amber-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">City / District</label>
                        <input
                          type="text"
                          value={tempAddress.city}
                          onChange={(e) => setTempAddress({ ...tempAddress, city: e.target.value })}
                          className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:border-amber-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">State</label>
                        <input
                          type="text"
                          value={tempAddress.state}
                          onChange={(e) => setTempAddress({ ...tempAddress, state: e.target.value })}
                          className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:border-amber-900 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-600 mb-1">Pincode</label>
                        <input
                          type="text"
                          value={tempAddress.pincode}
                          onChange={(e) => setTempAddress({ ...tempAddress, pincode: e.target.value })}
                          className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:border-amber-900 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAddress({ ...tempAddress });
                          setIsEditingAddress(false);
                        }}
                        className="bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold uppercase px-6 py-2.5 rounded-xl shadow-xs cursor-pointer transition"
                      >
                        SAVE AND DELIVER HERE
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingAddress(false)}
                        className="text-xs text-stone-500 hover:text-stone-700 font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Saved Address Card View */
                  <div className="border border-amber-900/30 bg-amber-50/40 p-4 rounded-xl mb-2 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <input type="radio" defaultChecked className="mt-1 accent-amber-900" />
                      <div className="text-xs space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900">{address.name}</span>
                          <span className="bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                            {address.type}
                          </span>
                          <span className="font-semibold text-stone-700">{address.phone}</span>
                        </div>
                        <p className="text-stone-600 leading-relaxed">
                          {address.addressLine}, {address.locality}, {address.city}, {address.state} - <span className="font-bold text-stone-900">{address.pincode}</span>
                        </p>
                        <div className="pt-2 flex items-center gap-3">
                          <button 
                            type="button"
                            onClick={() => setActiveStep(3)}
                            className="bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs uppercase px-6 py-2.5 rounded-xl shadow-xs cursor-pointer transition"
                          >
                            DELIVER HERE
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTempAddress({ ...address });
                              setIsEditingAddress(true);
                            }}
                            className="text-xs font-bold text-amber-900 uppercase hover:underline cursor-pointer"
                          >
                            EDIT
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-14 py-3 text-xs text-stone-600">
                <span className="font-bold text-stone-900">{address.name}</span> {address.addressLine}, {address.city} - {address.pincode}
              </div>
            )}
          </div>

          {/* Step 3: Order Summary */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div 
              onClick={() => setActiveStep(activeStep === 3 ? 0 : 3)}
              className="p-4 sm:p-5 bg-white flex items-center justify-between cursor-pointer border-b border-stone-100"
            >
              <div className="flex items-center gap-3.5">
                <span className={`w-7 h-7 rounded-xl text-xs font-bold flex items-center justify-center transition ${
                  activeStep === 3 ? 'bg-amber-900 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  3
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  ORDER SUMMARY ({cartItems.length} {cartItems.length === 1 ? 'CRAFT' : 'CRAFTS'})
                </span>
              </div>
              {activeStep !== 3 && (
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveStep(3);
                  }}
                  className="text-xs font-bold text-amber-900 uppercase"
                >
                  CHANGE
                </button>
              )}
            </div>

            {activeStep === 3 && (
              <div className="p-4 sm:p-5 divide-y divide-stone-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3.5 flex gap-4">
                    <img 
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500'} 
                      alt={item.title} 
                      className="w-16 h-16 object-cover rounded-xl border border-stone-200 flex-shrink-0" 
                    />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">Artisan: {item.artisan || 'Master Crafts Guild'} • Qty: {item.quantity || 1}</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm font-black text-stone-900">₹{(item.price * (item.quantity || 1)).toFixed(2)}</span>
                        {item.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">₹{(item.originalPrice * (item.quantity || 1)).toFixed(2)}</span>
                        )}
                        <span className="text-xs font-bold text-emerald-700">{item.discount || 0}% Off</span>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-stone-500 hidden sm:flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Fragile Delivery | <strong className="text-emerald-700">FREE</strong></span>
                    </div>
                  </div>
                ))}

                <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="text-xs text-stone-500">Instant SMS confirmation dispatched to buyer upon completion.</span>
                  <button
                    type="button"
                    onClick={() => setActiveStep(4)}
                    className="w-full sm:w-auto bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs uppercase px-8 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
                  >
                    CONTINUE TO PAYMENT
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Payment Options */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 bg-amber-900 text-white flex items-center gap-3.5">
              <span className="w-7 h-7 rounded-xl bg-white text-amber-900 text-xs font-bold flex items-center justify-center">
                4
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">PAYMENT OPTIONS</span>
            </div>

            <div className="divide-y divide-stone-200">
              
              {/* Option A: Razorpay Gateway & Direct Scanner */}
              <div className={`p-4 sm:p-5 transition ${selectedMethod === 'RAZORPAY' ? 'bg-amber-50/20' : 'bg-white'}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payOption"
                    value="RAZORPAY"
                    checked={selectedMethod === 'RAZORPAY'}
                    onChange={() => setSelectedMethod('RAZORPAY')}
                    className="accent-amber-900 w-4 h-4 cursor-pointer"
                  />
                  <Smartphone className="w-4 h-4 text-amber-900" />
                  <div className="flex-1">
                    <span className="text-xs font-bold text-stone-900">
                      Razorpay UPI / Google Pay / PhonePe / Direct QR
                    </span>
                    <span className="block text-[11px] text-emerald-700 font-semibold">
                      ⚡ Instant payment confirmation, automated SMS and email dispatch
                    </span>
                  </div>
                </label>

                {selectedMethod === 'RAZORPAY' && (
                  <div className="ml-7 mt-3.5 p-4 bg-white border border-stone-200 rounded-xl">
                    <div className="flex gap-4 border-b border-stone-200 pb-2 mb-4 text-xs font-bold">
                      <button 
                        type="button"
                        onClick={() => setUpiSubTab('GATEWAY')} 
                        className={`pb-1 cursor-pointer transition ${upiSubTab === 'GATEWAY' ? 'text-amber-900 border-b-2 border-amber-900' : 'text-stone-400'}`}
                      >
                        Official Razorpay Gateway
                      </button>
                      <button 
                        type="button"
                        onClick={() => setUpiSubTab('QR')} 
                        className={`pb-1 flex items-center gap-1.5 cursor-pointer transition ${upiSubTab === 'QR' ? 'text-amber-900 border-b-2 border-amber-900' : 'text-stone-400'}`}
                      >
                        <QrCode className="w-3.5 h-3.5" /> Direct Scanner QR
                      </button>
                    </div>

                    {upiSubTab === 'GATEWAY' ? (
                      <div className="space-y-3">
                        <p className="text-xs text-stone-600">
                          Click below to launch the authentic Razorpay checkout interface supporting PhonePe, GPay, Paytm, and cards.
                        </p>
                        <button
                          type="button"
                          onClick={handleFinalPayment}
                          className="bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs uppercase px-8 py-3 rounded-xl shadow-xs transition cursor-pointer flex items-center gap-2"
                        >
                          <span>Proceed to Pay ₹{totalAmount.toFixed(2)} with Razorpay</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center gap-5">
                        <div className="p-2 border-2 border-dashed border-stone-300 rounded-xl bg-white">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=rachnika.pay@okaxis&pn=Rachnika%20Store&am=${totalAmount}&cu=INR`} 
                            alt="UPI QR" 
                            className="w-32 h-32"
                          />
                        </div>
                        <div className="text-xs text-stone-600 space-y-1 text-center sm:text-left">
                          <p className="font-bold text-stone-900">Scan & Pay ₹{totalAmount.toFixed(2)} with Any UPI App</p>
                          <p className="text-[11px] text-stone-500">Scan using PhonePe, GPay, Paytm, or CRED.</p>
                          <button
                            type="button"
                            onClick={() => finalizeOrder('UPI QR Code')}
                            className="mt-3 bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs uppercase px-6 py-2 rounded-xl shadow-xs cursor-pointer transition"
                          >
                            I Have Completed Payment
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Option B: Credit / Debit / ATM Card */}
              <div className={`p-4 sm:p-5 transition ${selectedMethod === 'CARD' ? 'bg-stone-50' : 'bg-white'}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payOption"
                    value="CARD"
                    checked={selectedMethod === 'CARD'}
                    onChange={() => setSelectedMethod('CARD')}
                    className="accent-amber-900 w-4 h-4 cursor-pointer"
                  />
                  <CreditCard className="w-4 h-4 text-amber-900" />
                  <span className="text-xs font-bold text-stone-900">Credit / Debit / ATM Card</span>
                </label>

                {selectedMethod === 'CARD' && (
                  <div className="ml-7 mt-3.5 p-4 bg-white border border-stone-200 rounded-xl max-w-md space-y-3">
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="Card Number (e.g. 4532 0123 4567 8910)"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full border border-stone-300 rounded-xl p-2.5 text-xs outline-none focus:border-amber-900"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM / YY"
                        maxLength={5}
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full border border-stone-300 rounded-xl p-2.5 text-xs outline-none focus:border-amber-900"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        maxLength={3}
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full border border-stone-300 rounded-xl p-2.5 text-xs outline-none focus:border-amber-900"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleFinalPayment}
                      className="w-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs uppercase py-2.5 rounded-xl shadow-xs cursor-pointer transition"
                    >
                      PAY ₹{totalAmount.toFixed(2)}
                    </button>
                  </div>
                )}
              </div>

              {/* Option C: Net Banking */}
              <div className={`p-4 sm:p-5 transition ${selectedMethod === 'NET_BANKING' ? 'bg-stone-50' : 'bg-white'}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payOption"
                    value="NET_BANKING"
                    checked={selectedMethod === 'NET_BANKING'}
                    onChange={() => setSelectedMethod('NET_BANKING')}
                    className="accent-amber-900 w-4 h-4 cursor-pointer"
                  />
                  <Building2 className="w-4 h-4 text-amber-900" />
                  <span className="text-xs font-bold text-stone-900">Net Banking</span>
                </label>

                {selectedMethod === 'NET_BANKING' && (
                  <div className="ml-7 mt-3.5 p-4 bg-white border border-stone-200 rounded-xl max-w-md space-y-3">
                    <select className="w-full border border-stone-300 rounded-xl p-2.5 text-xs outline-none focus:border-amber-900 bg-white">
                      <option>HDFC Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleFinalPayment}
                      className="w-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs uppercase py-2.5 rounded-xl shadow-xs cursor-pointer transition"
                    >
                      PAY ₹{totalAmount.toFixed(2)}
                    </button>
                  </div>
                )}
              </div>

              {/* Option D: Cash on Delivery with Captcha */}
              <div className={`p-4 sm:p-5 transition ${selectedMethod === 'COD' ? 'bg-stone-50' : 'bg-white'}`}>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payOption"
                    value="COD"
                    checked={selectedMethod === 'COD'}
                    onChange={() => setSelectedMethod('COD')}
                    className="accent-amber-900 w-4 h-4 cursor-pointer"
                  />
                  <Banknote className="w-4 h-4 text-amber-900" />
                  <span className="text-xs font-bold text-stone-900">Cash on Delivery</span>
                </label>

                {selectedMethod === 'COD' && (
                  <div className="ml-7 mt-3.5 p-4 bg-white border border-stone-200 rounded-xl max-w-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-stone-900 text-amber-400 font-mono font-black text-lg tracking-widest px-4 py-1.5 rounded-xl select-none shadow-inner border border-stone-700">
                        {captchaCode}
                      </div>
                      <button 
                        type="button" 
                        onClick={generateCaptcha} 
                        className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Enter security code shown above"
                      value={enteredCaptcha}
                      onChange={(e) => setEnteredCaptcha(e.target.value)}
                      className="w-full border border-stone-300 rounded-xl p-2.5 text-xs outline-none focus:border-amber-900"
                    />

                    <button
                      type="button"
                      onClick={handleFinalPayment}
                      disabled={enteredCaptcha.trim() !== captchaCode.trim()}
                      className="w-full bg-amber-900 hover:bg-amber-950 text-white font-bold text-xs uppercase py-2.5 rounded-xl shadow-xs disabled:opacity-40 cursor-pointer transition"
                    >
                      CONFIRM ARTISAN ORDER
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Price Breakdown Details */}
        <div className="space-y-4">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-xs sticky top-24">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider pb-3 border-b border-stone-100">
              PRICE BREAKDOWN
            </h3>

            <div className="space-y-3 py-3 text-xs border-b border-stone-100">
              <div className="flex justify-between text-stone-700">
                <span>Total Items ({cartItems.length})</span>
                <span>₹{originalTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Artisan Special Discount</span>
                <span>− ₹{discountTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-700">
                <span>Fragile Craft Packing & Delivery</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
            </div>

            <div className="flex justify-between text-sm font-bold text-stone-900 py-3 border-b border-stone-100">
              <span>Total Payable</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>

            {discountTotal > 0 && (
              <p className="text-xs font-bold text-emerald-700 pt-2">
                Your Total Artisan Savings: ₹{discountTotal.toFixed(2)}
              </p>
            )}

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-stone-400 flex-shrink-0" />
              <span>Safe and Encrypted Checkout. Direct Artisan Support. 100% Authentic crafts.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}