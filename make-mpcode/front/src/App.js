import { Button, Col, Form } from 'react-bootstrap'
import './styles/bootstrap.mini.css';
import './App.css';

function App() {
  return (
    <div>
      <h3>生成小程序服务</h3>
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

      <Button variant="primary">点击生成小程序码</Button>
    </div>
  )
}

export default App;
