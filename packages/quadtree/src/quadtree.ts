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

  public intersects (region: Region): boolean {
    const isNotIntersecting = region.x > this.x + this.w
      || this.x + this.w < region.x
      || region.y > this.y + this.h
      || this.y + this.h < this.y
    return !isNotIntersecting
  }

}

type Subdivisions = {
  readonly ne: Quadtree
  readonly nw: Quadtree
  readonly se: Quadtree
  readonly sw: Quadtree
}

export class Quadtree {

  private points: Array<Point> | Subdivisions = []

  public constructor (
    private readonly region: Region,
    private readonly capacity: number,
    points?: ReadonlyArray<Point>,
  ) {
    points?.forEach((point) => {
      this.insert(point)
    })
  }

  public queryPoints (region?: Region): Array<Point> {
    const acc: Array<Point> = []
    this._queryPoints(region ?? this.region, acc)
    return acc
  }

  public queryRegions (): Array<Region> {
    const acc: Array<Region> = []
    this._queryRegions(acc)
    return acc
  }

  public insert (point: Point) {
    if (!this.region.contains(point)) {
      return
    }
    if (Array.isArray(this.points) && this.points.length < this.capacity) {
      this.points.push(point)
    } else {
      if (Array.isArray(this.points)) {
        this.subdivide()
      }
      if (Array.isArray(this.points)) {
        throw new Error(`Quadtree was suposed to be subdivided at this point`)
      }
      this.points.ne.insert(point)
      this.points.nw.insert(point)
      this.points.se.insert(point)
      this.points.sw.insert(point)
    }
  }

  private subdivide () {
    if (!Array.isArray(this.points)) {
      throw new Error(`Points were already divided.`)
    }
    const { x, y, w, h } = this.region
    const newW = w / 2
    const newH = h / 2
    const capacity = this.capacity
    const subdivisions: Subdivisions = {
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
      subdivisions.ne.insert(shifted)
      subdivisions.nw.insert(shifted)
      subdivisions.se.insert(shifted)
      subdivisions.sw.insert(shifted)
    }
    this.points = subdivisions
  }

  private _queryPoints (region: Region, acc: Array<Point>): void {
    if (!this.region.intersects(region)) {
      return
    }
    if (Array.isArray(this.points)) {
      this.points.forEach((point) => {
        if (region.contains(point)) {
          acc.push(point)
        }
      })
    } else {
      this.points.ne._queryPoints(region, acc)
      this.points.nw._queryPoints(region, acc)
      this.points.se._queryPoints(region, acc)
      this.points.sw._queryPoints(region, acc)
    }
  }

  private _queryRegions (acc: Array<Region>): void {
    if (Array.isArray(this.points)) {
      acc.push(this.region)
    } else {
      this.points.ne._queryRegions(acc)
      this.points.nw._queryRegions(acc)
      this.points.se._queryRegions(acc)
      this.points.sw._queryRegions(acc)
    }
  }

}