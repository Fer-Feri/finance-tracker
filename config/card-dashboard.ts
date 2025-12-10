import { CardDashboardProps } from "@/types/card-dashboard";
import { TrendingUp, Wallet, TrendingDown, PiggyBank } from "lucide-react";

export const CardDashboardItems: CardDashboardProps[] = [
  {
    id: "total-balance",
    title: "موجودی کل",
    value: "33,000,000 ت",
    change: "+12%",
    isPositive: true,
    icon: Wallet,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "monthly-income",
    title: "درآمد ماهانه",
    value: "45,000,000 ت",
    change: "+8%",
    isPositive: true,
    icon: TrendingUp,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "monthly-expense",
    title: "هزینه ماهانه",
    value: "12,000,000 ت",
    change: "-5%",
    isPositive: false,
    icon: TrendingDown,
    iconColor: "text-destructive", // ✅ رنگ قرمز نئونی
    bgColor: "bg-destructive/10",
  },
  {
    id: "savings",
    title: "پس‌انداز",
    value: "21,000,000 ت",
    change: "+2%",
    isPositive: true,
    icon: PiggyBank,
    iconColor: "text-secondary",
    bgColor: "bg-secondary/10",
  },
];
