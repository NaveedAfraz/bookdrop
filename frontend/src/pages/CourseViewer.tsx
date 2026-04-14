import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Play, Layout, List, MessageSquare, Loader2, BookOpen } from 'lucide-react';
import ReactPlayerOrigin from 'react-player';
const ReactPlayer = ReactPlayerOrigin as any;
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const CourseViewer: React.FC = () => {
    const { bookId } = useParams();
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourseData();
    }, [bookId]);

    const fetchCourseData = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/courses/${bookId}`);
            setCourses(res.data);
            if (res.data.length > 0) setSelectedCourse(res.data[0]);
        } catch (error) {
            console.error('Error fetching course:', error);
            toast.error('Ownership required for course vault access.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-bg"><Loader2 className="animate-spin text-secondary" size={40} /></div>;

    if (courses.length === 0) return (
        <div className="h-screen flex flex-col items-center justify-center gap-8 p-6 bg-bg grain">
            <div className="w-24 h-24 bg-card border border-border rounded-3xl flex items-center justify-center text-secondary shadow-xl">
                 <Layout size={40} />
            </div>
            <div className="text-center max-w-md">
                <h1 className="text-3xl font-heading italic text-text mb-3">Void Detected</h1>
                <p className="text-subtext italic">This masterpiece hasn't been augmented with a course vault yet. Return to your library to explore other volumes.</p>
            </div>
            <Link to="/orders" className="bg-secondary text-primary px-8 py-3.5 rounded-xl font-bold text-sm hover:glow-green transition-all">My Library</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-bg lg:flex relative grain">
            {/* Sidebar - Playlist */}
            <aside className="lg:w-80 bg-card border-r border-border flex flex-col h-screen overflow-y-auto sticky top-0 z-10 custom-scrollbar">
                <div className="p-8 border-b border-border">
                    <Link to="/orders" className="flex items-center gap-2 text-subtext hover:text-secondary transition-colors text-[10px] font-bold uppercase tracking-widest mb-6 group">
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform"/> Library
                    </Link>
                    <h2 className="text-2xl font-heading italic text-text flex items-center gap-3">
                        <BookOpen size={20} className="text-secondary" /> Archive
                    </h2>
                </div>
                
                <div className="flex-1">
                    {courses.map((course, index) => (
                        <button 
                            key={course.id}
                            onClick={() => setSelectedCourse(course)}
                            className={`w-full text-left p-6 flex gap-4 transition-all border-b border-border/50 group ${selectedCourse?.id === course.id ? 'bg-secondary/5 border-l-4 border-l-secondary' : 'hover:bg-surface/50'}`}
                        >
                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm transition-colors ${selectedCourse?.id === course.id ? 'bg-secondary text-primary glow-green' : 'bg-surface border border-border text-subtext group-hover:text-text'}`}>
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <div className="min-w-0">
                                <h4 className={`font-bold text-xs mb-1 truncate ${selectedCourse?.id === course.id ? 'text-text' : 'text-subtext group-hover:text-text'}`}>{course.title}</h4>
                                <p className="text-[9px] text-subtext/60 uppercase tracking-widest font-bold">Volume Detail</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="p-6 bg-surface border border-border m-6 rounded-2xl relative overflow-hidden group">
                     <div className="absolute -right-4 -bottom-4 opacity-5 text-secondary group-hover:scale-110 transition-transform duration-700">
                          <Layout size={80}/>
                     </div>
                     <p className="text-[9px] font-bold text-secondary mb-2 uppercase tracking-[0.2em]">Verified Owner</p>
                     <p className="text-xs text-subtext font-medium leading-relaxed relative z-10">Access granted to full course vault for this volume.</p>
                </div>
            </aside>

            {/* Main Content - Player */}
            <main className="flex-1 p-6 lg:p-12 overflow-y-auto mesh-hero">
                {selectedCourse && (
                    <div className="max-w-5xl mx-auto">
                        <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl mb-12 border border-border group">
                            <ReactPlayer 
                                url={selectedCourse.video_url} 
                                width="100%" 
                                height="100%" 
                                controls={true}
                                playing={false}
                                light={true}
                                playIcon={<div className="bg-secondary text-primary p-6 rounded-full shadow-2xl glow-green hover:scale-110 transition-transform"><Play size={24} fill="currentColor"/></div>}
                            />
                        </div>

                        <div className="flex flex-col lg:flex-row justify-between gap-12">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="bg-secondary/10 border border-secondary/20 text-secondary px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-[0.2em]">Active Module</span>
                                    <span className="text-[10px] text-subtext font-bold uppercase tracking-widest flex items-center gap-1.5"><Play size={10} fill="currentColor"/> Module {courses.indexOf(selectedCourse) + 1} of {courses.length}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-heading italic text-text mb-8">{selectedCourse.title}</h1>
                                <div className="divider-glow h-px w-full mb-8"></div>
                                <p className="text-subtext text-lg leading-relaxed italic whitespace-pre-wrap">"{selectedCourse.description}"</p>
                            </div>

                            <div className="lg:w-80 space-y-6 shrink-0">
                                <div className="bg-card border border-border p-8 rounded-3xl shadow-xl relative overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 opacity-5 text-secondary">
                                         <MessageSquare size={80}/>
                                    </div>
                                    <h5 className="font-heading italic text-xl text-text mb-4 flex items-center gap-2 relative z-10">Discussion Hub</h5>
                                    <p className="text-sm text-subtext leading-relaxed relative z-10">Connect with other readers and owners in the dedicated discussion sanctum for this volume.</p>
                                    <Link to={`/rooms/${bookId}`} className="block w-full mt-8 bg-secondary text-primary font-bold py-3.5 rounded-xl text-center text-sm hover:glow-green transition-all relative z-10">Enter sanctum</Link>
                                </div>
                                <div className="bg-surface border border-border p-6 rounded-2xl flex items-center gap-4 group">
                                     <div className="w-12 h-12 bg-card border border-border rounded-xl flex items-center justify-center text-secondary shadow-lg group-hover:scale-110 transition-transform"><List size={18}/></div>
                                     <div>
                                         <p className="font-bold text-xs text-text mb-0.5">Resources</p>
                                         <p className="text-[10px] text-subtext font-bold uppercase tracking-widest">Digital collateral</p>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CourseViewer;
