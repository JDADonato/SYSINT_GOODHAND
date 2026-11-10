'use client';

import React, { useState } from 'react';
import { StatusChip } from '@prototype/ui';
import { Wrench, CheckCircle2, Clock, MapPin, PackageCheck, AlertCircle, CheckSquare, Plus } from 'lucide-react';
import Link from 'next/link';

export default function TechnicianMyJobsPage() {
  const [jobStatus, setJobStatus] = useState<'Scheduled' | 'In Progress' | 'Completed'>('Scheduled');
  const [loadedConfirmed, setLoadedConfirmed] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Completion form state
  const [serial1, setSerial1] = useState('SN-CAM-4MP-8831');
  const [serial2, setSerial2] = useState('SN-CAM-4MP-8832');
  const [returnedQty, setReturnedQty] = useState(0);
  const [completionNotes, setCompletionNotes] = useState('Clean installation completed. Cables concealed inside conduits.');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleStartJob = () => {
    if (!loadedConfirmed) return;
    setJobStatus('In Progress');
  };

  const handleCompleteJob = (e: React.FormEvent) => {
    e.preventDefault();
    setJobStatus('Completed');
    setShowCompletionModal(false);
    setSubmittedMessage('Job Completed! OP-07 and OP-08 dispatched to System A.');
  };

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

      {submittedMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{submittedMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Assigned Installation</h2>
        <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">Metro Manila</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="font-mono text-xs font-bold text-[#0e2378]">JOB-20261110-000001</span>
          <StatusChip status={jobStatus} />
        </div>

        <div className="space-y-1.5 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-semibold text-slate-900">
            <Clock className="w-4 h-4 text-blue-600 shrink-0" />
            <span>09:00 AM - 11:00 AM (2 Hours)</span>
          </div>
          <div className="flex items-start gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>123 Ayala Ave, Makati, Metro Manila</span>
          </div>
        </div>

        {/* 1. Hardware Loading Checklist Gate (W-03, TC-34, OBJ-03) */}
        {jobStatus === 'Scheduled' && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1">
                <PackageCheck className="w-4 h-4 text-amber-600" />
                Hardware Loading Check
              </span>
              <span className={`text-[11px] font-semibold ${loadedConfirmed ? 'text-emerald-700' : 'text-amber-700'}`}>
                {loadedConfirmed ? 'Confirmed Loaded' : 'Unconfirmed'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Every ordered SKU must be confirmed loaded in the vehicle before starting the job.
            </p>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-800 block text-[11px]">GH-CCTV-001</span>
                  <span className="text-slate-500 text-[10px]">Dahua 4MP Fixed Dome Camera</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 text-xs">Qty: 2</span>
                  <input
                    type="checkbox"
                    checked={loadedConfirmed}
                    onChange={e => setLoadedConfirmed(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0e2378]"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setLoadedConfirmed(!loadedConfirmed)}
              className={`w-full text-xs font-semibold py-2 rounded transition-colors flex items-center justify-center gap-1.5 ${
                loadedConfirmed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {loadedConfirmed ? 'Hardware Loaded (Confirmed)' : 'Confirm All Hardware Loaded'}
            </button>
          </div>
        )}

        {/* Action Button: Start Job (Disabled until loadedConfirmed) */}
        {jobStatus === 'Scheduled' && (
          <div className="pt-2">
            <button
              onClick={handleStartJob}
              disabled={!loadedConfirmed}
              title={loadedConfirmed ? 'Start Job' : 'Confirm hardware loading first'}
              className="w-full bg-[#0e2378] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#193893] text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Wrench className="w-4 h-4" />
              Start Job (Transitions to In Progress)
            </button>
          </div>
        )}

        {/* Action Button: Complete Job (Active when In Progress) */}
        {jobStatus === 'In Progress' && (
          <div className="pt-2 space-y-2">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900">
              Job is currently <strong>In Progress</strong>. Complete equipment installation and record all device serial numbers.
            </div>
            <button
              onClick={() => setShowCompletionModal(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              Fill Completion Report (Serials & Parts)
            </button>
          </div>
        )}

        {jobStatus === 'Completed' && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <span className="font-bold text-xs text-emerald-900 block">Job Successfully Completed</span>
            <span className="text-[11px] text-emerald-700">12-Month warranty activated in System A</span>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="border-b pb-2 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Installation Completion Report</h3>
              <button onClick={() => setShowCompletionModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
            </div>

            <form onSubmit={handleCompleteJob} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dahua 4MP Dome - Unit 1 Serial Number</label>
                <input
                  type="text"
                  value={serial1}
                  onChange={e => setSerial1(e.target.value)}
                  required
                  className="w-full p-2 border rounded font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Dahua 4MP Dome - Unit 2 Serial Number</label>
                <input
                  type="text"
                  value={serial2}
                  onChange={e => setSerial2(e.target.value)}
                  required
                  className="w-full p-2 border rounded font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Units Returned Unused</label>
                <input
                  type="number"
                  min="0"
                  max="2"
                  value={returnedQty}
                  onChange={e => setReturnedQty(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border rounded text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Technician Notes</label>
                <textarea
                  value={completionNotes}
                  onChange={e => setCompletionNotes(e.target.value)}
                  rows={2}
                  maxLength={2000}
                  className="w-full p-2 border rounded text-xs"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCompletionModal(false)}
                  className="w-1/2 py-2 border rounded text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-sm"
                >
                  Submit Report (OP-07)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Switch Link */}
      <div className="text-center pt-4">
        <Link href="/" className="text-xs text-indigo-600 hover:underline font-semibold">
          ← Back to Dispatcher Console
        </Link>
      </div>
    </div>
  );
}
