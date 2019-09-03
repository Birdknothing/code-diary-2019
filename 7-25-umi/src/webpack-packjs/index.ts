const curry = (f, length = f.length) => {
  return (...args) =>
    length - args.length > 0
      ? curry((...argsRest) => f.call(f, ...args, ...argsRest), length - args.length)
      : f.apply(null, args);
};
const $bind = curry((ename, f, dom) => {
  dom.addEventListener(ename, f.bind(dom));
  return dom;
});
const $class = className => {
  const tmp = document.getElementsByClassName(className);
  return tmp.length === 1 ? tmp[0] : Array.from(tmp);
};

/////////////////////////////////开始
const interval = 6000;
const moveTime = 3000;
const pics = 4;
///////////////////////////////
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
  move(propName, des: number, dur, mode = 'sineaseOut') {
    return new Promise(res => {
      const clockIndex = this.clocks.length;
      const startTime = Date.now();
      const self = this;
      this.clocks[clockIndex] = setInterval(() => {
        const nowTime = Date.now();
        const propInit = self[propName];
        self.update(propName, moveMode[mode](nowTime - startTime, propInit, des - propInit, dur).toFixed(2));
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
interface lunboProps {
  height?: string | number;
  interval?: number;
  width?: string | number;
  indicator?: boolean;
  divs?: lunboItem[];
}
interface lunboItem {
  picSrc?: string;
  render?: (x?: any) => any;
  content?: string | object;
}

class Slide {
  canClick = true;
  whole: number;
  nowIndex: number;
  nextIndex: number;
  prevIndex: number;
  className: string;
  width: number;
  interval: number;
  unit: string;
  constructor({ whole, nowIndex, className, width, interval, unit }) {
    this.whole = whole;
    this.updateIndex(nowIndex);
    this.className = className;
    this.width = this.parseWidth(width);
    this.interval = interval;
    this.unit = unit;
  }
  parseWidth(width) {
    return typeof width === 'number' ? width : parseInt(width);
  }

  updateIndex(nowindex: number) {
    const { whole } = this;
    this.nowIndex = nowindex % whole;
    this.nextIndex = (nowindex + 1) % whole;
    this.prevIndex = nowindex === 0 ? whole - 1 : nowindex - 1;
  }
  async step(direction: number) {
    this.canClick = false;
    const { className, nextIndex, prevIndex, unit, nowIndex, width, interval } = this;
    const whichIndex = direction === 1 ? nextIndex : prevIndex;
    const prev = $class(className)[whichIndex];
    const now = $class(className)[nowIndex];

    this.updateIndex(whichIndex);
    // -1左置 1右置
    prev.style.transform = `translateX(${direction * width}${unit})`;
    prev.style.zIndex = 1;
    // 移动
    await Promise.all([
      new Animate({ div: prev, unit, translateX: direction * width }).move(
        'translateX',
        0,
        interval,
      ),
      new Animate({ div: now, unit, translateX: 0 }).move(
        'translateX',
        -1 * direction * width,
        interval,
      ),
    ]).then(() => {
      now.style.zIndex = 0;
      now.style.transform = `translateX(0${unit})`;
      this.canClick = true;
    });
  }
}

const lunboSlide = new Slide({
  whole: pics,
  nowIndex: 0,
  className: 'lunboItemBox',
  width: '100%',
  interval:moveTime,
  unit: '%',
});
$class('lunboItemBox')[0].style.zIndex = 1;
// 箭头点击
const leftClick = function() {
  if (lunboSlide.canClick) {
    lunboSlide.step(1);
  }
};
const rightClick = function() {
  if (lunboSlide.canClick) {
    lunboSlide.step(-1);
  }
};
$bind('click', leftClick, $class('arrowLeft'));
$bind('click', rightClick, $class('arrowRight'));
($class('tabHead') as Element[]).forEach(div => {
  $bind(
    'click',
    function() {
      this.previousElementSibling.checked = true;
    },
    div,
  );
});
const cc = () => {
  let clock = setTimeout(() => {
    lunboSlide.step(1);
    clearTimeout(clock);
    cc();
  }, interval);
};
cc();
