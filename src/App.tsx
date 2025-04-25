import { useEffect, useState } from 'react';
import './App.css';
import BitwiseControl from './components/BitwiseControl';
import CodePointDisplay from './components/CodePointDisplay';
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
      <div className="w-full box-border p-4 bg-gray-200">
        <h1 className="text-3xl font-bold">UTF-8 Playground</h1>
        <p className="text-gray-600">
          This is a playground for exploring UTF-8 encoding.
          UTF-8 encoding uses 4 bytes to represent Unicode characters. Read more about UTF-8 <a href="https://en.wikipedia.org/wiki/UTF-8#Description" className="text-blue-500 underline" target='_blank'>here</a>.
        </p>
      </div>

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
