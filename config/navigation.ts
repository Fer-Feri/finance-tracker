import { NavGroup, NavItem } from "@/types/navigation";
import {
  ArrowRightLeft,
  LayoutDashboard,
  Settings,
  TrendingUp,
} from "lucide-react";

export const mainItems: NavItem[] = [
  {
    id: "dashboard",
    title: "داشبورد",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    id: "transactions",
    title: "تراکنش‌ها",
    href: "/dashboard/transactions",
    icon: ArrowRightLeft,
    // badge: "12",
  },

  {
    id: "reports",
    title: "گزارشات",
    href: "/dashboard/reports",
    icon: TrendingUp,
    // children: [
    //   {
    //     id: "reports-monthly",
    //     title: "گزارش ماهانه",
    //     href: "/dashboard/reports/monthly",
    //     icon: CalendarRange,
    //   },
    //   {
    //     id: "reports-yearly",
    //     title: "گزارش سالانه",
    //     href: "/dashboard/reports/yearly",
    //     icon: CalendarCheck,
    //   },
    //   {
    //     id: "reports-chart",
    //     title: "نمودارها",
    //     href: "/dashboard/reports/charts",
    //     icon: BarChart3,
    //   },
    // ],
  },
];

const managementItems: NavItem[] = [
  // {
  //   id: "goals",
  //   title: "اهداف مالی",
  //   href: "/dashboard/goals",
  //   icon: Target,
  //   badge: 3,
  // },

  // {
  //   id: "accounts",
  //   title: "حساب‌ها",
  //   href: "/dashboard/accounts",
  //   icon: Wallet,
  // },

  {
    id: "settings",
    title: "تنظیمات",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const navigationGroups: NavGroup[] = [
  {
    title: "اصلی",
    items: mainItems,
  },
  {
    title: "مدیریت",
    items: managementItems,
  },
];

// بدون گروه بندی
export const mainNavigation: NavItem[] = [...mainItems, ...managementItems];
