import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './sagas'

// import { createLogger } from 'redux-logger'
// import { Router, Route, hashHistory } from 'react-router'

// class Square extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             value: null,
//         }
//     }
//
//     render() {
//         return (
//             <button className="square" onClick={() => this.props.onClick()}>
//                 {this.props.value}
//             </button>
//         );
//     }
// }

function Square(props) {
    return (
        <button className="square" onClick={() => props.onClick()}>
            {props.value}
        </button>
    );

}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
            'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                {/*<ShoppingList name="Mark" />,*/}
            </div>
        );
    }
}

class ShoppingList extends React.Component {
    render() {
        return (
            <div className="shopping-list">
                <h1>Shopping List for {this.props.name}</h1>
                <ul>
                    <li>Instagram</li>
                    <li>WhatsApp</li>
                    <li>Oculus</li>
                </ul>
            </div>
        );
    }
}

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
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}


// ========================================

// ReactDOM.render(
//     <div>
//         <Game />
//         <ShoppingList name="Simon"/>
//     </div>,
//     document.getElementById('root')
// );


class ProductCategoryRow extends React.Component {
    render() {
        const category = this.props.category;
        return (
            <tr>
                <th colSpan="2">
                    {category}
                </th>
            </tr>
        );
    }
}

class ProductRow extends React.Component {
    render() {
        const product = this.props.product;
        const name = product.stocked ?
            <td>{product.name} </td> :
            <td style={{color: 'red'}}>{product.name}</td>;

        return (
            <tr>
                {name}
                <td>{product.price}</td>
            </tr>
        );
    }
}

class ProductTable extends React.Component {
    render() {
        const filterText = this.props.filterText;
        const inStockOnly = this.props.inStockOnly;

        const rows = [];
        let lastCategory = null;

        this.props.products.forEach((product) => {
            if (product.name.indexOf(filterText) === -1) {
                return;
            }
            if (inStockOnly && !product.stocked) {
                return;
            }
            if (product.category !== lastCategory) {
                rows.push(
                    <ProductCategoryRow
                        category={product.category}
                        key={product.category}/>
                );
            }
            rows.push(
                <ProductRow
                    product={product}
                    key={product.name}
                />
            );
            lastCategory = product.category;
        });

        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Price</th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </table>
        );
    }
}

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleInStockChange = this.handleInStockChange.bind(this);
    }

    handleFilterTextChange(e) {
        this.props.onFilterTextChange(e.target.value);
    }

    handleInStockChange(e) {
        this.props.onInStockChange(e.target.checked);
    }

    render() {
        const filterText = this.props.filterText;
        const inStockOnly = this.props.inStockOnly;
        return (
            <form>
                <input
                    type="text"
                    placeholder="Search..."
                    value={filterText}
                    onChange={this.handleFilterTextChange}
                />
                <p>
                    <input
                        type="checkbox"
                        checked={inStockOnly}
                        onChange={this.handleInStockChange}
                    />
                    {' '}
                    Only show products in stock
                </p>
            </form>
        );
    }
}

class FilterableProductTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            inStockOnly: false
        };
        this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
        this.handleInStockChange = this.handleInStockChange.bind(this);
    }

    componentDidMount() {

    }

    componentWillMount() {

    }

    handleFilterTextChange(filterText) {
        this.setState({
            filterText: filterText
        });
    }

    handleInStockChange(inStockOnly) {
        this.setState({
            inStockOnly: inStockOnly
        })
    }

    render() {
        return (
            <div>
                <SearchBar
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                    onFilterTextChange={this.handleFilterTextChange}
                    onInStockChange={this.handleInStockChange}
                />
                <ProductTable
                    products={this.props.products}
                    filterText={this.state.filterText}
                    inStockOnly={this.state.inStockOnly}
                />
            </div>
        );
    }
}


const PRODUCTS = [
    {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
    {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
    {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
    {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
    {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
    {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
];

// ReactDOM.render(
//     <FilterableProductTable products={PRODUCTS} />,
//     document.getElementById('root')
// );

// ReactDOM.render(
//     <div>
//         <Game />
//         <ShoppingList name="Simon"/>
//     </div>,
//     document.getElementById('root')
// );

// ReactDOM.render(
//     <Router history={hashHistory}>
//         <Route path='/' component={FilterableProductTable} />
//     </Router>,
//     document.getElementById('root')
// );


// const Counter = ({value, onIncrement, onDecrement}) => (
//     <div>
//         <h1>{value}</h1>
//         <button onClick={onIncrement}>+</button>
//         <button onClick={onDecrement}>-</button>
//     </div>
// );

class Counter extends React.Component {

    constructor() {
        super();
        this.state = {
            val: 0
        }
    }

    componentDidMount() {
        this.setState(
            {val: this.state.val + 1}
        )

        console.log(this.state.val)

        this.setState(
            {val: this.state.val + 3}
        )
        console.log(this.state.val)

        this.setState(
            {val: this.state.val + 1}
        )
        console.log(this.state.val)

        this.setState(
            {val: this.state.val + 2}
        )
        console.log(this.state.val)

        this.setState(
            {val: this.state.val + 1}
        )
        console.log(this.state.val)

        setTimeout(() => {
            this.setState(
                {val: this.state.val + 1}
            )
            console.log(this.state.val)
        }, 0)

        setTimeout(() => {
            this.setState(
                {val: this.state.val + 1}
            )
            console.log(this.state.val)
        }, 0)
    }

    render() {
        const { value, onIncrement, onDecrement } = this.props;
        return (
            <div>
                <h1>{value}</h1>
                <button onClick={onIncrement}>+</button>
                <button onClick={onDecrement}>-</button>
                <button onClick={this.clicked}>dispatch</button>
            </div>);
    }

    clicked() {
        console.log('clocked')
    }
}

const reducer = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + action.val;
        case 'DECREMENT':
            return state - action.val;
        default:
            return state;
    }
};


const counterReducer  = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1
        case 'INCREMENT_IF_ODD':
            return (state % 2 !== 0) ? state + 1 : state
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}


// const logger = createLogger();
const sagaMiddleware = createSagaMiddleware()


const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga)

const render = () => {
    ReactDOM.render(
        <div>
            {/*<Counter*/}
                {/*value={store.getState()}*/}
                {/*onIncrement={() => store.dispatch({type: 'INCREMENT', val: 2})}*/}
                {/*onDecrement={() => store.dispatch({type: 'DECREMENT', val: 1})}*/}
            {/*/>*/}
            <Counter
                value={store.getState()}
                onIncrement={() => store.dispatch({type: 'INCREMENT_IF_ODD', val: 2})}
                onDecrement={() => store.dispatch({type: 'INCREMENT_ASYNC', val: 1})}
            />
        </div>,

        document.getElementById('root')
    );
};

render();
store.subscribe(render);
