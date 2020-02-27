import axios from "axios";
export default async function(param) {
  const result = await axios(param);
  if (result) {
    return result;
  }
  return false;
}
