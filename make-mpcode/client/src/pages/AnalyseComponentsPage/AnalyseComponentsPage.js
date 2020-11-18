import React from 'react'
import { Col, Form, Pagination, Spinner, Table } from 'react-bootstrap'
import LoadingButton from '../../components/LoadingButton/LoadingButton'
import { postData } from '../../services/request'
import { range } from '../../tools/util'

export default class AnalyseComponentsPage extends React.Component {
  PAGE_SIZE = 10
  originTableList = []
  state = {
    loading: false,
    operateLoading: false,
    tableList: [],
    currentList: [],
    currentPage: 1,
    pages: [],
  }
  analyseComponents = () => {
    this.setState({
      loading: true,
    })
    postData('/api/analyse/components').then(res => {
      const { list: tableList } = res.data
      this.originTableList = tableList
      const currentList = tableList.slice(0, 10)
      const size = Math.ceil(tableList.length / this.PAGE_SIZE)
      const pages = range(1, size)
      this.setState({
        tableList,
        currentList,
        pages,
        loading: false,
        currentPage: 1,
      })
    })
  }
  queryByPage = (e) => {
    const pageNum = e.target.dataset.page
    const { tableList } = this.state
    const begin = (+pageNum - 1) * this.PAGE_SIZE
    const end = begin + this.PAGE_SIZE
    const currentList = tableList.slice(begin, end)
    this.setState({
      currentPage: +pageNum,
      currentList,
    })
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
            <LoadingButton className="mr10" loading={loading} onClick={this.analyseComponents}>开始分析</LoadingButton>
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
            {this.state.loading ?
            <tr>
              <td colSpan="6" className="text-center">
                <Spinner animation="border" variant="primary" role="status">
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </td>
            </tr>
            :
            this.state.currentList.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.page}</td>
                <td>{item.directory}</td>
                <td>{item.component}</td>
                <td>{item.componentPath}</td>
                <td>{item.used}</td>
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