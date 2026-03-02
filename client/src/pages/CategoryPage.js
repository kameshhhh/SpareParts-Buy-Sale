import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'newest', label: 'Newest First' },
];

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('');
  const [condition, setCondition] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (sort) params.sort = sort;
    if (condition) params.condition = condition;

    axios.get(`/api/categories/${slug}/products`, { params })
      .then(res => { setProducts(res.data.data); setCategory(res.data.category); })
      .catch(() => setCategory(null))
      .finally(() => setLoading(false));
  }, [slug, sort, condition]);

  const formatPrice = (p) => '₹' + p.toLocaleString('en-IN');

  const handleAdd = async (e, id) => { e.preventDefault(); e.stopPropagation(); const ok = await addToCart(id); if (ok) alert('Added to cart!'); };

  if (!loading && !category) {
    return (
      <div className="category-page">
        <div className="browse-page__empty">
          <h2>Category Not Found</h2>
          <p>The category you're looking for doesn't exist.</p>
          <Link to="/browse" className="btn btn--primary">Browse All Parts</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {category && (
        <div className="category-page__header">
          <h1>{category.name}</h1>
          <p>{category.description}</p>
          <span className="category-page__count">{products.length} products available</span>
        </div>
      )}

      <div className="category-page__toolbar">
        <div className="category-page__filter-row">
          <select value={condition} onChange={e => setCondition(e.target.value)}>
            <option value="">All Conditions</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Refurbished">Refurbished</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="browse-page__loading">Loading products…</div>
      ) : products.length === 0 ? (
        <div className="browse-page__empty">
          <h3>No products in this category yet</h3>
          <Link to="/sell" className="btn btn--primary">Be the first to list!</Link>
        </div>
      ) : (
        <div className="browse-page__grid">
          {products.map(p => (
            <Link to={`/product/${p.id}`} key={p.id} className="browse-card">
              <div className="browse-card__img">
                <img src={p.images[0]} alt={p.name} loading="lazy" />
                <span className={`product-card__badge product-card__badge--${p.condition.toLowerCase() === 'new' ? 'new' : p.condition.toLowerCase() === 'used' ? 'used' : 'refurb'}`}>{p.condition}</span>
              </div>
              <div className="browse-card__body">
                <div className="browse-card__brand">{p.brand}</div>
                <div className="browse-card__name">{p.name}</div>
                <div className="browse-card__compat">{p.compatibility[0]}</div>
                <div className="browse-card__pricing">
                  <span className="browse-card__price">{formatPrice(p.price)}</span>
                  {p.mrp > p.price && <span className="browse-card__mrp">{formatPrice(p.mrp)}</span>}
                  {p.mrp > p.price && <span className="browse-card__discount">{Math.round((1 - p.price / p.mrp) * 100)}% off</span>}
                </div>
                <div className="browse-card__rating">{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))} <span>({p.reviewCount})</span></div>
                <button className="browse-card__cart-btn" onClick={(e) => handleAdd(e, p.id)}>Add to Cart</button>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
