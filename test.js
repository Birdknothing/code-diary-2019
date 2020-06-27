
(x0 , y0)
(x,y)
 // 1
 x0< x
 y0<y
 (x0,y0) - (x1,y1) = (_x,_y)

 config.left - _x,config.top - _y

 // 2
x0>x
yo<y
 (x1,y1) - (x0,y0) = (_x,-_y)
 config._left+_x,config._top - _y

 // 3
 x0<x
 y0 >y
 (x1,y1) - (x0,y0) = (-_x,_y)
 config._left - _x,config._top+_y

 //4 
 x0 > x
 y0 > y
 (x1,y1) - (x0,y0) = (_x,_y)
 config._left+_x,config._top+_y

 x0    /   x1  = width  / width+_x  
 x1 = config.left * width+_x  / width