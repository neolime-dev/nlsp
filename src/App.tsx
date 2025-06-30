import { useState } from 'react';
import Clock from "./components/Clock";
import SearchHandler from "./components/SearchHandler";
import Sugester from "./components/Sugester";

function App() {
  const [showHelp, setShowHelp] = useState(false);

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div className="App">
      <Clock onToggleHelp={toggleHelp} />
      <SearchHandler />
      <Sugester />
    </div>
  );
}

export default App;