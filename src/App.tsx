import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Listbox } from './widgets/Listbox';

const options = ['Option 1', 'Option 2', 'Option 3'];

function App() {
  return (
    <div className="App">
      <Listbox options={options}/>
    </div>
  );
}

export default App;
