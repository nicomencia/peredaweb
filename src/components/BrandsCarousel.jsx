import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './BrandsCarousel.css';

export default function BrandsCarousel() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetchBrands();
  }, []);

  async function fetchBrands() {
    const { data } = await supabase
      .from('brands')
      .select('*')
      .order('display_order', { ascending: true });
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
