// config/card-dashboard.ts
import { LucideIcon } from "lucide-react";
import { TrendingUp, Wallet, TrendingDown, PiggyBank } from "lucide-react";

export interface CardDashboardProps {
  id: string;
  title: string;
  value: number;
  icon: LucideIcon;
  variant: "primary" | "secondary" | "destructive" | "teal"; // ✅ Variant system
}

export const CardDashboardItems: CardDashboardProps[] = [
  {
    id: "total-balance",
    title: "موجودی کل",
    value: 33000000,
    icon: Wallet,
    variant: "primary",
  },
  {
    id: "monthly-income",
    title: "درآمد ماهانه",
    value: 45000000,
    icon: TrendingUp,
    variant: "secondary",
  },
  {
    id: "monthly-expense",
    title: "هزینه ماهانه",
    value: 12000000,
    icon: TrendingDown,
    variant: "destructive",
  },
  {
    id: "savings",
    title: "پس‌انداز",
    value: 21000000,
    icon: PiggyBank,
    variant: "teal",
  },
];
