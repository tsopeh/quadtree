import p5 from 'p5'
import { sketchQuadtreeDemo } from './sketch-quadtree-demo'

new p5(
  sketchQuadtreeDemo({
    canvasSizePx: 600,
    capacityThreshold: 1,
    pointDiameterPx: 8,
    randomPointsCount: 1000,
  }),
  document.body,
)
