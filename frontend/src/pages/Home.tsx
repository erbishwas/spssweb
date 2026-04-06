import React, { useState, useEffect } from 'react';
import SlideNotice from '../components/SlideNotice';
import Carousel from '../components/Carousel';
import FlashModal  from '../components/FlashModal';
import HolidayBanner from '../components/HolidayBanner';
import axios from 'axios';
import '../App.css';

interface FlashNotice {
    id: number;
    title: string;
    message: string;
    image_url: string;
    image: string; 
    trun_flash: string;
}

interface AppWebContent {
    id: number;
    school_name: string;
    description: string;
}

const Home: React.FC = () => {
    const [flashNotice, setFlashNotice] = useState<FlashNotice | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [theme, setTheme] = useState<string>('light');

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_DYNAMIC_URL}/api/flash-notice/`)
            .then(response => {
                setFlashNotice(response.data);
                if (response.data.trun_flash_On) {
                    setIsModalOpen(true);
                }
            })
            .catch(error => console.error('Error fetching flash notice:', error));

        
    }, []);

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        
            <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 font-inter">
                
                
                <main>
                    <SlideNotice />
                    <HolidayBanner />
                    <Carousel />

                    
                    <section className="container mx-auto px-6 py-12 animate-fadeIn">
                        <h1 className="text-3xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                            Shree Pashupati Technical Secondary School
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            We embrace students from diverse faiths, races, and backgrounds, offering enhanced facilities to cater to their
                            educational requirements. As a dynamic and inspiring educational institution, our community school serves as a
                            model for the broader learning community. We uphold the highest standards of education across various
                            specializations, providing excellent teachers, quality support materials, and a welcoming atmosphere to foster
                            skill development in students. Our educational reach extends from nursery to grade 12, including Computer
                            Engineering courses for classes 9 to 12.
                        </p>

                        <h1 className="text-3xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6">
                            Why Pashupati?
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Pashupati Secondary School is dedicated to fostering academic excellence and holistic development. Our institution provides a nurturing environment that encourages students to reach their full potential, both academically and personally. With a blend of traditional values and modern educational practices, we aim to prepare our students to be responsible and successful members of society.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                            {[
                                {
                                    title: 'Highly Qualified Teachers',
                                    description: 'Our team of educators is composed of highly qualified and experienced teachers who are committed to providing personalized attention and a high standard of education. Each teacher brings a wealth of knowledge and a passion for teaching, ensuring that students receive the best possible guidance and support. Regular professional development programs ensure that our teachers stay updated with the latest educational trends and methodologies.',
                                    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
                                },
                                {
                                    title: 'Peaceful Environment',
                                    description: 'Situated in a serene and tranquil setting, Pashupati Secondary School offers a peaceful learning environment that is conducive to focused study and personal growth. The calm and quiet atmosphere helps students to concentrate better, reduce stress, and engage more deeply with their studies. Our campus is designed to provide a safe and secure space where students can learn and grow without distractions.',
                                    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4'
                                },
                                {
                                    title: 'Digital Learning',
                                    description: 'Embracing modern educational tools, our school integrates digital learning into the curriculum. Students have access to state-of-the-art technology, including interactive whiteboards, computer labs, and online resources, which enhance their learning experience and prepare them for a tech-savvy world. Our digital platforms enable students to learn at their own pace, access a wealth of information, and collaborate with peers and teachers online.',
                                    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                },
                                {
                                    title: 'Facility of Development Environments',
                                    description: 'We provide well-equipped facilities that support a variety of developmental activities. Our science labs, computer labs, and sports facilities are designed to offer hands-on learning opportunities and promote physical fitness. These facilities are maintained to the highest standards, ensuring that students can engage in practical experiments, creative projects, and athletic activities that complement their academic studies.',
                                    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
                                },
                                {
                                    title: 'Regular Class Tests and Examinations',
                                    description: 'To monitor and encourage consistent academic progress, we conduct regular class tests and examinations. These assessments help students to stay engaged with their studies, identify areas for improvement, and prepare effectively for final exams. Our structured evaluation system ensures that students receive timely feedback, enabling them to track their progress and achieve their academic goals.',
                                    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z'
                                },
                                {
                                    title: 'Sufficient Infrastructure',
                                    description: 'Our school boasts sufficient infrastructure, including spacious classrooms, well-maintained buildings, and recreational areas. Each classroom is designed to provide a comfortable and conducive learning environment, with ample natural light and ventilation. Our facilities include a library stocked with a wide range of books, a cafeteria that serves nutritious meals, and playgrounds where students can relax and play.',
                                    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
                                },
                                {
                                    title: 'Extra Activities',
                                    description: 'At Pashupati Secondary School, we believe in the importance of a well-rounded education. We offer a variety of extracurricular activities that allow students to explore their interests and develop new skills. Our sports programs include football, volleyball, and athletics, promoting physical health and teamwork. Dance and singing clubs provide creative outlets for students to express themselves and develop their artistic talents. Public speaking and debate societies help students build confidence and enhance their communication skills. These activities not only enhance students\' talents but also teach valuable life skills such as teamwork, leadership, and time management.',
                                    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                }
                            ].map((item, index) => (
                                <div key={index} className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                                    <svg className="w-12 h-12 text-indigo-500 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d={item.icon}></path>
                                    </svg>
                                    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{item.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                                </div>
                            ))}
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6 mt-12 text-center">
                            What Students Say About Us?
                        </h1>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {[
                                {
                                name: 'Miss. Ranjana Adhikari',
                                batch: 'Computer Engineering 2076 Batch',
                                image: `${import.meta.env.VITE_IMAGE_URL}/message_from/ranjana.jpeg`,
                                quote: '"Welcome to Pashupati Secondary School , where learning meets inspiration! Our school is a vibrant community dedicated to academic excellence, creativity, and personal growth. With dedicated educators, modern facilities, and a supportive environment, Pashupati Secondary School empowers students to excel in academics, arts, athletics, and beyond."At Pashupati Secondary School, I\'ve found an incredible environment where learning is exciting and supportive. The teachers are fantastic, always ready to help, and there are so many opportunities to explore my interests. From study to other extra activities like lab experiments & sports , I\'ve made great friends and learned so much. It\'s truly a place where I feel inspired to grow every day! Thank you😊"'
                                },
                                {
                                name: 'Mr. Utsav Niroula',
                                batch: 'Computer Engineering 2076 Batch',
                                image: `${import.meta.env.VITE_IMAGE_URL}/message_from/utsav.jpeg`,
                                quote: '"Hello future students and guardians, I\'m Utsav Niroula, and I studied Computer Engineering from grade 9 to 12 at Pashupati Technical Secondary School. Our school is known for its exceptional education quality and practical approach. The curriculum blends theoretical knowledge with hands-on experience, preparing students for real-world challenges. The highly qualified and dedicated teachers make learning engaging and effective. If you or your child is passionate about technology and looking for a school that equips students with the skills and knowledge for a successful career in the technical field, Pashupati Technical Secondary School is the perfect choice. Thank you."'
                                }
                            ].map((student, index) => (
                                <div
                                key={index}
                                className="flex flex-col sm:flex-row border-2 rounded-xl border-gray-200 dark:border-gray-700 p-8 shadow-md hover:shadow-xl transition-shadow duration-300"
                                >
                                <img
                                    src={student.image}
                                    alt={student.name}
                                    className="w-24 h-24 rounded-full object-cover mb-4 sm:mb-0 sm:mr-8 self-center sm:self-start"
                                />
                                <div>
                                    <h2 className="text-lg font-medium text-blue-500 dark:text-blue-400">{student.name}</h2>
                                    <h3 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-2">{student.batch}</h3>
                                    <p className="text-base text-gray-600 dark:text-gray-300">{student.quote}</p>
                                </div>
                                </div>
                            ))}
                            </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-6 mt-12">
                            Computer Engineering
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            The inaugural batch of Computer Engineering, commencing from class 9, was initiated in the year 2076 B.S.
                            Presently, we conduct regular engineering classes spanning from class 9 to class 12. Computer engineering,
                            situated at the intersection of electrical engineering and computer science, amalgamates various facets of both
                            disciplines essential for the development of computer hardware and software. This field not only employs
                            techniques and principles from electrical engineering and computer science but also encompasses domains like
                            artificial intelligence (AI), robotics, computer networks, computer architecture, and operating systems.
                        </p>
                    </section>
                    {flashNotice && (
                        <FlashModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            notice={flashNotice}
                        />
                    )}
                </main>
                
            </div>
       
    );
};

export default Home;