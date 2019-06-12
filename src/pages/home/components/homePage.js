import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from "../../../store/actions/home";

// 绑定 store 和 组件
@connect(({ HomeReducer }) => ({
  count: HomeReducer.count,
  homeInfo: HomeReducer.homeInfo,
}), (dispatch) =>
  bindActionCreators({
    add: actions.add,
    getHomeInfo: actions.getHomeInfo,
  }, dispatch)
)
export default class HomePage extends Component{
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  componentDidMount(){
    this.props.getHomeInfo(1);

    // this.props.dispatch(actions.getHomeInfo(1));
  }

  // React16中的错误处理
  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
    });

    // 在这里可以做异常的上报
    console.log('错误:', error, info)
  }

  handleClick = () => {
    /**
     * 注意：
     *  count 是通过connect的参数 mapStateToProps 绑定（state对象值）
     *  add 是通过 connect的参数 mapDispatchToProps 绑定（dispatch方法）
     * */
    const { add, count } = this.props;
    add(count + 1);
  }

  render(){
    let { count, homeInfo:{ name, age }} = this.props;
    return (
      <Fragment>
        <p>{count}</p>
        <p>名字：{name} - 年龄：{age}</p>
        <button style={{backgroundColor:'#eee'}} onClick={this.handleClick}>增加</button>
        <Link to='/user'>User</Link>
      </Fragment>
    )
  }
}