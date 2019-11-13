/**
 *
 * @Author: yfb(528803)
 * @Date: 2019-9-5
 *
 **/


$(function(){
    var loading = true;
    var isShowLoadMore = true;
    var offset = 0;
    var pagesize = 10;
    var key = '';
    var shareMsg = '分享',
        listNoneMsg = '暂无好友';
    // var language = 'SimplifiedChinese';

    $('#closeShareModal').on('click',function(){
        $('#shareMask').hide();
        $('#shareModal').hide();

        if (parent)
            parent.window.postMessage("closeIM", "*");
    })
    // var Edbox = window;
    Edbox.Start(function(isLogin){
        if(isLogin){
            language = Edbox.Language
            // console.log(language,111111111111)
            if(language !== 'SimplifiedChinese'){
                $('#language_msg01').text('Share with Friends')
                $('#language_msg02').text('Loading...')
                $('#searchInput').attr('placeholder','Search')
                shareMsg = 'Share';
            }else{
                listNoneMsg = 'No friends found';
                $('#language_msg01').text('分享给好友')
                $('#language_msg02').text('加载中...')
                $('#searchInput').attr('placeholder','搜索')
                shareMsg = '分享';
                listNoneMsg = '暂无好友';
            }
            loadingMore(offset,pagesize,key)
            InitScroll()
            $('#shareUl').on('click','.share-btn',function(){
                // console.log()
                ShareApp($(this).attr('data-id'))
            })
        }
    });

    // var event = arguments.callee.caller.arguments[0] || window.event;
    $('#searchInput').keydown(function(event){
        if(event.keyCode === 13){
            SearchFriend(event.target.value)
        }
    })
    
    /**
     * 好友列表渲染
     * @param {array} data 好友列表数组
     */
    function listTemSet(data){
        var listHtml = '';
        for(var i=0;i<data.length;i++){
            listHtml += '<li class="list-item">';
            listHtml += '<div class="list-item-meta">';
            listHtml += '<div class="avatar">';
            listHtml += '<span><img src="'+ data[i].iconUrl +'" alt=""></span>';
            listHtml += '</div>';
            listHtml += '<div class="content">';
            listHtml += '<h4>'+ data[i].nickname +'</h4>';
            listHtml += '</div>';
            listHtml += '</div>';
            listHtml += '<div>';
            listHtml += '<button data-id="'+ data[i].uri +'" type="button" class="share-btn share-btn-primary"><span>'+ shareMsg +'</span></button>';
            listHtml += '</div>';
            listHtml += '</li>';
        }
        $('#shareUl').append(listHtml)
        loading = false
        $('.loading-txt').hide()
        if(data.length == 0 && offset == 0){
            $('#shareUl').append('<li class="list-item">'+ listNoneMsg +'</li>')
        }
    }
    
    /**
     * 加载更多
     *
     * @param {int} offset 分页偏移
     * @param {int} pagesize 每页显示
     * @param {string} key 搜索关键词
     */
    function loadingMore(offset,pagesize,key){
        var imParam = {};
        imParam.offset = offset;
        imParam.pagesize = pagesize;
        imParam.key = key;
        loading = true
        $('.loading-txt').show()
        Edbox.Share.GetIMFriendsInfo(imParam, function(data){
            // console.log(data)
            listTemSet(data.items)
            isShowLoadMore = data.items.length < 10 ? false : true
        }, function(error){

        })
    }

    /**
     * 监听滚动
     */
    function InitScroll(){
        $('#shareList').on('scroll',function(){
            // console.log('11111')
            var oScrollContainer = document.getElementById('shareList');
            var oScrollContent = document.getElementById('shareUl');
            var containerHeight = oScrollContainer.clientHeight;
            var containerScrollTop = oScrollContainer.scrollTop;
            var contentHeight = oScrollContent.clientHeight;
            var canTriggerLoading = contentHeight - containerHeight - containerScrollTop < 50;
            // console.log(canTriggerLoading)
            if(!loading && isShowLoadMore &&canTriggerLoading){
                
                offset = offset + 10
                loadingMore(offset,pagesize,key)
            }
        })
    }

    /**
     * 搜索好友
     * @param {string} key 关键词
     */
    function SearchFriend(key){
        loading = true;
        isShowLoadMore = true;
        offset = 0;
        $('#shareUl').html('');
        loadingMore(offset,pagesize,key)
    }

    /**
     * 分享游戏
     *
     * @param {string} id 接收玩家id
     */
    function ShareApp(id){
        Edbox.Share.ShareAppToIM(id, function(data){
            // console.log('success:',data)
            $('[data-id="'+ id +'"]').addClass('disabled')
        }, function(error){
            console.log('error:',error)
        });
    }
})
