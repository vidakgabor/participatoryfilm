interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
}

export function MetricCard({ label, value, sublabel }: MetricCardProps) {
  return (
    <div className="metric-card">
      <p className="text-xs font-body uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
      <p className="text-3xl font-display font-bold text-primary">{value}</p>
      {sublabel && <p className="text-xs text-muted-foreground mt-1">{sublabel}</p>}
    </div>
  );
}
