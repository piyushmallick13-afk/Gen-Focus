/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import { CartProvider } from './contexts/CartContext';
import Cart from './components/Cart';

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Cart />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
