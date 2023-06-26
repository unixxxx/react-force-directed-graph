# d3.js force directed graph implementation using React

### types

```
import { SimulationNodeDatum } from 'd3';
import { CSSProperties } from 'react';

export type ID = number;

export type NodeType = string;
export type LinkType = string;

export type NodeAction = {
  title: string;
  icon: string;
  action: (node: Node) => void;
};

export type Node = {
  id: ID;
  name: string;
  type: NodeType;
  actions?: NodeAction[];
  image?: string;
  css?: CSSProperties;
  nodeRadius?: number;
  props?: Record<string, unknown>;
} & SimulationNodeDatum;

export type Link = {
  id: ID;
  source: ID | Node;
  target: ID | Node;
  type: LinkType;
  css?: CSSProperties;
  props?: Record<string, unknown>;
};


export interface ForceDirectedGraphProps {
  nodes: Node[];
  links: Link[];
  nodeRadius?: number;
  fontSize?: number;
  useZoom?: boolean;
}
```

### usage

```
    import { ForceDirectedGraph, Link, Node } from 'react-force-directed-graph';

    ...
    ...

    const [nodes, setNodes] = useState<Node[]>([]);
    const [links, setLinks] = useState<Link[]>([]);

    <ForceDirectedGraph links={links} nodes={nodes} />
```

### Check the demo app for more complete examples
