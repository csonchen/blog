import React from 'react'
import { Table, Form, Col, Button, Pagination, Spinner } from 'react-bootstrap'
import { postData } from '../../services/request'

export default class AnalyseImagesPage extends React.Component {
  state = {
    loading: false,
    imgList: [],
  }
  analyseImgs = () => {
    this.setState({
      loading: true,
    })
    postData('/api/analyse/images').then(res => {
      const { list: imgList } = res.data
      this.setState({
        imgList,
        loading: false,
      })
    })
  }
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
            <Button className="mr10" onClick={this.analyseImgs}>开始分析</Button>
            <Button>导出</Button>
          </div>
        </Form.Group>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>图片</th>
              <th>路径</th>
            </tr>
          </thead>
          <tbody>
            {this.state.loading ?
            <tr>
              <td colSpan="3" className="text-center">
                <Spinner animation="border" variant="primary" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </td>
            </tr>
            :
            this.state.imgList.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.image}</td>
                <td>{item.existPath}</td>
              </tr>
            ))
            }
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