import React from 'react'
import { Pagination, Spinner, Table } from 'react-bootstrap'

const AutoTable = (props) => {
  const { heads, loading, pages } = props || {}
  return (
    <>
      <Table striped bordered hover>
        {(heads && heads.length > 0) &&
        <thead>
          <tr>
            {heads.map((item, index) => (
              <th key={index}>{item}</th>
            ))}
          </tr>
        </thead>
        }
        <thody>
          {loading ?
          <tr>
            <td colSpane={heads.length} className="text-center">
              <Spinner animation="border" variant="primary" role="status">
                <span className="sr-only">加载中...</span>
              </Spinner>
            </td>
          </tr>
          :
          props.children
          }
        </thody>
      </Table>
      <div className="flex-end">
        <Pagination>
        {pages.map((page, index) => (
          <Pagination.Item
            key={index}
            data-page={page}
          >{page}</Pagination.Item>
        ))}
        </Pagination>
      </div>
    </>
  )
} 

export default AutoTable