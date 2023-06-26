import { select } from 'd3';

export const createSvg = (
  graphRef: React.RefObject<SVGSVGElement>,
  width: number,
  height: number
) => {
  const svg = select(graphRef.current);

  const viewBox = {
    x: -width / 2,
    y: -height / 2,
    width,
    height,
  };

  svg
    .attr(
      'viewBox',
      [viewBox.x, viewBox.y, viewBox.width, viewBox.height].join(' ')
    )
    .attr('width', width)
    .attr('height', height)
    .attr('id', 'graph')
    .attr('text-anchor', 'middle');

  const linksContainer = svg.append('g').attr('id', 'links');
  const nodesContainer = svg.append('g').attr('id', 'nodes');
  const defs = svg.append('defs');

  svg.append('g').attr('id', 'popupContainer');

  return { svg, linksContainer, nodesContainer, defs };
};
