import logo from './logo.svg';
import './App.css';

export default function AppJSX() {
    return (
        <div className="AppJSX">
            <header className="App-header">
                <img src={logo} alt="logo" className="App-logo"/>
                <p>
                    Edit <code>src/App.jsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>
    )
}