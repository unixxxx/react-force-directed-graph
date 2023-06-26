import { SimulationNodeDatum } from 'd3';

export type ID = number;

export type NodeType = string;
export type LinkType = string;

export type Node = {
  id: ID;
  name: string;
  type: NodeType;
  img?: string;
  highlight?: boolean;
  props?: Record<string, unknown>;
} & SimulationNodeDatum;

export type Link = {
  id: ID;
  source: ID;
  target: ID;
  type: LinkType;
  highlight?: boolean;
  props?: Record<string, unknown>;
};
