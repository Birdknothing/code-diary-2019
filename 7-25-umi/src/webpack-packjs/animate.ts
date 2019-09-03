const moveMode = {
  // t表示 已消耗动画的时间
  // b表示 小球的原始位置
  // c表示 小球经过的总路程
  // d表示 动画持续的总时间
  // 返回值表示 已过t时间的位置
  linear(timePassed, originPos, distance, wholeTime) {
    return (distance * timePassed) / wholeTime + originPos;
  },
  easeIn(t, b, c, d) {
    return c * t * (t /= d) + b;
  },
  strongEaseIn(t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },
  strongEaseOut(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
  },
  sineaseIn(t, b, c, d) {
    return c * (t /= d) * t * t + b;
  },
  sineaseOut(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
};
class Animate {
  stepTime = 10;
  clocks = [];
  div: any;
  unit: string;
  propName: string;
  translateX: number;
  constructor({ unit = '%', div, translateX = 0 }) {
    this.unit = unit;
    this.div = div;
    this.translateX = translateX;
  }
  move(propName, des: number, dur = 1000, mode = 'sineaseOut') {
    return new Promise(res => {
      const clockIndex = this.clocks.length;
      const startTime = Date.now();
      const self = this;
      this.clocks[clockIndex] = setInterval(() => {
        const nowTime = Date.now();
        const propInit = self[propName];
        self.update(propName, moveMode[mode](nowTime - startTime, propInit, des - propInit, dur));
        if (nowTime >= startTime + dur) {
          clearInterval(self.clocks[clockIndex]);
          self.update(propName, des);
          res();
          // self.div.style.transform = des + self.unit;
        }
      }, this.stepTime);
    });
  }
  update(prop, val) {
    this.div.style.transform = `${prop}(${val}${this.unit})`;
  }
}
export { Animate };
