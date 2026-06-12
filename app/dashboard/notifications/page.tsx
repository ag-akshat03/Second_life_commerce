"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { NotificationItem } from "@/types";

const seed: NotificationItem[] = [
  {
    id: "1",
    type: "ORDER",
    title: "Order shipped",
    body: "Your order is on the way and will arrive soon.",
    read: false,
    link: "/dashboard/orders",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    type: "PROMO",
    title: "Great Indian Festival",
    body: "Extra 10% off on electronics with code SAVE10.",
    read: false,
    link: "/search?deal=flash",
    createdAt: new Date().toISOString()
  }
];

export default function NotificationsPage() {
  const [notifications, setNotifications, hydrated] = useLocalStorage<NotificationItem[]>(
    "amazon-notifications",
    seed
  );

  if (!hydrated) return null;

  return (
    <DashboardShell title="Notifications">
      <div className="space-y-3">
        {notifications.map((n) => (
          <article
            key={n.id}
            className={`amazon-card ${!n.read ? "border-l-4 border-l-amazon-orange" : ""}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase text-slate-500">{n.type}</p>
                <h3 className="font-bold">{n.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{n.body}</p>
              </div>
              {!n.read && (
                <button
                  type="button"
                  className="text-xs text-amazon-teal hover:underline"
                  onClick={() =>
                    setNotifications((list) =>
                      list.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                    )
                  }
                >
                  Mark read
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </DashboardShell>
  );
}
