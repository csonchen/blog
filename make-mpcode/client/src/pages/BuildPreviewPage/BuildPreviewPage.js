import React from 'react'
import { Button, Col, Form, Spinner } from 'react-bootstrap'
import { postData } from '../../services/request';
import './BuildPreviewPage.css';

export default class BuildPreviewPage extends React.Component {
  pagePath = 'pages/index/index'
  searchQuery = ''

  state = {
    isLoading: false,
    previewCodeImg: '',
    selectPages: [],
  }

  componentDidMount() {
    this.fetchAllPages()
  }
  /**
   * 获取小程序项目的所有页面
   */
  fetchAllPages = () => {
    postData('/api/getAppPages').then(res => {
      const { pages } = res.data
      this.setState({
        selectPages: pages,
      })
    })
  }
  buildPreviewCode = () => {
    this.setState({ isLoading: true })

    // 请求生成预览码接口
    postData('/api/preview', {
      method: 'POST',
      params: {
        pagePath: this.pagePath,
        searchQuery: this.searchQuery,
      }
    }).then(res => {
      const { previewImg } = res.data
      this.setState({
        isLoading: false,
        previewCodeImg: previewImg,
      })
    })
  }
  onPagePathChange = (e) => {
    const value = e.target.value
    this.pagePath = value
  }
  onQueryChange = (e) => {
    const value = e.target.value
    this.searchQuery = value
  }
  render() {
    const { isLoading, previewCodeImg } = this.state

    return (
      <div>
        <h3>自动化构建微信小程序服务</h3>
        <h6>项目：微信小程序商城组件库</h6>
        <h6>
          项目地址：
          <a href="https://github.com/csonchen/wx-mall-components" target="_">
            https://github.com/csonchen/wx-mall-components
          </a>
        </h6>
        <br />
        <Form.Group>
          <Form.Row className="form-item">
            <Form.Label column lg={1}>
              启动页面
            </Form.Label>
            <Col>
              <Form.Control list="pages" type="text" placeholder="如：pages/index/index" onChange={this.onPagePathChange} />
              <datalist id="pages">
                {this.state.selectPages.map((item, index) => (
                <option key={index}>{item}</option>
                ))}
              </datalist>
            </Col>
          </Form.Row>
          <Form.Row className="form-item">
            <Form.Label column lg={1}>
              启动参数
            </Form.Label>
            <Col>
              <Form.Control type="text" placeholder="如：name=sam&age=18" onChange={this.onQueryChange}/>
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
