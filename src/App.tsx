import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FloatingCartBar } from './components/FloatingCartBar';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { OrdersView } from './components/OrdersView';
import { OffersView } from './components/OffersView';
import { ProfileView } from './components/ProfileView';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AuthModal } from './components/AuthModal';
import { AddressModal } from './components/AddressModal';
import { AdminDashboard } from './components/AdminDashboard';

const MainLayout: React.FC = () => {
  const { activeTab, isAdminMode } = useApp();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Application Header */}
      <Header onOpenAddressModal={() => setIsAddressModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-3.5 sm:px-6 pt-3 sm:pt-5 pb-8">
        {isAdminMode ? (
          <AdminDashboard />
        ) : (
          <>
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'services' && <CatalogView />}
            {activeTab === 'orders' && <OrdersView />}
            {activeTab === 'offers' && <OffersView />}
            {activeTab === 'profile' && (
              <ProfileView onOpenAddresses={() => setIsAddressModalOpen(true)} />
            )}
          </>
        )}
      </main>

      {/* Persistent Floating Bottom Cart Bar (if items in cart) */}
      {!isAdminMode && <FloatingCartBar />}

      {/* Persistent Mobile & Desktop Bottom Navigation */}
      {!isAdminMode && <BottomNav />}

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <OrderSuccessModal />
      <OrderTrackingModal />
      <AuthModal />
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

