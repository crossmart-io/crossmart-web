import type { ReactNode } from 'react';

interface SettingsSectionProps {
  /** The section's anchor (`PageSection`), so a link can scroll to it. */
  id?: string;
  title: string;
  /** Buttons on the right of the title, such as "Create API key". */
  actions?: ReactNode;
  children: ReactNode;
}

/** One part of a settings tab: its heading and actions, then its content. */
export function SettingsSection({ id, title, actions, children }: SettingsSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={id && `${id}-title`}
      className="flex scroll-mt-20 flex-col gap-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id={id && `${id}-title`} className="font-heading text-lg font-semibold">
          {title}
        </h2>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
