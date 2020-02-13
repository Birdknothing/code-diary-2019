import testImage from '@/assets/images/test.jpg';

export default {
    namespace: 'onlineImage',
    state: {
        searchEngineList: [
            {
                id: 0,
                englishName: 'NDR',
                chineseName: 'NDR',
                icon: 'icon-layers'
            },
            {
                id: 1,
                englishName: 'Baidu',
                chineseName: '百度',
                icon: 'icon-baidu'
            }
        ],
        searchEngineId: 0,
        imageTypeList: [
            {
                id: 0,
                englishName: 'All',
                chineseName: '全部'
            },
            {
                id: 1,
                englishName: 'Build',
                chineseName: '建筑'
            },
            {
                id: 2,
                englishName: 'Abstract',
                chineseName: '抽象'
            },
            {
                id: 3,
                englishName: 'Animal',
                chineseName: '动物'
            },
            {
                id: 4,
                englishName: 'Animal',
                chineseName: '动物'
            },
            {
                id: 5,
                englishName: 'Animal',
                chineseName: '动物'
            }
        ],
        imageTypeId: 0,
        imageList: [
            {
                id: 0,
                name: 'xxx0',
                url: testImage
            },
            {
                id: 1,
                name: 'xxx1',
                url: testImage
            },
            {
                id: 2,
                name: 'xxx2',
                url: testImage
            },
            {
                id: 3,
                name: 'xxx3',
                url: testImage
            },
            {
                id: 4,
                name: 'xxx4',
                url: testImage
            },
            {
                id: 5,
                name: 'xxx5',
                url: testImage
            },
            {
                id: 6,
                name: 'xxx6',
                url: testImage
            },
            {
                id: 7,
                name: 'xxx7',
                url: testImage
            },
            {
                id: 8,
                name: 'xxx8',
                url: testImage
            },
            {
                id: 9,
                name: 'xxx9',
                url: testImage
            },
            {
                id: 10,
                name: 'xxx10',
                url: testImage
            },
            {
                id: 11,
                name: 'xxx11',
                url: testImage
            },
            {
                id: 12,
                name: 'xxx12',
                url: testImage
            },
            {
                id: 13,
                name: 'xxx13',
                url: testImage
            },
            {
                id: 14,
                name: 'xxx14',
                url: testImage
            },
        ],
        imageCutTypeList: [
            {
                id: 0,
                name: 'xxx0',
                url: testImage,
                status: 0 // 0=>未下载，1=>下载中，2=>已下载
            },
            {
                id: 1,
                name: 'xxx1',
                url: testImage,
                status: 0,
            },
            {
                id: 2,
                name: 'xxx2',
                url: testImage,
                status: 0,
            },
            {
                id: 3,
                name: 'xxx3',
                url: testImage,
                status: 1,
            },
            {
                id: 4,
                name: 'xxx4',
                url: testImage,
                status: 2,
            },
            {
                id: 5,
                name: 'xxx5',
                url: testImage,
                status: 2,
            },
            {
                id: 6,
                name: 'xxx6',
                url: testImage,
                status: 2,
            },
            {
                id: 7,
                name: 'xxx7',
                url: testImage,
                status: 2,
            },
            {
                id: 8,
                name: 'xxx8',
                url: testImage,
                status: 2,
            },
            {
                id: 9,
                name: 'xxx9',
                url: testImage,
                status: 2,
            },
            {
                id: 10,
                name: 'xxx10',
                url: testImage,
                status: 2,
            },
            {
                id: 11,
                name: 'xxx11',
                url: testImage,
                status: 2,
            },
            {
                id: 12,
                name: 'xxx12',
                url: testImage,
                status: 2,
            },
            {
                id: 13,
                name: 'xxx13',
                url: testImage,
                status: 2,
            },
            {
                id: 14,
                name: 'xxx14',
                url: testImage,
                status: 2,
            },
        ],
        imageSelectType: 'multi', // single为单选，multi为多选
        maxSelectImages: 15, // 最多可以选择的图片数量针对多选情况
        selectedImages: [ // 选中的图片
            {
                id: 0,
                name: 'xxx0',
                url: testImage
            },
            {
                id: 1,
                name: 'xxx1',
                url: testImage
            },
            {
                id: 2,
                name: 'xxx2',
                url: testImage
            },
            {
                id: 3,
                name: 'xxx3',
                url: testImage
            },
            {
                id: 4,
                name: 'xxx4',
                url: testImage
            },
            {
                id: 5,
                name: 'xxx5',
                url: testImage
            },
            {
                id: 6,
                name: 'xxx6',
                url: testImage
            },
            {
                id: 7,
                name: 'xxx7',
                url: testImage
            },
            {
                id: 8,
                name: 'xxx8',
                url: testImage
            },
            {
                id: 9,
                name: 'xxx9',
                url: testImage
            },
            {
                id: 10,
                name: 'xxx10',
                url: testImage
            },
            {
                id: 11,
                name: 'xxx11',
                url: testImage
            },
            {
                id: 12,
                name: 'xxx12',
                url: testImage
            },
            {
                id: 13,
                name: 'xxx13',
                url: testImage
            },
            {
                id: 14,
                name: 'xxx14',
                url: testImage
            },
        ], // 已选择的图片
        previewImageIndex: 0, // 正在查看的预览图片
        editImage: { // 正在编辑的图片
            id: 0,
            name: 'xxx0',
            url: testImage
        }, 
        editImageProperties: { // 目前正在编辑的图片属性
            opacity: 100, // 透明度
            rotate: 0, // 旋转
            flipX: 1, // 是否水平翻转
            flipY: 1 // 是否垂直翻转
        }
    },
    reducers: {
        // 切换搜索引擎
        changeSearchEngine(state, {payload: searchEngineId}) {
            return {...state, searchEngineId}
        },
        // 处理已选中的图片
        handleSelectedImages(state, {payload: selectedImages}) {
            return {...state, selectedImages}
        },
        // 设置正在预览的图片索引值
        setPreviewImageIndex(state, {payload: previewImageIndex}) {
            return {...state, previewImageIndex}
        },
        // 设置正在编辑的图片信息
        setEditImage(state, {payload: editImage}) {
            return {...state, editImage}
        },
        // 设置图片透明度
        setImageOpacity(state, {payload: opacity}) {
            return {...state, editImageProperties: {...state.editImageProperties, opacity}}
        },
        // 设置图片水平翻转
        setImageFlipX(state, {payload: flipX}) {
            return {...state, editImageProperties: {...state.editImageProperties, flipX}}
        },
        // 设置图片垂直翻转
        setImageFlipY(state, {payload: flipY}) {
            return {...state, editImageProperties: {...state.editImageProperties, flipY}}
        },
        // 设置图片旋转
        setImageRotate(state, {payload: rotate}) {
            return {...state, editImageProperties: {...state.editImageProperties, rotate}}
        }
    }
}