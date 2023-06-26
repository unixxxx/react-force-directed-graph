/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { select, Selection, arc } from 'd3';

import { Node } from '../types';

import loadNodes from '../icons/loadChildNodes.svg';
import closeNode from '../icons/close.svg';
import { scale } from './utils';
import { renderPopup } from './popup';

const toRadian = (degree: number) => degree * (Math.PI / 180);

export const setNodeIconDef = (
  defs: Selection<SVGGElement, unknown, null, undefined>,
  nodeRadius: number
) => {
  defs
    .append('clipPath')
    .attr('id', 'avatar-clip')
    .append('circle')
    .attr('r', nodeRadius);
};

export const renderNodes = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  nodesContainer: Selection<SVGGElement, unknown, null, undefined>,
  nodes: Node[],
  loadLink: (node: Node) => void,
  deleteNode: (node: Node) => void,
  nodeRadius: number,
  fontSize: number
) => {
  const nodeMenuheight = 130;
  const nodeMenuWidth = 130;
  const nodeZoomFactor = 20;

  const nodeImageWidth = nodeMenuWidth;
  const nodeImageHeight = nodeMenuWidth;
  const nodeImageX = -nodeMenuWidth / 2;
  const nodeImageY = (-nodeMenuheight + 20) / 2;

  function renderNodeMenu(this: any, event: any, item: any) {
    event.preventDefault();
    event.stopPropagation();

    const popupCardWidth = 355;
    const popupCardHeight = 295;

    select('.menu').remove();
    select('.svg-popup').remove();
    const thisNode = select(this);
    if (thisNode.classed('menu-visible')) {
      thisNode.attr('class', '');
      return;
    }
    thisNode.attr('class', 'menu-visible');

    const widthMenu = 180;
    const heightMenu = 180;
    const innerRadius = 45;
    const outerRadius = 80;

    const menuDataSet = [
      {
        title: 'loadRelations',
        action: loadLink,
        icon: loadNodes,
        startAngle: 0,
        endAngle: toRadian(120),
        innerRadius,
        outerRadius,
      },
      {
        title: 'deleteNode',
        action: deleteNode,
        icon: closeNode,
        startAngle: toRadian(120),
        endAngle: toRadian(240),
        innerRadius,
        outerRadius,
      },
    ];
    const menuItemAngle = 360 / menuDataSet.length;

    const svgMenu = thisNode
      .append('svg')
      .attr('width', widthMenu)
      .attr('height', heightMenu)
      .attr('class', 'menu')
      .attr('x', -widthMenu / 2)
      .attr('y', -widthMenu / 2)
      .append('g')
      .attr(
        'transform',
        'translate(' + widthMenu / 2 + ',' + heightMenu / 2 + ')'
      );

    const g = svgMenu
      .selectAll('.arc')
      .data(menuDataSet)
      .enter()
      .append('g')
      .attr('class', 'arc')
      .on('click', (_, d) => d.action(item));

    const arcOptions = (i: number) => ({
      innerRadius,
      outerRadius,
      startAngle: i * toRadian(menuItemAngle),
      endAngle: (i + 1) * toRadian(menuItemAngle),
      padAngle: 0.05,
    });

    const menuArc = arc();
    g.append('path')
      .attr('class', 'menuItem')
      .attr('id', (d) => d.title)
      .attr('d', (_, i) => menuArc(arcOptions(i)))
      .attr('fill', '#000');

    g.append('image')
      .attr('xlink:href', (_, i) => menuDataSet[i].icon)
      .attr('stroke', 'white')
      .attr('dy', '.35em')
      .each(function (d) {
        const centroid = menuArc.centroid(d);
        select(this)
          .attr('x', centroid[0])
          .attr('y', centroid[1])
          .attr('dy', '0.35em')
          .style('transform', 'translate(-7%, -5%)');
      });
    const card = thisNode
      .insert('foreignObject')
      .attr('id', 'popupCard')
      .attr('width', popupCardWidth)
      .attr('height', popupCardHeight)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr('x', (this as any).getBBox().x + innerRadius + nodeMenuWidth + 5)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr('y', (this as any).getBBox().y + innerRadius + nodeMenuWidth + 5)
      .attr('class', 'svg-popup');

    renderPopup(card, item);
    /* bring dynamically added elements to front (simulates z-index)*/
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (svg.select('g#popupContainer').node() as any).appendChild(this);
  }

  return nodesContainer
    .selectAll('g.node')
    .html('')
    .data(nodes, (d: any) => d?.id)
    .join('g')
    .attr('class', 'node')
    .on('click', renderNodeMenu)
    .call((g) =>
      g
        .append('circle')
        .attr('r', nodeRadius)
        .attr('stroke-width', 3)
        .attr('stroke', (d) => scale(d.type))
        .attr('fill', (d) => scale(d.type))
    )
    .call((g) =>
      g
        .filter((d) => !!d.img)
        .append('image')
        .attr('clip-path', 'url(#avatar-clip)')
        .attr('xlink:href', (d) => d.img!)
        .attr('x', nodeImageX)
        .attr('y', nodeImageY)
        .attr('height', nodeImageHeight)
        .attr('width', nodeImageWidth)
        .on('mouseenter', function () {
          select(this)
            .transition()
            .attr('x', -(nodeMenuWidth + nodeZoomFactor) / 2)
            .attr('y', -nodeMenuheight / 2)
            .attr('height', nodeMenuheight + nodeZoomFactor)
            .attr('width', nodeMenuWidth + nodeZoomFactor);
        })
        .on('mouseleave', function () {
          select(this)
            .transition()
            .attr('x', -nodeMenuWidth / 2)
            .attr('y', (-nodeMenuheight + 20) / 2)
            .attr('height', nodeMenuheight)
            .attr('width', nodeMenuWidth);
        })
    )
    .call((g) =>
      g
        .append('circle')
        .attr('r', nodeRadius)
        .attr('stroke-width', 3)
        .attr('stroke', '#000')
        .attr('stroke-opacity', 0)
        .attr('fill', '#000')
        .attr('fill-opacity', 0)
    )
    .call((g) =>
      g
        .append('text')
        .text((d) => d.name.toUpperCase())
        .attr('font-size', fontSize)
        .attr('text-transform', 'uppercase')
        .style('transform', 'translateY(55px)')
        .style('pointer-events', 'none')
        .attr('font-family', 'Oswald')
        .attr('fill', '#fff')
    );
};
