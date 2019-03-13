import React from 'react'
import { DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'

const addLessonStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginTop: '.5rem',
  marginLeft: '1rem',
  backgroundColor: 'white'
}

const addLessonTarget = {
  canDrop (props, monitor) {
    console.log(props.parentIndex, monitor.getItem().parentIndex, props.index)
    return props.parentIndex !== monitor.getItem().parentIndex && props.index === 0
  },
  drop (props, monitor) {
    const dragIndex = monitor.getItem().index
    const dragParentIndex = monitor.getItem().parentIndex
    const hoverIndex = props.index
    const hoverParentIndex = props.parentIndex
    // Don't replace items with themselves
    if (dragParentIndex === hoverParentIndex && dragIndex === hoverIndex) {
      return
    }
    // // Time to actually perform the action
    props.moveLesson(dragIndex, dragParentIndex, hoverIndex, hoverParentIndex)
    // // Note: we're mutating the monitor item here!
    // // Generally it's better to avoid mutations,
    // // but it's good here for the sake of performance
    // // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
    monitor.getItem().parentIndex = hoverParentIndex
  }
}

class AddLesson extends React.Component {

  render () {
    const { 
      children,
      isOver,
      // isCanDrop,
      connectDropTarget
    } = this.props
    return connectDropTarget(
      <div style={addLessonStyle} className={isOver ? 'insert' : ''}>{ children }</div>
    )
  }
}

export default DropTarget(ItemTypes.Lesson, addLessonTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isCanDrop: monitor.canDrop(),
}))(AddLesson)