import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Navbar, Nav, Container, Col, Row } from 'react-bootstrap'
import CSBody from '../../components/CSBody/CSBody'
import CSHeader from '../../components/CSHeader/CSHeader'

export default class IndexPage extends React.Component {
  render() {
    return (
      <Router>
        <Navbar variant="dark" bg="dark" expand="lg">
          <Navbar.Brand href="#home">微信小程序自动化构建服务</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#home"></Nav.Link>
            <Nav.Link href="#home2"></Nav.Link>
            <Nav.Link href="#home3"></Nav.Link>
          </Nav>
        </Navbar>
        <Container fluid>
          <Row>
            <Col className="bg-gray bd-sidebar" md={3} xl={2}>
              <CSHeader />
            </Col>
            <Col>
              <CSBody />
            </Col>
          </Row>
        </Container>
      </Router>
    )
  }
}