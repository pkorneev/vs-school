import "./App.css";

import { createStore, Provider } from "jotai";
import Routing from "./components/Routing";

const myStore = createStore();

function App() {
  return (
    <Provider store={myStore}>
      <Routing />
    </Provider>
  );
}

export default App;
