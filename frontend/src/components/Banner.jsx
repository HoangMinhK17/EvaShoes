import '../styles/banner.css';

export default function Banner() {
  return (
    <section 
      className="banner" 
      aria-label="Hero banner"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1526178612872-31a3b9b5b4b8?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=9c8f9f1a1c8b7d6e5f3b2a1c')",
      }}
    >
      <div className="banner-content container">
        <div className="banner-text">
          <span className="banner-subtitle">OUR ALL-TIME FAVOURITES</span>
          <h2 className="banner-title">SUMMER 2026:<br />PASTEL PALETTE</h2>
          <button className="btn btn-primary">KHÁM PHÁ NGAY</button>
        </div>
        <div className="banner-image">
          {/* decorative image intentionally hidden; background-image used */}
          <img src="/banner-placeholder.png" alt="Spring shoes" />
        </div>
      </div>
    </section>
  );
}
