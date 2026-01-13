// File: src/components/dashboard/main-dashboard.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GlobalHeader } from './global-header';
import { BottomNavigation } from './bottom-navigation';
import { InventoryScreen } from '@/components/inventory/inventory-screen';
import { DashboardScreen } from './dashboard-screen';
import { OrdersScreen } from '../orders/orders-screen';
import { TabHeader } from '../tab-headers/tab-header';
import { InventorySearch } from '../inventory/inventory-search';
import { InventoryFilters } from '../inventory/inventory-filters';
import { AddProductScreen } from '../inventory/add-product-screen';
import { OrdersFilters } from '../orders/orders-filters';
import { MoreScreen } from '../more/more-screen';
import { GeminiAiScreen } from '../gemini/gemini-ai-screen';
import { GeminiAiHeader } from '../gemini/gemini-ai-header';
import { ContainerSelectorScreen } from '../inventory/container-selector-screen';
import { inventoryItems } from '../inventory/inventory-placeholder-data';
import { AccountScreen } from '../more/account-screen';
import { ExpensesScreen } from '../more/expenses-screen';
import { ReportsScreen } from '../more/reports-screen';
import { SetupScreen } from '../more/setup-screen';
import { AddExpenseScreen } from '../more/add-expense-screen';

export function MainDashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeMoreScreen, setActiveMoreScreen] = useState<string | null>(null);
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');
  const [ordersSearchQuery, setOrdersSearchQuery] = useState('');
  const [inventoryFilters, setInventoryFilters] = useState<Set<string>>(new Set());
  const [ordersFilters, setOrdersFilters] = useState<Set<string>>(new Set());
  const [isContainerSelectorOpen, setIsContainerSelectorOpen] = useState(false);


  const handleScroll = useCallback((scrollY: number, top: number) => {
    const newOpacity = Math.min(Math.max(scrollY / (top > 0 ? top : 1), 0), 1);
    setHeaderOpacity(newOpacity);
  }, []);

  const handleNavChange = (nav: string) => {
    setActiveNav(nav);
    setActiveMoreScreen(null); // Reset more screen when changing main nav
    if (isAddProductOpen) {
      // This is a blocked component. Do not attempt to modify it.
    }
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    setHeaderOpacity(0);
  };

  const handleStatCardClick = (cardTitle: string) => {
    if (cardTitle === 'Inventory') {
      setActiveNav('listings');
      setInventoryFilters(new Set(['Stock']));
    } else if (cardTitle === 'Listed') {
      setActiveNav('listings');
      setInventoryFilters(new Set(['Active']));
    } else if (cardTitle === 'Sold') {
      setActiveNav('orders');
    }
  };

  const handleSelectContainer = (container: string) => {
    setInventorySearchQuery(container);
    setIsContainerSelectorOpen(false);
  };

  const handleMoreItemClick = (item: string) => {
    if (item !== 'Log Out') {
      setActiveMoreScreen(item);
    } else {
      // Handle Log Out logic here
      console.log('Log out clicked');
    }
  };

  const renderHeader = () => {
    if (activeNav === 'more' && activeMoreScreen) {
        return <TabHeader title={activeMoreScreen} opacity={1} />;
    }
    
    switch (activeNav) {
      case 'dashboard':
        return <GlobalHeader opacity={headerOpacity} />;
      case 'inventory':
      case 'listings':
        return (
          <TabHeader
            title="Inventory"
            opacity={headerOpacity}
            onAddClick={() => setIsAddProductOpen(true)}
          >
            <InventorySearch 
              value={inventorySearchQuery} 
              onChange={setInventorySearchQuery} 
              onSelectorClick={() => setIsContainerSelectorOpen(true)}
            />
            <InventoryFilters activeFilters={inventoryFilters} onFilterChange={setInventoryFilters} />
          </TabHeader>
        );
      case 'orders':
        return (
          <TabHeader title="Orders" opacity={headerOpacity}>
            <InventorySearch value={ordersSearchQuery} onChange={setOrdersSearchQuery} placeholder="Search orders..."/>
            <OrdersFilters activeFilters={ordersFilters} onFilterChange={setOrdersFilters} />
          </TabHeader>
        );
      case 'more':
        return <TabHeader title="More" opacity={1} />;
      case 'gemini':
        return <GeminiAiHeader />;
      default:
        return <GlobalHeader opacity={1} />;
    }
  };

  const renderMoreScreen = () => {
    if (activeNav !== 'more') return null;

    if (activeMoreScreen) {
      switch (activeMoreScreen) {
        case 'Account':
          return <AccountScreen />;
        case 'Expenses':
          return <ExpensesScreen onAddExpenseClick={() => setIsAddExpenseOpen(true)} />;
        case 'Reports':
          return <ReportsScreen />;
        case 'Setup':
          return <SetupScreen />;
        default:
          return <MoreScreen onMoreItemClick={handleMoreItemClick} />;
      }
    }
    return <MoreScreen onMoreItemClick={handleMoreItemClick} />;
  }

  if (isAddProductOpen) {
    return <AddProductScreen onClose={() => setIsAddProductOpen(false)} />;
  }
  
  if (isAddExpenseOpen) {
    return <AddExpenseScreen onClose={() => setIsAddExpenseOpen(false)} />;
  }

  if (isContainerSelectorOpen) {
    return <ContainerSelectorScreen 
      inventoryItems={inventoryItems}
      onClose={() => setIsContainerSelectorOpen(false)}
      onSelectContainer={handleSelectContainer}
    />
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0 bg-perforation z-0"></div>
      <div className="absolute inset-0 bg-noise z-0"></div>

      {renderHeader()}

      <div
        style={{ display: activeNav === 'dashboard' ? 'block' : 'none' }}
      >
        <DashboardScreen onScroll={handleScroll} onStatCardClick={handleStatCardClick} />
      </div>

      <div
        style={{ display: ['inventory', 'listings'].includes(activeNav) ? 'block' : 'none' }}
      >
        <InventoryScreen 
            onScroll={handleScroll} 
            searchQuery={inventorySearchQuery} 
            activeFilters={inventoryFilters}
            setActiveFilters={setInventoryFilters}
        />
      </div>

      <div
        style={{ display: activeNav === 'orders' ? 'block' : 'none' }}
      >
        <OrdersScreen onScroll={handleScroll} searchQuery={ordersSearchQuery} activeFilters={ordersFilters} />
      </div>

      <div
        style={{ display: activeNav === 'more' ? 'block' : 'none' }}
      >
        {renderMoreScreen()}
      </div>

      <div
        style={{ display: activeNav === 'gemini' ? 'block' : 'none' }}
      >
        <GeminiAiScreen />
      </div>

      <BottomNavigation activeItem={activeNav} setActiveItem={handleNavChange} />
    </div>
  );
}
