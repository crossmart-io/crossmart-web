/** The chart's two series, drawn as they appear on it: a solid line and a dashed one. */
export function SalesChartLegend() {
  return (
    <ul className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground">
      <li className="flex items-center gap-1.5">
        <span className="h-0 w-4 border-t-2 border-chart-1" aria-hidden="true" />
        This period
      </li>
      <li className="flex items-center gap-1.5">
        <span
          className="h-0 w-4 border-t-2 border-dashed border-muted-foreground"
          aria-hidden="true"
        />
        Previous period
      </li>
    </ul>
  );
}
