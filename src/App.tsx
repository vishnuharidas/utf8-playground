import { useState } from 'react';
import './App.css';
import BitwiseControl from './components/BitwiseControl';

function App() {
  const [bitwiseValue, setBitwiseValue] = useState(0);

  return (
    <div className="flex flex-col h-screen">
      <div className="w-screen bg-gray-200 p-8 border-amber-500 border-2">
        <h1 className="text-3xl font-bold">UTF-8 Playground</h1>
      </div>
      <div className="flex flex-1 border-yellow-500 border-2 p-3">

        <div className="w-8/10 bg-gray-100 p-4 border-blue-500 border-2 container flex-col flex">
          <h2 className="text-xl font-semibold">Code Point</h2>
          <p className='text-3xl font-mono'>U+{bitwiseValue.toString(16).padStart(8, '0').toUpperCase()}</p>
          <div className='text-[10vw] border-dashed border-2 w-full h-full flex items-center justify-center'>
            {String.fromCharCode(bitwiseValue)}
          </div>
        </div>

        <div className="w-2/10 bg-gray-200 p-8 border-red-500 border-2">
          <h2 className="text-xl font-semibold">Notes</h2>
          <p>Notes to be added.</p>
        </div>
      </div>

      <BitwiseControl className="p-8 border-2 border-red-500 flex-col flex" value={bitwiseValue} onChange={setBitwiseValue} />
    </div>
  );
}

export default App
