import p5 from 'p5'
import { Point, Quadtree, Region } from './quadtree'

const quadtreeCapacity = 2
const particleDiameter = 8
const canvasSize = 600

const sketch = (p: p5) => {

  const qt = new Quadtree(
    new Region(0, 0, canvasSize, canvasSize),
    quadtreeCapacity,
    Array.from({ length: 50 }).map(() => new Point(p.random(canvasSize), p.random(canvasSize))),
  )

  p.setup = () => {
    p.createCanvas(canvasSize, canvasSize)
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

  const highlightSize = 200
  let highlightRegion: Region | null = null

  p.mouseMoved = (({ offsetX, offsetY }: PointerEvent) => {
    highlightRegion = new Region(offsetX - highlightSize / 2, offsetY - highlightSize / 2, highlightSize, highlightSize)
  })

  p.draw = () => {
    p.background(64)
    drawQuadtree(p, qt)
    if (highlightRegion != null) {
      drawHighlight(p, highlightRegion, qt)
    }
  }

}

const drawQuadtree = (p: p5, qt: Quadtree): void => {
  qt.queryRegions().forEach((region) => {
    p.stroke(255)
    p.noFill()
    p.rect(region.x, region.y, region.w, region.h)
  })
  qt.queryPoints().forEach(point => {
    p.noStroke()
    p.fill(255, 211, 0)
    p.ellipse(point.x, point.y, particleDiameter, particleDiameter)
  })
}

const drawHighlight = (p: p5, region: Region, qt: Quadtree): void => {
  p.stroke(0, 255, 0)
  p.noFill()
  p.rect(region.x, region.y, region.w, region.h)
  qt.queryPoints(region).forEach(point => {
    p.noStroke()
    p.fill(255, 0, 0)
    p.ellipse(point.x, point.y, particleDiameter, particleDiameter)
  })
}

new p5(sketch, document.body)