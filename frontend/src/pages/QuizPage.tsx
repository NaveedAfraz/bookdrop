import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Loader2, RotateCcw, Sparkles, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

const questions = [
    { text: "Where would you rather spend a Sunday afternoon?", options: [{ label: "In a quiet library", tag: "Fiction" }, { label: "Exploring a new city", tag: "Adventure" }, { label: "In a high-tech lab", tag: "Sci-Fi" }, { label: "At a historic museum", tag: "History" }] },
    { text: "Which magic power would you choose?", options: [{ label: "Time travel", tag: "Sci-Fi" }, { label: "Mind reading", tag: "Thriller" }, { label: "Invisibility", tag: "Mystery" }, { label: "Flying", tag: "Fantasy" }] },
    { text: "Pick an animal companion", options: [{ label: "A wise old owl", tag: "Philosophy" }, { label: "A loyal wolf", tag: "Adventure" }, { label: "A robotic dog", tag: "Sci-Fi" }, { label: "A sleek black cat", tag: "Mystery" }] },
    { text: "What's your ideal vacation?", options: [{ label: "Cabin in the woods", tag: "Horror" }, { label: "Bustling metropolis", tag: "Contemporary" }, { label: "Ancient ruins", tag: "History" }, { label: "Beachside resort", tag: "Romance" }] },
    { text: "Pick a weapon", options: [{ label: "A sharp wit", tag: "Comedy" }, { label: "A laser blaster", tag: "Sci-Fi" }, { label: "A clue-filled notebook", tag: "Mystery" }, { label: "A magic wand", tag: "Fantasy" }] },
    { text: "How do you solve a problem?", options: [{ label: "Logic and research", tag: "Non-Fiction" }, { label: "Trusting your gut", tag: "Thriller" }, { label: "Asking for help", tag: "Romance" }, { label: "Inventing a gadget", tag: "Sci-Fi" }] },
    { text: "What's in your backpack?", options: [{ label: "A compass", tag: "Adventure" }, { label: "A magnifying glass", tag: "Mystery" }, { label: "A love letter", tag: "Romance" }, { label: "A spellbook", tag: "Fantasy" }] },
    { text: "Choose a weather", options: [{ label: "Thunderstorm", tag: "Thriller" }, { label: "Sunny and clear", tag: "Contemporary" }, { label: "Foggy", tag: "Mystery" }, { label: "Meteor shower", tag: "Sci-Fi" }] }
];

const QuizPage: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [recommendedBook, setRecommendedBook] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleAnswer = async (tag: string) => {
        const newAnswers = [...answers, tag];
        setAnswers(newAnswers);
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            setLoading(true);
            setShowResult(true);
            await fetchRecommendation(newAnswers);
        }
    };

    const fetchRecommendation = async (allAnswers: string[]) => {
        const counts = allAnswers.reduce((acc, tag) => { acc[tag] = (acc[tag] || 0) + 1; return acc; }, {} as Record<string, number>);
        const topTag = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        try {
            const response = await api.get('/api/books');
            const filtered = response.data.filter((b: any) =>
                b.category?.toLowerCase().includes(topTag.toLowerCase()) ||
                b.description?.toLowerCase().includes(topTag.toLowerCase())
            );
            setRecommendedBook(filtered.length > 0 ? filtered[0] : response.data[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async () => {
        if (!recommendedBook) return;
        try {
            await api.post('/api/cart/add', { book_id: recommendedBook.id, quantity: 1 });
            toast.success('Added to bag!');
        } catch { toast.error('Sign in first'); }
    };

    const counts = answers.reduce((acc, tag) => { acc[tag] = (acc[tag] || 0) + 1; return acc; }, {} as Record<string, number>);
    const topTag = Object.keys(counts).length > 0 ? Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b) : "";

    if (showResult) {
        return (
            <div className="min-h-[85vh] flex items-center justify-center px-6 py-16">
                <div className="max-w-2xl w-full text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-secondary/20 bg-secondary/5 text-xs font-bold text-secondary uppercase tracking-widest mb-6">
                        <Sparkles size={12}/> Your Result
                    </div>
                    <h1 className="text-4xl font-heading italic text-text mb-2">Your reading soul is</h1>
                    <h2 className="text-5xl font-heading italic text-secondary text-glow mb-8">{topTag}</h2>

                    {loading ? (
                        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-secondary" size={36} /></div>
                    ) : (
                        recommendedBook && (
                            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center text-left mb-10">
                                <div className="w-36 h-52 rounded-xl overflow-hidden bg-surface border border-border shrink-0">
                                    <img src={recommendedBook.cover_image} alt={recommendedBook.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1 block">Perfect Match</span>
                                    <h2 className="text-2xl font-heading italic text-text mb-1">{recommendedBook.title}</h2>
                                    <p className="text-subtext text-sm mb-4">by {recommendedBook.author}</p>
                                    <p className="text-sm text-subtext leading-relaxed mb-6 line-clamp-3">{recommendedBook.description}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-secondary">₹{recommendedBook.price}</span>
                                        <button onClick={addToCart} className="bg-secondary text-primary px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm hover:shadow-lg hover:shadow-secondary/20 transition-all">
                                            <ShoppingCart size={16} /> Add to Bag
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    )}

                    <div className="flex justify-center gap-4">
                        <button onClick={() => { setCurrentQuestion(0); setAnswers([]); setShowResult(false); setRecommendedBook(null); }} className="border border-border text-subtext px-5 py-2.5 rounded-xl font-medium text-sm hover:border-secondary/30 hover:text-text transition-all flex items-center gap-2">
                            <RotateCcw size={14}/> Retake
                        </button>
                        <Link to="/books" className="bg-secondary text-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                            Browse More <ArrowRight size={14}/>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const q = questions[currentQuestion];
    const progress = ((currentQuestion) / questions.length) * 100;

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-6 py-16">
            <div className="max-w-2xl w-full">
                <div className="mb-10">
                    <div className="flex justify-between items-end mb-3 text-xs font-bold text-subtext uppercase tracking-widest">
                        <span>Q{currentQuestion + 1} / {questions.length}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden border border-border">
                        <div className="bg-secondary h-full transition-all duration-500 ease-out rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-heading italic text-text mb-10">{q.text}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt.tag)}
                                className="bg-surface border border-border p-5 rounded-xl text-base font-medium text-text hover:border-secondary/40 hover:bg-secondary/5 transition-all duration-300 transform hover:-translate-y-0.5"
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
