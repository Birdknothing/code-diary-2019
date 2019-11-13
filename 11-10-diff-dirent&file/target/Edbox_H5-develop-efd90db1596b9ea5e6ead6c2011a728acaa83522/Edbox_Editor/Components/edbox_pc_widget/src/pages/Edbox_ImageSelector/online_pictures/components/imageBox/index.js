import React, { Component } from 'react';
import { Spin } from 'antd';
import { formatMessage } from 'umi/locale';
import IconButton from '@/components/iconbutton';
import styles from './index.scss';

const { Edbox } = window;

class imageBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, // 是否加载中
      data: this.props.data, // 图片数据
      selectedImgGUID: this.props.selectedImgGUID // 选中的图片数据
    };
  }

  /**
   * 选中图片处理
   *
   * @param data object 选中的图片对象
   */
  handleClickBox = data => {
    this.props.onSelectedImageBox(data);
  };

  /**
   * 图片加载回调
   */
  handleImageLoaded = () => {
    this.setState({
      loading: false
    });
  };

  /**
   * 下载图片
   *
   * @param {string} src 资源路径或者 Base64 格式字符串
   * @param {string} title 文件名称
   */
  handleDownload = (src, title) => {
    Edbox.DownLoad(
      src,
      title,
      success => {},
      error => {
        console.log(error);
      },
    );
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: { ...nextProps.data },
      selectedImgGUID: nextProps.selectedImgGUID
    });
  }

  render() {
    const { loading, data, selectedImgGUID } = this.state;

    return (
      <li
        className={
          selectedImgGUID === data.id ? `${styles['li']} ${styles['active']}` : `${styles['li']}`
        }
      >
        {loading ? <Spin className={styles['loading']} /> : null}
        <div className={styles['img-box']} onClick={() => this.handleClickBox(data)}>
          <img
            key={`img_${data.id}`}
            src={data.cover}
            alt={data.title}
            onLoad={this.handleImageLoaded}
          />
        </div>
        {selectedImgGUID === data.id ? (
          <span key={`check_${data.id}`} className={styles['check-box']}>
            <IconButton iconfont="icon-check" />
          </span>
        ) : null}
        <span
          className={styles['btn-download']}
          onClick={() => this.handleDownload(data.cover, data.title)}
        />
        {data.isCopyright ? (
          <span className={styles['tag']}>{formatMessage({ id: 'copyright' })}</span>
        ) : null}
      </li>
    );
  }
}

export default imageBox;
