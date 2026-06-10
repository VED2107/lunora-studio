import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Paintbrush,
  Users,
  Ticket,
  Image as ImageIcon,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/collections", label: "Collections", icon: FolderOpen },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/custom-orders", label: "Custom Orders", icon: Paintbrush },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function isAdminNavActive(item: AdminNavItem, pathname: string) {
  return item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href) && pathname !== "/admin";
}
