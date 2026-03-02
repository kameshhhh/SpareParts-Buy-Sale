import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

/* ── Static data for landing page (fast load, no API needed) ── */
const PRODUCTS = [
  { id: 7, name: 'Brembo GP4-RX Brake Caliper', compat: 'Honda CBR600RR 2020-2024', cond: 'New', price: '₹41,499', rating: '★★★★★', badge: 'new', image: 'https://images.unsplash.com/photo-1749655673903-1185ef1d5710?w=480&h=420&fit=crop&auto=format&q=80' },
  { id: 25, name: 'Akrapovic Titanium Full Exhaust', compat: 'Yamaha R1 2015-2023', cond: 'Used', price: '₹1,09,499', rating: '★★★★☆', badge: 'used', image: 'https://images.unsplash.com/photo-1749339380849-14b145536895?w=480&h=420&fit=crop&auto=format&q=80' },
  { id: 10, name: 'Ohlins TTX GP Rear Shock', compat: 'Ducati Panigale V4 2021+', cond: 'Refurbished', price: '₹65,999', rating: '★★★★★', badge: 'refurb', image: 'https://images.unsplash.com/photo-1640021042525-5610f9f75444?w=480&h=420&fit=crop&auto=format&q=80' },
  { id: 31, name: 'Michelin Power GP2 Tire Set', compat: 'Universal 120/70 & 200/55', cond: 'New', price: '₹26,999', rating: '★★★★★', badge: 'new', image: 'https://images.unsplash.com/photo-1675665154962-bddfb3fb83b7?w=480&h=420&fit=crop&auto=format&q=80' },
  { id: 43, name: 'Rizoma Wing GP Mirror', compat: 'Universal fit - M10 thread', cond: 'New', price: '₹12,599', rating: '★★★☆☆', badge: 'new', image: 'https://images.unsplash.com/photo-1690583684688-d588b5b62ce3?w=480&h=420&fit=crop&auto=format&q=80' },
  { id: 37, name: 'DID ERT2 Racing Chain Kit', compat: 'Kawasaki ZX-10R 2016-2024', cond: 'New', price: '₹17,799', rating: '★★★★☆', badge: 'new', image: 'https://images.unsplash.com/photo-1732045961926-f1f4a755ae50?w=480&h=420&fit=crop&auto=format&q=80' },
];

const CATEGORIES = [
  { slug: 'engine-parts', name: 'Engine Parts', count: '4,230 parts' },
  { slug: 'brakes-suspension', name: 'Brakes & Suspension', count: '2,150 parts' },
  { slug: 'electrical-lighting', name: 'Electrical & Lighting', count: '1,840 parts' },
  { slug: 'body-fairings', name: 'Body & Fairings', count: '3,100 parts' },
  { slug: 'exhaust-systems', name: 'Exhaust Systems', count: '980 parts' },
  { slug: 'wheels-tires', name: 'Wheels & Tires', count: '1,560 parts' },
  { slug: 'transmission', name: 'Transmission', count: '720 parts' },
  { slug: 'accessories', name: 'Accessories', count: '5,400 parts' },
];

const SELLERS = [
  { name: 'MotoWorks Pro', rating: '★★★★★', parts: '312 parts', avatar: 'https://images.unsplash.com/photo-1759665996019-c2bdf600b90f?w=80&h=80&fit=crop&auto=format&q=80' },
  { name: 'TwoWheels Hub', rating: '★★★★★', parts: '204 parts', avatar: 'https://images.unsplash.com/photo-1574607433570-66adc6340701?w=80&h=80&fit=crop&auto=format&q=80' },
  { name: 'RaceParts Co.', rating: '★★★★☆', parts: '178 parts', avatar: 'https://images.unsplash.com/photo-1604769583008-4cdcbba94e17?w=80&h=80&fit=crop&auto=format&q=80' },
  { name: 'SpeedFactory', rating: '★★★★★', parts: '423 parts', avatar: 'https://images.unsplash.com/photo-1585550264824-cdb42e40f5ee?w=80&h=80&fit=crop&auto=format&q=80' },
  { name: 'BikeGarage', rating: '★★★★☆', parts: '95 parts', avatar: 'https://images.unsplash.com/photo-1676247122495-97eea5629e64?w=80&h=80&fit=crop&auto=format&q=80' },
  { name: 'TurboRiders', rating: '★★★★★', parts: '261 parts', avatar: 'https://images.unsplash.com/photo-1770923898118-b4f25f7e18eb?w=80&h=80&fit=crop&auto=format&q=80' },
];

const TESTIMONIALS = [
  { quote: '"Found a rare Ducati fuel injector within hours. The seller was responsive and shipping was lightning fast. 10/10 experience!"', name: 'Arjun S.', bike: 'Ducati Streetfighter V4', rating: '★★★★★', avatar: 'https://images.unsplash.com/photo-1700686330377-a5f4b2db9751?w=60&h=60&fit=crop&auto=format&q=80' },
  { quote: '"Sold three sets of old suspension parts in a week. MotoParts 2060 is genuinely the best platform for riders who want to earn from spares."', name: 'Mei T.', bike: 'Yamaha R6', rating: '★★★★★', avatar: 'https://images.unsplash.com/photo-1599145534822-cac8fd52266a?w=60&h=60&fit=crop&auto=format&q=80' },
  { quote: '"The search filters are insanely detailed. Compatibility check saved me from buying the wrong brake pads. Brilliant UX!"', name: 'Carlos R.', bike: 'KTM Duke 890', rating: '★★★★☆', avatar: 'https://images.unsplash.com/photo-1535086065667-3adb824a8585?w=60&h=60&fit=crop&auto=format&q=80' },
];

/* ── HERO ─────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__inner">
        <div className="hero__text">
          <span className="hero__badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
            Now live in 180 countries
          </span>
          <h1 className="hero__headline">
            Find Any Motorcycle Part.<br /><span>Sell Your Spares.</span>
          </h1>
          <p className="hero__sub">
            The largest marketplace for motorcycle parts in the universe. Connect buyers and sellers with speed and trust.
          </p>
          <div className="hero__ctas">
            <Link className="btn btn--primary" to="/browse">
              Browse Parts
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
            <Link className="btn btn--secondary" to="/sell">Start Selling</Link>
          </div>
        </div>
        <div className="hero__img-grid">
          <div className="hero__img-card"><img src="https://images.unsplash.com/photo-1585550264824-cdb42e40f5ee?w=480&h=420&fit=crop&auto=format&q=80" alt="Featured parts" /></div>
          <div className="hero__img-card"><img src="https://images.unsplash.com/photo-1676247122495-97eea5629e64?w=480&h=420&fit=crop&auto=format&q=80" alt="Motorcycle exhaust" /></div>
          <div className="hero__img-card"><img src="https://images.unsplash.com/photo-1574607433570-66adc6340701?w=480&h=420&fit=crop&auto=format&q=80" alt="Brake calipers" /></div>
        </div>
      </div>
    </section>
  );
}

/* ── CATEGORIES ───────────────────────────────────────────────── */
function Categories() {
  return (
    <section className="categories" id="categories">
      <div className="section-header">
        <span className="section-tag">EXPLORE</span>
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-sub">Browse thousands of OEM and aftermarket parts across all categories</p>
      </div>
      <div className="categories__grid">
        {CATEGORIES.map(cat => (
          <Link to={`/category/${cat.slug}`} className="category-card" key={cat.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
            <img className="category-card__img" src={{
              'engine-parts': 'https://images.unsplash.com/photo-1759665996019-c2bdf600b90f?w=100&h=100&fit=crop&auto=format&q=80',
              'brakes-suspension': 'https://images.unsplash.com/photo-1574607433570-66adc6340701?w=100&h=100&fit=crop&auto=format&q=80',
              'electrical-lighting': 'https://images.unsplash.com/photo-1599145534822-cac8fd52266a?w=100&h=100&fit=crop&auto=format&q=80',
              'body-fairings': 'https://images.unsplash.com/photo-1535086065667-3adb824a8585?w=100&h=100&fit=crop&auto=format&q=80',
              'exhaust-systems': 'https://images.unsplash.com/photo-1585550264824-cdb42e40f5ee?w=100&h=100&fit=crop&auto=format&q=80',
              'wheels-tires': 'https://images.unsplash.com/photo-1604769583008-4cdcbba94e17?w=100&h=100&fit=crop&auto=format&q=80',
              'transmission': 'https://images.unsplash.com/photo-1700686330377-a5f4b2db9751?w=100&h=100&fit=crop&auto=format&q=80',
              'accessories': 'https://images.unsplash.com/photo-1770923898118-b4f25f7e18eb?w=100&h=100&fit=crop&auto=format&q=80',
            }[cat.slug]} alt={cat.name} />
            <div className="category-card__name">{cat.name}</div>
            <div className="category-card__count">{cat.count}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── FEATURED PARTS ───────────────────────────────────────────── */
function FeaturedParts() {
  const { addToCart } = useCart();

  const handleAdd = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await addToCart(id);
    if (ok) alert('Added to cart!');
  };

  return (
    <section className="featured" id="marketplace">
      <div className="section-header">
        <span className="section-tag">TRENDING</span>
        <h2 className="section-title">Trending Parts Now</h2>
        <p className="section-sub">Hand-picked, high-demand parts from verified sellers worldwide</p>
      </div>
      <div className="featured__grid">
        {PRODUCTS.map(p => (
          <Link to={`/product/${p.id}`} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article className="product-card">
              <div className="product-card__img-wrap">
                <img src={p.image} alt={p.name} loading="lazy" />
                <button className="product-card__quick-view" aria-label="Quick view">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                </button>
                <span className={`product-card__badge product-card__badge--${p.badge}`}>{p.cond}</span>
              </div>
              <div className="product-card__body">
                <div className="product-card__name">{p.name}</div>
                <div className="product-card__compat">{p.compat}</div>
                <div className="product-card__footer">
                  <span className="product-card__price">{p.price}</span>
                  <span className="product-card__stars">{p.rating}</span>
                </div>
                <button className="product-card__cart-btn" onClick={(e) => handleAdd(e, p.id)}>＋ Add to Cart</button>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── SELLER HIGHLIGHT ─────────────────────────────────────────── */
function SellerHighlight() {
  const benefits = ['List your part in under 2 minutes', 'Reach thousands of active buyers', 'Secure, instant payments guaranteed'];
  return (
    <section className="seller-highlight" id="sell-parts">
      <div className="seller-highlight__inner">
        <div>
          <span className="section-tag seller-highlight__tag">FOR SELLERS</span>
          <h2 className="seller-highlight__title">Sell Your<br />Spare Parts</h2>
          <p className="seller-highlight__desc">
            Whether you're a dealer, workshop or just clearing your garage — MotoParts 2060 gives you the tools to list, sell and get paid faster than anywhere else.
          </p>
          <div className="seller-highlight__benefits">
            {benefits.map(b => (
              <div className="benefit" key={b}>
                <div className="benefit__icon">✓</div>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <Link className="btn btn--primary" to="/sell">Start Selling Free</Link>
        </div>
        <div className="seller-highlight__img">
          <img src="https://images.unsplash.com/photo-1535086065667-3adb824a8585?w=600&h=400&fit=crop&auto=format&q=80" alt="Sell your parts" />
        </div>
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ─────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { title: 'Search or List', desc: 'Browse millions of parts or list your spares in minutes with smart compatibility matching.' },
    { title: 'Connect Instantly', desc: 'Chat directly with verified buyers or sellers. No middlemen, no delays.' },
    { title: 'Complete Safely', desc: 'Pay or receive funds securely. Buyer protection on every transaction.' },
  ];
  return (
    <section className="how-it-works">
      <div className="section-header">
        <span className="section-tag">SIMPLE PROCESS</span>
        <h2 className="section-title">How It Works</h2>
        <p className="section-sub">Three steps to buy or sell — no friction, no fuss</p>
      </div>
      <div className="how-it-works__steps">
        {steps.map((s, i) => (
          <React.Fragment key={s.title}>
            <div className="step">
              <div className="step__num">{i + 1}</div>
              <div className="step__title">{s.title}</div>
              <div className="step__desc">{s.desc}</div>
            </div>
            {i < steps.length - 1 && <div className="step-connector" />}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/* ── FEATURED SELLERS ─────────────────────────────────────────── */
function FeaturedSellers() {
  return (
    <section className="sellers" id="deals">
      <div className="section-header">
        <span className="section-tag">TOP SELLERS</span>
        <h2 className="section-title">Featured Sellers</h2>
        <p className="section-sub">Trusted by thousands of riders — scroll to explore</p>
      </div>
      <div className="sellers__scroll-wrap">
        <div className="sellers__track">
          {SELLERS.map(s => (
            <div className="seller-card" key={s.name}>
              <img className="seller-card__avatar" src={s.avatar} alt={s.name} />
              <div className="seller-card__name">{s.name}</div>
              <div className="seller-card__stars">{s.rating}</div>
              <div className="seller-card__count">{s.parts}</div>
              <Link className="seller-card__link" to="/browse">View Profile →</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── TESTIMONIALS ─────────────────────────────────────────────── */
function Testimonials() {
  return (
    <section className="testimonials">
      <div className="section-header">
        <span className="section-tag">REVIEWS</span>
        <h2 className="section-title">Trusted by Riders Worldwide</h2>
        <p className="section-sub">Real stories from the MotoParts 2060 community</p>
      </div>
      <div className="testimonials__grid">
        {TESTIMONIALS.map(t => (
          <div className="testimonial-card" key={t.name}>
            <div className="testimonial-card__stars">{t.rating}</div>
            <p className="testimonial-card__quote">{t.quote}</p>
            <div className="testimonial-card__footer">
              <img className="testimonial-card__avatar" src={t.avatar} alt={t.name} />
              <div>
                <div className="testimonial-card__name">{t.name}</div>
                <div className="testimonial-card__bike">{t.bike}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── NEWSLETTER ───────────────────────────────────────────────── */
function Newsletter() {
  const [email, setEmail] = useState('');
  return (
    <section className="newsletter" id="support">
      <div className="newsletter__inner">
        <span className="section-tag">NEWSLETTER</span>
        <h2 className="newsletter__title">Stay Updated</h2>
        <p className="newsletter__desc">Get notified about new parts, flash deals, and community news. Zero spam, always.</p>
        <form className="newsletter__form" onSubmit={e => { e.preventDefault(); alert('Subscribed!'); setEmail(''); }}>
          <input className="newsletter__input" type="email" placeholder="Enter your email address…" value={email} onChange={e => setEmail(e.target.value)} required />
          <button type="submit" className="newsletter__btn">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

/* ── HOME PAGE ────────────────────────────────────────────────── */
export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedParts />
      <SellerHighlight />
      <HowItWorks />
      <FeaturedSellers />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
