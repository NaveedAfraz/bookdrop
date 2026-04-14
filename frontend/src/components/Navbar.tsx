import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Compass, Sparkles, Map, History, ShieldCheck, Menu, X } from 'lucide-react';
import CartDrawer from './CartDrawer';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { user, isAdmin, isAuthenticated, logout } = useAuth();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { to: '/marketplace', label: 'Marketplace' },
        { to: '/map', label: 'Atlas', icon: <Map size={14}/> },
        { to: '/time-machine', label: 'Eras', icon: <History size={14}/> },
        { to: '/discover', label: 'Swipe', icon: <Compass size={14}/> },
        { to: '/challenges', label: 'Challenges' },
        { to: '/quiz', label: 'Quiz', icon: <Sparkles size={14}/> },
    ];

    return (
        <nav className="sticky top-0 z-50 glass border-b border-border/50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-1 group">
                    <span className="text-2xl font-heading italic text-text tracking-tight">Book</span>
                    <span className="text-2xl font-heading italic text-secondary text-glow">drop</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-1">
                    {navLinks.map(link => (
                        <Link 
                            key={link.to} 
                            to={link.to} 
                            className="px-3.5 py-2 rounded-lg text-sm font-medium text-subtext hover:text-text hover:bg-surface/50 transition-all flex items-center gap-1.5"
                        >
                            {link.icon}{link.label}
                        </Link>
                    ))}
                    {isAdmin && (
                        <Link 
                            to="/admin" 
                            className="ml-2 px-3.5 py-1.5 rounded-lg text-sm font-bold text-secondary border border-secondary/20 bg-secondary/5 hover:bg-secondary/10 transition-all flex items-center gap-1.5"
                        >
                            <ShieldCheck size={14}/> Admin
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {isAuthenticated && (
                        <button 
                            onClick={() => setIsCartOpen(true)} 
                            className="relative p-2.5 rounded-xl text-subtext hover:text-text hover:bg-surface/50 transition-all group"
                        >
                            <ShoppingBag size={20} className="group-hover:scale-110 transition-transform"/>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full ring-2 ring-bg"></span>
                        </button>
                    )}
                    
                    {isAuthenticated && user ? (
                        <div className="flex items-center gap-3">
                            <Link to="/orders" className="flex items-center gap-2.5 group">
                                <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-secondary group-hover:glow-green transition-all">
                                     <User size={16} />
                                </div>
                                <span className="text-sm font-medium text-subtext group-hover:text-text hidden sm:inline transition-colors">{user.name}</span>
                            </Link>
                            <button 
                                onClick={handleLogout} 
                                className="text-xs text-subtext hover:text-error font-medium transition-colors px-2 py-1 rounded"
                            >
                                Exit
                            </button>
                        </div>
                    ) : (
                        <Link 
                            to="/login" 
                            className="bg-secondary text-primary px-5 py-2 rounded-lg font-bold text-sm hover:shadow-lg hover:shadow-secondary/20 transition-all"
                        >
                            Sign In
                        </Link>
                    )}

                    <button 
                        onClick={() => setMobileOpen(!mobileOpen)} 
                        className="lg:hidden p-2 text-subtext hover:text-text"
                    >
                        {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-border/50 glass px-6 py-4 space-y-1">
                    {navLinks.map(link => (
                        <Link 
                            key={link.to} 
                            to={link.to} 
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-3 rounded-lg text-sm font-medium text-subtext hover:text-text hover:bg-surface/50 transition-all"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </nav>
    );
};

export default Navbar;
