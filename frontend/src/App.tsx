import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import BookListing from './pages/BookListing';
import BookDetail from './pages/BookDetail';
import ChapterReader from './pages/ChapterReader';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import SwipePage from './pages/SwipePage';
import Wishlist from './pages/Wishlist';
import QuizPage from './pages/QuizPage';
import SellBook from './pages/SellBook';
import Marketplace from './pages/Marketplace';
import JourneyTimeline from './pages/JourneyTimeline';
import ChallengesPage from './pages/ChallengesPage';
import BundlesPage from './pages/BundlesPage';
import RoomInterface from './pages/RoomInterface';
import WorldMap from './pages/WorldMap';
import TimeMachine from './pages/TimeMachine';
import AdminDashboard from './pages/AdminDashboard';
import CourseViewer from './pages/CourseViewer';
import Login from './pages/Login';
import Register from './pages/Register';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen flex flex-col bg-bg font-body text-text relative overflow-x-hidden grain">
        <Navbar />
        <main className="flex-1">
          <Toaster position="bottom-right" />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<BookListing />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/chapters/:bookId/:chapterNum" element={<ChapterReader />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/map" element={<WorldMap />} />
            <Route path="/time-machine" element={<TimeMachine />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/bundles" element={<BundlesPage />} />

            {/* Protected — logged-in users only */}
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            <Route path="/discover" element={<ProtectedRoute><SwipePage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
            <Route path="/sell" element={<ProtectedRoute><SellBook /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
            <Route path="/journey/:shBookId" element={<ProtectedRoute><JourneyTimeline /></ProtectedRoute>} />
            <Route path="/challenges" element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
            <Route path="/rooms/:roomId" element={<ProtectedRoute><RoomInterface /></ProtectedRoute>} />
            <Route path="/course/:bookId" element={<ProtectedRoute><CourseViewer /></ProtectedRoute>} />

            {/* Admin only */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
        <footer className="border-t border-border bg-card py-10 text-center">
          <div className="container mx-auto px-6">
            <span className="text-lg font-heading italic text-text">Book</span>
            <span className="text-lg font-heading italic text-secondary">drop</span>
            <p className="text-xs text-subtext mt-2">&copy; {new Date().getFullYear()} Bookdrop. Every book has a journey.</p>
          </div>
        </footer>
      </div>
    </Router>
    </AuthProvider>
  );
};

export default App;
