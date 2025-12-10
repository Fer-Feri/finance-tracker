import { LucideIcon } from "lucide-react";

export interface CardDashboardProps {
  id: string;
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}
