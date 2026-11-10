import React from 'react';
import { StatusChip } from '@prototype/ui';
import { Wrench, CheckCircle2, Clock, MapPin, PackageCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TechnicianMyJobsPage() {
  const assignedJobs = [
    {
      jobNumber: 'JOB-20261110-000001',
      orderNumber: 'GH-20261110-000001',
      customerName: 'Juan Dela Cruz',
      customerPhone: '+639171234567',
      address: '123 Ayala Ave, Makati, Metro Manila',
      status: 'Scheduled' as const,
      timeWindow: '09:00 AM - 11:00 AM',
      items: [
        { sku: 'GH-CCTV-001', name: 'Dahua 4MP Entry IR Fixed Dome Camera', quantity: 2, loaded: false }
      ]
    }
  ];

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 min-h-screen bg-slate-100 pb-16">
      {/* Mobile Header */}
      <div className="bg-[#0e2378] text-white p-4 rounded-xl shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs text-blue-200 uppercase font-semibold">Technician Field App</span>
          <h1 className="text-lg font-bold">Arnel Mendoza (TECH-001)</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
          AM
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Today's Assigned Jobs (1)</h2>
        <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">Metro Manila</span>
      </div>

      {assignedJobs.map((job) => (
        <div key={job.jobNumber} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-mono text-xs font-bold text-[#0e2378]">{job.jobNumber}</span>
            <StatusChip status={job.status} />
          </div>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{job.timeWindow}</span>
            </div>
            <div className="flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{job.address}</span>
            </div>
          </div>

          {/* Hardware Loading Checklist Gate (W-03, OBJ-03) */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1">
                <PackageCheck className="w-4 h-4 text-amber-600" />
                Hardware Loading Check
              </span>
              <span className="text-amber-700 font-semibold text-[11px]">Unconfirmed</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Every ordered SKU must be confirmed loaded in the service vehicle before starting the job.
            </p>

            <div className="space-y-1.5 pt-1">
              {job.items.map((item) => (
                <div key={item.sku} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200">
                  <div className="pr-2">
                    <span className="font-semibold text-slate-800 block text-[11px]">{item.sku}</span>
                    <span className="text-slate-500 text-[10px] line-clamp-1">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-800 shrink-0">Qty: {item.quantity}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-slate-600" />
              Confirm All Hardware Loaded
            </button>
          </div>

          {/* Start Job Button - Disabled until confirmed loaded */}
          <div className="pt-2">
            <button
              disabled={true}
              title="Confirm all hardware loaded first"
              className="w-full bg-[#0e2378] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              Start Job (Requires Loading)
            </button>
          </div>
        </div>
      ))}

      {/* Bottom Bar Link */}
      <div className="text-center pt-4">
        <Link href="/" className="text-xs text-indigo-600 hover:underline font-semibold">
          ← Switch to Dispatcher Console
        </Link>
      </div>
    </div>
  );
}
