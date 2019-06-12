import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import * as actions from "../../store/actions/home";

@connect(({ HomeReducer }) => ({
    count: HomeReducer.count,
    homeInfo: HomeReducer.homeInfo,
  }), (dispatch) =>
    bindActionCreators({
        add: actions.add,
        getHomeInfo: actions.getHomeInfo
      },
      dispatch)
)
export default class UserPage extends Component {
  componentDidMount() {
    const { count, homeInfo } = this.props;
    console.log(count, homeInfo);
  }
  handerClick() {
    const { count, add } = this.props;
    add(count + 1);
  }
  render() {
    let { count } = this.props;
    return (
      <Fragment>
        <p>{count}</p>
        <Link to="/">home</Link>
        <ul>
          {[1, 2, 3, 4, 5, 6].map((item, index) => (
            <li key={index}>aabdddb{item}</li>
          ))}
        </ul>
        <button onClick={this.handerClick}>add</button>
      </Fragment>
    );
  }
}