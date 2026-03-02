import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { cartCount } = useCart();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setMenuOpen(false);
    }
  };

  const links = [
    { label: 'Marketplace', to: '/browse' },
    { label: 'Categories', to: '/browse' },
    { label: 'Sell Parts', to: '/sell' },
    { label: 'Deals', to: '/browse?sort=price-asc' },
    { label: 'Support', to: '/#support' },
    { label: 'About', to: '/about' },
  ];

  return (
    <nav className="nav" style={scrolled ? { boxShadow: '0 4px 20px rgba(0,0,0,0.08)' } : {}}>
      <div className="nav__inner">
        <Link className="nav__logo" to="/">MotoParts 2060</Link>

        <ul className="nav__links">
          {links.map(l => (
            <li key={l.label}><Link className="nav__link" to={l.to}>{l.label}</Link></li>
          ))}
        </ul>

        <form className="nav__search" onSubmit={handleSearch}>
          <svg className="nav__search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input className="nav__search-input" type="text" placeholder="Search parts, brands, bikes…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </form>

        <div className="nav__actions">
          <Link className="nav__icon-btn" to="/sell" aria-label="Sell">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
          <Link className="nav__icon-btn" to="/cart" aria-label="Cart">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            <span className="nav__badge">{cartCount}</span>
          </Link>
          <button className="nav__hamburger" aria-label="Menu" onClick={() => setMenuOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div className={`nav__mobile-menu${menuOpen ? ' is-open' : ''}`}>
        {links.map(l => (
          <Link key={l.label} className="nav__mobile-link" to={l.to} onClick={() => setMenuOpen(false)}>{l.label}</Link>
        ))}
      </div>
    </nav>
  );
}
