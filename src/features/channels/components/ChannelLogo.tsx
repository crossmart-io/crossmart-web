import { cn } from 'cn';
import type { CSSProperties } from 'react';
import { type ChannelLogo as ChannelLogoInfo, ChannelLogoSize } from '../channels.constants';

const TILE_CLASSES: Record<ChannelLogoSize, { tile: string; mark: string }> = {
  [ChannelLogoSize.Default]: { tile: 'size-11 rounded-lg', mark: 'size-6' },
  [ChannelLogoSize.Small]: { tile: 'size-7 rounded-md', mark: 'size-4' },
};

interface ChannelLogoProps {
  logo: ChannelLogoInfo;
  size?: ChannelLogoSize;
}

/** A brand mark on a neutral tile. Single-colour marks are painted with a CSS mask. */
export function ChannelLogo({ logo, size = ChannelLogoSize.Default }: ChannelLogoProps) {
  const classes = TILE_CLASSES[size];
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center border bg-background text-foreground',
        classes.tile,
      )}
      aria-hidden="true"
    >
      {logo.tint ? (
        <span className={classes.mark} style={maskStyle(logo.src, logo.tint)} />
      ) : (
        <img src={logo.src} alt="" className={cn(classes.mark, 'object-contain')} />
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
