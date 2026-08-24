import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cart.store';
import { userApi, ordersApi, cartApi } from '../services/api';
import { Address } from '../types';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage: React.FC = () => {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  
  // State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [deliveryMethod, setDeliveryMethod] = useState<'STANDARD' | 'EXPRESS'>('STANDARD');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [loading, setLoading] = useState(false);
  const [fetchingAddresses, setFetchingAddresses] = useState(true);

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // New address form state
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ firstName: '', lastName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });

  useEffect(() => {
    // Check if cart is empty on mount only
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }
    fetchAddresses();

    // Load Razorpay script once
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.id = 'razorpay-script';
    if (!document.getElementById('razorpay-script')) {
      document.body.appendChild(script);
    }
  }, []); // Run only once on mount

  const fetchAddresses = async () => {
    try {
      const { data } = await userApi.getAddresses();
      setAddresses(data.data);
      if (data.data.length > 0) {
        const defaultAddr = data.data.find((a: Address) => a.isDefault) || data.data[0];
        setSelectedAddressId(defaultAddr.id);
      } else {
        setShowNewAddress(true);
      }
    } catch {
      toast.error('Failed to load addresses');
    } finally {
      setFetchingAddresses(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await userApi.addAddress({ ...newAddr, isDefault: addresses.length === 0 });
      setAddresses([...addresses, data.data]);
      setSelectedAddressId(data.data.id);
      setShowNewAddress(false);
      setNewAddr({ firstName: '', lastName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' });
      toast.success('Address saved');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    if (!selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order in our DB
      const deliveryNotes = deliveryMethod === 'EXPRESS' ? 'Requested Express Delivery' : 'Standard Delivery';
      
      const sessionId = localStorage.getItem('bjs_session_id') || undefined;
      const { data: orderRes } = await ordersApi.create({
        shippingAddressId: selectedAddressId,
        paymentMethod,
        notes: deliveryNotes,
        sessionId,
      });

      const order = orderRes.data;

      if (paymentMethod === 'COD') {
        toast.success('Order placed successfully!');
        clearCart();
        navigate(`/account/orders/${order.id}`, { state: { autoDownloadInvoice: true } });
        return;
      }

      // 2. Razorpay flow
      const { data: rpRes } = await ordersApi.createRazorpay({ orderId: order.id });
      const rpOrder = rpRes.data;

      const options = {
        key: rpOrder.key,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        name: "BJ'S Natural Care",
        description: `Order ${order.orderNumber}`,
        order_id: rpOrder.razorpayOrderId,
        handler: async (response: any) => {
          try {
            await ordersApi.verifyPayment({
              orderId: order.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment successful!');
            clearCart();
            navigate(`/account/orders/${order.id}`, { state: { autoDownloadInvoice: true } });
          } catch (err) {
            toast.error('Payment verification failed');
            navigate(`/account/orders/${order.id}`);
          }
        },
        prefill: {
          name: addresses.find((a) => a.id === selectedAddressId)?.firstName,
          contact: addresses.find((a) => a.id === selectedAddressId)?.phone,
        },
        theme: { color: '#C9A227' },
        modal: {
          // Called when user closes the modal without completing payment
          ondismiss: async () => {
            setLoading(false);
            // Silently cancel the pending order to restore stock
            try {
              await ordersApi.cancelOrder(order.id);
            } catch {
              // Best-effort — don't block the user
            }
            toast('Payment cancelled. Your cart items are available again.', { icon: 'ℹ️' });
          },
        },
      };

      if (!(window as any).Razorpay) {
        toast.error('Payment gateway failed to load. Please check your connection.');
        setLoading(false);
        return;
      }
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', async (response: any) => {
        const reason = response?.error?.description || response?.error?.reason || 'Payment failed';
        const errorCode = response?.error?.code || '';
        const isUserCancelled =
          reason.toLowerCase().includes('cancel') ||
          reason.toLowerCase().includes('dismissed') ||
          errorCode === 'CANCELLED';

        // Always cancel the pending order to restore stock
        try {
          await ordersApi.cancelOrder(order.id);
        } catch {
          // Best-effort — don't block UX
        }

        setLoading(false);

        if (isUserCancelled) {
          toast('Payment cancelled. Your cart items are available again.', { icon: 'ℹ️' });
        } else {
          // Show the real reason (e.g. "International cards are not supported")
          toast.error(`Payment failed: ${reason}`);
        }
      });
      rzp.open();
      // Don't setLoading(false) here — the modal is open and in control
      return;
    } catch (err: any) {
      console.error('Checkout error:', err);
      const msg = err.response?.data?.message || err.message || 'An unexpected error occurred';
      toast.error(msg);
      if (msg.toLowerCase().includes('cart is empty')) {
        clearCart();
        navigate('/cart');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  if (!cart) return null;

  const steps = [
    { id: 1, name: 'Address' },
    { id: 2, name: 'Delivery' },
    { id: 3, name: 'Payment' },
    { id: 4, name: 'Review' },
  ];

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setApplyingCoupon(true);
    try {
      await cartApi.applyCoupon(couponCodeInput.trim());
      await useCartStore.getState().fetchCart();
      toast.success('Coupon applied!');
      setCouponCodeInput('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid or expired coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setApplyingCoupon(true);
    try {
      await cartApi.removeCoupon();
      await useCartStore.getState().fetchCart();
      toast.success('Coupon removed');
    } catch (err) {
      toast.error('Failed to remove coupon');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const deliveryCharge = deliveryMethod === 'EXPRESS' ? 150 : cart.shipping;
  const finalTotal = cart.total - cart.shipping + deliveryCharge;

  return (
    <>
      <Helmet><title>Secure Checkout – BJ'S Natural Care</title></Helmet>
      <div style={{ paddingTop: 'calc(var(--nav-height) + 40px)', paddingBottom: '80px', background: 'var(--color-black)', minHeight: '100vh' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          
          <div className="checkout-header">
            <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Checkout</h1>
            
            {/* Progress Indicator */}
            <div className="progress-container">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
                    <div className="progress-step__circle">
                      {currentStep > step.id ? '✓' : step.id}
                    </div>
                    <span className="progress-step__label">{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`progress-line ${currentStep > step.id ? 'active' : ''}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="wizard-container">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="wizard-step"
                >
                  <h2 className="step-title">Select Shipping Address</h2>
                  {fetchingAddresses ? (
                    <div className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-md)' }} />
                  ) : (
                    <>
                      {addresses.length > 0 && !showNewAddress && (
                        <div className="address-grid">
                          {addresses.map((addr) => (
                            <div
                              key={addr.id}
                              className={`address-card ${selectedAddressId === addr.id ? 'active' : ''}`}
                              onClick={() => setSelectedAddressId(addr.id)}
                            >
                              <div className="address-card__header">
                                <span className="address-card__name">{addr.firstName} {addr.lastName}</span>
                                {addr.isDefault && <span className="address-card__badge">Default</span>}
                              </div>
                              <p className="address-card__text">{addr.line1}</p>
                              {addr.line2 && <p className="address-card__text">{addr.line2}</p>}
                              <p className="address-card__text">{addr.city}, {addr.state} {addr.pincode}</p>
                              <p className="address-card__text" style={{ marginTop: '8px', color: 'var(--color-gold)' }}>Phone: {addr.phone}</p>
                              <div className="address-card__select">
                                <div className={`radio-circle ${selectedAddressId === addr.id ? 'active' : ''}`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {!showNewAddress && (
                        <button className="btn btn-outline-gold" style={{ marginTop: '24px' }} onClick={() => setShowNewAddress(true)}>
                          + Add New Address
                        </button>
                      )}

                      {showNewAddress && (
                        <div className="new-address-form">
                          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-ivory)', marginBottom: '20px', fontFamily: 'var(--font-serif)' }}>Enter Address Details</h3>
                          <form onSubmit={handleSaveAddress}>
                            <div className="address-form-grid-2">
                              <div>
                                <label className="form-label">First Name *</label>
                                <input required name="firstName" className="form-input" value={newAddr.firstName} onChange={(e) => setNewAddr({ ...newAddr, firstName: e.target.value })} placeholder="John" />
                              </div>
                              <div>
                                <label className="form-label">Last Name *</label>
                                <input required name="lastName" className="form-input" value={newAddr.lastName} onChange={(e) => setNewAddr({ ...newAddr, lastName: e.target.value })} placeholder="Doe" />
                              </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                              <label className="form-label">Phone Number *</label>
                              <input required type="tel" name="phone" className="form-input" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} placeholder="+91 9876543210" />
                            </div>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                              <label className="form-label">Address Line 1 *</label>
                              <input required name="line1" className="form-input" value={newAddr.line1} onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })} placeholder="House/Flat No., Building Name, Street" />
                            </div>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                              <label className="form-label">Address Line 2 (Optional)</label>
                              <input name="line2" className="form-input" value={newAddr.line2} onChange={(e) => setNewAddr({ ...newAddr, line2: e.target.value })} placeholder="Landmark, Area" />
                            </div>
                            <div className="address-form-grid-3">
                              <div>
                                <label className="form-label">City *</label>
                                <input required name="city" className="form-input" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
                              </div>
                              <div>
                                <label className="form-label">State *</label>
                                <input required name="state" className="form-input" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} />
                              </div>
                              <div>
                                <label className="form-label">Pincode *</label>
                                <input required name="pincode" className="form-input" value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} />
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                              {addresses.length > 0 && (
                                <button type="button" className="btn btn-outline" onClick={() => setShowNewAddress(false)}>Cancel</button>
                              )}
                              <button type="submit" className="btn btn-primary">Save & Continue</button>
                            </div>
                          </form>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="wizard-step"
                >
                  <h2 className="step-title">Choose Delivery Method</h2>
                  <div className="delivery-methods">
                    <label className={`option-card ${deliveryMethod === 'STANDARD' ? 'active' : ''}`}>
                      <div className="option-card__left">
                        <input type="radio" name="delivery" checked={deliveryMethod === 'STANDARD'} onChange={() => setDeliveryMethod('STANDARD')} />
                        <div>
                          <span className="option-card__title">Standard Delivery</span>
                          <p className="option-card__desc">Delivery within 5-7 business days.</p>
                        </div>
                      </div>
                      <div className="option-card__price">
                         {cart.shipping === 0 ? 'FREE' : formatPrice(cart.shipping)}
                      </div>
                    </label>

                    <label className={`option-card ${deliveryMethod === 'EXPRESS' ? 'active' : ''}`}>
                      <div className="option-card__left">
                        <input type="radio" name="delivery" checked={deliveryMethod === 'EXPRESS'} onChange={() => setDeliveryMethod('EXPRESS')} />
                        <div>
                          <span className="option-card__title">Express Delivery</span>
                          <p className="option-card__desc">Priority delivery within 2-3 business days.</p>
                        </div>
                      </div>
                      <div className="option-card__price">
                         ₹150
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="wizard-step"
                >
                  <h2 className="step-title">Select Payment Method</h2>
                  <div className="payment-methods">
                    <label className={`option-card ${paymentMethod === 'RAZORPAY' ? 'active' : ''}`}>
                      <div className="option-card__left">
                        <input type="radio" name="payment" checked={paymentMethod === 'RAZORPAY'} onChange={() => setPaymentMethod('RAZORPAY')} />
                        <div>
                          <span className="option-card__title">Pay Online (Cards, UPI, NetBanking)</span>
                          <p className="option-card__desc">Secure payment via Razorpay gateway.</p>
                        </div>
                      </div>
                    </label>
                    <label className={`option-card ${paymentMethod === 'COD' ? 'active' : ''}`}>
                      <div className="option-card__left">
                        <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                        <div>
                          <span className="option-card__title">Cash on Delivery (COD)</span>
                          <p className="option-card__desc">Pay with cash when your order is delivered.</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="wizard-step"
                >
                  <h2 className="step-title">Order Review</h2>
                  
                  <div className="review-grid">
                    <div className="review-main">
                      <div className="review-section">
                        <h3>Items in your order</h3>
                        <div className="checkout-items">
                          {cart.items.map((item) => (
                            <div key={item.id} className="checkout-item">
                              <img src={item.variant?.image || item.product.images?.[0]?.url} alt={item.product.name} />
                              <div className="checkout-item__info">
                                <p className="checkout-item__name">{item.product.name}</p>
                                <p className="checkout-item__meta">Qty: {item.quantity} {item.variant ? `| ${item.variant.name}` : ''}</p>
                              </div>
                              <p className="checkout-item__price">{formatPrice((item.variant?.price ?? item.product.price) * item.quantity)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="review-details-grid">
                        <div className="review-box">
                          <h4>Shipping Address</h4>
                          {(() => {
                            const addr = addresses.find(a => a.id === selectedAddressId);
                            if (!addr) return null;
                            return (
                              <>
                                <p>{addr.firstName} {addr.lastName}</p>
                                <p>{addr.line1}</p>
                                {addr.line2 && <p>{addr.line2}</p>}
                                <p>{addr.city}, {addr.state} {addr.pincode}</p>
                                <p>Phone: {addr.phone}</p>
                              </>
                            );
                          })()}
                        </div>
                        <div className="review-box">
                          <h4>Delivery Method</h4>
                          <p>{deliveryMethod === 'EXPRESS' ? 'Express Delivery' : 'Standard Delivery'}</p>
                          <br/>
                          <h4>Payment Method</h4>
                          <p>{paymentMethod === 'RAZORPAY' ? 'Online Payment' : 'Cash on Delivery'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="review-sidebar">
                      <div className="cart-summary-card" style={{ position: 'sticky', top: '100px' }}>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '20px', color: 'var(--color-ivory)' }}>Order Summary</h3>
                        
                        {!cart.coupon && (
                          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                            <input 
                              type="text" 
                              className="form-input" 
                              placeholder="Discount code" 
                              value={couponCodeInput}
                              onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                              style={{ flex: 1, textTransform: 'uppercase' }}
                            />
                            <button 
                              className="btn btn-outline" 
                              onClick={handleApplyCoupon}
                              disabled={applyingCoupon || !couponCodeInput.trim()}
                            >
                              {applyingCoupon ? '...' : 'Apply'}
                            </button>
                          </div>
                        )}

                        <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cart.subtotal)}</span></div>
                        {cart.coupon && (
                          <div className="summary-row" style={{ color: 'var(--color-success)', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>Discount ({cart.coupon.code})</span>
                              <button 
                                onClick={handleRemoveCoupon} 
                                disabled={applyingCoupon}
                                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}
                              >
                                [Remove]
                              </button>
                            </div>
                            <span>-{formatPrice(cart.discount)}</span>
                          </div>
                        )}
                        <div className="summary-row">
                          <span>Shipping</span>
                          <span>{deliveryCharge === 0 ? <span style={{ color: 'var(--color-success)' }}>FREE</span> : formatPrice(deliveryCharge)}</span>
                        </div>
                        <div className="summary-row"><span>Estimated Tax</span><span>{formatPrice(cart.tax)}</span></div>

                        <div className="divider" style={{ margin: '16px 0' }} />
                        <div className="summary-row summary-total"><span>Total</span><span>{formatPrice(finalTotal)}</span></div>

                        <button
                          className={`btn btn-primary btn-full btn-lg ${loading ? 'btn-loading' : ''}`}
                          onClick={handlePlaceOrder}
                          disabled={loading}
                          style={{ marginTop: '24px' }}
                        >
                          {!loading && (paymentMethod === 'RAZORPAY' ? 'Proceed to Payment' : 'Place Order')}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="wizard-navigation">
              {currentStep > 1 ? (
                <button className="btn btn-outline" onClick={handleBack}>
                  ← Back
                </button>
              ) : (
                <div /> // Empty div for flex spacing
              )}
              
              {currentStep < 4 && !showNewAddress && (
                <button className="btn btn-primary" onClick={handleNext}>
                  Continue →
                </button>
              )}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .wizard-container { background: var(--color-charcoal); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-8); position: relative; overflow: hidden; }
        .wizard-step { width: 100%; }
        .step-title { font-family: var(--font-serif); font-size: 1.8rem; color: var(--color-ivory); margin-bottom: var(--space-6); padding-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); }
        
        /* Progress Bar */
        .progress-container { display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-8); padding: 0 var(--space-4); max-width: 800px; margin-left: auto; margin-right: auto; }
        .progress-step { display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; z-index: 2; width: 60px; }
        .progress-step__circle { width: 40px; height: 40px; border-radius: 50%; background: var(--color-charcoal); border: 2px solid var(--color-border); display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); font-weight: 600; font-size: 1.1rem; transition: all 0.3s ease; }
        .progress-step.active .progress-step__circle { border-color: var(--color-gold); color: var(--color-gold); box-shadow: 0 0 15px rgba(201,162,39,0.2); }
        .progress-step.completed .progress-step__circle { background: var(--color-gold); border-color: var(--color-gold); color: var(--color-black); }
        .progress-step__label { font-size: 0.75rem; font-weight: 500; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; transition: color 0.3s ease; }
        .progress-step.active .progress-step__label, .progress-step.completed .progress-step__label { color: var(--color-ivory); }
        .progress-line { flex: 1; height: 2px; background: var(--color-border); margin: 0 10px; margin-bottom: 24px; transition: background 0.3s ease; }
        .progress-line.active { background: var(--color-gold); }

        /* Navigation */
        .wizard-navigation { display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-8); padding-top: var(--space-6); border-top: 1px solid var(--color-border); }
        
        /* Address & Options Cards */
        .address-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-4); }
        .address-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-5); cursor: pointer; transition: all var(--transition-fast); position: relative; }
        .address-card:hover { border-color: var(--color-border-gold); }
        .address-card.active { border-color: var(--color-gold); background: rgba(201,162,39,0.05); }
        .address-card__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2); }
        .address-card__name { font-weight: 600; color: var(--color-ivory); font-size: 1.1rem; }
        .address-card__badge { font-size: 0.7rem; background: var(--color-gold); padding: 2px 8px; border-radius: var(--radius-full); color: var(--color-black); font-weight: 600; }
        .address-card__text { font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.5; margin-bottom: 4px; }
        .address-card__select { position: absolute; top: var(--space-5); right: var(--space-5); }
        
        .radio-circle { width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--color-border); position: relative; }
        .radio-circle.active { border-color: var(--color-gold); }
        .radio-circle.active::after { content: ''; position: absolute; top: 3px; left: 3px; right: 3px; bottom: 3px; background: var(--color-gold); border-radius: 50%; }
        
        .new-address-form { background: var(--color-surface); border: 1px dashed var(--color-border-gold); border-radius: var(--radius-md); padding: var(--space-6); margin-top: var(--space-6); }
        
        .delivery-methods, .payment-methods { display: flex; flex-direction: column; gap: var(--space-4); max-width: 600px; }
        .option-card { display: flex; align-items: center; justify-content: space-between; padding: var(--space-5); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition-fast); }
        .option-card:hover { border-color: var(--color-border-gold); }
        .option-card.active { border-color: var(--color-gold); background: rgba(201,162,39,0.05); }
        .option-card__left { display: flex; align-items: flex-start; gap: var(--space-4); }
        .option-card__left input { margin-top: 4px; accent-color: var(--color-gold); transform: scale(1.2); }
        .option-card__title { font-weight: 600; color: var(--color-ivory); display: block; margin-bottom: 6px; font-size: 1.1rem; }
        .option-card__desc { font-size: 0.9rem; color: var(--color-text-muted); }
        .option-card__price { font-weight: 600; color: var(--color-gold); font-size: 1.1rem; }
        
        /* Review Step */
        .review-grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: var(--space-8); }
        .review-section { margin-bottom: var(--space-8); }
        .review-section h3 { font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-ivory); margin-bottom: var(--space-4); }
        .review-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
        .review-box { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-5); }
        .review-box h4 { color: var(--color-gold); margin-bottom: 12px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .review-box p { color: var(--color-text-secondary); font-size: 0.9rem; line-height: 1.5; margin-bottom: 4px; }
        
        .checkout-items { display: flex; flex-direction: column; gap: var(--space-4); }
        .checkout-item { display: flex; align-items: center; gap: var(--space-4); background: var(--color-surface); padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--color-border); }
        .checkout-item img { width: 64px; height: 64px; border-radius: var(--radius-sm); object-fit: cover; }
        .checkout-item__info { flex: 1; min-width: 0; }
        .checkout-item__name { font-size: 1rem; font-weight: 500; color: var(--color-ivory); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
        .checkout-item__meta { font-size: 0.85rem; color: var(--color-text-muted); }
        .checkout-item__price { font-size: 1.1rem; font-weight: 600; color: var(--color-gold); }

        .address-form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .address-form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 24px; }
        @media (max-width: 1024px) { 
          .review-grid { grid-template-columns: 1fr; } 
        }
        @media (max-width: 768px) {
          .wizard-container { padding: var(--space-5); }
          .progress-step__label { display: none; }
          .progress-container { margin-bottom: var(--space-6); }
          .review-details-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .address-grid { grid-template-columns: 1fr; }
          .address-form-grid-2, .address-form-grid-3 { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
};

export default CheckoutPage;
