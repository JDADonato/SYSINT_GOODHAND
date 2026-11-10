'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, ArrowRight, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@prototype/ui';

export default function CartPage() {
  const [quantity, setQuantity] = useState(2);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8 border-b pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Shopping Cart</h1>
          <p className="text-sm text-slate-600">Review selected security equipment before checkout</p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full font-semibold border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
          Stock Available in Warehouse
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="p-6 divide-y divide-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 first:pt-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-50 border rounded-lg p-2 flex items-center justify-center shrink-0">
                <img src="/_clone/images/cctv-dahua-dome-4mp.svg" alt="Camera" className="max-h-full max-w-full" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#0e2378] uppercase">CCTV</span>
                <h3 className="font-semibold text-sm text-slate-900">Dahua DH-IPC-HDBW1431E-S4 4MP Entry IR Fixed Dome Camera</h3>
                <span className="text-xs text-slate-500">SKU: GH-CCTV-001</span>
                <span className="block text-[11px] text-emerald-700 font-semibold mt-0.5">Installation: Included</span>
              </div>
            </div>

            <div className="flex items-center gap-6 self-end sm:self-center">
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1 text-sm font-semibold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(99, quantity + 1))}
                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-[#D60000]">₱{(3850 * quantity).toLocaleString()}.00</span>
                <span className="block text-[11px] text-slate-400">₱3,850.00 each</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500">Order Subtotal:</span>
            <div className="text-2xl font-black text-[#0e2378]">₱{(3850 * quantity).toLocaleString()}.00</div>
            <span className="text-[11px] text-emerald-700 font-semibold">Standard Metro Manila & Calabarzon Installation Included</span>
          </div>

          <Link href="/checkout">
            <Button variant="primary" size="lg" className="bg-[#0e2378] hover:bg-[#193893] text-sm font-bold flex items-center gap-2">
              Proceed to Installation Checkout
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
