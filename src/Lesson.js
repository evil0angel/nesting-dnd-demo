import React from 'react'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'

const lessonStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginTop: '.5rem',
  marginLeft: '1rem',
  backgroundColor: 'white',
  cursor: 'move'
}

const lessonSource = {
  beginDrag (props) {
    return {
      id: props.id,
      index: props.index,
      parentIndex: props.parentIndex
    }
  },
  isDragging(props, monitor) {
    return monitor.getItem().id === props.id;
  }
}

const lessonTarget = {
  hover(props, monitor, component) {
    if (!component) {
      return null
    }
    const dragIndex = monitor.getItem().index
    const dragParentIndex = monitor.getItem().parentIndex
    const hoverIndex = props.index
    const hoverParentIndex = props.parentIndex
    // Don't replace items with themselves
    if (dragParentIndex === hoverParentIndex && dragIndex === hoverIndex) {
      return
    }
    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2 
    // Determine mouse position
    const clientOffset = monitor.getClientOffset()
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (dragParentIndex <= hoverParentIndex && dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }
    // Dragging upwards
    if (dragParentIndex >= hoverParentIndex && dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }
    // Time to actually perform the action
    props.moveLesson(dragIndex, dragParentIndex, hoverIndex, hoverParentIndex)
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
    monitor.getItem().parentIndex = hoverParentIndex
  }
}

class Lesson extends React.Component {

  render () {
    const { 
      text,
      index,
      isDragging,
      connectDragSource,
      connectDropTarget
    } = this.props
    const opacity = isDragging ? 0.2 : 1
    return connectDragSource(
      connectDropTarget(
        <div style={Object.assign({}, lessonStyle, { opacity })}>课时 {index + 1}： {text}</div>
      )
    )
  }
}

export default DropTarget(ItemTypes.Lesson, lessonTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))(
  DragSource(ItemTypes.Lesson, lessonSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(Lesson)
)