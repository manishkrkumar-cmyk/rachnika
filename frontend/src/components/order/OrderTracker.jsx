import React from 'react';
import { Check, Truck, PackageCheck } from 'lucide-react';

export default function OrderTracker({ status = 'PLACED' }) {
  const steps = [
    { label: 'Placed', icon: Check, completed: true },
    { label: 'Shipped', icon: Truck, completed: status === 'SHIPPED' || status === 'DELIVERED' },
    { label: 'Delivered', icon: PackageCheck, completed: status === 'DELIVERED' }
  ];

  return (
    <div className="flex items-center justify-between max-w-md mx-auto my-6 px-4">
      {steps.map((step, idx) => {
        const IconComponent = step.icon;
        return (
          <div key={idx} className="flex flex-col items-center relative flex-1">
            {idx !== 0 && (
              <div
                className={`absolute top-4 -left-1/2 right-1/2 h-0.5 ${
                  step.completed ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
            )}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white z-10 ${
                step.completed ? 'bg-emerald-600' : 'bg-slate-300 text-slate-600'
              }`}
            >
              <IconComponent className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold mt-1 text-slate-700">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}