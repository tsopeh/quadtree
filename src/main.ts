import p5 from 'p5'
import { sketchParticleCollisionsDemo } from './sketch-particle-collisions-demo.ts'
import { sketchQuadtreeDemo } from './sketch-quadtree-demo.ts'

const mainEl = document.createElement('main')
document.body.appendChild(mainEl)

new p5(
  sketchQuadtreeDemo({
    canvasSizePx: 600,
    capacityThreshold: 1,
    pointDiameterPx: 8,
    randomPointsCount: 1000,
  }),
  mainEl,
)

new p5(
  sketchParticleCollisionsDemo({
    canvasSizePx: 600,
    particlesCount: 1000,
    solitaryRadius: 5,
    collisionRadius: 10,
  }),
  mainEl,
)