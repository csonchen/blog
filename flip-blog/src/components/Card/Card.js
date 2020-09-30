import React from 'react'
import './Card.css'

const list = Array(6).fill().map((item, index) => ({index}))
let transArr = null
// 0: add 1: delete
let updateStatus = 0
let activeIndex = 100000
let activeList = null
let zIndex = 1

function getArrByLen(len) {
  return Array(len).fill().map(() => [0, 0])
}

export default class Card extends React.Component {
  listRef = React.createRef()

  state = {
    list,
    animateStatus: 0,
  }

  onDelete = (e) => {
    // type: 0 add; 1 delete
    const { type, current } = e.currentTarget.dataset

    updateStatus = +type
    activeIndex = +current

    activeList = Array.prototype.slice.call(this.listRef.current.children)
    const sliceIndex = +current + (+type === 0 ? 0 : 1)
    activeList = activeList.slice(sliceIndex)

    // 增加操作长度+1
    const stepIndex = +type === 0 ? 1 : 0
    transArr = getArrByLen(activeList.length + stepIndex)
    console.log(this.listRef)
    activeList.forEach((item, index) => {
      const rectInfo = item.getBoundingClientRect()
      transArr[index + stepIndex][0] = rectInfo.left
      transArr[index + stepIndex][1] = rectInfo.top
    })

    const newList = this.state.list.filter((item, index) => index !== +current)
    this.setState({
      animateStatus: 1,
      list: newList,
    })
  }

  updateAnimateStatus = () => {
    if (this.state.animateStatus === 1) {
      const stepIndex = updateStatus === 0 ? 1 : 0
      activeList.forEach((itemEle, index) => {
        const rectInfo = itemEle.getBoundingClientRect()
        transArr[index + stepIndex][0] = transArr[index + stepIndex][0] - rectInfo.left
        transArr[index + stepIndex][1] = transArr[index + stepIndex][1] - rectInfo.top
      
        if (transArr[index + stepIndex][1] !== 0) {
          this.state.list.some((v, k) => {
            if (index + stepIndex + activeIndex === k) {
              v.zIndex = zIndex++
              return true
            }
            return false
          })
        }
      })
      
      this.setState({
        animateStatus: 2
      })
    } else if (this.state.animateStatus === 2) {
      transArr = getArrByLen(this.state.list.length)
      setTimeout(() => {
        this.setState({
          animateStatus: 3
        })
      }, 0)
    }
  }

  componentDidUpdate() {
    this.updateAnimateStatus()
  }

  render() {
    return (
      <div>
        <div className="card-list" ref={this.listRef}>
          {this.state.list.map((item, index) => (
          <div 
            key={index}
            className={`card-item ${index >= activeIndex && this.state.animateStatus === 3 ? ' active' : ''}`}
            style={
              Object.assign({ zIndex: item.zIndex || 'auto' }, index >= activeIndex && this.state.animateStatus > 1
                ? {transform: `translate(${transArr[index - activeIndex][0]}px, ${transArr[index - activeIndex][1]}px)`}
                : null)
            }
          >
            <div className="card-head">
              <p className="cd-title">Title {item.index}</p>
              <span className="cd-del" onClick={this.onDelete} data-current={index} data-type={1}>delete</span>
            </div>

            <div className="card-body">
              <p>1. list 1</p>
              <p>2. list 2</p>
              <p>3. list 3</p>
            </div>
          </div>
          ))}
        </div>

        <div>增加按钮</div>
      </div>
    )
  }
}