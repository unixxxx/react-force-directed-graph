import { ForceDirectedGraph, Link, Node } from 'react-force-directed-graph';
import loadNodes from './loadChildNodes.svg';
import removeNode from './close.svg';

import styles from './app.module.scss';
import { useState } from 'react';

export function App() {
  const [state, setState] = useState<{ nodes: Node[]; links: Link[] }>({
    nodes: [
      {
        id: 1,
        name: 'Giga Chikadze',
        type: 'Fighter',
        image:
          'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcR-2BjQqsQraBhE6WVM8YaB7ogvfA5mQ6Nte6w_pt1SQZwV1i2pqA8ZRaRWGeta_UpM17b3WRLOK3EulFg',
        nodeRadius: 50,
        actions: [
          {
            title: 'deleteNode',
            action: (node) => console.log(node),
            icon: removeNode,
          },
          {
            title: 'loadRelations',
            action: (node) => console.log(node),
            icon: loadNodes,
          },
        ],
        props: {
          ufc_bonus_total: '0',
          fighting_out_of_city: 'Tbilisi',
          reach: '74.0',
          record_losses: '2',
          born_country: 'Georgia',
          record_wins: '11',
          ufc_bonus_ko_of_the_night: '0',
          career_offensive_breakdown_sub_att: '0.0',
          ufc_bonus_submission_of_the_night: '0',
          born_city: 'Tbilisi',
          height: '72.0',
          weight: '145.0',
          career_offensive_breakdown_str_lan: '83.68',
          career_offensive_breakdown_td_lan: '16.32',
          reach_metric: '188.0',
          record_draws: '0',
          fighter_id: '3094',
          ufc_bonus_performance_of_the_night: '0',
          weight_metric: '65.8',
          dob: '1988-08-25',
          name: 'Giga Chikadze',
          record_no_contests: '0',
          fighting_out_of_country: 'Georgia',
          ufc_bonus_fight_of_the_night: '0',
          stance: 'Orthodox',
          age: '32',
          height_metric: '182.9',
        },
      },
      {
        id: 2,
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
                    id: 2,
                    source: 3,
                    target: 2,
                    type: 'Fighter Born In',
                  },
                ],
                nodes: [
                  ...state.nodes,
                  {
                    id: 3,
                    name: 'Merab Dvalishvili',
                    type: 'Fighter',
                    image:
                      'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRrO0TTPisSb1AmHEtiMZiyTm4QwbDCkAhAHuhwXjJJ9Jq-zX7y01hOgu7ctTSJa69p6ZoYzQBKO3ilPJk',
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
            icon: removeNode,
          },
        ],
      },
    ],
    links: [
      {
        id: 2,
        source: 1,
        target: 2,
        type: 'fighter_born_in',
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
