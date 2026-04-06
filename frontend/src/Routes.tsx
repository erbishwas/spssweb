import { Routes, Route } from 'react-router-dom';
import Engineering from './pages/Engineering';
//import Notice from './pages/Notice';
//import Extras from './pages/Extras';
// import Contact from './pages/Contact';
 import AboutUs from './pages/AboutUs';
import Staffs from './pages/Staff';

import StaffProfile from './components/StaffProfile';
import Committee from './pages/ManagementCommittee';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './components/EventDetail';
import Notices from './pages/Notices';
import NoticeDetails from './components/NoticeDetails';
import Routine from './pages/Routine';
import RoutineDetails from './components/RoutineDetails';
import Contact from './pages/Contact';
import AdmissionForm from './pages/JoinUs';
import NotFound from './components/NotFound'; // Optional 404 page
import AttendanceDashboard from './Dashboard/Dashboard';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Home Route */}
      <Route path="/" element={<Home />} />
      
      {/* Main Navigation Routes */}
      <Route path="/engineering" element={<Engineering />} />
      <Route path="/aboutus" element={<AboutUs />} />
     
      <Route path="/staffs" element={<Staffs />} />
      <Route path="/staff/:id" element={<StaffProfile />} />
      <Route path="/committee" element={<Committee />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/notices" element={<Notices />} />
      <Route path="/notices/:id" element={<NoticeDetails />} />
      <Route path="/routines" element={<Routine/>} />
      <Route path="/routine/:id" element={<RoutineDetails />} />
      <Route path="/contact" element={<Contact />} /> 
      <Route path="/joinus" element={<AdmissionForm />} />

      <Route path="/dashboard" element={<AttendanceDashboard />} />
      
      <Route path="*" element={<NotFound />} />
      
     
    </Routes>
  );
};