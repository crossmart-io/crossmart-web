/** More lines to read before approving, such as the note an adjustment carries. */
export function PreviewDetails({ details }: { details: readonly string[] }) {
  if (!details.length) return null;
  return (
    <ul className="flex flex-col gap-0.5 text-xs text-muted-foreground">
      {details.map((detail) => (
        <li key={detail} className="break-words">
          {detail}
        </li>
      ))}
    </ul>
  );
}
