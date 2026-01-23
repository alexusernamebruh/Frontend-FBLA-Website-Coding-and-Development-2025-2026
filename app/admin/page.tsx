'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { a } from '../config';
import SideNav from '../components/sidenav';
import { truncate } from '../helpers';
import dayjs from 'dayjs';
import Success from '../components/success';
import Modal from '../components/modal';

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [currentPage, setCurrentPage] = useState('Pending Reports');
  const [approveSuccess, setApproveSuccess] = useState(false);
  const [rejectSuccess, setRejectSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [pendingSubmissions, setPendingSubmissions] = useState<ISubmission[]>(
    [],
  );
  const [approvedSubmissions, setApprovedSubmissions] = useState<ISubmission[]>(
    [],
  );
  const [rejectedSubmissions, setRejectedSubmissions] = useState<ISubmission[]>(
    [],
  );
  const [selectedPending, setSelectedPending] = useState<ISubmission>();
  const [selectedApproved, setSelectedApproved] = useState<ISubmission>();
  const [selectedRejected, setSelectedRejected] = useState<ISubmission>();

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editItemName, setEditItemName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRemovePhotoIds, setEditRemovePhotoIds] = useState<number[]>([]);

  // Image modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageData, setSelectedImageData] = useState<string>('');

  const authenticate = async () => {
    if (password === 'password') {
      setAuthenticated(true);
    }
  };

  const getPendingSubmissions = async () => {
    try {
      const { data: response } = await a.get('/submissionForms');
      const pending = response.filter(
        (s: ISubmission) => s.approvalStatus === 'PENDING',
      );
      setPendingSubmissions(pending);
      if (pending.length > 0) {
        setSelectedPending(pending[0]);
      }
      console.log(pending);
    } catch (error) {
      console.error('Error fetching pending submissions:', error);
    }
  };

  const getApprovedSubmissions = async () => {
    try {
      const { data: response } = await a.get('/submissionForms');
      const approved = response.filter(
        (s: ISubmission) => s.approvalStatus === 'APPROVED',
      );
      setApprovedSubmissions(approved);
      if (approved.length > 0) setSelectedApproved(approved[0]);
    } catch (error) {
      console.error('Error fetching approved submissions:', error);
    }
  };

  const getRejectedSubmissions = async () => {
    try {
      const { data: response } = await a.get('/submissionForms');
      const rejected = response.filter(
        (s: ISubmission) => s.approvalStatus === 'REJECTED',
      );
      setRejectedSubmissions(rejected);
      if (rejected.length > 0) setSelectedRejected(rejected[0]);
    } catch (error) {
      console.error('Error fetching rejected submissions:', error);
    }
  };

  const approveSubmission = async (submissionId: number) => {
    try {
      const { data: response } = await a.put(
        `/submissionForms/approve/${submissionId}`,
      );
      if (response) {
        getPendingSubmissions();
        getApprovedSubmissions();
        getRejectedSubmissions();
        setApproveSuccess(true);
        const timer = setTimeout(() => setApproveSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  const rejectSubmission = async (submissionId: number) => {
    try {
      const { data: response } = await a.put(
        `/submissionForms/reject/${submissionId}`,
      );
      if (response) {
        getPendingSubmissions();
        getApprovedSubmissions();
        getRejectedSubmissions();
        setRejectSuccess(true);
        const timer = setTimeout(() => setRejectSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  const editSubmission = async (submissionId: number) => {
    try {
      const { data: response } = await a.put(
        `/submissionForms/update/${submissionId}`,
        {
          newItemName: editItemName,
          newDescription: editDescription,
          removePhotoIds: editRemovePhotoIds,
        },
      );
      if (response) {
        getPendingSubmissions();
        getApprovedSubmissions();
        getRejectedSubmissions();
        setIsEditing(false);
        setEditSuccess(true);
        const timer = setTimeout(() => setEditSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error editing submission:', error);
    }
  };

  const startEdit = (submission: ISubmission) => {
    setEditItemName(submission.itemName);
    setEditDescription(submission.description);
    setEditRemovePhotoIds([]);
    setIsEditing(true);
  };

  const togglePhotoRemoval = (photoId: number) => {
    setEditRemovePhotoIds((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId],
    );
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditItemName('');
    setEditDescription('');
    setEditRemovePhotoIds([]);
  };

  useEffect(() => {
    (async () => {
      await getPendingSubmissions();
      await getApprovedSubmissions();
      await getRejectedSubmissions();
    })();
  }, []);

  return (
    <div className='h-screen bg-white'>
      {authenticated === false ? (
        <div className='bg-grid h-screen w-full flex flex-col'>
          <div
            className={`mx-auto min-w-[25vw] my-auto p-8 border border-gray-300 shadow-md bg-white rounded-lg
             `}
          >
            <div className='text-center text-black text-2xl font-bold mb-5'>
              Admin Panel
            </div>
            <div>
              <div className='flex items-center justify-between'>
                <label
                  htmlFor='password'
                  className='block text-sm/6 font-bold text-gray-900'
                >
                  Password*
                </label>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  onChange={(v) => setPassword(v.target.value)}
                  value={password}
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
              </div>
            </div>
            <div
              onClick={() => authenticate()}
              className='bg-indigo-500 text-center mt-2 hover:bg-indigo-600 hover:cursor-pointer text-white font-semibold rounded-md px-3 py-2'
            >
              Submit
            </div>
          </div>
        </div>
      ) : (
        <div className='w-full h-screen'>
          <div className='absolute pointer-events-none top-0 right-0'>
            <Success
              title={'Success!'}
              description={'Successfully approved a submission form.'}
              show={approveSuccess}
              setShow={setApproveSuccess}
            />
            <Success
              title={'Success'}
              description={'Successfully rejected a submission form.'}
              show={rejectSuccess}
              setShow={setRejectSuccess}
            />
            <Success
              title={'Success'}
              description={'Successfully edited the submission form'}
              show={editSuccess}
              setShow={setEditSuccess}
            />
          </div>

          {/* Desktop Starts here */}
          <div className={`bg-grid flex text-black h-full w-full`}>
            <div className='bg-indigo-500 w-fit h-full min-h-screen'>
              <SideNav
                current={currentPage}
                setCurrent={setCurrentPage}
                type={'admin'}
              />
            </div>

            {currentPage === 'Pending Reports' && (
              <div className='flex flex-col w-full h-full p-8 space-x-4'>
                <div className='flex w-full h-full p-8 space-x-4'>
                  <div className='flex flex-col space-y-4 overflow-auto'>
                    {pendingSubmissions.length ? (
                      pendingSubmissions.map((v: ISubmission, i) => {
                        return (
                          <div key={i} className='group'>
                            <div
                              onClick={() => {
                                setSelectedPending(v);
                                setIsEditing(false);
                              }}
                              className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                            >
                              <div className='group-hover:cursor-pointer'>
                                <p className='font-bold group-hover:underline'>
                                  {v.itemName}
                                </p>
                                <p className='font-medium mt-2 text-sm/6'>
                                  {truncate(v.description, 50)}
                                </p>
                                <p className='font-medium text-xs mt-2 text-gray-500'>
                                  By: {v.user?.name || 'Unknown User'}
                                </p>
                                <p className='font-medium text-xs mt-1 text-gray-500'>
                                  Created on{' '}
                                  {dayjs(v.createdAt).format('MM/DD/YYYY')}{' '}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className='font-semibold'>No pending reports</div>
                    )}
                  </div>
                  <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                    {selectedPending ? (
                      <>
                        <div className='border-b border-gray-300 h-fit'>
                          <div className='px-6 py-6'>
                            {isEditing ? (
                              <div className='space-y-4'>
                                <div>
                                  <label className='block text-sm font-bold text-gray-900 mb-2'>
                                    Item Name
                                  </label>
                                  <input
                                    type='text'
                                    value={editItemName}
                                    onChange={(e) =>
                                      setEditItemName(e.target.value)
                                    }
                                    className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                                  />
                                </div>
                                <div>
                                  <label className='block text-sm font-bold text-gray-900 mb-2'>
                                    Description
                                  </label>
                                  <textarea
                                    value={editDescription}
                                    onChange={(e) =>
                                      setEditDescription(e.target.value)
                                    }
                                    rows={4}
                                    className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                                  />
                                </div>
                                {selectedPending.photos &&
                                  selectedPending.photos.length > 0 && (
                                    <div>
                                      <label className='block text-sm font-bold text-gray-900 mb-3'>
                                        Photos - Check to remove
                                      </label>
                                      <div className='grid grid-cols-2 gap-3'>
                                        {selectedPending.photos.map((photo) => (
                                          <div
                                            key={photo.id}
                                            className='flex items-center space-x-2 p-3 border border-gray-300 rounded-md'
                                          >
                                            <input
                                              type='checkbox'
                                              id={`photo-${photo.id}`}
                                              checked={editRemovePhotoIds.includes(
                                                photo.id,
                                              )}
                                              onChange={() =>
                                                togglePhotoRemoval(photo.id)
                                              }
                                              className='w-4 h-4 text-indigo-500 rounded focus:ring-indigo-500'
                                            />
                                            <label
                                              htmlFor={`photo-${photo.id}`}
                                              className='text-sm text-gray-600 cursor-pointer flex-1'
                                            >
                                              Photo ID: {photo.id}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                <div className='space-x-2 flex'>
                                  <div
                                    onClick={() =>
                                      selectedPending?.id !== undefined &&
                                      editSubmission(selectedPending.id)
                                    }
                                    className='w-fit h-fit px-4 py-2 rounded-md bg-indigo-500 hover:cursor-pointer hover:bg-indigo-600 text-white font-bold text-center'
                                  >
                                    Save Changes
                                  </div>
                                  <div
                                    onClick={() => cancelEdit()}
                                    className='w-fit h-fit px-4 py-2 rounded-md bg-gray-400 hover:cursor-pointer hover:bg-gray-500 text-white font-bold text-center'
                                  >
                                    Cancel
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className='font-bold text-2xl'>
                                  {selectedPending.itemName}
                                </p>
                                <p className='font-medium text-gray-600 mt-1 text-sm'>
                                  Submitted by:{' '}
                                  {selectedPending.user?.name || 'Unknown User'}
                                </p>
                                <div className='space-x-2 flex flex-wrap'>
                                  <div
                                    onClick={() =>
                                      selectedPending?.id !== undefined &&
                                      approveSubmission(selectedPending.id)
                                    }
                                    className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-green-500 hover:cursor-pointer hover:bg-green-600 text-white font-bold text-center'
                                  >
                                    Approve
                                  </div>
                                  <div
                                    onClick={() =>
                                      selectedPending?.id !== undefined &&
                                      rejectSubmission(selectedPending.id)
                                    }
                                    className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-red-500 hover:cursor-pointer hover:bg-red-600 text-white font-bold text-center'
                                  >
                                    Reject
                                  </div>
                                  <div
                                    onClick={() => startEdit(selectedPending)}
                                    className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-indigo-500 hover:cursor-pointer hover:bg-indigo-600 text-white font-bold text-center'
                                  >
                                    Edit
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className=''>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Date Submitted</p>
                            <p className='text-sm text-gray-600'>
                              On{' '}
                              {dayjs(selectedPending.createdAt).format('dddd')}
                              {', '}
                              {dayjs(selectedPending.createdAt).format(
                                'MM/DD/YYYY',
                              )}{' '}
                              at{' '}
                              {dayjs(selectedPending.createdAt).format(
                                'h:mm a',
                              )}
                            </p>
                          </div>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Description</p>
                            <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                              {selectedPending.description}
                            </p>
                          </div>
                          {selectedPending.photos &&
                            selectedPending.photos.length > 0 && (
                              <div className='space-y-3 px-6 py-8'>
                                <p className='text-lg font-bold'>
                                  Photos ({selectedPending.photos.length})
                                </p>
                                <div className='grid grid-cols-3 gap-3'>
                                  {selectedPending.photos.map((photo) => (
                                    <div
                                      key={photo.id}
                                      className='flex flex-col items-center space-y-1 p-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:shadow-lg transition-shadow'
                                      onClick={() => {
                                        setSelectedImageData(
                                          `data:image/jpeg;base64,${Buffer.from(photo.data).toString('base64')}`,
                                        );
                                        setShowImageModal(true);
                                      }}
                                    >
                                      <img
                                        src={`data:image/jpeg;base64,${Buffer.from(photo.data).toString('base64')}`}
                                        alt='photo'
                                        className='max-h-96 rounded-md'
                                      />
                                      <p className='text-xs text-gray-500'>
                                        ID: {photo.id}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </>
                    ) : (
                      <div className='p-4 font-semibold'>
                        No pending reports
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'Approved Reports' && (
              <div className='flex flex-col w-full h-full p-8 space-x-4'>
                <div className='flex w-full h-full p-8 space-x-4'>
                  <div className='flex flex-col space-y-4 overflow-auto'>
                    {approvedSubmissions.length ? (
                      approvedSubmissions.map((v: ISubmission, i) => {
                        return (
                          <div key={i} className='group'>
                            <div
                              onClick={() => setSelectedApproved(v)}
                              className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                            >
                              <div className='group-hover:cursor-pointer'>
                                <p className='font-bold group-hover:underline'>
                                  {v.itemName}
                                </p>
                                <p className='font-medium mt-2 text-sm/6'>
                                  {truncate(v.description, 50)}
                                </p>
                                <p className='font-medium text-xs mt-2 text-gray-500'>
                                  Name: {v.user.name}
                                </p>
                                <p className='font-medium text-xs mt-1 text-gray-500'>
                                  Created on{' '}
                                  {dayjs(v.createdAt).format('MM/DD/YYYY')}{' '}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className='font-semibold'>
                        No approved submissions found
                      </div>
                    )}
                  </div>
                  <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                    {selectedApproved && (
                      <>
                        <div className='border-b border-gray-300 h-fit'>
                          <div className='px-6 py-6'>
                            <p className='font-bold text-2xl'>
                              {selectedApproved.itemName}
                            </p>
                            <p className='font-medium text-gray-600 mt-1 text-sm'>
                              Submitted by:{' '}
                              {selectedApproved.user?.name || 'Unknown User'}
                            </p>
                          </div>
                        </div>
                        <div className=''>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Date Submitted</p>
                            <p className='text-sm text-gray-600'>
                              On{' '}
                              {dayjs(selectedApproved.createdAt).format('dddd')}
                              {', '}
                              {dayjs(selectedApproved.createdAt).format(
                                'MM/DD/YYYY',
                              )}{' '}
                              at{' '}
                              {dayjs(selectedApproved.createdAt).format(
                                'h:mm a',
                              )}
                            </p>
                          </div>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Description</p>
                            <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                              {selectedApproved.description}
                            </p>
                          </div>
                          {selectedApproved.photos &&
                            selectedApproved.photos.length > 0 && (
                              <div className='space-y-3 px-6 py-8'>
                                <p className='text-lg font-bold'>
                                  Photos ({selectedApproved.photos.length})
                                </p>
                                <div className='grid grid-cols-3 gap-3'>
                                  {selectedApproved.photos.map((photo) => (
                                    <div
                                      key={photo.id}
                                      className='flex flex-col items-center space-y-1 p-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:shadow-lg transition-shadow'
                                      onClick={() => {
                                        setSelectedImageData(
                                          `data:image/jpeg;base64,${Buffer.from(photo.data).toString('base64')}`,
                                        );
                                        setShowImageModal(true);
                                      }}
                                    >
                                      <img
                                        src={`data:image/jpeg;base64,${Buffer.from(photo.data).toString('base64')}`}
                                        alt='photo'
                                        className='max-h-96 rounded-md'
                                      />
                                      <p className='text-xs text-gray-500'>
                                        ID: {photo.id}
                                      </p>
                                      <p className='text-xs text-gray-600 text-center'>
                                        Uploaded{' '}
                                        {dayjs(photo.createdAt).format(
                                          'M/D/YY',
                                        )}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentPage === 'Declined Reports' && (
              <div className='flex flex-col w-full h-full p-8 space-x-4'>
                <div className='flex w-full h-full p-8 space-x-4'>
                  <div className='flex flex-col space-y-4 overflow-auto'>
                    {rejectedSubmissions.length ? (
                      rejectedSubmissions.map((v: ISubmission, i) => {
                        return (
                          <div key={i} className='group'>
                            <div
                              onClick={() => setSelectedRejected(v)}
                              className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                            >
                              <div className='group-hover:cursor-pointer'>
                                <p className='font-bold group-hover:underline'>
                                  {v.itemName}
                                </p>
                                <p className='font-medium mt-2 text-sm/6'>
                                  {truncate(v.description, 50)}
                                </p>
                                <p className='font-medium text-xs mt-2 text-gray-500'>
                                  {v.user.name}
                                </p>
                                <p className='font-medium text-xs mt-1 text-gray-500'>
                                  Created on{' '}
                                  {dayjs(v.createdAt).format('MM/DD/YYYY')}{' '}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className='font-semibold'>
                        No rejected reports found
                      </div>
                    )}
                  </div>
                  <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                    {selectedRejected && (
                      <>
                        <div className='border-b border-gray-300 h-fit'>
                          <div className='px-6 py-6'>
                            <p className='font-bold text-2xl'>
                              {selectedRejected.itemName}
                            </p>
                            <p className='font-medium text-gray-600 mt-1 text-sm'>
                              Submitted by:{' '}
                              {selectedRejected.user?.name || 'Unknown User'}
                            </p>
                          </div>
                        </div>
                        <div className=''>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Date Submitted</p>
                            <p className='text-sm text-gray-600'>
                              On{' '}
                              {dayjs(selectedRejected.createdAt).format('dddd')}
                              {', '}
                              {dayjs(selectedRejected.createdAt).format(
                                'MM/DD/YYYY',
                              )}{' '}
                              at{' '}
                              {dayjs(selectedRejected.createdAt).format(
                                'h:mm a',
                              )}
                            </p>
                          </div>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Description</p>
                            <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                              {selectedRejected.description}
                            </p>
                          </div>
                          {selectedRejected.photos &&
                            selectedRejected.photos.length > 0 && (
                              <div className='space-y-3 px-6 py-8'>
                                <p className='text-lg font-bold'>
                                  Photos ({selectedRejected.photos.length})
                                </p>
                                <div className='grid grid-cols-3 gap-3'>
                                  {selectedRejected.photos.map((photo) => (
                                    <div
                                      key={photo.id}
                                      className='flex flex-col items-center space-y-1 p-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:shadow-lg transition-shadow'
                                      onClick={() => {
                                        setSelectedImageData(
                                          `data:image/jpeg;base64,${Buffer.from(photo.data).toString('base64')}`,
                                        );
                                        setShowImageModal(true);
                                      }}
                                    >
                                      <img
                                        src={`data:image/jpeg;base64,${Buffer.from(photo.data).toString('base64')}`}
                                        alt='photo'
                                        className='max-h-96 rounded-md'
                                      />
                                      <p className='text-xs text-gray-500'>
                                        ID: {photo.id}
                                      </p>
                                      <p className='text-xs text-gray-600 text-center'>
                                        Uploaded{' '}
                                        {dayjs(photo.createdAt).format(
                                          'M/D/YY',
                                        )}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Desktop Ends here */}

          {/* Modals */}
          <div>
            <Modal open={showImageModal} setOpen={setShowImageModal}>
              <div className='flex flex-col items-center justify-center space-y-4'>
                {selectedImageData && (
                  <>
                    <img
                      src={selectedImageData}
                      alt='Enlarged view'
                      className='max-w-full max-h-[70vh] rounded-lg'
                    />
                    <button
                      onClick={() => setShowImageModal(false)}
                      className='px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md transition-colors'
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}
