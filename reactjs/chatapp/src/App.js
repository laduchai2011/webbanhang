import './App.css';
import { Route, Routes } from 'react-router-dom';

import WebChat from './component/WebChat';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path='/webChat/:id' element={<WebChat />} />
      </Routes>
    </div>
  );
}

export default App;
