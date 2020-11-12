import React from 'react'
import { Button, Col, Form } from 'react-bootstrap'
import './styles/bootstrap.mini.css';
import './App.css';

export default class App extends React.Component {
  state = {
    previewCodeImg: ''
  }

  buildPreviewCode = () => {
    fetch('/api/preview')
      .then(res => res.json())
      .then(res => {
        const { previewImg } = res.data
        this.setState({
          previewCodeImg: previewImg,
        })
      })  
  }

  render() {
    return (
      <div>
        <h3>自动化构建微信小程序服务</h3>
        <br />
        <Form.Group>
          <Form.Row className="form-item">
            <Form.Label column lg={2}>
              小程序appid
            </Form.Label>
            <Col>
              <Form.Control type="text" placeholder="Normal text" />
            </Col>
          </Form.Row>
          <Form.Row className="form-item">
            <Form.Label column lg={2}>
              AppScret
            </Form.Label>
            <Col>
              <Form.Control type="text" placeholder="Normal text" />
            </Col>
          </Form.Row>
          <Form.Row className="form-item">
            <Form.Label column lg={2}>
              页面地址
            </Form.Label>
            <Col>
              <Form.Control type="text" placeholder="Normal text" />
            </Col>
          </Form.Row>                
        </Form.Group>
  
        <Button variant="primary" onClick={this.buildPreviewCode}>点击构建并生成预览码</Button>
        {this.state.previewCodeImg &&
        <img className="mpCodeImg" src={this.state.previewCodeImg} alt="" />
        }
      </div>
    )
  }
}
