import { scaleOrdinal, schemeCategory10 } from 'd3';
import { CSSProperties } from 'react';

export const scale = scaleOrdinal(schemeCategory10);

export const fontSizeToNumber = (
  fontSize: CSSProperties['fontSize'],
  defaultSize: number
) => (fontSize ? +fontSize || defaultSize : defaultSize);

export const getLinkLabelWidth = (text: string, fontSize: number) =>
  (text.length * fontSize) / 1.5;
