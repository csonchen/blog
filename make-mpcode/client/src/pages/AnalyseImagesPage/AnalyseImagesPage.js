import React from 'react'
import { Table, Form, Col, Pagination, Spinner, DropdownButton, Dropdown } from 'react-bootstrap'
import LoadingButton from '../../components/LoadingButton/LoadingButton'
import { postData } from '../../services/request'
import { range } from '../../tools/util'

export default class AnalyseImagesPage extends React.Component {
  PAGE_SIZE = 10
  originImgList = [] // 初始请求接口的列表数据
  state = {
    loading: false,
    imgList: [],
    currentList: [],
    currentPage: 1,
    pages: [],
    filterTitle: '全部',
    operateLoading: false,
  }
  analyseImgs = () => {
    this.setState({
      loading: true,
    })
    postData('/api/analyse/images').then(res => {
      const { list: imgList } = res.data
      this.originImgList = imgList
      const currentList = imgList.slice(0, 10)
      const size = Math.ceil(imgList.length / this.PAGE_SIZE)
      const pages = range(1, size)
      this.setState({
        imgList,
        currentList,
        pages,
        loading: false,
        currentPage: 1,
        filterTitle: '全部'
      })
    })
  }
  exportCSVFile = () => {
    this.setState({
      operateLoading: true,
    })
    postData('/api/analyse/imagesExport').then(res => {
      this.setState({
        operateLoading: false,
      })
      const { file } = res.data
      window.open(file)
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
  filterOptions = (e) => {
    const { status, title } = e.target.dataset

    if (typeof status === 'undefined' && typeof title === 'undefined') return

    const filterList = status === "" ? this.originImgList : this.originImgList.filter(item => item.status === +status)
    const currentList = filterList.slice(0, 10)
    const size = Math.ceil(filterList.length / this.PAGE_SIZE)
    const pages = range(1, size)
    this.setState({
      filterTitle: title,
      imgList: filterList,
      currentList,
      pages,
      currentPage: 1,
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
            <LoadingButton className="mr10" loading={loading} onClick={this.analyseImgs}>开始分析</LoadingButton>
            <LoadingButton loading={operateLoading} onClick={this.exportCSVFile}>导出</LoadingButton>
          </div>
        </Form.Group>
        <Form.Group>
          <Form.Row className="align-items-center">
            <Col>
              <DropdownButton id="dropdown-basic-button" title={this.state.filterTitle} onClick={this.filterOptions}>
                <Dropdown.Item data-status="" data-title="全部">全部</Dropdown.Item>
                <Dropdown.Item data-status="1" data-title="用到">用到</Dropdown.Item>
                <Dropdown.Item data-status="0" data-title="没有用到">没有用到</Dropdown.Item>
              </DropdownButton>
            </Col>
          </Form.Row>
        </Form.Group>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>序号</th>
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
                <td>{item.id}</td>
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