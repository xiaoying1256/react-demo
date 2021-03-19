import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

class SquareOld extends React.Component {
  render () {
    return (
      <button 
        className="square"
        onClick={ () => this.props.onClick() }
        >{this.props.value}</button>
    )
  }
}

// 将上面的写成一个函数组件，不需要继承React.Component的类
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i) } />;
  }

  render () {
    return (
      <div>
        <div>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {squares: Array(9).fill(null)}
      ],
      isNext: true,
      stepNum: 0,
    }
  }

  handelClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1 ];
    const squares = current.squares.slice();         // 克隆副本，不改变原始数组
    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.isNext ? 'X' : 'O';
    this.setState(
      {
        history: history.concat([{
          squares: squares
        }]),
        stepNum: history.length,
        isNext: !this.state.isNext
      }
    )
  }

  jumpTo(step) {
    this.setState({
      stepNum: step,
      isNext: (step %2 ) === 0
    })
  }

  render () {
    const history = this.state.history;
    const current = history[this.state.stepNum];             // 应该是表示当前的步骤
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? `下一步 ${move}` : '开始游戏';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = `井字棋游戏: ${this.state.isNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handelClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for(let i in lines) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a]
    }
  }
  return null;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
