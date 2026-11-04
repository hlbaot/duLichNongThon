"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import type { ProfileMetric } from "@/types/destination-profile";

function ProfileMetricCell({ metric }: { metric: ProfileMetric }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: .15 });
  const factor = 10 ** metric.precision;
  const count = useCountUp(Math.round(metric.value * factor), { start: inView, duration: 1200 });
  const display = count === Math.round(metric.value * factor) ? metric.displayValue : `${metric.prefix}${(count / factor).toLocaleString("vi-VN", { maximumFractionDigits: metric.precision })}${metric.suffix}`;
  return <div ref={ref} className="profile-metric">
    <span className="profile-metric-label">{metric.label}</span>
    <strong aria-label={metric.displayValue}>{display}</strong>
  </div>;
}

export function DestinationDetailMetrics({ metrics }: { metrics: ProfileMetric[] }) {
  if (!metrics.length) return null;
  return <section className="profile-metrics" aria-label="Số liệu trong hồ sơ">
    {metrics.map(metric => <ProfileMetricCell key={metric.id} metric={metric} />)}
  </section>;
}
