'use strict';

const insertCssRule = (() => {
  let i = 0;
  const newStyle = document.createElement('style');
  document.head.appendChild(newStyle);
  return rule => {
    newStyle.sheet.insertRule(rule, i++);
  };
})();
// 动画keyframe名和class名相同
const getOnlyFrameName = (() => {
  let i = 0;
  return () => 'keyframe' + i++;
})();
class animateDiv {
  constructor(config) {
    // 以下校验模块开发用，生产待删除
    if (typeof config.parentDiv !== 'object' || config.parentDiv.nodeType !== 1) {
      console.error('入参错误or挂载了非element元素');
      return;
    }
    // 所有动画效果
    this.devEles = ['movements'];
    this.parentProps = ['width', 'height', 'bgImg', 'circle'];
    for (const needProp of this.parentProps) {
      if (!(needProp in config)) {
        console.error('容器元素属性缺失');
        return;
      }
    }
    this.props = ['delay', 'static', 'active', 'duration'];
    this.staticProps = ['width', 'height', 'src'];
    for (const [key, val] of Object.entries(config)) {
      if (this.isArray(val)) {
        if (!this.devEles.includes(key)) {
          console.error('未添加此类动画');
          return;
        }
        for (const subval of val) {
          for (const subNeed of this.props) {
            if (!(subNeed in subval)) {
              console.error('动画元素属性缺失');
              return;
            }
          }
          // if (!this.props.includes(subval)) {
          // }
          if (typeof subval.static !== 'object') {
            console.error('static not an object');
            return;
          }
          for (const subNeed of this.staticProps) {
            if (!(subNeed in subval.static)) {
              console.error('static中必要属性缺失');
              return;
            }
          }
          // if (!this.props.includes(subval)) {
          // }
        }
      }
    }
    // 以上开发用，生产待删除

    // 挂载元素初始
    config.parentDiv.style = `position:relative;margin:0 auto;width:${config.width};height:${config.height};background:url(${config.bgImg})  no-repeat center / 100% 100%;`;
    // lastAction表一组动画最后那个动作的持续时间，如果要循环整组动画需要自己配置，默认一秒
    this.config = Object.assign({ lastAction: 2000 }, config);
    this.clocks = [];
    this.mountDiv();
    this.setSequence();
  }
  mountDiv() {
    let str = '',
      clssName = '';
    // 静态style
    for (const cval of Object.values(this.config)) {
      // 找到movements并处理
      if (this.isArray(cval)) {
        // 找个每一个动画的组成单元
        for (const subval of cval) {
          let staitcStyle = '',
            beginAnimate = '';
          // 静态样式
          for (const [key, value] of Object.entries(subval.static)) {
            if (key !== 'src') {
              staitcStyle += key + ':' + value + ';';
            }
          }
          // 动画生成,绑定类名
          if (subval.active) {
            for (const [bkey, bval] of Object.entries(subval.active)) {
              beginAnimate += bkey + ':' + bval[0] + ';';
            }
            clssName = this.insertAnimateRule(subval.active, subval.duration, subval.fMode);
          }
          if (!subval.active) {
            beginAnimate = clssName = '';
          }
          // 这里static的值或者active的第一个元素都可以设置初始状态
          str += `<input type="checkbox" class="dnone" /><div class="${clssName}" style="position:absolute;overflow:hidden;background:url(${subval.static.src}) no-repeat 50% 50% / 100%;${staitcStyle}${beginAnimate}"></div>`;
          this.clocks.push({ tida: null, bomb: subval.delay });
        }
      }
    }
    this.config.parentDiv.innerHTML = str;
  }
  isArray(arr) {
    return Object.prototype.toString.call(arr).slice(8, -1) === 'Array';
  }
  insertAnimateRule(rules, duration, fMode) {
    let keyFrame = '',
      actions = 0;

    const frameName = getOnlyFrameName(),
      stopsArr = [],
      middleFrameArr = new Map();
    // 动画效果时长默认被均分，之后有需要还得增加非均分
    for (const [key, val] of Object.entries(rules)) {
      // subval.active ? Object.entries(subval.active).forEach(([key,val]) => {
      if (!this.isArray(val) || val.length < 2) {
        console.error('acitive 属性值不是数组,或未至少包含两个状态');
        return;
      }
      if (actions === 0) {
        actions = val.length;
        const intvl = Math.ceil(100 / (val.length - 1));
        let j = 0,
          stopPoint = intvl * j;
        while (stopPoint < 100) {
          stopsArr.push(stopPoint + '%');
          j++;
          stopPoint = intvl * j;
        }
        stopsArr.push('100%');
      }
      if (val.length !== actions) {
        console.error('帧数不一致');
        return;
      }
      let n = 0;
      while (n < stopsArr.length) {
        const tmp = stopsArr[n];
        if (!middleFrameArr.has(tmp)) {
          middleFrameArr.set(tmp, []);
        }
        if (val[n]) {
          middleFrameArr.get(tmp).push(`${key}:${val[n]};`);
        }
        n++;
      }
    }
    for (const [key, val] of middleFrameArr.entries()) {
      keyFrame += `${key} {${val.join('')}}`;
    }
    keyFrame = `@keyframes ${frameName} {${keyFrame}}`;
    insertCssRule(keyFrame);
    insertCssRule(`input:checked + .${frameName} {animation: ${frameName} ${duration} linear 0s;animation-fill-mode:${fMode || 'forwards'};}`);
    return frameName;
  }

  setSequence() {
    const search = this.config.parentDiv,
      self = this;
    // 这里不用sort，而是保证动画div的config内的delay默认按从小到大排列，因为sort虽然保证启动的一定是最后一个模块，但是对应的index却不一定和html的顺序一致，而且sort是个费时操作
    // this.clocks.sort((a, b) => a.bomb - b.bomb);
    this.clocks.forEach((clock, index) => {
      clock.tida = setTimeout(() => {
        search.getElementsByTagName('input')[index].checked = true;
        clearTimeout(clock.tida);
        // 动画是否循环模块在此
        if (index === self.clocks.length - 1 && self.config.circle) {
          const tmp = setTimeout(() => {
            [...search.getElementsByTagName('input')].forEach(theInput => {
              theInput.checked = false;
            });
            self.setSequence();
            clearTimeout(tmp);
          }, self.config.lastAction); // 这里的时间一定要大于此组动画最后那个动画的持续时间
        }
      }, clock.bomb);
    });
  }
}
module.exports = { animateDiv };
