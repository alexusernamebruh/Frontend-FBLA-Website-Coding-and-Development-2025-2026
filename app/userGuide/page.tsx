'use client';
import { BriefcaseIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function UserGuide() {
  const [selected, setSelected] = useState('Students');
  return (
    <div className='w-full h-full min-h-screen min-w-screen bg-white flex'>
      {/* Sidenav starts */}
      <div className='bg-indigo-500 px-3 w-fit overflow-hidden h-screen max-h-screen'>
        <div className='flex flex-col text-white space-y-2 items-center rounded-lg px-8 h-full py-8'>
          <p className='font-bold mb-2'>User Guide</p>
          <div className='flex flex-col space-y-1 font-semibold text-sm w-[15rem]'>
            <div className='space-y-1'>
              <div
                className={`${
                  selected === 'Students'
                    ? 'bg-indigo-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                    : 'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                }`}
                onClick={() => {
                  if (selected !== 'Students') {
                    setSelected('Students');
                  }
                }}
              >
                <div className='w-5 h-5'>
                  <BriefcaseIcon />
                </div>
                <p>Students and Staff</p>
              </div>
              <div
                className={`${
                  selected === 'Admins'
                    ? 'bg-indigo-600 hover:cursor-pointer space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                    : 'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex'
                }`}
                onClick={() => {
                  if (selected !== 'Admins') {
                    setSelected('Admins');
                  }
                }}
              >
                <div className='w-5 h-5'>
                  <ScaleIcon />
                </div>
                <p>Admins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Sidenav ends */}

      <div className='w-full h-full max-h-screen overflow-auto'>
        {selected === 'Students' && (
          <div className='bg-grid p-8 w-full min-h-screen h-full space-y-8 overflow-auto'>
            <div className='rounded-md shadow border border-gray-300 text-black w-full h-full bg-white flex flex-col'>
              <div className='border-b border-gray-300 p-4'>
                <p className='text-2xl font-semibold'>Lost and found system</p>
              </div>
              <div className='p-4 flex flex-col space-y-2 text-gray-700 text-sm font-semibold'>
                <div>
                  <p>
                    Users can report found items and also search for lost items
                  </p>
                  <p className='ml-4'>
                    AI assisted searching is used for keyword matching
                  </p>
                </div>
                <div className='flex-col'>
                  <p className=''>
                    Users can report found items and provided a description and
                    images
                  </p>
                  <p className='ml-4'>
                    All found item reports will be reviewed and approved by an
                    admin
                  </p>
                  <p className='ml-4'>
                    All item claims will be reviewed and approved by an admin
                  </p>
                </div>
                <p>
                  There are also chats for users to request information about an
                  item
                </p>
                <div className='flex flex-col'>
                  <p>
                    Users can submit a claim which will be approved by an admin
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {selected === 'Admins' && (
          <div className='bg-grid p-8 min-h-screen w-full h-full space-y-8 overflow-auto'>
            <div className='rounded-md shadow border w-full h-full bg-white flex flex-col'>
              <div className='border-b p-4'>
                <p className='text-2xl font-semibold text-black'>
                  Required approval
                </p>
              </div>
              <div className='p-4 flex flex-col space-y-2 text-gray-700 text-sm font-semibold'>
                <p>
                  You will have to approve item claims and found item reports
                  submitted by users
                </p>
                <p>
                  You have the ability to delete, approve, or edit item claims
                  or found item reports
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
