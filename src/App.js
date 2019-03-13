import React, { Component } from 'react';
import './App.css';

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
import update from 'immutability-helper'

import Chapter from './Chapter'

const style = {
  padding: '1rem'
}

const chapterStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  backgroundColor: 'white',
  cursor: 'move',
  fontWeight: 'bold'
}

class App extends Component {
  state = {
    data: [
      {
        id: 1,
        text: 'Write a cool JS library',
        children: [
          {
            id: 10,
            text: 'AAAA'
          },
          {
            id: 11,
            text: 'BBBB'
          },
          {
            id: 12,
            text: 'CCCC'
          }
        ]
      },
      {
        id: 2,
        text: 'Make it generic enough',
        children: []
      },
      {
        id: 3,
        text: 'Write README',
        children: [
          {
            id: 30,
            text: 'DDDDD'
          },
          {
            id: 31,
            text: 'EEEEE'
          },
          {
            id: 32,
            text: 'FFFFF'
          }
        ]
      },
      {
        id: 4,
        text: 'Create some examples',
        children: []
      },
      {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
        children: []
      },
      {
        id: 6,
        text: '???',
        children: []
      },
      {
        id: 7,
        text: 'PROFIT',
        children: []
      },
    ]
  }
  
  handleMoveChapter = (dragIndex, hoverIndex) => {
    const data = this.state.data
    const dragItem = data[dragIndex]
    const newData = update(data, {
      $splice: [[dragIndex, 1], [hoverIndex, 0, dragItem]]
    })
    this.setState({data: newData})
  }

  handleMoveLesson = (dragIndex, dragParentIndex, hoverIndex, hoverParentIndex) => {
    const data = this.state.data
    const dragItem = data[dragParentIndex].children[dragIndex]
    const dragData = update(data, {
      [dragParentIndex]: {
        children: { $splice: [[dragIndex, 1]] }
      }
    })
    const dropData = update(dragData, {
      [hoverParentIndex]: {
        children: { $splice: [[hoverIndex, 0, dragItem]] }
      }
    })
    this.setState({data: dropData})
  }  

  render() {
    return (
      <div style={style}>
        { 
          this.state.data.map((item, i) => (
            <Chapter
              key={`c_${item.id}`}
              index={i}
              id={`c_${item.id}`}
              text={item.text}
              lessons={item.children}
              moveChapter={this.handleMoveChapter}
              moveLesson={this.handleMoveLesson} />
          )) 
        }
        <div style={chapterStyle}>+ 添加新章节</div>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
