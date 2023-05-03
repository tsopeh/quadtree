import p5 from 'p5'
import { Point, Quadtree, Region } from './quadtree.ts'

interface ParticleCollisionsDemoParams {
  canvasSizePx: number
  particlesCount: number
  solitaryRadius: number
  collisionRadius: number
}

interface Particle extends Point {
  radius: number
}

const drawNaiveCollisions = (p: p5, particles: Array<Particle>) => {
  particles.forEach((particle) => {
    const { x, y, radius } = particle
    const isColliding = particles.some(otherParticle => {
      return otherParticle != particle
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

const drawQuadtreeCollisions = (p: p5, particles: Array<Particle>, rootRegion: Region) => {

  const quadTree = new Quadtree(rootRegion, 1, particles)

  particles.forEach((particle) => {
    const { x, y, radius } = particle
    const isColliding = quadTree.queryPoints({ x: x - radius, y: y - radius, w: radius * 2, h: radius * 2 }).length > 1
    p.noStroke()
    if (isColliding) {
      p.fill(255, 211, 0)
    } else {
      p.fill(255)
    }
    p.circle(x, y, 2 * radius)
  })
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

      // drawNaiveCollisions(p, particles)
      drawQuadtreeCollisions(p, particles, { x: 0, y: 0, w: canvasSizePx, h: canvasSizePx })
    }

  }

}