import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        'auto-rotate'?: boolean;
        'camera-controls'?: boolean;
        'shadow-intensity'?: string;
        className?: string;
        style?: React.CSSProperties;
        children?: React.ReactNode;
      };
    }
  }
}
