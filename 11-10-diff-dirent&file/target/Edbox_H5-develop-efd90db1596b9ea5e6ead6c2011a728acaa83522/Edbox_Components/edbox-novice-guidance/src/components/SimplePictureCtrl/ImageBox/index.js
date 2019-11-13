import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import styles from './index.scss';
import IconButton from '@/components/IconButton';

@connect(({loading}) => ({
  loading: loading.models.global,
}))
class ImageBox extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: this.props.data,
      selectedImgGUID: this.props.selectedImgGUID,
     };
  }


  handleClickBox = data => {
    this.props.onSelectedImageBox(data);
  };

  handleImageLoaded = () => {
    this.setState({
      loading: false,
    });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: { ...nextProps.data },
      selectedImgGUID: nextProps.selectedImgGUID,
    });
  }
  render() {
    const { loading, data, selectedImgGUID } = this.state;
    return (<li
      className={
        selectedImgGUID === data.id ? `${styles['li']} ${styles['active']}` : `${styles['li']}`
      }
      title={data.title}
    >
      {loading ? <Icon className={styles['loading']} type="loading" /> : null}
      <img
        key={`img_${data.id}`}
        src={data.cover}
        alt={data.title}
        onLoad={this.handleImageLoaded}
        onClick={() => this.handleClickBox(data)}
      />
      {selectedImgGUID === data.id ? (
        <span key={`check_${data.id}`} className={styles['check-box']}>
          <IconButton iconfont="icon-check" />
        </span>
      ) : null}
      <a
        key={`download_${data.id}`}
        href={data.cover}
        className={styles['btn-download']}
        target="_blank"
        rel="noopener noreferrer"
        download={data.title}
      >
        {' '}
      </a>
    </li>);
  }
}

export default ImageBox;
