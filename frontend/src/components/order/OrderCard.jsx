import React from 'react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Package } from 'lucide-react';

export default function OrderCard({ order }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-[#2874f0]" />
          <span className="text-xs font-bold text-slate-800">Order ID: {order.orderNumber}</span>
        </div>
        <span className="text-xs text-slate-500">{formatDate(order.createdAt)}</span>
      </div>

      <div className="flex justify-between items-center text-sm">
        <div>
          <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
            {order.orderStatus || 'CONFIRMED'}
          </span>
        </div>
        <div className="font-bold text-slate-900">
          Total: {formatCurrency(order.totalAmount)}
        </div>
      </div>
    </div>
  );
}