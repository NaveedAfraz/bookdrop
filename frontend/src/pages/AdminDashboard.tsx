import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, BookOpen, RefreshCcw, BarChart3, TrendingUp, Users,
    DollarSign, Check, X, Loader2, Plus, Pencil, Trash2, Save, Trophy,
    Package, ShoppingBag, Mic2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

type Tab = 'stats' | 'books' | 'users' | 'orders' | 'challenges' | 'bundles' | 'marketplace' | /* 'rooms' | */ 'refunds';

const emptyBook = { title: '', author: '', description: '', price: '', stock: '', cover_image: '', category: '', country: '', published_year: '', product_type: 'First-Hand', condition_desc: 'Good', seller_city: 'Bookdrop HQ' };
const emptyChallenge = { title: '', description: '', book_count: '', duration_days: '', reward_points: '', target_category: '' };
const emptyBundle = { title: '', description: '', discount_percent: '' };

const TABS = [
    { key: 'stats',       label: 'Analytics',    icon: <BarChart3 size={16}/> },
    { key: 'books',       label: 'Books',         icon: <BookOpen size={16}/> },
    { key: 'users',       label: 'Users',         icon: <Users size={16}/> },
    { key: 'orders',      label: 'Orders',        icon: <ShoppingBag size={16}/> },
    { key: 'challenges',  label: 'Challenges',    icon: <Trophy size={16}/> },
    { key: 'bundles',     label: 'Bundles',       icon: <Package size={16}/> },
    { key: 'marketplace', label: 'Marketplace',   icon: <Mic2 size={16}/> },
    // { key: 'rooms',    label: 'Rooms',         icon: <Users size={16}/> }, // Uncomment when Socket.io chat is implemented
    { key: 'refunds',     label: 'Refunds',       icon: <RefreshCcw size={16}/> },
];

const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    APPROVED: 'bg-secondary/10 text-secondary border-secondary/20',
    REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
    SUCCESS: 'bg-secondary/10 text-secondary border-secondary/20',
    PROCESSING: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    AVAILABLE: 'bg-secondary/10 text-secondary border-secondary/20',
    SOLD: 'bg-subtext/10 text-subtext border-subtext/20',
};

const Badge = ({ status }: { status: string }) => (
    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${statusColors[status] || 'bg-surface text-subtext border-border'}`}>{status}</span>
);

// Generic modal form field
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <label className="text-[10px] font-bold text-subtext uppercase tracking-widest mb-1.5 block">{label}</label>
        {children}
    </div>
);

const inputCls = "w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text focus:outline-none focus:border-secondary/40 transition-colors";

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('stats');
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState<any>({});

    const endpointMap: Record<Tab, string> = {
        stats: '/api/admin/stats',
        books: '/api/books',
        users: '/api/admin/users',
        orders: '/api/admin/orders',
        challenges: '/api/admin/challenges',
        bundles: '/api/admin/bundles',
        marketplace: '/api/admin/marketplace',
        // rooms: '/api/admin/rooms', // Uncomment when Socket.io chat is implemented
        refunds: '/api/admin/refunds',
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get(endpointMap[activeTab]);
            setData(res.data);
        } catch { toast.error('Failed to load data'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); setShowForm(false); setEditing(null); }, [activeTab]);

    const openEdit = (item: any) => {
        setEditing(item);
        setForm({ ...item });
        setShowForm(true);
    };


    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (activeTab === 'books' && form.product_type === 'Second-Hand' && !editing) {
                await api.post('/api/admin/marketplace', form);
            } else {
                editing 
                    ? await api.put(`/api/admin/${activeTab}/${editing.id}`, form)
                    : await api.post(`/api/admin/${activeTab}`, form);
            }
            toast.success(editing ? 'Updated successfully' : 'Created successfully');
            setShowForm(false);
            setEditing(null);
            fetchData();
        } catch (err: any) { toast.error(err.response?.data?.error || 'Save failed'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete permanently?')) return;
        try {
            const adminEndpoints: Record<string, string> = { users: '/api/admin/users', orders: '/api/admin/orders', challenges: '/api/admin/challenges', bundles: '/api/admin/bundles', marketplace: '/api/admin/marketplace', rooms: '/api/admin/rooms', books: '/api/books' };
            const base = adminEndpoints[activeTab] || endpointMap[activeTab];
            await api.delete(`${base}/${id}`);
            toast.success('Deleted');
            fetchData();
        } catch { toast.error('Delete failed'); }
    };


    const canDelete = ['books', 'users', 'orders', 'challenges', 'bundles', 'marketplace', 'rooms'].includes(activeTab);
    const canEdit   = ['books', 'users', 'orders', 'challenges', 'bundles', 'marketplace'].includes(activeTab);

    return (
        <div className="flex min-h-screen bg-bg">
            {/* Sidebar */}
            <aside className="w-56 bg-card border-r border-border p-5 flex flex-col shrink-0 sticky top-0 h-screen overflow-y-auto">
                <div className="flex items-center gap-2 mb-8">
                    <LayoutDashboard size={18} className="text-secondary"/>
                    <span className="font-heading italic text-text text-lg">Admin</span>
                </div>
                <nav className="space-y-0.5 flex-1">
                    {TABS.map(t => (
                        <button key={t.key} onClick={() => setActiveTab(t.key as Tab)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === t.key ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'text-subtext hover:text-text hover:bg-surface'}`}>
                            {t.icon} {t.label}
                        </button>
                    ))}
                </nav>
                <div className="mt-4 p-3 bg-surface border border-border rounded-xl">
                    <p className="text-[9px] text-subtext uppercase tracking-widest mb-0.5">Signed in as</p>
                    <p className="font-bold text-text text-xs">Administrator</p>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 p-7 overflow-y-auto min-h-screen">
                <div className="flex justify-between items-center mb-7">
                    <div>
                        <h1 className="text-2xl font-heading italic text-text capitalize">{activeTab}</h1>
                        <p className="text-subtext text-xs">Manage your {activeTab} data</p>
                    </div>
                    <div className="flex items-center gap-4">
                    {['books', 'challenges', 'bundles', 'marketplace'].includes(activeTab) && (
                        <button 
                            onClick={() => { 
                                setEditing(null); 
                                setForm(activeTab === 'marketplace' ? { ...emptyBook, product_type: 'Second-Hand' } : (activeTab === 'books' ? emptyBook : (activeTab === 'challenges' ? emptyChallenge : emptyBundle))); 
                                if (activeTab === 'marketplace') setActiveTab('books'); // Route marketplace creation through consolidated book form
                                setShowForm(true); 
                            }} 
                            className="bg-secondary text-primary px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-secondary/20 transition-all"
                        >
                            <Plus size={16}/> New {activeTab === 'marketplace' ? 'Listing' : activeTab.slice(0,-1)}
                        </button>
                    )}
                </div>
            </div>

                {loading ? (
                    <div className="h-80 flex items-center justify-center"><Loader2 className="animate-spin text-secondary" size={28}/></div>
                ) : (
                    <>
                    {/* ── STATS ── */}
                    {activeTab === 'stats' && data && (
                        <div className="space-y-7">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Revenue', val: `₹${parseFloat(data.revenue||0).toFixed(0)}`, icon: <DollarSign size={16}/>, color: 'text-secondary' },
                                    { label: 'Orders',  val: data.orderCount,   icon: <TrendingUp size={16}/>, color: 'text-accent' },
                                    { label: 'Users',   val: data.userCount,    icon: <Users size={16}/>, color: 'text-[#A78BFA]' },
                                    { label: 'Books',   val: data.bookCount,    icon: <BookOpen size={16}/>, color: 'text-[#F59E0B]' },
                                ].map((s, i) => (
                                    <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-3">
                                        <div className={`w-10 h-10 bg-surface border border-border rounded-xl flex items-center justify-center ${s.color}`}>{s.icon}</div>
                                        <div>
                                            <p className="text-[10px] text-subtext font-bold uppercase tracking-wider">{s.label}</p>
                                            <p className="text-xl font-bold text-text">{s.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-text mb-5 flex items-center gap-2"><TrendingUp size={14} className="text-secondary"/> Weekly Revenue</h3>
                                <div className="h-52">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.recentSales}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A2744"/>
                                            <XAxis dataKey="date" tick={{fontSize:10,fill:'#6B7A99'}} tickFormatter={v => new Date(v).toLocaleDateString([],{month:'short',day:'numeric'})}/>
                                            <YAxis tick={{fontSize:10,fill:'#6B7A99'}}/>
                                            <Tooltip contentStyle={{background:'#0D1424',border:'1px solid #1A2744',borderRadius:8,color:'#E8ECF4',fontSize:12}}/>
                                            <Bar dataKey="amount" fill="#00E5A0" radius={[4,4,0,0]}/>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            {(data.categorySales||[]).length > 0 && (
                                <div className="bg-card border border-border rounded-2xl p-6">
                                    <h3 className="text-sm font-bold text-text mb-5">Sales by Category</h3>
                                    <div className="space-y-3">
                                        {data.categorySales.map((cat: any) => (
                                            <div key={cat.category}>
                                                <div className="flex justify-between text-xs mb-1 font-bold">
                                                    <span className="text-text">{cat.category}</span>
                                                    <span className="text-subtext">{cat.count} orders</span>
                                                </div>
                                                <div className="w-full bg-surface h-1.5 rounded-full border border-border">
                                                    <div className="bg-secondary h-full rounded-full" style={{width:`${Math.min((cat.count/(data.orderCount||1))*100,100)}%`}}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── BOOKS ── */}
                    {activeTab === 'books' && Array.isArray(data) && (
                        <Table columns={['Book','Category','Price','Stock','Country']} rows={data} renderRow={(b:any) => [
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-12 bg-surface border border-border rounded overflow-hidden shrink-0">
                                    {b.cover_image && <img src={b.cover_image} className="w-full h-full object-cover"/>}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-text text-xs truncate max-w-[180px]">{b.title}</p>
                                    <p className="text-[11px] text-subtext">{b.author}</p>
                                </div>
                            </div>,
                            <span className="text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded">{b.category}</span>,
                            <span className="font-bold text-text text-sm">₹{parseFloat(b.price).toFixed(0)}</span>,
                            <span className="text-subtext text-sm">{b.stock}</span>,
                            <span className="text-subtext text-xs">{b.country||'—'}</span>,
                        ]} onEdit={canEdit ? openEdit : undefined} onDelete={canDelete ? handleDelete : undefined}/>
                    )}

                    {/* ── USERS ── */}
                    {activeTab === 'users' && Array.isArray(data) && (
                        <Table columns={['User','Email','Role','Joined']} rows={data} renderRow={(u:any) => [
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary font-bold text-xs">{u.name?.[0]}</div>
                                <span className="font-bold text-text text-sm">{u.name}</span>
                            </div>,
                            <span className="text-subtext text-xs">{u.email}</span>,
                            <Badge status={u.role?.toUpperCase()}/>,
                            <span className="text-subtext text-xs">{new Date(u.created_at).toLocaleDateString()}</span>,
                        ]} onEdit={canEdit ? openEdit : undefined} onDelete={canDelete ? handleDelete : undefined}/>
                    )}

                    {/* ── ORDERS ── */}
                    {activeTab === 'orders' && Array.isArray(data) && (
                        <Table columns={['#','Customer','Total','Order Status','Payment']} rows={data} renderRow={(o:any) => [
                            <span className="font-bold text-subtext text-xs">#{o.id}</span>,
                            <div>
                                <p className="font-bold text-text text-sm">{o.user_name}</p>
                                <p className="text-[11px] text-subtext">{o.user_email}</p>
                            </div>,
                            <span className="font-bold text-secondary">₹{parseFloat(o.total_amount).toFixed(0)}</span>,
                            <Badge status={o.order_status}/>,
                            <Badge status={o.payment_status}/>,
                        ]} onEdit={canEdit ? openEdit : undefined} onDelete={canDelete ? handleDelete : undefined}/>
                    )}

                    {/* ── CHALLENGES ── */}
                    {activeTab === 'challenges' && Array.isArray(data) && (
                        <Table columns={['Title','Books','Days','Points']} rows={data} renderRow={(c:any) => [
                            <div>
                                <p className="font-bold text-text text-sm">{c.title}</p>
                                <p className="text-[11px] text-subtext italic">{c.description}</p>
                            </div>,
                            <span className="font-bold text-accent text-sm">{c.book_count}</span>,
                            <span className="text-subtext text-sm">{c.duration_days}d</span>,
                            <span className="font-bold text-secondary text-sm">{c.reward_points} pts</span>,
                        ]} onEdit={canEdit ? openEdit : undefined} onDelete={canDelete ? handleDelete : undefined}/>
                    )}

                    {/* ── BUNDLES ── */}
                    {activeTab === 'bundles' && Array.isArray(data) && (
                        <Table columns={['Title','Description','Discount']} rows={data} renderRow={(b:any) => [
                            <span className="font-bold text-text text-sm">{b.title}</span>,
                            <span className="text-subtext text-xs italic truncate max-w-[200px] block">{b.description}</span>,
                            <span className="font-bold text-secondary text-sm">{b.discount_percent}%</span>,
                        ]} onEdit={canEdit ? openEdit : undefined} onDelete={canDelete ? handleDelete : undefined}/>
                    )}

                    {/* ── MARKETPLACE ── */}
                    {activeTab === 'marketplace' && Array.isArray(data) && (
                        <Table columns={['Book','Seller','Price','Condition','Status']} rows={data} renderRow={(m:any) => [
                            <span className="font-bold text-text text-sm">{m.book_title}</span>,
                            <span className="text-subtext text-xs">{m.seller_name}</span>,
                            <span className="font-bold text-secondary">₹{parseFloat(m.price).toFixed(0)}</span>,
                            <span className="text-subtext text-xs">{m.condition_desc}</span>,
                            <Badge status={m.status}/>,
                        ]} onEdit={canEdit ? openEdit : undefined} onDelete={canDelete ? handleDelete : undefined}/>
                    )}

                    {/* ── ROOMS ── */}
                    {/* {activeTab === 'rooms' && Array.isArray(data) && (
                        <Table columns={['Book','Creator','Code','Members']} rows={data} renderRow={(r:any) => [
                            <span className="font-bold text-text text-sm">{r.book_title}</span>,
                            <span className="text-subtext text-xs">{r.creator_name}</span>,
                            <span className="font-mono text-secondary text-xs font-bold bg-secondary/10 px-2 py-0.5 rounded">{r.invite_code}</span>,
                            <span className="text-subtext text-sm">{r.member_count}</span>,
                        ]} onDelete={canDelete ? handleDelete : undefined}/>
                    )} */}

                    {/* ── REFUNDS ── */}
                    {activeTab === 'refunds' && Array.isArray(data) && (
                        <div className="bg-card border border-border rounded-2xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-surface text-subtext text-[10px] font-bold uppercase tracking-widest border-b border-border">
                                    <tr>{['User','Book','Reason','Status','Action'].map(h=><th key={h} className="px-5 py-3.5">{h}</th>)}</tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {data.map((r:any)=>(
                                        <tr key={r.id} className="hover:bg-surface/50 transition-colors">
                                            <td className="px-5 py-3.5 font-bold text-text text-sm">{r.user_name}</td>
                                            <td className="px-5 py-3.5 text-xs text-subtext">{r.book_title}</td>
                                            <td className="px-5 py-3.5 text-xs text-subtext italic max-w-[180px] truncate">{r.reason}</td>
                                            <td className="px-5 py-3.5"><Badge status={r.status}/></td>
                                            <td className="px-5 py-3.5">
                                                {r.status==='PENDING' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={async()=>{await api.put(`/api/admin/refunds/${r.id}`,{status:'APPROVED'});toast.success('Approved');fetchData();}} className="p-1.5 bg-secondary/10 text-secondary rounded-lg hover:bg-secondary hover:text-primary transition-all border border-secondary/20"><Check size={12}/></button>
                                                        <button onClick={async()=>{await api.put(`/api/admin/refunds/${r.id}`,{status:'REJECTED'});toast.success('Rejected');fetchData();}} className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all border border-red-500/20"><X size={12}/></button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {data.length===0&&<tr><td colSpan={5} className="p-8 text-center text-subtext italic text-sm">No refund requests.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}
                    </>
                )}
            </main>

            {/* ── UNIVERSAL FORM MODAL ── */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6" onClick={()=>setShowForm(false)}>
                    <div className="bg-card border border-border w-full max-w-xl rounded-2xl p-7 max-h-[90vh] overflow-y-auto relative" onClick={e=>e.stopPropagation()}>
                        <button onClick={()=>setShowForm(false)} className="absolute top-4 right-4 p-1.5 text-subtext hover:text-error"><X size={14}/></button>
                        <h2 className="text-xl font-heading italic text-text mb-6">{editing ? 'Edit' : 'New'} {activeTab.slice(0,-1)}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            {/* BOOKS */}
                            {activeTab === 'books' && <>
                                <div className="bg-surface p-1 rounded-xl flex gap-1 mb-4 border border-border">
                                    {['First-Hand', 'Second-Hand'].map(type => (
                                        <button 
                                            key={type}
                                            type="button"
                                            onClick={() => setForm({...form, product_type: type})}
                                            className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${form.product_type === type ? 'bg-secondary text-primary shadow-sm' : 'text-subtext hover:bg-white/5'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Title"><input required className={inputCls} value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Title"/></Field>
                                    <Field label="Author"><input required className={inputCls} value={form.author||''} onChange={e=>setForm({...form,author:e.target.value})} placeholder="Author"/></Field>
                                    <Field label="Category"><input required className={inputCls} value={form.category||''} onChange={e=>setForm({...form,category:e.target.value})}/></Field>
                                    <Field label="Price (₹)"><input required type="number" className={inputCls} value={form.price||''} onChange={e=>setForm({...form,price:e.target.value})}/></Field>
                                    
                                    {form.product_type === 'First-Hand' ? (
                                        <Field label="Stock"><input required type="number" className={inputCls} value={form.stock||'0'} onChange={e=>setForm({...form,stock:e.target.value})}/></Field>
                                    ) : (
                                        <Field label="Condition">
                                            <select className={inputCls} value={form.condition_desc||'Good'} onChange={e=>setForm({...form,condition_desc:e.target.value})}>
                                                {['Good','Fair','Worn'].map(c=><option key={c}>{c}</option>)}
                                            </select>
                                        </Field>
                                    )}

                                    {form.product_type === 'Second-Hand' && (
                                        <Field label="Seller City"><input className={inputCls} value={form.seller_city||''} onChange={e=>setForm({...form,seller_city:e.target.value})}/></Field>
                                    )}
                                    <Field label="Cover URL"><input className={inputCls} value={form.cover_image||''} onChange={e=>setForm({...form,cover_image:e.target.value})} placeholder="https://..."/></Field>
                                </div>
                                <Field label="Description"><textarea className={`${inputCls} h-24 resize-none`} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}/></Field>
                            </>}

                            {/* USERS */}
                            {activeTab === 'users' && <>
                                <Field label="Name"><input required className={inputCls} value={form.name||''} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
                                <Field label="Email"><input required type="email" className={inputCls} value={form.email||''} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
                                <Field label="Role">
                                    <select className={inputCls} value={form.role||'user'} onChange={e=>setForm({...form,role:e.target.value})}>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </Field>
                            </>}

                            {/* ORDERS */}
                            {activeTab === 'orders' && <>
                                <Field label="Order Status">
                                    <select className={inputCls} value={form.order_status||''} onChange={e=>setForm({...form,order_status:e.target.value})}>
                                        {['PROCESSING','SHIPPED','DELIVERED','CANCELLED','SUCCESS'].map(s=><option key={s}>{s}</option>)}
                                    </select>
                                </Field>
                                <Field label="Payment Status">
                                    <select className={inputCls} value={form.payment_status||''} onChange={e=>setForm({...form,payment_status:e.target.value})}>
                                        {['PENDING','SUCCESS','FAILED','REFUNDED'].map(s=><option key={s}>{s}</option>)}
                                    </select>
                                </Field>
                            </>}

                            {/* CHALLENGES */}
                            {activeTab === 'challenges' && <>
                                <Field label="Title"><input required className={inputCls} value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})}/></Field>
                                <Field label="Description"><textarea className={`${inputCls} h-20 resize-none`} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}/></Field>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Books Required"><input required type="number" className={inputCls} value={form.book_count||''} onChange={e=>setForm({...form,book_count:e.target.value})}/></Field>
                                    <Field label="Duration (Days)"><input required type="number" className={inputCls} value={form.duration_days||''} onChange={e=>setForm({...form,duration_days:e.target.value})}/></Field>
                                    <Field label="Reward (Points)"><input required type="number" className={inputCls} value={form.reward_points||''} onChange={e=>setForm({...form,reward_points:e.target.value})}/></Field>
                                    <Field label="Target Category"><input className={inputCls} value={form.target_category||''} onChange={e=>setForm({...form,target_category:e.target.value})} placeholder="e.g. Sci-Fi"/></Field>
                                </div>
                            </>}

                            {/* BUNDLES */}
                            {activeTab === 'bundles' && <>
                                <Field label="Title"><input required className={inputCls} value={form.title||''} onChange={e=>setForm({...form,title:e.target.value})}/></Field>
                                <Field label="Description"><textarea className={`${inputCls} h-20 resize-none`} value={form.description||''} onChange={e=>setForm({...form,description:e.target.value})}/></Field>
                                <Field label="Discount %"><input required type="number" step="0.01" className={inputCls} value={form.discount_percent||''} onChange={e=>setForm({...form,discount_percent:e.target.value})}/></Field>
                            </>}

                            {/* MARKETPLACE */}
                            {activeTab === 'marketplace' && <>
                                <Field label="Price (₹)"><input required type="number" className={inputCls} value={form.price||''} onChange={e=>setForm({...form,price:e.target.value})}/></Field>
                                <Field label="Condition">
                                    <select className={inputCls} value={form.condition_desc||''} onChange={e=>setForm({...form,condition_desc:e.target.value})}>
                                        {['Good','Fair','Worn'].map(c=><option key={c}>{c}</option>)}
                                    </select>
                                </Field>
                                <Field label="Status">
                                    <select className={inputCls} value={form.status||''} onChange={e=>setForm({...form,status:e.target.value})}>
                                        {['AVAILABLE','SOLD'].map(s=><option key={s}>{s}</option>)}
                                    </select>
                                </Field>
                            </>}

                            <button type="submit" disabled={saving} className="w-full bg-secondary text-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-secondary/20 transition-all disabled:opacity-40">
                                {saving ? <Loader2 className="animate-spin" size={16}/> : <><Save size={15}/> {editing ? 'Update' : 'Create'}</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Reusable table component
const Table = ({ columns, rows, renderRow, onEdit, onDelete }: {
    columns: string[];
    rows: any[];
    renderRow: (row: any) => React.ReactNode[];
    onEdit?: (row: any) => void;
    onDelete?: (id: number) => void;
}) => (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-surface text-subtext text-[10px] font-bold uppercase tracking-widest border-b border-border">
                <tr>
                    {columns.map(c=><th key={c} className="px-5 py-3.5">{c}</th>)}
                    {(onEdit||onDelete) && <th className="px-5 py-3.5 text-right">Actions</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-border">
                {rows.map(row=>(
                    <tr key={row.id} className="hover:bg-surface/40 transition-colors group">
                        {renderRow(row).map((cell,i)=><td key={i} className="px-5 py-3.5">{cell}</td>)}
                        {(onEdit||onDelete) && (
                            <td className="px-5 py-3.5 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {onEdit && <button onClick={()=>onEdit(row)} className="p-1.5 bg-surface border border-border rounded-lg text-subtext hover:text-accent hover:border-accent/30 transition-all"><Pencil size={13}/></button>}
                                    {onDelete && <button onClick={()=>onDelete(row.id)} className="p-1.5 bg-surface border border-border rounded-lg text-subtext hover:text-red-400 hover:border-red-400/30 transition-all"><Trash2 size={13}/></button>}
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
                {rows.length===0 && <tr><td colSpan={columns.length+1} className="p-8 text-center text-subtext italic text-sm">No records found.</td></tr>}
            </tbody>
        </table>
    </div>
);

export default AdminDashboard;
