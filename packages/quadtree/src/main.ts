import p5 from 'p5'
import { sketchParticleCollisionsDemo } from './sketch-particle-collisions-demo'
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

new p5(
  sketchParticleCollisionsDemo({
    canvasSizePx: 600,
    particlesCount: 1000,
    solitaryRadius: 5,
    collisionRadius: 10,
  }),
  document.body,
)