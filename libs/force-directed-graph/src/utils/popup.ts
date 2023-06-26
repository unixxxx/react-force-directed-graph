import { Selection, select } from 'd3';
import { Node } from '../types';

export const renderPopup = (
  el: Selection<SVGForeignObjectElement, unknown, null, undefined>,
  node: Node
) => {
  const maybe = (action: () => void, prop): void => {
    if (!prop) return;
    action();
  };

  const renderProp = (
    container: Selection<HTMLDivElement, unknown, null, undefined>,
    name: string,
    prop: string
  ) => {
    const row = container.append('div').attr('class', 'row');
    row.append('p').attr('class', 'title').html(name);
    row.append('p').attr('class', 'value').html(prop);
  };

  const popupContent = el
    .append('xhtml:div')
    .attr('class', 'popup')
    .on('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  const popupHead = popupContent.append('div').attr('class', 'popupHead');
  const closeIcon = popupHead.append('p').attr('class', 'close').html('✕');
  closeIcon.on('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    select('.svg-popup').html('');
  });

  maybe(
    () => popupHead.append('p').attr('class', 'name').html(`${node.name}`),
    node.name
  );

  const popupBody = popupContent.append('div').attr('class', 'popupBody');
  Object.keys(node?.props || {}).forEach((key) => {
    maybe(
      () =>
        renderProp(
          popupBody,
          key.replace(/_/g, ' '),
          (node.props || {})[key] as string
        ),
      !key.includes('id')
    );
  });
};
