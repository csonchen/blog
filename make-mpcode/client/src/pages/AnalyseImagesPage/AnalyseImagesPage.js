import React from 'react'
import { Table, Form, Col, Button, Pagination, Spinner } from 'react-bootstrap'
import { postData } from '../../services/request'
import { range } from '../../tools/util'

export default class AnalyseImagesPage extends React.Component {
  PAGE_SIZE = 10
  state = {
    loading: false,
    imgList: [],
    currentList: [],
    currentPage: 1,
    pages: [],
  }
  analyseImgs = () => {
    this.setState({
      loading: true,
    })
    postData('/api/analyse/images').then(res => {
      const { list: imgList } = res.data
      const currentList = imgList.slice(0, 10)
      const size = Math.ceil(imgList.length / this.PAGE_SIZE)
      const pages = range(1, size)
      this.setState({
        imgList,
        currentList,
        pages,
        loading: false,
      })
    })
  }
  queryByPage = (e) => {
    const pageNum = e.target.dataset.page
    const { imgList } = this.state
    const begin = (+pageNum - 1) * this.PAGE_SIZE
    const end = begin + this.PAGE_SIZE
    const currentList = imgList.slice(begin, end)
    this.setState({
      currentPage: +pageNum,
      currentList,
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
            this.state.currentList.map((item, index) => (
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
          <Pagination onClick={this.queryByPage}>
            {this.state.pages.map((page, index) => (
            <Pagination.Item
              data-page={page}
              key={index} 
              active={this.state.currentPage === page}
            >{page}</Pagination.Item>
            ))}
          </Pagination>
        </div>
      </div>
    )
  }
}