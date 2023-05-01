import p5 from 'p5'
import { Point, Quadtree, Region } from './quadtree'

const quadtreeCapacity = 2
const pointsCount = 256
const particleDiameter = 8
const canvasSize = 600

const sketch = (p: p5) => {

  const qt = new Quadtree(
    new Region(0, 0, canvasSize, canvasSize),
    quadtreeCapacity,
  )

  p.setup = () => {
    p.createCanvas(canvasSize, canvasSize)
    p.background(32)

    for (let i = 0; i < pointsCount; i++) {
      const aPoint = new Point(p.random(canvasSize), p.random(canvasSize))
      qt.insert(aPoint)
    }
    drawQuadtree(p, qt)
  }

  p.draw = () => {
  }
}

const drawQuadtree = (p: p5, qt: Quadtree): void => {
  qt.getRegions().forEach((region) => {
    p.stroke(255)
    p.noFill()
    p.rect(region.x, region.y, region.w, region.h)
  })
  qt.getPoints().forEach(point => {
    p.stroke(255, 211, 0)
    p.ellipse(point.x, point.y, particleDiameter, particleDiameter)
  })
}

new p5(sketch, document.body)