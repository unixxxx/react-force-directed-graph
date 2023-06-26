import { select, Selection, zoom } from 'd3';

const getPointFromEvent = event => {
  const point = { x: 0, y: 0 };
  if (event.targetTouches) {
    point.x = event.targetTouches[0].clientX;
    point.y = event.targetTouches[0].clientY;
  } else {
    point.x = event.clientX;
    point.y = event.clientY;
  }

  return point;
};

export const addDragAndZoom = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selection: Selection<any, any, any, any>,
  { width, height }: { width: number; height: number }
) => {
  let dragging = false;
  const pointerOrigin = {
    x: 0,
    y: 0,
  };
  const viewBox = {
    x: -width / 2,
    y: -height / 2,
    width: width * 1.5,
    height: height * 1.5,
  };
  const newViewBox = {
    x: viewBox.x,
    y: viewBox.y,
    width: viewBox.width,
    height: viewBox.height,
  };

  const pointerDown = event => {
    dragging = true;
    const pointerPosition = getPointFromEvent(event);
    pointerOrigin.x = pointerPosition.x;
    pointerOrigin.y = pointerPosition.y;
  };

  const pointerMove = event => {
    if (dragging) {
      const pointerPosition = getPointFromEvent(event);

      const ratioX = newViewBox.width / selection.node().getBoundingClientRect().width;
      const ratioY = newViewBox.height / selection.node().getBoundingClientRect().height;

      newViewBox.x = viewBox.x - (pointerPosition.x - pointerOrigin.x) * ratioX;
      newViewBox.y = viewBox.y - (pointerPosition.y - pointerOrigin.y) * ratioY;

      selection.attr('viewBox', [newViewBox.x, newViewBox.y, newViewBox.width, newViewBox.height].join(' '));
    }
  };

  const pointerUp = () => {
    dragging = false;
    viewBox.x = newViewBox.x;
    viewBox.y = newViewBox.y;
  };

  const zoomFn = zoom()
    .scaleExtent([1 / 2, 2])
    .on('zoom', event => {
      const k = event.transform.k;
      newViewBox.width = viewBox.width / k;
      newViewBox.height = viewBox.height / k;
      selection.attr('viewBox', [viewBox.x, viewBox.y, newViewBox.width, newViewBox.height].join(' '));
    })
    .filter(d => {
      /* disable zoom if the pointer is on the popup*/
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const popupCard = select('.svg-popup').node() as any;
      if (!popupCard) return true;
      const popupBounding = popupCard.getBoundingClientRect();
      const xBound = [popupBounding.x, popupBounding.x + popupBounding.width];
      const yBound = [popupBounding.y, popupBounding.y + popupBounding.height];
      const pointerCoordinates = getPointFromEvent(d);

      const containsPoint = (point, p1, p2) => p1 <= point && point <= p2;
      return !(
        containsPoint(pointerCoordinates.x, xBound[0], xBound[1]) &&
        containsPoint(pointerCoordinates.y, yBound[0], yBound[1])
      );
    });

  selection
    .call(zoomFn)
    .on('mousedown.zoom', pointerDown)
    .on('mousemove.zoom', pointerMove)
    .on('mouseup.zoom', pointerUp)
    .on('dblclick.zoom', null);
};
