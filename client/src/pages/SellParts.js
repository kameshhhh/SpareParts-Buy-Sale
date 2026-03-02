import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CONDITIONS = ['New', 'Used', 'Refurbished'];

export default function SellParts() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [previews, setPreviews] = useState([]);

  const [form, setForm] = useState({
    name: '', description: '', price: '', mrp: '', category: '', condition: 'New',
    brand: '', compatibility: '', sellerName: '', sellerContact: '',
    features: '', specifications: '',
  });
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get('/api/categories').then(r => setCategories(r.data.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      if (form.mrp) fd.append('mrp', form.mrp);
      fd.append('category', form.category);
      fd.append('condition', form.condition);
      fd.append('brand', form.brand);
      fd.append('sellerName', form.sellerName);
      fd.append('sellerContact', form.sellerContact);

      // Parse comma-separated compatibility bikes
      if (form.compatibility) {
        fd.append('compatibility', JSON.stringify(form.compatibility.split(',').map(s => s.trim()).filter(Boolean)));
      }
      // Parse comma-separated features
      if (form.features) {
        fd.append('features', JSON.stringify(form.features.split(',').map(s => s.trim()).filter(Boolean)));
      }
      // Parse specifications (key:value pairs, one per line)
      if (form.specifications) {
        const specs = {};
        form.specifications.split('\n').forEach(line => {
          const [k, ...v] = line.split(':');
          if (k && v.length) specs[k.trim()] = v.join(':').trim();
        });
        fd.append('specifications', JSON.stringify(specs));
      }
      // Append images
      images.forEach(f => fd.append('images', f));

      const res = await axios.post('/api/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(res.data.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to list product');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="sell-page">
        <div className="sell-page__success">
          <div className="sell-page__success-icon">✓</div>
          <h2>Product Listed Successfully!</h2>
          <p>Your part "<strong>{success.name}</strong>" is now live on the marketplace.</p>
          <p className="sell-page__success-price">Listed at ₹{Number(success.price).toLocaleString('en-IN')}</p>
          <div className="sell-page__success-actions">
            <button className="btn btn--primary" onClick={() => navigate(`/product/${success.id}`)}>View Listing</button>
            <button className="btn btn--secondary" onClick={() => { setSuccess(null); setForm({ name: '', description: '', price: '', mrp: '', category: '', condition: 'New', brand: '', compatibility: '', sellerName: '', sellerContact: '', features: '', specifications: '' }); setImages([]); setPreviews([]); }}>List Another Part</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sell-page">
      <div className="sell-page__header">
        <h1>Sell Your Parts</h1>
        <p>Fill in the details below to list your motorcycle part on the marketplace.</p>
      </div>

      <form className="sell-page__form" onSubmit={handleSubmit}>
        <div className="sell-page__form-grid">
          {/* Left Column */}
          <div className="sell-page__form-left">
            <div className="form-group">
              <label>Product Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Brembo GP4-RX Brake Caliper" required />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your part in detail — condition, history, why selling…" rows={4} required />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 5999" required min="1" />
              </div>
              <div className="form-group">
                <label>MRP (₹) <span className="form-hint">Optional</span></label>
                <input type="number" name="mrp" value={form.mrp} onChange={handleChange} placeholder="e.g. 7999" min="1" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Condition *</label>
                <select name="condition" value={form.condition} onChange={handleChange} required>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Brand</label>
              <input type="text" name="brand" value={form.brand} onChange={handleChange} placeholder="e.g. Brembo, Akrapovic, OEM" />
            </div>

            <div className="form-group">
              <label>Compatible Bikes <span className="form-hint">Comma-separated</span></label>
              <input type="text" name="compatibility" value={form.compatibility} onChange={handleChange} placeholder="e.g. Honda CBR600RR, Yamaha R1, KTM Duke 390" />
            </div>

            <div className="form-group">
              <label>Key Features <span className="form-hint">Comma-separated</span></label>
              <input type="text" name="features" value={form.features} onChange={handleChange} placeholder="e.g. CNC machined, Lightweight, Easy install" />
            </div>

            <div className="form-group">
              <label>Specifications <span className="form-hint">One per line — Key: Value</span></label>
              <textarea name="specifications" value={form.specifications} onChange={handleChange} placeholder={"Material: Aluminum\nWeight: 420g\nSize: 300mm"} rows={4} />
            </div>
          </div>

          {/* Right Column */}
          <div className="sell-page__form-right">
            <div className="form-group">
              <label>Product Images <span className="form-hint">Up to 5 images (JPEG, PNG, WebP)</span></label>
              <div className="sell-page__upload-area" onClick={() => document.getElementById('file-input').click()}>
                {previews.length > 0 ? (
                  <div className="sell-page__previews">
                    {previews.map((src, i) => <img key={i} src={src} alt={`Preview ${i + 1}`} />)}
                  </div>
                ) : (
                  <div className="sell-page__upload-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    <p>Click to upload images</p>
                    <span>JPEG, PNG or WebP — Max 5MB each</span>
                  </div>
                )}
                <input id="file-input" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageChange} style={{ display: 'none' }} />
              </div>
            </div>

            <div className="sell-page__seller-info">
              <h3>Seller Information</h3>
              <div className="form-group">
                <label>Your Name / Shop Name *</label>
                <input type="text" name="sellerName" value={form.sellerName} onChange={handleChange} placeholder="e.g. MotoWorks Pro" required />
              </div>
              <div className="form-group">
                <label>Contact Number *</label>
                <input type="tel" name="sellerContact" value={form.sellerContact} onChange={handleChange} placeholder="e.g. +91 98765 43210" required />
              </div>
            </div>
          </div>
        </div>

        <div className="sell-page__submit">
          <button type="submit" className="btn btn--primary btn--large" disabled={submitting}>
            {submitting ? 'Listing…' : 'List My Part'}
          </button>
          <p className="sell-page__terms">By listing, you agree to our Terms of Service. Listing is free — no hidden charges.</p>
        </div>
      </form>
    </div>
  );
}
