export default {
  quoteBlock: '<blockquote class="quoteDiv">$content</blockquote>',
  iframePage: `<div class="iframeDiv"><div class="modal">正在加载。。。</div><iframe src="$src" width="100%" onload="event.target.previousElementSibling.style.display='none'" height="100%" class="iframePage" frameborder="0"></iframe></div>`,
  quoteLine: '<p class="quoteLine">$code</p>',
  codeBlockExtend:
    '<div class="codeContainer"><div class="copy">复制</div><div class="codeBlockExtend"><pre class="codeDiv">$content</pre></div></div>',
  codeBlock:
    '<div class="codeContainer"><div class="copy">复制</div><div class="codeBlock"><pre class="codeDiv">$content</pre></div></div>',
  codeLine: '<p class="codeLine">$code</p>',
  title: "<$hsize>$title</$hsize>",
  line: '<p class="line">$words</p>',
  navBlock: `<input type="radio" class="ctrlNav" name="ctrlNav"><div data-route="$route" class="navBox">$title</div>`
};
