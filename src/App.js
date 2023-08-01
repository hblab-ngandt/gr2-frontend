import './App.css';
import NavBar from './components/NavBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="">
      <NavBar />
      <ToastContainer />
    </div>
  );
}

export default App;
