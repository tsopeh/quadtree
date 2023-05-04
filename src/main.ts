import p5 from 'p5'
import { sketchParticleCollisionsDemo } from './sketch-particle-collisions-demo.ts'
import { sketchQuadtreeDemo } from './sketch-quadtree-demo.ts'

const mainEl = document.createElement('main')
document.body.appendChild(mainEl)

new p5(
  sketchQuadtreeDemo({
    canvasSizePx: 400,
    capacityThreshold: 1,
    pointRadiusPx: 3,
    randomPointsCount: 500,
  }),
  mainEl,
)

new p5(
  sketchParticleCollisionsDemo({
    canvasSizePx: 400,
    particlesCount: 2000,
    solitaryRadius: 3,
    collisionRadius: 6,
    // method: 'naive',
    method: 'quadtree',
  }),
  mainEl,
)

// Performance monitor
;(function () {
  var s = document.createElement('script')
  s.onload = function () {
    //@ts-ignore
    new permon.Permon()
  }, s.src = '//tsopeh.github.io/permon/dist/permon.iife.js', document.head.appendChild(s)
})()