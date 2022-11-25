import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  //output from esbuild
  const [code, setCode] = useState('');

  //initialize esbuild
  const startService = async() => {
    ref.current = await esbuild.startService({
      worker: true,
      //public directory
      wasmURL: '/esbuild.wasm'
    });
  }

  useEffect(() => {
    startService();
  }, []);

  const onClick = async() => {
    if(!ref.current){
      return;
    }
    const result = await ref.current.transform(input, {
      // what kind of code
      loader: 'jsx',
      target: 'es2015'
    });
    setCode(result.code);
  }

  return(
  <div>
    <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
    <div>
      <button onClick={onClick}>Submit</button>
    </div>
    <pre>{code}</pre>
  </div>)
};

const rootEl = document.getElementById('root') as HTMLDivElement;
const root = createRoot(rootEl);
root.render(<App />);