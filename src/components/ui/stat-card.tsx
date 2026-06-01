import { Card, CardContent } from "./card";

type StatCardProps = {
  label: string;
  value: number | string;
  description?: string;
};

export function StatCard({ description, label, value }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <p className="mt-3 text-3xl font-bold tracking-tight text-blue-800">{value}</p>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      </CardContent>
    </Card>
  );
}
