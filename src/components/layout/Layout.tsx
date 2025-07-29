import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartSlideOver from '@/components/cart/CartSlideOver';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <Footer />
      
      {/* Cart slide-over */}
      <CartSlideOver />
    </div>
  );
};

export default Layout; 