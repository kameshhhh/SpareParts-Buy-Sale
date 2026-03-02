import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const CONDITIONS = ['New', 'Used', 'Refurbished'];
const SORT_OPTIONS = [
  { value: 'rating', label: 'Best Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
];

export default function BrowseParts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const { addToCart } = useCart();

  // Filter state from URL
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const condition = searchParams.get('condition') || '';
  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || 'rating';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = Number(searchParams.get('page')) || 1;

  const [localSearch, setLocalSearch] = useState(search);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  // Keep local inputs in sync when URL params change (e.g. Clear All)
  useEffect(() => { setLocalSearch(search); }, [search]);
  useEffect(() => { setLocalMin(minPrice); }, [minPrice]);
  useEffect(() => { setLocalMax(maxPrice); }, [maxPrice]);

  const updateFilter = useCallback((key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const params = { sort, page, limit: 12 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (condition) params.condition = condition;
    if (brand) params.brand = brand;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    axios.get('/api/products', { params })
      .then(res => { setProducts(res.data.data); setTotal(res.data.total); setPages(res.data.pages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, condition, brand, sort, minPrice, maxPrice, page]);

  // Fetch filter options
  useEffect(() => {
    axios.get('/api/categories').then(r => setCategories(r.data.data)).catch(() => {});
    axios.get('/api/products/brands').then(r => setBrands(r.data.data)).catch(() => {});
  }, []);

  const handleSearch = (e) => { e.preventDefault(); updateFilter('search', localSearch); };
  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams);
    if (localMin) params.set('minPrice', localMin); else params.delete('minPrice');
    if (localMax) params.set('maxPrice', localMax); else params.delete('maxPrice');
    params.delete('page');
    setSearchParams(params);
  };
  const handleAdd = async (e, id) => { e.preventDefault(); e.stopPropagation(); const ok = await addToCart(id); if (ok) alert('Added to cart!'); };

  const formatPrice = (p) => '₹' + p.toLocaleString('en-IN');

  return (
    <div className="browse-page">
      {/* Search Bar */}
      <div className="browse-page__header">
        <h1>Browse Parts</h1>
        <form onSubmit={handleSearch} className="browse-page__search-bar">
          <input type="text" placeholder="Search parts, brands, bikes…" value={localSearch} onChange={e => setLocalSearch(e.target.value)} />
          <button type="submit">Search</button>
        </form>
        {search && <p className="browse-page__result-info">Showing results for "<strong>{search}</strong>" — {total} found</p>}
      </div>

      <div className="browse-page__body">
        {/* Sidebar Filters */}
        <aside className="browse-page__filters">
          <h3>Filters</h3>

          {/* Category */}
          <div className="filter-group">
            <h4>Category</h4>
            <select value={category} onChange={e => updateFilter('category', e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.slug} value={c.slug}>{c.name} ({c.count})</option>)}
            </select>
          </div>

          {/* Condition */}
          <div className="filter-group">
            <h4>Condition</h4>
            <select value={condition} onChange={e => updateFilter('condition', e.target.value)}>
              <option value="">All Conditions</option>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Brand */}
          <div className="filter-group">
            <h4>Brand</h4>
            <select value={brand} onChange={e => updateFilter('brand', e.target.value)}>
              <option value="">All Brands</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Price Range */}
          <div className="filter-group">
            <h4>Price Range (₹)</h4>
            <div className="filter-price-inputs">
              <input type="number" placeholder="Min" value={localMin} onChange={e => setLocalMin(e.target.value)} />
              <span>–</span>
              <input type="number" placeholder="Max" value={localMax} onChange={e => setLocalMax(e.target.value)} />
            </div>
            <button className="filter-apply-btn" onClick={handlePriceApply}>Apply</button>
          </div>

          {/* Clear All */}
          {(category || condition || brand || minPrice || maxPrice || search) && (
            <button className="filter-clear-all" onClick={() => setSearchParams({})}>Clear All Filters</button>
          )}
        </aside>

        {/* Product Grid */}
        <div className="browse-page__main">
          <div className="browse-page__toolbar">
            <span>{total} products found</span>
            <select value={sort} onChange={e => updateFilter('sort', e.target.value)}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="browse-page__loading">Loading products…</div>
          ) : products.length === 0 ? (
            <div className="browse-page__empty">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <>
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

              {/* Pagination */}
              {pages > 1 && (
                <div className="browse-page__pagination">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} className={`pagination-btn ${p === page ? 'active' : ''}`} onClick={() => updateFilter('page', String(p))}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
