// const a= new Promise(res =>)
import { curry } from "../my-min-library/util";
curry((x, y) => console.log(x + y))(1)(2);
