import { formatMessage } from 'umi/locale';
import {  message} from 'antd';
import {  windowHost } from '@/utils/common';
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
  let { Datas = [], ID, ShowName, ShowName_Override } = item;
  const hasChild = Datas.length ? Datas[0].Type === "Tab03" : false
  if(!hasChild) {
    return
  }
  const { Datas: cDatas = [] } = Datas[0];
  const hasChildL = cDatas.length ? cDatas[0].Type === "Tab03" : false
  const vdom = []
  ShowName = !!ShowName_Override ? ShowName_Override : ShowName; //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值
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


/**
 * 更新数据
 * @param {Array} dataSourceIndex  数组index
 * @param {*} updateID
 * @param {*} currentID
 * @param {Array} Datas
 */
export const updateSourceData = (dataSourceIndex, updateID, currentID , Datas, newData) => {
  let data
  let newCurrentData
  const updateIndex = dataSourceIndex[updateID];
  const updateCurrentDataIndex = dataSourceIndex[currentID];
  const newDealData = JSON.parse(JSON.stringify(Datas));
  //更新dataSource
  if(!updateIndex)  return;
   /* eslint-disable */
  let updateDatas = eval('newDealData'+ updateIndex.index);

  Object.assign(updateDatas, newData)
  data = newDealData;
  //更新currentData
  newCurrentData = eval('newDealData'+ updateCurrentDataIndex.index);
  return {data, newCurrentData }
}


/**
 * 添加数据
 * @param {Object} edit 编辑数据
 * @param {Array} pid  父id
 * @param {Number} NewCount 新增编号
 * @param {String} tabId tab切换id
 */
export const addSourceData = (edit, pid, NewCount, tabId) => {
  let { currentData = {},  dataSourceIndex= {}, dataSource = {}, tabActiveKey} = edit;
  const { Datas : sourceD  = [] } = dataSource;
  let { MaxCount = 0 , Datas : cDatas = [], Class} = currentData
  const newId = Edbox.GetGUID();
  const newSourceD = JSON.parse(JSON.stringify(sourceD));
  let tabCurrent;
  //判断是否tab02
  if( cDatas.length && cDatas[0].Type === "Tab02" ) {
    tabActiveKey = !!tabId ? tabId : tabActiveKey; //排行榜自动切换问题
    tabCurrent = eval('newSourceD'+ dataSourceIndex[tabActiveKey].index);
    if(tabCurrent && (tabCurrent.Class === "ResouceManage" || Class === "Ranking")) {
      
      Class = tabCurrent.Class || Class;
      NewCount = tabCurrent.NewCount || 0;
      MaxCount = tabCurrent.MaxCount;
      cDatas = tabCurrent.Datas || [];
    }
    
  }else {
    tabCurrent = currentData;
  }
  //判断是否操作关卡最大数
  const addIndex = dataSourceIndex[pid];
  if(Class === "ResouceManage" || Class === "Ranking"  ) {
    if(cDatas.length >= MaxCount && MaxCount !== 0) {
      message.error(formatMessage({ id: 'max_count' })+ MaxCount); 
      return;
    }
  }
  
  if(!addIndex) return;
  

  let newData = eval('newSourceD'+ addIndex.index);

  
  let { Template = {}, Template_Override, Datas: nDatas = [], ID} = newData;
  Template = !!Template_Override ? Template_Override : Template //编辑器框架识别到拓展参数的覆盖参数时，判断是否有该拓展参数，如果有则显示为该拓展参数的值
  if(!Template) {
    message.error(formatMessage({ id: 'tip_level_template' })); 
    return true;
  }
  //模板子关卡ID重置
  const { Datas: TemplateDatas = [] } = Template;
  
  //新关卡命名 showname显示规则
  const lastName = nDatas.length &&  nDatas[nDatas.length - 1].Type === "Tab03"  
                    ? nDatas[nDatas.length - 1].EditableContent 
                      ? nDatas[nDatas.length - 1].EditableContent 
                      : !! nDatas[nDatas.length - 1].ShowName_Override 
                        ? nDatas[nDatas.length - 1].ShowName_Override 
                        : nDatas[nDatas.length - 1].ShowName 
                    : "";
  const newName = {
    ResouceManage : formatMessage({ id: 'new_resource' }) + (NewCount ? NewCount : 1 ),
    Ranking : formatMessage({ id: 'new_ranking' }) + (NewCount ? NewCount : 1 ),
    
  }
  const value = newName[Class] ? newName[Class] : reName(lastName, Class, NewCount ) ;
  const newDatas = TemplateDatas.length ? TemplateDatas.map(updateID) : []
  const newTemplate = {
    ...Template,
    ShowName: value,
    ID: newId,
    Editable: true,
    Datas: newDatas,
    Type: "Tab03"
  }
  newData.Datas.push(newTemplate)
  //更新currentData
  const newCurrentData = eval('newSourceD'+ dataSourceIndex[currentData.ID].index);
  tabCurrent.NewCount = (NewCount ? NewCount : 1) * 1 + 1;
  return {newSourceD, newCurrentData, newData, newTemplate, newId }
}

/**
 * 获取字节长度
 * @param {String} Str  数组index
 */
export const  getStrLength =( Str, Length ) => {
  let valueLength;
  let value
  Edbox.MMO.GetStrLen(
    Str,
    len => {
      valueLength = len > Length ? Length : len;
      Edbox.MMO.SubStrLen(
        Str,
        valueLength,
        data => {
          value =  data;
        },
        err => {
          console.log(err);
        },
      );
    },
    err => {
      console.log(err);
    },
  );
  return value;
}

/**
 * 处理索引
 * @param {String} data  全部数据
 */
export const setNewDatasIndex =(data) => {
  let newDatas = JSON.parse(JSON.stringify(data));
  let newTabData = {};
  const tab1Loop = (item=[], i, index="") => {
    
      let {  Datas=[], ID } = item;
      const hasChild = Datas.length> 0;
      newTabData[ID] = {
        index:  index + `[${i}]`
      }
      if(hasChild){
        Datas.map((item, cIndex)=>tab1Loop(item, cIndex, index + `[${i}].Datas`))
      }
      return true
  }
  newDatas.Datas.map((item, i)=>tab1Loop(item, i, []))

  return newTabData;
}

/**
 * 暂停音频
 */
export const  pauseAudios =( flag ) => {
  const oAudios = document.querySelectorAll(`.real-audio`);
  for (let i = 0; i < oAudios.length; i++) {
    const oAudio = oAudios[i];
    if (flag !== 'all' && oAudio.getAttribute('data-id') === this.audio.getAttribute('data-id')) {
      continue;
    }
    oAudio.pause();
    oAudio.parentNode
      .querySelector(`.ico-sound`)
      .classList.remove('playing');
  }
}

  /**
   * 获取GUID
   * @param {Object} item获取GUID
   */
  export const getGuidData = (item, GetAll) => {
    let vdom = []
    let { Datas=[], GUID, Type, ResourceName, Value, Preview , Items = [] } = item;
    const hasChild = Datas.length > 0 ;
    if(!!GUID) {
      if(Type === "Image02") {
        GUID.map(i=>{
          if(isVaildGuid(i)){
            vdom.push(i);
          }
          return true
        })
      }else {
        if(isVaildGuid(GUID) && (!ResourceName || !Value)){
          if(Type === "Animation01") {
            if(!Preview) {
              vdom.push(GUID);
            }
          }else {
            vdom.push(GUID);
          }
        }
      }
      
    }else if(Type === "Select04") {
      Items.map(i=>{
        if(isVaildGuid(i.ImageGUID) && !i.Image ){
          vdom.push(i.ImageGUID);
        }
        return true
      })
    }
    if(hasChild) {
      let list = []
      for (var i of Datas) {
        if(!!i) {
          list.push(...getGuidData(i, GetAll));
        }
      }
      vdom = [...vdom, ...list];
    }
    return vdom;
  }

   /**
   * 更新currentData和dataSource
   * @param {Object} guidList 获取回来的图片和音频地址
   *
   */
  export const setSourceValue = (guidList = {}, dataSource = {}, currentData = {}) => {
    const updateLoop = (oldData = []) => {
      return oldData.map(item => {
        let { GUID, Value, Type, ResourceName, Items = [] } = item;
        if(Type === "Image02") {
          if (!!GUID) {
            let guidValueList = []
            GUID.map((g, i)=>{
              guidValueList.push( !guidList[g] ? '' : guidList[g].Url)
              return true
            })
            item.Value = guidValueList;
          }
        }else if (Type === "Animation01") {
          if (!!GUID && !item.Preview) {
            item.Preview = !guidList[GUID] ? item.Preview : guidList[GUID].Preview
          }
        }else if(Type === "Select04") {
          Items.map(i=>{
            if(!i.Image ){
              i.Image = !guidList[i.ImageGUID] ? i.Image : guidList[i.ImageGUID].Url
            }
            return true
          })
          Array.isArray(Value)&& Value.map(i=>{
            if(!i.Image ){
              i.Image = !guidList[i.ImageGUID] ? i.Image : guidList[i.ImageGUID].Url
            }
            return true
          })
        } else {
          if (!!GUID && (!ResourceName || !Value)) {
            item.Value = !guidList[GUID] ? item.Value : guidList[GUID].Url
            item.ResourceName =  item.ResourceName? item.ResourceName : !guidList[GUID] ? item.ResourceName : guidList[GUID].Name
          }else {
            if((Type === "Image01" || Type === "Audio01") && !ResourceName && !!Value  ) {
              const Rname = Value.substring(Value.lastIndexOf("/")+1);
              const Sname = Rname.split('.')
              item.ResourceName = item.ResourceName? item.ResourceName :  Sname.length > 1 ? Sname[0] : item.ResourceName
            }
          }
        }
        if (item.Datas && item.Datas.length) {
          item.Datas = updateLoop(item.Datas);
        }
        return item;
      });
    };
    const computeData = updateLoop(currentData.Datas);
    const computeDataSource = updateLoop(dataSource.Datas);
    currentData.Datas = computeData;
    dataSource.Datas = computeDataSource;
    return {currentData, dataSource}
  }

    /**
   * 断网监听
   * @param {num} count 请求不成功次数
   */
  export const retryServerPic = () => {
    return new Promise(function (resolve, reject) {
      let elem = document.createElement("img");  
      elem.src =  '//' + windowHost + "/editor/web/static/line.gif?d=" + new Date().getTime();
      elem.style.display = "none" ;
      document.body.appendChild(elem);  
  
      elem.onload=function(){
        document.body.removeChild(elem);
        resolve();
      }
      elem.onerror=function(){
        document.body.removeChild(elem);
        reject();
      }
    });
    
  }