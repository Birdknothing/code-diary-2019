import React, { PureComponent } from 'react';
// import router from 'umi/router';
import { connect } from 'dva';
import { stringify } from 'qs';
import styles from './index.scss';

// import SimplePictureCtrl from '@/components/SimplePictureCtrl';
import EditItem from '@/components/EditItem';

@connect(({ edit,loading }) => ({
  edit,
  loading: loading.models.global,
}))
class Editor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount(){
    // 默认跳转对应地址
    const {edit:{currentData={},nowGameIdObj={}}} = this.props;
    const {ID} = currentData;
    console.log('游戏id数据：',nowGameIdObj);
    let routerUrl = '/Editor/BaseInfo/';
    switch(ID){
      case "BaseInfo_tab01":
      routerUrl='/Editor/BaseInfo/';
      break;
      case "Game_Rules_tab01":
      routerUrl='/Editor/GameRules/';
      break;
      default:
      routerUrl = '/Editor/BaseInfo/';
    }
    // router.push(routerUrl);
    // router.push({
    //   // name: routerUrl,
    //   pathname: routerUrl,
    //   query:nowGameIdObj,
    // });
    window.location.href=window.location.protocol+'//'+window.location.host+'/?'+stringify(nowGameIdObj)+'#'+routerUrl;

  }

  handleAcceptImg=(url)=>{
    console.log('接收到的图：',url);
  }
  test=(config)=>{
    console.log(config);
  }
  render() {
    return (
      <div className={`${styles['editor-cont-wrap']}`}>
        {/*
      <SimplePictureCtrl  onOk={this.handleAcceptImg}  imageSelector={{imageConfig:{Value:'http://fz-cs.101.com/v0.1/static/edu_product/esp/assets/e49c7e68-7686-4e7a-8934-fc9f11e6c8af.pkg/c2a4ef535f394dba8ade33545889bb07.png?size=240'}}} onClose={()=>{console.log('关闭了')}}/>
       */}

        <EditItem config={{Value:'测试',Length:15,InputHintText:'请输入',ID:'Game_Name',Width:230,ShowName:'标题',HelpText:'帮助'}} onUpdate={this.test} type="Text01" onArouse={this.test}></EditItem>
        <EditItem config={{Value:'测试',Length:15,InputHintText:'请输入',ID:'Game_Name',Width:230,ShowName:'标题',HelpText:'帮助',IsRequired:true,}} onUpdate={this.test} type="Text02" onArouse={this.test}></EditItem>
        <EditItem config={{Value:'http://fz-cs.101.com/v0.1/static/edu_product/esp/assets/e49c7e68-7686-4e7a-8934-fc9f11e6c8af.pkg/c2a4ef535f394dba8ade33545889bb07.png?size=240',Length:15,InputHintText:'请输入',ID:'Game_Name',Width:647,Height:845,ShowName:'标题',HelpText:'帮助',IsRequired:true,}} onUpdate={this.test} type="Image01" onArouse={this.test}></EditItem>
        <EditItem config={{Value:2,Length:15,InputHintText:'请输入',ID:'Game_Name',Width:230,ShowName:'标题',HelpText:'帮助',UnitText:'s',MaxValue:20}} onUpdate={this.test} type="Value02" onArouse={this.test}></EditItem>
        <EditItem config={{Value:true,Length:15,InputHintText:'请输入',ID:'Game_Name',Width:230,ShowName:'标题',HelpText:'帮助',UnitText:'s',MaxValue:20}} onUpdate={this.test} type="Switch01" onArouse={this.test}></EditItem>
      </div>
    );
  }
}

export default Editor;
