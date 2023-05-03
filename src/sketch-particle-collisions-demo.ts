import p5 from 'p5'
import { Point } from './quadtree.ts'

interface ParticleCollisionsDemoParams {
  canvasSizePx: number
  particlesCount: number
  solitaryRadius: number
  collisionRadius: number
}

interface Particle extends Point {
  radius: number
}

export const sketchParticleCollisionsDemo = (params: ParticleCollisionsDemoParams) => {

  const { canvasSizePx, particlesCount, solitaryRadius } = params

  return (p: p5) => {

    p.setup = () => {
      p.createCanvas(canvasSizePx, canvasSizePx)
    }

    const particles =
      Array.from({ length: particlesCount }).map((): Particle => {
        return {
          x: p.random(canvasSizePx),
          y: p.random(canvasSizePx),
          radius: solitaryRadius,
        }
      })

    p.draw = () => {
      p.background(64)

      particles.forEach(particle => {
        particle.x += p.random(-1, 1)
        particle.y += p.random(-1, 1)
      })

      particles.forEach(({ x, y, radius }) => {
        p.noStroke()
        p.fill(255)
        p.circle(x, y, 2 * radius)
      })
    }

  }

}