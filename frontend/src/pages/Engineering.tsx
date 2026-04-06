import React from 'react';

const Engineering: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <section className="text-gray-600 dark:text-gray-300 body-font">
        <div className="container px-5 py-10 mx-auto flex flex-wrap">
          <div className="flex flex-wrap -mx-4 mt-auto mb-auto lg:w-1/2 sm:w-2/3 content-start sm:pr-10">
            <div className="w-full sm:p-4 px-4 mb-6">
              <h1 className="title-font font-bold text-xl mb-2 text-blue-900 dark:text-blue-400">
                Computer Engineering
              </h1>
              <div className="leading-relaxed ">
                Computer Engineering is a dynamic field that integrates the principles
                of electrical engineering and computer science to develop and design computer systems and
                software. It encompasses both the creation of hardware and the development of software, ensuring
                that they work together seamlessly. Imagine it as a perfect symphony where hardware and software
                are the musicians playing in harmony to create amazing technological solutions.

                On the hardware side, computer engineers dive into the nitty-gritty of circuits,
                microprocessors, and embedded systems. They design and optimize everything from tiny microchips
                in your smartphone to massive data servers powering the internet. Think of them as the Doraemon
                gadgets makers, always inventing something cool!
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 sm:w-1/3 w-full rounded-lg overflow-hidden mt-6 sm:mt-0">
            <img
              className="object-cover object-center w-full h-full"
              src={`${import.meta.env.VITE_IMAGE_URL}/Carousel/engineering.jpg`}
              alt="Computer Engineering"
            />
          </div>

          <div className="container px-5 mx-auto">
            <h1 className="my-4 text-2xl font-bold leading-none tracking-tight text-blue-600 dark:text-blue-400">
              Scope Of Computer Engineering
            </h1>

            <div className="ml-0">
              <dl className="text-gray-700 dark:text-gray-300 list-disc pl-5 mb-10">
                <dt className="mt-4 font-bold text-gray-900 dark:text-white">Hardware Design and Development</dt>
                <dd className="">Creating and optimizing computer hardware, including designing microprocessors, circuit boards, memory devices, and peripheral equipment, focusing on performance, energy efficiency, and reliability.</dd>

                <dt className="mt-4 font-bold text-gray-900 dark:text-white">Software Engineering</dt>
                <dd className="">Developing, testing, and maintaining software applications and systems, ranging from operating systems and databases to mobile apps and enterprise software solutions.</dd>

                <dt className="mt-4 font-bold text-gray-900 dark:text-white">Embedded Systems</dt>
                <dd className="">Designing and programming embedded systems found in devices such as smartphones, medical equipment, industrial machines, and consumer electronics, ensuring they meet specific functionality and performance criteria.</dd>

                <dt className="mt-4 font-bold text-gray-900 dark:text-white">Networking and Telecommunications</dt>
                <dd className="">Building and managing network infrastructure and communication systems, including local area networks (LANs), wide area networks (WANs), and wireless networks, to ensure reliable and secure data transmission.</dd>

                <dt className="mt-4 font-bold text-gray-900 dark:text-white">Cybersecurity</dt>
                <dd className="">Protecting systems and data from cyber threats by developing secure computing environments, implementing encryption, and designing robust defense mechanisms against malware, phishing, and other cyber attacks.</dd>

                <dt className="mt-4 font-bold text-gray-900 dark:text-white">Artificial Intelligence and Machine Learning</dt>
                <dd className="">Creating intelligent systems capable of learning and adapting, applied in fields like robotics, data analysis, natural language processing, and autonomous systems.</dd>

                <dt className="mt-4 font-bold text-gray-900 dark:text-white">Data Science and Big Data</dt>
                <dd className="">Analyzing large sets of data to extract meaningful insights, utilizing statistical methods, machine learning algorithms, and data visualization techniques to inform decision-making and strategic planning.</dd>

                <dt className="mt-4 font-bold text-gray-900 dark:text-white">IoT (Internet of Things)</dt>
                <dd className="">Developing interconnected devices that communicate and share data, enhancing automation and smart technologies in homes, cities, industries, and healthcare.</dd>

                <dt className="mt-4 font-bold text-gray-900 dark:text-white">Research and Development</dt>
                <dd className="">Innovating new technologies and contributing to advancements in computing and electronics, including quantum computing, nanotechnology, and bioinformatics.</dd>

                <dt className="mt-4 font-bold text-gray-900 dark:text-white">Education and Training</dt>
                <dd className="">Teaching and mentoring the next generation of engineers and computer scientists, developing curricula, and conducting workshops and seminars to disseminate knowledge and skills in computer engineering.</dd>
              </dl>
            </div>
          </div>

          <div className="w-full">
            <h1 className="mt-20 mb-4 text-2xl font-bold leading-none tracking-tight text-blue-600 dark:text-blue-400">
              Who is eligible to study computer engineering in our school?
            </h1>
            <p className=" text-base font-normal text-gray-900 dark:text-gray-300">
              Eligibility for studying computer engineering at Pashupati Technical School requires at least the completion of Grade 8 with a strong foundation in mathematics and science. Prospective students should demonstrate a keen interest in technology, problem-solving skills, and a positive attitude towards learning. The program is tailored for those who are dedicated to continuous learning and have a passion for understanding and applying concepts in computer hardware, software development, and system integration. This blend of academic preparedness and enthusiasm for technology equips students to thrive in the dynamic field of computer engineering.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg mt-6 transition-colors duration-300">
        <h2 className="text-2xl text-blue-600 dark:text-blue-400 font-bold mb-4">
          The subjects to be studied in the computer engineering course at Pashupati Technical School
        </h2>

        <section id="first-year" className="mb-8">
          <h2 className="text-2xl text-blue-600 dark:text-blue-400 font-bold mb-4">At Grade 09 & 10</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <thead className="bg-blue-800 text-white dark:bg-indigo-600">
                <tr>
                  <th className="w-1/3 py-3 px-4 uppercase font-semibold text-sm text-left">At Grade 9</th>
                  <th className="w-1/3 py-3 px-4 uppercase font-semibold text-sm text-left">At Grade 10</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Programming principal & concept in C Language</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Data structure & OOP concept using C++</td>
                </tr>
                <tr className="bg-blue-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Fundamentals of Electro-System (FES)</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Digital Design & Microprocessor</td>
                </tr>
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Web Page Development (WPD)</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Computer Hardware, Electronics Repair & Maintenance (CRM)</td>
                </tr>
                <tr className="bg-blue-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Fundamentals of Computer and Application (FCA)</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Database Management System (DBMS)</td>
                </tr>
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">English</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">English</td>
                </tr>
                <tr className="bg-blue-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Nepali</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Nepali</td>
                </tr>
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Math</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Math</td>
                </tr>
                <tr className="bg-blue-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Optional Math</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Optional Math</td>
                </tr>
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Science</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Science</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-right">
            <a
              href="http://lib.moecdc.gov.np/elibrary/?r=9997"
              className="bg-blue-600 dark:bg-indigo-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors duration-300"
            >
              Download Syllabus
            </a>
          </div>
        </section>
      </main>

      <main className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg mt-6 mb-10 transition-colors duration-300">
        <section id="first-year" className="mb-8">
          <h2 className="text-2xl text-blue-600 dark:text-blue-400 font-bold mb-4">At Grade 11 & 12</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <thead className="bg-blue-800 text-white dark:bg-indigo-600">
                <tr>
                  <th className="w-1/3 py-3 px-4 uppercase font-semibold text-sm text-left">At Grade 11</th>
                  <th className="w-1/3 py-3 px-4 uppercase font-semibold text-sm text-left">At Grade 12</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Programming in Java</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Visual Programming</td>
                </tr>
                <tr className="bg-blue-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Computer Organization & Architecture (COA)</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Computer Network (CN)</td>
                </tr>
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Operating System (OS)</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Contemporary Technology (CT)</td>
                </tr>
                <tr className="bg-blue-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Web & Mobile Application Development (W&M)</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Software Engineering and Project (SEP)</td>
                </tr>
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">English</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">English</td>
                </tr>
                <tr className="bg-blue-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Nepali</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Social</td>
                </tr>
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Math</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Math</td>
                </tr>
                <tr className="bg-blue-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Physics</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Physics</td>
                </tr>
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700">
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Chemistry</td>
                  <td className="w-1/3 py-3 px-4 border-b border-gray-200 dark:border-gray-700">Chemistry</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-right">
            <a
              href="http://lib.moecdc.gov.np/elibrary/?r=9868"
              className="bg-blue-600 dark:bg-indigo-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-indigo-700 transition-colors duration-300"
            >
              Download Syllabus
            </a>
          </div>
        </section>
      </main>

      <div className="container px-5 mb-0 mx-auto flex flex-wrap">
        <h1 className="mt-10 mb-4 text-2xl font-bold leading-none tracking-tight text-blue-600 dark:text-blue-400">
          Career Paths After Completing This Course
        </h1>
        <p className="mb-4 text-gray-900 dark:text-gray-300">After completing the computer engineering course at Pashupati Technical School, graduates can pursue various career paths:</p>
        <ul className="list-disc pl-5 text-gray-900 dark:text-gray-300">
          <li className="mt-4">
            <strong className="text-gray-900 dark:text-white">Further Education:</strong> Pursue advanced studies in computer engineering, electrical engineering, computer science, or related fields at universities or technical institutes.
          </li>
          <li className="mt-4">
            <strong className="text-gray-900 dark:text-white">Employment Opportunities:</strong> Secure positions in entry level in various industries such as:
            <ul className="list-disc pl-5 mt-2">
              <li>Software Development</li>
              <li>Systems Analysis</li>
              <li>Network Administration</li>
              <li>Cybersecurity</li>
              <li>Web Development</li>
              <li>Database Management</li>
              <li>IT Support</li>
              <li>Embedded Systems Engineering</li>
            </ul>
          </li>
          <li className="mt-4">
            <strong className="text-gray-900 dark:text-white">Government Jobs:</strong> Apply for many positions in Nepalese government sectors that require computer engineering expertise.
          </li>
          <li className="mt-4">
            <strong className="text-gray-900 dark:text-white">Entrepreneurship:</strong> Start their own tech-related business, offering services in software development, IT consulting, or system integration.
          </li>
          <li className="mt-4">
            <strong className="text-gray-900 dark:text-white">Specialization:</strong> Obtain certifications in specialized areas like artificial intelligence, cloud computing, or cybersecurity to enhance career prospects and skills.
          </li>
          <li className="mt-4 mb-4">
            <strong className="text-gray-900 dark:text-white">Research and Development:</strong> Engage in research projects at tech companies or academic institutions, contributing to innovations in computing technology.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Engineering;