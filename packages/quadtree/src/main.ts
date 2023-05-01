import p5 from 'p5'
import { Point, Quadtree, Region } from './quadtree'

const quadtreeCapacity = 2
const particleDiameter = 8
const canvasSize = 600

const sketch = (p: p5) => {

  const qt = new Quadtree(
    new Region(0, 0, canvasSize, canvasSize),
    quadtreeCapacity,
  )

  p.setup = () => {
    p.createCanvas(canvasSize, canvasSize)
    p.background(64)
  }

  p.mouseClicked = (e: PointerEvent) => {
    const x = e.offsetX
    const y = e.offsetY
    qt.insert(new Point(x, y))
    for (let i = 0; i < 3; i++) {
      const randomNearPoint = new Point(x + p.random(-30, 30), y + p.random(-30, 30))
      qt.insert(randomNearPoint)
    }
  }

  p.draw = () => {
    drawQuadtree(p, qt)
  }
}

const drawQuadtree = (p: p5, qt: Quadtree): void => {
  qt.getRegions().forEach((region) => {
    p.stroke(255)
    p.noFill()
    p.rect(region.x, region.y, region.w, region.h)
  })
  qt.getPoints().forEach(point => {
    p.noStroke()
    p.fill(255, 211, 0)
    p.ellipse(point.x, point.y, particleDiameter, particleDiameter)
  })
}

new p5(sketch, document.body)