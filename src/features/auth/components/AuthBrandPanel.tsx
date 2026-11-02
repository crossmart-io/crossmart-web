import { Bot, FileSpreadsheet, Layers, Scale } from 'lucide-react';
import { Wordmark } from '@/components/brand/Wordmark';
import { HubDiagram } from './HubDiagram';

/** Only what the product does today. */
const HIGHLIGHTS = [
  { icon: FileSpreadsheet, text: 'Bring your Shopify catalog in with one export file' },
  { icon: Layers, text: 'Variants, stock and images in one catalog' },
  { icon: Bot, text: 'An API and MCP server for Claude or your own agent' },
  { icon: Scale, text: 'Open source under AGPL-3.0. Host it yourself or use ours' },
] as const;

/** The brand side of the sign-in screens, shown on wide screens. */
export function AuthBrandPanel() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground [--mark-accent:oklch(0.86_0.07_264)] lg:flex">
      <Wordmark />
      <HubDiagram className="absolute -right-16 -bottom-16 w-[26rem] opacity-20" />
      <div className="relative flex max-w-md flex-col gap-8">
        <p className="font-heading text-4xl leading-tight font-semibold tracking-tight text-balance">
          One catalog. Every channel you sell on.
        </p>
        <ul className="flex flex-col gap-4">
          {HIGHLIGHTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-primary-foreground/90">
              <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </div>
      <p className="relative text-sm text-primary-foreground/70">crossmart.io</p>
    </aside>
  );
}
