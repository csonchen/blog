import { Route, Switch } from 'react-router-dom'
import BuildPreviewPage from '../../pages/BuildPreviewPage/BuildPreviewPage'

export default function CSBody() {
  return (
    <main role="main" className="py-md-3 pl-md-5 bd-content">
      <Switch>
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