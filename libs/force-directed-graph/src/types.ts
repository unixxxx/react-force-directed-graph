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
