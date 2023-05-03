import p5 from 'p5'
import { Point, Quadtree, Region } from './quadtree.ts'

interface QuadtreeDemoParams {
  capacityThreshold: number
  canvasSizePx: number
  pointRadiusPx: number
  randomPointsCount: number
}

const drawQuadtree = (p: p5, qt: Quadtree, pointRadius: number): void => {
  qt.queryLeafRegions().forEach((region) => {
    p.stroke(255)
    p.noFill()
    p.rect(region.x, region.y, region.w, region.h)
  })
  qt.queryPoints().forEach(point => {
    p.noStroke()
    p.fill(255, 211, 0)
    p.ellipse(point.x, point.y, 2 * pointRadius, 2 * pointRadius)
  })
}

const drawHighlight = (p: p5, region: Region, qt: Quadtree, pointRadius: number): void => {
  p.stroke(0, 255, 0)
  p.noFill()
  p.rect(region.x, region.y, region.w, region.h)
  qt.queryPoints(region).forEach(point => {
    p.noStroke()
    p.fill(255, 0, 0)
    p.ellipse(point.x, point.y, 2 * pointRadius, 2 * pointRadius)
  })
}

const isInsideCanvas = (p: p5) => p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height

export const sketchQuadtreeDemo = (params: QuadtreeDemoParams) => {

  return (p: p5) => {
    const { canvasSizePx, capacityThreshold, randomPointsCount, pointRadiusPx } = params

    const qt = new Quadtree(
      { x: 0, y: 0, w: canvasSizePx, h: canvasSizePx },
      capacityThreshold,
      Array.from({ length: randomPointsCount }).map((): Point => ({
        x: p.random(canvasSizePx),
        y: p.random(canvasSizePx),
      })),
    )

    p.setup = () => {
      p.createCanvas(canvasSizePx, canvasSizePx)
    }

    p.mouseClicked = (e: PointerEvent) => {
      if (!isInsideCanvas(p)) {
        return false
      }
      const x = e.offsetX
      const y = e.offsetY
      qt.insert({ x, y })
      for (let i = 0; i < 10; i++) {
        const randomNearPoint: Point = { x: x + p.random(-30, 30), y: y + p.random(-30, 30) }
        qt.insert(randomNearPoint)
      }
    }

    const highlightSize = 100
    let highlightRegion: Region | null = null

    p.mouseMoved = (({ offsetX, offsetY }: PointerEvent) => {
      if (!isInsideCanvas(p)) {
        return false
      }
      const newX = offsetX - highlightSize / 2
      const newY = offsetY - highlightSize / 2
      if (highlightRegion == null) {
        highlightRegion = {
          x: newX,
          y: newY,
          w: highlightSize,
          h: highlightSize,
        }
      } else {
        highlightRegion.x = newX
        highlightRegion.y = newY
      }
      return false
    })

    p.draw = () => {
      p.background(64)
      drawQuadtree(p, qt, pointRadiusPx)
      if (highlightRegion != null) {
        drawHighlight(p, highlightRegion, qt, pointRadiusPx)
      }
    }
  }
}