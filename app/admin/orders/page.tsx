"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";

type OrderItem = {
  slug: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  _id: string;
  reference: string;
  items: OrderItem[];
  subtotal: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  status: "pending" | "paid" | "failed";
  createdAt: string;
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

const statusStyles: Record<string, string> = {
  paid: "border-live/30 text-live",
  pending: "border-accent/30 text-accent",
  failed: "border-alert/30 text-alert",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchOrders() {
      const response = await fetch("/api/admin/orders");
      const data = await response.json();
      if (!ignore) {
        setOrders(data.orders ?? []);
        setLoading(false);
      }
    }

    fetchOrders();

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  async function handleStatusChange(orderId: string, status: Order["status"]) {
    setUpdating(true);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setSelectedOrder(null);
      setRefreshKey((key) => key + 1);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Orders</h1>
      <p className="mt-1.5 text-sm text-muted">
        View and manage customer orders.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <p className="col-span-full text-sm text-muted">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="col-span-full text-sm text-muted">No orders yet.</p>
        ) : (
          orders.map((order) => {
            const previewImages = order.items
              .map((item) => item.image)
              .filter(Boolean)
              .slice(0, 3) as string[];

            return (
              <button
                key={order._id}
                type="button"
                onClick={() => setSelectedOrder(order)}
                className="flex flex-col rounded-2xl border border-line bg-surface p-5 text-left transition-colors hover:border-accent cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="min-w-0 truncate font-semibold">
                    {order.customerName}
                  </p>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase ${
                      statusStyles[order.status] ?? "border-line text-muted"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <p className="mt-1 font-mono text-xs text-muted">
                  {order.reference}
                </p>
                <p className="mt-0.5 text-xs text-muted">
                  {formatDate(order.createdAt)}
                </p>

                {previewImages.length > 0 ? (
                  <div className="mt-3 flex -space-x-3">
                    {previewImages.map((src, index) => (
                      <div
                        key={index}
                        className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border-2 border-surface bg-background"
                        style={{ zIndex: previewImages.length - index }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > previewImages.length ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-surface bg-background text-[10px] font-semibold text-muted">
                        +{order.items.length - previewImages.length}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-muted">
                    {order.items.length} item
                    {order.items.length !== 1 ? "s" : ""}
                  </p>
                )}

                <p className="mt-auto pt-3 font-mono text-lg font-semibold">
                  {formatPrice(order.subtotal)}
                </p>
              </button>
            );
          })
        )}
      </div>

      <Dialog
        open={selectedOrder !== null}
        onClose={() => setSelectedOrder(null)}
        title="Order details"
      >
        {selectedOrder ? (
          <div>
            <div className="space-y-1 text-sm">
              <p className="font-mono text-xs text-muted">
                Ref: {selectedOrder.reference}
              </p>
              <p className="font-semibold">{selectedOrder.customerName}</p>
              <p className="text-muted">{selectedOrder.customerEmail}</p>
              <p className="text-muted">{selectedOrder.customerPhone}</p>
              <p className="text-muted">{selectedOrder.deliveryAddress}</p>
            </div>

            <div className="mt-4 divide-y divide-line border-y border-line">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.slug}
                  className="flex items-center gap-3 py-2 text-sm"
                >
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-background">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <span>
                      {item.name}{" "}
                      <span className="text-muted">× {item.quantity}</span>
                    </span>
                    <span className="font-mono">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Total</span>
              <span className="font-mono text-sm font-semibold">
                {formatPrice(selectedOrder.subtotal)}
              </span>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium">Update status</p>
              <div className="mt-2 flex gap-2">
                {(["pending", "paid", "failed"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={updating || selectedOrder.status === status}
                    onClick={() =>
                      handleStatusChange(selectedOrder._id, status)
                    }
                    className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize transition-colors disabled:opacity-40 cursor-pointer ${
                      statusStyles[status] ?? "border-line text-muted"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
