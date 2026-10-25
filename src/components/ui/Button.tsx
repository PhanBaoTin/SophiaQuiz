import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "teal";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: ReactNode;
}

export function Button({ variant = "secondary", icon, className = "", children, ...props }: ButtonProps) {
  return <button className={`button button-${variant} ${className}`} {...props}>{icon}{children}</button>;
}

export function ActionLink({ variant = "secondary", icon, className = "", children, ...props }: LinkProps & { variant?: Variant; icon?: ReactNode; className?: string }) {
  return <Link className={`button button-${variant} ${className}`} {...props}>{icon}{children}</Link>;
}
