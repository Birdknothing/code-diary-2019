import Home from './gameEdit/index';
export default Home;
//import React, { Component } from 'react';

// import styles from './index.scss';
// import { Row, Col, Card, Input, Button    } from 'antd';

// import { formatMessage } from 'umi/locale';

// const { TextArea, Search } = Input;

// export default class HomeList extends Component {
//   constructor(props) {
//     super(props);
//     const { Edbox } = window;
//     this.state={
//       data: undefined,
//       msgOut : null,
//       src: Edbox.ComponentRootPath + "Edbox_Message/test.html"
//     };
//   }

//   componentDidMount  () {
//     const { src } = this.state;
//     this.messageHandler(src)
//   }


//   messageHandler = (src) => {
//     const { Edbox } = window;
//     const thisReact = this;
//     const iframe =  document.getElementById("GameFrame");
//     iframe.setAttribute('src', src);

//     iframe.onload = () => {
//       const windowIframe = iframe.contentWindow;
//       Edbox.Message.Get(windowIframe, function (com) {
//         com.Stop();
//       });
//       Edbox.Message.Get(windowIframe, function (com) {
//         com.Start();
//       });
//     }
//     Edbox.Message.AddMessageHandler("Log", function (datas, com) {
//       console.log("Log消息:" + datas);
//       thisReact.setState({
//         msgOut: datas[0]
//       })
//     });
//     Edbox.Message.AddMessageHandler("Init", function (datas, com) {
//       console.log("Init消息:" + datas);
//       thisReact.setState({
//         msgOut: datas[0]
//       })
//     });
//     Edbox.Message.AddMessageHandler("Add", function (datas, com) {
//       console.log("Add消息:" + datas);
//     });

//     Edbox.Message.AddMessageHandler("Update", function (datas, com) {
//       console.log("Update消息:" + datas);
//     });

//     Edbox.Message.AddMessageHandler("Delete", function (datas, com) {
//       console.log("Delete消息:" + datas);
//     });

//     Edbox.Message.AddMessageHandler("TabClick", function (datas, com) {
//       console.log("TabClick消息:" + datas);
//     });
//   }


//   postMsg = e => {
//     const { data } = this.state;
//     const { Edbox } = window;
//     // const windowIframe =  document.getElementById("GameFrame").contentWindow;
//     // let m
//     Edbox.Message.Broadcast("Add",[data], function () {
//       console.log("发送Add消息:" + data);
//     });
    
//   }

//   onChange = e => {
//     const { value } = e.target;

//     this.setState({
//       data: value
//     })
//   }

//   changeSrc = value => {
//     this.setState({
//       src: value
//     });
//     this.messageHandler(value);
//   }

//   render() {
//     const { msgOut, src } = this.state;
//     return (
//       <div className={styles.normal}>
//         <Row>
//           <Col offset={2} span={20} style={{marginBottom:'20px', marginTop:'20px'}} >
//             <Search
//               placeholder="input search text"
//               enterButton='启动'
//               size="large"
//               defaultValue={src}
//               onSearch={value => this.changeSrc(value)}
//             />
//           </Col>
//         </Row>
//         <Row>
//           <Col offset={2} span={10}>
//             <iframe src={src} frameBorder="0" width="100%" height="500" title="Edbox" id="GameFrame"></iframe>
//           </Col>
//           <Col offset={1} span={9}>
//             <Card
//               type="inner"
//               title="web页面"
//             >
//               <Row>
//                 <Col span={20}>
//                   <TextArea rows={7} onChange={(e)=>this.onChange(e) } />
//                 </Col>
//                 <Col span={4}>
//                   <Button type="primary" onClick={()=>this.postMsg()}>{formatMessage({id: 'send'})}</Button>
//                 </Col>
//               </Row>
//               <TextArea rows={7} disabled style={{marginTop:'20px'}} value={ msgOut }/>
//             </Card>
//           </Col>
//         </Row>
//       </div>
//     );
//   }
// }
