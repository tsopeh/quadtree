export interface Point {
  x: number
  y: number
}

export interface Region {
  x: number
  y: number
  w: number
  h: number
}

const regionContains = (region: Region, point: Point): boolean => {
  return point.x > region.x
    && point.x <= region.x + region.w
    && point.y > region.y
    && point.y <= region.y + region.h
}

const regionIntersects = (a: Region, b: Region): boolean => {
  const isNotIntersecting = b.x > a.x + a.w
    || b.x + b.w < a.x
    || b.y > a.y + a.h
    || b.y + b.h < a.y
  return !isNotIntersecting
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

  public queryLeafRegions (): Array<Region> {
    const acc: Array<Region> = []
    this._queryRegions(acc)
    return acc
  }

  public insert (point: Point) {
    if (!regionContains(this.region, point)) {
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
        { x: x + w / 2, y, w: newW, h: newH },
        capacity,
      ),
      ne: new Quadtree(
        { x, y, w: newW, h: newH },
        capacity,
      ),
      se: new Quadtree(
        { x: x + w / 2, y: y + h / 2, w: newW, h: newH },
        capacity,
      ),
      sw: new Quadtree(
        { x, y: y + h / 2, w: newW, h: newH },
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
    if (!regionIntersects(this.region, region)) {
      return
    }
    if (Array.isArray(this.points)) {
      this.points.forEach((point) => {
        if (regionContains(region, point)) {
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