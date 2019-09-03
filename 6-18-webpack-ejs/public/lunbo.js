'use strict';
// ui未给图片页面所占尺寸，只能暂时手动控制
const times = 2.66;
const srcUrl = './display/';
const s = function(px, ep) {
  const es = ep || 1;
  return ((px.split('px')[0] / times) * es).toFixed(2) + 'px';
};
// 每个对象压缩成字符串应是最优，而不是一组动画成json数组
const divConfig = {
  term0: [
    //           0 ---------------------------- 1

    {
      // parentDiv: document.getElementById('test'),这是一个必须的属性
      circle: true,
      bgImg: srcUrl + 'passenger/1/1.png',
      width: s('1575px'),
      height: s('1790px'),
      belowPic: srcUrl + 'passenger/1/bar.png',
      movements: [
        {
          delay: 100,
          static: {
            left: s('513px'),
            top: s('608px'),
            src: srcUrl + 'passenger/1/2.png',
            width: s('314px'),
            height: s('109px')
          },
          active: {
            transform: ['scale(1)', 'scale(.3)', 'scale(1)', 'scale(.3)', 'scale(1)']
          },
          duration: '.4s'
        },
        {
          delay: 600,
          static: {
            left: s('516px'),
            top: s('150px'),
            transform: 'scale(0)',
            src: srcUrl + 'passenger/1/3.png',
            width: s('663px'),
            height: s('1441px')
          },
          active: {
            transform: ['scale(0)', 'scale(1)']
          },
          duration: '.3s'
        },
        {
          delay: 1000,
          static: {
            transform: 'translate(' + s('400px') + ',' + s('430px') + ') scale(0)',
            src: srcUrl + 'passenger/1/4.png',
            width: s('691px'),
            height: s('728px')
          },
          active: {
            transform: ['translate(' + s('400px') + ',' + s('430px') + ') scale(0)', 'translate(' + s('840px') + ',' + s('430px') + ') scale(1)']
          },
          duration: '.3s'
        }
      ]
    },
    //           0 ---------------------------- 2
    {
      circle: true,
      bgImg: srcUrl + 'passenger/2/1.png',
      width: s('1575px'),
      height: s('1790px'),
      belowPic: srcUrl + 'passenger/2/bar.png',
      movements: [
        {
          delay: 900,
          static: {
            // left: s('0px'),
            // top: s('880px'),
            src: srcUrl + 'passenger/2/2.png',
            width: s('191px', 1.5),
            height: s('510px', 1.5)
          },
          active: {
            opacity: ['0', '1'],
            transform: ['translate(' + s('0px') + ',' + s('880px') + ') scale(1)', 'translate(' + s('240px') + ',' + s('880px') + ') scale(1)']
          },
          duration: '.3s'
        },
        {
          delay: 1200,
          static: {
            left: s('525px'),
            top: s('1200px'),
            src: srcUrl + 'passenger/2/3.png',
            width: s('1280px', 0.5),
            height: s('450px', 0.5)
          },
          active: {
            'background-size': [`${s('254px')} ${s('205px')}`, '', `${s('254px')} ${s('205px')}`, `${s('254px', 0.8)} ${s('205px', 0.8)}`, `${s('254px', 0.8)} ${s('205px', 0.8)}`, `${s('254px', 0.8)} ${s('205px', 0.8)}`],
            'background-position': [s('180px') + ' center', s('180px') + ' center', s('-140px') + ' center', s('-140px') + ' center', s('-140px') + ' center', s('-380px') + ' center'],
            opacity: [1, 1, 0.4, 0.4, 0.4, 0.4]
          },
          duration: '1s'
        },
        {
          delay: 1200,
          static: {
            left: s('525px'),
            top: s('1200px'),
            src: srcUrl + 'passenger/2/4.png',
            width: s('1280px', 0.5),
            height: s('450px', 0.5)
          },
          active: {
            'background-size': [`${s('254px', 0.8)} ${s('205px', 0.8)}`, `${s('254px', 0.8)} ${s('205px', 0.8)}`, `${s('254px', 0.8)} ${s('205px', 0.8)}`, `${s('254px')} ${s('205px')}`, `${s('254px')} ${s('205px')}`, `${s('254px', 0.8)} ${s('205px', 0.8)}`, `${s('254px', 0.8)} ${s('205px', 0.8)}`],
            'background-position': [s('570px') + ' center', s('570px') + ' center', s('180px') + ' center', s('180px') + ' center', s('180px') + ' center', s('-140px') + ' center', s('-140px') + ' center'],
            opacity: [0.4, 0.4, 1, 1, 1, 0.4, 0.4]
          },
          duration: '1.2s'
        },
        {
          delay: 1200,
          static: {
            left: s('525px'),
            top: s('1200px'),
            src: srcUrl + 'passenger/2/5.png',
            width: s('1280px', 0.5),
            height: s('450px', 0.5)
          },
          active: {
            'background-size': [`${s('254px', 0.8)} ${s('205px', 0.8)}`, `${s('254px', 0.8)} ${s('205px', 0.8)}`, `${s('254px', 0.8)} ${s('205px', 0.8)}`, `${s('254px', 0.8)} ${s('205px', 0.8)}`, `${s('254px', 0.8)} ${s('205px', 0.8)}`, `${s('254px', 0.8)} ${s('205px', 0.8)}`, `${s('254px')} ${s('205px')}`],
            'background-position': [s('880px') + ' center', s('880px') + ' center', s('570px') + ' center', s('570px') + ' center', s('570px') + ' center', s('180px') + ' center', s('180px') + ' center'],
            opacity: [0.4, 0.4, 0.4, 0.4, 0.4, 1, 1]
          },
          duration: '1.2s'
        }
      ]
    },
    //           0 ---------------------------- 3
    {
      // parentDiv: document.getElementById('test'),这是一个必须的属性
      circle: true,
      bgImg: srcUrl + 'passenger/3/1.png',
      width: s('1575px'),
      height: s('1790px'),
      belowPic: srcUrl + 'passenger/3/bar.png',
      movements: [
        {
          delay: 900,
          static: {
            left: s('480px'),
            top: s('1260px'),
            src: srcUrl + 'passenger/3/3.png',
            width: s('183px'),
            height: s('183px')
          },
          active: {
            opacity: ['0', '1'],
            transform: ['scale(0)', 'scale(2.2)']
          },
          duration: '.3s'
        },
        {
          delay: 1200,
          static: {
            left: s('1060px'),
            top: s('160px'),
            src: srcUrl + 'passenger/3/2.png',
            width: s('600px'),
            height: s('750px')
          },
          active: {
            opacity: ['0', '1'],
            transform: ['scale(0)', 'scale(1)']
          },
          duration: '.3s'
        }
      ]
    },
    //           0 ---------------------------- 4
    {
      circle: true,
      bgImg: srcUrl + 'passenger/4/1.png',
      width: s('1575px'),
      height: s('1790px'),
      belowPic: srcUrl + 'passenger/4/bar.png',
      movements: [
        {
          delay: 900,
          static: {
            src: srcUrl + 'passenger/4/2.png',
            width: s('1113px', 0.59),
            height: s('504px', 0.59),
            'z-index': 2
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${s('514px')},${s('500px')})`, `translate(${s('514px')},${s('840px')})`]
          },
          duration: '.3s'
        },
        {
          delay: 1200,
          static: {
            src: srcUrl + 'passenger/4/3.png',
            width: s('1113px', 0.59),
            height: s('552px', 0.59),
            'z-index': 1
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${s('514px')},${s('900px')})`, `translate(${s('514px')},${s('1140px')})`]
          },
          duration: '.3s'
        },
        {
          delay: 1200,
          static: {
            src: srcUrl + 'passenger/4/4.gif',
            width: s('124px', 1.8),
            height: s('46px', 1.8),
            'z-index': 1
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${s('680px')},${s('945px')})`, `translate(${s('680px')},${s('1185px')})`]
          },
          duration: '.3s'
        }
      ]
    },
    //           0 ---------------------------- 5
    {
      circle: true,
      bgImg: srcUrl + 'passenger/5/1.png',
      width: s('1575px'),
      height: s('1790px'),
      belowPic: srcUrl + 'passenger/5/bar.png',
      movements: [
        {
          delay: 0,
          static: {
            left: s('534px'),
            top: s('328px'),
            src: srcUrl + 'passenger/5/4.png',
            width: s('627px'),
            height: s('310px'),
            'z-index': 3
          },
          active: null,
          duration: ''
        },
        {
          delay: 900,
          static: {
            src: srcUrl + 'passenger/5/2.png',
            width: s('1125px', 0.58),
            height: s('732px', 0.58),
            'z-index': 2
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${s('514px')},${s('310px')})`, `translate(${s('514px')},${s('645px')})`]
          },
          duration: '.5s'
        },
        {
          delay: 1400,
          static: {
            src: srcUrl + 'passenger/5/3.png',
            width: s('1125px', 0.58),
            height: s('636px', 0.58),
            'z-index': 1
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${s('514px')},${s('700px')})`, `translate(${s('514px')},${s('1090px')})`]
          },
          duration: '.5s'
        }
      ]
    },
    //           0 ---------------------------- 6
    {
      circle: true,
      bgImg: srcUrl + 'passenger/6/1.png',
      width: s('1575px'),
      height: s('1790px'),
      belowPic: srcUrl + 'passenger/6/bar.png',
      movements: [
        {
          delay: 900,
          static: {
            left: s('275px'),
            top: s('1246px'),
            src: srcUrl + 'passenger/6/2.png',
            width: s('1100px'),
            height: s('205px')
          },
          active: {
            opacity: ['0', '1'],
            transform: ['scale(0)', 'scale(1)']
          },
          duration: '.4s'
        }
      ]
    }
  ],
  term1: [
    //           1 ---------------------------- 1
    {
      circle: true,
      bgImg: srcUrl + 'driver/1/1.png',
      width: s('1575px'),
      height: s('1790px'),
      belowPic: srcUrl + 'driver/1/bar.png',
      movements: [
        {
          delay: 900,
          static: {
            left: s('143px'),
            top: s('690px'),
            src: srcUrl + 'driver/1/2.png',
            width: s('741px'),
            height: s('561px')
          },
          active: {
            opacity: ['0', '1'],
            transform: ['scale(0)', 'scale(1)']
          },
          duration: '.4s'
        },
        {
          delay: 1300,
          static: {
            left: s('920px'),
            top: s('270px'),
            src: srcUrl + 'driver/1/3.png',
            width: s('741px'),
            height: s('561px')
          },
          active: {
            opacity: ['0', '1'],
            transform: ['scale(0)', 'scale(1)']
          },
          duration: '.4s'
        }
      ]
    },
    //           1 ---------------------------- 2
    {
      circle: true,
      bgImg: srcUrl + 'driver/2/1.png',
      width: s('1575px'),
      height: s('1790px'),
      belowPic: srcUrl + 'driver/2/bar.png',
      movements: [
        {
          delay: 1000,
          static: {
            src: srcUrl + 'driver/2/2.png',
            clip: `rect(${s('200px')},${s('1200px')},${s('1600px')},${s('500px')})`,
            width: s('1575px'),
            height: s('1790px')
          },
          active: {
            opacity: ['0', '1']
          },
          duration: ''
        },
        {
          delay: 2000,
          static: {
            src: srcUrl + 'driver/2/3.png',
            clip: `rect(${s('200px')},${s('1200px')},${s('1600px')},${s('500px')})`,
            width: s('1575px'),
            height: s('1790px')
          },
          active: {
            opacity: ['0', '1']
          },
          duration: ''
        }
      ]
    },
    //           1 ---------------------------- 3

    {
      // parentDiv: document.getElementById('test'),这是一个必须的属性
      circle: true,
      bgImg: srcUrl + 'driver/3/1.png',
      width: s('1575px'),
      height: s('1790px'),
      belowPic: srcUrl + 'driver/3/bar.png',
      movements: [
        {
          delay: 100,
          static: {
            left: s('550px'),
            top: s('720px'),
            src: srcUrl + 'driver/3/2.png',
            width: s('228px', 0.9),
            height: s('97px', 0.9)
          },
          active: {
            transform: ['scale(1)', 'scale(.3)', 'scale(1)', 'scale(.3)', 'scale(1)']
          },
          duration: '.4s'
        },
        {
          delay: 600,
          fMode: 'none',
          static: {
            left: s('516px'),
            top: s('150px'),
            transform: 'scale(0)',
            src: srcUrl + 'driver/3/3.png',
            width: s('663px'),
            height: s('1441px'),
            'z-index': 2
          },
          active: {
            transform: ['scale(0)', 'scale(1)', 'scale(1)', 'scale(1)', 'scale(1)']
          },
          duration: '1s'
        },
        {
          delay: 1000,
          static: {
            transform: 'translate(' + s('400px') + ',' + s('430px') + ') scale(0)',
            src: srcUrl + 'driver/3/4.png',
            width: s('691px'),
            height: s('728px'),
            'z-index': 3
          },
          active: {
            transform: ['translate(' + s('400px') + ',' + s('230px') + ') scale(0)', 'translate(' + s('840px') + ',' + s('230px') + ') scale(1)']
          },
          duration: '.3s'
        },
        {
          delay: 1600,
          static: {
            left: s('550px'),
            top: s('1010px'),
            src: srcUrl + 'driver/3/5.png',
            width: s('228px', 0.9),
            height: s('97px', 0.9),
            'z-index': 1
          },
          active: {
            transform: ['scale(1)', 'scale(.3)', 'scale(1)', 'scale(.3)', 'scale(1)']
          },
          duration: '.4s'
        },
        {
          delay: 2000,
          static: {
            src: srcUrl + 'driver/3/6.png',
            width: s('691px'),
            height: s('728px'),
            'z-index': 3
          },
          active: {
            transform: ['translate(' + s('120px') + ',' + s('830px') + ') scale(0)', 'translate(' + s('100px') + ',' + s('830px') + ') scale(1)']
          },
          duration: '.4s'
        }
      ]
    },
    //           1 ---------------------------- 4
    {
      // parentDiv: document.getElementById('test'),这是一个必须的属性
      circle: true,
      bgImg: srcUrl + 'driver/4/1.png',
      width: s('1575px'),
      height: s('1790px'),
      belowPic: srcUrl + 'driver/4/bar.png',
      movements: [
        {
          delay: 900,
          static: {
            left: s('680px'),
            top: s('950px'),
            src: srcUrl + 'driver/4/2.png',
            width: s('160px'),
            height: s('160px')
          },
          active: {
            opacity: ['0', '1'],
            transform: ['scale(0)', 'scale(2.4)']
          },
          duration: '.3s'
        },
        {
          delay: 1200,
          static: {
            left: s('1060px'),
            top: s('160px'),
            src: srcUrl + 'driver/4/3.png',
            width: s('800px'),
            height: s('664px')
          },
          active: {
            opacity: ['0', '1'],
            transform: ['scale(0)', 'scale(1)']
          },
          duration: '.3s'
        }
      ]
    },
    // 1 ----------------------------------- 5
    {
      // parentDiv: document.getElementById('test'),这是一个必须的属性
      circle: true,
      bgImg: srcUrl + 'driver/5/1.png',
      width: s('1575px'),
      height: s('1790px'),
      belowPic: srcUrl + 'driver/5/bar.png',
      movements: [
        {
          delay: 100,
          static: {
            left: s('520px'),
            top: s('840px'),
            src: srcUrl + 'driver/5/2.png',
            width: s('110px', 0.8),
            height: s('110px', 0.8)
          },
          active: {
            transform: ['scale(1)', 'scale(.3)', 'scale(1)', 'scale(.3)', 'scale(1)']
          },
          duration: '.4s'
        },
        {
          delay: 600,
          static: {
            left: s('516px'),
            top: s('150px'),
            src: srcUrl + 'driver/5/3.png',
            width: s('663px'),
            height: s('1441px'),
            'z-index': 2
          },
          active: {
            transform: ['scale(0)', 'scale(1)']
          },
          duration: '0.3s'
        },
        {
          delay: 900,
          static: {
            left: s('747px'),
            top: s('464px'),
            src: srcUrl + 'driver/5/4.gif',
            width: s('200px'),
            height: s('200px'),
            'z-index': 3
          },
          active: {
            opacity: ['0', '1']
          },
          duration: ''
        }
      ]
    },
    // 1 ----------------------------------- 6
    {
      // parentDiv: document.getElementById('test'),这是一个必须的属性
      circle: true,
      bgImg: srcUrl + 'driver/6/1.png',
      width: s('1575px'),
      height: s('1790px'),
      belowPic: srcUrl + 'driver/6/bar.png',
      movements: [
        {
          delay: 10,
          static: {
            left: s('638px'),
            top: s('1155px'),
            src: srcUrl + 'driver/6/3.png',
            width: s('50px'),
            height: s('65px'),
            'z-index': 2
          },
          active: null,
          duration: ''
        },
        // 蓝线
        {
          delay: 900,
          static: {
            left: s('910px'),
            top: s('840px'),
            transform: 'rotate(80deg);',
            'transform-origin': '0% 0%',
            src: '',
            width: '1px',
            height: '1px',
            'border-right': '4px solid #3483ff',
            'border-top': '4px solid #3483ff',
            'z-index': 1
          },
          active: {
            height: ['1px', '0px', '0px', '112px'],
            width: ['1px', '112px', '112px', '112px']
          },
          duration: '.6s'
        },
        // 灰线
        {
          delay: 1500,
          static: {
            left: s('912px'),
            top: s('840px'),
            transform: 'rotate(80deg);',
            'transform-origin': '0% 0%',
            src: '',
            width: s('1px'),
            height: s('1px'),
            'border-right': '6px solid #d5d5d9',
            'border-top': '6px solid #d5d5d9',
            'z-index': 2
          },
          active: {
            height: ['1px', '0px', '0px', '112px'],
            width: ['1px', '112px', '112px', '112px']
          },
          duration: '.6s'
        },
        // 小车
        {
          delay: 1500,
          static: {
            'transform-origin': '50% 50%',
            src: srcUrl + 'driver/6/2.png',
            width: s('79px'),
            height: s('48px'),
            'z-index': 3
          },
          active: {
            transform: [`translate(${s('870px')},${s('820px')}) rotate(90deg)`, `translate(${s('915px')},${s('1120px')}) rotate(90deg)`, `translate(${s('915px')},${s('1120px')}) rotate(180deg)`, `translate(${s('642px')},${s('1172px')}) rotate(180deg)`]
          },
          duration: '.6s'
        }
      ]
    }
  ],
  term2: [
    //           2 ---------------------------- 1
    {
      // parentDiv: document.getElementById('test'),这是一个必须的属性
      circle: true,
      bgImg: srcUrl + 'pc/1/1.png',
      width: s('503px', 3),
      height: s('466px', 3),
      belowPic: srcUrl + 'pc/1/bar.png',
      movements: [
        {
          delay: 900,
          static: {
            src: srcUrl + 'pc/1/2.png',
            width: s('149px'),
            height: s('150px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'540px'},${'200px'}) scale(3)`]
          },
          duration: '.3s'
        },
        {
          delay: 1200,
          static: {
            src: srcUrl + 'pc/1/3.png',
            width: s('58px'),
            height: s('58px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'340px'},${'-20px'}) scale(3)`]
          },
          duration: '.3s'
        },
        {
          delay: 1500,
          static: {
            src: srcUrl + 'pc/1/4.png',
            width: s('46px'),
            height: s('46px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'-46px'},${'190px'}) scale(3)`]
          },
          duration: '.3s'
        }
      ]
    },
    //           2 ---------------------------- 2
    {
      // parentDiv: document.getElementById('test'),这是一个必须的属性
      circle: true,
      bgImg: srcUrl + 'pc/2/1.png',
      width: s('503px', 3),
      height: s('466px', 3),
      belowPic: srcUrl + 'pc/2/bar.png',
      movements: [
        {
          delay: 900,
          static: {
            src: srcUrl + 'pc/2/2.png',
            width: s('150px'),
            height: s('103px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'140px'},${'0px'}) scale(2.5)`]
          },
          duration: '.3s'
        },
        {
          delay: 1200,
          static: {
            src: srcUrl + 'pc/2/3.png',
            width: s('125px'),
            height: s('76px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'540px'},${'100px'}) scale(2.5)`]
          },
          duration: '.3s'
        },
        {
          delay: 1500,
          static: {
            src: srcUrl + 'pc/2/4.png',
            width: s('46px'),
            height: s('46px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'-46px'},${'190px'}) scale(3)`]
          },
          duration: '.3s'
        },
        {
          delay: 1800,
          static: {
            src: srcUrl + 'pc/2/5.png',
            width: s('43px'),
            height: s('46px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'400px'},${'-34px'}) scale(3)`]
          },
          duration: '.3s'
        },
        {
          delay: 2100,
          static: {
            src: srcUrl + 'pc/2/6.png',
            width: s('48px'),
            height: s('43px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'600px'},${'290px'}) scale(3)`]
          },
          duration: '.3s'
        }
      ]
    },
    //            2---------------------------- 3
    {
      // parentDiv: document.getElementById('test'),这是一个必须的属性
      circle: true,
      bgImg: srcUrl + 'pc/3/1.png',
      width: s('503px', 3),
      height: s('466px', 3),
      belowPic: srcUrl + 'pc/3/bar.png',
      movements: [
        {
          delay: 900,
          static: {
            src: srcUrl + 'pc/3/2.png',
            width: s('300px'),
            height: s('112px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'400px'},${'34px'}) scale(2.5)`]
          },
          duration: '.3s'
        },
        {
          delay: 1200,
          static: {
            src: srcUrl + 'pc/3/3.png',
            width: s('248px'),
            height: s('94px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'20px'},${'100px'}) scale(2.5)`]
          },
          duration: '.3s'
        },
        {
          delay: 1500,
          static: {
            src: srcUrl + 'pc/3/4.png',
            width: s('58px'),
            height: s('58px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'540px'},${'300px'}) scale(2.5)`]
          },
          duration: '.3s'
        },
        {
          delay: 1800,
          static: {
            src: srcUrl + 'pc/3/5.png',
            width: s('168px'),
            height: s('63px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'40px'},${'240px'}) scale(3)`]
          },
          duration: '.3s'
        },
        {
          delay: 2100,
          static: {
            src: srcUrl + 'pc/3/6.png',
            width: s('44px'),
            height: s('44px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'160px'},${'-30px'}) scale(2.5)`]
          },
          duration: '.3s'
        },
        {
          delay: 2400,
          static: {
            src: srcUrl + 'pc/3/7.png',
            width: s('50px'),
            height: s('50px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'-70px'},${'320px'}) scale(2.5)`]
          },
          duration: '.3s'
        },
        {
          delay: 2700,
          static: {
            src: srcUrl + 'pc/3/8.png',
            width: s('248px'),
            height: s('88px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'280px'},${'200px'}) scale(0)`, `translate(${'320px'},${'200px'}) scale(2.5)`]
          },
          duration: '.3s'
        }
      ]
    },
    //            2---------------------------- 4
    {
      // parentDiv: document.getElementById('test'),这是一个必须的属性
      circle: true,
      bgImg: srcUrl + 'pc/4/1.png',
      width: s('503px', 3),
      height: s('466px', 3),
      belowPic: srcUrl + 'pc/4/bar.png',
      movements: [
        {
          delay: 900,
          static: {
            src: srcUrl + 'pc/4/2.png',
            width: s('248px', 1.2),
            height: s('144px', 1.2)
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'50px'},${'240px'}) scale(2.5)`]
          },
          duration: '.3s'
        },
        {
          delay: 1200,
          static: {
            src: srcUrl + 'pc/4/3.png',
            width: s('37px'),
            height: s('37px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'590px'},${'90px'}) scale(2.5)`]
          },
          duration: '.3s'
        },
        {
          delay: 1500,
          static: {
            src: srcUrl + 'pc/4/4.png',
            width: s('47px'),
            height: s('47px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'-40px'},${'150px'}) scale(2.5)`]
          },
          duration: '.3s'
        },
        {
          delay: 1800,
          static: {
            src: srcUrl + 'pc/4/5.png',
            width: s('232px', 1.04),
            height: s('137px', 1.04)
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'410px'},${'245px'}) scale(3)`]
          },
          duration: '.3s'
        },
        {
          delay: 2100,
          static: {
            src: srcUrl + 'pc/4/6.png',
            width: s('38px'),
            height: s('42px')
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'220px'},${'-30px'}) scale(2.5)`]
          },
          duration: '.3s'
        }
      ]
    },
    //            2---------------------------- 5
    {
      // parentDiv: document.getElementById('test'),这是一个必须的属性
      circle: true,
      bgImg: srcUrl + 'pc/5/1.png',
      width: s('503px', 3),
      height: s('466px', 3),
      belowPic: srcUrl + 'pc/5/bar.png',
      movements: [
        {
          delay: 900,
          static: {
            src: srcUrl + 'pc/5/2.png',
            width: s('691px', 0.44),
            height: s('402px', 0.44)
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'40px'},${'315px'}) scale(2.5)`]
          },
          duration: '.3s'
        },
        {
          delay: 1200,
          static: {
            src: srcUrl + 'pc/5/3.png',
            width: s('691px', 0.44),
            height: s('402px', 0.44)
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'470px'},${'156px'}) scale(2.5)`]
          },
          duration: '.3s'
        },
        {
          delay: 1500,
          static: {
            src: srcUrl + 'pc/5/4.png',
            width: s('691px', 0.44),
            height: s('402px', 0.44)
          },
          active: {
            opacity: ['0', '1'],
            transform: [`translate(${'300px'},${'200px'}) scale(0)`, `translate(${'40px'},${'0px'}) scale(2.5)`]
          },
          duration: '.3s'
        }
      ]
    }
  ]
};
module.exports = { divConfig };
