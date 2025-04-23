import { useState } from 'react';
import './App.css';
import BitwiseControl from './components/BitwiseControl';
import CodePointDisplay from './components/CodePointDisplay';
import NotesPanel from './components/NotesPanel';

function App() {
  const [bitwiseValue, setBitwiseValue] = useState(0);

  return (
    <div className="flex flex-col h-screen">
      <div className="w-screen bg-gray-200 p-8 border-amber-500 border-2">
        <h1 className="text-3xl font-bold">UTF-8 Playground</h1>
      </div>
      <div className="flex flex-1 border-yellow-500 border-2 p-3">

        <CodePointDisplay
          className="w-8/10 bg-gray-100 p-4 border-blue-500 border-2 container flex-col flex"
          codePoint={bitwiseValue} />

        <NotesPanel className="w-2/10 bg-gray-200 p-8 border-red-500 border-2" />
      </div>

      <BitwiseControl className="p-8 border-2 border-red-500 flex-col flex" value={bitwiseValue} onChange={setBitwiseValue} />
    </div>
  );
}

export default App
