import React from 'react'
import ReactDOM from 'react-dom'
import createReactClass from 'create-react-class'
import $ from 'jquery'
import './App.css'

var Note = createReactClass({
  getInitialState(){
    return {
      editing: false,
      pos: {
        x: this.randomBetween(0, window.innerWidth / 3 - 150, 'px'),
        y: this.randomBetween(0, window.innerHeight - 150, 'px')
      },
      dragging: false,
      rel: null // position relative to the cursor
    }
  },
  componentWillMount() {
    this.style = {
      left: this.state.pos.x,
      top: this.state.pos.y
    }
  },
  componentDidUpdate: function (props, state) {
    if (this.state.dragging && !state.dragging) {
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    } else if (!this.state.dragging && state.dragging) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    }
    this.style = {
      left: this.state.pos.x,
      top: this.state.pos.y
    }

    if(this.state.editing) {
      this.refs.newText.focus()
      this.refs.newText.select()
    }
  },
  // performance optimization
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.children !== nextProps.children || this.state !== nextState
  },
  randomBetween(x, y, s) {
    return (x + Math.ceil(Math.random() * (y-x))) + s
  },
  edit() {
    this.setState({editing: true})
  },
  save() {
    this.props.onChange(this.refs.newText.value, this.props.id)
    this.setState({editing: false})
  },
  remove() {
    this.props.onRemove(this.props.id)
  },
  renderForm(){
    return (
      <div className="note"
           style={this.style}
           onMouseDown={this.onMouseDown}>
        <textarea ref="newText" defaultValue={this.props.children}></textarea>
        <button onClick={this.save} className="edit-save">Save</button>
      </div>
    )
  },
  renderDisplay(){
    return (
      <div className="note"
           style={this.style}
           onMouseDown={this.onMouseDown}>
        <p>{this.props.children}</p>
        <span>
          <button onClick={this.edit}>EDIT</button>
          <button onClick={this.remove}>X</button>
        </span>
      </div>
    )
  },
  // calculate relative position to the mouse and set dragging=true
  onMouseDown: function (e) {
    // only left mouse button
    if (e.button !== 0) return
    var pos = $(ReactDOM.findDOMNode(this)).offset()
    this.setState({
      dragging: true,
      rel: {
        x: e.pageX - pos.left,
        y: e.pageY - pos.top
      }
    })
  },
  onMouseUp: function (e) {
    this.setState({dragging: false})
  },
  onMouseMove: function (e) {
    if (!this.state.dragging) return
    this.setState({
      pos: {
        x: e.pageX - this.state.rel.x,
        y: e.pageY - this.state.rel.y
      }
    })
  },
  render(){
    return (this.state.editing) ? this.renderForm() : this.renderDisplay()
  }
})

export default Note
