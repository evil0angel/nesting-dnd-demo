import React from 'react'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'

import Lesson from './Lesson'
import AddLesson from './AddLesson'

const containerStyle = {
  marginBottom: '0.5rem',
  cursor: 'move',
}

const chapterStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  backgroundColor: 'white',
  cursor: 'move',
  fontWeight: 'bold'
}

const chapterSource = {
  beginDrag (props) {
    return {
      id: props.id,
      index: props.index,
    }
  }
}

const chapterTarget = {
  hover(props, monitor, component) {
    if (!component) {
      return null
    }
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
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
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }
    // Time to actually perform the action
    props.moveChapter(dragIndex, hoverIndex)
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
  }
}

class Chapter extends React.Component {

  render () {
    const { 
      text,
      index,
      lessons,
      moveLesson,
      isDragging,
      connectDragSource,
      connectDropTarget
    } = this.props
    const opacity = isDragging ? 0.2 : 1
    return connectDragSource(
      connectDropTarget(
        <div style={Object.assign({}, containerStyle, { opacity })}>
          <div style={chapterStyle}>第{index + 1}章 {text}</div>
          {
            lessons ? lessons.map((item, i) => (
              <Lesson
                key={`l_${item.id}`}
                index={i}
                parentIndex={index}
                id={`l_${item.id}`}
                text={item.text}
                moveLesson={moveLesson} />
            )) : null
          }
          <AddLesson 
            index={lessons ? lessons.length : 0}
            parentIndex={index}
            id={`l_${index}_add`}
            moveLesson={moveLesson} >
            + 添加新课程
          </AddLesson>
        </div>
        
      )
    )
  }
}

export default DropTarget(ItemTypes.Chapter, chapterTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(
  DragSource(ItemTypes.Chapter, chapterSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(Chapter)
)