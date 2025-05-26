import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  color: string;
  textColor: string;
}

export function CategoryCard({
  title,
  description,
  href,
  icon,
  color,
  textColor
}: CategoryCardProps) {
  return (
    <Link href={href} className="block h-full">
      <motion.div
        whileHover={{ y: -5 }}
        className={cn(
          "h-full rounded-xl p-6 transition-colors",
          color
        )}
      >
        <div className={cn("mb-4", textColor)}>
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </motion.div>
    </Link>
  );
}