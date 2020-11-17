import React from 'react'
import { Col, Form, Table } from 'react-bootstrap'
import LoadingButton from '../../components/LoadingButton/LoadingButton'

export default class AnalyseComponentsPage extends React.Component {
  state = {
    loading: false,
    operateLoading: false,
  }
  render() {
    const { loading, operateLoading } = this.state
    return (
      <div>
        <Form.Group>
          <Form.Row className="form-item align-items-center">
            <Form.Label column lg={1}>主包</Form.Label>
            <Col>
              <Form.Control type="text" placeholder="" />
            </Col>
          </Form.Row>

          <div className="flex-end">
            <LoadingButton className="mr10" loading={loading}>开始分析</LoadingButton>
            <LoadingButton loading={operateLoading}>导出</LoadingButton>
          </div>
        </Form.Group>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>序号</th>
              <th>页面</th>
              <th>当前目录</th>
              <th>引入组件</th>
              <th>组件路径</th>
              <th>使用情况</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
              <td>1</td>
            </tr>
          </tbody>
        </Table>
      </div>
    )
  }
}