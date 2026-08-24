import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useStoreSettings } from '../hooks/useStoreSettings';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
};

const ContactPage: React.FC = () => {
  const { data: settings } = useStoreSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await adminApi.createTicket({ ...formData, orderNumber: '' });
      toast.success('Your message has been sent successfully! We will get back to you within 2 hours.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet><title>Contact Us — {settings?.store_name || "BJ'S Natural Care"}</title></Helmet>

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero__bg" style={{ backgroundImage: `url('/contact-hero.jpg')` }} />
        <div className="contact-hero__overlay" />
        <div className="container contact-hero__content">
          <motion.div className="contact-hero__subtitle" {...fadeInUp}>GET IN TOUCH</motion.div>
          <motion.h1 className="contact-hero__title" {...fadeInUp} transition={{ delay: 0.1, duration: 0.7 }}>
            We Would Love to Hear From You
          </motion.h1>
          <motion.p className="contact-hero__text" {...fadeInUp} transition={{ delay: 0.2, duration: 0.7 }}>
            Have a question, feedback, or just want to say hello? Our concierge<br />
            team responds to every message within 2 hours.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="contact-main">
        <div className="container contact-main__inner">

          {/* Left: Form */}
          <motion.div className="contact-form-section" {...fadeInUp}>
            <h2 className="contact-heading">Send Us a Message</h2>
            <p className="contact-desc">Fill out the form below and we will get back to you within 2 hours during business hours.</p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group-full">
                <label className="contact-label">Full Name <span className="text-red">*</span></label>
                <input type="text" name="name" className="contact-input" required value={formData.name} onChange={handleChange} placeholder="Your full name" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="contact-label">Email Address <span className="text-red">*</span></label>
                  <input type="email" name="email" className="contact-input" required value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                </div>
                <div className="form-group">
                  <label className="contact-label">Phone Number <span className="text-muted">(optional)</span></label>
                  <input type="tel" name="phone" className="contact-input" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                </div>
              </div>

              <div className="form-group-full">
                <label className="contact-label">Subject <span className="text-muted">(optional)</span></label>
                <select name="subject" className="contact-input contact-select" value={formData.subject} onChange={handleChange}>
                  <option value="">Select a topic</option>
                  <option value="Order Inquiry">Order Inquiry</option>
                  <option value="Product Question">Product Question</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group-full">
                <label className="contact-label">Your Message <span className="text-red">*</span></label>
                <textarea name="message" className="contact-input contact-textarea" required value={formData.message} onChange={handleChange} rows={5} placeholder="Tell us how we can help you..." maxLength={500}></textarea>
                <div className="form-char-count">Maximum 500 characters</div>
              </div>

              <button type="submit" className="contact-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
              </button>
            </form>
          </motion.div>

          {/* Right: Info */}
          <motion.div className="contact-info-section" {...fadeInUp} transition={{ delay: 0.2 }}>

            <div className="contact-info-card">
              <div className="contact-info-icon"><Mail size={20} strokeWidth={1.5} /></div>
              <div className="contact-info-content">
                <h3>Email</h3>
                <p>jay250576@gmail.com</p>
                <a href="mailto:jay250576@gmail.com" className="contact-link">Send Email &rarr;</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon"><Phone size={20} strokeWidth={1.5} /></div>
              <div className="contact-info-content">
                <h3>Phone</h3>
                <p>+91 92745 96622<br />Mon-Sat, 10 AM - 7 PM IST</p>
                <a href="tel:+919274596622" className="contact-link">Call Us &rarr;</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon"><MapPin size={20} strokeWidth={1.5} /></div>
              <div className="contact-info-content">
                <h3>Visit Our Store</h3>
                <p>Surat, Gujarat, India</p>
                <a href="https://maps.google.com/?q=Surat,Gujarat,India" target="_blank" rel="noreferrer" className="contact-link">Get Directions &rarr;</a>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon"><Clock size={20} strokeWidth={1.5} /></div>
              <div className="contact-info-content">
                <h3>Business Hours</h3>
                <div className="hours-grid">
                  <span>Monday - Friday</span><span>10:00 AM - 8:00 PM</span>
                  <span>Saturday</span><span>10:00 AM - 7:00 PM</span>
                  <span>Sunday</span><span>11:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            <div className="contact-social">
              <h3>Follow Us</h3>
              <div className="contact-social-icons">
                <a href="https://www.instagram.com/bjs.essence?igsi=dWF1c3Uya3NlcHMz&utm_source=qr" className="social-icon" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="https://wa.me/919274596622" className="social-icon" target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                </a>
              </div>
            </div>

          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.986877864115!2d72.79155097587889!3d21.171804284897003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59411d1563%3A0xfe4558290938b042!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1716301234567!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0, display: 'block' }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Store Location Map"
        ></iframe>
      </section>

      <style>{`
        /* Hero */
        .contact-hero {
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: calc(var(--nav-height) + 40px) 24px 60px;
        }
        .contact-hero__bg {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        .contact-hero__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, #000000 100%);
          z-index: 1;
        }
        .contact-hero__content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }
        .contact-hero__subtitle {
          color: var(--color-gold);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .contact-hero__title {
          font-family: var(--font-serif);
          font-size: 3.5rem;
          line-height: 1.15;
          color: var(--color-ivory);
          margin-bottom: 24px;
          font-weight: 500;
        }
        .contact-hero__text {
          font-size: 1.15rem;
          color: #e5e5e5;
          line-height: 1.6;
        }

        /* Main Section */
        .contact-main {
          background: #000;
          padding: 80px 24px;
        }
        .contact-main__inner {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 60px;
          align-items: start;
        }

        /* Form */
        .contact-heading {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          color: #fff;
          margin-bottom: 8px;
        }
        .contact-desc {
          color: #888;
          font-size: 0.95rem;
          margin-bottom: 40px;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .form-group-full, .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .contact-label {
          color: #e5e5e5;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .text-muted { color: #666; font-size: 0.8rem; font-weight: normal; }
        .text-red { color: #ff4d4f; }
        .contact-input {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 4px;
          padding: 14px 16px;
          color: #fff;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .contact-input:focus {
          outline: none;
          border-color: var(--color-gold);
        }
        .contact-input::placeholder { color: #444; }
        .contact-select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
        }
        .contact-select option { background: #111; color: #fff; }
        .contact-textarea { resize: vertical; }
        .form-char-count {
          color: #666;
          font-size: 0.8rem;
          margin-top: -4px;
        }
        .contact-submit {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: var(--color-gold);
          color: #000;
          padding: 14px 32px;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
          align-self: flex-start;
          margin-top: 8px;
        }
        .contact-submit:hover { background: var(--color-soft-gold); }
        .contact-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        /* Info Cards */
        .contact-info-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .contact-info-card {
          display: flex;
          gap: 20px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          background: rgba(255,255,255,0.02);
        }
        .contact-info-icon {
          width: 40px; height: 40px;
          background: #fadca1;
          color: #000;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .contact-info-content h3 {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 8px;
        }
        .contact-info-content p {
          color: #888;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 12px;
        }
        .contact-link {
          color: var(--color-gold);
          font-size: 0.9rem;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .contact-link:hover { color: #fff; }
        
        .hours-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px 24px;
          color: #888;
          font-size: 0.95rem;
        }
        .hours-grid span:nth-child(even) {
          text-align: right;
          color: #a3a3a3;
        }

        .contact-social {
          margin-top: 16px;
        }
        .contact-social h3 {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: #fff;
          margin-bottom: 16px;
        }
        .contact-social-icons {
          display: flex;
          gap: 12px;
        }
        .social-icon {
          width: 40px; height: 40px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          transition: all 0.2s;
        }
        .social-icon:hover {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }

        /* Map */
        .contact-map {
          width: 100%;
          background: #000;
        }

        @media (max-width: 1024px) {
          .contact-main__inner { grid-template-columns: 1fr; gap: 60px; }
          .contact-hero__title { font-size: 3rem; }
        }
        @media (max-width: 768px) {
          .contact-hero__title { font-size: 2.2rem; }
          .form-row { grid-template-columns: 1fr; gap: 24px; }
        }
      `}</style>
    </>
  );
};

export default ContactPage;
