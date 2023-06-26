import { ForceDirectedGraph, Link, Node } from 'react-force-directed-graph';
import loadNodes from './loadChildNodes.svg';
import closeNode from './close.svg';

import styles from './app.module.scss';
import { useState } from 'react';

export function App() {
  const [state, setState] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [
      {
        id: 11244,
        name: 'Giga Chikadze',
        type: 'Fighter',
        image:
          'https://dmxg5wxfqgb4u.cloudfront.net/styles/athlete_bio_full_body/s3/2021-04/69723%252Fprofile-galery%252Ffullbodyleft-picture%252FCHIKADZE_GIGA_L_05-01.png?VersionId=null&itok=MaDZ0T0W',
        nodeRadius: 50,
      },
      {
        id: 2220,
        name: 'Georgia',
        type: 'Country',
        nodeRadius: 70,
        actions: [
          {
            title: 'loadRelations',
            action: (node) =>
              setState((state) => ({
                ...state,
                links: [
                  ...state.links,
                  {
                    id: 18585,
                    source: 2220,
                    target: 11245,
                    type: 'fighter_born_in',
                  },
                  {
                    id: 55554,
                    source: 2220,
                    target: 11245,
                    type: 'fight_out_of',
                  },
                ],
                nodes: [
                  ...state.nodes,
                  {
                    id: 11245,
                    name: 'Merab Dvalishvili',
                    image:
                      'https://dmxg5wxfqgb4u.cloudfront.net/2023-03/DVALISHVILI_MERAB_03-11.png',
                    type: 'Fighter',
                    nodeRadius: 50,
                  },
                ],
              })),
            icon: loadNodes,
          },
          {
            title: 'deleteNode',
            action: (node) =>
              setState((state) => ({
                ...state,
                nodes: state.nodes.filter((n) => n.id !== node.id),
                links: state.links.filter(
                  (l) =>
                    node.id !== (l.source as Node).id &&
                    node.id !== (l.target as Node).id
                ),
              })),
            icon: closeNode,
          },
        ],
      },
    ],
    links: [
      {
        id: 18583,
        source: 11244,
        target: 2220,
        type: 'fighter_born_in',
      },
      {
        id: 5574,
        source: 11244,
        target: 2220,
        type: 'fight_out_of',
      },
    ],
  });

  return (
    <div className={styles['container']}>
      <ForceDirectedGraph links={state.links} nodes={state.nodes} />
    </div>
  );
}

export default App;
