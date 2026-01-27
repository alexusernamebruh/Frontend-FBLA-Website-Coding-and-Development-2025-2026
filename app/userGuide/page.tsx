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
              <div className='p-4 flex flex-col space-y-4 text-gray-700 text-sm'>
                <div className='space-y-3'>
                  <h3 className='text-lg font-bold text-black'>
                    Getting Started
                  </h3>
                  <p>
                    Welcome to the Lost and Found system! This platform helps
                    you report found items and search for lost belongings.
                  </p>
                </div>

                <div className='space-y-3'>
                  <h3 className='text-lg font-bold text-black'>
                    Reporting Found Items
                  </h3>
                  <div className='ml-4 space-y-2'>
                    <p>&bull; Navigate to the &quot;Report Item&quot; page</p>
                    <p>&bull; Try to specify the following:</p>
                    <div className='ml-6 space-y-1'>
                      <p>- Item name and detailed description</p>
                      <p>- Location where the item was found</p>
                      <p>- Date and time found</p>
                      <p>- Upload clear photos of the item</p>
                    </div>
                    <p>&bull; Submit your report for admin review</p>
                    <p>
                      &bull; Once approved, your item will appear in the public
                      listings
                    </p>
                  </div>
                </div>

                <div className='space-y-3'>
                  <h3 className='text-lg font-bold text-black'>
                    Searching for Lost Items
                  </h3>
                  <div className='ml-4 space-y-2'>
                    <p>
                      &bull; Visit the &quot;All Items&quot; page to view all
                      found items
                    </p>
                    <p>
                      &bull; Use the search function to filter by item name or
                      description
                    </p>
                    <p>
                      &bull; Click on any item to view detailed information and
                      photos
                    </p>
                    <p>&bull; If you find your item, submit a claim request</p>
                  </div>
                </div>

                <div className='space-y-3'>
                  <h3 className='text-lg font-bold text-black'>
                    Claiming Items
                  </h3>
                  <div className='ml-4 space-y-2'>
                    <p>
                      &bull; Click &quot;Claim Item&quot; on the item&quot;s
                      detail page
                    </p>
                    <p>
                      &bull; Include details that verify the item belongs to you
                    </p>
                    <p>&bull; Wait for admin approval of your claim</p>
                    <p>
                      &bull; Once approved, contact information will be shared
                      for pickup
                    </p>
                  </div>
                </div>

                <div className='space-y-3'>
                  <h3 className='text-lg font-bold text-black'>Chat System</h3>
                  <div className='ml-4 space-y-2'>
                    <p>
                      &bull; Use the chat feature to ask questions about
                      specific items
                    </p>
                    <p>&bull; Chat with the person who found the item</p>
                    <p>
                      &bull; Keep conversations focused on the item in question
                    </p>
                    <p>&bull; Be respectful and provide helpful information</p>
                  </div>
                </div>

                <div className='space-y-3'>
                  <h3 className='text-lg font-bold text-black'>
                    Best Practices
                  </h3>
                  <div className='ml-4 space-y-2'>
                    <p>&bull; Provide detailed, accurate descriptions</p>
                    <p>
                      &bull; Take clear, well-lit photos from multiple angles
                    </p>
                    <p>&bull; Check the system regularly for new items</p>
                    <p>
                      &bull; Respond promptly to messages and claim requests
                    </p>
                    <p>
                      &bull; Report any inappropriate behavior to administrators
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {selected === 'Admins' && (
          <div className='bg-grid p-8 min-h-screen w-full h-full space-y-8 overflow-auto'>
            <div className='rounded-md shadow border border-gray-300 w-full h-full bg-white flex flex-col'>
              <div className='border-b border-gray-300 p-4'>
                <p className='text-2xl font-semibold text-black'>
                  Required approval
                </p>
              </div>
              <div className='p-4 flex flex-col space-y-4 text-gray-700 text-sm'>
                <div className='space-y-3'>
                  <h3 className='text-lg font-bold text-black'>
                    Admin Dashboard Overview
                  </h3>
                  <p>
                    As an administrator, you have access to a comprehensive
                    dashboard for managing the lost and found system.
                  </p>
                </div>

                <div className='space-y-3'>
                  <h3 className='text-lg font-bold text-black'>
                    Managing Item Reports
                  </h3>
                  <div className='ml-4 space-y-2'>
                    <p>
                      &bull; Review pending item reports in the &quot;Pending
                      Reports&quot; section
                    </p>
                    <p>
                      &bull; Examine item details, photos, and descriptions
                      carefully
                    </p>
                    <p>
                      &bull; Approve legitimate reports to make them publicly
                      visible
                    </p>
                    <p>&bull; Reject inappropriate or duplicate submissions</p>
                    <p>
                      &bull; Edit item information if needed before approval
                    </p>
                    <p>&bull; Delete items that violate community guidelines</p>
                  </div>
                </div>

                <div className='space-y-3'>
                  <h3 className='text-lg font-bold text-black'>
                    Processing Claims
                  </h3>
                  <div className='ml-4 space-y-2'>
                    <p>
                      &bull; Review claim requests in the &quot;Pending
                      Claims&quot; section
                    </p>
                    <p>
                      &bull; Verify proof of ownership provided by claimants
                    </p>
                    <p>
                      &bull; Contact both parties if additional verification is
                      needed
                    </p>
                    <p>&bull; Approve valid claims to facilitate item return</p>
                    <p>&bull; Reject claims that lack sufficient proof</p>
                    <p>
                      &bull; Monitor the &quot;Approved Claims&quot; section for
                      completed transactions
                    </p>
                  </div>

                  <div className='space-y-3'>
                    <h3 className='text-lg font-bold text-black'>
                      Item Management
                    </h3>
                    <div className='ml-4 space-y-2'>
                      <p>
                        &bull; View all items in the &quot;All Items&quot;
                        section
                      </p>
                      <p>
                        &bull; Edit item descriptions, names, or remove photos
                        as needed
                      </p>
                      <p>
                        &bull; Delete items that are no longer relevant or
                        appropriate
                      </p>
                      <p>&bull; Track item status (claimed/unclaimed)</p>
                      <p>
                        &bull; Monitor item age and consider deleting old
                        entries
                      </p>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <h3 className='text-lg font-bold text-black'>
                      Content Moderation
                    </h3>
                    <div className='ml-4 space-y-2'>
                      <p>
                        &bull; Ensure all content follows community guidelines
                      </p>
                      <p>&bull; Remove inappropriate images or descriptions</p>
                      <p>
                        &bull; Take action against users who abuse the system
                      </p>
                      <p>&bull; Maintain a safe and respectful environment</p>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <h3 className='text-lg font-bold text-black'>
                      Best Practices for Admins
                    </h3>
                    <div className='ml-4 space-y-2'>
                      <p>
                        &bull; Review submissions promptly to maintain user
                        engagement
                      </p>
                      <p>
                        &bull; Provide clear feedback when rejecting submissions
                      </p>
                      <p>
                        &bull; Maintain detailed records of administrative
                        actions
                      </p>
                      <p>
                        &bull; Regularly check the system for outdated items
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
