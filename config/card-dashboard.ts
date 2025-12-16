// config/card-dashboard.ts
import { LucideIcon } from "lucide-react";
import { TrendingUp, Wallet, TrendingDown, PiggyBank } from "lucide-react";

export interface CardDashboardProps {
  id: string;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  variant: "primary" | "secondary" | "destructive" | "teal"; // ✅ Variant system
}

export const CardDashboardItems: CardDashboardProps[] = [
  {
    id: "total-balance",
    title: "موجودی کل",
    value: "33,000,000 ت",
    change: "+12%",
    isPositive: true,
    icon: Wallet,
    variant: "primary",
  },
  {
    id: "monthly-income",
    title: "درآمد ماهانه",
    value: "45,000,000 ت",
    change: "+8%",
    isPositive: true,
    icon: TrendingUp,
    variant: "secondary",
  },
  {
    id: "monthly-expense",
    title: "هزینه ماهانه",
    value: "12,000,000 ت",
    change: "-5%",
    isPositive: false,
    icon: TrendingDown,
    variant: "destructive",
  },
  {
    id: "savings",
    title: "پس‌انداز",
    value: "21,000,000 ت",
    change: "+2%",
    isPositive: true,
    icon: PiggyBank,
    variant: "teal",
  },
];
