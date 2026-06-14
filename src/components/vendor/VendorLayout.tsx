import React from 'react';
import { motion } from 'motion/react';

interface VendorLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const VendorLayout: React.FC<VendorLayoutProps> = ({ children, title = "Vendor Portal" }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans">
      <header className="bg-white border-b border-black/5 px-8 py-4 sticky top-0 z-10 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      </header>
      <main className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default VendorLayout;
