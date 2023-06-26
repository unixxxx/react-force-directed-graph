/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { select, Selection, arc } from 'd3';

import { Node, NodeAction } from '../types';

import { fontSizeToNumber, scale } from './helpers';
import { renderPopup } from './popup';

const toRadian = (degree: number) => degree * (Math.PI / 180);

export const renderNodes = (
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>,
  nodesContainer: Selection<SVGGElement, unknown, null, undefined>,
  nodes: Node[],
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    const innerRadius = (item.nodeRadius || 40) + 5;
    const outerRadius = innerRadius + 35;
    const widthMenu = (innerRadius + outerRadius) * 1.5;
    const heightMenu = (innerRadius + outerRadius) * 1.5;

    const actions = (item.actions as NodeAction[]) || [];
    const menuItemAngle = 360 / actions.length;
    const angles = actions.map((_, i) => toRadian(i * menuItemAngle));

    const menuDataSet =
      actions.map((action, index) => ({
        ...action,
        startAngle: angles[index],
        endAngle: index < angles.length - 1 ? angles[index + 1] : toRadian(360),
        innerRadius,
        outerRadius,
      })) ?? [];

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

    const arcOptions = (item, i: number) => ({
      innerRadius: item.innerRadius,
      outerRadius: item.outerRadius,
      startAngle: i * toRadian(menuItemAngle),
      endAngle: (i + 1) * toRadian(menuItemAngle),
      padAngle: 0.05,
    });

    const menuArc = arc();
    g.append('path')
      .attr('class', 'menuItem')
      .attr('id', (d) => d.title)
      .attr('d', (item, i) => menuArc(arcOptions(item, i)))
      .attr('fill', '#000')
      .attr('opacity', 0.9);

    g.append('image')
      .attr('xlink:href', (_, i) => menuDataSet[i].icon)
      .attr('stroke', 'white')
      .each(function (d, i) {
        const centroid = menuArc.centroid(d);
        select(this)
          .attr('x', centroid[0])
          .attr('y', centroid[1])
          .style('transform', 'translate(-5%, -5%)');
      });
    const card = thisNode
      .insert('foreignObject')
      .attr('id', 'popupCard')
      .attr('width', popupCardWidth)
      .attr('height', popupCardHeight)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr('x', (this as any).getBBox().x + innerRadius / 2 + nodeMenuWidth)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr('y', (this as any).getBBox().y + innerRadius / 2 + nodeMenuWidth)
      .attr('class', 'svg-popup');

    if (item.props) {
      renderPopup(card, item);
    }
    /* bring dynamically added elements to front (simulates z-index)*/
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (svg.select('g#popupContainer').node() as any).appendChild(this);
  }

  svg
    .selectAll('defs')
    .data(nodes, (d: any) => d?.id)
    .enter()
    .append('clipPath')
    .attr('id', (d) => d.id)
    .append('circle')
    .attr('r', (d) => d.nodeRadius ?? nodeRadius);

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
        .attr('r', (d) => d.nodeRadius ?? nodeRadius)
        .attr('stroke-width', 3)
        .attr(
          'stroke',
          (d) => d.css?.borderColor ?? scale(d.type + d.id + d.id)
        )
        .attr(
          'fill',
          (d) =>
            d.css?.background ?? d.css?.backgroundColor ?? scale(d.type + d.id)
        )
    )
    .call((g) =>
      g
        .filter((d) => !!d.image)
        .append('image')
        .attr('clip-path', (d) => `url(#${d.id})`)
        .attr('xlink:href', (d) => d.image!)
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
        .attr('r', (d) => d.nodeRadius ?? nodeRadius)
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
        .attr('font-size', (d) => d.css?.fontSize ?? fontSize)
        .attr('text-transform', 'uppercase')
        .style(
          'transform',
          (d) =>
            `translateY(${
              (d.nodeRadius ?? nodeRadius) +
              fontSizeToNumber(d.css?.fontSize, fontSize)
            }px)`
        )
        .style('pointer-events', 'none')
        .attr('font-family', (d) => d.css?.fontFamily ?? 'auto')
        .attr('fill', (d) => d.css?.color ?? '#fff')
    );
};
