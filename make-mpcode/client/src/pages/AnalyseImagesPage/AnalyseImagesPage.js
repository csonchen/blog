import React from 'react'
import { Table, Form, Col, Button, Pagination } from 'react-bootstrap'

export default class AnalyseImagesPage extends React.Component {
  render() {
    return (
      <div>
        <Form.Group>
          <Form.Row className="form-item justify-content-md-center">
            <Form.Label column lg={1}>主包</Form.Label>
            <Col>
              <Form.Control type="text" placeholder="" />
            </Col>
          </Form.Row>

          <div className="flex-end">
            <Button className="mr10">开始分析</Button>
            <Button>导出</Button>
          </div>
        </Form.Group>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>名称</th>
              <th>路径</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Otto</td>
              <td>Otto</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Jacob</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan="2">Larry the Bird</td>
            </tr>
          </tbody>
        </Table>
        <div className="flex-end">
          <Pagination>
            <Pagination.Item active>1</Pagination.Item>
            <Pagination.Item>2</Pagination.Item>
            <Pagination.Item>3</Pagination.Item>
          </Pagination>
        </div>
      </div>
    )
  }
}