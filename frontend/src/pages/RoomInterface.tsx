import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Send, Users, Lock, ChevronLeft, Loader2 } from 'lucide-react';
import api from '../lib/api';

const RoomInterface: React.FC = () => {
    const { roomId } = useParams();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputMsg, setInputMsg] = useState('');
    const [hasAccess, setHasAccess] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [roomId]);

    const fetchData = async () => {
        try {
            const response = await api.get(`/api/rooms/${roomId}/messages`);
            setMessages(response.data);
        } catch (error: any) {
            if (error.response?.data?.error === 'BUY_NOW_PROMPT') setHasAccess(false);
        } finally { setLoading(false); }
    };

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/api/rooms/${roomId}/messages`);
            setMessages(response.data);
        } catch { /* silent */ }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMsg.trim()) return;
        setMessages([...messages, { id: Date.now(), user_name: 'You', message: inputMsg }]);
        setInputMsg('');
    };

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-secondary" size={36}/></div>;

    if (!hasAccess) {
        return (
            <div className="fixed inset-0 z-50 bg-bg flex items-center justify-center p-6">
                <div className="bg-card border border-border max-w-md w-full rounded-2xl p-10 text-center">
                    <div className="w-16 h-16 bg-surface border border-border rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Lock className="text-secondary" size={28} />
                    </div>
                    <h2 className="text-2xl font-heading italic text-text mb-3">Members Only</h2>
                    <p className="text-subtext text-sm mb-8">Purchase this book to join the discussion room.</p>
                    <div className="flex flex-col gap-3">
                        <Link to="/books" className="w-full bg-secondary text-primary py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-secondary/20 transition-all">Buy Now to Join</Link>
                        <Link to="/" className="w-full text-subtext font-medium py-3 rounded-xl hover:text-text transition-all">Cancel</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8 max-w-4xl h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border shrink-0">
                <Link to="/" className="p-2 hover:bg-surface rounded-lg text-subtext transition-colors"><ChevronLeft size={18}/></Link>
                <div>
                    <h1 className="text-xl font-heading italic text-text">Read Together</h1>
                    <div className="flex items-center gap-1.5 text-[10px] text-secondary font-bold uppercase tracking-widest">
                        <Users size={10}/> Active Room
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-card border border-border border-b-0 rounded-t-2xl overflow-y-auto p-6 space-y-4 custom-scrollbar flex flex-col">
                {messages.map(msg => (
                    <div key={msg.id} className={msg.user_name === 'System' ? "text-center" : (msg.user_name === 'You' ? "self-end" : "self-start")}>
                        {msg.user_name === 'System' ? (
                            <span className="bg-surface border border-border text-subtext text-[10px] font-bold px-3 py-1 rounded-full">{msg.message}</span>
                        ) : (
                            <div className={`flex flex-col ${msg.user_name === 'You' ? 'items-end' : 'items-start'}`}>
                                <span className="text-[10px] text-subtext mb-1">{msg.user_name}</span>
                                <div className={`px-4 py-3 rounded-2xl max-w-xs md:max-w-md text-sm ${msg.user_name === 'You' ? 'bg-secondary text-primary rounded-br-none' : 'bg-surface border border-border text-text rounded-bl-none'}`}>
                                    {msg.message}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="bg-card p-4 rounded-b-2xl border border-border flex gap-3 shrink-0">
                <input
                    type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)}
                    placeholder="Discuss with readers..."
                    className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-secondary/40 placeholder:text-subtext/50"
                />
                <button type="submit" disabled={!inputMsg.trim()} className="bg-secondary text-primary p-3 rounded-xl disabled:opacity-30 transition-all">
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};

export default RoomInterface;
