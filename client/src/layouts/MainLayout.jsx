import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => (
  <div className="min-h-screen overflow-x-hidden">
    <div className="pointer-events-none fixed inset-0 -z-10 bg-grain opacity-90" />
    <div className="pointer-events-none fixed left-[-8rem] top-24 -z-10 h-72 w-72 rounded-full bg-[#bfd7ff]/25 blur-3xl" />
    <div className="pointer-events-none fixed bottom-10 right-[-4rem] -z-10 h-80 w-80 rounded-full bg-clay/30 blur-3xl" />
    <Navbar />
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
