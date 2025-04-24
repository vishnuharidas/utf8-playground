import { useState } from 'react';
import './App.css';
import BitwiseControl from './components/BitwiseControl';
import CodePointDisplay from './components/CodePointDisplay';
import NotesPanel from './components/NotesPanel';

function App() {
  const [bitwiseValue, setBitwiseValue] = useState(0);

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
      <div className="w-full flex flex-1 flex-column min-h-[60vh] border-yellow-500 border-2 p-3">

        <CodePointDisplay
          className="flex-grow bg-gray-100 p-4 border-blue-500 border-2 container flex-col flex"
          codePoint={bitwiseValue} />

        <NotesPanel className="w-2/5 bg-gray-200 p-8" />
      </div>

      { /* Footer */}
      <footer className="w-full bg-gray-100 p-8 border-2 border-gray-300">
        <BitwiseControl className="bg-gray-100" value={bitwiseValue} onChange={setBitwiseValue} />
      </footer>

    </div>
  );
}

export default App
