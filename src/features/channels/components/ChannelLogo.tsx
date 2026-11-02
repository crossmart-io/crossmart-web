import type { CSSProperties } from 'react';
import type { ChannelLogo as ChannelLogoInfo } from '../channels.constants';

interface ChannelLogoProps {
  logo: ChannelLogoInfo;
}

/** A brand mark on a neutral tile. Single-colour marks are painted with a CSS mask. */
export function ChannelLogo({ logo }: ChannelLogoProps) {
  return (
    <span
      className="grid size-11 shrink-0 place-items-center rounded-lg border bg-background text-foreground"
      aria-hidden="true"
    >
      {logo.tint ? (
        <span className="size-6" style={maskStyle(logo.src, logo.tint)} />
      ) : (
        <img src={logo.src} alt="" className="size-6 object-contain" />
      )}
    </span>
  );
}

function maskStyle(src: string, tint: string): CSSProperties {
  const image = `url("${src}")`;
  return {
    backgroundColor: tint,
    maskImage: image,
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    maskSize: 'contain',
  };
}
