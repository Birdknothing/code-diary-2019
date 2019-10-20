const a = `<div class="brand">
        <div class="imgBox"><img src="./img/login-edbox.png" alt="" /></div>
        <div class="nameBox bold">Edbox</div>
      </div>`;
console.log(a.replace(/[\n\r]| +(?=<)/g, "").replace(/"/g,'\\"'));
