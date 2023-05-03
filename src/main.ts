import p5 from 'p5'
import { sketchParticleCollisionsDemo } from './sketch-particle-collisions-demo.ts'
import { sketchQuadtreeDemo } from './sketch-quadtree-demo.ts'

const mainEl = document.createElement('main')
document.body.appendChild(mainEl)

new p5(
  sketchQuadtreeDemo({
    canvasSizePx: 400,
    capacityThreshold: 1,
    pointDiameterPx: 8,
    randomPointsCount: 500,
  }),
  mainEl,
)

new p5(
  sketchParticleCollisionsDemo({
    canvasSizePx: 400,
    particlesCount: 2000,
    solitaryRadius: 4,
    collisionRadius: 6,
  }),
  mainEl,
)