import React, { Component } from 'react';
import { getLocale } from 'umi/locale';
import { Select, Input } from 'antd';
import IconFont from '@/components/iconfont';
import styles from './index.scss';

class Search extends Component {
  render() {
    const { Option } = Select;
    const {
      searchEngineList,
      defaultEngine,
      onEngineChange,
      onSearchChange,
      onSearch,
      ...inputProps
    } = this.props;
    const selectBefore =
      searchEngineList && searchEngineList.length ? (
        <Select
          defaultValue={defaultEngine}
          dropdownClassName="search-dropdown"
          className={styles['select-before']}
          onChange={onEngineChange}
        >
          {searchEngineList.map(engine => (
            <Option value={engine.id} key={engine.id}>
              <IconFont type={engine.icon} className={styles['ico-engine']} />
              <span>{getLocale() === 'en-US' ? engine.englishName : engine.chineseName}</span>
            </Option>
          ))}
        </Select>
      ) : null;
    return (
      <div className="search-box">
        <Input
          addonBefore={selectBefore}
          onChange={onSearchChange}
          onPressEnter={onSearch}
          addonAfter={<IconFont type="icon-search" onClick={onSearch} />}
          {...inputProps}
        />
      </div>
    );
  }
}

export default Search;
