import Navbar from "./components/Navbar/Navbar.js"
import HomeBanner from "./components/Carousel/SlideBanner.js"
import LeftNavBar from "./components/SideBar/SideBar.js";

import "./App.css";


function App() {
  return (
    <div className="appContainer">
      <Navbar />
      <HomeBanner />
      <LeftNavBar />
      {/* <h1>Hello World - CardEx</h1> */}
    </div>
  );
}

export default App;
