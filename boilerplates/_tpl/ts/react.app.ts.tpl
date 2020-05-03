import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './App.%suffix%';

const App = () => {
    return (
        <div className="app">
            <h1 className="title">Hello Tex App</h1>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
