import cn from "./cn";
import us from "./us";
const target = cn;
const formatMsg = (id = "") => {
    if (!target[id]) {
        console.error("id not exist");
        return "0v0";
    }
    return target[id];
};
export { formatMsg };
