export default class PointsModel {
  constructor(object) {
    this.object = object;
    this.points = this.object.getPoints();
  }

  get() {
    return this.points;
  }
}

