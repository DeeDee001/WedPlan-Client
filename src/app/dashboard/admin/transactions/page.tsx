'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Transaction } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { toast } from 'sonner';
import { CreditCard, Calendar, DollarSign, Building2 } from 'lucide-react';

export default function PlatformTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get<{ success: boolean; transactions: Transaction[] }>('/admin/transactions');
        if (res.success && res.transactions) {
          setTransactions(res.transactions);
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to load transaction audit logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading financial transactions audit log..." />;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Platform Transactions</h1>
        <p className="mt-1 text-sm text-stone-600">
          Audited log of vendor premium subscription transactions processed via Stripe. Read-only record.
        </p>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-rose-100 shadow-xs max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <CreditCard className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">No Transactions Recorded</h3>
          <p className="text-stone-600 text-sm">
            No completed Stripe subscriptions have been logged yet.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-rose-50/50 text-[11px] font-bold uppercase tracking-wider text-stone-500 border-b border-rose-100">
                <tr>
                  <th className="px-6 py-4">Vendor Partner</th>
                  <th className="px-6 py-4">Subscription Plan</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Stripe Session ID</th>
                  <th className="px-6 py-4">Payment Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-50">
                {transactions.map((tx) => {
                  const vendor = typeof tx.vendorId === 'object' ? tx.vendorId : null;
                  const vendorName = vendor?.businessName || vendor?.name || 'Vendor';

                  return (
                    <tr key={tx._id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-stone-900">
                        {vendorName}
                        {vendor?.email && <p className="text-xs text-stone-500 font-normal">{vendor.email}</p>}
                      </td>

                      <td className="px-6 py-4">
                        <Badge variant="premium">{tx.plan}</Badge>
                      </td>

                      <td className="px-6 py-4 font-serif font-bold text-stone-900">
                        ${tx.amount.toFixed(2)} <span className="text-xs uppercase text-stone-400">{tx.currency}</span>
                      </td>

                      <td className="px-6 py-4 text-xs font-mono text-stone-500 truncate max-w-xs">
                        {tx.stripeSessionId}
                      </td>

                      <td className="px-6 py-4">
                        <Badge variant={tx.status === 'completed' ? 'approved' : 'pending'}>
                          {tx.status}
                        </Badge>
                      </td>

                      <td className="px-6 py-4 text-right text-xs text-stone-500">
                        {new Date(tx.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
