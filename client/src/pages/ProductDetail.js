import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`)
      .then(res => { setProduct(res.data.data); setRelated(res.data.related); setSelectedImage(0); setQuantity(1); })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  const formatPrice = (p) => '₹' + p.toLocaleString('en-IN');

  const handleAddToCart = async () => {
    const ok = await addToCart(product.id, quantity);
    if (ok) alert('Added to cart!');
  };

  const handleBuyNow = async () => {
    const ok = await addToCart(product.id, quantity);
    if (ok) navigate('/checkout');
  };

  if (loading) return <div className="product-detail"><div className="browse-page__loading">Loading product…</div></div>;
  if (!product) return <div className="product-detail"><div className="browse-page__empty"><h2>Product Not Found</h2><Link to="/browse" className="btn btn--primary">Browse Parts</Link></div></div>;

  const discount = product.mrp > product.price ? Math.round((1 - product.price / product.mrp) * 100) : 0;

  return (
    <div className="product-detail">
      {/* Breadcrumb */}
      <div className="product-detail__breadcrumb">
        <Link to="/">Home</Link> / <Link to="/browse">Parts</Link> / <Link to={`/category/${product.category}`}>{product.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</Link> / <span>{product.name}</span>
      </div>

      <div className="product-detail__main">
        {/* Image Gallery */}
        <div className="product-detail__gallery">
          <div className="product-detail__main-image">
            <img src={product.images[selectedImage]} alt={product.name} />
            <span className={`product-card__badge product-card__badge--${product.condition.toLowerCase() === 'new' ? 'new' : product.condition.toLowerCase() === 'used' ? 'used' : 'refurb'}`}>{product.condition}</span>
          </div>
          <div className="product-detail__thumbnails">
            {product.images.map((img, i) => (
              <img key={i} src={img} alt={`${product.name} ${i + 1}`} className={i === selectedImage ? 'active' : ''} onClick={() => setSelectedImage(i)} />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="product-detail__info">
          <span className="product-detail__brand">{product.brand}</span>
          <h1 className="product-detail__name">{product.name}</h1>

          <div className="product-detail__rating">
            <span className="product-detail__stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
            <span className="product-detail__rating-num">{product.rating}</span>
            <span className="product-detail__reviews">({product.reviewCount} reviews)</span>
          </div>

          <div className="product-detail__pricing">
            <span className="product-detail__price">{formatPrice(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="product-detail__mrp">{formatPrice(product.mrp)}</span>
                <span className="product-detail__discount">{discount}% off</span>
              </>
            )}
          </div>
          <p className="product-detail__tax-info">Inclusive of all taxes</p>

          {/* Availability */}
          <div className="product-detail__availability">
            {product.inStock ? (
              <span className="product-detail__in-stock">✓ In Stock</span>
            ) : (
              <span className="product-detail__out-stock">✗ Out of Stock</span>
            )}
          </div>

          {/* Compatibility */}
          <div className="product-detail__section">
            <h3>Compatible Bikes</h3>
            <div className="product-detail__compat-tags">
              {product.compatibility.map(bike => <span key={bike} className="compat-tag">{bike}</span>)}
            </div>
          </div>

          {/* Key Features */}
          {product.features && product.features.length > 0 && (
            <div className="product-detail__section">
              <h3>Key Features</h3>
              <ul className="product-detail__features">
                {product.features.map((f, i) => <li key={i}>✓ {f}</li>)}
              </ul>
            </div>
          )}

          {/* Quantity + Cart/Buy */}
          <div className="product-detail__actions">
            <div className="product-detail__qty">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
            <button className="btn btn--primary btn--large" onClick={handleAddToCart} disabled={!product.inStock}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              Add to Cart
            </button>
            <button className="btn btn--buy btn--large" onClick={handleBuyNow} disabled={!product.inStock}>Buy Now</button>
          </div>

          {/* Seller Info */}
          {product.seller && (
            <div className="product-detail__seller">
              <h4>Sold by</h4>
              <div className="product-detail__seller-info">
                <span className="product-detail__seller-name">{product.seller.name}</span>
                <span className="product-detail__seller-rating">★ {product.seller.rating}</span>
              </div>
            </div>
          )}

          {/* Delivery Info */}
          <div className="product-detail__delivery">
            <div className="delivery-item"><span className="delivery-icon">🚚</span><div><strong>Free Delivery</strong><p>Orders above ₹999</p></div></div>
            <div className="delivery-item"><span className="delivery-icon">↩️</span><div><strong>7 Day Returns</strong><p>Easy return policy</p></div></div>
            <div className="delivery-item"><span className="delivery-icon">🔒</span><div><strong>Secure Payment</strong><p>100% protected</p></div></div>
          </div>
        </div>
      </div>

      {/* Tabs: Description / Specifications / Reviews */}
      <div className="product-detail__tabs">
        <div className="product-detail__tab-nav">
          {['description', 'specifications', 'reviews'].map(tab => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="product-detail__tab-content">
          {activeTab === 'description' && (
            <div className="tab-panel"><p>{product.description}</p></div>
          )}
          {activeTab === 'specifications' && (
            <div className="tab-panel">
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                <table className="spec-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <tr key={key}><td>{key}</td><td>{val}</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>No specifications available.</p>}
            </div>
          )}
          {activeTab === 'reviews' && (
            <div className="tab-panel">
              <div className="reviews-summary">
                <div className="reviews-summary__score">
                  <span className="reviews-summary__num">{product.rating}</span>
                  <span className="reviews-summary__stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5 - Math.round(product.rating))}</span>
                  <span>{product.reviewCount} reviews</span>
                </div>
                <p className="reviews-summary__note">Customer reviews are coming soon. This product has {product.reviewCount} ratings from verified buyers.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="product-detail__related">
          <h2>You May Also Like</h2>
          <div className="product-detail__related-grid">
            {related.map(p => (
              <Link to={`/product/${p.id}`} key={p.id} className="browse-card">
                <div className="browse-card__img"><img src={p.images[0]} alt={p.name} loading="lazy" /></div>
                <div className="browse-card__body">
                  <div className="browse-card__brand">{p.brand}</div>
                  <div className="browse-card__name">{p.name}</div>
                  <div className="browse-card__pricing">
                    <span className="browse-card__price">{formatPrice(p.price)}</span>
                    {p.mrp > p.price && <span className="browse-card__mrp">{formatPrice(p.mrp)}</span>}
                  </div>
                  <div className="browse-card__rating">{'★'.repeat(Math.round(p.rating))}{'☆'.repeat(5 - Math.round(p.rating))}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
