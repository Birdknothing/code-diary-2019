const str = `<div class="link">
<div class="arrow"></div>
<div class="text"><a href=""></a></div>
</div>`;
console.log(
  str
    .replace(/[\n\r]/g, "")
    .replace(/ +(?=<)/g, "")
    .replace(/"/g, '\\"')
);
