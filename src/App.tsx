import { useEffect, useState } from 'react';
import './App.css';
import BitwiseControl from './components/BitwiseControl';
import CodePointDisplay from './components/CodePointDisplay';
import Header from './components/Header';
import NotesPanel from './components/NotesPanel';
import { codePointToUtf8Int, getRandomUtf8Int } from './utf8/utf8';

function App() {

  const defaultValue = 0b0000_0000_0000_1000_0000_1000_0000_1000_0000; // 4 bytes, with control bits for 2nd, 3rd, and 4th bytes enabled.

  const [bitwiseValue, setBitwiseValue] = useState(defaultValue);

  function reset() {
    setBitwiseValue(defaultValue);
  }

  function random() {
    setBitwiseValue(getRandomUtf8Int());
  }

  useEffect(() => {

    // If the URL has "/codepoint" format, then use that codepoint. Else, pick a random codepoint.
    const url = window.location.href;
    const codepointMatch = url.match(/\/([0-9A-Fa-f]{1,8})/);

    const utf8int = codepointMatch ? codePointToUtf8Int(codepointMatch[1]) : null;
    setBitwiseValue(utf8int ?? getRandomUtf8Int());

  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[auto_1fr_auto] md:h-screen">

      { /* Header */}
      <header className="col-span-1 md:col-span-3 w-full bg-gray-200">
        <Header />
      </header>

      <CodePointDisplay
        className="col-span-1 md:col-span-2 bg-gray-100 p-4 border-3 border-gray-400 flex flex-col"
        codePoint={bitwiseValue} />

      <NotesPanel
        className="col-span-1 bg-gray-300 p-8 md:order-none order-last"
        onClick={(code) => {
          setBitwiseValue(code);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      { /* Footer */}
      <footer className="col-span-1 md:col-span-3 w-full bg-gray-100 p-4 md:p-8 border-2 border-gray-300">
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
