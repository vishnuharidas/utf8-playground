import { useEffect, useState } from 'react';
import './App.css';
import BitwiseControl from './components/BitwiseControl';
import CodePointDisplay from './components/CodePointDisplay';
import Header from './components/Header';
import NotesPanel from './components/NotesPanel';
import { getRandomUtf8 } from './utf8/utf8';

function App() {

  const defaultValue = 0b0000_0000_0000_1000_0000_1000_0000_1000_0000; // 4 bytes, with control bits for 2nd, 3rd, and 4th bytes enabled.

  const [bitwiseValue, setBitwiseValue] = useState(defaultValue);

  function reset() {
    setBitwiseValue(defaultValue);
  }

  function random() {
    setBitwiseValue(getRandomUtf8().code);
  }

  useEffect(() => {
    // Pick a random character on first load
    random();
  }, []);

  return (
    <div className="flex flex-col h-screen">

      { /* Header */}
      <header className="w-full bg-gray-200">
        <Header />
      </header>

      { /* Main Content */}
      <div className="w-full flex flex-1 flex-column min-h-[60vh] border-yellow-500 border-">

        <CodePointDisplay
          className="flex-grow bg-gray-100 p-4 border-gray-400 border-3 container flex-col flex"
          codePoint={bitwiseValue} />

        <NotesPanel
          className="w-2/5 bg-gray-300 p-8"
          onClick={(code) => setBitwiseValue(code)}
        />
      </div>

      { /* Footer */}
      <footer className="w-full bg-gray-100 p-8 border-2 border-gray-300">
        <BitwiseControl
          className="bg-gray-100"
          value={bitwiseValue}
          onChange={setBitwiseValue}
          onReset={reset}
          onRandom={random}
        />
      </footer>

    </div>
  );
}

export default App
