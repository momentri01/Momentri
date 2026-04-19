import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '../lib/api';
import { LayoutDashboard, Users, Calendar, CreditCard, DollarSign, Activity, Package, MapPin, ExternalLink, CheckCircle2, Clock, Landmark, Smartphone, AlertCircle, Trash2, Flag, Plus, X, Search, Edit2, Upload, Loader2, Image as ImageIcon, ShieldCheck } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  const [stats, setStats] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'Birthday',
    price: '',
    imageUrls: [] as string[]
  });

  const fetchData = async () => {
    try {
      const [statsData, eventsData, ordersData, withdrawalsData, reportsData, catalogData] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/events'),
        api.get('/admin/orders'),
        api.get('/admin/withdrawals'),
        api.get('/admin/reports'),
        api.get('/catalog')
      ]);
      setStats(statsData);
      setEvents(eventsData);
      setOrders(ordersData);
      setWithdrawals(withdrawalsData);
      setReports(reportsData);
      setCatalog(catalogData);
    } catch (error) {
      console.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleVerification = async (eventId: string, isVerified: boolean, status: string) => {
    try {
      await api.put(`/admin/events/${eventId}/verify`, { isVerified, status });
      setEvents(events.map(e => e.id === eventId ? { ...e, isVerified, verificationStatus: status } : e));
      alert(`Event ${status.toLowerCase()} successfully`);
    } catch (error) {
      alert('Failed to update verification status');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    const uploadData = new FormData();
    files.forEach(file => uploadData.append('images', file));

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';
      const response = await fetch(`${apiUrl}/upload/multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: uploadData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      
      if (editingItem) {
        setEditingItem({ 
          ...editingItem, 
          imageUrls: [...(editingItem.imageUrls || []), ...data.imageUrls] 
        });
      } else {
        setNewItem({ 
          ...newItem, 
          imageUrls: [...newItem.imageUrls, ...data.imageUrls] 
        });
      }
    } catch (error) {
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    if (editingItem) {
      const updatedImages = [...editingItem.imageUrls];
      updatedImages.splice(index, 1);
      setEditingItem({ ...editingItem, imageUrls: updatedImages });
    } else {
      const updatedImages = [...newItem.imageUrls];
      updatedImages.splice(index, 1);
      setNewItem({ ...newItem, imageUrls: updatedImages });
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const itemData = editingItem || newItem;
    
    if (!itemData.name || !itemData.price || parseFloat(itemData.price) <= 0) {
      alert('Please provide a valid name and price.');
      return;
    }

    setSaving(true);
    try {
      if (editingItem) {
        await api.put(`/catalog/${editingItem.id}`, {
          ...editingItem,
          price: parseFloat(editingItem.price),
          imageUrls: JSON.stringify(editingItem.imageUrls)
        });
      } else {
        await api.post('/catalog', {
          ...newItem,
          price: parseFloat(newItem.price),
          imageUrls: JSON.stringify(newItem.imageUrls)
        });
      }
      setIsAddingItem(false);
      setEditingItem(null);
      setNewItem({ name: '', description: '', category: 'Birthday', price: '', imageUrls: [] });
      await fetchData();
    } catch (error) {
      alert('Failed to save catalog item');
    } finally {
      setSaving(false);
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem({ 
      ...item, 
      price: item.price.toString(),
      imageUrls: Array.isArray(item.imageUrls) ? item.imageUrls : JSON.parse(item.imageUrls || '[]')
    });
    setIsAddingItem(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCatalogItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item? This will remove it from future event registries.')) return;
    try {
      await api.delete(`/catalog/${id}`);
      fetchData();
    } catch (error) {
      alert('Failed to delete item');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { fulfillmentStatus: status });
      setOrders(orders.map(o => o.id === orderId ? { ...o, fulfillmentStatus: status } : o));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleUpdateWithdrawalStatus = async (id: string, status: string) => {
    const notes = prompt('Add admin notes (optional):');
    try {
      await api.put(`/admin/withdrawals/${id}`, { status, adminNotes: notes });
      setWithdrawals(withdrawals.map(w => w.id === id ? { ...w, status, adminNotes: notes } : w));
      alert('Withdrawal status updated');
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/events/${eventId}`);
      alert('Event deleted successfully');
      setReports(reports.map(r => r.eventId === eventId ? { ...r, event: { ...r.event, status: 'DELETED' } } : r));
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  const handleUpdateReportStatus = async (id: string, status: string) => {
    try {
      await api.put(`/admin/reports/${id}`, { status });
      setReports(reports.map(r => r.id === id ? { ...r, status } : r));
    } catch (error) {
      alert('Failed to update report status');
    }
  };

  if (loading) return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  if (!stats) return <div className="text-center py-24"><p className="text-red-500 font-bold">Failed to load system statistics. Please refresh.</p></div>;

  const cards = [
    { name: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Donations', value: stats.totalDonations, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Gross Volume', value: `$${Number(stats.totalGross).toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Net Revenue', value: `$${(Number(stats.totalGross) - Number(stats.totalNet)).toLocaleString()}`, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Command Center</h1>
        <p className="text-muted-foreground">Manage the Momentris platform infrastructure.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-8 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'stats' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-gray-900'
          }`}
        >
          <LayoutDashboard size={18} />
          Statistics
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'events' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-gray-900'
          }`}
        >
          <ShieldCheck size={18} />
          Events
          {events.filter(e => e.verificationStatus === 'PENDING').length > 0 && (
             <span className="ml-2 bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {events.filter(e => e.verificationStatus === 'PENDING').length}
             </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-gray-900'
          }`}
        >
          <Package size={18} />
          Fulfillment
          {orders.filter(o => o.fulfillmentStatus === 'PENDING').length > 0 && (
             <span className="ml-2 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {orders.filter(o => o.fulfillmentStatus === 'PENDING').length}
             </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('withdrawals')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'withdrawals' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-gray-900'
          }`}
        >
          <CreditCard size={18} />
          Withdrawals
          {withdrawals.filter(w => w.status === 'PENDING').length > 0 && (
             <span className="ml-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {withdrawals.filter(w => w.status === 'PENDING').length}
             </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'reports' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-gray-900'
          }`}
        >
          <Flag size={18} />
          Reports
          {reports.filter(r => r.status === 'PENDING').length > 0 && (
             <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {reports.filter(r => r.status === 'PENDING').length}
             </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'catalog' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-gray-900'
          }`}
        >
          <Package size={18} />
          Catalog
        </button>
      </div>

      {activeTab === 'stats' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {cards.map((card) => (
              <div key={card.name} className="bg-white p-6 rounded-2xl border shadow-sm">
                <div className={`h-10 w-10 ${card.bg} ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                  <card.icon size={20} />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{card.name}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-[2rem] border shadow-sm">
                <h3 className="text-lg font-bold mb-6">System Health</h3>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-2 w-2 rounded-full bg-green-500" />
                         <p className="text-sm font-medium">API Server</p>
                      </div>
                      <span className="text-xs font-bold text-green-600 uppercase tracking-tighter">Operational</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-2 w-2 rounded-full bg-green-500" />
                         <p className="text-sm font-medium">Database (SQLite)</p>
                      </div>
                      <span className="text-xs font-bold text-green-600 uppercase tracking-tighter">Operational</span>
                   </div>
                </div>
             </div>

             <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
                <h3 className="text-lg font-bold mb-6 text-primary">Pending Tasks</h3>
                <div className="space-y-4">
                   <div className="bg-white p-4 rounded-xl border flex items-center justify-between">
                      <div>
                         <p className="font-bold text-sm">Awaiting Payouts</p>
                         <p className="text-xs text-muted-foreground">{withdrawals.filter(w => w.status === 'PENDING').length} requests</p>
                      </div>
                      <button onClick={() => setActiveTab('withdrawals')} className="text-xs font-bold text-primary hover:underline">Review &rarr;</button>
                   </div>
                   <div className="bg-white p-4 rounded-xl border flex items-center justify-between">
                      <div>
                         <p className="font-bold text-sm">Registry Orders</p>
                         <p className="text-xs text-muted-foreground">{orders.filter(o => o.fulfillmentStatus === 'PENDING').length} to fulfill</p>
                      </div>
                      <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-primary hover:underline">View &rarr;</button>
                   </div>
                </div>
             </div>
          </div>
        </>
      )}

      {activeTab === 'orders' && (
         <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-muted/50">
                  <tr>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Item / Event</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Recipient & Address</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Buyer Info</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {orders.map((order) => (
                     <tr key={order.id} className="hover:bg-muted/5">
                        <td className="px-6 py-4">
                           <p className="font-bold text-sm">{order.itemName}</p>
                           <p className="text-xs text-primary font-bold">Qty: {order.quantity}</p>
                           <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[150px]">{order.event.title}</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-sm">{order.event.owner.fullName}</p>
                           <div className="flex items-start gap-1 mt-1 text-xs text-muted-foreground max-w-[200px]">
                              <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{order.event.owner.deliveryAddress || 'No address provided'}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-sm">{order.buyerName}</p>
                           <p className="text-xs text-muted-foreground">{order.buyerEmail}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              order.fulfillmentStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                              order.fulfillmentStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                           }`}>
                              {order.fulfillmentStatus}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <select 
                              className="text-xs border rounded-lg p-1 bg-white focus:ring-primary font-bold"
                              value={order.fulfillmentStatus}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                           >
                              <option value="PENDING">Pending</option>
                              <option value="PROCESSING">Processing</option>
                              <option value="SHIPPED">Shipped</option>
                              <option value="DELIVERED">Delivered</option>
                           </select>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {orders.length === 0 && <div className="py-24 text-center text-muted-foreground text-sm font-medium">No orders found.</div>}
         </div>
      )}

      {activeTab === 'withdrawals' && (
         <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-muted/50">
                  <tr>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">User / Cause</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Payout Details</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Amount</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {withdrawals.map((w) => {
                     const details = JSON.parse(w.payoutDetails || '{}');
                     return (
                        <tr key={w.id} className="hover:bg-muted/5">
                           <td className="px-6 py-4">
                              <p className="font-bold text-sm">{w.userEmail}</p>
                              <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[150px]">{w.eventTitle}</p>
                           </td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-2 mb-1">
                                 {w.payoutMethod === 'Mobile Money' ? <Smartphone size={14}/> : <Landmark size={14}/>}
                                 <span className="text-xs font-bold">{w.payoutMethod}</span>
                              </div>
                              <p className="text-[10px] text-muted-foreground">
                                 {details.bankName || details.provider} - {details.accountNumber || details.mobileNumber}
                              </p>
                              <p className="text-[10px] font-medium">{details.accountName}</p>
                           </td>
                           <td className="px-6 py-4 font-black text-sm">{w.currency} {w.amount}</td>
                           <td className="px-6 py-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                 w.status === 'PROCESSED' ? 'bg-green-100 text-green-800' :
                                 w.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                 'bg-yellow-100 text-yellow-800'
                              }`}>
                                 {w.status}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              {w.status === 'PENDING' ? (
                                 <div className="flex gap-2">
                                    <button 
                                       onClick={() => handleUpdateWithdrawalStatus(w.id, 'PROCESSED')}
                                       className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                       title="Mark as Processed"
                                    >
                                       <CheckCircle2 size={16} />
                                    </button>
                                    <button 
                                       onClick={() => handleUpdateWithdrawalStatus(w.id, 'REJECTED')}
                                       className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                       title="Reject"
                                    >
                                       <X size={16} />
                                    </button>
                                 </div>
                              ) : (
                                 <p className="text-[10px] text-muted-foreground font-medium italic">Handled</p>
                              )}
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
            {withdrawals.length === 0 && <div className="py-24 text-center text-muted-foreground text-sm font-medium">No withdrawal requests.</div>}
         </div>
      )}

      {activeTab === 'reports' && (
         <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
            <table className="w-full text-left">
               <thead className="bg-muted/50">
                  <tr>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reporter / Reason</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Target Fundraiser</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Details</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {reports.map((report) => (
                     <tr key={report.id} className={`hover:bg-muted/5 ${report.event.status === 'DELETED' ? 'opacity-50' : ''}`}>
                        <td className="px-6 py-4">
                           <p className="font-bold text-sm">{report.reporterEmail}</p>
                           <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-700 uppercase tracking-tighter mt-1">
                              {report.reason}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-sm text-gray-900">{report.event.title}</p>
                           <Link to={`/public-event/${report.event.slug}`} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 mt-1">
                              <ExternalLink size={10} /> View Page
                           </Link>
                        </td>
                        <td className="px-6 py-4">
                           <p className="text-xs text-muted-foreground max-w-[250px] line-clamp-2">{report.details || 'No additional details.'}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                           }`}>
                              {report.status}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex gap-2">
                              {report.event.status !== 'DELETED' && (
                                 <button 
                                    onClick={() => handleDeleteEvent(report.eventId)}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    title="Delete/Remove Event"
                                 >
                                    <Trash2 size={16} />
                                 </button>
                              )}
                              <button 
                                 onClick={() => handleUpdateReportStatus(report.id, 'RESOLVED')}
                                 className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-primary hover:text-white transition-all"
                                 title="Mark as Resolved"
                              >
                                 <CheckCircle2 size={16} />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {reports.length === 0 && <div className="py-24 text-center text-muted-foreground text-sm font-medium">No reports submitted.</div>}
         </div>
      )}

      {activeTab === 'events' && (
         <div className="bg-white rounded-[2rem] border shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b flex justify-between items-center bg-muted/5">
               <div>
                  <h3 className="font-bold">Event Verification</h3>
                  <p className="text-xs text-muted-foreground">Manage high-value event verification requests.</p>
               </div>
            </div>
            <table className="w-full text-left">
               <thead className="bg-muted/50">
                  <tr>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Event / Owner</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Goal</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Verification</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y">
                  {events.map((event) => (
                     <tr key={event.id} className="hover:bg-muted/5">
                        <td className="px-6 py-4">
                           <p className="font-bold text-sm">{event.title}</p>
                           <p className="text-xs text-muted-foreground">{event.owner.fullName} ({event.owner.email})</p>
                        </td>
                        <td className="px-6 py-4">
                           <p className="font-bold text-sm">{event.currency} {event.donationGoal.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              event.verificationStatus === 'VERIFIED' ? 'bg-green-100 text-green-800' :
                              event.verificationStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                              event.verificationStatus === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                           }`}>
                              {event.verificationStatus}
                           </span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex gap-2">
                              {event.verificationStatus !== 'VERIFIED' && (
                                 <button 
                                    onClick={() => handleToggleVerification(event.id, true, 'VERIFIED')}
                                    className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                    title="Verify Event"
                                 >
                                    <ShieldCheck size={16} />
                                 </button>
                              )}
                              {event.verificationStatus !== 'REJECTED' && (
                                 <button 
                                    onClick={() => handleToggleVerification(event.id, false, 'REJECTED')}
                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    title="Reject Verification"
                                 >
                                    <X size={16} />
                                 </button>
                              )}
                              <Link 
                                 to={`/public-event/${event.slug}`}
                                 className="p-2 bg-muted text-gray-600 rounded-lg hover:bg-muted/80 transition-colors"
                                 title="View Event"
                              >
                                 <ExternalLink size={16} />
                              </Link>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {events.length === 0 && <div className="py-24 text-center text-muted-foreground text-sm font-medium">No events found.</div>}
         </div>
      )}

      {activeTab === 'catalog' && (
         <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <h2 className="text-xl font-bold">Registry Catalog</h2>
                  <p className="text-xs text-muted-foreground font-medium">Manage items available for users to add to their registries.</p>
               </div>
               <div className="flex w-full md:w-auto gap-2">
                  <div className="relative flex-1 md:w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                     <input 
                        type="text"
                        placeholder="Search items..."
                        className="w-full rounded-xl border-border bg-white pl-9 pr-4 py-2 text-sm font-medium focus:ring-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
                  <button 
                     onClick={() => {
                        setEditingItem(null);
                        setNewItem({ 
                          name: '', 
                          description: '', 
                          category: 'Birthday', 
                          price: '', 
                          imageUrls: [] 
                        });
                        setIsAddingItem(!isAddingItem);
                     }}
                     className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-black hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap border-2 border-primary"
                  >
                     {isAddingItem ? <X size={18} className="stroke-[3]" /> : <Plus size={18} className="stroke-[3]" />}
                     {isAddingItem ? 'Cancel' : 'Add New Item'}
                  </button>
               </div>
            </div>

            {isAddingItem && (
               <div className="bg-white p-6 rounded-2xl border shadow-sm animate-in fade-in slide-in-from-top-4">
                  <h3 className="font-bold mb-6">{editingItem ? 'Update Catalog Item' : 'New Catalog Item'}</h3>
                  <form onSubmit={handleSaveItem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-4">
                        <div>
                           <label className="block text-[10px] font-black mb-1.5 uppercase tracking-widest text-muted-foreground">Item Name</label>
                           <input 
                              required 
                              className="w-full rounded-xl border-border bg-muted/20 px-4 py-2.5 text-sm font-bold"
                              placeholder="e.g. Premium Baby Stroller"
                              value={editingItem ? editingItem.name : newItem.name}
                              onChange={(e) => editingItem 
                                 ? setEditingItem({...editingItem, name: e.target.value})
                                 : setNewItem({...newItem, name: e.target.value})}
                           />
                        </div>
                        <div>
                           <label className="block text-[10px] font-black mb-1.5 uppercase tracking-widest text-muted-foreground">Event Category</label>
                           <select 
                              className="w-full rounded-xl border-border bg-muted/20 px-4 py-2.5 text-sm font-bold"
                              value={editingItem ? editingItem.category : newItem.category}
                              onChange={(e) => editingItem 
                                 ? setEditingItem({...editingItem, category: e.target.value})
                                 : setNewItem({...newItem, category: e.target.value})}
                           >
                              <option>Birthday</option>
                              <option>Wedding</option>
                              <option>Baby Shower</option>
                              <option>Memorial</option>
                              <option>Graduation</option>
                              <option>Medical Emergency</option>
                              <option>Other</option>
                           </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <label className="block text-[10px] font-black mb-1.5 uppercase tracking-widest text-muted-foreground">Price ($)</label>
                              <input 
                                 required 
                                 type="number"
                                 step="0.01"
                                 className="w-full rounded-xl border-border bg-muted/20 px-4 py-2.5 text-sm font-bold"
                                 value={editingItem ? editingItem.price : newItem.price}
                                 onChange={(e) => editingItem 
                                    ? setEditingItem({...editingItem, price: e.target.value})
                                    : setNewItem({...newItem, price: e.target.value})}
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black mb-1.5 uppercase tracking-widest text-muted-foreground">Upload Images (Max 5)</label>
                              <div className="relative">
                                 <input 
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    id="catalog-images"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                 />
                                 <label 
                                    htmlFor="catalog-images"
                                    className={`w-full rounded-xl border-2 border-dashed flex items-center justify-center gap-2 py-2 text-xs font-bold cursor-pointer transition-all ${
                                       uploading ? 'bg-muted border-muted-foreground' : 'border-primary/30 hover:border-primary bg-primary/5 text-primary'
                                    }`}
                                 >
                                    {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                                    {uploading ? 'Uploading...' : 'Choose Photos'}
                                 </label>
                              </div>
                           </div>
                        </div>
                        
                        {/* Image Previews */}
                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                           {(editingItem ? (editingItem.imageUrls || []) : (newItem.imageUrls || [])).map((url: string, index: number) => (
                              <div key={index} className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border">
                                 <img src={url} className="h-full w-full object-cover" alt="Preview" />
                                 <button 
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                                 >
                                    <X size={10} />
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div>
                           <label className="block text-[10px] font-black mb-1.5 uppercase tracking-widest text-muted-foreground">Description</label>
                           <textarea 
                              required 
                              className="w-full rounded-xl border-border bg-muted/20 px-4 py-2.5 text-sm font-medium"
                              rows={5}
                              placeholder="Describe the item and why it makes a great gift..."
                              value={editingItem ? editingItem.description : newItem.description}
                              onChange={(e) => editingItem 
                                 ? setEditingItem({...editingItem, description: e.target.value})
                                 : setNewItem({...newItem, description: e.target.value})}
                           />
                        </div>
                        <button 
                           disabled={saving}
                           className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                           {saving ? <div className="animate-spin h-5 w-5 border-2 border-primary-foreground border-b-transparent rounded-full" /> : <CheckCircle2 size={20} className="stroke-[3]" />}
                           {editingItem ? 'UPDATE CATALOG ITEM' : 'CREATE CATALOG ITEM'}
                        </button>
                     </div>
                  </form>
               </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {catalog.filter(item => 
                  item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  item.description.toLowerCase().includes(searchTerm.toLowerCase())
               ).map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl border shadow-sm group overflow-hidden flex flex-col">
                     <div className="aspect-square bg-muted/10 relative overflow-hidden border-b">
                        {item.imageUrls && item.imageUrls.length > 0 ? (
                           <>
                              <img src={item.imageUrls[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.name} />
                              {item.imageUrls.length > 1 && (
                                 <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                    +{item.imageUrls.length - 1} more
                                 </div>
                              )}
                           </>
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                              <Package size={48} />
                           </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                              onClick={() => handleEditItem(item)}
                              className="p-2 bg-white/90 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                              title="Edit"
                           >
                              <Edit2 size={14} />
                           </button>
                           <button 
                              onClick={() => handleDeleteCatalogItem(item.id)}
                              className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                              title="Delete"
                           >
                              <Trash2 size={14} />
                           </button>
                        </div>
                        <div className="absolute top-2 left-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm border border-primary/10">
                              {item.category}
                           </span>
                        </div>
                     </div>
                     <div className="p-4 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-1 gap-2">
                           <h4 className="font-bold text-gray-900 line-clamp-1 flex-1">{item.name}</h4>
                           <p className="font-black text-primary text-sm">${item.price}</p>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 font-medium flex-1">{item.description}</p>
                     </div>
                  </div>
               ))}
            </div>
            {catalog.length === 0 && !loading && (
               <div className="text-center py-24 bg-muted/5 rounded-3xl border-2 border-dashed">
                  <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-bold">No items in the catalog yet.</p>
                  <button onClick={() => setIsAddingItem(true)} className="mt-4 text-primary font-bold hover:underline">Add your first item</button>
               </div>
            )}
         </div>
      )}
    </div>
  );
};

export default AdminDashboard;
