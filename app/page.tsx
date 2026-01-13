'use client';
import { useEffect, useState } from 'react';

import Navbar from './components/navbar';

import Footer from './components/footer';

export default function Home() {
  return (
    <>
      <div className='md:hidden lg:flex flex-col min-h-screen h-full p-4 bg-indigo-50'>
        <div className='w-full h-full sticky top-0'>
          <Navbar />
          <div className='h-4 w-full bg-indigo-100 blur-2xl' />
        </div>
        <div className='flex flex-col w-full h-full bg-grid bg-white rounded-lg shadow'>
          <div className='flex w-full h-full space-x-6 px-14 items-center py-22'>
            <div className='text-left w-1/2 flex flex-col space-y-3 h-full'>
              <div className='space-y-3 h-full flex flex-col justify-center'>
                <p className='font-bold text-6xl text-black'>
                  Lost and <span className='text-indigo-500'>Found</span>
                </p>
                <div className='text-gray-600'>
                  <p className='font-bold text-xl'>
                    For students of South Western High School
                  </p>
                  <p className='font-bold text-md'>
                    Create an account to claim or report lost items.
                  </p>
                </div>

                <div></div>
                <a
                  href='/signup'
                  className='bg-indigo-500 hover:bg-indigo-600 px-4 py-2 text-white hover:cursor-pointer rounded-lg w-fit font-bold'
                >
                  Get Started
                </a>
              </div>
            </div>
            <div className='w-1/2 flex-col my-auto p-6 rounded-xl bg-indigo-50 shadow-lg shadow-indigo-200'>
              <video
                src='/assets/compass.mp4'
                className='rounded-xl'
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>

          <div className='rounded-lg'>
            <div className='text-center bg-indigo-900 bg-grid flex space-y-3 w-full h-full space-x-6 px-14 items-center pt-16'>
              <div className='space-y-3 w-full h-full text-white flex text-center flex-col justify-center'>
                <p className='font-bold text-6xl text-white'>Confused?</p>
                <div className=''>
                  <p className='font-bold text-xl'>Read the user guide!</p>
                </div>

                <div></div>
                <a
                  href='/userGuide'
                  className='bg-indigo-500 mx-auto hover:bg-indigo-600 px-4 py-2 text-white hover:cursor-pointer rounded-lg w-fit font-bold'
                >
                  See User Guide
                </a>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </div>

      {/* mobile view */}
      <div className='lg:hidden md:flex flex-col min-h-screen h-full pt-4 bg-gray-100'>
        <div className='w-full h-full pb-4'>
          <Navbar />
        </div>
        <div className='w-full h-full bg-grid bg-white rounded-lg shadow'>
          <div className='flex flex-col w-full h-full px-10 items-center pt-16'>
            <div className='text-center w-full flex flex-col space-y-3 h-full'>
              <div className='space-y-3 h-full flex flex-col justify-center'>
                <p className='font-bold text-6xl'>Job Postings</p>
                <div className='text-gray-600'>
                  <p className='font-bold text-xl'>
                    By the Guidance Department
                  </p>
                  <p className='font-bold text-md pt-4'>
                    Search for job postings by local companies.
                  </p>
                  <p className='font-bold text-md'>
                    Create an applicant account to apply for a job posting.
                  </p>
                </div>

                <div></div>
                <a
                  href='/signup'
                  className='bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white hover:cursor-pointer rounded-lg w-full font-bold'
                >
                  Get Started
                </a>
              </div>
            </div>

            <div className='w-full flex-col mt-12 p-6 rounded-xl bg-blue-50'>
              <img
                src='https://cdn.pixabay.com/photo/2021/11/14/18/36/telework-6795505_1280.jpg'
                className='rounded-xl'
              />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}
