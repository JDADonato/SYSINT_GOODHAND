import React from 'react';
import Link from 'next/link';
import { StatusChip } from '@prototype/ui';
import { Briefcase, Users, Calendar, AlertTriangle, ShieldCheck, CheckSquare } from 'lucide-react';
import type { JobStatus } from '@prototype/contract';

const sampleJobs: Array<{
  jobNumber: string;
  orderNumber: string;
  customerName: string;
  serviceArea: string;
  status: JobStatus;
  technicianName?: string;
  itemsCount: number;
}> = [
  {
    jobNumber: 'JOB-20261110-000001',
    orderNumber: 'GH-20261110-000001',
    customerName: 'Juan Dela Cruz',
    serviceArea: 'Metro Manila (Makati)',
    status: 'Scheduled',
    technicianName: 'Arnel Mendoza',
    itemsCount: 2
  },
  {
    jobNumber: 'JOB-20261110-000002',
    orderNumber: 'GH-20261110-000002',
    customerName: 'Maria Santos',
    serviceArea: 'Cavite (Bacoor)',
    status: 'Pending Scheduling',
    itemsCount: 1
  },
  {
    jobNumber: 'JOB-20261110-000003',
    orderNumber: 'GH-20261110-000003',
    customerName: 'Robert Tan',
    serviceArea: 'Laguna (Santa Rosa)',
    status: 'In Progress',
    technicianName: 'Danilo Reyes',
    itemsCount: 4
  }
];

export default function FSMDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Console Navigation */}
      <header className="bg-slate-900 text-white py-3.5 px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-indigo-400" />
            <div>
              <span className="text-lg font-bold tracking-tight">FSM Dispatch Console</span>
              <span className="block text-xs text-slate-400">System B - Field Service Operations</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="text-white hover:text-indigo-300 transition-colors">Jobs Queue</Link>
            <Link href="/schedule" className="text-slate-300 hover:text-indigo-300 transition-colors">Schedule View</Link>
            <Link href="/technicians" className="text-slate-300 hover:text-indigo-300 transition-colors">Technicians</Link>
            <Link href="/demo" className="bg-indigo-600 text-white px-3 py-1.5 rounded-md font-semibold hover:bg-indigo-500 transition-colors">Demo Panel</Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8 w-full space-y-8">
        {/* Status Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Scheduling</span>
              <span className="block text-2xl font-bold text-amber-600 mt-1">1</span>
            </div>
            <AlertTriangle className="w-8 h-8 text-amber-500/30" />
          </div>
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled Today</span>
              <span className="block text-2xl font-bold text-blue-600 mt-1">1</span>
            </div>
            <Calendar className="w-8 h-8 text-blue-500/30" />
          </div>
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</span>
              <span className="block text-2xl font-bold text-indigo-600 mt-1">1</span>
            </div>
            <CheckSquare className="w-8 h-8 text-indigo-500/30" />
          </div>
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Technicians</span>
              <span className="block text-2xl font-bold text-emerald-600 mt-1">6</span>
            </div>
            <Users className="w-8 h-8 text-emerald-500/30" />
          </div>
        </div>

        {/* Jobs Queue Table */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h2 className="text-base font-bold text-slate-900">Active Field Jobs</h2>
              <p className="text-xs text-slate-500">Real-time installation assignments dispatched from System A</p>
            </div>
            <span className="text-xs font-medium text-slate-600 bg-slate-200/70 px-2.5 py-1 rounded">
              GIST Exclusion Constraint Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-xs uppercase font-semibold text-slate-600 border-b">
                <tr>
                  <th className="px-5 py-3">Job Number</th>
                  <th className="px-5 py-3">Order Number</th>
                  <th className="px-5 py-3">Customer & Area</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Technician</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sampleJobs.map((job) => (
                  <tr key={job.jobNumber} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-indigo-700 font-mono text-xs">{job.jobNumber}</td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">{job.orderNumber}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-900">{job.customerName}</div>
                      <div className="text-xs text-slate-500">{job.serviceArea}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600">{job.itemsCount} unit(s)</td>
                    <td className="px-5 py-3.5 text-xs font-medium text-slate-800">
                      {job.technicianName || <span className="text-slate-400 italic">Unassigned</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusChip status={job.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
