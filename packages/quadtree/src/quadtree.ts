export class Point {

  public constructor (
    public readonly x: number,
    public readonly y: number,
  ) {
  }

}

export class Region {

  public constructor (
    public readonly x: number,
    public readonly y: number,
    public readonly w: number,
    public readonly h: number,
  ) {
  }

  public contains ({ x, y }: Point): boolean {
    return x > this.x
      && x <= this.x + this.w
      && y > this.y
      && y <= this.y + this.h
  }

}

type Subdivisions = {
  ne: Quadtree
  nw: Quadtree
  se: Quadtree
  sw: Quadtree
}

export class Quadtree {

  private readonly points: Array<Point> = []
  private subdivisions: null | Subdivisions = null

  public constructor (
    private readonly region: Region,
    private readonly capacity: number,
    points?: ReadonlyArray<Point>,
  ) {
    points?.forEach((point) => {
      this.insert(point)
    })
  }

  public insert (point: Point) {
    if (!this.region.contains(point)) {
      return
    }
    if (this.subdivisions == null && this.points.length < this.capacity) {
      this.points.push(point)
    } else {
      if (this.subdivisions == null) {
        this.subdivide()
      }
      this.insertIntoSubdivision(point)
    }
  }

  private subdivide () {
    const { x, y, w, h } = this.region
    const newW = w / 2
    const newH = h / 2
    const capacity = this.capacity
    this.subdivisions = {
      nw: new Quadtree(
        new Region(x + w / 2, y, newW, newH),
        capacity,
      ),
      ne: new Quadtree(
        new Region(x, y, newW, newH),
        capacity,
      ),
      se: new Quadtree(
        new Region(x + w / 2, y + h / 2, newW, newH),
        capacity,
      ),
      sw: new Quadtree(
        new Region(x, y + h / 2, newW, newH),
        capacity,
      ),
    }
    while (this.points.length > 0) {
      const shifted = this.points.shift()!
      this.insertIntoSubdivision(shifted)
    }
  }

  private insertIntoSubdivision (point: Point): void {
    if (this.subdivisions == null) {
      throw new Error(`Subdivisions do not exist.`)
    }
    this.subdivisions.ne.insert(point)
    this.subdivisions.nw.insert(point)
    this.subdivisions.se.insert(point)
    this.subdivisions.sw.insert(point)
  }

}