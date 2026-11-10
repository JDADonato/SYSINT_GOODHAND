import React from 'react';
import Link from 'next/link';
import { ordersService } from '@/lib/services/orders-service';
import { StatusChip } from '@prototype/ui';
import { ShieldCheck, Calendar, Wrench, CheckCircle2, ArrowRight } from 'lucide-react';
import type { JobStatus } from '@prototype/contract';

export default async function OrderDetailPage({
  params
}: {
  params: Promise<{ orderNumber: string }>
}) {
  const { orderNumber } = await params;
  const order = ordersService.getOrder(orderNumber);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-slate-500">Order Confirmed</span>
          <h1 className="text-2xl font-extrabold text-[#0e2378] font-mono">{orderNumber}</h1>
          <p className="text-xs text-slate-600 mt-0.5">Thank you for your purchase. Professional installation is queued.</p>
        </div>
        <div className="flex items-center gap-2">
          {order?.installationStatus ? (
            <StatusChip status={order.installationStatus as JobStatus} />
          ) : (
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-semibold">
              Paid (Ready for Pickup)
            </span>
          )}
        </div>
      </div>

      {/* Installation Timeline Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
          <Wrench className="w-5 h-5 text-[#0e2378]" />
          Field Service Installation Progress
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Assigned Technician</span>
            <div className="font-bold text-sm text-slate-900">
              {order?.technicianName || 'Pending Dispatcher Assignment'}
            </div>
            <span className="text-[11px] text-slate-500 block">System B Field Operations</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Scheduled Window</span>
            <div className="font-bold text-sm text-slate-900">
              {order?.scheduledStart
                ? `${new Date(order.scheduledStart).toLocaleDateString()} (${new Date(order.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(order.scheduledEnd!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
                : 'Pending Scheduling'}
            </div>
            <span className="text-[11px] text-slate-500 block">Confirmed via OP-05 Webhook</span>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Hardware Warranty</span>
            <div className="font-bold text-sm text-emerald-700 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              12 Months Active
            </div>
            <span className="text-[11px] text-slate-500 block">Standard Coverage</span>
          </div>
        </div>
      </div>

      {/* Ordered Equipment */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b pb-3">Ordered Equipment</h2>
        <div className="divide-y divide-slate-100 text-sm">
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Dahua DH-IPC-HDBW1431E-S4 4MP Fixed Dome Camera</span>
              <span className="block text-xs text-slate-500">SKU: GH-CCTV-001 • Quantity: 2</span>
            </div>
            <span className="font-bold text-[#D60000]">₱7,700.00</span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center justify-between pt-2">
        <Link href="/" className="text-xs font-semibold text-[#0e2378] hover:underline">
          ← Return to Store Home
        </Link>
        <Link
          href={`http://localhost:3100`}
          className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg border border-indigo-200 transition-colors flex items-center gap-1.5"
        >
          View in FSM Dispatcher Console (System B)
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
