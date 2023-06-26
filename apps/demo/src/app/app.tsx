import { ForceDirectedGraph, Link, Node } from 'react-force-directed-graph';
import styles from './app.module.scss';
import { useState } from 'react';

const links: Link[] = [
  {
    id: 28576,
    source: 11244,
    target: 6263,
    type: 'fighter_attend_fight',
    props: {
      submission_award: 'False',
      performance_award: 'False',
      corner: 'red',
      outcome: 'Loss',
      ko_award: 'False',
    },
  },
  {
    id: 18583,
    source: 11244,
    target: 2220,
    type: 'fighter_born_in',
    props: {},
  },
  {
    id: 18439,
    source: 11244,
    target: 4968,
    type: 'fighter_attend_fight',
    props: {
      submission_award: 'False',
      performance_award: 'False',
      corner: 'blue',
      outcome: 'Win',
      ko_award: 'False',
    },
  },
  {
    id: 17046,
    source: 11244,
    target: 2022,
    type: 'fighter_attend_fight',
    props: {
      submission_award: 'False',
      performance_award: 'False',
      corner: 'red',
      outcome: 'Win',
      ko_award: 'False',
    },
  },
  {
    id: 14790,
    source: 11244,
    target: 1974,
    type: 'fighter_attend_fight',
    props: {
      submission_award: 'False',
      performance_award: 'False',
      corner: 'red',
      outcome: 'Win',
      ko_award: 'False',
    },
  },
  {
    id: 11876,
    source: 11244,
    target: 1717,
    type: 'fighter_attend_fight',
    props: {
      submission_award: 'False',
      performance_award: 'False',
      corner: 'red',
      outcome: 'Win',
      ko_award: 'False',
    },
  },
  {
    id: 10881,
    source: 11244,
    target: 3281,
    type: 'fighter_weight_class',
    props: {},
  },
  {
    id: 5574,
    source: 11244,
    target: 2220,
    type: 'fight_out_of',
  },
];
const nodes: Node[] = [
  {
    id: 11244,
    img: 'http://ufc-official.obs.ae-ad-1.vb.g42cloud.com/fighter_images/head_3094.png',
    name: 'Giga Chikadze',
    type: 'Fighter',
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
    id: 6263,
    name: 'Giga Chikadze vs Austin Springer',
    type: 'Fight',
    props: {
      ending_round: '3',
      card_start_time: '2018-06-20 00:00:00',
      ending_time: '250',
      rounds_desc: '3 Rnd (5-5-5)',
      card_broadcaster: 'UFC Fight Pass',
      ending_method: 'Submission',
      fight_award: 'False',
      fight_id: '7296',
      ending_position: 'From Bottom Back Control',
      name: 'Giga Chikadze vs Austin Springer',
      fight_order: '3',
      card: 'Main',
      rounds: '3',
      ending_submission: 'Rear Naked Choke',
      status: 'Final',
    },
  },
  {
    id: 2220,
    name: 'Georgia',
    type: 'Country',
    props: {
      name: 'Georgia',
      country_id: 'GEO',
    },
  },
  {
    id: 4968,
    name: 'Brandon Davis vs Giga Chikadze',
    type: 'Fight',
    props: {
      ending_round: '3',
      card_start_time: '2019-09-28 15:00:00',
      ending_time: '300',
      rounds_desc: '3 Rnd (5-5-5)',
      card_broadcaster: 'ESPN+',
      ending_method: 'Decision - Split',
      fight_award: 'False',
      fight_id: '8146',
      name: 'Brandon Davis vs Giga Chikadze',
      fight_order: '10',
      card: 'Prelims1',
      rounds: '3',
      status: 'Final',
    },
  },
  {
    id: 2022,
    name: 'Giga Chikadze vs Jamall Emmers',
    type: 'Fight',
    props: {
      ending_round: '3',
      card_start_time: '2020-03-08 00:00:00',
      ending_time: '300',
      rounds_desc: '3 Rnd (5-5-5)',
      card_broadcaster: 'UFC Fight Pass',
      ending_method: 'Decision - Split',
      fight_award: 'False',
      fight_id: '8347',
      name: 'Giga Chikadze vs Jamall Emmers',
      fight_order: '10',
      card: 'Prelims2',
      rounds: '3',
      status: 'Final',
    },
  },
  {
    id: 1974,
    name: 'Giga Chikadze vs Irwin Rivera',
    type: 'Fight',
    props: {
      ending_round: '3',
      card_start_time: '2020-05-16 22:00:00',
      ending_time: '300',
      rounds_desc: '3 Rnd (5-5-5)',
      card_broadcaster: 'ESPN',
      ending_method: 'Decision - Unanimous',
      fight_award: 'False',
      fight_id: '8444',
      name: 'Giga Chikadze vs Irwin Rivera',
      fight_order: '8',
      card: 'Prelims1',
      rounds: '3',
      status: 'Final',
    },
  },
  {
    id: 1717,
    name: 'Giga Chikadze vs Omar Morales',
    type: 'Fight',
    props: {
      ending_round: '3',
      card_start_time: '2020-10-10 21:00:00',
      ending_time: '300',
      rounds_desc: '3 Rnd (5-5-5)',
      card_broadcaster: 'ESPN+',
      ending_method: 'Decision - Unanimous',
      fight_award: 'False',
      fight_id: '8756',
      name: 'Giga Chikadze vs Omar Morales',
      fight_order: '11',
      card: 'Prelims1',
      rounds: '3',
      status: 'Final',
    },
  },
  {
    id: 3281,
    name: 'Featherweight',
    type: 'WeightClass',
    props: {
      name: 'Featherweight',
      weight_class_id: '6',
      max_weight: '145',
      min_weight: '136',
    },
  },
];

export function App() {
  const [state, setState] = useState({ nodes, links });

  return (
    <div className={styles['container']}>
      <ForceDirectedGraph
        links={state.links}
        nodes={state.nodes}
        deleteNode={(node) =>
          setState((state) => ({
            ...state,
            nodes: nodes.filter((n) => n.id !== node.id),
            links: links.filter(
              (l) => node.id !== l.source && node.id !== l.target
            ),
          }))
        }
      />
    </div>
  );
}

export default App;
