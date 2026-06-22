import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import './BrandsCarousel.css';

export default function BrandsCarousel({ category = null, eyebrow = null, title = null }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchBrands();
  }, [category]);

  async function fetchBrands() {
    let query = api
      .from('brands')
      .select('*')
      .order('display_order', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data } = await query;
    if (data) setBrands(data);
  }

  if (brands.length === 0) return null;

  const duplicated = [...brands, ...brands];

  return (
    <div className="brands-carousel">
      {(eyebrow || title) && (
        <div className="brands-carousel-header">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          {title && <h2 className="brands-carousel-title">{title}</h2>}
        </div>
      )}
      <div className="brands-carousel-track-wrapper">
        <div className="brands-carousel-track">
          {duplicated.map((brand, i) => (
            <div key={`${brand.id}-${i}`} className="brands-carousel-item">
              <img src={brand.logo_url} alt={brand.name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
