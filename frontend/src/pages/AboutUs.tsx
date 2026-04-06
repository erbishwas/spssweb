import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    navigate('/joinus');
  };

  const handleEngineeringClick = () => {
    navigate('/engineering');
  };

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
     
      
      <main className="dark:bg-gray-900">
        {/* Introduction Section */}
        <section className="text-gray-600 dark:text-gray-300 body-font">
          <div className="container mx-auto flex px-5 py-5 md:flex-row flex-col items-center">
            <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-blue-600 dark:text-blue-400">
                Introduction
              </h1>
              <p className=" text-sm md:text-base mb-8 leading-relaxed">
                Shree Pashupati Technical Secondary School, established in 2019 B.S. in Bahradashi 3, Jhapa district, offers education from nursery to grade 12, including Computer Engineering from class 9 to 12. Led by Principal Mr. Thir Kumar Dahal and Vice Principal Mr. Gunanidhi Luitel, the school operates from 10 am to 4 pm (9:15 am to 4:45 pm for coaching classes). With nearly 50 staff and 1000 students, the campus provides a peaceful environment, including a large football ground and well-equipped classrooms. Basic facilities such as clean water, separate washrooms, and support for girls during periods are ensured. The school emphasizes practical learning, incorporating labs for computer, physics, chemistry, network, and electric experiments. Extracurricular activities like singing, dancing, quizzes, speeches, and essay writing are organized, contributing to the overall growth of obedient and polite students.
              </p>
              <div className="flex justify-center">
                <button 
                  onClick={handleEngineeringClick}
                  className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg dark:bg-indigo-600 dark:hover:bg-indigo-700"
                >
                  Engineering Course
                </button>
                <button 
                  onClick={handleJoinClick}
                  className="ml-4 inline-flex text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-lg"
                >
                  Join Us
                </button>
              </div>
            </div>
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
              <img 
                className="object-cover object-center rounded" 
                alt="join us" 
                src={`${import.meta.env.VITE_IMAGE_URL}/facilities/feature.jpeg`}
              />
            </div>
          </div>
        </section>

        {/* Principal Message Section */}
        <section className="text-gray-600 dark:text-gray-300 body-font">
          <div className="container px-5 py-5 mx-auto flex flex-col">
            <div className="lg:w-4/6 mx-auto">
              <div className="flex flex-col sm:flex-row mt-10">
                <div className="sm:w-1/3 text-center sm:pr-8 sm:py-8">
                  <div className="w-30 h-30 rounded-full inline-flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-400">
                    <img 
                      src={`${import.meta.env.VITE_IMAGE_URL}/message_from/principal.jpg`} 
                      alt="Principal Thir Kumar Dahal" 
                    />
                  </div>
                  <div className="flex flex-col items-center text-center justify-center">
                    <h2 className="font-medium title-font mt-4 text-gray-900 dark:text-white text-lg">Mr. Thir Kumar Dahal</h2>
                    <div className="w-12 h-1 bg-indigo-500 rounded mt-2 mb-4"></div>
                    <p className="text-base">Message From Principal</p>
                    <p className="text-base">Phone no: 9844640316</p>
                  </div>
                </div>
                <div className="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 dark:border-gray-700 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 text-center sm:text-left">
                  <p className=" text-sm md:text-base leading-relaxed text-lg mb-4">
                    I'm really excited to be the Principal at Shree Pashupati Technical Secondary School. Thanks to the Pashupati Management team for trusting me with this role. We're committed to giving top-notch education that inspires our students to love learning and become valuable members of society. Our goal is to help each student reach their full potential. Parents, feel free to drop by anytime to chat about your child's education. We're building a fantastic learning community here, where everyone is dedicated to excellence. I'm here to lead the school with energy and passion to help us achieve our goals. Looking forward to a great journey together!
                  </p>
                  <a 
                    href="/staffs"
                    className="cursor-pointer text-indigo-500 dark:text-indigo-400 inline-flex items-center"
                  >
                    Navigate to Management Committee
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vice Principal and Coordinator Section */}
        <section className="text-gray-600 dark:text-gray-300 body-font">
          <div className="container px-5 py-24 mx-auto flex flex-wrap">
            <div className="flex flex-wrap -m-4">
              {/* Vice Principal */}
              <div className="p-4 lg:w-1/2 md:w-full">
                <div className="flex border-2 rounded-lg border-gray-200 dark:border-gray-700 border-opacity-50 p-8 sm:flex-row flex-col">
                  <div className="w-24 h-24 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-gray-700 text-indigo-500 flex-shrink-0">
                    <img 
                      src={`${import.meta.env.VITE_IMAGE_URL}/message_from/vice.jpg`} 
                      alt="Vice Principal Guna Nidhi Luitel"
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-gray-900 dark:text-white text-lg title-font font-medium mb-3">
                      Message From Vice Principal
                    </h2>
                    <h2 className="font-medium title-font mt-4 text-blue-500 dark:text-blue-400 text-base">
                      Mr. Guna Nidhi Luitel
                    </h2>
                    <p className="leading-relaxed text-base ">
                      Welcome to the heart of innovation and learning in Computer Engineering at Pashupati. Our program blends cutting-edge curriculum with hands-on experience, preparing students to thrive in the ever-evolving tech industry. From foundational theory to practical application, we empower our students to innovate and succeed in diverse fields such as software development, embedded systems, and beyond.
                    </p>
                    <div className="flex flex-col">
                      <div className="w-12 h-1 bg-indigo-500 rounded mt-4 mb-4"></div>
                      <p className="text-base">Phone no: 9852674447</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Coordinator */}
              <div className="p-4 lg:w-1/2 md:w-full">
                <div className="flex border-2 rounded-lg border-gray-200 dark:border-gray-700 border-opacity-50 p-8 sm:flex-row flex-col">
                  <div className="w-24 h-24 sm:mr-8 sm:mb-0 mb-4 inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-gray-700 text-indigo-500 flex-shrink-0">
                    <img 
                      src={`${import.meta.env.VITE_IMAGE_URL}/message_from/coordinator.jpg`} 
                      alt="Coordinator Bishwas Niraula"
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-gray-900 dark:text-white text-lg title-font font-medium mb-3">
                      Computer Engineering Program Coordinator
                    </h2>
                    <h2 className="font-medium title-font mt-4 text-blue-500 dark:text-blue-400 text-base">
                      Er. Bishwas Niraula
                    </h2>
                    <p className="leading-relaxed text-base ">
                      "Welcome to the Computer Engineering Program at Shree Pashupati Secondary School! Our program offers the latest facilities and cutting-edge technology, ensuring you have access to the best resources. Our expert faculty, who are industry leaders and dedicated educators, are committed to providing you with a top-notch education. With strong industry connections, you'll benefit from internships and partnerships with leading tech companies. Our program also emphasizes innovative research, allowing you to engage in groundbreaking projects. Additionally, we offer comprehensive support through academic advising and career services to guide you every step of the way. Join us to become part of a community passionate about technology and innovation, and prepare for a successful career in the tech industry."
                    </p>
                    <div className="flex flex-col">
                      <div className="w-12 h-1 bg-indigo-500 rounded mt-4 mb-4"></div>
                      <p className="text-base">Phone no: 9844651107</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rules and Regulations */}
        <section className="text-gray-600 dark:text-gray-300 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center mb-10">
              <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-blue-600 dark:text-blue-400 mb-4">
                Rules and regulations
              </h1>
              <p className=" text-sm md:text-base text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                Our school rules focus on being polite, using common sense, and staying safe. We expect everyone to behave well and dress appropriately. If students don't follow these rules or struggle with their work, we address it seriously.
              </p>
            </div>
            <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
              {[
                "Be prepared for class each day",
                "Be on time for school",
                "Follow the teacher's directions the first time they are given",
                "Be polite to the teacher and your classmates",
                "Help keep the school environment clean and tidy",
                "Have a good attitude",
                "Complete homework and assignments on time",
                "Respect other student's personal belongings",
                "Treat others the way you want to be treated",
                "Always use your inside voice. (No yelling)"
              ].map((rule, index) => (
                <div key={index} className="p-2 sm:w-1/2 w-full">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded flex p-4 h-full items-center">
                    <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                      strokeWidth="3" className="text-indigo-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                      <path d="M22 4L12 14.01l-3-3"></path>
                    </svg>
                    <span className="text-sm md:text-base title-font font-medium dark:text-gray-300">{rule}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section id="courses" className="text-gray-600 dark:text-gray-300 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="text-center mb-10">
              <h1 className="sm:text-3xl text-2xl font-medium text-center title-font text-blue-600 dark:text-blue-400 mb-4">
                Our Courses
              </h1>
              <p className=" text-sm md:text-base text-base leading-relaxed xl:w-2/4 lg:w-3/4 mx-auto">
                Shree Pashupati Technical Secondary School offers courses from nursery to grade 12, including specialized Computer Engineering classes (grades 9-12). Our emphasis on practical learning is evident in well-equipped labs for computer, physics, chemistry, network, and electric studies. We prioritize innovation with digital learning, CCTV-equipped classrooms, and activities to enhance writing and public speaking skills.
              </p>
            </div>
            <div className="flex flex-wrap -mx-4 -mb-10 text-center">
              {/* Computer Engineering */}
              <div className="sm:w-1/2 mb-10 px-4">
                <div className="rounded-lg h-64 overflow-hidden">
                  <img 
                    alt="Computer Engineering" 
                    className="object-cover object-center h-full w-full"
                    src={`${import.meta.env.VITE_IMAGE_URL}/courses/coe.jpg`}
                  />
                </div>
                <h2 className="title-font text-2xl font-medium text-gray-900 dark:text-white mt-6 mb-3">
                  Computer Engineering (9-12)
                </h2>
                <p className=" text-sm md:text-base leading-relaxed text-base">
                  The Curriculum Development Centre (CDC) of Nepal offers a four-year specialized Computer Engineering course that starts from grade 9 and ends in grade 12. This program is designed to provide students with foundational knowledge and practical skills in computer engineering. The curriculum includes core academic subjects such as English, Nepali, Mathematics, Physics, and Chemistry, alongside technical subjects like Computer Programming, Digital Logic Design, Computer Networks, Database Management Systems, Microprocessor and Assembly Language, Web Technology, and Computer Hardware and Maintenance. The course involves a combination of internal assessments and final examinations to evaluate students' progress. Upon completion, students are well-prepared for further studies in computer science, IT, or engineering, and entry-level positions in IT support, network administration, or software development.
                </p>
              </div>
              
              {/* General Stream */}
              <div className="sm:w-1/2 mb-10 px-4">
                <div className="rounded-lg h-64 overflow-hidden">
                  <img 
                    alt="General Stream" 
                    className="object-cover object-center h-full w-full"
                    src={`${import.meta.env.VITE_IMAGE_URL}/courses/gensn10.jpeg`}
                  />
                </div>
                <h2 className="title-font text-2xl font-medium text-gray-900 dark:text-white mt-6 mb-3">
                  General Stream (Nursery to 10) English and Nepali medium
                </h2>
                <p className=" text-sm md:text-base leading-relaxed text-base">
                  Our General Stream program, designed for students from Nursery to Grade 10, offers a well-rounded education in both English and Nepali mediums. Following the Curriculum Development Centre (CDC) curriculum, we emphasize academic excellence, bilingual proficiency, and the comprehensive development of each student. With a focus on fostering intellectual, social, and emotional growth, our experienced faculty are dedicated to creating a nurturing and dynamic learning environment that prepares students for future success and responsible citizenship.
                </p>
              </div>
              
              {/* General Stream 11/12 */}
              <div className="sm:w-1/2 mb-10 px-4">
                <div className="rounded-lg h-64 overflow-hidden">
                  <img 
                    alt="General Stream 11/12" 
                    className="object-cover object-center h-full w-full"
                    src={`${import.meta.env.VITE_IMAGE_URL}/courses/gens1112.jpeg`}
                  />
                </div>
                <h2 className="title-font text-2xl font-medium text-gray-900 dark:text-white mt-6 mb-3">
                  General Stream 11/12 (English and Nepali medium)
                </h2>
                <p className=" text-sm md:text-base leading-relaxed text-base">
                  Our General Stream program for Grades 11 and 12 provides specialized morning classes in Education and Management, with the Management stream featuring attractive subjects such as Computer Science. Following the rigorous standards of the Curriculum Development Centre (CDC), this program ensures a comprehensive education that equips students with the necessary skills and knowledge for higher education and successful careers. Our dedicated faculty and thoughtfully designed curriculum focus on academic excellence, practical skills, and overall development, preparing students for the challenges and opportunities of the future.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="text-gray-600 dark:text-gray-300 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-wrap w-full mb-20">
              <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900 dark:text-white">
                  Our Facilities
                </h1>
                <div className="h-1 w-20 bg-indigo-500 rounded"></div>
              </div>
              <p className=" text-sm md:text-base lg:w-1/2 w-full leading-relaxed text-gray-500 dark:text-gray-400">
                At Pashupati Secondary School, we take pride in providing state-of-the-art facilities that support our students' academic and personal growth. Our campus is equipped with modern amenities designed to create an optimal learning environment. From advanced laboratories to a well-stocked library, our facilities are tailored to meet the diverse needs of our students and prepare them for future challenges.
              </p>
            </div>
            <div className="flex flex-wrap -m-4">
              {[
                {
                  title: "Computer Lab",
                  image: "computer_lab.jpg",
                  description: "Our computer lab is equipped with the latest hardware and software, providing students with the resources they need to excel in today's digital world. The lab is designed to accommodate a variety of courses, from basic computer skills to advanced programming and software development. With high-speed internet access and modern workstations, students can engage in interactive learning, complete projects, and conduct research efficiently."
                },
                {
                  title: "Physics and Chemistry Lab",
                  image: "physics_lab.jpeg",
                  description: "Our physics and chemistry labs are outfitted with advanced equipment and materials, enabling students to conduct experiments and explore scientific concepts hands-on. These labs provide a safe and controlled environment where students can engage in practical applications of their theoretical knowledge. Under the guidance of experienced instructors, students perform experiments that enhance their understanding of scientific principles and foster a deeper interest in the sciences."
                },
                {
                  title: "Electrical and Electronics Lab",
                  image: "electronics_lab.jpeg",
                  description: "The electrical and electronics lab at Pashupati Secondary School offers students the opportunity to explore the fascinating world of circuitry, electronics, and electrical engineering. Equipped with modern instruments and components, the lab allows students to design and build their own projects, conduct experiments, and understand the practical applications of electronic theories. This hands-on experience is invaluable for students interested in pursuing careers in engineering and technology."
                },
                {
                  title: "Computer Network and Repair & Maintenance Lab",
                  image: "network_lab.jpeg",
                  description: "Our computer network and repair & maintenance lab is designed to provide students with practical skills in networking and computer hardware. The lab includes a range of networking equipment, tools for hardware repair, and simulation software for network configuration. Students learn to set up and troubleshoot networks, repair and maintain computers, and gain insights into the workings of various hardware components. This practical training is essential for students aiming for careers in IT and technical support."
                },
                {
                  title: "Library",
                  image: "library_lab.jpg",
                  description: "Our library is a hub of knowledge and learning, offering a quiet and comfortable space for students to study, read, and conduct research. The library is stocked with a wide range of books, including textbooks, reference materials, fiction, and non-fiction titles. In addition to physical books, we provide access to digital resources and online databases, ensuring that students have the information they need at their fingertips. Our knowledgeable library staff is always available to assist students in finding the right resources and making the most of their library experience."
                }
              ].map((facility, index) => (
                <div key={index} className="xl:w-1/4 md:w-1/2 p-4">
                  <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
                    <img 
                      className="h-40 rounded w-full object-cover object-center mb-6" 
                      src={`${import.meta.env.VITE_IMAGE_URL}/facilities/${facility.image}`} 
                      alt={facility.title}
                    />
                    <h2 className="text-lg text-gray-900 dark:text-white font-medium title-font mb-4">
                      {facility.title}
                    </h2>
                    <p className="text-sm md:text-base leading-relaxed text-base  dark:text-gray-300">
                      {facility.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
};

export default AboutUs;