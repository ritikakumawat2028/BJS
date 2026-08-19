import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Heart, ShieldCheck, Globe, Droplet, HeadphonesIcon, CheckCircle2, ArrowRight } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet><title>About Us — BJ'S Natural Care</title></Helmet>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero__bg" style={{ backgroundImage: `url('/about-hero.jpg')` }} />
        <div className="about-hero__overlay" />
        <div className="container about-hero__content">
          <motion.div className="about-hero__subtitle" {...fadeInUp}>OUR STORY</motion.div>
          <motion.h1 className="about-hero__title" {...fadeInUp} transition={{ delay: 0.1, duration: 0.7 }}>
            Luxury, Crafted by<br />
            <span className="text-gold">Nature & Tradition</span>
          </motion.h1>
          <motion.p className="about-hero__text" {...fadeInUp} transition={{ delay: 0.2, duration: 0.7 }}>
            Where ancient Ayurvedic wisdom meets modern luxury. Every product is a<br />
            love letter to India's rich botanical heritage.
          </motion.p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="about-who">
        <div className="container about-who__inner">
          <motion.div className="about-who__content" {...fadeInUp}>
            <div className="about-subtitle">WHO WE ARE</div>
            <h2 className="about-title">
              A Passion for Purity,<br />
              A Commitment to <span className="text-gold">Excellence</span>
            </h2>
            <div className="about-who__desc">
              <p>
                BJ'S Natural Care was founded on a simple but radical belief: luxury should never come at the cost of your health or the planet. After losing his mother to a chemical-induced skin condition, our founder Bhupendra Jain dedicated his life to creating products that are as pure as they are indulgent.
              </p>
              <p>
                We source the world's finest natural ingredients — Damask roses from Kannauj, sandalwood from Mysore, saffron from Kashmir, cold-pressed argan oil from Morocco, and Bulgarian lavender. Each ingredient is hand-selected, ethically harvested, and traceable back to its farm of origin.
              </p>
              <p>
                Our formulations are crafted by a team of Ayurvedic doctors, cosmetic chemists, and master perfumers who combine 5,000-year-old Vedic knowledge with cutting-edge green chemistry. The result? Products that feel like a spa ritual and work like a clinical treatment.
              </p>
            </div>
            <Link to="/shop" className="about-btn">
              Explore Our Collection <ArrowRight size={18} />
            </Link>
          </motion.div>
          <motion.div className="about-who__image-wrap" {...fadeInUp} transition={{ delay: 0.2 }}>
            <img src="/about-products.jpg" alt="Our Products" className="about-who__image" />
            <div className="about-who__badge">
              <div className="about-who__badge-icon">
                <CheckCircle2 size={24} color="#000" />
              </div>
              <div className="about-who__badge-text">
                <strong>50K+</strong>
                <span>Verified Reviews</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="about-stats">
        <div className="container">
          <div className="about-stats__grid">
            <div className="about-stat">
              <div className="about-stat__num">2018</div>
              <div className="about-stat__label">FOUNDED</div>
            </div>
            <div className="about-stat">
              <div className="about-stat__num">50,000+</div>
              <div className="about-stat__label">HAPPY CUSTOMERS</div>
            </div>
            <div className="about-stat">
              <div className="about-stat__num">120+</div>
              <div className="about-stat__label">PRODUCTS</div>
            </div>
            <div className="about-stat">
              <div className="about-stat__num">98%</div>
              <div className="about-stat__label">SATISFACTION RATE</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="about-values">
        <div className="container">
          <motion.div className="about-values__header" {...fadeInUp}>
            <div className="about-subtitle">WHAT WE STAND FOR</div>
            <h2 className="about-title">Our Core <span className="text-gold">Values</span></h2>
            <p className="about-values__desc">
              These six principles guide every decision we make, every ingredient we<br />
              source, and every product we create.
            </p>
          </motion.div>

          <motion.div className="about-values__grid" variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}>
            
            <motion.div className="about-value-card" variants={fadeInUp}>
              <div className="about-value-card__icon"><Leaf size={24} strokeWidth={1.5} /></div>
              <h3 className="about-value-card__title">100% Natural</h3>
              <p className="about-value-card__text">
                Every ingredient in our products is sourced from nature. We never use parabens, sulfates, phthalates, or synthetic fragrances. Our formulations are rooted in Ayurvedic wisdom blended with modern science.
              </p>
            </motion.div>

            <motion.div className="about-value-card" variants={fadeInUp}>
              <div className="about-value-card__icon"><Heart size={24} strokeWidth={1.5} /></div>
              <h3 className="about-value-card__title">Cruelty Free</h3>
              <p className="about-value-card__text">
                We are proudly Leaping Bunny certified. None of our products or ingredients are ever tested on animals. Our ethical commitment extends to every supplier and partner we work with across the supply chain.
              </p>
            </motion.div>

            <motion.div className="about-value-card" variants={fadeInUp}>
              <div className="about-value-card__icon"><ShieldCheck size={24} strokeWidth={1.5} /></div>
              <h3 className="about-value-card__title">Quality First</h3>
              <p className="about-value-card__text">
                Each batch undergoes rigorous third-party testing for purity, potency, and safety. Our quality control lab in Jaipur ensures every product meets our uncompromising gold standard before reaching your hands.
              </p>
            </motion.div>

            <motion.div className="about-value-card" variants={fadeInUp}>
              <div className="about-value-card__icon"><Globe size={24} strokeWidth={1.5} /></div>
              <h3 className="about-value-card__title">Sustainability</h3>
              <p className="about-value-card__text">
                Our packaging is 100% recyclable, and we are transitioning to post-consumer recycled glass and paper by 2026. We plant one tree for every order placed through our partnership with Grow-Trees.com.
              </p>
            </motion.div>

            <motion.div className="about-value-card" variants={fadeInUp}>
              <div className="about-value-card__icon"><Droplet size={24} strokeWidth={1.5} /></div>
              <h3 className="about-value-card__title">Artisanal Craftsmanship</h3>
              <p className="about-value-card__text">
                Our perfumes are hand-blended by master perfumers in Kannauj, the perfume capital of India, using centuries-old distillation techniques passed down through six generations of artisans.
              </p>
            </motion.div>

            <motion.div className="about-value-card" variants={fadeInUp}>
              <div className="about-value-card__icon"><HeadphonesIcon size={24} strokeWidth={1.5} /></div>
              <h3 className="about-value-card__title">Lifetime Support</h3>
              <p className="about-value-card__text">
                Every customer becomes family. Our dedicated concierge team provides personalized fragrance consultations, skincare routines, and after-purchase support — for life. We answer every message within 2 hours.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container about-cta__inner">
          <motion.h2 className="about-title" style={{ marginBottom: '16px' }} {...fadeInUp}>
            Ready to Experience <span className="text-gold">Pure Luxury?</span>
          </motion.h2>
          <motion.p className="about-cta__desc" {...fadeInUp} transition={{ delay: 0.1 }}>
            Discover our complete collection of fragrances, skincare, haircare,<br />
            and body care — all crafted with nature's finest ingredients.
          </motion.p>
          <motion.div className="about-cta__buttons" {...fadeInUp} transition={{ delay: 0.2 }}>
            <Link to="/shop" className="about-btn">Shop All Products</Link>
            <Link to="/contact" className="about-btn-outline">Get In Touch</Link>
          </motion.div>
        </div>
      </section>

      <style>{`
        .text-gold { color: var(--color-gold); }
        .about-subtitle {
          color: var(--color-gold);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .about-title {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          font-weight: 600;
          color: var(--color-ivory);
          line-height: 1.2;
          margin-bottom: 24px;
        }

        /* Hero */
        .about-hero {
          position: relative;
          min-height: 70vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: calc(var(--nav-height) + 60px) 24px 80px;
        }
        .about-hero__bg {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          z-index: 0;
        }
        .about-hero__overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, #000000 100%);
          z-index: 1;
        }
        .about-hero__content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
        }
        .about-hero__title {
          font-family: var(--font-serif);
          font-size: 3.5rem;
          line-height: 1.15;
          color: var(--color-ivory);
          margin-bottom: 24px;
          font-weight: 500;
        }
        .about-hero__text {
          font-size: 1.15rem;
          color: #e5e5e5;
          line-height: 1.6;
        }

        /* Who We Are */
        .about-who {
          padding: 80px 24px 100px;
          background: #000;
        }
        .about-who__inner {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 80px;
          align-items: center;
        }
        .about-who__desc {
          color: #a3a3a3;
          font-size: 1rem;
          line-height: 1.8;
          margin-bottom: 40px;
        }
        .about-who__desc p { margin-bottom: 16px; }
        .about-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--color-gold);
          color: #000;
          padding: 14px 28px;
          border-radius: 4px;
          font-weight: 600;
          text-decoration: none;
          transition: background 0.2s;
        }
        .about-btn:hover { background: var(--color-soft-gold); }
        .about-who__image-wrap {
          position: relative;
          border-radius: 8px;
          overflow: visible;
        }
        .about-who__image {
          width: 100%;
          height: auto;
          aspect-ratio: 4 / 5;
          object-fit: cover;
          display: block;
          border-radius: 8px;
        }
        .about-who__badge {
          position: absolute;
          bottom: -20px;
          left: -40px;
          background: #000;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .about-who__badge-icon {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: #fadca1;
          display: flex; align-items: center; justify-content: center;
        }
        .about-who__badge-text strong {
          display: block; font-size: 1.4rem; color: #fff; font-family: var(--font-serif);
        }
        .about-who__badge-text span {
          display: block; font-size: 0.85rem; color: #a3a3a3;
        }

        /* Stats */
        .about-stats {
          border-top: 1px solid rgba(255,255,255,0.15);
          border-bottom: 1px solid rgba(255,255,255,0.15);
          background: #000;
          padding: 60px 24px;
        }
        .about-stats__grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          text-align: center;
          gap: 24px;
        }
        .about-stat__num {
          color: var(--color-gold);
          font-size: 2.5rem;
          font-family: var(--font-serif);
          font-weight: 600;
          margin-bottom: 8px;
        }
        .about-stat__label {
          color: #888;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
        }

        /* Values */
        .about-values {
          padding: 100px 24px;
          background: #000;
        }
        .about-values__header {
          text-align: center;
          margin-bottom: 60px;
        }
        .about-values__desc {
          color: #a3a3a3;
          font-size: 1.1rem;
          line-height: 1.6;
        }
        .about-values__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .about-value-card {
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 40px 32px;
          background: #0a0a0a;
          transition: transform 0.3s, border-color 0.3s;
        }
        .about-value-card:hover {
          transform: translateY(-5px);
          border-color: rgba(201, 162, 39, 0.4);
        }
        .about-value-card__icon {
          width: 48px; height: 48px;
          background: #fadca1;
          color: #000;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
        }
        .about-value-card__title {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          color: #fff;
          margin-bottom: 16px;
        }
        .about-value-card__text {
          color: #888;
          line-height: 1.6;
          font-size: 0.95rem;
        }

        /* CTA */
        .about-cta {
          border-top: 1px solid rgba(255,255,255,0.15);
          background: #000;
          padding: 100px 24px;
          text-align: center;
        }
        .about-cta__inner {
          max-width: 800px;
          margin: 0 auto;
        }
        .about-cta__desc {
          color: #a3a3a3;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 40px;
        }
        .about-cta__buttons {
          display: flex;
          gap: 16px;
          justify-content: center;
        }
        .about-btn-outline {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 28px;
          border-radius: 4px;
          font-weight: 600;
          text-decoration: none;
          color: var(--color-gold);
          border: 1px solid var(--color-gold);
          transition: all 0.2s;
        }
        .about-btn-outline:hover {
          background: rgba(201, 162, 39, 0.1);
        }

        @media (max-width: 1024px) {
          .about-hero__title { font-size: 3rem; }
          .about-who__inner { grid-template-columns: 1fr; gap: 60px; }
          .about-who__badge { left: 0; bottom: -20px; transform: none; }
          .about-stats__grid { grid-template-columns: 1fr 1fr; gap: 40px; }
          .about-values__grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 768px) {
          .about-hero__title { font-size: 2.2rem; }
          .about-values__grid { grid-template-columns: 1fr; }
          .about-stats__grid { grid-template-columns: 1fr; gap: 40px; }
          .about-who__badge { transform: none; }
          .about-cta__buttons { flex-direction: column; }
        }
      `}</style>
    </>
  );
};

export default AboutPage;
