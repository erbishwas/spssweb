import React, { useState } from 'react';
import axios from 'axios';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_DYNAMIC_URL}/api/feedback/`, formData);
      setSubmissionStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setSubmissionStatus('error');
      console.error('Error submitting feedback:', err);
    }
  };

  const callschool = () => {
    window.location.href = 'tel:+9844640316';
  };

  const mailschool = () => {
    window.location.href = 'mailto:pashupati.school4012@gmail.com';
  };

  const locationmap = () => {
    window.open('https://maps.google.com?q=26.50724862577117,87.93232633194452', '_blank');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 text-gray-900 dark:text-gray-100">
      <main>
        <section className="body-font">
          <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
              <img 
                className="object-cover object-center rounded-lg shadow-lg" 
                alt="school" 
                src={`${import.meta.env.VITE_IMAGE_URL}/Carousel/slide1.jpg`}
              />
            </div>
            <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
              <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-blue-600 dark:text-blue-400">
                Contact Us
              </h1>
              <p className="mb-8 leading-relaxed text-gray-600 dark:text-gray-300">
                Welcome to Shree Pashupati Technical Secondary School, a hub of dynamic education where diversity
                converges, creating an enriching and inspiring learning environment.
              </p>
              <div className="flex justify-center">
                <button 
                  className="inline-flex bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white border-0 py-2 px-6 focus:outline-none rounded text-lg"
                  onClick={callschool}
                >
                  Call
                </button>
                <button 
                  className="ml-4 inline-flex bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 border-0 py-2 px-6 focus:outline-none rounded text-lg"
                  onClick={mailschool}
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="body-font relative">
          <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
            <div className="lg:w-2/3 md:w-1/2 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative h-96">
              <div className="absolute inset-0">
                <iframe 
                  width="100%" 
                  height="100%" 
                  className="absolute inset-0"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1262.327117486613!2d87.93232633194452!3d26.50724862577117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e5a39a0430f281%3A0x82e603b00673e6f1!2sPashupati%20Secondary%20School!5e0!3m2!1sen!2snp!4v1701879064761!5m2!1sen!2snp" 
                  style={{ filter: 'grayscale(30%) contrast(1.2) opacity(0.7)' }}
                ></iframe>
              </div>
              <div className="relative flex flex-wrap py-6 rounded shadow-md bg-white dark:bg-gray-800">
                <div className="lg:w-1/2 px-6">
                  <h2 className="title-font font-semibold text-xs tracking-widest text-gray-900 dark:text-gray-100">
                    ADDRESS
                  </h2>
                  <p className="mt-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 text-gray-600 dark:text-gray-300" onClick={locationmap}>
                    Bahradashi-3, Jhapa, Nepal
                  </p>
                </div>
                <div className="lg:w-1/2 px-6 mt-4 lg:mt-0">
                  <h2 className="title-font font-semibold text-xs tracking-widest text-gray-900 dark:text-gray-100">
                    EMAIL
                  </h2>
                  <p className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" onClick={mailschool}>
                    pashupati.school4012@gmail.com
                  </p>
                  <h2 className="title-font font-semibold text-xs tracking-widest text-gray-900 dark:text-gray-100 mt-4">
                    PHONE
                  </h2>
                  <p className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-gray-600 dark:text-gray-300" onClick={callschool}>
                    9844640316
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 md:w-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 p-8 rounded-lg shadow-md">
              <h2 className="text-lg mb-1 font-medium title-font">
                Feedback
              </h2>
              <p className="leading-relaxed mb77 mb-5 text-gray-600 dark:text-gray-300">
                Your invaluable feedback for our school is eagerly awaited and appreciated here.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="relative mb-4">
                  <label htmlFor="name" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                    Name
                  </label>
                  <input 
                    required 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                  />
                </div>
                <div className="relative mb-4">
                  <label htmlFor="email" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                    Email
                  </label>
                  <input 
                    required 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                  />
                </div>
                <div className="relative mb-4">
                  <label htmlFor="message" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                    Message
                  </label>
                  <textarea 
                    required 
                    id="message" 
                    name="message" 
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded px-3 py-2 h-32 outline-none resize-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                  ></textarea>
                </div>

                {submissionStatus === 'success' && (
                  <div className="flex items-center p-4 mb-4 rounded border-l-4 border-green-500 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Thank you for your feedback!</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full py-2 px-6 rounded text-lg font-medium bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white transition-colors"
                >
                  Send
                </button>
              </form>
              <p className="text-xs mt-3 text-gray-600 dark:text-gray-300">
                Your inputs will be forwarded to the School Admin.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;