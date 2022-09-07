import React from 'react';
import { connect } from 'react-redux';
import Table from '@wind/wind-ui-table';
import { getData } from './actions';

class TodoApp extends React.Component {
  componentDidMount() {
    this.props.onClick();
  }

  columns = [
    {
      title: 'id',
      dataIndex: 'id'
    },
    {
      title: '语言',
      dataIndex: 'lang'
    }, {
      title: '姓名',
      dataIndex: 'name'
    }, {
      title: '性别',
      dataIndex: 'sex',
    }, {
      title: '生日',
      dataIndex: 'brithday',
    }];

  render() {
    // const dataSource = this.props.
    const { list } = this.props.toda;
    return (
      <div>
        <Table size='large' layout="inline" title={() => '身份信息列表'} 
        columns={this.columns} pagination={false} dataSource={list} />
      </div>
    );
  }
}
const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  onClick: () => {
    dispatch(getData());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoApp);
