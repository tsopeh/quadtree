import p5 from 'p5'
import { Point, Quadtree, Region } from './quadtree'

const particleDiameter = 8
const canvasSize = 600

export const sketch = (p: p5) => {

  const qt = new Quadtree(
    new Region(0, 0, canvasSize, canvasSize),
    3,
  )

  p.setup = () => {
    p.createCanvas(canvasSize, canvasSize)
    p.background(220)
    // p.ellipse(50, 50, 80, 80)

    for (let i = 0; i < 5; i++) {
      const aPoint = new Point(i / 5 * canvasSize + 10, i / 5 * canvasSize + 10)
      qt.insert(aPoint)
      p.ellipse(aPoint.x, aPoint.y, particleDiameter, particleDiameter)
    }
    console.log(qt)

  }

  p.draw = () => {
  }
}

new p5(sketch, document.body)