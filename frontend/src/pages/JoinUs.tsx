import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../hooks/useTheme';

interface FormData {
  full_name: string;
  address: string;
  gender: string;
  dob: string;
  father_name: string;
  mother_name: string;
  grade: string;
  previous_school: string;
  email: string;
  phone: string;
  intro?: string;
  image: File | null;
}

interface Grade {
  id: number;
  class_level: string;
  medium_display?: string;
  faculty_display?: string;
}

const AdmissionForm: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [formData, setFormData] = useState<FormData>({
    full_name: '',
    address: '',
    gender: 'Male',
    dob: '',
    father_name: '',
    mother_name: '',
    grade: '',
    previous_school: '',
    email: '',
    phone: '',
    intro: '',
    image: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submissionStatus, setSubmissionStatus] = useState<{
    success: boolean;
    applicationId?: string;
    message?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Fetch available grades
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_DYNAMIC_URL}/api/grades/`);
        setGrades(response.data);
      } catch (error) {
        console.error('Error fetching grades:', error);
        setErrors(prev => ({ ...prev, grade: 'Failed to load grades. Please try again.' }));
      }
    };
    fetchGrades();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const sanitizeFilename = (name: string): string => {
    // Replace invalid characters, spaces with underscores, and limit length
    return name
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove invalid characters
      .trim()
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .slice(0, 50); // Limit length
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please upload a valid image (JPEG, PNG, GIF, JPG)',
        }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 2MB',
        }));
        return;
      }

      // Get the file extension
      const ext = file.name.split('.').pop();
      // Sanitize the full_name to create a valid file name
      const sanitizedName = formData.full_name
        ? sanitizeFilename(formData.full_name)
        : 'unnamed';
        const sanitizedDOb = formData.dob
        ? sanitizeFilename(formData.dob)
        : 'unnamed'; // Fallback if full_name is empty
      const newFileName = `${sanitizedName}${sanitizedDOb}.${ext}`;

      // Create a new File object with the renamed file
      const renamedFile = new File([file], newFileName, { type: file.type });

      setFormData(prev => ({
        ...prev,
        image: renamedFile,
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.grade) newErrors.grade = 'Please select a grade';
    if (!formData.previous_school.trim()) newErrors.previous_school = 'Previous school is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.image) newErrors.image = 'Passport photo is required';
    if (!isChecked) newErrors.terms = 'Please confirm that all information is accurate';

    // Conditional parent names validation
    const selectedGrade = grades.find(g => g.id.toString() === formData.grade);
    if (selectedGrade && ['Nursery', 'KG', '1', '2', '3', '4', '5'].includes(selectedGrade.class_level)) {
      if (!formData.father_name.trim()) newErrors.father_name = "Father's name is required";
      if (!formData.mother_name.trim()) newErrors.mother_name = "Mother's name is required";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key as keyof FormData] !== null && formData[key as keyof FormData] !== '') {
          formDataToSend.append(key, formData[key as keyof FormData] as string | Blob);
        }
      });

      const response = await axios.post(
        `${import.meta.env.VITE_DYNAMIC_URL}/api/admission/`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setSubmissionStatus({
        success: true,
        applicationId: response.data.application_id,
        message: response.data.message,
      });
    } catch (error) {
      console.error('Submission error:', error);
      if (axios.isAxiosError(error) && error.response?.data) {
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          setSubmissionStatus({
            success: false,
            message: error.response.data.message || 'Submission failed',
          });
        }
      } else {
        setSubmissionStatus({
          success: false,
          message: 'Network error. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const callschool = () => {
    window.location.href = 'tel:+9844640316';
  };

  const mailschool = () => {
    window.location.href = 'mailto:pashupati.school4012@gmail.com';
  };

  if (submissionStatus?.success) {
    return (
      <div
        className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
      >
        <div
          className="max-w-md mx-auto p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
        >
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="mt-3 text-xl font-medium">Application Submitted Successfully!</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">Your application ID: {submissionStatus.applicationId}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <main>
        <section className="text-gray-600 dark:text-gray-300 body-font">
          <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
            <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
              <img
                className="object-cover object-center rounded"
                alt="hero"
                src={`${import.meta.env.VITE_IMAGE_URL}/joinus/joinus.png`}
              />
            </div>
            <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
              <h1
                className="title-font sm:text-4xl text-3xl mb-4 font-medium text-blue-600 dark:text-blue-400"
              >
                Join Us
              </h1>
              <p className="text-sm md:text-base text-justify mb-8 leading-relaxed">
                Welcome to Shree Pashupati Technical Secondary School, where we nurture talent and foster excellence.
                Join our vibrant community and embark on a journey of learning and growth. Fill out the admission form
                below to become a part of our school.
              </p>
              <div className="flex justify-center">
                <button
                  className="inline-flex text-white bg-blue-600 dark:bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 dark:hover:bg-blue-600 rounded text-lg"
                  onClick={callschool}
                >
                  Call
                </button>
                <button
                  className="ml-4 inline-flex text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 border-0 py-2 px-6 focus:outline-none hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-lg"
                  onClick={mailschool}
                >
                  Message
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="text-gray-600 dark:text-gray-300 body-font relative">
          <div className="container px-5 py-24 mx-auto">
            <div
              className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <h2
                className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100"
              >
                Admission Form
              </h2>
              <p
                className="text-sm md:text-base mb-5 text-gray-600 dark:text-gray-300"
              >
                Make sure to fill in your admission forms carefully. Check all the details, like your personal and
                academic information, to avoid mistakes. Your carefulness will help make your application process smooth.
                If you have any questions, feel free to ask the admissions office for help.
              </p>

              {submissionStatus?.success === false && (
                <div
                  className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-100 dark:bg-red-900/30"
                  role="alert"
                >
                  <svg
                    className="flex-shrink-0 w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <div className="ml-3 text-sm font-medium text-red-800 dark:text-red-300">{submissionStatus.message}</div>
                  <button
                    onClick={() => setSubmissionStatus(null)}
                    className="ml-auto -mx-1.5 -my-1.5 bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 inline-flex items-center justify-center h-8 w-8"
                    aria-label="Close"
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="full_name" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
                      }}
                      placeholder="Nitin Sharma"
                    />
                    {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="address" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      placeholder="Bahradashi 3 Jhapa"
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>
                  <div>
                    <label htmlFor="gender" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                  </div>
                  <div>
                    <label htmlFor="dob" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="date"
                      id="dob"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
                  </div>
                  <div>
                    <label htmlFor="father_name" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                      Father's Name
                    </label>
                    <input
                      type="text"
                      id="father_name"
                      name="father_name"
                      value={formData.father_name}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
                      }}
                      placeholder="Hari Sharma"
                    />
                    {errors.father_name && <p className="mt-1 text-sm text-red-600">{errors.father_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="mother_name" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                      Mother's Name
                    </label>
                    <input
                      type="text"
                      id="mother_name"
                      name="mother_name"
                      value={formData.mother_name}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
                      }}
                      placeholder="Sabitra Sharma"
                    />
                    {errors.mother_name && <p className="mt-1 text-sm text-red-600">{errors.mother_name}</p>}
                  </div>
                  <div>
                    <label htmlFor="grade" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                      Grade Applying For <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      value={formData.grade}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    >
                      <option value="">Select Grade</option>
                      {grades.map(grade => (
                        <option key={grade.id} value={grade.id}>
                          {grade.class_level}
                          {grade.medium_display ? ` (${grade.medium_display})` : ''}
                          {grade.faculty_display ? ` - ${grade.faculty_display}` : ''}
                        </option>
                      ))}
                    </select>
                    {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
                  </div>
                  <div>
                    <label htmlFor="previous_school" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                      Previous School <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      id="previous_school"
                      name="previous_school"
                      value={formData.previous_school}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
                      }}
                      placeholder="Saraswati Secondary School"
                    />
                    {errors.previous_school && (
                      <p className="mt-1 text-sm text-red-600">{errors.previous_school}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      placeholder="nitinxyz@gmail.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-200 text-base outline-none py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      placeholder="9817000000"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="intro" className="leading-7 text-sm text-gray-600 dark:text-gray-300">
                      Short Introduction
                    </label>
                    <textarea
                      id="intro"
                      name="intro"
                      value={formData.intro}
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-300 rounded border border-gray-200 dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-200 h-32 text-base outline-none py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                    ></textarea>
                    {errors.intro && <p className="mt-1 text-sm text-red-600">{errors.intro}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                      Passport Size Photo <span className="text-red-500">*</span>
                    </label>
                    <div
                      className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 dark:border-gray-600 border-dashed rounded-md"
                    >
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600 dark:text-gray-300">
                          <label
                            htmlFor="image"
                            className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400"
                          >
                            <span>Upload a photo</span>
                            <input
                              required
                              id="image"
                              name="image"
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">PNG, JPG, GIF up to 2MB</p>
                        {formData.image && (
                          <p className="text-sm text-gray-600 dark:text-gray-300">Selected: {formData.image.name}</p>
                        )}
                        {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center sm:col-span-2">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2"
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                      Confirm, I have rechecked it. <span className="text-red-500">*</span>
                    </label>
                    {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms}</p>}
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="text-white bg-blue-600 dark:bg-blue-500 border-0 py-2 px-6 focus:outline-none rounded text-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdmissionForm;