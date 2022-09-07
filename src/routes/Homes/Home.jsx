import React from 'react';
import { List, Button } from '@wind/wind-ui';
import { connect } from 'react-redux';
import { getData } from './actions';
import './index.less';

class Home extends React.Component {
  state = {
    indexValue: 0
  }

  componentDidMount() {
    let { getLang } = this.props;
    getLang();
  }

  addLang = () => {
    let data = prompt('请输入');
    if (!data || data.trim() === '') {
      return;
    }
    data = [...this.props.home.list, { key: data, text: data }];
    this.props.addLangFun(data);
  }

  changeBackground =(item) => {
    this.setState({ indexValue: item });
  }

  delLang = () => {
    let data = [...this.props.home.list];
    data.splice(this.state.indexValue, 1);
    this.props.delLang(data);
  }

  render() {
    console.log(this.props.home.list);
    return (
      <div className="home">
        <List
          onClick={(e) => { this.setState({ indexValue: Number(e.target.getAttribute('red')) }); }}
          dataSource={this.props.home.list}
          renderItem={(item, index) => {
            console.log(item, index);
            return (
              <List.Item className={this.state.indexValue === index ? 'red-back' : ''} key={item.text} red={index} itemIndex={index + 1}>
                {item.text}
              </List.Item>
            );
          }}
        />
        <div className='button-list'>
        <Button onClick={this.addLang} type="primary">添加语言</Button>
        <Button onClick={this.delLang} type="primary">shanchu</Button>
        </div>

      </div>
    );
  }
}
const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  onClick: () => {
    dispatch({
      type: 'GET_LIST',
    });
  },
  getLang: () => {
    dispatch(getData());
  },
  addLangFun: (data) => {
    dispatch({ type: 'UP_DATA', payload: data });
  },
  delLang: (data) => {
    dispatch({ type: 'UP_DATA', payload: data });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
