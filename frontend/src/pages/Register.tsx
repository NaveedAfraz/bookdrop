import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, Wand2, Eye, EyeOff } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/api/auth/register', { name, email, password });
            toast.success('Ritual initiated. Now enter the sanctum.');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Ritual failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 mesh-hero grain">
             {/* Decorative orbs */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full bg-card border border-border p-10 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 text-secondary/5 rotate-12 pointer-events-none">
                     <Wand2 size={200} />
                </div>

                <div className="text-center mb-10 relative z-10">
                    <div className="w-16 h-16 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-center text-secondary mx-auto mb-6 glow-green group-hover:scale-110 transition-transform duration-700">
                        <Sparkles size={28} />
                    </div>
                    <h1 className="text-3xl font-heading italic text-text mb-2">Initiate Ritual</h1>
                    <p className="text-subtext italic text-sm">Join the global archipelago of readers.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-subtext uppercase tracking-widest ml-1">Reader Archetype</label>
                        <div className="relative group/input">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext/50 group-focus-within/input:text-secondary transition-colors"/>
                            <input 
                                required 
                                type="text" 
                                className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-4 text-sm text-text focus:outline-none focus:border-secondary/40 transition-colors placeholder:text-subtext/30" 
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-subtext uppercase tracking-widest ml-1">Archive Identity</label>
                        <div className="relative group/input">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext/50 group-focus-within/input:text-secondary transition-colors"/>
                            <input 
                                required 
                                type="email" 
                                className="w-full bg-surface border border-border rounded-xl pl-11 pr-4 py-4 text-sm text-text focus:outline-none focus:border-secondary/40 transition-colors placeholder:text-subtext/30" 
                                placeholder="oracle@pageverse.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-subtext uppercase tracking-widest ml-1">Secret Key</label>
                        <div className="relative group/input">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtext/50 group-focus-within/input:text-secondary transition-colors"/>
                            <input 
                                required 
                                type={showPassword ? "text" : "password"} 
                                className="w-full bg-surface border border-border rounded-xl pl-11 pr-12 py-4 text-sm text-text focus:outline-none focus:border-secondary/40 transition-colors placeholder:text-subtext/30" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-subtext/50 hover:text-secondary transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-secondary text-primary py-4 rounded-xl font-bold text-sm hover:glow-green transition-all shadow-xl disabled:opacity-40 flex items-center justify-center gap-2 group mt-8"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18}/> : <>Become Steward <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/></>}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-border text-center relative z-10">
                    <p className="text-subtext text-xs mb-4">Already initiated?</p>
                    <Link to="/login" className="inline-flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest hover:underline group">
                        Enter Sanctum <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
