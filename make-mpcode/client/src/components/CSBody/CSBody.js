import { Route, Switch } from 'react-router-dom'
import BuildPreviewPage from '../../pages/BuildPreviewPage/BuildPreviewPage'

export default function CSBody() {
  return (
    <main role="main" className="py-md-3 pl-md-5 bd-content">
      <Switch>
        <Route path="/" exact>
          <div>
            <h3>自动化构建微信小程序服务</h3>
            <h6>项目：微信小程序商城组件库</h6>
            <h6>
              项目地址：
              <a href="https://github.com/csonchen/wx-mall-components" target="_">
                https://github.com/csonchen/wx-mall-components
              </a>
            </h6>
          </div>
        </Route>
        <Route path="/build/preview">
          <BuildPreviewPage />
        </Route>
        <Route path="/analyse/image">
          <div>images</div>
        </Route>
        <Route path="/analyse/component">
          <div>components...</div>
        </Route>
      </Switch>
    </main>
  )
}