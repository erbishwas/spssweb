import React from 'react';

interface WebContent {
    id: number;
    content: string;
}

interface FooterProps {
    webContent: WebContent | null;
}

const Footer: React.FC<FooterProps> = ({ webContent }) => {
    const handleMail = () => window.location.href = 'mailto:pashupati.school4012@gmail.com';
    const handleCall = () => window.location.href = 'tel:9804924833';
    const handleLocation = () => window.open('https://maps.google.com/?q=Bahradashi-3,+Jhapa,+Nepal', '_blank');

    return (
        <footer className="bg-[#042c3e] dark:bg-[#03212e] text-gray-300 shadow-inner">
            <div className="container mx-auto px-5 py-10 flex flex-wrap">
                <div className="w-full md:w-1/4 flex-shrink-0 text-center md:text-left">
                    <a href="/" className="flex items-center justify-center md:justify-start">
                        <img src={`${import.meta.env.VITE_IMAGE_URL}/defaults/logo-white.png`} alt="School Logo" className="w-12 h-12 rounded-full" />
                        <span className="ml-3 text-xl text-white">Pashupati Technical School</span>
                    </a>
                    <p className="mt-2 text-sm">
                        Welcome to our school, a vibrant educational hub where diverse backgrounds converge, fostering an
                        enriching and inspiring learning environment.
                    </p>
                </div>
                <div className="w-full md:w-3/4 flex flex-wrap mt-10 md:mt-0">
                    <div className="w-full md:w-1/3 px-4">
                        <h2 className="text-sm font-medium text-white tracking-widest mb-3">COURSES</h2>
                        <nav className="space-y-2">
                            <a href="/engineering" className="block text-sm text-gray-300 hover:text-[#ff9f45] cursor-pointer">Computer Engineering 9-12</a>
                            <a href="/aboutus#courses" className="block text-sm text-gray-300 hover:text-[#ff9f45] cursor-pointer">General Stream (Nursery to 10)</a>
                            <a href="/aboutus#courses" className="block text-sm text-gray-300 hover:text-[#ff9f45] cursor-pointer">General Stream (11/12)</a>
                        </nav>
                    </div>
                    <div className="w-full md:w-1/3 px-4">
                        <h2 className="text-sm font-medium text-white tracking-widest mb-3">USEFUL LINKS</h2>
                        <nav className="space-y-2">
                            <a href="https://moe.gov.np/" target="_blank" className="block text-sm text-gray-300 hover:text-[#ff9f45] cursor-pointer">Ministry of Education</a>
                            <a href="https://www.cdc.gov.np/" target="_blank" className="block text-sm text-gray-300 hover:text-[#ff9f45] cursor-pointer">Curriculum Development Centre</a>
                            <a href="https://www.olenepal.org/e-pustakalaya/" target="_blank" className="block text-sm text-gray-300 hover:text-[#ff9f45] cursor-pointer">E-Pustakalaya</a>
                        </nav>
                    </div>
                    <div className="w-full md:w-1/3 px-4">
                        <h2 className="text-sm font-medium text-white tracking-widest mb-3">CONTACT</h2>
                        <nav className="space-y-2">
                            <a onClick={handleLocation} className="block text-sm text-gray-300 hover:text-[#ff9f45] cursor-pointer">Bahradashi-3, Jhapa Nepal</a>
                            <a onClick={handleCall} className="block text-sm text-gray-300 hover:text-[#ff9f45] cursor-pointer">9804924833</a>
                            <a onClick={handleMail} className="block text-sm text-gray-300 hover:text-[#ff9f45] cursor-pointer break-all">pashupati.school4012@gmail.com</a>
                            <a onClick={handleLocation} className="block text-sm text-gray-300 hover:text-[#ff9f45] cursor-pointer">Shree Pashupati H.S.S/College</a>
                        </nav>
                    </div>
                    
                </div>
            </div>
            <div className="bg-[#03212e] dark:bg-[#021c29]">
                <div className="container mx-auto py-4 px-5 flex flex-wrap items-center">
                    <p className="text-sm text-gray-500 text-center sm:text-left">
                        Copyright © 2023 - {new Date().getFullYear()} All rights reserved by -
                        <a href="https://technicalpashupati.edu.np" target="_blank" className="text-white ml-1 hover:text-[#ff9f45]">
                            Pashupati Technical Secondary School
                        </a>
                    </p>
                    <div className="mt-2 sm:mt-0 sm:ml-auto flex justify-center space-x-4">
                        <a href="#" className="text-gray-500 hover:text-white">
                            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                            </svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-white">
                            <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                            </svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-white">
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
                            </svg>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-white">
                            <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
                                <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                <circle cx="4" cy="4" r="2" stroke="none"></circle>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;