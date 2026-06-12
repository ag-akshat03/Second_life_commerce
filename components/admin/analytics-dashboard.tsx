"use client";

import { motion } from "framer-motion";

const metrics = [
  { label: "Revenue", value: "₹12.4L", change: "+18%", color: "bg-amazon-orange" },
  { label: "Orders", value: "1,284", change: "+12%", color: "bg-amazon-teal" },
  { label: "Users", value: "8,420", change: "+24%", color: "bg-blue-600" },
  { label: "Conversion", value: "3.8%", change: "+0.4%", color: "bg-amazon-green" }
];

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="amazon-card"
          >
            <p className="text-sm text-slate-500">{m.label}</p>
            <p className="mt-1 text-2xl font-bold">{m.value}</p>
            <p className="mt-1 text-xs font-bold text-amazon-green">{m.change}</p>
            <div className={`mt-3 h-1.5 w-full rounded-full ${m.color} opacity-80`} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="amazon-card">
          <h3 className="font-bold">Sales (last 7 days)</h3>
          <div className="mt-4 flex h-40 items-end gap-2">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-amazon-orange/80" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="amazon-card">
          <h3 className="font-bold">Top products</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {["OnePlus Nord CE 4", "Samsung Crystal 4K TV", "Sony WH-1000XM5", "Kindle Paperwhite"].map((name, i) => (
              <li key={name} className="flex justify-between">
                <span>{name}</span>
                <span className="font-bold">{120 - i * 18} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
