const divConfig = require('./public/lunbo-min').divConfig;
const slideDiv = require('./public/slide').slideDiv;
const animateDiv = require('./public/display').animateDiv;
import './public/display.css';
[...document.getElementsByClassName('term')].forEach((slideMountDiv, index) => {
  new slideDiv({ mountDiv: slideMountDiv, divName: 'term' + index, divs: divConfig['term' + index], width: '100%', height: '1016px', slideWidth: '1060px', slideHeight: '812px' });
});
// const display = require('./diplay.ejs');
