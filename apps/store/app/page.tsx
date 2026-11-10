import React from 'react';
import Link from 'next/link';
import fs from 'node:fs';
import path from 'node:path';
import { ShieldCheck, Truck, Clock, Wrench } from 'lucide-react';
import type { CatalogProduct } from '@prototype/contract';

function getProducts(): any[] {
  try {
    const productsPath = path.join(process.cwd(), 'public', '_clone', 'products.json');
    if (fs.existsSync(productsPath)) {
      return JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
    }
  } catch (err) {
    console.error('Failed to load products', err);
  }
  return [];
}

export default function HomePage() {
  const products = getProducts();

  return (
    <div className="flex flex-col">
      {/* Navigation Header */}
      <header className="bg-[#0e2378] text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#ffc107]" />
            <div>
              <span className="text-xl font-bold tracking-tight">Security Products Store</span>
              <span className="block text-xs text-blue-200">Prototype Integration Store (System A)</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="hover:text-blue-200 transition-colors">Catalog</Link>
            <Link href="/cart" className="hover:text-blue-200 transition-colors">Cart</Link>
            <Link href="/leads" className="hover:text-blue-200 transition-colors">Request Quote</Link>
            <Link href="/demo" className="bg-[#ffc107] text-slate-900 px-3 py-1.5 rounded-md font-semibold hover:bg-yellow-400 transition-colors">Demo Panel</Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#0e2378] to-[#193893] text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Professional Security Systems & Field Service</h1>
          <p className="max-w-2xl mx-auto text-blue-100 text-sm sm:text-base">
            CCTV, Smart Locks, Alarm Systems, and Perimeter Fencing with full field service dispatching and certified installation included.
          </p>
          <div className="flex justify-center gap-6 pt-4 text-xs sm:text-sm text-blue-200">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#ffc107]" />
              <span>Metro Manila & Calabarzon Service Areas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-[#ffc107]" />
              <span>Installation Included on Hardware</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#ffc107]" />
              <span>12 Months Standard Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <section className="max-w-7xl mx-auto px-6 py-10 w-full">
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-slate-900">Featured Security Hardware ({products.length} Items)</h2>
          <span className="text-xs text-slate-500">Live Stock Managed via Outbox Ledger</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.sku} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
              <div className="p-4 bg-slate-50 flex items-center justify-center border-b h-48">
                <img src={p.image_path} alt={p.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-semibold uppercase text-[#0e2378]">{p.category}</span>
                    <span>{p.sku}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm line-clamp-2">{p.name}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{p.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-[#D60000]">₱{p.price_php}</span>
                    {p.requires_installation && (
                      <span className="block text-[10px] text-emerald-700 font-medium">Installation: Included</span>
                    )}
                  </div>
                  <button className="bg-[#0e2378] hover:bg-[#193893] text-white text-xs font-medium px-3 py-1.5 rounded transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
