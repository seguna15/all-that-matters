import {
  BarChart2,
  DollarSign,
  Menu,
  Shield,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  Layers3,
  Home,
  ZapOff,
} from "lucide-react";

export const SIDEBAR_ITEMS = [
  {
    id: "overview",
    name: "Overview",
    icon: BarChart2,
    color: "#6366f1",
    href: "/admin",
  },
  {
    id: "products",
    name: "Products",
    icon: ShoppingBag,
    color: "#8B5CF6",
    href: "/admin/products",
  },
  {
    id: "categories",
    name: "Categories",
    icon: Layers3,
    color: "#3B82F6",
    href: "/admin/categories",
  },
  {
    id: "brands",
    name: "Brands",
    icon: Shield,
    color: "#c1121f",
    href: "/admin/brands",
  },
  {
    id: "users",
    name: "Users",
    icon: Users,
    color: "#EC4899",
    href: "/admin/users",
  },
  {
    id: "coupons",
    name: "Coupons",
    icon: ZapOff,
    color: "#ffb703",
    href: "/admin/coupons",
  },
  
  {
    id: "orders",
    name: "Orders",
    icon: ShoppingCart,
    color: "#F59E0B",
    href: "/admin/orders",
  },
 
  
  {
    id: "home",
    name: "Home",
    icon: Home,
    color: "#d00000",
    href: "/",
  },
];

 export const priceRange = [
  { val: "1-1000", name: `\u{020A6}1 - \u{020A6}1 000` },
  { val: "1000-10000", name: `\u{020A6}1,000- \u{020A6}10,000` },
  { val: "10000-100000", name: `\u{020A6}10,000- \u{020A6}100,000` },
  { val: "100000-1000000", name: `\u{020A6}100,000 - \u{020A6}1,000,000` },
]; 



export const quantityRange = [
  { val: "0-10", name: `1 - 10` },
  { val: "10-50", name: `10- 50` },
  { val: "50-100", name: `50- 100` },
  { val: "100-1000", name: `100 - 1000` },
];

export const orderStatus = [
  {value: "pending", label: "Pending"},
  {value: "processed", label: "Processed"},
  {value: "shipped", label: "Shipped"},
  {value: "delivered", label: "Delivered"},
]
