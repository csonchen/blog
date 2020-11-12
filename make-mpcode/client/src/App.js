import React from 'react'
import { Button, Col, Form, Spinner } from 'react-bootstrap'
import './styles/bootstrap.mini.css';
import './App.css';

export default class App extends React.Component {
  state = {
    isLoading: false,
    previewCodeImg: ''
  }

  buildPreviewCode = () => {
    this.setState({ isLoading: true })
    fetch('/api/preview')
      .then(res => res.json())
      .then(res => {
        const { previewImg } = res.data
        this.setState({
          isLoading: false,
          previewCodeImg: previewImg,
        })
      })  
  }

  render() {
    const { isLoading, previewCodeImg } = this.state

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
  
        <div className="flexMiddle">
          <Button 
            className="flexMiddle"
            variant="primary" 
            onClick={!isLoading ? this.buildPreviewCode : null}
            disabled={isLoading}
          >
            {isLoading && 
            <Spinner className="spinBtn" as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
            }
            <span>点击构建并生成预览码</span>
          </Button>

          {previewCodeImg &&
          <img className="mpCodeImg" src={previewCodeImg} alt="" />
          }
        </div>

      </div>
    )
  }
}
