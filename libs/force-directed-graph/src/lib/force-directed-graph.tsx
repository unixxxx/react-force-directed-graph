import { FC, createRef, useEffect, useState } from 'react';
import { Selection, Simulation } from 'd3';

import { Node, Link } from '../types';
import { createSvg } from '../utils/createSvg';

import { renderNodes } from '../utils/renderNodes';
import {
  renderLinks,
  setLinkArrowDefs,
  setLinkRectDefs,
} from '../utils/renderLinks';
import { addDragAndZoom } from '../utils/dragAndZoom';
import {
  simulateDrag,
  simulationFn,
  tickSimulation,
} from '../utils/simulation';

import './force-directed-graph.scss';

export interface ForceDirectedGraphProps {
  nodes: Node[];
  links: Link[];
  nodeRadius?: number;
  fontSize?: number;
  useZoom?: boolean;
}

interface State {
  svg: Selection<SVGSVGElement | null, unknown, null, undefined>;
  linksContainer: Selection<SVGGElement, unknown, null, undefined>;
  nodesContainer: Selection<SVGGElement, unknown, null, undefined>;
  defs: Selection<SVGGElement, unknown, null, undefined>;
}

export const ForceDirectedGraph: FC<ForceDirectedGraphProps> = ({
  links,
  nodes,
  fontSize = 13,
  nodeRadius = 35,
  useZoom: useDrag = false,
}) => {
  const wrapperRef = createRef<HTMLDivElement>();
  const graphRef = createRef<SVGSVGElement>();

  const [state, setState] = useState<State | undefined>(undefined);

  useEffect(() => {
    if (wrapperRef.current && graphRef.current) {
      const { offsetWidth: width, offsetHeight: height } = wrapperRef.current;
      const { defs, linksContainer, nodesContainer, svg } = createSvg(
        graphRef,
        width,
        height
      );

      if (useDrag) {
        addDragAndZoom(svg, {
          width,
          height,
        });
      }

      setState({
        svg,
        defs,
        linksContainer,
        nodesContainer,
      });
    }
  }, [links, nodes, nodeRadius, fontSize]);

  useEffect(() => {
    if (state) {
      state.svg.select('defs').html('');
      setLinkArrowDefs(state.defs, links, nodeRadius);

      const linkLabels = setLinkRectDefs(state.defs, links, fontSize);
      const simulation = simulationFn(nodes, links);

      const renderedLinks = renderLinks(state.linksContainer, links);
      const renderedNodes = renderNodes(
        state.svg,
        state.nodesContainer,
        nodes,
        nodeRadius,
        fontSize
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ).call(simulateDrag(simulation) as any);
      simulation.on('tick', () =>
        tickSimulation(
          renderedNodes,
          renderedLinks,
          linkLabels,
          links,
          nodeRadius
        )
      );
    }
  }, [state, links, nodes, nodeRadius, fontSize]);

  return (
    <div className="force-directed-graph" ref={wrapperRef}>
      <svg ref={graphRef} />
    </div>
  );
};

export default ForceDirectedGraph;
