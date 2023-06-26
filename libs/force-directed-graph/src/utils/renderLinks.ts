import { Selection } from 'd3';
import { Link } from '../types';
import { fontSizeToNumber, getLinkLabelWidth, scale } from './helpers';

export const setLinkArrowDefs = (
  defs: Selection<SVGGElement, unknown, null, undefined>,
  links: Link[],
  nodeRadius: number
) => {
  const markers = defs
    .selectAll('marker.m')
    .data(links, (d: any) => d?.id)
    .join('marker')
    .attr('id', (d) => `arrow-${d.id}`)
    .attr('class', 'm')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 10)
    .attr('refY', 0)
    .attr('orient', 'auto')
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('markerUnits', 'strokeWidth');

  markers
    .html('')
    .append('path')
    .attr('id', (d) => `arrow-${d.id}`)
    .style('fill', (d) => d.css?.color ?? '#fff')
    .style('fill-opacity', 1)
    .attr('d', 'M0,-5L10,0L0,5');
};

export const renderLinks = (
  linksContainer: Selection<SVGGElement, unknown, null, undefined>,
  links: Link[]
) =>
  linksContainer
    .selectAll('path.link')
    .data(links, (d: any) => d?.id)
    .join('path')
    .attr('class', 'link')
    .style('stroke', (d) => d.css?.color ?? '#fff')
    .style('stroke-opacity', 1)
    .style('stroke-width', 1)
    .style('stroke-dasharray', 10)
    .style('fill', 'none')
    .attr('id', (d) => `linkId_${d.id}`)
    .attr('marker-end', (d) => `url(#arrow-${d.id})`)
    .attr('marker-mid', (d) => `url(#rect-${d.id})`);

export const setLinkRectDefs = (
  defs: Selection<SVGGElement, unknown, null, undefined>,
  links: Link[],
  fontSize: number
) => {
  const markers = defs
    .selectAll('marker.rect')
    .data(links, (d: any) => `${d.id}`)
    .attr('class', 'rect')
    .join('marker')
    .attr('id', (d: Link) => `rect-${d.id}`)
    .attr(
      'refX',
      (d) =>
        getLinkLabelWidth(d.type, fontSizeToNumber(d.css?.fontSize, fontSize)) /
        2
    )
    .attr('refY', 10)
    .attr('orient', 'auto')
    .attr('markerWidth', (d) =>
      getLinkLabelWidth(d.type, fontSizeToNumber(d.css?.fontSize, fontSize))
    )
    .attr('markerHeight', (d) => d.css?.fontSize ?? fontSize * 2);

  markers
    .append('rect')
    .attr('class', 'marker')
    .attr('width', (d) =>
      getLinkLabelWidth(d.type, fontSizeToNumber(d.css?.fontSize, fontSize))
    )
    .attr('height', 20)
    .attr('rx', 5)
    .attr('ry', 5)
    .attr(
      'fill',
      (d) => d.css?.background ?? d.css?.backgroundColor ?? scale(d.type)
    )
    .style('fill-opacity', 1);

  const linkLabels = markers
    .append('text')
    .attr('class', 'link_label')
    .attr('font-size', (d) => d.css?.fontSize ?? 13)
    .attr('fill', (d) => d.css?.color ?? '#fff')
    .style('fill-opacity', 1)
    .attr('dy', 15)
    .attr(
      'dx',
      (d) =>
        getLinkLabelWidth(d.type, fontSizeToNumber(d.css?.fontSize, fontSize)) /
        2
    )
    .text((d) => d.type.toUpperCase().replace(/_/g, ' '));

  return linkLabels;
};
