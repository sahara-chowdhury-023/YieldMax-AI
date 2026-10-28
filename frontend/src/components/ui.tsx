import React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
};

export function Card({ children, className, hoverable = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface-card p-6 shadow-sm transition-all duration-200 ${
        hoverable ? "hover:border-accent/40 hover:shadow-lg hover:shadow-black/30" : ""
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
};

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  action,
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        {Icon && (
          <div className="inline-flex items-center gap-2 mb-3 rounded-lg bg-accent/10 border border-accent/20 p-2 text-accent shadow-sm">
            <Icon size={20} />
          </div>
        )}
        <h2 className="text-xl font-display font-bold text-text-primary tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

type StatProps = {
  value: string | number;
  label: string;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
  icon?: React.ElementType;
};

export function StatCard({ value, label, trend, trendType = "up", icon: Icon }: StatProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 hover:border-accent/30 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {label}
        </span>
        {Icon && (
          <span className="p-1.5 rounded-md bg-surface-card text-text-secondary group-hover:text-accent transition-colors">
            <Icon size={16} />
          </span>
        )}
      </div>
      <div className="text-2xl font-display font-bold text-text-primary tracking-tight">
        {value}
      </div>
      {trend && (
        <div
          className={`mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
            trendType === "up"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : trendType === "down"
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              : "bg-surface-card text-text-secondary border border-border"
          }`}
        >
          {trend}
        </div>
      )}
    </div>
  );
}

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  iconLeft?: React.ElementType;
  iconRight?: React.ElementType;
};

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  type = "button",
  iconLeft: IconLeft,
  iconRight: IconRight,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] cursor-pointer";

  const sizeClasses = {
    sm: "rounded-md px-3 py-1.5 text-xs",
    md: "rounded-lg px-4 py-2.5 text-sm",
    lg: "rounded-xl px-6 py-3.5 text-base font-semibold",
  };

  const variants: Record<string, string> = {
    primary:
      "bg-accent text-bg font-semibold hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.01] active:bg-accent-active",
    secondary:
      "bg-surface-card text-text-primary border border-border hover:bg-surface-card-hover hover:border-accent/40 hover:text-accent hover:ring-2 hover:ring-accent/20",
    outline:
      "border border-border bg-surface text-text-primary hover:border-accent hover:text-accent hover:bg-surface-card hover:ring-2 hover:ring-accent/30",
    ghost:
      "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-card hover:ring-1 hover:ring-border/60",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`${base} ${sizeClasses[size]} ${variants[variant]} ${className ?? ""}`}
    >
      {IconLeft && <IconLeft size={16} className="shrink-0" />}
      {children}
      {IconRight && <IconRight size={16} className="shrink-0" />}
    </button>
  );
}

type InputProps = {
  id: string;
  label: string;
  type?: string;
  step?: string;
  placeholder?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
  prefix?: string;
  suffix?: string;
};

export function Input({
  id,
  label,
  type = "text",
  step,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  helperText,
  prefix,
  suffix,
}: InputProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5"
      >
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      <div className="relative rounded-lg shadow-sm">
        {prefix && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary text-sm font-mono">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          step={step}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-surface text-text-primary placeholder:text-text-secondary/40 transition-all duration-200 hover:border-accent/60 hover:bg-surface/80 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 ${
            prefix ? "pl-9" : ""
          } ${suffix ? "pr-12" : ""} ${
            error ? "border-warning focus:ring-warning/40" : "border-border"
          }`}
        />
        {suffix && (
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-text-secondary text-xs font-mono">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-warning">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-text-secondary">{helperText}</p>
      )}
    </div>
  );
}

type SelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
  helperText?: string;
};

export function Select({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
  error,
  helperText,
}: SelectProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5"
      >
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-surface text-text-primary transition-all duration-200 hover:border-accent/60 hover:bg-surface/80 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 cursor-pointer ${
          error ? "border-warning focus:ring-warning/40" : "border-border"
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface text-text-primary">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-warning">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-text-secondary">{helperText}</p>
      )}
    </div>
  );
}

type TextareaProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  minChars?: number;
  error?: string;
  helperText?: string;
};

export function Textarea({
  id,
  label,
  value,
  onChange,
  rows = 4,
  minChars,
  error,
  helperText,
}: TextareaProps) {
  const len = value.length;
  const meetsMin = minChars ? len >= minChars : true;

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5"
      >
        {label}
        {minChars && ` (min ${minChars} chars)`}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={rows}
        className={`w-full rounded-lg border px-3.5 py-2.5 text-sm bg-surface text-text-primary placeholder:text-text-secondary/40 transition-all duration-200 hover:border-accent/60 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/40 ${
          minChars && !meetsMin
            ? "border-warning focus:ring-warning/40"
            : error
            ? "border-warning focus:ring-warning/40"
            : "border-border"
        }`}
      />
      <div className="mt-1.5 flex justify-between text-xs text-text-secondary">
        <span>{len} characters</span>
        {minChars && !meetsMin && (
          <span className="text-warning font-medium">Need {minChars - len} more</span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-warning">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-text-secondary">{helperText}</p>
      )}
    </div>
  );
}
