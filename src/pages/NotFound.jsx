import { Link } from 'react-router-dom';
import PageStyles from '../components/PageStyles.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';

export default function NotFound() {
  return (
    <>
      <PageStyles page="refer" />
      <Navbar solid />
      <section className="refer-confirm">
        <div className="refer-hero-content">
          <h1 className="refer-title">Page not found</h1>
          <p className="refer-subtitle">The page you’re looking for doesn’t exist or has moved.</p>
          <Link to="/" className="refer-btn">GO BACK HOME</Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
