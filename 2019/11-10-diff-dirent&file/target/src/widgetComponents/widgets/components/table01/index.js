import React, { Component } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';

const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  render() {
    const { editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {form => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

class EditableTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
      tableWidth: 0,
      data: [],
      dataSource: [],
      editingKey: '',
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
    };
    this.operationColumns = [
      {
        title: formatMessage({ id: 'table01_operation' }),
        dataIndex: 'operation',
        fixed: 'right',
        width: 120,
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <span
                        onClick={() => this.save(form, record.key)}
                        style={{ color: '#da0301', cursor: 'pointer', marginRight: 8 }}
                      >
                        {formatMessage({ id: 'button_save' })}
                      </span>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title={formatMessage({ id: 'cancel_confirm_text' })}
                    okText={formatMessage({ id: 'ok_text' })}
                    cancelText={formatMessage({ id: 'cancel_text' })}
                    onConfirm={() => this.cancel(record.key)}
                  >
                    <span style={{ color: '#da0301', cursor: 'pointer' }}>
                      {formatMessage({ id: 'button_cancel' })}
                    </span>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                  <Popconfirm
                    title={formatMessage({ id: 'delete_confirm_text' })}
                    okText={formatMessage({ id: 'ok_text' })}
                    cancelText={formatMessage({ id: 'cancel_text' })}
                    onConfirm={() => this.deleteRow(record.key)}
                  >
                    <Button
                      style={{ marginRight: 8 }}
                      disabled={editingKey !== ''}
                      shape="circle"
                      // icon="delete"
                    >
                      <span className={'delIcon'} />
                    </Button>
                  </Popconfirm>
                  <Button
                    style={{ marginRight: 8 }}
                    disabled={editingKey !== ''}
                    onClick={() => this.edit(record.key)}
                    shape="circle"
                    // icon="form"
                  >
                    <span className={'editIcon'} />
                  </Button>
                </span>
              )}
            </div>
          );
        },
      },
    ];
    this.columns = [];
  }

  initData = () => {
    const { config = {}, pagination } = this.state;
    const { Value = [] } = config;
    const { current, pageSize } = pagination;
    const otherColumns = Value[0];
    const data = Value[1];
    const total = data.length;
    const start = (current - 1) * pageSize;
    const end = current * pageSize;
    const dataSource = data.slice(start, end);
    let tableWidth = 0;

    this.columns = [...otherColumns, ...this.operationColumns];
    this.columns.map(item => {
      return (tableWidth = item.width ? tableWidth + parseInt(item.width) : tableWidth + 150);
    });
    pagination.total = total;

    this.setState({
      tableWidth: tableWidth,
      data: data,
      dataSource: dataSource,
      pagination: {
        ...pagination,
      },
    });
  };

  isEditing = record => record.key === this.state.editingKey;

  updateData = () => {
    const { config, data } = this.state;
    config.Value[1] = data;
    this.props.onUpdate(config);
  };

  deleteRow = key => {
    const { data, pagination } = this.state;
    const { total, current, pageSize } = pagination;
    const index = data.findIndex(item => {
      return item.key === key;
    });
    if (index > -1) {
      data.splice(index, 1);
      pagination.total = total - 1;
      pagination.current = current > Math.ceil((total - 1) / pageSize) ? current - 1 : current;
      const dataSource = this.handleTableDataSource(data, pagination);

      this.setState(
        {
          data: data,
          dataSource: dataSource,
          pagination: {
            ...pagination,
          },
        },
        () => {
          this.updateData();
        },
      );
    }
  };

  edit = key => {
    this.setState({ editingKey: key });
  };

  save = (form, key) => {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const { data, pagination } = this.state;
      const newData = [...data];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        const dataSource = this.handleTableDataSource(newData, pagination);
        this.setState(
          {
            data: newData,
            dataSource: dataSource,
            editingKey: '',
          },
          () => {
            this.updateData();
          },
        );
      }
    });
  };

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  handleTableDataSource = (data, pagination) => {
    const { current, pageSize } = pagination;
    const start = (current - 1) * pageSize;
    const end = current * pageSize;
    const dataSource = data.slice(start, end);

    return dataSource;
  };

  handleChangeTable = pagination => {
    const { data } = this.state;
    const newDataSource = this.handleTableDataSource(data, pagination);

    this.setState({
      dataSource: newDataSource,
      pagination: {
        ...pagination,
      },
    });
  };

  componentWillMount() {
    this.initData();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      {
        config: { ...nextProps.config },
      },
      () => {
        this.initData();
      },
    );
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };
    const { config, tableWidth, dataSource, pagination } = this.state;
    const { ReadOnly = false, ErrorText_Override } = config;
    let { ErrorText = '' } = config;
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: typeof record[col.title] === 'number' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    ErrorText = ErrorText_Override||ErrorText;

    return (
      <div className={styles['table-wrap']}>
        <div className={ReadOnly ? styles['read-only'] : null}>
          <EditableContext.Provider value={this.props.form}>
            <Table
              components={components}
              bordered
              dataSource={dataSource}
              columns={columns}
              rowClassName="editable-row"
              pagination={pagination}
              scroll={{ x: tableWidth }}
              onChange={this.handleChangeTable}
            />
          </EditableContext.Provider>
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

const Table01 = Form.create()(EditableTable);

export default Table01;
