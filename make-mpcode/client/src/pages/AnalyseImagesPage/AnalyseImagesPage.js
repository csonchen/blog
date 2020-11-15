import React from 'react'
import { Table, Form, Col } from 'react-bootstrap'

export default class AnalyseImagesPage extends React.Component {
  render() {
    return (
      <div>
        <Form.Group>
          <Form.Row className="form-item justify-content-md-center">
            <Form.Label column lg={1}>分包项目名</Form.Label>
            <Col>
              <Form.Control type="text" placeholder="" />
            </Col>
          </Form.Row>
        </Form.Group>
        <Table></Table>
      </div>
    )
  }
}