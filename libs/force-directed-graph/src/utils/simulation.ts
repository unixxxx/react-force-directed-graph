/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  drag,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
  Simulation,
} from 'd3';
import { Link, Node } from '../types';

export const simulationFn = (nodes: Node[], links: Link[]) =>
  forceSimulation(nodes)
    .force(
      'link',
      forceLink(links)
        .id((d: any) => d.id)
        .links(links)
        .distance(200)
    )
    .force('charge', forceManyBody().strength(-1000).distanceMax(500))
    .alphaDecay(0.2);

export const simulateDrag = (simulation: Simulation<Node, undefined>) => {
  const dragstarted = (event, d) => {
    if (!event.active) simulation.alphaTarget(1).restart();
    d.fx = d.x;
    d.fy = d.y;
  };

  const dragged = (event, d) => {
    d.fx = event.x;
    d.fy = event.y;
  };

  const dragended = (event, d) => {
    if (!event.active) simulation.alphaTarget(0).restart();
    d.fx = event.x;
    d.fy = event.y;
  };

  return drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
};

export const tickSimulation = (
  nodesElem,
  linksElem,
  linkLabels,
  links: Link[],
  radius: number
) => {
  linksElem.attr('d', (d) => arcPath(d, links, radius));

  linkLabels.attr('transform', function (this: SVGSVGElement, d) {
    const box = this.getBBox();
    const center = {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2,
    };
    const dx = d.source.x - d.target.x;
    return `rotate(${dx > 0 ? 180 : 0}, ${center.x} ${center.y})`;
  });

  nodesElem.attr('transform', (d) => `translate (${d.x},${d.y})`);

  const popupElement = select('.svg-popup');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const popupCard = popupElement.node() as any;

  if (popupCard) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svg = select('svg#graph').node() as any;

    const popupBounding = popupCard.getBoundingClientRect();
    const svgBounding = svg.getBoundingClientRect();

    const containerRightBound = svgBounding.x + svgBounding.width;
    const containerBottomBound = svgBounding.y + svgBounding.height;

    const popupRightBound = popupBounding.x + popupBounding.width;
    const popupBottomBound = popupBounding.y + popupBounding.height;

    if (popupRightBound > containerRightBound) {
      popupElement.attr(
        'x',
        +popupElement.attr('x') - (popupRightBound - containerRightBound)
      );
    } else if (popupBounding.x < svgBounding.x) {
      popupElement.attr(
        'x',
        +popupElement.attr('x') + (svgBounding.x - popupBounding.x)
      );
    }

    if (popupBottomBound > containerBottomBound) {
      popupElement.attr(
        'y',
        +popupElement.attr('y') - (popupBottomBound - containerBottomBound)
      );
    } else if (popupBounding.y < svgBounding.y) {
      popupElement.attr(
        'y',
        +popupElement.attr('y') + (svgBounding.y - popupBounding.y)
      );
    }
  }
};

const calculateTouchPoints = (
  source: { x: number; y: number; nodeRadius: number },
  target: { x: number; y: number; nodeRadius: number },
  radius: number,
  multipleLinks: boolean,
  linkIndex: number
): { x: number; y: number }[] => {
  const sourceRadius =
    !source.nodeRadius || isNaN(source.nodeRadius) ? radius : source.nodeRadius;
  const targetRadius =
    !target.nodeRadius || isNaN(target.nodeRadius) ? radius : target.nodeRadius;

  const dx = target.x - source.x;
  const dy = target.y - source.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  // draw straight line between nodes
  if (!multipleLinks || sourceRadius + targetRadius > distance) {
    const x1 = (dx * sourceRadius) / distance + source.x;
    const x2 = ((distance - targetRadius) * dx) / distance + source.x;

    const y1 = (dy * sourceRadius) / distance + source.y;
    const y2 = ((distance - targetRadius) * dy) / distance + source.y;
    return [
      { x: x2, y: y2 },
      { x: x1, y: y1 },
    ];
  }

  const aTarget = Math.asin(targetRadius / distance);
  const bTarget = Math.atan2(dy, dx);

  const aSource = Math.asin(sourceRadius / distance);
  const bSource = Math.atan2(dy, dx);

  let tTarget = bTarget - aTarget - 1;
  let tSource = bSource - aSource - 1;
  const taTarget = {
    x: targetRadius * Math.sin(tTarget),
    y: targetRadius * -Math.cos(tTarget),
  };
  const taSource = {
    x: sourceRadius * Math.sin(tSource),
    y: sourceRadius * -Math.cos(tSource),
  };

  tTarget = bTarget + aTarget + 1;
  tSource = bSource + aSource + 1;
  const tbTarget = {
    x: targetRadius * -Math.sin(tTarget),
    y: targetRadius * Math.cos(tTarget),
  };
  const tbSource = {
    x: sourceRadius * -Math.sin(tSource),
    y: sourceRadius * Math.cos(tSource),
  };

  const targetCoordinates =
    linkIndex > 0
      ? { x: target.x + tbTarget.x, y: target.y + tbTarget.y }
      : { x: target.x + taTarget.x, y: target.y + taTarget.y };

  const sourceCoordinates =
    linkIndex === 0
      ? { x: source.x - tbSource.x, y: source.y - tbSource.y }
      : { x: source.x - taSource.x, y: source.y - taSource.y };

  return [targetCoordinates, sourceCoordinates];
};

const arcPath = (d, links, radius: number) => {
  const foundLinks = links.filter(
    (l) => l.target.id === d.target.id && l.source.id === d.source.id
  );
  const foundIndex = foundLinks.findIndex((l) => l.id === d.id);
  const [target, source] = calculateTouchPoints(
    d.source,
    d.target,
    radius,
    foundLinks.length > 1,
    foundIndex
  );

  return [
    'M',
    source.x,
    source.y,
    'L',
    (target.x + source.x) / 2,
    (target.y + source.y) / 2,
    'M',
    (target.x + source.x) / 2,
    (target.y + source.y) / 2,
    'L',
    target.x,
    target.y,
  ].join(' ');
};
