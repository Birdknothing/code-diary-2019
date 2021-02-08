/**
 * 
 * const mkSucObj = f => data =>
  f({
    code: 200,
    result: data
  });
const mkFailObj = f => data =>
  f({
    code: 400,
    result: data
  });
  
const getSortTrees = (tag?: String) =>
  new Promise(res => GetSortTree(tag, mkSucObj(res), mkFailObj(res)));

 */