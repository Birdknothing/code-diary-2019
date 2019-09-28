const f = (()=>{
  let i = 0
  return () => i++
})()
export default f;