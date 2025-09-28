import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import Navbar from '@/components/Navbar';
import Dashboard from './Dashboard';

const Index = () => {
  const { user, loading } = useAuth();
  const { addIncomeEntry, incomeEntries, expenseEntries, dishEntries } = useSupabaseData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  const exportToExcel = () => {
    // This will be handled by the Navbar component
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar 
        onIncomeSubmit={addIncomeEntry}
        onExportExcel={exportToExcel}
        incomeEntries={incomeEntries}
        expenseEntries={expenseEntries}
        dishEntries={dishEntries}
      />
      <Dashboard />
    </div>
  );
};

export default Index;