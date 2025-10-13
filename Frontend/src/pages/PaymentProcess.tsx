import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CreditCardIcon, LockIcon, CheckCircleIcon, ArrowLeftIcon, ShieldIcon, InfoIcon } from 'lucide-react';
import Button from '../components/Button';
import '../styles/PaymentProcess.css';
interface PaymentPlan {
  name: string;
  price: string;
  billingCycle: string;
}
const PaymentProcess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan as PaymentPlan || {
    name: 'Premium',
    price: '7.99',
    billingCycle: 'month, billed annually'
  };
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    }
    // Format expiry date with slash
    else if (name === 'expiry') {
      const formatted = value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').substring(0, 5);
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Name on card is required';
    }
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!formData.expiry.trim()) {
      newErrors.expiry = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = 'Use MM/YY format';
    }
    if (!formData.cvc.trim()) {
      newErrors.cvc = 'CVC is required';
    } else if (!/^\d{3,4}$/.test(formData.cvc)) {
      newErrors.cvc = 'CVC must be 3-4 digits';
    }
    if (step === 2) {
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'ZIP/Postal code is required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleNextStep = () => {
    if (validateForm()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };
  const handlePrevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setStep(4); // Move to success page
      }, 1500);
    }
  };
  return <div className="payment-process-container">
      <div className="payment-process-header">
        <Link to="/" className="payment-logo">
          <div className="payment-logo-icon">
            <span className="payment-logo-text">FF</span>
          </div>
          <h1 className="payment-logo-brand">Fit Foodie</h1>
        </Link>
        <div className="payment-steps-container">
          <div className="payment-steps">
            <div className={`payment-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <span className="step-label">Card Details</span>
            </div>
            <div className="step-connector"></div>
            <div className={`payment-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <span className="step-label">Billing</span>
            </div>
            <div className="step-connector"></div>
            <div className={`payment-step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              <div className="step-number">3</div>
              <span className="step-label">Review</span>
            </div>
          </div>
        </div>
      </div>
      <div className="payment-process-content">
        <div className="payment-form-container">
          {step < 4 ? <>
              <div className="payment-form-header">
                <h2 className="payment-form-title">
                  {step === 1 && 'Card Details'}
                  {step === 2 && 'Billing Information'}
                  {step === 3 && 'Review Your Order'}
                </h2>
                <p className="payment-form-subtitle">
                  {step === 1 && 'Enter your card details to subscribe'}
                  {step === 2 && 'Enter your billing address'}
                  {step === 3 && 'Please review your order details before completing the payment'}
                </p>
              </div>
              <form onSubmit={handleSubmit} className="payment-form">
                {step === 1 && <div className="form-section">
                    <div className="form-group">
                      <label htmlFor="cardName">Name on Card</label>
                      <input type="text" id="cardName" name="cardName" placeholder="John Smith" value={formData.cardName} onChange={handleInputChange} className={errors.cardName ? 'error' : ''} />
                      {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number</label>
                      <div className="input-with-icon">
                        <CreditCardIcon size={18} className="input-icon" />
                        <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" maxLength={19} value={formData.cardNumber} onChange={handleInputChange} className={errors.cardNumber ? 'error' : ''} />
                      </div>
                      {errors.cardNumber && <span className="error-message">
                          {errors.cardNumber}
                        </span>}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="expiry">Expiry Date</label>
                        <input type="text" id="expiry" name="expiry" placeholder="MM/YY" value={formData.expiry} onChange={handleInputChange} className={errors.expiry ? 'error' : ''} />
                        {errors.expiry && <span className="error-message">{errors.expiry}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="cvc">CVC</label>
                        <div className="input-with-icon">
                          <LockIcon size={16} className="input-icon" />
                          <input type="text" id="cvc" name="cvc" placeholder="123" maxLength={4} value={formData.cvc} onChange={handleInputChange} className={errors.cvc ? 'error' : ''} />
                        </div>
                        {errors.cvc && <span className="error-message">{errors.cvc}</span>}
                      </div>
                    </div>
                  </div>}
                {step === 2 && <div className="form-section">
                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <input type="text" id="address" name="address" placeholder="123 Main St" value={formData.address} onChange={handleInputChange} className={errors.address ? 'error' : ''} />
                      {errors.address && <span className="error-message">{errors.address}</span>}
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" name="city" placeholder="New York" value={formData.city} onChange={handleInputChange} className={errors.city ? 'error' : ''} />
                        {errors.city && <span className="error-message">{errors.city}</span>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="zipCode">ZIP / Postal Code</label>
                        <input type="text" id="zipCode" name="zipCode" placeholder="10001" value={formData.zipCode} onChange={handleInputChange} className={errors.zipCode ? 'error' : ''} />
                        {errors.zipCode && <span className="error-message">
                            {errors.zipCode}
                          </span>}
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="country">Country</label>
                      <select id="country" name="country" value={formData.country} onChange={handleInputChange}>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="India">India</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                      </select>
                    </div>
                  </div>}
                {step === 3 && <div className="form-section">
                    <div className="review-section">
                      <h3>Payment Details</h3>
                      <div className="review-item">
                        <span>Card</span>
                        <span>
                          •••• •••• •••• {formData.cardNumber.slice(-4)}
                        </span>
                      </div>
                      <div className="review-item">
                        <span>Name on Card</span>
                        <span>{formData.cardName}</span>
                      </div>
                      <div className="review-item">
                        <span>Billing Address</span>
                        <span>
                          {formData.address}, {formData.city},{' '}
                          {formData.zipCode}, {formData.country}
                        </span>
                      </div>
                    </div>
                    <div className="review-section">
                      <h3>Terms & Conditions</h3>
                      <div className="terms-checkbox">
                        <input type="checkbox" id="terms" required />
                        <label htmlFor="terms">
                          I agree to the <a href="#">Terms of Service</a> and{' '}
                          <a href="#">Privacy Policy</a>
                        </label>
                      </div>
                    </div>
                  </div>}
                <div className="form-actions">
                  {step > 1 && <Button type="button" variant="outline" onClick={handlePrevStep} icon={<ArrowLeftIcon size={16} />}>
                      Back
                    </Button>}
                  {step < 3 ? <Button type="button" onClick={handleNextStep}>
                      Continue
                    </Button> : <Button type="submit" disabled={loading} className={`payment-button ${loading ? 'loading' : ''}`}>
                      {loading ? 'Processing...' : 'Complete Payment'}
                    </Button>}
                </div>
              </form>
              <div className="payment-security">
                <div className="security-badge">
                  <LockIcon size={16} />
                  <span>Secure Checkout</span>
                </div>
                <div className="security-badge">
                  <ShieldIcon size={16} />
                  <span>Encrypted Data</span>
                </div>
              </div>
              <div className="payment-cards">
                <img src="https://cdn.jsdelivr.net/gh/stephenhutchings/microns@master/svg/visa.svg" alt="Visa" />
                <img src="https://cdn.jsdelivr.net/gh/stephenhutchings/microns@master/svg/mastercard.svg" alt="Mastercard" />
                <img src="https://cdn.jsdelivr.net/gh/stephenhutchings/microns@master/svg/amex.svg" alt="American Express" />
                <img src="https://cdn.jsdelivr.net/gh/stephenhutchings/microns@master/svg/discover.svg" alt="Discover" />
              </div>
            </> : <div className="payment-success">
              <div className="success-icon">
                <CheckCircleIcon size={48} />
              </div>
              <h2>Payment Successful!</h2>
              <p>
                Thank you for subscribing to Fit Foodie Premium! Your account
                has been upgraded and you now have access to all premium
                features.
              </p>
              <div className="success-details">
                <div className="success-detail">
                  <span>Plan</span>
                  <span>{plan.name}</span>
                </div>
                <div className="success-detail">
                  <span>Amount</span>
                  <span>
                    ${plan.price}/{plan.billingCycle}
                  </span>
                </div>
                <div className="success-detail">
                  <span>Payment Method</span>
                  <span>•••• {formData.cardNumber.slice(-4)}</span>
                </div>
              </div>
              <div className="success-actions">
                <Button onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
              </div>
            </div>}
        </div>
        <div className="payment-summary">
          <div className="summary-header">
            <h3>Order Summary</h3>
          </div>
          <div className="summary-content">
            <div className="plan-info">
              <div className="plan-icon">
                <CheckCircleIcon size={24} />
              </div>
              <div>
                <h4>{plan.name} Plan</h4>
                <p>Annual Billing</p>
              </div>
            </div>
            <div className="plan-features">
              <div className="feature-item">
                <CheckCircleIcon size={16} />
                <span>Advanced analytics & insights</span>
              </div>
              <div className="feature-item">
                <CheckCircleIcon size={16} />
                <span>Unlimited AI meal planning</span>
              </div>
              <div className="feature-item">
                <CheckCircleIcon size={16} />
                <span>Smart pantry & grocery lists</span>
              </div>
              <div className="feature-item">
                <CheckCircleIcon size={16} />
                <span>1 nutritionist consultation/month</span>
              </div>
            </div>
            <div className="price-breakdown">
              <div className="price-item">
                <span>Subtotal</span>
                <span>${Number(plan.price) * 12}</span>
              </div>  
              <div className="price-item discount">
                <span>Annual discount</span>
                <span>-${(Number(plan.price )* 12 * 0.2).toFixed(2)}</span>
              </div>
              <div className="price-item total">
                <span>Total</span>
                <span>${(Number(plan.price) * 12 * 0.8).toFixed(2)}</span>
              </div>
              <div className="price-caption">
                <InfoIcon size={14} />
                <span>
                  Billed annually at ${(Number(plan.price) * 12 * 0.8).toFixed(2)}
                </span>
              </div>
            </div>
            <div className="guarantee">
              <div className="guarantee-icon">
                <ShieldIcon size={20} />
              </div>
              <div>
                <h5>30-Day Money-Back Guarantee</h5>
                <p>
                  Not satisfied? Get a full refund within 30 days, no questions
                  asked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default PaymentProcess;

