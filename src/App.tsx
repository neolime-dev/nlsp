import Clock from "./components/Clock"
//import Handler from "./components/Handler"
//import Form from "./components/Form"
import SearchHandler from "./components/SearchHandler"
import Sugester from "./components/Sugester"

function App() {
    return (
    <div className="App">
      <Clock /> 
      {/* 
      <Form />
      <Handler /> 
      */}
      <SearchHandler />
      <Sugester />
    </div>

  )
}

export default App