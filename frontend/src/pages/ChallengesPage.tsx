import React, { useState, useEffect } from 'react';
import { Target, Award, CheckCircle, Loader2 } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const ChallengesPage: React.FC = () => {
    const [challenges, setChallenges] = useState<any[]>([]);
    const [userPoints, setUserPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [challengesRes, userRes] = await Promise.all([
                api.get('/api/challenges'),
                api.get('/api/auth/me')
            ]);
            setChallenges(challengesRes.data);
            setUserPoints(userRes.data.points || 0);
        } catch { /* silent */ } finally { setLoading(false); }
    };

    const handleJoin = async (id: number) => {
        try {
            await api.post('/api/challenges/join', { challenge_id: id });
            toast.success('Challenge joined!');
            fetchData();
        } catch { toast.error('Failed to join.'); }
    };

    const handleComplete = async (id: number) => {
        try {
            await api.post('/api/challenges/complete', { challenge_id: id });
            toast.success('Points claimed!');
            fetchData();
        } catch { toast.error('Failed to complete.'); }
    };

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-secondary" size={32}/></div>;

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <div className="text-xs font-bold text-secondary uppercase tracking-[0.2em] mb-2">Gamified Reading</div>
                    <h1 className="text-4xl font-heading italic text-text">Reading Challenges</h1>
                </div>
                <div className="bg-card border border-border px-5 py-3 rounded-2xl flex items-center gap-3">
                    <Award className="text-secondary" size={20} />
                    <div>
                        <p className="text-[10px] text-subtext uppercase font-bold tracking-widest">Your Points</p>
                        <p className="font-bold text-xl text-text">{userPoints}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {challenges.map(challenge => {
                    const booksRead = challenge.books_read || 0;
                    const progress = (booksRead / challenge.book_count) * 100;
                    const isCompleted = challenge.completed_at !== null;
                    const canComplete = !isCompleted && booksRead >= challenge.book_count;

                    return (
                        <div key={challenge.id} className="bg-card border border-border rounded-2xl p-7 flex flex-col relative overflow-hidden hover:border-secondary/20 transition-all">
                            {isCompleted && (
                                <div className="absolute top-0 right-0 bg-secondary text-primary text-[10px] font-bold px-4 py-1 rounded-bl-xl flex items-center gap-1">
                                    <CheckCircle size={10} /> DONE
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-4">
                                <div className={`p-3 rounded-xl ${isCompleted ? 'bg-secondary/10 text-secondary' : 'bg-surface text-accent border border-border'}`}>
                                    <Target size={22} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-heading italic text-text">{challenge.title}</h2>
                                    <p className="text-xs font-bold text-secondary">+{challenge.reward_points} pts</p>
                                </div>
                            </div>

                            <p className="text-subtext text-sm mb-6 flex-1">{challenge.description}</p>

                            {challenge.is_joined ? (
                                <div>
                                    <div className="flex justify-between items-end mb-2 text-xs font-bold text-subtext uppercase tracking-widest">
                                        <span>{booksRead} / {challenge.book_count}</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border mb-4">
                                        <div className={`h-full transition-all duration-1000 rounded-full ${isCompleted ? 'bg-secondary' : 'bg-accent'}`} style={{ width: `${Math.min(progress, 100)}%` }}></div>
                                    </div>

                                    {canComplete && (
                                        <button onClick={() => handleComplete(challenge.id)} className="w-full bg-secondary text-primary py-3 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-secondary/20 transition-all">
                                            Claim {challenge.reward_points} Points
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <button onClick={() => handleJoin(challenge.id)} className="w-full bg-surface border border-border text-text py-3 rounded-xl font-bold text-sm hover:border-secondary/30 hover:bg-secondary/5 transition-all mt-auto">
                                    Join Challenge
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ChallengesPage;
