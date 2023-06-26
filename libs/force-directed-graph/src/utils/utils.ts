import { scaleOrdinal, schemeCategory10 } from 'd3';

export const scale = scaleOrdinal(schemeCategory10);
export const getLinkLabelWidth = (text: string) => text.length * 6.5;
