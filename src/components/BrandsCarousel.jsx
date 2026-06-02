import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './BrandsCarousel.css';

export default function BrandsCarousel({ category = null }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchBrands();
  }, [category]);

  async function fetchBrands() {
    let query = supabase
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
      <div className="brands-carousel-track-wrapper">
        <div className="brands-carousel-track">
          {duplicated.map((brand, i) => (
            <div key={`${brand.id}-${i}`} className="brands-carousel-item">
              <img src={brand.logo_url} alt={brand.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
