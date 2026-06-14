import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Search,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Pencil,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Filter,
  MoreVertical,
  ArrowUpRight,
  Package,
  Truck,
  MapPin,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import JsBarcode from 'jsbarcode';
import './VendorOrders.css';

// --- Barcode generator ---
const generateBarcodeBase64 = (value: string) => {
  const canvas = document.createElement('canvas');
  JsBarcode(canvas, value, {
    format: 'CODE128',
    lineColor: '#000',
    width: 2,
    height: 60,
    fontSize: 14,
    margin: 10,
    displayValue: true,
  });
  return canvas.toDataURL('image/png');
};

// --- CSV Export ---
const exportToCSV = (data: any[], filename: string) => {
  if (!data?.length) {
    alert('No orders to export');
    return;
  }

  const headers = ['Order ID', 'Customer Name', 'Date', 'Total Amount', 'Current Location', 'Estimated Delivery', 'Status'];
  const rows = data.map(o => [
    o.id,
    `"${o.customer.replace(/"/g, '""')}"`,
    `"${o.date.replace('\n', ' ').replace(/"/g, '""')}"`,
    o.amount,
    o.location,
    `"${o.delivery.replace('\n', ' ').replace(/"/g, '""')}"`,
    o.status
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

// --- PDF Styles ---
const invoiceStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: 'Helvetica' },
  header: { fontSize: 20, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  subHeader: { fontSize: 12, marginBottom: 8, textAlign: 'center' },
  section: { marginBottom: 20 },
  row: { flexDirection: 'row', marginBottom: 8 },
  label: { width: 140, fontWeight: 'bold' },
  value: { flex: 1 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000', paddingBottom: 6, marginBottom: 6 },
  tableRow: { flexDirection: 'row', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#eee' },
  tableCell: { flex: 1 },
  itemName: { flex: 3 },
  rightAlign: { textAlign: 'right' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 4 },
  barcodeContainer: { alignItems: 'center', marginVertical: 25 },
  barcode: { width: 240, height: 80 },
  total: { fontSize: 14, fontWeight: 'bold', textAlign: 'right', marginTop: 12 },
  note: { fontSize: 10, color: 'grey', textAlign: 'center', marginTop: 40, fontStyle: 'italic' },
});

const InvoicePDF = ({ order }: { order: any }) => {
  const barcodeDataUri = useMemo(
    () => generateBarcodeBase64(order.id.replace('#', '')),
    [order.id]
  );

  return (
    <Document>
      <Page size="A4" style={invoiceStyles.page}>
        <Text style={invoiceStyles.header}>Invoice for Order {order.id}</Text>
        <Text style={invoiceStyles.subHeader}>Invoice #: INV-{order.id.replace('#ORD-', '')}</Text>
        <Text style={invoiceStyles.subHeader}>Order #: {order.id}</Text>
        <Text style={invoiceStyles.subHeader}>Date: {order.date.replace('\n', ', ')}</Text>

        <View style={invoiceStyles.barcodeContainer}>
          <Image style={invoiceStyles.barcode} src={barcodeDataUri} />
        </View>

        <View style={invoiceStyles.section}>
          <View style={invoiceStyles.row}>
            <Text style={invoiceStyles.label}>Customer:</Text>
            <Text style={invoiceStyles.value}>{order.customer}</Text>
          </View>
          <View style={invoiceStyles.row}>
            <Text style={invoiceStyles.label}>Status:</Text>
            <Text style={invoiceStyles.value}>{order.status}</Text>
          </View>
        </View>

        <View style={invoiceStyles.section}>
          <View style={invoiceStyles.tableHeader}>
            <Text style={[invoiceStyles.tableCell, invoiceStyles.itemName]}>Item</Text>
            <Text style={[invoiceStyles.tableCell, invoiceStyles.rightAlign]}>Qty</Text>
            <Text style={[invoiceStyles.tableCell, invoiceStyles.rightAlign]}>Price</Text>
            <Text style={[invoiceStyles.tableCell, invoiceStyles.rightAlign]}>Total</Text>
          </View>
          {order.items.map((item: any, idx: number) => (
            <View key={idx} style={invoiceStyles.tableRow}>
              <Text style={[invoiceStyles.tableCell, invoiceStyles.itemName]}>{item.name}</Text>
              <Text style={[invoiceStyles.tableCell, invoiceStyles.rightAlign]}>{item.qty}</Text>
              <Text style={[invoiceStyles.tableCell, invoiceStyles.rightAlign]}>{item.price}</Text>
              <Text style={[invoiceStyles.tableCell, invoiceStyles.rightAlign]}>{item.total}</Text>
            </View>
          ))}
        </View>

        <View style={invoiceStyles.section}>
          <View style={invoiceStyles.totalRow}>
            <Text style={{ fontWeight: 'bold' }}>Total</Text>
            <Text style={{ marginLeft: 30, fontWeight: 'bold' }}>{order.amount}</Text>
          </View>
        </View>

        <Text style={invoiceStyles.note}>This is a system-generated invoice.</Text>
      </Page>
    </Document>
  );
};

const VendorOrders = () => {
  const [orders, setOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('vendorOrders');
    return saved ? JSON.parse(saved) : [
      {
        id: '#ORD-9021',
        customer: 'Sarah Jenkins',
        date: 'Oct 24,\n2023',
        amount: '$124.50',
        location: 'Warehouse A',
        delivery: 'Oct 26,\n10:00 AM',
        status: 'Awaiting Approval',
        urgency: 'high',
        billingAddress: '123 Main St, Anytown, USA',
        shippingAddress: '123 Main St, Anytown, USA',
        items: [{ name: 'Sandalwood & Saffron Magic', qty: 1, price: '$100.00', total: '$100.00' }],
        subtotal: '$100.00',
        platformFee: '$5.00',
        exchangeCredit: '-$0.00',
        igst: '$19.50',
      },
      {
        id: '#ORD-9018',
        customer: 'Michael Chen',
        date: 'Oct 23,\n2023',
        amount: '$89.00',
        location: 'Local Hub',
        delivery: 'Oct 24,\n02:30 PM',
        status: 'Shipped',
        urgency: 'normal',
        billingAddress: '456 Elm St, Cityville, USA',
        shippingAddress: '456 Elm St, Cityville, USA',
        items: [{ name: 'Product B', qty: 2, price: '$40.00', total: '$80.00' }],
        subtotal: '$80.00',
        platformFee: '$4.00',
        exchangeCredit: '-$0.00',
        igst: '$5.00',
      },
      {
        id: '#ORD-9015',
        customer: 'Elena Rodriguez',
        date: 'Oct 22,\n2023',
        amount: '$210.20',
        location: 'Sorting Facility',
        delivery: 'Oct 25,\n11:15 AM',
        status: 'Processing',
        urgency: 'normal',
        billingAddress: '789 Oak St, Townburg, USA',
        shippingAddress: '789 Oak St, Townburg, USA',
        items: [{ name: 'Product C', qty: 1, price: '$200.00', total: '$200.00' }],
        subtotal: '$200.00',
        platformFee: '$10.00',
        exchangeCredit: '-$10.00',
        igst: '$10.20',
      },
      {
        id: '#ORD-9012',
        customer: 'David Smith',
        date: 'Oct 22,\n2023',
        amount: '$45.15',
        location: 'Delivered',
        delivery: 'Oct 23,\n09:45 AM',
        status: 'Delivered',
        urgency: 'normal',
        billingAddress: '101 Pine St, Villagetown, USA',
        shippingAddress: '101 Pine St, Villagetown, USA',
        items: [{ name: 'Product D', qty: 3, price: '$15.00', total: '$45.00' }],
        subtotal: '$45.00',
        platformFee: '$2.00',
        exchangeCredit: '-$5.00',
        igst: '$3.15',
      },
      {
        id: '#ORD-9009',
        customer: 'Jessica Wu',
        date: 'Oct 21,\n2023',
        amount: '$156.00',
        location: 'Warehouse B',
        delivery: 'Oct 24,\n04:00 PM',
        status: 'Awaiting Approval',
        urgency: 'high',
        billingAddress: '202 Maple St, Citytown, USA',
        shippingAddress: '202 Maple St, Citytown, USA',
        items: [{ name: 'Product E', qty: 1, price: '$150.00', total: '$150.00' }],
        subtotal: '$150.00',
        platformFee: '$6.00',
        exchangeCredit: '-$0.00',
        igst: '$0.00',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('vendorOrders', JSON.stringify(orders));
  }, [orders]);

  const [activeTab, setActiveTab] = useState('All Orders');
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [cancellationModal, setCancellationModal] = useState<{ id: string, reason: string } | null>(null);

  const filteredOrders = useMemo(() => {
    let result = activeTab === 'All Orders'
      ? orders
      : orders.filter(order => order.status === activeTab);

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(order =>
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q)
      );
    }
    return result;
  }, [orders, activeTab, searchQuery]);

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'awaiting approval': return 'status-awaiting';
      case 'pending': return 'status-pending';
      case 'shipped': return 'status-shipped';
      case 'processing': return 'status-processing';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const handleApprove = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Processing' } : o));
  };

  const handleCancel = (id: string, reason: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'Cancelled', cancellationReason: reason } : o));
    setCancellationModal(null);
  };

  const handleBulkApprove = () => {
    setOrders(prev => prev.map(o => 
      selectedOrders.includes(o.id) && o.status === 'Awaiting Approval' 
        ? { ...o, status: 'Processing' } 
        : o
    ));
    setSelectedOrders([]);
  };

  const handleBulkMarkShipped = () => {
    setOrders(prev => prev.map(o => 
      selectedOrders.includes(o.id) && o.status === 'Processing' 
        ? { ...o, status: 'Shipped' } 
        : o
    ));
    setSelectedOrders([]);
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  const tabs = ['All Orders', 'Awaiting Approval', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-black/40 text-sm mt-1">Track and fulfill your customer orders efficiently</p>
        </div>
        <div className="flex gap-3">
          <button 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-black/5 px-4 py-2 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm"
            onClick={() => exportToCSV(filteredOrders, `orders_${new Date().toISOString().split('T')[0]}.csv`)}
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
          <div className="flex border-b border-black/5 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 sm:px-8 py-4 sm:py-5 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab ? 'text-black' : 'text-black/40 hover:text-black'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="order-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-8 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
              <input 
                type="text" 
                placeholder="Search orders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/5 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-black/10"
              />
            </div>
            
            <AnimatePresence>
              {selectedOrders.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-3 bg-black text-white px-4 py-2 rounded-xl shadow-lg overflow-x-auto whitespace-nowrap"
                >
                  <span className="text-xs font-bold">{selectedOrders.length} Selected</span>
                  <div className="h-4 w-px bg-white/20 mx-2" />
                  <button onClick={handleBulkApprove} className="text-xs font-bold hover:text-emerald-400 transition-colors">Approve All</button>
                  <button onClick={handleBulkMarkShipped} className="text-xs font-bold hover:text-blue-400 transition-colors">Mark Shipped</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="py-4 px-8 text-left">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 accent-black rounded"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left py-4 px-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">Order ID</th>
                  <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Customer</th>
                  <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Date</th>
                  <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Amount</th>
                  <th className="text-left py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Status</th>
                  <th className="text-right py-4 px-8 text-[10px] font-bold text-black/40 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-black/40">
                      <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p className="font-bold">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-black/5 hover:bg-black/5 transition-colors group">
                      <td className="py-5 px-8">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 accent-black rounded"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleSelectOrder(order.id)}
                        />
                      </td>
                      <td className="py-5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{order.id}</span>
                          {order.urgency === 'high' && (
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="High Urgency" />
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-8 text-sm text-black/60">{order.customer}</td>
                      <td className="py-5 px-8 text-sm text-black/40">{order.date.replace('\n', ' ')}</td>
                      <td className="py-5 px-8 text-sm font-bold">{order.amount}</td>
                      <td className="py-5 px-8">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-5 px-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status === 'Awaiting Approval' && (
                            <>
                              <button 
                                onClick={() => handleApprove(order.id)}
                                className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all"
                                title="Approve Order"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => setCancellationModal({ id: order.id, reason: '' })}
                                className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all"
                                title="Reject Order"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          
                          <button className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black">
                            <Eye className="w-4 h-4" />
                          </button>

                          <PDFDownloadLink
                            document={<InvoicePDF order={order} />}
                            fileName={`invoice-${order.id.replace('#', '')}.pdf`}
                          >
                            {({ loading }) => (
                              <button className="p-2 hover:bg-black/10 rounded-lg transition-colors text-black/60 hover:text-black" disabled={loading}>
                                <Download className="w-4 h-4" />
                              </button>
                            )}
                          </PDFDownloadLink>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cancellation Modal */}
      <AnimatePresence>
        {cancellationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-2">Cancel Order</h2>
              <p className="text-black/40 text-sm mb-6">Please provide a reason for cancelling order {cancellationModal.id}.</p>
              
              <textarea 
                className="w-full bg-black/5 border-none rounded-2xl p-4 text-sm min-h-[120px] focus:ring-2 focus:ring-black/10 mb-6"
                placeholder="Reason for cancellation (e.g., Out of stock, Customer request)..."
                value={cancellationModal.reason}
                onChange={(e) => setCancellationModal({ ...cancellationModal, reason: e.target.value })}
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => handleCancel(cancellationModal.id, cancellationModal.reason)}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-colors"
                >
                  Confirm Cancellation
                </button>
                <button 
                  onClick={() => setCancellationModal(null)}
                  className="flex-1 bg-black/5 text-black py-3 rounded-xl font-bold text-sm hover:bg-black/10 transition-colors"
                >
                  Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorOrders;
