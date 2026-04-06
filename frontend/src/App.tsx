import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import SlideNotice from './components/SlideNotice';
import { AppRoutes } from './Routes';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
       
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer webContent={null} />
      </div>
    </Router>
  );
}

export default App;