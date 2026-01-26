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
  const [currentPage, setCurrentPage] = useState('All Items');
  const [approveSuccess, setApproveSuccess] = useState(false);
  const [rejectSuccess, setRejectSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [claimApprovalSuccess, setClaimApprovalSuccess] = useState(false);
  const [claimDeleteSuccess, setClaimDeleteSuccess] = useState(false);
  const [itemDeleteSuccess, setItemDeleteSuccess] = useState(false);
  const [itemEditSuccess, setItemEditSuccess] = useState(false);
  const [pendingSubmissions, setPendingSubmissions] = useState<ISubmission[]>(
    [],
  );
  const [approvedSubmissions, setApprovedSubmissions] = useState<ISubmission[]>(
    [],
  );
  const [rejectedSubmissions, setRejectedSubmissions] = useState<ISubmission[]>(
    [],
  );
  const [pendingClaims, setPendingClaims] = useState<IClaimForm[]>([]);
  const [approvedClaims, setApprovedClaims] = useState<IClaimForm[]>([]);
  const [allItems, setAllItems] = useState<IItem[]>([]);
  const [selectedPending, setSelectedPending] = useState<ISubmission>();
  const [selectedApproved, setSelectedApproved] = useState<ISubmission>();
  const [selectedRejected, setSelectedRejected] = useState<ISubmission>();
  const [selectedPendingClaim, setSelectedPendingClaim] =
    useState<IClaimForm>();
  const [selectedApprovedClaim, setSelectedApprovedClaim] =
    useState<IClaimForm>();
  const [selectedItem, setSelectedItem] = useState<IItem>();

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

  const getPendingClaims = async () => {
    try {
      const { data: response } = await a.get('/claimForms/getOpenClaimForms');
      const pending = response.filter((c: IClaimForm) => c.isOpen === true);
      setPendingClaims(pending);
      if (pending.length > 0) {
        setSelectedPendingClaim(pending[0]);
      }
      console.log(pending);
    } catch (error) {
      console.error('Error fetching pending claims:', error);
    }
  };

  const getApprovedClaims = async () => {
    try {
      const { data: response } = await a.get(
        '/claimForms/getApprovedClaimForms',
      );
      const approved = response.filter((c: IClaimForm) => c.isOpen === false);
      setApprovedClaims(approved);
      if (approved.length > 0) setSelectedApprovedClaim(approved[0]);
    } catch (error) {
      console.error('Error fetching approved claims:', error);
    }
  };

  const approveClaim = async (claimId: number) => {
    try {
      const { data: response } = await a.put(`/claimForms/claim/${claimId}`);
      if (response) {
        getPendingClaims();
        getApprovedClaims();
        setClaimApprovalSuccess(true);
        const timer = setTimeout(() => setClaimApprovalSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error approving claim:', error);
    }
  };

  const deleteClaim = async (claimId: number) => {
    try {
      const { data: response } = await a.delete(
        `/claimForms/delete/${claimId}`,
      );
      if (response) {
        getPendingClaims();
        getApprovedClaims();
        setSelectedPendingClaim(undefined);
        setClaimDeleteSuccess(true);
        const timer = setTimeout(() => setClaimDeleteSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error deleting claim:', error);
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

  const getAllItemsData = async () => {
    try {
      const { data: response } = await a.get('/items/all');
      setAllItems(response);
      if (response.length > 0) {
        setSelectedItem(response[0]);
      }
    } catch (error) {
      console.error('Error fetching all items:', error);
    }
  };

  const updateItemData = async (itemId: number) => {
    try {
      const { data: response } = await a.put(`/items/update/${itemId}`, {
        itemName: editItemName,
        description: editDescription,
        removePhotoIds: editRemovePhotoIds,
      });
      if (response) {
        getAllItemsData();
        setIsEditing(false);
        setItemEditSuccess(true);
        const timer = setTimeout(() => setItemEditSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItemData = async (itemId: number) => {
    try {
      const { data: response } = await a.delete(`/items/delete/${itemId}`);
      if (response) {
        getAllItemsData();
        setSelectedItem(undefined);
        setItemDeleteSuccess(true);
        const timer = setTimeout(() => setItemDeleteSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const startEditItem = (item: IItem) => {
    setEditItemName(item.itemName);
    setEditDescription(item.description);
    setEditRemovePhotoIds([]);
    setIsEditing(true);
  };

  const handleCurrentPageChange = (newPage: string) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    (async () => {
      await getPendingSubmissions();
      await getApprovedSubmissions();
      await getRejectedSubmissions();
      await getPendingClaims();
      await getApprovedClaims();
      await getAllItemsData();
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
            <Success
              title={'Success'}
              description={'Successfully approved a claim.'}
              show={claimApprovalSuccess}
              setShow={setClaimApprovalSuccess}
            />
            <Success
              title={'Success'}
              description={'Successfully deleted a claim.'}
              show={claimDeleteSuccess}
              setShow={setClaimDeleteSuccess}
            />
            <Success
              title={'Success'}
              description={'Successfully updated the item.'}
              show={itemEditSuccess}
              setShow={setItemEditSuccess}
            />
            <Success
              title={'Success'}
              description={'Successfully deleted the item.'}
              show={itemDeleteSuccess}
              setShow={setItemDeleteSuccess}
            />
          </div>

          {/* Desktop Starts here */}
          <div className={`hidden lg:flex bg-grid text-black h-full w-full`}>
            <div className='bg-indigo-500 w-fit h-full min-h-screen'>
              <SideNav
                current={currentPage}
                setCurrent={handleCurrentPageChange}
                type={'admin'}
              />
            </div>

            {currentPage === 'All Items' && (
              <div className='flex flex-col w-full h-full p-8 space-x-4'>
                <div className='flex w-full h-full p-8 space-x-4'>
                  <div className='flex flex-col space-y-4 overflow-auto'>
                    {allItems.length ? (
                      allItems.map((v: IItem, i) => {
                        return (
                          <div key={i} className='group'>
                            <div
                              onClick={() => {
                                setSelectedItem(v);
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
                                  By: {v.author?.name || 'Unknown User'}
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
                      <div className='font-semibold'>No items found</div>
                    )}
                  </div>
                  <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                    {selectedItem ? (
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
                                {selectedItem.photos &&
                                  selectedItem.photos.length > 0 && (
                                    <div>
                                      <label className='block text-sm font-bold text-gray-900 mb-3'>
                                        Photos - Check to remove
                                      </label>
                                      <div className='grid grid-cols-2 gap-3'>
                                        {selectedItem.photos.map((photo) => (
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
                                      selectedItem?.id !== undefined &&
                                      updateItemData(selectedItem.id)
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
                                  {selectedItem.itemName}
                                </p>
                                <p className='font-medium text-gray-600 mt-1 text-sm'>
                                  Submitted by:{' '}
                                  {selectedItem.author?.name || 'Unknown User'}
                                </p>
                                <div className='space-x-2 flex flex-wrap'>
                                  <div
                                    onClick={() => startEditItem(selectedItem)}
                                    className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-indigo-500 hover:cursor-pointer hover:bg-indigo-600 text-white font-bold text-center'
                                  >
                                    Edit
                                  </div>
                                  <div
                                    onClick={() =>
                                      selectedItem?.id !== undefined &&
                                      deleteItemData(selectedItem.id)
                                    }
                                    className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-red-500 hover:cursor-pointer hover:bg-red-600 text-white font-bold text-center'
                                  >
                                    Delete
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className=''>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Date Created</p>
                            <p className='text-sm text-gray-600'>
                              On {dayjs(selectedItem.createdAt).format('dddd')}
                              {', '}
                              {dayjs(selectedItem.createdAt).format(
                                'MM/DD/YYYY',
                              )}{' '}
                              at{' '}
                              {dayjs(selectedItem.createdAt).format('h:mm a')}
                            </p>
                          </div>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Description</p>
                            <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                              {selectedItem.description}
                            </p>
                          </div>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Author</p>
                            <p className='text-sm text-gray-600'>
                              {selectedItem.author?.name || 'Unknown User'} (
                              {selectedItem.author?.email})
                            </p>
                          </div>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Status</p>
                            <p className='text-sm text-gray-600'>
                              {selectedItem.claimed ? 'Claimed' : 'Unclaimed'}
                            </p>
                          </div>
                          {selectedItem.photos &&
                            selectedItem.photos.length > 0 && (
                              <div className='space-y-3 px-6 py-8'>
                                <p className='text-lg font-bold'>
                                  Photos ({selectedItem.photos.length})
                                </p>
                                <div className='grid grid-cols-3 gap-3'>
                                  {selectedItem.photos.map((photo) => (
                                    <div
                                      key={photo.id}
                                      className='flex flex-col items-center space-y-1 p-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:shadow-lg transition-shadow'
                                      onClick={() => {
                                        setSelectedImageData(
                                          `data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`,
                                        );
                                        setShowImageModal(true);
                                      }}
                                    >
                                      <img
                                        src={`data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`}
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
                    ) : (
                      <div className='p-8 text-gray-500 text-center'>
                        Select an item to view details
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

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
                                          `data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`,
                                        );
                                        setShowImageModal(true);
                                      }}
                                    >
                                      <img
                                        src={`data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`}
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

            {currentPage === 'Pending Claims' && (
              <div className='flex flex-col w-full h-full p-8 space-x-4'>
                <div className='flex w-full h-full p-8 space-x-4'>
                  <div className='flex flex-col space-y-4 overflow-auto'>
                    {pendingClaims.length ? (
                      pendingClaims.map((c: IClaimForm, i) => {
                        return (
                          <div key={i} className='group'>
                            <div
                              onClick={() => {
                                setSelectedPendingClaim(c);
                              }}
                              className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                            >
                              <div className='group-hover:cursor-pointer'>
                                <p className='font-bold group-hover:underline'>
                                  {c.item?.itemName || 'Unknown Item'}
                                </p>
                                <p className='font-medium mt-2 text-sm/6'>
                                  {truncate(c.comment, 50)}
                                </p>
                                <p className='font-medium text-xs mt-2 text-gray-500'>
                                  By: {c.user?.name || 'Unknown User'}
                                </p>
                                <p className='font-medium text-xs mt-1 text-gray-500'>
                                  Created on{' '}
                                  {dayjs(c.createdAt).format('MM/DD/YYYY')}{' '}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className='font-semibold'>No pending claims</div>
                    )}
                  </div>
                  <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                    {selectedPendingClaim ? (
                      <>
                        <div className='border-b border-gray-300 h-fit'>
                          <div className='px-6 py-6'>
                            <p className='font-bold text-2xl'>
                              {selectedPendingClaim.item?.itemName ||
                                'Unknown Item'}
                            </p>
                            <p className='font-medium text-gray-600 mt-1 text-sm'>
                              Claimed by:{' '}
                              {selectedPendingClaim.user?.name ||
                                'Unknown User'}
                            </p>
                            <p className='font-medium text-gray-600 mt-1 text-sm'>
                              Item owner:{' '}
                              {selectedPendingClaim.item?.author?.name ||
                                'Unknown User'}
                            </p>
                            <div className='space-x-2 flex flex-wrap'>
                              <div
                                onClick={() =>
                                  selectedPendingClaim?.id !== undefined &&
                                  approveClaim(selectedPendingClaim.id)
                                }
                                className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-green-500 hover:cursor-pointer hover:bg-green-600 text-white font-bold text-center'
                              >
                                Approve Claim
                              </div>
                              <div
                                onClick={() =>
                                  selectedPendingClaim?.id !== undefined &&
                                  deleteClaim(selectedPendingClaim.id)
                                }
                                className='w-fit h-fit px-4 py-2 mt-4 rounded-md bg-red-500 hover:cursor-pointer hover:bg-red-600 text-white font-bold text-center'
                              >
                                Delete Claim
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className=''>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Date Submitted</p>
                            <p className='text-sm text-gray-600'>
                              On{' '}
                              {dayjs(selectedPendingClaim.createdAt).format(
                                'dddd',
                              )}
                              {', '}
                              {dayjs(selectedPendingClaim.createdAt).format(
                                'MM/DD/YYYY',
                              )}{' '}
                              at{' '}
                              {dayjs(selectedPendingClaim.createdAt).format(
                                'h:mm a',
                              )}
                            </p>
                          </div>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Claim Comment</p>
                            <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                              {selectedPendingClaim.comment}
                            </p>
                          </div>
                          {selectedPendingClaim.item?.photos &&
                            selectedPendingClaim.item.photos.length > 0 && (
                              <div className='space-y-3 px-6 py-8'>
                                <p className='text-lg font-bold'>
                                  Item Photos (
                                  {selectedPendingClaim.item.photos.length})
                                </p>
                                <div className='grid grid-cols-3 gap-3'>
                                  {selectedPendingClaim.item.photos.map(
                                    (photo) => (
                                      <div
                                        key={photo.id}
                                        className='flex flex-col items-center space-y-1 p-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:shadow-lg transition-shadow'
                                        onClick={() => {
                                          setSelectedImageData(
                                            `data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`,
                                          );
                                          setShowImageModal(true);
                                        }}
                                      >
                                        <img
                                          src={`data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`}
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
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </>
                    ) : (
                      <div className='p-8 text-gray-500 text-center'>
                        Select a pending claim to view details
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
                                          `data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`,
                                        );
                                        setShowImageModal(true);
                                      }}
                                    >
                                      <img
                                        src={`data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`}
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
                                          `data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`,
                                        );
                                        setShowImageModal(true);
                                      }}
                                    >
                                      <img
                                        src={`data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`}
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

            {currentPage === 'Approved Claims' && (
              <div className='flex flex-col w-full h-full p-8 space-x-4'>
                <div className='flex w-full h-full p-8 space-x-4'>
                  <div className='flex flex-col space-y-4 overflow-auto'>
                    {approvedClaims.length ? (
                      approvedClaims.map((c: IClaimForm, i) => {
                        return (
                          <div key={i} className='group'>
                            <div
                              onClick={() => {
                                setSelectedApprovedClaim(c);
                              }}
                              className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                            >
                              <div className='group-hover:cursor-pointer'>
                                <p className='font-bold group-hover:underline'>
                                  {c.item?.itemName || 'Unknown Item'}
                                </p>
                                <p className='font-medium mt-2 text-sm/6'>
                                  {truncate(c.comment, 50)}
                                </p>
                                <p className='font-medium text-xs mt-2 text-gray-500'>
                                  By: {c.user?.name || 'Unknown User'}
                                </p>
                                <p className='font-medium text-xs mt-1 text-gray-500'>
                                  Created on{' '}
                                  {dayjs(c.createdAt).format('MM/DD/YYYY')}{' '}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className='font-semibold'>No approved claims</div>
                    )}
                  </div>
                  <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                    {selectedApprovedClaim ? (
                      <>
                        <div className='border-b border-gray-300 h-fit'>
                          <div className='px-6 py-6'>
                            <p className='font-bold text-2xl'>
                              {selectedApprovedClaim.item?.itemName ||
                                'Unknown Item'}
                            </p>
                            <p className='font-medium text-gray-600 mt-1 text-sm'>
                              Claimed by:{' '}
                              {selectedApprovedClaim.user?.name ||
                                'Unknown User'}
                            </p>
                            <p className='font-medium text-gray-600 mt-1 text-sm'>
                              Item owner:{' '}
                              {selectedApprovedClaim.item?.author?.name ||
                                'Unknown User'}
                            </p>
                            <p className='font-medium text-green-600 mt-2 text-sm'>
                              ✓ Claim Approved
                            </p>
                          </div>
                        </div>
                        <div className=''>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Date Submitted</p>
                            <p className='text-sm text-gray-600'>
                              On{' '}
                              {dayjs(selectedApprovedClaim.createdAt).format(
                                'dddd',
                              )}
                              {', '}
                              {dayjs(selectedApprovedClaim.createdAt).format(
                                'MM/DD/YYYY',
                              )}{' '}
                              at{' '}
                              {dayjs(selectedApprovedClaim.createdAt).format(
                                'h:mm a',
                              )}
                            </p>
                          </div>
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Claim Comment</p>
                            <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                              {selectedApprovedClaim.comment}
                            </p>
                          </div>
                          {selectedApprovedClaim.item?.photos &&
                            selectedApprovedClaim.item.photos.length > 0 && (
                              <div className='space-y-3 px-6 py-8'>
                                <p className='text-lg font-bold'>
                                  Item Photos (
                                  {selectedApprovedClaim.item.photos.length})
                                </p>
                                <div className='grid grid-cols-3 gap-3'>
                                  {selectedApprovedClaim.item.photos.map(
                                    (photo) => (
                                      <div
                                        key={photo.id}
                                        className='flex flex-col items-center space-y-1 p-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:shadow-lg transition-shadow'
                                        onClick={() => {
                                          setSelectedImageData(
                                            `data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`,
                                          );
                                          setShowImageModal(true);
                                        }}
                                      >
                                        <img
                                          src={`data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`}
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
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      </>
                    ) : (
                      <div className='p-8 text-gray-500 text-center'>
                        Select an approved claim to view details
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Desktop Ends here */}

          {/* Mobile Version */}
          <div className='lg:hidden bg-white min-h-screen pb-20 text-black'>
            <div className='absolute pointer-events-none z-50'>
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
              <Success
                title={'Success'}
                description={'Successfully approved a claim.'}
                show={claimApprovalSuccess}
                setShow={setClaimApprovalSuccess}
              />
              <Success
                title={'Success'}
                description={'Successfully deleted a claim.'}
                show={claimDeleteSuccess}
                setShow={setClaimDeleteSuccess}
              />
              <Success
                title={'Success'}
                description={'Successfully updated the item.'}
                show={itemEditSuccess}
                setShow={setItemEditSuccess}
              />
              <Success
                title={'Success'}
                description={'Successfully deleted the item.'}
                show={itemDeleteSuccess}
                setShow={setItemDeleteSuccess}
              />
            </div>

            {/* Mobile Header */}
            <div className='bg-indigo-600 text-white p-4 shadow-lg'>
              <h1 className='text-xl font-bold'>Admin - {currentPage}</h1>
            </div>

            {/* Mobile Content */}
            <div className='p-4'>
              {currentPage === 'All Items' && (
                <div className='space-y-4'>
                  {allItems.length ? (
                    allItems.map((item: IItem, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'
                      >
                        <h3 className='font-bold text-lg text-black'>
                          {item.itemName}
                        </h3>
                        <p className='text-sm text-gray-600 mt-2'>
                          {truncate(item.description, 100)}
                        </p>
                        <div className='flex justify-between items-center mt-3'>
                          <div>
                            <p className='text-xs text-gray-500'>
                              By: {item.author?.name || 'Unknown'}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {dayjs(item.createdAt).format('MM/DD/YYYY')}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {item.claimed ? 'Claimed' : 'Unclaimed'}
                            </p>
                          </div>
                          <div className='flex space-x-2'>
                            <button
                              onClick={() => startEditItem(item)}
                              className='bg-indigo-500 text-white px-2 py-1 rounded text-xs font-semibold hover:cursor-pointer'
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => item.id && deleteItemData(item.id)}
                              className='bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold hover:cursor-pointer'
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      No items found
                    </div>
                  )}
                </div>
              )}

              {currentPage === 'Pending Reports' && (
                <div className='space-y-4'>
                  {pendingSubmissions.length ? (
                    pendingSubmissions.map((submission: ISubmission, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'
                      >
                        <h3 className='font-bold text-lg text-black'>
                          {submission.itemName}
                        </h3>
                        <p className='text-sm text-gray-600 mt-2'>
                          {truncate(submission.description, 80)}
                        </p>
                        <div className='flex justify-between items-center mt-3'>
                          <div>
                            <p className='text-xs text-gray-500'>
                              By: {submission.user?.name || 'Unknown'}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {dayjs(submission.createdAt).format('MM/DD/YYYY')}
                            </p>
                          </div>
                          <div className='flex space-x-2'>
                            <button
                              onClick={() =>
                                submission.id &&
                                approveSubmission(submission.id)
                              }
                              className='bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold hover:cursor-pointer'
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                submission.id && rejectSubmission(submission.id)
                              }
                              className='bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold hover:cursor-pointer'
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      No pending reports
                    </div>
                  )}
                </div>
              )}

              {currentPage === 'Pending Claims' && (
                <div className='space-y-4'>
                  {pendingClaims.length ? (
                    pendingClaims.map((claim: IClaimForm, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'
                      >
                        <h3 className='font-bold text-lg text-black'>
                          {claim.item?.itemName || 'Unknown Item'}
                        </h3>
                        <p className='text-sm text-gray-600 mt-2'>
                          {truncate(claim.comment, 80)}
                        </p>
                        <div className='flex justify-between items-center mt-3'>
                          <div>
                            <p className='text-xs text-gray-500'>
                              By: {claim.user?.name || 'Unknown'}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {dayjs(claim.createdAt).format('MM/DD/YYYY')}
                            </p>
                          </div>
                          <div className='flex space-x-2'>
                            <button
                              onClick={() => claim.id && approveClaim(claim.id)}
                              className='bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold hover:cursor-pointer'
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => claim.id && deleteClaim(claim.id)}
                              className='bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold hover:cursor-pointer'
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      No pending claims
                    </div>
                  )}
                </div>
              )}

              {currentPage === 'Approved Reports' && (
                <div className='space-y-4'>
                  {approvedSubmissions.length ? (
                    approvedSubmissions.map((submission: ISubmission, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'
                      >
                        <div className='flex justify-between items-start'>
                          <div className='flex-1'>
                            <h3 className='font-bold text-black'>
                              {submission.itemName}
                            </h3>
                            <p className='text-sm text-gray-600 mt-1'>
                              {truncate(submission.description, 80)}
                            </p>
                            <p className='text-xs text-gray-500 mt-2'>
                              By: {submission.user?.name || 'Unknown'}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {dayjs(submission.createdAt).format('MM/DD/YYYY')}
                            </p>
                          </div>
                          <div className='px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-800'>
                            APPROVED
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      No approved reports
                    </div>
                  )}
                </div>
              )}

              {currentPage === 'Declined Reports' && (
                <div className='space-y-4'>
                  {rejectedSubmissions.length ? (
                    rejectedSubmissions.map((submission: ISubmission, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'
                      >
                        <div className='flex justify-between items-start'>
                          <div className='flex-1'>
                            <h3 className='font-bold text-black'>
                              {submission.itemName}
                            </h3>
                            <p className='text-sm text-gray-600 mt-1'>
                              {truncate(submission.description, 80)}
                            </p>
                            <p className='text-xs text-gray-500 mt-2'>
                              By: {submission.user?.name || 'Unknown'}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {dayjs(submission.createdAt).format('MM/DD/YYYY')}
                            </p>
                          </div>
                          <div className='px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-800'>
                            REJECTED
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      No rejected reports
                    </div>
                  )}
                </div>
              )}

              {currentPage === 'Approved Claims' && (
                <div className='space-y-4'>
                  {approvedClaims.length ? (
                    approvedClaims.map((claim: IClaimForm, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'
                      >
                        <div className='flex justify-between items-start'>
                          <div className='flex-1'>
                            <h3 className='font-bold text-black'>
                              {claim.item?.itemName || 'Unknown Item'}
                            </h3>
                            <p className='text-sm text-gray-600 mt-1'>
                              {truncate(claim.comment, 80)}
                            </p>
                            <p className='text-xs text-gray-500 mt-2'>
                              By: {claim.user?.name || 'Unknown'}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {dayjs(claim.createdAt).format('MM/DD/YYYY')}
                            </p>
                          </div>
                          <div className='px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-800'>
                            APPROVED
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      No approved claims
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation */}
            <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2'>
              <div className='flex justify-around'>
                {[
                  {
                    name: 'All Items',
                    icon: (
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
                        />
                      </svg>
                    ),
                  },
                  {
                    name: 'Pending Reports',
                    icon: (
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    ),
                  },
                  {
                    name: 'Pending Claims',
                    icon: (
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                    ),
                  },
                  {
                    name: 'Approved Reports',
                    icon: (
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                    ),
                  },
                  {
                    name: 'Declined Reports',
                    icon: (
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M6 18L18 6M6 6l12 12'
                        />
                      </svg>
                    ),
                  },
                  {
                    name: 'Approved Claims',
                    icon: (
                      <svg
                        className='w-4 h-4'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                        />
                      </svg>
                    ),
                  },
                ].map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => handleCurrentPageChange(tab.name)}
                    className={`flex flex-col items-center py-1 px-1 rounded ${
                      currentPage === tab.name
                        ? 'text-indigo-600'
                        : 'text-gray-500'
                    }`}
                  >
                    <div className='mb-1'>{tab.icon}</div>
                    <div className='text-xs font-medium text-center leading-tight'>
                      {tab.name.split(' ').map((word, i) => (
                        <div key={i}>{word}</div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

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
