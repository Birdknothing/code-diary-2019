
const { Edbox } = window;
// 判断一级对象是否相同
export const eq = (oldData, newData) => {
  let equalFlag = true;
  for (let key in oldData) {
    if (oldData[key] !== newData[key]) {
      equalFlag = false;
      break;
    }
  }
  return equalFlag;
};

// 去除连续空格
export const trim = data => {
  const TRIM_REGEX = /(^\s*)|(\s*$)/g;
  const CENTER_TRIM_REGEX = /\s{2,}/g;
  return data.replace(TRIM_REGEX, '').replace(CENTER_TRIM_REGEX, '');
};

/**
 * 验证是否有效的guid
 */

 export const isVaildGuid = (guid) => {
   if(!guid)
      return false;
   guid = guid.trim();
   return new RegExp("^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$").test(guid);
 }

 /**
  * 重命名+1
  * @param {string} oldName 就名
  */
 export const reName = (oldName) => {
  const valueNum = oldName.match(/[1-9]\d*$/);
  const newName = !!valueNum ?  oldName.replace(/[1-9]\d*$/, valueNum[0]*1+1 ) : oldName + '1';
  return newName;
 }

/**
 * 更新全部数据
 * @param {Object} item 循环的datasource数据
 * @param {string} Id  需要更新的Id
 * @param {Object} deleteCurrentData  更新后的数据
 */ 

 export const loop = (item = [], Id, deleteCurrentData) => { 
  const { Datas = [], ID, Type } = item;
  const vdom = []
  const hasChild = Type === "Tab01" ;
  if(ID === Id) {
    item = deleteCurrentData
    return item
  }
  if (hasChild) {
    let list = [];
    for (var i of Datas) {
      list.push(loop(i, Id));
    }
    vdom.push({
      ...item,
      Datas: list.filter(item=>item),
    });
  } else {
    if (item.ID !== undefined) {
      vdom.push(item);
    }
  }
  return vdom.length > 0 ? { ...vdom[0] } : undefined;
}


/**
 * 解析成级联所需要的数据
 * @param {Object} item 需要解析的数据
 */
export const parseLevelDatas = (item = {}) => {
  const { Datas = [], ID, ShowName } = item;
  const hasChild = Datas.length ? Datas[0].Type === "Tab03" : false
  if(!hasChild) {
    return
  }
  const { Datas: cDatas = [] } = Datas[0];
  const hasChildL = cDatas.length ? cDatas[0].Type === "Tab03" : false
  const vdom = []
  if (hasChildL) {
    let list = [];
    for (let i of Datas) {
      const { Datas : iDatas = [] } = i;
      const hasChildD = iDatas.length ? iDatas[0].Type === "Tab03" : true
      if(hasChildD)
        list.push(parseLevelDatas(i));
    }
    vdom.push({
      value: ID,
      label: ShowName,
      children: list.filter(i=>i),
    });
  } else {
    if (item.ID !== undefined) {
      vdom.push({ 
        value: ID,
        label: ShowName
      });
    }
  }
  return vdom.length > 0 ? { ...vdom[0] } : undefined;
}


/**
 * 模板重新获取ID
 * @param {Object} item 需要更新的ID的数据
 */ 

export const updateID = (item = {}) => { 
  const { Datas = [] } = item;
  const vdom = []
  const GUID = Edbox.GetGUID();
  item.ID = GUID;
  if (Datas.length) {
    let list = [];
    for (var i of Datas) {
      list.push(updateID(i));
    }
    vdom.push({
      ...item,
      Datas: list.filter(i=>i),
    });
  } else {
    if (item.ID !== undefined) {
      vdom.push(item);
    }
  }
  return vdom.length > 0 ? { ...vdom[0] } : undefined;
}


/**
 * 获取默认选中tab03
 * @param {array} data tab02或tab01下的Datas数据
 */
export const  getActiveKey = (data) => {
  let activeKey = [];
  data.map((i) => {
    if(i.Type === "Tab03" ) {
      activeKey.push(i.ID);
    }
    return true;
  });
  return activeKey;
}


