import { FC, createRef, useEffect, useState } from 'react';
import { Selection, Simulation } from 'd3';

import { Node, Link } from '../types';
import { createSvg } from '../utils/createSvg';

import { renderNodes, setNodeIconDef } from '../utils/renderNodes';
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

  loadLinks?: (node: Node) => void;
  deleteNode?: (node: Node) => void;
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
  deleteNode,
  loadLinks,
  fontSize = 13,
  nodeRadius = 35,
}) => {
  let simulation: Simulation<Node, undefined>;

  const wrapperRef = createRef<HTMLDivElement>();
  const graphRef = createRef<SVGSVGElement>();

  const [state, setState] = useState<State | undefined>(undefined);

  useEffect(() => {
    if (wrapperRef.current) {
      const { offsetWidth: width, offsetHeight: height } = wrapperRef.current;
      const { defs, linksContainer, nodesContainer, svg } = createSvg(
        graphRef,
        width,
        height
      );

      addDragAndZoom(svg, {
        width,
        height,
      });

      setState({
        svg,
        defs,
        linksContainer,
        nodesContainer,
      });
    }
  }, []);

  useEffect(() => {
    updateGraph();
  }, [state]);

  const updateGraph = () => {
    if (state) {
      console.log('asdasd');
      state.svg.select('defs').html('');
      setNodeIconDef(state.defs, nodeRadius);
      setLinkArrowDefs(state.defs, links, nodeRadius);

      const linkLabels = setLinkRectDefs(state.defs, links);
      simulation = simulationFn(nodes, links);

      const renderedLinks = renderLinks(state.linksContainer, links);
      const renderedNodes = renderNodes(
        state.svg,
        state.nodesContainer,
        nodes,
        (node) => loadLinks && loadLinks(node),
        (node) => deleteNode && deleteNode(node),
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
  };

  return (
    <div className="force-directed-graph" ref={wrapperRef}>
      <svg ref={graphRef} />
    </div>
  );
};

export default ForceDirectedGraph;
