import "./App.css";

import { createStore, Provider } from "jotai";
import MainPage from "./components/MainPage";

const myStore = createStore();

function App() {
  return (
    <Provider store={myStore}>
      <MainPage />
    </Provider>
  );
}

export default App;
