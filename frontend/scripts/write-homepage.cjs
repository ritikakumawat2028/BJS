const fs = require('fs');
const path = require('path');

const content = `import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi, adminApi, userApi } from "../services/api";
import ProductCard from "../components/product/ProductCard";
import { Product, Banner, Campaign, StoreSettings, Review } from "../types";
import toast from "react-hot-toast";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const DUMMY_BESTSELLERS: Product[] = [
  { id: "dummy-1", name: "Royal Oud Essence", slug: "royal-oud-essence", description: "", price: 1499, comparePrice: 2141, category: { name: "Fragrance", slug: "fragrance" }, images: [{ id: "i1", url: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400", altText: "", isThumbnail: true, sortOrder: 0 }], isBestseller: true, inventory: { quantity: 10, lowStockThreshold: 3 }, avgRating: 4.8, reviewCount: 45 } as unknown as Product,
  { id: "dummy-2", name: "Velvet Rose Noir", slug: "velvet-rose-noir", description: "", price: 1999, comparePrice: 2665, category: { name: "Fragrance", slug: "fragrance" }, images: [{ id: "i2", url: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400", altText: "", isThumbnail: true, sortOrder: 0 }], isBestseller: true, inventory: { quantity: 10, lowStockThreshold: 3 }, avgRating: 4.7, reviewCount: 32 } as unknown as Product,
  { id: "dummy-3", name: "Sandalwood Gold", slug: "sandalwood-gold", description: "", price: 1299, comparePrice: 1665, category: { name: "Fragrance", slug: "fragrance" }, images: [{ id: "i3", url: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400", altText: "", isThumbnail: true, sortOrder: 0 }], isBestseller: true, inventory: { quantity: 10, lowStockThreshold: 3 }, avgRating: 4.6, reviewCount: 28 } as unknown as Product,
  { id: "dummy-4", name: "Argan Gold Shampoo", slug: "argan-gold-shampoo", description: "", price: 349, comparePrice: 485, category: { name: "Hair Care", slug: "hair-care" }, images: [{ id: "i4", url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", altText: "", isThumbnail: true, sortOrder: 0 }], isBestseller: true, inventory: { quantity: 10, lowStockThreshold: 3 }, avgRating: 4.5, reviewCount: 89 } as unknown as Product,
];

const DUMMY_NEW_ARRIVALS: Product[] = [
  { id: "na-1", name: "Sandalwood Gold", slug: "sandalwood-gold", description: "", price: 1299, comparePrice: 1699, category: { name: "Fragrance", slug: "fragrance" }, images: [{ id: "i1", url: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400", altText: "", isThumbnail: true, sortOrder: 0 }], isNewArrival: true, inventory: { quantity: 10, lowStockThreshold: 3 }, avgRating: 4.5, reviewCount: 12 } as unknown as Product,
  { id: "na-2", name: "Rose Glow Toner", slug: "rose-glow-toner", description: "", price: 549, comparePrice: 749, category: { name: "Skin Care", slug: "skin-care" }, images: [{ id: "i2", url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", altText: "", isThumbnail: true, sortOrder: 0 }], isNewArrival: true, inventory: { quantity: 10, lowStockThreshold: 3 }, avgRating: 4.3, reviewCount: 8 } as unknown as Product,
  { id: "na-3", name: "Exfoliating Body Scrub", slug: "exfoliating-body-scrub", description: "", price: 649, comparePrice: 849, category: { name: "Body Care", slug: "body-care" }, images: [{ id: "i3", url: "https://images.unsplash.com/photo-1556228578-6a0b1fcef94a?w=400", altText: "", isThumbnail: true, sortOrder: 0 }], isNewArrival: true, inventory: { quantity: 10, lowStockThreshold: 3 }, avgRating: 4.6, reviewCount: 21 } as unknown as Product,
  { id: "na-4", name: "Natural Aloe Gel", slug: "natural-aloe-gel", description: "", price: 349, comparePrice: 449, category: { name: "Natural Care", slug: "natural-care" }, images: [{ id: "i4", url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400", altText: "", isThumbnail: true, sortOrder: 0 }], isNewArrival: true, inventory: { quantity: 10, lowStockThreshold: 3 }, avgRating: 4.7, reviewCount: 34 } as unknown as Product,
];

const FALLBACK_TESTIMONIALS = [
  { id: "f1", rating: 5, comment: "The Royal Oud Essence is absolutely divine. I receive compliments every time I wear it. The scent lasts all day and the packaging is so luxurious. This is my third purchase and I am officially obsessed.", user: { firstName: "Priya", lastName: "Sharma", avatar: "https://randomuser.me/api/portraits/women/44.jpg" }, productName: "Royal Oud Essence", location: "Mumbai, India" },
  { id: "f2", rating: 5, comment: "The Argan Gold Shampoo transformed my hair in just two weeks. It feels incredibly soft and looks so healthy and shiny. I will never switch back to any other brand.", user: { firstName: "Anjali", lastName: "Mehta", avatar: "https://randomuser.me/api/portraits/women/68.jpg" }, productName: "Argan Gold Shampoo", location: "Delhi, India" },
  { id: "f3", rating: 5, comment: "I gifted the special set to my sister and she absolutely loved it. The packaging was premium and the fragrances are unlike anything we have tried before.", user: { firstName: "Rahul", lastName: "Verma", avatar: "https://randomuser.me/api/portraits/men/32.jpg" }, productName: "Gift Set", location: "Bangalore, India" },
];

const StarSelector: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => (
  <div className="star-selector" role="group" aria-label="Star rating">
    {[1, 2, 3, 4, 5].map(star => (
      <button key={star} type="button" className={"star-btn" + (star <= value ? " filled" : "")} onClick={() => onChange(star)} aria-label={star + " star"}>
        &#9733;
      </button>
    ))}
  </div>
);

const HomePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: featuredData } = useQuery({ queryKey: ["featured-products"], queryFn: () => productsApi.getFeatured() });
  const { data: bestsellersData } = useQuery({ queryKey: ["bestsellers"], queryFn: () => productsApi.getBestsellers() });
  const { data: newArrivalsData } = useQuery({ queryKey: ["new-arrivals"], queryFn: () => productsApi.getNewArrivals() });
  const { data: bannersData } = useQuery({ queryKey: ["hero-banners"], queryFn: () => adminApi.getBanners("HERO") });
  const { data: campaignsData } = useQuery({ queryKey: ["campaigns"], queryFn: () => adminApi.getCampaigns() });
  const { data: settingsData } = useQuery({ queryKey: ["store-settings"], queryFn: () => adminApi.getSettings() });
  const { data: reviewsData } = useQuery({ queryKey: ["approved-reviews"], queryFn: () => adminApi.getReviews({ isApproved: true, limit: 10 }) });

  const featured: Product[] = featuredData?.data?.data || [];
  const bestsellers: Product[] = bestsellersData?.data?.data?.length > 0 ? bestsellersData.data.data : DUMMY_BESTSELLERS;
  const newArrivals: Product[] = newArrivalsData?.data?.data?.length > 0 ? newArrivalsData.data.data : DUMMY_NEW_ARRIVALS;
  const banners: Banner[] = bannersData?.data?.data || [];
  const campaigns: Campaign[] = campaignsData?.data?.data || [];
  const settings: StoreSettings = settingsData?.data?.data || {};
  const approvedReviews: Review[] = reviewsData?.data?.data || [];

  const displayTestimonials = approvedReviews.length > 0
    ? approvedReviews.map((r: Review) => ({ id: r.id, rating: r.rating, comment: r.comment || "Great product!", user: r.user, productName: (r as any).productName || "BJ's Product", location: "" }))
    : FALLBACK_TESTIMONIALS;

  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success">("idle");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", email: "", rating: 5, comment: "", product: "" });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (displayTestimonials.length === 0) return;
    const timer = setInterval(() => setTestimonialIdx(i => (i + 1) % displayTestimonials.length), 5500);
    return () => clearInterval(timer);
  }, [displayTestimonials.length]);

  const submitReviewMutation = useMutation({
    mutationFn: (data: any) => userApi.addReview(data),
    onSuccess: () => {
      setReviewSubmitted(true);
      setReviewForm({ name: "", email: "", rating: 5, comment: "", product: "" });
      toast.success("Review submitted! It will appear after admin approval.");
      queryClient.invalidateQueries({ queryKey: ["approved-reviews"] });
    },
    onError: () => toast.error("Failed to submit review. Please try again."),
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.comment.trim() || !reviewForm.name.trim()) return;
    submitReviewMutation.mutate({ rating: reviewForm.rating, comment: reviewForm.comment, title: "Review by " + reviewForm.name });
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    try {
      await adminApi.subscribeNewsletter(newsletterEmail);
      setNewsletterStatus("success");
      setNewsletterEmail("");
      setTimeout(() => setNewsletterStatus("idle"), 5000);
    } catch { toast.error("Subscription failed. Please try again."); }
  };

  const heroHeading = banners[0]?.title || settings.hero_heading || "Luxury, Naturally Crafted.";
  const heroSub = banners[0]?.description || settings.hero_subheading || "Premium perfumes, skincare & haircare — elevated for the discerning few.";
  const heroImg = banners[0]?.desktopImage || "https://public.readdy.ai/ai/img_res/3812a198e3446b048d04b92569ffca79.jpg";
  const t = displayTestimonials[testimonialIdx];

  const categories = [
    { name: "Fragrance", slug: "fragrance", img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600", desc: "Premium oud, floral & exotic scents." },
    { name: "Hair Care", slug: "hair-care", img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=600", desc: "Nourishing shampoos, oils & serums." },
    { name: "Skin Care", slug: "skin-care", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600", desc: "Radiant face care & moisturizers." },
    { name: "Body Care", slug: "body-care", img: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600", desc: "Rich lotions, scrubs & washes." },
    { name: "Natural Care", slug: "natural-care", img: "https://images.unsplash.com/photo-1608248593802-861c8a14b0b1?w=600", desc: "Herbal & Ayurvedic wellness." },
    { name: "Gift Sets", slug: "gift-sets", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600", desc: "Curated luxury gift collections." },
  ];

  return (
    <HelmetProvider>
      <Helmet>
        <title>{settings.meta_title || "BJ'S Natural Care - Premium Luxury Beauty & Fragrance"}</title>
        <meta name="description" content={settings.meta_description || "Shop premium perfumes, skincare, haircare and natural beauty products."} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <main>
        {/* HERO */}
        <section className="hp-hero" style={{ backgroundImage: \`url('\${heroImg}')\` }}>
          <div className="hp-hero__overlay" />
          <div className="container hp-hero__content">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="hp-hero__text">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="hp-hero__eyebrow">BJ&apos;S NATURAL CARE</motion.p>
              <motion.h1 className="hp-hero__heading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>{heroHeading}</motion.h1>
              <motion.p className="hp-hero__sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>{heroSub}</motion.p>
              <motion.div className="hp-hero__ctas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                <Link to="/shop" className="btn btn-primary btn-lg">Shop Collection</Link>
                <Link to="/about" className="btn btn-outline btn-lg">Our Story</Link>
              </motion.div>
            </motion.div>
          </div>
          <div className="hp-hero__scroll"><div className="hp-hero__scroll-line" /><span className="hp-hero__scroll-text">Scroll</span></div>
        </section>

        {/* TRUST BAR */}
        <section className="hp-trust">
          <div className="container">
            <div className="hp-trust__grid">
              {[
                { icon: "🌿", title: "100% Natural", desc: "Sustainably sourced ingredients" },
                { icon: "🐰", title: "Cruelty Free", desc: "Certified ethical, never tested on animals" },
                { icon: "🚚", title: "Free Shipping", desc: "On orders over Rs.1,499 across India" },
                { icon: "↩", title: "Easy Returns", desc: "30-day hassle-free return policy" },
                { icon: "⭐", title: "Premium Quality", desc: "Small batch crafted for excellence" },
                { icon: "📞", title: "24/7 Support", desc: "Always here to help you" },
              ].map(item => (
                <motion.div key={item.title} className="hp-trust__item" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <div className="hp-trust__icon">{item.icon}</div>
                  <h3 className="hp-trust__title">{item.title}</h3>
                  <p className="hp-trust__desc">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section">
          <div className="container">
            <motion.div className="hp-section-head hp-section-head--center" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="hp-label">EXPLORE</p>
              <h2 className="hp-title">Shop by Category</h2>
              <p className="hp-subtitle">Curated collections for every aspect of your beauty and wellness routine</p>
            </motion.div>
            <motion.div className="hp-cats" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {categories.map(cat => (
                <motion.div key={cat.slug} variants={fadeUp}>
                  <Link to={\`/shop?category=\${cat.slug}\`} className="hp-cat">
                    <div className="hp-cat__img-wrap">
                      <img src={cat.img} alt={cat.name} className="hp-cat__img" loading="lazy" />
                      <div className="hp-cat__overlay" />
                    </div>
                    <div className="hp-cat__info">
                      <h3 className="hp-cat__name">{cat.name}</h3>
                      <p className="hp-cat__desc">{cat.desc}</p>
                      <span className="hp-cat__arrow">Explore &rarr;</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* BESTSELLERS */}
        <section className="section">
          <div className="container">
            <motion.div className="hp-section-head hp-section-head--row" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div><p className="hp-label">MOST LOVED</p><h2 className="hp-title" style={{ marginBottom: 0 }}>Bestsellers</h2></div>
              <Link to="/shop?bestseller=true" className="hp-view-all">View All &rarr;</Link>
            </motion.div>
            <motion.div className="hp-products-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {bestsellers.slice(0, 4).map(product => (
                <motion.div key={product.id} variants={fadeUp}><ProductCard product={product} /></motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* BANNERS */}
        <section className="hp-banners">
          <div className="container">
            <div className="hp-banners__grid">
              <div className="hp-banner" style={{ backgroundImage: "url('https://public.readdy.ai/ai/img_res/2952fab3151a438fe99f94ca0d95cd54.jpg')" }}>
                <div className="hp-banner__overlay" />
                <div className="hp-banner__content">
                  <span className="hp-banner__badge">LIMITED TIME</span>
                  <h2 className="hp-banner__title">Summer Glow Collection</h2>
                  <h3 className="hp-banner__subtitle">Up to 25% Off</h3>
                  <p className="hp-banner__desc">Embrace the season with our radiant skincare and luminous fragrances.</p>
                  <div className="hp-banner__actions">
                    <Link to="/shop?collection=summer" className="btn btn-primary">Explore Collection</Link>
                    <div className="hp-banner__code">Code: <span>SUMMER25</span></div>
                  </div>
                </div>
              </div>
              <div className="hp-banner" style={{ backgroundImage: "url('https://public.readdy.ai/ai/img_res/a3e8794ba9008060fd511d79b1ac6e06.jpg')" }}>
                <div className="hp-banner__overlay" />
                <div className="hp-banner__content">
                  <span className="hp-banner__badge">LIMITED TIME</span>
                  <h2 className="hp-banner__title">Raksha Bandhan Special</h2>
                  <h3 className="hp-banner__subtitle">Gift the Luxury They Deserve</h3>
                  <p className="hp-banner__desc">Celebrate the bond with our exclusive fragrance and skincare gift sets. Extra 30% off.</p>
                  <div className="hp-banner__actions">
                    <Link to="/shop?category=gift-sets" className="btn btn-primary">Shop Gifts</Link>
                    <div className="hp-banner__code">Code: <span>RAKHI30</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED */}
        {featured.length > 0 && (
          <section className="section" style={{ background: "var(--color-rich-black)" }}>
            <div className="container">
              <motion.div className="hp-section-head hp-section-head--row" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div><p className="hp-label">CURATED</p><h2 className="hp-title" style={{ marginBottom: 0 }}>Featured Products</h2></div>
                <Link to="/shop?featured=true" className="hp-view-all">View All &rarr;</Link>
              </motion.div>
              <motion.div className="hp-products-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {featured.slice(0, 4).map(product => (
                  <motion.div key={product.id} variants={fadeUp}><ProductCard product={product} /></motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* NEW ARRIVALS */}
        <section className="section" style={{ background: "var(--color-rich-black)" }}>
          <div className="container">
            <motion.div className="hp-section-head hp-section-head--row" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div><p className="hp-label">FRESH IN</p><h2 className="hp-title" style={{ marginBottom: 0 }}>New Arrivals</h2></div>
              <Link to="/shop?newArrival=true" className="hp-view-all">View All New &rarr;</Link>
            </motion.div>
            <motion.div className="hp-products-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {newArrivals.slice(0, 4).map(product => (
                <motion.div key={product.id} variants={fadeUp}><ProductCard product={product} /></motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS + REVIEW FORM */}
        <section className="hp-testimonials">
          <div className="container">
            <motion.div className="hp-section-head hp-section-head--center" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <p className="hp-label">TESTIMONIALS</p>
              <h2 className="hp-title">What Our Customers Say</h2>
              <p className="hp-subtitle">Real experiences from real people who have discovered the luxury of natural care</p>
            </motion.div>
            {t && (
              <>
                <AnimatePresence mode="wait">
                  <motion.div key={testimonialIdx} className="hp-testimonial" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                    <div className="hp-testimonial__stars">{Array.from({ length: t.rating }).map((_, i) => <span key={i}>&#9733;</span>)}</div>
                    <p className="hp-testimonial__quote">&ldquo;{t.comment}&rdquo;</p>
                    <div className="hp-testimonial__author">
                      {t.user?.avatar && <img src={t.user.avatar} alt={t.user.firstName} className="hp-testimonial__avatar" />}
                      <div>
                        <span className="hp-testimonial__name">{t.user.firstName} {t.user.lastName}</span>
                        {t.location && <span className="hp-testimonial__location">{t.location}</span>}
                      </div>
                    </div>
                    <p className="hp-testimonial__product">PURCHASED: {t.productName || "BJ'S Product"}</p>
                  </motion.div>
                </AnimatePresence>
                <div className="hp-testimonial__dots">
                  {displayTestimonials.map((_, i) => (
                    <button key={i} className={"hp-testimonial__dot" + (i === testimonialIdx ? " active" : "")} onClick={() => setTestimonialIdx(i)} aria-label={\`Testimonial \${i + 1}\`} />
                  ))}
                </div>
              </>
            )}
            <div className="hp-review-cta">
              <button className="hp-review-toggle-btn" onClick={() => { setShowReviewForm(v => !v); setReviewSubmitted(false); }}>
                {showReviewForm ? "Close Form" : "Write a Review"}
              </button>
            </div>
            <AnimatePresence>
              {showReviewForm && (
                <motion.div className="hp-review-form-wrap" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4 }}>
                  {reviewSubmitted ? (
                    <div className="hp-review-success">
                      <span className="hp-review-success__icon">&#10003;</span>
                      <div><strong>Thank you for your review!</strong><p>It will appear after admin approval.</p></div>
                    </div>
                  ) : (
                    <form className="hp-review-form" onSubmit={handleReviewSubmit}>
                      <h3 className="hp-review-form__title">Share Your Experience</h3>
                      <div className="hp-review-form__grid">
                        <div className="hp-form-group">
                          <label className="hp-form-label">Your Name *</label>
                          <input className="hp-form-input" type="text" placeholder="e.g. Priya Sharma" value={reviewForm.name} onChange={e => setReviewForm(f => ({ ...f, name: e.target.value }))} required />
                        </div>
                        <div className="hp-form-group">
                          <label className="hp-form-label">Email Address *</label>
                          <input className="hp-form-input" type="email" placeholder="your@email.com" value={reviewForm.email} onChange={e => setReviewForm(f => ({ ...f, email: e.target.value }))} required />
                        </div>
                        <div className="hp-form-group">
                          <label className="hp-form-label">Product Name</label>
                          <input className="hp-form-input" type="text" placeholder="e.g. Royal Oud Essence" value={reviewForm.product} onChange={e => setReviewForm(f => ({ ...f, product: e.target.value }))} />
                        </div>
                        <div className="hp-form-group">
                          <label className="hp-form-label">Rating *</label>
                          <StarSelector value={reviewForm.rating} onChange={v => setReviewForm(f => ({ ...f, rating: v }))} />
                        </div>
                        <div className="hp-form-group hp-form-group--full">
                          <label className="hp-form-label">Your Review *</label>
                          <textarea className="hp-form-input hp-form-textarea" placeholder="Tell us about your experience..." value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} required rows={4} />
                        </div>
                      </div>
                      <p className="hp-review-notice">Your review will be visible after admin approval.</p>
                      <button type="submit" className="btn btn-primary hp-review-submit" disabled={submitReviewMutation.isPending}>
                        {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="hp-newsletter">
          <div className="container">
            <motion.div className="hp-newsletter__content" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="hp-newsletter__icon">&#9993;</div>
              <h2 className="hp-newsletter__title">Stay in the Loop</h2>
              <p className="hp-newsletter__sub">Subscribe to receive exclusive offers, early access to new collections, and beauty tips curated just for you.</p>
              {newsletterStatus === "success" ? (
                <div className="hp-newsletter__success">You are subscribed! Welcome to the BJ&apos;S family.</div>
              ) : (
                <form className="hp-newsletter__form" onSubmit={handleNewsletter}>
                  <input type="email" className="hp-newsletter__input" placeholder="Enter your email address" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} required />
                  <button type="submit" className="hp-newsletter__btn">Subscribe</button>
                </form>
              )}
              <p className="hp-newsletter__legal">By subscribing, you agree to our <Link to="/privacy-policy" style={{ color: "inherit", textDecoration: "underline" }}>Privacy Policy</Link>. Unsubscribe anytime.</p>
            </motion.div>
          </div>
        </section>
      </main>

      <style>{\`
        .hp-hero { min-height: 100vh; background-size: cover; background-position: center; background-attachment: fixed; display: flex; align-items: center; position: relative; }
        .hp-hero__overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(8,8,8,.88) 0%, rgba(8,8,8,.5) 55%, rgba(8,8,8,.7) 100%); }
        .hp-hero__content { position: relative; z-index: 2; padding-top: var(--nav-height); }
        .hp-hero__text { max-width: 660px; }
        .hp-hero__eyebrow { font-size: .65rem; letter-spacing: .35em; text-transform: uppercase; color: var(--color-gold); margin-bottom: var(--space-4); display: block; }
        .hp-hero__heading { font-family: var(--font-serif); font-size: clamp(2.2rem, 6vw, 5rem); font-weight: 300; color: var(--color-ivory); line-height: 1.1; margin-bottom: var(--space-5); }
        .hp-hero__sub { font-size: 1.05rem; color: var(--color-champagne); line-height: 1.7; margin-bottom: var(--space-10); max-width: 460px; }
        .hp-hero__ctas { display: flex; flex-wrap: wrap; gap: var(--space-4); }
        .hp-hero__scroll { position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 2; animation: pulse 2s ease-in-out infinite; }
        .hp-hero__scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, var(--color-gold), transparent); }
        .hp-hero__scroll-text { font-size: .58rem; letter-spacing: .3em; text-transform: uppercase; color: var(--color-gold); }
        .hp-trust { background: var(--color-charcoal); border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: var(--space-8) 0; }
        .hp-trust__grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--space-4); }
        .hp-trust__item { text-align: center; padding: var(--space-2); }
        .hp-trust__icon { font-size: 1.6rem; margin-bottom: var(--space-3); display: block; }
        .hp-trust__title { font-family: var(--font-serif); font-size: 1rem; color: var(--color-gold); margin-bottom: var(--space-2); }
        .hp-trust__desc { font-size: .72rem; color: var(--color-text-muted); line-height: 1.6; }
        .hp-label { font-size: .65rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--color-gold); margin-bottom: 8px; }
        .hp-title { font-family: var(--font-serif); font-size: clamp(1.8rem, 4vw, 2.5rem); color: var(--color-ivory); margin-bottom: 8px; font-weight: 400; }
        .hp-subtitle { font-size: .88rem; color: var(--color-text-muted); line-height: 1.7; max-width: 520px; }
        .hp-section-head { margin-bottom: var(--space-8); }
        .hp-section-head--center { text-align: center; }
        .hp-section-head--center .hp-subtitle { margin: 0 auto; }
        .hp-section-head--row { display: flex; justify-content: space-between; align-items: flex-end; }
        .hp-view-all { color: var(--color-gold); font-size: .88rem; font-weight: 500; transition: opacity .2s; white-space: nowrap; }
        .hp-view-all:hover { opacity: .75; }
        .hp-cats { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-5); }
        .hp-cat { display: block; position: relative; border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border); transition: all var(--transition-luxury); }
        .hp-cat:hover { border-color: var(--color-border-gold); transform: translateY(-4px); box-shadow: var(--shadow-gold); }
        .hp-cat__img-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; }
        .hp-cat__img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-luxury); }
        .hp-cat:hover .hp-cat__img { transform: scale(1.06); }
        .hp-cat__overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,.95) 0%, rgba(0,0,0,.35) 50%, transparent 100%); }
        .hp-cat__info { position: absolute; bottom: 0; left: 0; right: 0; padding: var(--space-5) var(--space-4); }
        .hp-cat__name { font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-ivory); margin-bottom: 6px; }
        .hp-cat__desc { font-size: .78rem; color: var(--color-text-secondary); margin-bottom: var(--space-3); line-height: 1.5; }
        .hp-cat__arrow { color: var(--color-gold); font-size: .82rem; font-weight: 500; transition: transform var(--transition-fast); display: inline-block; }
        .hp-cat:hover .hp-cat__arrow { transform: translateX(4px); }
        .hp-products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-5); }
        .hp-banners { padding: var(--space-10) 0; }
        .hp-banners__grid { display: flex; flex-direction: column; gap: var(--space-7); }
        .hp-banner { position: relative; border-radius: var(--radius-md); overflow: hidden; background-size: cover; background-position: center; min-height: 380px; display: flex; align-items: center; }
        .hp-banner__overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(0,0,0,.9) 0%, rgba(0,0,0,.5) 55%, transparent 100%); }
        .hp-banner__content { position: relative; z-index: 2; padding: var(--space-10) var(--space-12); max-width: 560px; }
        .hp-banner__badge { display: inline-block; font-size: .72rem; font-weight: 700; color: var(--color-black); background: var(--color-gold); padding: 5px 12px; border-radius: 2px; margin-bottom: var(--space-4); letter-spacing: .05em; text-transform: uppercase; }
        .hp-banner__title { font-family: var(--font-serif); font-size: clamp(1.8rem, 4vw, 2.5rem); color: var(--color-ivory); margin-bottom: 8px; }
        .hp-banner__subtitle { font-size: 1.05rem; color: var(--color-gold); margin-bottom: var(--space-4); font-weight: 500; }
        .hp-banner__desc { color: var(--color-ivory); line-height: 1.65; margin-bottom: var(--space-6); font-size: .92rem; }
        .hp-banner__actions { display: flex; align-items: center; gap: var(--space-4); flex-wrap: wrap; }
        .hp-banner__code { border: 1px dashed rgba(255,255,255,.4); padding: 8px 16px; color: var(--color-text-secondary); border-radius: var(--radius-sm); font-size: .88rem; }
        .hp-banner__code span { color: var(--color-gold); margin-left: 4px; font-weight: 600; }
        .hp-testimonials { padding: var(--space-20) 0; background: var(--color-rich-black); border-top: 1px solid var(--color-border); }
        .hp-testimonial { max-width: 720px; margin: 0 auto; text-align: center; padding: 0 var(--space-5); }
        .hp-testimonial__stars { color: var(--color-gold); font-size: 1.3rem; letter-spacing: 4px; margin-bottom: var(--space-5); }
        .hp-testimonial__quote { font-family: var(--font-serif); font-size: clamp(1rem, 2.2vw, 1.3rem); color: var(--color-ivory); line-height: 1.85; font-style: italic; margin-bottom: var(--space-7); }
        .hp-testimonial__author { display: inline-flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3); }
        .hp-testimonial__avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-border-gold); }
        .hp-testimonial__name { display: block; font-weight: 600; font-size: .95rem; color: var(--color-ivory); text-align: left; }
        .hp-testimonial__location { display: block; font-size: .75rem; color: var(--color-text-muted); text-align: left; }
        .hp-testimonial__product { font-size: .62rem; letter-spacing: .2em; color: var(--color-gold); text-transform: uppercase; margin-top: var(--space-3); }
        .hp-testimonial__dots { display: flex; justify-content: center; gap: var(--space-2); margin-top: var(--space-8); }
        .hp-testimonial__dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid var(--color-gold); background: transparent; cursor: pointer; transition: background .3s; padding: 0; }
        .hp-testimonial__dot.active { background: var(--color-gold); }
        .hp-review-cta { text-align: center; margin-top: var(--space-10); }
        .hp-review-toggle-btn { background: transparent; border: 1px solid var(--color-border-gold); color: var(--color-gold); padding: 12px 28px; border-radius: var(--radius-md); font-size: .88rem; font-weight: 600; cursor: pointer; transition: all .2s; }
        .hp-review-toggle-btn:hover { background: rgba(201,162,39,.1); }
        .hp-review-form-wrap { overflow: hidden; }
        .hp-review-form { background: var(--color-charcoal); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-8); margin-top: var(--space-6); max-width: 760px; margin-left: auto; margin-right: auto; }
        .hp-review-form__title { font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-gold); margin-bottom: var(--space-6); text-align: center; }
        .hp-review-form__grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-5); margin-bottom: var(--space-5); }
        .hp-form-group { display: flex; flex-direction: column; gap: var(--space-2); }
        .hp-form-group--full { grid-column: 1 / -1; }
        .hp-form-label { font-size: .75rem; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--color-text-muted); }
        .hp-form-input { background: rgba(255,255,255,.05); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 12px 16px; color: var(--color-ivory); font-size: .9rem; outline: none; transition: border-color .2s; font-family: inherit; width: 100%; box-sizing: border-box; }
        .hp-form-input:focus { border-color: var(--color-gold); }
        .hp-form-input::placeholder { color: var(--color-text-muted); }
        .hp-form-textarea { resize: vertical; min-height: 110px; }
        .hp-review-notice { font-size: .78rem; color: var(--color-text-muted); margin-bottom: var(--space-5); text-align: center; }
        .hp-review-submit { width: 100%; padding: 14px; font-size: 1rem; }
        .hp-review-success { display: flex; align-items: center; gap: var(--space-4); background: rgba(201,162,39,.08); border: 1px solid var(--color-border-gold); border-radius: var(--radius-md); padding: var(--space-5) var(--space-6); max-width: 760px; margin: var(--space-6) auto 0; }
        .hp-review-success__icon { font-size: 1.8rem; color: var(--color-gold); line-height: 1; }
        .hp-review-success strong { display: block; color: var(--color-gold); margin-bottom: 4px; }
        .hp-review-success p { font-size: .85rem; color: var(--color-text-muted); margin: 0; }
        .star-selector { display: flex; gap: 4px; }
        .star-btn { background: transparent; border: none; font-size: 1.6rem; cursor: pointer; color: rgba(255,255,255,.2); transition: color .15s; padding: 0; line-height: 1; }
        .star-btn.filled, .star-btn:hover { color: var(--color-gold); }
        .hp-newsletter { padding: var(--space-20) 0; background: var(--color-rich-black); border-top: 1px solid var(--color-border); text-align: center; }
        .hp-newsletter__content { max-width: 560px; margin: 0 auto; }
        .hp-newsletter__icon { font-size: 1.4rem; width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid var(--color-border-gold); margin-bottom: var(--space-5); }
        .hp-newsletter__title { font-family: var(--font-serif); font-size: clamp(1.7rem, 3vw, 2.3rem); color: var(--color-ivory); margin-bottom: var(--space-4); font-weight: 400; }
        .hp-newsletter__sub { color: var(--color-text-muted); font-size: .88rem; line-height: 1.7; margin-bottom: var(--space-7); max-width: 400px; margin-left: auto; margin-right: auto; }
        .hp-newsletter__form { display: flex; gap: var(--space-3); max-width: 480px; margin: 0 auto var(--space-4); }
        .hp-newsletter__input { flex: 1; background: transparent; border: 1px solid var(--color-border); color: var(--color-ivory); padding: 13px 18px; border-radius: var(--radius-sm); font-size: .9rem; outline: none; transition: border-color .2s; min-width: 0; }
        .hp-newsletter__input:focus { border-color: var(--color-gold); }
        .hp-newsletter__input::placeholder { color: var(--color-text-muted); }
        .hp-newsletter__btn { background: var(--color-gold); color: var(--color-black); border: none; padding: 13px 26px; font-weight: 700; font-size: .9rem; border-radius: var(--radius-sm); cursor: pointer; transition: background .2s; white-space: nowrap; }
        .hp-newsletter__btn:hover { background: #b8922a; }
        .hp-newsletter__legal { font-size: .73rem; color: var(--color-text-muted); }
        .hp-newsletter__success { color: var(--color-gold); font-size: .95rem; font-weight: 500; padding: var(--space-4); border: 1px solid var(--color-border-gold); border-radius: var(--radius-sm); margin-bottom: var(--space-4); }
        @media (max-width: 1200px) { .hp-trust__grid { grid-template-columns: repeat(3, 1fr); } .hp-products-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 1024px) { .hp-cats { grid-template-columns: repeat(2, 1fr); } .hp-products-grid { grid-template-columns: repeat(2, 1fr); } .hp-section-head--row { flex-wrap: wrap; gap: var(--space-3); } }
        @media (max-width: 768px) {
          .hp-hero { background-attachment: scroll; min-height: 85vh; }
          .hp-trust__grid { grid-template-columns: repeat(3, 1fr); gap: var(--space-3); }
          .hp-cats { grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
          .hp-products-grid { grid-template-columns: repeat(2, 1fr); gap: var(--space-3); }
          .hp-banner { min-height: 300px; }
          .hp-banner__content { padding: var(--space-6) var(--space-5); }
          .hp-banner__actions { flex-direction: column; align-items: flex-start; gap: var(--space-3); }
          .hp-review-form__grid { grid-template-columns: 1fr; }
          .hp-review-form { padding: var(--space-5) var(--space-4); }
          .hp-newsletter__form { flex-direction: column; }
          .hp-newsletter__btn { width: 100%; }
        }
        @media (max-width: 480px) {
          .hp-hero__ctas { flex-direction: column; }
          .hp-hero__ctas .btn { width: 100%; text-align: center; }
          .hp-cats { grid-template-columns: 1fr; }
          .hp-products-grid { grid-template-columns: 1fr 1fr; gap: var(--space-2); }
          .hp-trust__grid { grid-template-columns: repeat(2, 1fr); }
          .hp-section-head--row { flex-direction: column; align-items: flex-start; }
          .hp-banner__content { padding: var(--space-5) var(--space-4); max-width: 100%; }
        }
        @media (max-width: 360px) { .hp-products-grid { grid-template-columns: 1fr; } }
      \`}</style>
    </HelmetProvider>
  );
};

export default HomePage;
`;

const outPath = path.join(__dirname, '..', 'src', 'pages', 'HomePage.tsx');
fs.writeFileSync(outPath, content, 'utf8');
console.log('HomePage.tsx written successfully! Lines:', content.split('\n').length);
