import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Ecommerce from './pages/ecommerce';

export default function AppRouter() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Ecommerce />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
