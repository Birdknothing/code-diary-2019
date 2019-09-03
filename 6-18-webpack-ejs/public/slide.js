'use strict';
const onlyClass = (() => {
  let i = 0;
  return () => 'slide' + i++;
})();
class slideDiv {
  constructor(userConfig) {
    if (!this.isArray(userConfig.divs)) {
      console.error('not array');
      return;
    }
    if (!('slideWidth' in userConfig) || !('slideHeight' in userConfig)) {
      console.error('slideWidth & slideHeight are required !');
      return;
    }
    const defaultConfig = {
        mountDiv: '',
        divName: '',
        divs: [], // 每个div都有宽高表示嵌入的动画块宽高
        // slideBox的宽高
        height: '1000px',
        width: '100%',
        // 这表示每个会切换滑块的宽高
        slideHeight: '600px',
        slideWidth: '800px',
        // 需计算的slideArea滑动区域总宽
        flexWidth: '200px',
        // 滑动间隔
        intvl: 1000
      },
      self = this;
    this.config = Object.assign(defaultConfig, userConfig);
    if (typeof this.config.mountDiv !== 'object' || this.config.mountDiv.nodeType !== 1) {
      console.error('入参错误or轮播图挂载了非element元素');
      return;
    }
    this.cssRule = 0;
    this.length = this.config.divs.length;
    this.config.flexWidth = this.length * parseInt(this.config.slideWidth) || '100px';
    this.classNames = [];
    this.intvl = this.config.intvl / 1000 + 's';
    this.genClass();
    this.createSlide();
    this.classNames.forEach((className, index) => {
      // 需改享元模式
      const eachAnimate = typeof self.config.divs[index] === 'string' ? JSON.parse(self.config.divs[index]) : self.config.divs[index];
      eachAnimate.parentDiv = document.getElementsByClassName(self.config.divName + className)[0];
      new animateDiv(eachAnimate);
    });
    this.bindArrow();
  }
  isArray(arr) {
    return Object.prototype.toString.call(arr).slice(8, -1) === 'Array';
  }
  genClass() {
    for (let i = 0; i < this.length; i++) {
      this.classNames.push(onlyClass());
    }
  }
  insertRule(rule) {
    insertCssRule(rule);
    // this.styleSheet.sheet.insertRule(rule, this.cssRule++);
  }
  bindArrow() {
    const search = this.config.mountDiv,
      self = this;
    search.getElementsByClassName('arrows')[0].addEventListener('click', function(event) {
      for (const input of search.getElementsByClassName(`inputGroup${self.classNames[0]}`)) {
        if (input.checked === true) {
          const cName = event.target.className;
          const targetInput = cName === 'arrowLeft' || cName === 'pl' ? input.previousElementSibling : cName === 'arrowRight' || cName === 'pr' ? input.nextElementSibling : '';
          targetInput && targetInput.checked === false && (targetInput.checked = true);
          break; // 同一个坑别跳两次，你是不是忘了为啥用for循环了，还是自己写个新的forEach？
        }
      }
    });
  }
  createSlide() {
    const { height, width, slideHeight, slideWidth, flexWidth } = this.config,
      slideArea = `<div style="position:absolute;display:flex;flex-wrap:nowrap;height:${slideHeight};width:${flexWidth};" class="slideArea">`,
      arrows = '<div class="arrows"><div class="arrowLeft"><div class="pl"></div></div><div class="arrowRight"><div class="pr"></div></div></div>',
      self = this;
    let slideBox = `<div class="slideBox" style="position:relative;height:${height};width:${width};margin:0 auto;overflow:hidden;">`,
      slideAnimate = '',
      slideItem = '',
      inputs = '',
      attachBox = '',
      dots = '';

    this.config.divs.forEach((div, ind) => {
      const picSrc = typeof div === 'string' ? div.match(/"belowPic":"([^"]*)"/)[1] : div.belowPic;
      // html 部分
      // 圆点
      dots += `<div class="dot dot${ind}"></div>`;
      // trick part
      inputs += `<input type="radio" class="dnone inputGroup${self.classNames[0]} inputOf${self.classNames[ind]}" name="inputGroup${self.classNames[0]}" ${ind === 0 ? 'checked' : ''}>`;
      // 会被嵌入的动画块
      slideAnimate = `<div class="${self.config.divName}${self.classNames[ind]}"></div>`;
      // 会跟随滑块的额外部分，此为底图
      attachBox = `<div class="picBox ${self.config.divName}Pic"><img src="${picSrc}" style="width:100%"></div>`;
      // 滑动部分
      slideItem += `<div class="slideItem slideItem${ind}" style="width:${slideWidth}">` + slideAnimate + attachBox + '</div>';

      // style 部分
      self.insertRule(`input[class~="inputOf${self.classNames[ind]}"]:checked ~ .dots .dot${ind} {opacity: .8}`);
      self.insertRule(`input[class~="inputOf${self.classNames[ind]}"]:checked ~ .slideArea {transform: translateX(${-ind * parseInt(slideWidth)}px);transition: all ${self.intvl} ease;}`);
      // styleSheet.insertRule(,styleSheet.cssRules.length)
    });

    dots = '<div class="dots">' + dots + '</div>';
    slideBox = slideBox + inputs + slideArea + slideItem + '</div>' + dots + arrows + '</div>';
    self.config.mountDiv.innerHTML = slideBox;
  }
}
module.exports = { slideDiv };
