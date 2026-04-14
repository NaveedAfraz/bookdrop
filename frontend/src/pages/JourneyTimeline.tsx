import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, MessageSquare, Award, Loader2, ChevronLeft, Globe, History } from 'lucide-react';
import api from '../lib/api';

const JourneyTimeline: React.FC = () => {
    const { shBookId } = useParams();
    const [journey, setJourney] = useState<any[]>([]);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [journeyRes, leaderboardRes] = await Promise.all([
                    api.get(`/api/journey/${shBookId}`),
                    api.get('/api/journey/leaderboard/most-travelled')
                ]);
                setJourney(journeyRes.data);
                setLeaderboard(leaderboardRes.data);
            } catch (error) {
                console.error('Error fetching journey data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [shBookId]);

    if (loading) return <div className="min-h-[60vh] flex items-center justify-center bg-bg"><Loader2 className="animate-spin text-secondary" size={40}/></div>;

    return (
        <div className="container mx-auto px-6 py-12 flex flex-col lg:flex-row gap-16 relative grain">
            {/* Background elements */}
            <div className="absolute top-40 left-10 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="flex-1">
                <Link to="/marketplace" className="inline-flex items-center gap-2 text-subtext hover:text-secondary transition-colors text-[10px] font-bold uppercase tracking-widest mb-10 group">
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Marketplace
                </Link>

                <header className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                         <div className="w-8 h-8 bg-surface border border-border rounded-lg flex items-center justify-center text-secondary"><History size={16}/></div>
                         <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Provenance Record</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading italic text-text mb-4">Book Journey Log</h1>
                    <p className="text-subtext italic text-lg leading-relaxed max-w-xl">Tracing the unique life and travels of Volume <span className="text-text font-bold">#{shBookId}</span> through the global archipelago of readers.</p>
                </header>

                {journey.length === 0 ? (
                    <div className="bg-card border border-dashed border-border rounded-3xl p-20 text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <p className="text-subtext italic text-lg relative z-10">This volume's archive is currently blank. Be the soul that begins its history.</p>
                    </div>
                ) : (
                    <div className="relative space-y-12">
                         {/* Central Timeline Line */}
                        <div className="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-secondary/40 via-border to-transparent"></div>

                        {journey.map((entry, index) => (
                            <div key={entry.id} className="relative pl-16 group">
                                {/* Dot */}
                                <div className={`absolute left-0 top-1 w-12 h-12 rounded-2xl border flex items-center justify-center transition-all duration-500 z-10 ${index === 0 ? 'bg-secondary text-primary border-secondary glow-green shadow-xl scale-110' : 'bg-card border-border text-subtext group-hover:border-secondary/30'}`}>
                                    <MapPin size={index === 0 ? 20 : 16}/>
                                </div>
                                
                                <div className={`bg-card border border-border p-8 rounded-3xl transition-all duration-500 group-hover:border-secondary/20 shadow-xl ${index === 0 ? 'border-secondary/20 ring-1 ring-secondary/10' : ''}`}>
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                        <div>
                                            <h3 className="text-2xl font-heading italic text-text mb-1">{entry.owner_name}</h3>
                                            <div className="flex items-center gap-2 text-secondary font-bold text-[10px] uppercase tracking-widest">
                                                <Globe size={12}/> {entry.city || 'Undisclosed Citadel'}
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-bold text-subtext bg-surface border border-border px-4 py-1.5 rounded-full uppercase tracking-widest">
                                            {new Date(entry.owned_from).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                    
                                    {entry.note ? (
                                        <div className="bg-surface/50 border border-border p-6 rounded-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5 text-secondary group-hover:scale-110 transition-transform duration-700">
                                                 <MessageSquare size={48} />
                                            </div>
                                            <p className="text-subtext leading-relaxed italic relative z-10">"{entry.note}"</p>
                                        </div>
                                    ) : (
                                        <div className="h-px w-10 bg-border"></div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <div className="relative pl-16">
                            <div className="absolute left-[3px] top-1 w-10 h-10 bg-primary border-2 border-secondary/40 rounded-full flex items-center justify-center z-10 animate-pulse">
                                 <div className="w-3 h-3 bg-secondary rounded-full glow-green"></div>
                            </div>
                            <div className="bg-surface border border-border border-dashed p-8 rounded-3xl">
                                <h3 className="font-heading italic text-xl text-text mb-2">Active Orbit</h3>
                                <p className="text-sm text-subtext leading-relaxed italic">The volume is currently in the possession of its new steward, accumulating new memories and marks.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <aside className="lg:w-96 shrink-0 relative">
                <div className="bg-card border border-border p-10 rounded-[2.5rem] shadow-2xl sticky top-24 grain relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary/5 rounded-full blur-[60px]"></div>
                    
                    <header className="mb-10 text-center">
                        <div className="w-14 h-14 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-center justify-center text-secondary mx-auto mb-6 glow-green">
                            <Award size={28} />
                        </div>
                        <h2 className="text-3xl font-heading italic text-text mb-2">Most Travelled</h2>
                        <p className="text-[10px] text-subtext font-bold uppercase tracking-widest leading-relaxed">The Archive's most wanderlust-filled volumes.</p>
                    </header>
                    
                    {leaderboard.length === 0 ? (
                        <div className="py-12 text-center text-subtext italic text-sm border-t border-border/50">Leaderboard populating as ritual trading begins...</div>
                    ) : (
                        <div className="space-y-6">
                            {leaderboard.map((item, index) => (
                                <Link to={`/journey/${item.sh_book_id}`} key={item.sh_book_id} className="flex gap-5 items-center p-4 rounded-2xl hover:bg-surface/50 transition-all border border-transparent hover:border-border group">
                                    <div className="relative shrink-0">
                                        <div className={`text-2xl font-heading italic w-6 text-center group-hover:scale-110 transition-transform ${index === 0 ? 'text-secondary text-glow' : 'text-subtext/30'}`}>
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="w-12 h-18 bg-surface rounded-lg overflow-hidden border border-border shadow-lg group-hover:scale-105 transition-transform duration-500">
                                        <img src={item.cover_image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-text text-xs truncate mb-0.5">{item.title}</h4>
                                        <p className="text-[10px] text-subtext italic group-hover:text-secondary transition-colors truncate">{item.journeys} Stays</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
};

export default JourneyTimeline;
