import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from '../cart/CartDrawer';
import PromoPopup from './PromoPopup';

const MainLayout: React.FC = () => {
  return (
    <>
      <Navbar />
      <CartDrawer />
      <Outlet />
      <PromoPopup />
      <Footer />
    </>
  );
};

export default MainLayout;
