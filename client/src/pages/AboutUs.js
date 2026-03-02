import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero */}
      <div className="about-page__hero">
        <span className="section-tag">ABOUT US</span>
        <h1>Shalini Spare Parts</h1>
        <p>India's most trusted motorcycle spare parts marketplace — powered by passion, built for riders.</p>
      </div>

      <div className="about-page__content">
        {/* Our Story */}
        <section className="about-page__section">
          <h2>Our Story</h2>
          <p>
            <strong>Shalini Spare Parts</strong> was born out of a rider's frustration. Finding genuine motorcycle
            spare parts at fair prices was always a challenge — endless dealer visits, uncertain quality, and inflated
            margins. In 2024, <strong>Shalini</strong>, a passionate motorcycle enthusiast and entrepreneur, decided
            to change that forever.
          </p>
          <p>
            What started as a small initiative to help fellow riders quickly grew into <strong>MotoParts 2060</strong> —
            a full-fledged online marketplace connecting buyers and sellers of motorcycle parts across India. Today,
            we host thousands of parts from verified sellers, serving riders in 180+ countries.
          </p>
        </section>

        {/* Founder */}
        <div className="about-page__founder">
          <div className="about-page__founder-avatar">
            <img src="/shalini-ceo.jpg" alt="Shalini - Founder & CEO" style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '50%' }} />
          </div>
          <div className="about-page__founder-info">
            <h3>Shalini</h3>
            <span className="about-page__founder-role">Founder & CEO, Shalini Spare Parts</span>
            <p>
              "I started Shalini Spare Parts because I believe every rider deserves access to genuine parts
              at honest prices. Our marketplace is built on trust, speed, and community. Whether you're rebuilding
              a classic or upgrading your sport bike, we've got you covered."
            </p>
          </div>
        </div>

        {/* Mission */}
        <section className="about-page__section">
          <h2>Our Mission</h2>
          <p>
            To be India's most trusted and comprehensive motorcycle spare parts marketplace —
            empowering riders to find any part, for any bike, at the best price, delivered with speed and
            safety guaranteed.
          </p>
        </section>

        {/* Vision */}
        <section className="about-page__section">
          <h2>Our Vision</h2>
          <p>
            A world where no rider is ever stranded because of an unavailable spare part. We envision
            a global network of sellers and buyers, connected instantly, transacting securely, and riding
            confidently.
          </p>
        </section>

        {/* Stats */}
        <div className="about-page__stats">
          <div className="about-page__stat">
            <span className="about-page__stat-num">48+</span>
            <span className="about-page__stat-label">Products Listed</span>
          </div>
          <div className="about-page__stat">
            <span className="about-page__stat-num">8</span>
            <span className="about-page__stat-label">Categories</span>
          </div>
          <div className="about-page__stat">
            <span className="about-page__stat-num">6</span>
            <span className="about-page__stat-label">Verified Sellers</span>
          </div>
          <div className="about-page__stat">
            <span className="about-page__stat-num">180+</span>
            <span className="about-page__stat-label">Countries Served</span>
          </div>
        </div>

        {/* Why Choose Us */}
        <section className="about-page__section">
          <h2>Why Choose Shalini Spare Parts?</h2>
          <div className="about-page__values-grid">
            <div className="about-page__value">
              <span className="about-page__value-icon">✓</span>
              <h4>Verified Sellers</h4>
              <p>Every seller on our platform is verified. We ensure quality and authenticity for every transaction.</p>
            </div>
            <div className="about-page__value">
              <span className="about-page__value-icon">🚚</span>
              <h4>Fast Delivery</h4>
              <p>Free shipping on orders above ₹999. Most orders delivered within 3-5 business days across India.</p>
            </div>
            <div className="about-page__value">
              <span className="about-page__value-icon">🔒</span>
              <h4>Secure Payments</h4>
              <p>100% payment protection with multiple payment options including UPI, cards, and COD.</p>
            </div>
            <div className="about-page__value">
              <span className="about-page__value-icon">↩️</span>
              <h4>Easy Returns</h4>
              <p>7-day hassle-free return policy. Your satisfaction is our top priority.</p>
            </div>
            <div className="about-page__value">
              <span className="about-page__value-icon">🏍️</span>
              <h4>Rider Community</h4>
              <p>Built by riders, for riders. We understand your needs because we share your passion.</p>
            </div>
            <div className="about-page__value">
              <span className="about-page__value-icon">💰</span>
              <h4>Best Prices</h4>
              <p>Direct from sellers means no middlemen. Get the best prices on genuine motorcycle parts.</p>
            </div>
          </div>
        </section>

        {/* Company Details */}
        <section className="about-page__section">
          <h2>Company Details</h2>
          <div className="about-page__company-info">
            <div className="about-page__info-row">
              <span className="about-page__info-label">Company Name</span>
              <span className="about-page__info-value">Shalini Spare Parts</span>
            </div>
            <div className="about-page__info-row">
              <span className="about-page__info-label">Marketplace Brand</span>
              <span className="about-page__info-value">MotoParts 2060</span>
            </div>
            <div className="about-page__info-row">
              <span className="about-page__info-label">Founded</span>
              <span className="about-page__info-value">2024</span>
            </div>
            <div className="about-page__info-row">
              <span className="about-page__info-label">Founder</span>
              <span className="about-page__info-value">Shalini</span>
            </div>
            <div className="about-page__info-row">
              <span className="about-page__info-label">Industry</span>
              <span className="about-page__info-value">Motorcycle Spare Parts Marketplace</span>
            </div>
            <div className="about-page__info-row">
              <span className="about-page__info-label">Headquarters</span>
              <span className="about-page__info-value">India</span>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="about-page__contact">
          <h2>Get in Touch</h2>
          <p>Have questions or want to partner with us? We'd love to hear from you.</p>
          <div className="about-page__contact-grid">
            <div className="about-page__contact-item">
              <strong>📧 Email</strong>
              <span>support@shalinispareparts.com</span>
            </div>
            <div className="about-page__contact-item">
              <strong>📞 Phone</strong>
              <span>+91 98765 43210</span>
            </div>
            <div className="about-page__contact-item">
              <strong>📍 Location</strong>
              <span>India</span>
            </div>
          </div>
          <div className="about-page__cta">
            <Link to="/browse" className="btn btn--primary">Browse Parts</Link>
            <Link to="/sell" className="btn btn--secondary">Start Selling</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
