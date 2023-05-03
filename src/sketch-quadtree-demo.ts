import p5 from 'p5'
import { Point, Quadtree, Region } from './quadtree.ts'

interface QuadtreeDemoParams {
  capacityThreshold: number
  canvasSizePx: number
  pointDiameterPx: number
  randomPointsCount: number
}

const drawQuadtree = (p: p5, qt: Quadtree, pointDiameter: number): void => {
  qt.queryLeafRegions().forEach((region) => {
    p.stroke(255)
    p.noFill()
    p.rect(region.x, region.y, region.w, region.h)
  })
  qt.queryPoints().forEach(point => {
    p.noStroke()
    p.fill(255, 211, 0)
    p.ellipse(point.x, point.y, pointDiameter, pointDiameter)
  })
}

const drawHighlight = (p: p5, region: Region, qt: Quadtree, pointDiameter: number): void => {
  p.stroke(0, 255, 0)
  p.noFill()
  p.rect(region.x, region.y, region.w, region.h)
  qt.queryPoints(region).forEach(point => {
    p.noStroke()
    p.fill(255, 0, 0)
    p.ellipse(point.x, point.y, pointDiameter, pointDiameter)
  })
}

export const sketchQuadtreeDemo = (params: QuadtreeDemoParams) => {

  return (p: p5) => {
    const { canvasSizePx, capacityThreshold, randomPointsCount, pointDiameterPx } = params

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
      const x = e.offsetX
      const y = e.offsetY
      qt.insert({ x, y })
      for (let i = 0; i < 10; i++) {
        const randomNearPoint: Point = { x: x + p.random(-30, 30), y: y + p.random(-30, 30) }
        qt.insert(randomNearPoint)
      }
    }

    const highlightSize = 200
    let highlightRegion: Region | null = null

    p.mouseMoved = (({ offsetX, offsetY }: PointerEvent) => {
      const isInsideCanvas = p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height
      if (isInsideCanvas) {
        highlightRegion = {
          x: offsetX - highlightSize / 2,
          y: offsetY - highlightSize / 2,
          w: highlightSize,
          h: highlightSize,
        }
      }
      return false
    })

    p.draw = () => {
      p.background(64)
      drawQuadtree(p, qt, pointDiameterPx)
      if (highlightRegion != null) {
        drawHighlight(p, highlightRegion, qt, pointDiameterPx)
      }
    }
  }
}