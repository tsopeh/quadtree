import p5 from 'p5'
import { Point, Quadtree } from './quadtree.ts'

interface ParticleCollisionsDemoParams {
  canvasSizePx: number
  particlesCount: number
  solitaryRadius: number
  collisionRadius: number
  method: 'naive' | 'quadtree'
}

interface Particle extends Point {
  radius: number
}

const getNeighbors_Quadtree = ({ x, y, radius }: Particle, quadTree: Quadtree<Particle>) => {
  const discoveryRadius = radius * 2
  return quadTree.queryPoints({
    x: x - discoveryRadius,
    y: y - discoveryRadius,
    w: discoveryRadius * 2,
    h: discoveryRadius * 2,
  })
}

const getNeighbors_Naive = (origin: Particle, others: ReadonlyArray<Particle>): Array<Particle> => {
  return others.filter(other => other != origin)
}

export const sketchParticleCollisionsDemo = (params: ParticleCollisionsDemoParams) => {

  const { canvasSizePx, particlesCount, solitaryRadius, method } = params

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

      // Displace points a little bit.
      particles.forEach(particle => {
        particle.x += p.random(-1, 1)
        particle.y += p.random(-1, 1)
      })

      // Setup Quadtree
      let quadtree = method == 'quadtree'
        ? new Quadtree({ x: 0, y: 0, w: canvasSizePx, h: canvasSizePx }, 1, particles)
        : null

      // Render particle collisions based on the selected `method`.
      particles.forEach((particle) => {
        const { x, y, radius } = particle
        const neighbors = method == 'quadtree'
          ? getNeighbors_Quadtree(particle, quadtree!)
          : getNeighbors_Naive(particle, particles)
        const isColliding = neighbors.some(otherParticle => {
          return particle != otherParticle
            && (p.dist(x, y, otherParticle.x, otherParticle.y) < radius + otherParticle.radius)
        })
        p.noStroke()
        if (isColliding) {
          p.fill(255, 211, 0)
        } else {
          p.fill(255)
        }
        p.circle(x, y, 2 * radius)
      })
    }

  }

}