import React, {Component} from 'react';
import {Row, Col, Radio, Button, Slider, Tabs, Empty, Popover} from 'antd';
import {formatMessage, getLocale} from 'umi/locale';
import IconFont from '@/components/iconfont';
import Header from '@/components/header';
import Search from '@/components/search';
import styles from './index.scss';
import noResultMatchImage from '@/assets/no_result_match.png';
import loadingResultImage from '@/assets/loading_result.png';
//Telemetryimport { tsThisType, throwStatement } from '@babel/types';
import { connect } from 'dva';
import router from 'umi/router';


@connect(({ audioSelector, loading }) => ({
    audioSelector,
    loading: loading.models.audioSelector
}))

class AudioLibrary extends Component {
    constructor(props) {
        super(props);

        // 音频队列索引
        this.lstAudioIndex = 0;

        // 是否显示默认选中项(搜索关键字为空且有默认选则guid)
        this.insertDef = false;


        this.curPage = 1;
        this.totalPage = 1;
        // 当前 tag
        this.curTag = "";

        this.state = {

            audioFormats:[
                'mp3',
                'wav',
                'ogg'
            ],

            // 当前选中的音频索引
            selectMusicId : 1,

            // 显示加载更多音频资源数据
            showMore : false,

            playCurAudioId : 0,

            playAudioPrg : {
                value: 0, //播放进度
                touch : false
            },

            searchEngineList: [
                {
                    id: 1,
                    englishName: 'NDR',
                    chinesename: 'NDR',
                    icon: 'icon-layers'
                }         
            ],
            
            // 一级标签页选中
            firstTab: 1,
            // 二级标签页选中
            secondTab: '1',
            // 三级标签页选中
            thirdTab: '1_1',
            // 音频一级tag数据
            musicTags:[
                {
                    index : 1,
                    tag: 'c33fd10f-b234-44b9-9405-d9a4b0077714',
                    name: 'Music'                  
                },
                {
                    index : 2,
                    tag: '7e7d2bc8-3935-4ee2-af25-f3d9431bf7cf',
                    name: 'Effect'               
                }
            ],
            
            // 默认二级 三级标签数据
            musicType: [
                {
                    id: '1',
                    name: formatMessage({id: 'all'}),
                    tag: '',
                    subType: [
                        {
                            id: '1_1',
                            name: formatMessage({id: 'all'}),
                            tag: ''
                        }
                    ]
                }
            ],

            // 在线音频列表数据
            musicList: [
                /*
                {
                    id: 1,
                    Name: 'Hospital-Warning all',
                    TotalTime: '04:02',
                    audio : {} // 对应音频标签audio
                }
                */
            ],

            // 搜索关键字
            searchWord : "",

            searchWords: {
                data: [
                    {
                        id: 1,
                        englishName: 'Animal',
                        chineseName: '动物'
                    },
                    {
                        id: 2,
                        englishName: 'Person',
                        chineseName: '人物'
                    },
                    {
                        id: 3,
                        englishName: 'Build',
                        chineseName: '建筑'
                    },
                    {
                        id: 4,
                        englishName: 'Plant',
                        chineseName: '植物'
                    }
                ],
                hasMore: false,
                isShowMore: false
            },
            searchEngine: 1,
            scrollTop: 0,
            showTab: true,
            showFixedPlayer: false,
            // 更新显示loading
            isloading: false
        }  
    }

    componentWillMount() {

        const {musicType} = this.state;
        const newMusicType = musicType.map(type => {
            const subType = type.subType;
            if (subType.length > 8) {
                return {
                    hasMore: true,
                    isShowMore: false,
                    ...type
                }
            }

            return {
                hasMore: false,
                ...type
            }
        })

        this.setState({
            musicType: newMusicType },
            ()=>{
                this.refreshFirstTab(this.state.firstTab);
            }
        );

        const {Edbox} = window;
        const _this = this;
        // 监听编辑器保存事件
        Edbox.Message.AddMessageHandler("EditSave", function (datas, com) {
            _this.handleAudioStop();
        });

        Edbox.Message.AddMessageHandler("StopAudio", function (datas, com) {
            _this.handleAudioStop();
        });
    }

    /**
     * 展开和收起更多子类型
     * @param {int/string} id 点击的music类型id
     */
    handleToggleSubType(id) {
        const {musicType} = this.state;
        musicType.map(item => {
            if (item.id === id) {
                item.isShowMore = !item.isShowMore;
            }
        })
        this.setState({
            musicType: [...musicType]
        })
    }

    /**
     * 展开和收起更多相关搜索词
     */
    handleToggleSearchWord() {
        const {searchWords} = this.state;
        searchWords.isShowMore = !searchWords.isShowMore
        this.setState({
            searchWords: {...searchWords}
        })
    }

    
    /**
     * 下载音频
     * @param {int/string} id 点击的音频列表的id
     */
    handleAudioDown(id){

        const {musicList} = this.state;
        musicList.map(item => {
            if (item.id === id) {

                fetch(item.Url)
                .then(d => {
                    //console.log(d);
                    return d.blob();
                })
                .then(b => {
                    //console.log(b);
                    var bURL = URL.createObjectURL(b);
            
                    var link = document.createElement('a');
                    link.href = bURL;
                    let name = item.Name + item.Url.substring(item.Url.lastIndexOf('.'), item.Url.length);
                    link.setAttribute('download', name);
                    document.getElementsByTagName("body")[0].appendChild(link);
                    // Firefox
                    if (document.createEvent) {
                        var event = document.createEvent("MouseEvents");
                        event.initEvent("click", true, true);
                        link.dispatchEvent(event);
                    }
                    // IE
                    else if (link.click) {
                        link.click();
                    }
                    link.parentNode.removeChild(link);
            
                });
                
            }
        })
    }

    /**
     * 处理音频播放/暂停
     * @param {int/string} id 点击的音频列表的id
     */
    handleAudioPlay (id) {

        let {musicList, playCurAudioId} = this.state;

        let item = musicList[id - 1];

        if (!item) return;

        const {Edbox} = window;

        if (playCurAudioId === 0){
            Edbox.Message.Broadcast("StopAudio", [], function () {
                item.audio.play();
            });    
        }
        else if (playCurAudioId !== id){
            //重置上一个音频
            this.handleAudioStop(playCurAudioId);
            
            Edbox.Message.Broadcast("StopAudio", [], function () {
                item.audio.play();
            });    

        }
        else{
            if (item.audio.paused){
                Edbox.Message.Broadcast("StopAudio", [], function () {
                    item.audio.play();
                });    
            }
            else{
                item.audio.pause();
            }
        }   

        this.setState({
            playCurAudioId : id,
            musicList: musicList
        })
    }


    /**
     * 刷新当前播放音频的时间
     */
    handleTimeUpdate(id){

        let {playCurAudioId, musicList, playAudioPrg} = this.state;

        if (playCurAudioId !== id) {
            return;
        }

        let item = this.getCurAudio()

        if (item.audio.paused) return;

        item.CurrentTime = item.audio.currentTime;

        let time = this.GetTime(item.audio.currentTime * 1000) + ' / ' + item.TotalTime;

        item.showTime = time;

        // 计算进度条进度
        if (!playAudioPrg.touch){
            playAudioPrg.value = 0;
            if (item.duration) {
                playAudioPrg.value = Math.round(item.CurrentTime * 100 * 1000 / item.duration);
            }
    
            this.setState({
                playAudioPrg: {...playAudioPrg}
            })
        }
  
        this.setState({
            musicList: musicList
        })
    }


     /**
     * 获取正在播放的音频
     */
    getCurAudio(){
        let {musicList, playCurAudioId} = this.state;

        if (playCurAudioId < 1 || playCurAudioId > musicList.length){
            return null;
        }

        let item = musicList[playCurAudioId- 1];
        return item;
    }

     /**
     * 通过id获取播放的音频
     */
    getAudioById(id){
        let {musicList} = this.state;

        if (id < 1 || id > musicList.length){
            return null;
        }

        let item = musicList[id- 1];
        return item;
    }

    /**
     * 音频播放重置
     */
    resetAudio(){   

        let music = this.getCurAudio();

        if (music){
            music.audio.pause();
            music.audio.currentTime = 0;
        }
        
        this.setState({
            playCurAudioId : 0,

            playAudioPrg : {
                value: 0, //播放进度
                touch : false
            }
        })
    }


    /**
     * 音频播放停止
     */
    handleAudioStop(id){

        if (!id){
            const {playCurAudioId } = this.state;
            id = playCurAudioId;
        }

        let {playAudioPrg, musicList} = this.state;

        let item = musicList[id - 1];

        if (!item) return;

        item.showTime = item.TotalTime;

        playAudioPrg.value = 0;

        item.audio.pause();

        item.audio.currentTime = 0;

        this.setState({
            musicList : musicList,
            playAudioPrg : playAudioPrg
        })
    }

    /**
     * 音频播放停止
     */
    handleAudioPause(id){
    
    }


    /**
     * 音频数据源加载完毕
     */
    handleAudioLoad(id){
        
        let item = this.getAudioById(id);
        if (item.TotalTime === undefined)
        {
            item.duration = item.audio.duration * 1000;
            item.TotalTime = this.GetTime(item.duration);
            item.showTime = item.TotalTime;

            let {musicList} = this.state;

            musicList[id - 1] = item;

            this.setState({
                musicList : musicList
            })

        } 
    }

    handleTouchStart() {
        const {playAudioPrg, playCurAudioId, musicList} = this.state;

        playAudioPrg.touch = true;

        let item = musicList[playCurAudioId - 1]

        if (!item.audio.paused)
            item.audio.pause();

        this.setState({
            playAudioPrg : {...playAudioPrg}
        })
    };
    
      
    handleTouchEnd(value) {
        const {musicList, playAudioPrg, playCurAudioId} = this.state;

        playAudioPrg.touch = false;

        let item = musicList[playCurAudioId - 1]

        item.audio.currentTime = parseFloat(Math.round(item.audio.duration * value / 100))

        playAudioPrg.value = value;

        if (item.audio.paused)
            item.audio.play();

        this.setState({
            playAudioPrg : {...playAudioPrg}
        })
    };
    

    handleSearchEngineChange(value) {
        this.setState({
            searchEngine: value
        });
    }


    /**
     * 时间格式化为标准格式 
     * @param {number} time 毫秒
    */
    GetTime (time) {
        if (time === undefined || time === null) return " __:__ ";
        time = Math.round(time / 1000);
        var m = Math.floor(time / 60);
        var s = time - m * 60;

        // 播放声音不足1s时候显示1s
        if (s===0){
            s = 1;
        }
        return " " + (m > 9 ? m : "0" + m) + ":" + (s > 9 ? s : "0" + s) + " ";
    };

     /**
     * 一级标签切换
     * @param {int/string} e 点击的music类型id
     */
    onFirstTagChange(e) {

        this.refreshFirstTab(e.target.value);
    }

    
    refreshFirstTab(tab){

        this.setState({
            isloading : true
        });

        this.resetAudio();

        this.setState({
            firstTab: tab,           
            secondTab: '1',
            thirdTab: '1_1'     
        });


        // 刷新二级和三级标签
        const {Edbox} = window;
        const {musicTags} = this.state;

        let {musicType} = this.state;

        const guid = musicTags[tab - 1].tag;

        const thisState = this;

        // 获取二级标签数据
        Edbox.FrontendLib.GetSortTree(guid, refSorteTree, function(err){
        });

        function refSorteTree(lstMusic) {

            // 默认增加空标签
            musicType = [
                {
                    id: '1',
                    name: formatMessage({id: 'all'}),
                    tag: guid,
                    subType: [
                        {
                            id: '1_1',
                            name: formatMessage({id: 'all'}),
                            tag: guid
                        }
                    ]
                }
            ];

            let keys = Object.keys(lstMusic);

            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];
                let value = lstMusic[key];
                let id = musicType.length + 1;
                let secobj = {
                    id: ''+ id,
                    name: value.name,
                    tag: value.id,
                    subType: [
                    ]
                };

                musicType.push(secobj);
            }

            thisState.setState({
                musicType: musicType
            });
        };  

        this.refreshAudioByTag(guid);
    }


    /**
    * 切换二级标签数据
    * @param {string} 标签id
    */
    onToggleSecondTab(tab){

        this.resetAudio();

        this.setState({
            musicList : []
        })

        this.setState({
            secondTab: tab,
            thirdTab: tab + '_1'
        });

        const {musicType} = this.state;

        let secondTab = musicType.find(function(e){
            return e.id === tab
        });

        const {Edbox} = window;
        const thisState = this;

        // 获取改二级标签下的三级标签数据
        // 还没获取到该标签下的三级标签数据
        if (secondTab.subType.length === 0){
            Edbox.FrontendLib.GetSortTree(secondTab.tag, refSorteTree, function(err){
            });
    
            function refSorteTree(lstMusic) {   
                // 默认增加空标签
                secondTab.subType.push({
                    id: secondTab.id + '_1',
                    name: formatMessage({id: 'all'}),
                    tag: secondTab.tag
                });
       
    
                let keys = Object.keys(lstMusic);
    
                for (let i = 0; i < keys.length; i++) {
                    let key = keys[i];
                    let value = lstMusic[key];
                    let id = secondTab.id + '_' + (secondTab.subType.length + 1);
                    
                    let obj = {
                        id: id ,
                        name: value.name,
                        tag: value.id                      
                    };
    
                    secondTab.subType.push(obj);
                }

                if (secondTab){
                    thisState.refreshAudioByTag(secondTab.tag);
                }
    
                thisState.setState({
                    musicType: musicType
                }, () => {
                    thisState.initList();
                });
            }; 
        }
        else{
            if (secondTab){
                thisState.refreshAudioByTag(secondTab.tag);
            }
        }
    }

    /**
    * 切换三级标签数据
    * @param {int} 标签数据
    */
    onToggleThirdTab(evt){

        this.resetAudio();

        this.setState({
            musicList : []
        })

        this.setState({
            thirdTab: evt.target.value
        });

        const {musicType} = this.state;

        let thridTab = null;
        for(let i = 0; i < musicType.length; i++){
            thridTab = musicType[i].subType.find(function(n){
                return n.id === evt.target.value
            });

            if (thridTab) {
                break;
            }
        }

        
        if (thridTab === undefined) return;
        
        this.refreshAudioByTag(thridTab.tag)
    }

    /**
    * 显示更多数据
    */
    handleLoadMore()
    {
        const {showMore} = this.state;

        if (!showMore) return;

        this.refreshAudioByPage(this.curPage + 1);
    }

    /**
     * 刷新音乐列表
     * @param {int} 当前页数 
    */
    refreshAudioByPage(curPage) {

        if (curPage === undefined) {
            curPage = 1;
        }

        const {searchWord} = this.state;

        const pageSize = 10;

        const {Edbox} = window;

        const {audioSelector} = this.props;
        const {remoteAudio} = audioSelector;
        
        const _this = this;

        const resTag = this.curTag;

        Edbox.FrontendLib.GetResources(this.curTag, searchWord, curPage, pageSize, function(msg){
            let data = msg.items;

            const {musicList} = _this.state;

            if (musicList.length === 0 && data.length === 0){

                _this.setState({
                    isloading: false
                });

                return;
            }

            _this.curPage = curPage;
            _this.totalPage = Math.ceil(msg.total_count / pageSize);    

            _this.setState({
                showMore : _this.curPage < _this.totalPage
            })

            //console.log(data);            
            let keys = Object.keys(data);
            
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var value = data[key];
                if (!value.id) continue;
                let isTop = false;
                if (value.id === remoteAudio.GUID) {   
                    if (_this.insertDef){
                        continue;
                    }  
                    isTop = true;  
                }
               
                _this.handleAudioItem((curPage-1)*pageSize+i, resTag, value.id, value.title, isTop);
            }
        
        });
    };    
    
     /**
     * 处理音频数据
     * @param int key 当前页数 
    */
    handleAudioItem(key, tag, guid, title, isTop) {

        const {audioFormats} = this.state;
        const thisState = this;

        key = parseInt(key) + 1;

        if (this.insertDef){
            key++;
        }

        // 音频数据解析 构造
        function getduration(data) {
            data.CurrentTime = 0;
            if (data.SourceInfo && data.SourceInfo.Audio) {
                var list = JSON.parse(data.SourceInfo.Audio);
                var info = list[0];
                data.TotalTime = thisState.GetTime(info.Duration);
                data.showTime = data.TotalTime;
                data.duration = info.Duration;
            }
        }

        const {Edbox} = window;

        Edbox.NDR.Get(guid, function (data) {

            if (thisState.curTag !== tag) {
                return;
            }

            data.id = key;
            data.Name = title;

            getduration(data);
            //musicList.push(data);

            const {musicList} = thisState.state;

            if (isTop){
                var topData = musicList[0];
                topData.id = key;
                data.id = 1;
                musicList[0] = data;
                musicList[key-1] = topData;

                thisState.setState({
                    selectMusicId: 1
                });  
            }
            else{
                musicList[key-1] = data
            }

            thisState.setState({
                musicList: musicList,
                isloading: false
            });
            
        }, function(err){

        }, audioFormats);
    }


    /**
    * 根据前端分类刷新音乐列表
    * @param {string} 前端分类
    */
    refreshAudioByTag(tag) {

        this.setState({
            isloading : true
        });

        this.insertDef = false;

        this.curTag = tag;
        
        let {musicList, searchWord} = this.state;
        musicList = [];

        this.setState({
            musicList: musicList,
            showMore : false
        }, () => {
            this.initList();
        });

        this.resetAudio();

        const {audioSelector} = this.props;

        const {remoteAudio} = audioSelector;
        
        this.lstAudioIndex = 0;

        if (searchWord === '' && remoteAudio.GUID !== ''){

            this.handleAudioItem(0, this.curTag, remoteAudio.GUID, remoteAudio.ResourceName);
            this.insertDef = true;
            this.setState({
                selectMusicId: 1}
            );  
        }
        else{
            this.lstAudioIndex = 0;
            this.setState({
                selectMusicId: 0
            });
        }

        var curPage = 1;

        this.refreshAudioByPage(curPage);
        this.refreshAudioByPage(curPage + 1);
    }

    /**
    * 选中音乐
    * @param {string} 前端分类
    */
    handleChoiceAudio(key){

        const id = key.target.value;        
        this.setState({
            selectMusicId : id
        })
    }

    /**
    * 选中音乐
    * @param {string} 前端分类
    */
    handleConfirmAudio()
    {
        const { musicList, selectMusicId } = this.state;

        var music = null;
        for(let i=0; i<musicList.length; ++i){
            if (musicList[i] !== undefined && musicList[i].id === selectMusicId){
                music = musicList[i];
                break;
            }
        };

        if(music === null) return;


        const { dispatch } = this.props;
        dispatch({
            type: 'audioSelector/setSound',
            payload: {
                guid: music.Guid,
                name: music.Name,
                url: music.Url
            }
        })

        router.push('/Edbox_AudioSelector');
    }

    handlSearchWord()
    {
        this.refreshAudioByTag(this.curTag);
    }

    handleChangeWord(e)
    {
        this.setState({
            searchWord :  e.target.value
        })
    }

    /**
     * 处理列表滚动
     */
    handleScroll(e) {
        let currScrollTop = e.target.scrollTop;
        const prevScrollTop = this.state.scrollTop;
        const oFilterPanel = document.getElementById('filterPanel');
        const {playCurAudio} = this.state;
        const currPalyItem = playCurAudio ? document.getElementById(`listItem${playCurAudio.id}`) : null;
        let {showTab} = this.state;
        if (currScrollTop >= prevScrollTop) { // 向下滚动
            if (currScrollTop > oFilterPanel.clientHeight) {
                showTab = false;
            } else {
                showTab = true;
            }
            this.setState({
                showTab: showTab,
                scrollTop: currScrollTop
            })

            if (this.list &&  this.listGroup) {
                let listPaddingTop = parseInt(this.list.style.paddingTop);
                listPaddingTop = listPaddingTop ? listPaddingTop : 0;
    
                if (currScrollTop + this.list.clientHeight - listPaddingTop >= this.listGroup.clientHeight) {
                    //console.log('load more');
                    this.handleLoadMore();
                }
            }
        } else { // 向上滚动
            this.setState({
                showTab: true,
                scrollTop: currScrollTop
            })
        }
        if (currPalyItem && currScrollTop > currPalyItem.offsetTop + currPalyItem.clientHeight - oFilterPanel.clientHeight - 5) {
            this.setState({
                showFixedPlayer: true
            })
            this.list.style.paddingBottom = `${currPalyItem.clientHeight - 3}px`;
        } else {
            this.setState({
                showFixedPlayer: false
            })
            this.list.style.paddingBottom = 0;
        }
    }

    initList() {
        const oFilterPanel = document.getElementById('filterPanel');
        this.list.style.paddingTop = `${oFilterPanel.clientHeight}px`;
    }

    componentDidMount() {
        this.initList();
    }

    render () {
        const {isloading, selectMusicId, searchEngineList, searchEngine, musicList, musicType, searchWords, playCurAudioId, playAudioPrg, secondTab, thirdTab, showTab} = this.state;
        const RadioGroup = Radio.Group;
        const RadioButton = Radio.Button;
        const {TabPane} = Tabs;

        return (
            <div>
                <div className="header-wrap" id="header">
                    <Header title={formatMessage({id: 'audio_library'})} back/>
                </div>
                <div className={styles['top-panel']} id="topPanel">
                    <Row gutter={7} className={styles['search-bar']}>
                        <div className="side-wrap">
                            {searchEngine === 1 ?
                            <Col span={10}>
                                <RadioGroup defaultValue={1} buttonStyle="solid" className={`${styles['lib-type']} lib-type`} onChange={this.onFirstTagChange.bind(this)}>
                                <Popover key={`popover_${1}`} content={formatMessage({id: 'music'})}>
                                    <RadioButton value={1}>{formatMessage({id: 'music'})}</RadioButton>
                                </Popover>
                                <Popover key={`popover_${2}`} content={formatMessage({id: 'effects'})}>
                                    <RadioButton value={2}>{formatMessage({id: 'effects'})}</RadioButton>
                                </Popover>
                                </RadioGroup>
                            </Col>
                            : null
                            }
                            <Col span={searchEngine === 1 ? 14 : 24}>
                                <Search searchEngineList={searchEngineList} defaultEngine={searchEngine} placeholder={formatMessage({id: 'search_word'})}  
                                showDropdown={false}
                                onEngineChange={this.handleSearchEngineChange.bind(this)}
                                onSearch={this.handlSearchWord.bind(this)}
                                onSearchChange={this.handleChangeWord.bind(this)}
                                />
                            </Col>
                        </div>
                    </Row>
                    <div className={`filter-panel ${!showTab ? 'hide' : ''}`} id="filterPanel">
                        {
                            searchEngine === 1 ?
                                musicType && musicType.length ? 
                                <Tabs animated={false} tabBarGutter={0} defaultActiveKey={secondTab} activeKey={secondTab} onChange={this.onToggleSecondTab.bind(this)}>
                                    {musicType.map(type => 
                                    
                                        <TabPane tab={type.name} key={type.id} className="side-wrap">
                                            <RadioGroup defaultValue={thirdTab} value={thirdTab} className={styles['subtype-group']} onChange={this.onToggleThirdTab.bind(this)}>
                                                {
                                                    type.subType.map(subType => 
                                                        <Popover key={`popover_${subType.id}`} content={subType.name} placement="bottom">
                                                            <RadioButton className={`${styles['subtype-btn']} subtype-btn`} value={subType.id} >{ subType.name }</RadioButton>
                                                        </Popover>
                                                    )
                                                }
                                            </RadioGroup>
                                        </TabPane>
                                    )}
                                </Tabs>
                                :null
                            :
                                
                            searchWords && searchWords.data && searchWords.data.length ?
                            <div className={styles['search-word']}>
                                <div className="side-wrap">
                                    <p className={styles['tit']}>{formatMessage({id: 'search_word'})}:</p>
                                    <Row gutter={4}>
                                        <RadioGroup className={styles['subtype-group']}>
                                            {
                                                (() => {
                                                    let arr = searchWords.data;
                                                    if (searchWords.hasMore && !searchWords.isShowMore) {
                                                        arr = arr.slice(0, 7);
                                                    }
                                                    if (searchWords.hasMore && searchWords.isShowMore) {
                                                        arr = searchWords.data;
                                                    }
                                                    return arr.map((item, i) => 
                                                        <div key={item.id}>
                                                            <Col span={6}>
                                                                <RadioButton className={styles['subtype-btn']} value={item.id}>{getLocale() === 'en-US' ? item.englishName : item.chineseName}</RadioButton>
                                                            </Col>
                                                            {i === arr.length - 1 && searchWords.hasMore ? 
                                                                <Col span={6}>
                                                                    <Button className={`${styles['subtype-btn']} ${styles['btn-more']} ellipsis`} onClick={this.handleToggleSearchWord.bind(this)}>
                                                                        <IconFont type={searchWords.isShowMore ? 'icon-retract' : 'icon-expand'}/>
                                                                    </Button>
                                                                </Col>
                                                                : null
                                                            }
                                                        </div>
                                                    )
                                                })()
                                            }
                                        </RadioGroup>
                                    </Row>
                                    <p className={styles['warning-info']}>
                                        <IconFont type="icon-warning"/>
                                        {formatMessage({id: 'network_audio_resources_warning'})}
                                    </p>
                                </div>
                            </div>
                            :null
                        }
                    </div>
                </div>
                <div className={styles['list']} onScroll={this.handleScroll.bind(this)} ref={list => this.list = list}>
                    {
                        isloading ? 
                          // 准备资源中
                        <div className="load_data">
                            <Empty className={styles['empty']} description={formatMessage({id: 'loading_search_result'}).split('<br>').map((str, i) => <span key={i}>{str}</span>)} image={loadingResultImage} imageStyle={{marginBottom: 24}}>
                            </Empty>
                        </div> :


                        musicList && musicList.length ?
                        <div ref={listGroup => this.listGroup = listGroup}>
                            <RadioGroup className={styles['list-group']} onChange={this.handleChoiceAudio.bind(this)} value={selectMusicId}>
                                {musicList.map(item => {
                                    return <div id={`listItem${item.id}`} className={`${styles['list-item']} ${
                                        (function(obj){ 
                                            if(item.id === playCurAudioId) {
                                                if (!item.audio.paused){
                                                    return styles['list-item-play'];
                                                }
                                                else
                                                {
                                                    return styles['list-item-pause'];
                                                }
                                            }
                                            else{
                                                return ''
                                            }
                                        }(this)) 
                                        }`} key={item.id} onDoubleClick={this.handleAudioPlay.bind(this, item.id)}>
                                        <div className={styles['list-item-r']}>
                                        {
                                            <IconFont type="icon-download" className={styles['ico-download']} onClick={this.handleAudioDown.bind(this, item.id)}/>
                                        }
                                            <Radio value={item.id} className={styles['list-item-radio']}/>
                                        </div>

                                        <div className={`${styles['list-item-c']} clearfix`}>
                                            <div className="ellipsis">
                                                <time>{item.showTime}</time>
                                                <i className={styles['ico-sound']} onClick={this.handleAudioPlay.bind(this, item.id)}></i>
                                                <span>{item.Name}</span>
                                            </div>
                                            {
                                                !playAudioPrg.touch ? 
                                                <Slider 
                                                className={`${styles['slider']} audio-slider`} 
                                                value={playAudioPrg.value}
                                                onBeforeChange={this.handleTouchStart.bind(this)}
                                                onAfterChange={this.handleTouchEnd.bind(this)}
                                                tipFormatter={null}
                                                /> 
                                                :
                                                <Slider 
                                                className={`${styles['slider']} audio-slider`}                                   
                                                onBeforeChange={this.handleTouchStart.bind(this)}
                                                onAfterChange={this.handleTouchEnd.bind(this)}
                                                tipFormatter={null}
                                                />
                                            }

                                        <audio src={item.Url}  preload="metadata"
                                            ref={(audio) => { item.audio = audio}} 
                                            onTimeUpdate={this.handleTimeUpdate.bind(this, item.id)} 
                                            onPause={this.handleAudioPause.bind(this, item.id)}
                                            onLoadedMetadata={this.handleAudioLoad.bind(this, item.id)}
                                            onEnded={this.handleAudioStop.bind(this, item.id)}></audio> 
                                        </div>
                                    
                                    </div>
                                    }
                                )}
                            </RadioGroup>
                        </div>
                        : 
                        // 搜索结果未空
                        <div className="no-data">
                            <Empty className={styles['empty']} description={formatMessage({id: 'no_result_match'}).split('<br>').map((str, i) => <span key={i}>{str}</span>)} image={noResultMatchImage} imageStyle={{marginBottom: 24}}>
                            </Empty>
                        </div>
                        
                   
                    }  
                </div>        
                <div className="btm-btns">
                {
                    selectMusicId > 0 ?
                    <Button type="primary" onClick={this.handleConfirmAudio.bind(this)} >{formatMessage({id: 'ok'})}</Button>
                    :
                    <Button type="primary" disabled onClick={this.handleConfirmAudio.bind(this)} >{formatMessage({id: 'ok'})}</Button>
                } 
                </div>
            </div>
        )
    }
}

export default AudioLibrary;