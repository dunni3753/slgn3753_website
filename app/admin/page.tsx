import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import { Order } from "@/lib/models/Order";
import { User } from "@/lib/models/User";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(new Date(date));
}

const statusStyles: Record<string, string> = {
  paid: "border-live/30 text-live",
  pending: "border-accent/30 text-accent",
  failed: "border-alert/30 text-alert",
};

export default async function AdminOverviewPage() {
  await connectToDatabase();

  const [
    productCount,
    categoryCount,
    hiddenProductCount,
    orderCount,
    pendingOrderCount,
    userCount,
    revenueAgg,
    recentOrders,
    recentProducts,
    recentUsers,
  ] = await Promise.all([
    Product.countDocuments(),
    Category.countDocuments(),
    Product.countDocuments({ active: false }),
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    User.countDocuments(),
    Order.aggregate([
      { $match: { status: "paid" } },
      { $group: { _id: null, total: { $sum: "$subtotal" } } },
    ]),
    Order.find().sort({ createdAt: -1 }).limit(5).lean(),
    Product.find().sort({ createdAt: -1 }).limit(5).lean(),
    User.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const revenue = revenueAgg[0]?.total ?? 0;

  const stats = [
    {
      label: "Revenue (paid)",
      value: formatPrice(revenue),
      href: "/admin/orders",
    },
    {
      label: "Orders",
      value: orderCount,
      sub: `${pendingOrderCount} pending`,
      href: "/admin/orders",
    },
    {
      label: "Products",
      value: productCount,
      sub: `${hiddenProductCount} hidden`,
      href: "/admin/products",
    },
    { label: "Categories", value: categoryCount, href: "/admin/categories" },
    { label: "Users", value: userCount, href: "/admin/users" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Overview</h1>
      <p className="mt-1.5 text-sm text-muted">
        A snapshot of orders, products, categories and users.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent"
          >
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">
              {stat.value}
            </p>
            {stat.sub ? (
              <p className="mt-1 text-xs text-muted">{stat.sub}</p>
            ) : null}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">
              Recent orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-accent"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-2">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted">No orders yet.</p>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order._id.toString()}
                  href="/admin/orders"
                  className="flex items-center justify-between rounded-xl border border-line bg-surface p-3 transition-colors hover:border-accent"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {order.customerName}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {order.reference} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold">
                      {formatPrice(order.subtotal)}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] uppercase ${
                        statusStyles[order.status] ?? "border-line text-muted"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent users */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Recent users</h2>
            <Link
              href="/admin/users"
              className="text-xs font-semibold text-accent"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-2">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-muted">No users yet.</p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user._id.toString()}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line text-sm font-semibold">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (user.name?.charAt(0).toUpperCase() ?? "U")
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted">{user.email}</p>
                  </div>
                  {user.role === "admin" ? (
                    <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[10px] text-muted">
                      Admin
                    </span>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent products */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">
            Recent products
          </h2>
          <Link
            href="/admin/products"
            className="text-xs font-semibold text-accent"
          >
            View all
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {recentProducts.length === 0 ? (
            <p className="text-sm text-muted">No products yet.</p>
          ) : (
            recentProducts.map((product) => (
              <Link
                key={product._id.toString()}
                href="/admin/products"
                className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-accent"
              >
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-line bg-background">
                  {product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted">
                    {formatPrice(product.price)}
                  </p>
                </div>
                {!product.active ? (
                  <span className="shrink-0 rounded-full border border-alert/30 px-2 py-0.5 text-[10px] text-alert">
                    Hidden
                  </span>
                ) : null}
              </Link>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/products"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Add product
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
        >
          Add category
        </Link>
        <Link
          href="/admin/orders"
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
        >
          View orders
        </Link>
      </div>
    </div>
  );
}
