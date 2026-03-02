import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const cols = {
    Company: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/' },
      { label: 'Press', to: '/' },
      { label: 'Blog', to: '/' },
    ],
    Support: [
      { label: 'Help Center', to: '/' },
      { label: 'Safety Guide', to: '/' },
      { label: 'Returns', to: '/' },
      { label: 'Contact', to: '/' },
    ],
    Legal: [
      { label: 'Terms of Service', to: '/' },
      { label: 'Privacy Policy', to: '/' },
      { label: 'Cookie Policy', to: '/' },
      { label: 'Compliance', to: '/' },
    ],
  };

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div>
          <Link to="/" className="footer__logo">MotoParts 2060</Link>
          <p className="footer__desc">The universe's largest marketplace for motorcycle parts. Built for speed, trusted by riders.</p>
          <div className="footer__social">
            {['𝕏', 'in', 'f', 'ig'].map(icon => (
              <a key={icon} className="footer__social-icon" href="#connect" aria-label={icon}>{icon}</a>
            ))}
          </div>
        </div>
        {Object.entries(cols).map(([col, links]) => (
          <div key={col}>
            <div className="footer__col-title">{col}</div>
            <ul className="footer__col-links">
              {links.map(l => <li key={l.label}><Link className="footer__col-link" to={l.to}>{l.label}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="footer__bottom">
        <span>© 2026 MotoParts 2060. All rights reserved.</span>
        <span className="footer__tagline">Made for riders, by riders. 🏍️</span>
      </div>
    </footer>
  );
}
