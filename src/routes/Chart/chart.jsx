import React from 'react';
import { connect } from 'react-redux';
import Form from '@wind/wind-ui-form';
import {
  Input, Select, DatePicker, Radio, Button
} from '@wind/wind-ui';
import { request } from '../../utils/request';
import { getData, clearData } from './actions';
import './index.css';

const { Option } = Select;
class Column extends React.Component {
  formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };

  onFinish = async (values) => {
    let params = {};
    console.log(values);
    for (let i of Object.keys(values)) {
      params[i] = values[i];
    }
    console.log(params);
    await request({ url: 'http://localhost:9090/lists', method: 'POST', params });
  }

  render() {
    return (
      <>
        <Form
          className="from-list"
          name="validate_other"
          {...this.formItemLayout}
          onFinish={this.onFinish}
          initialValues={{
            'input-number': 3,
            'checkbox-group': ['A', 'B'],
            rate: 3.5,
            male: '男'
          }}
        >
          <Form.Item
            name="lang"
            label="Select"
            hasFeedback
            rules={[{ required: true, message: 'Please select your country!' }]}
          >
            <Select placeholder="Please select a country">
              {
                this.props.home.list.map(value => (<Option value={value.text} key={value.text}>{value.text}</Option>))
              }
            </Select>
          </Form.Item>
          <Form.Item name="male" label="Radio.Group">
            <Radio.Group>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="name"
            label="Nickname"
            rules={[
              {
                required: true,
                message: 'Please input your nickname',
              },
            ]}
          >
            <Input placeholder="Please input your nickname" />
          </Form.Item>
          <Form.Item
            name="brithday"
            label="日期"
          >
            <DatePicker />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => ({
  init: () => { dispatch(getData()); },
  clear: () => { dispatch(clearData()); },
});
export default connect(mapStateToProps, mapDispatchToProps)(Column);
