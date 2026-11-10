'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Calendar, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@prototype/ui';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [customerName, setCustomerName] = useState('Juan Dela Cruz');
  const [customerPhone, setCustomerPhone] = useState('09171234567');
  const [customerEmail, setCustomerEmail] = useState('juan@example.com');
  const [line1, setLine1] = useState('123 Ayala Avenue');
  const [city, setCity] = useState('Makati');
  const [province, setProvince] = useState('Metro Manila');
  const [postalCode, setPostalCode] = useState('1226');
  const [includeInstallation, setIncludeInstallation] = useState(true);

  // Default preferred window 48h in future
  const tomorrow = new Date(Date.now() + 48 * 3600 * 1000);
  const startIso = new Date(tomorrow.setHours(9, 0, 0, 0)).toISOString().slice(0, 16);
  const endIso = new Date(tomorrow.setHours(11, 0, 0, 0)).toISOString().slice(0, 16);

  const [preferredStart, setPreferredStart] = useState(startIso);
  const [preferredEnd, setPreferredEnd] = useState(endIso);
  const [specialInstructions, setSpecialInstructions] = useState('Please ring bell at gate');
  const [simulateFailure, setSimulateFailure] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      customerName,
      customerPhone,
      customerEmail,
      address: {
        line1,
        city,
        province,
        postalCode
      },
      items: [
        {
          sku: 'GH-CCTV-001',
          quantity: 2,
          unitPricePhp: '3850.00'
        }
      ],
      includeInstallation,
      preferredStart: includeInstallation ? new Date(preferredStart).toISOString() : undefined,
      preferredEnd: includeInstallation ? new Date(preferredEnd).toISOString() : undefined,
      specialInstructions,
      simulatePaymentFailure: simulateFailure
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Checkout submission failed');
      }

      router.push(`/orders/${data.orderNumber}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Checkout & Installation Dispatch</h1>
        <p className="text-sm text-slate-600">Complete your order with included professional field installation</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#0e2378]" />
            1. Contact & Customer Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone (PH)</label>
              <input
                type="text"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="09XXXXXXXXX"
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={customerEmail}
                onChange={e => setCustomerEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#0e2378]" />
            2. Installation / Delivery Address
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                value={line1}
                onChange={e => setLine1(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Province / Region</label>
              <select
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="Metro Manila">Metro Manila</option>
                <option value="Cavite">Cavite</option>
                <option value="Laguna">Laguna</option>
                <option value="Bulacan">Bulacan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Installation Schedule Window */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0e2378]" />
              3. Professional Installation
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Installation: Included
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Start Time</label>
              <input
                type="datetime-local"
                value={preferredStart}
                onChange={e => setPreferredStart(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred End Time</label>
              <input
                type="datetime-local"
                value={preferredEnd}
                onChange={e => setPreferredEnd(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Special Site Instructions</label>
              <textarea
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                rows={2}
                maxLength={500}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Simulated Payment */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#0e2378]" />
            4. Simulated Payment
          </h2>
          <div className="p-3 bg-slate-50 border rounded-md text-xs text-slate-600 flex items-center justify-between">
            <span>Payment Method: <strong>Simulated Test Payment (Free Tier Demo)</strong></span>
            <label className="flex items-center gap-1.5 cursor-pointer text-amber-800 font-semibold">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={e => setSimulateFailure(e.target.checked)}
                className="rounded"
              />
              Force Payment Failure (Demo)
            </label>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full text-base font-bold py-3.5 bg-[#0e2378] hover:bg-[#193893]"
        >
          Pay & Confirm Installation Order (₱7,700.00)
        </Button>
      </form>
    </div>
  );
}
