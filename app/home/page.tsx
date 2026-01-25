'use client';

import { useEffect, useRef, useState } from 'react';
import SideNav from '../components/sidenav';
import { a } from '../config';
import Success from '../components/success';
import { truncate } from '../helpers';
import dayjs from 'dayjs';
import Modal from '../components/modal';

const HomePage = () => {
  const [current, setCurrent] = useState('All Items');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [createSubmissionFormSuccess, setCreateSubmissionFormSuccess] =
    useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[] | null>(null);

  // All Items state
  const [unclaimedItems, setUnclaimedItems] = useState<IItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<IItem>();

  // Submit Claims state
  const [selectedItemForClaim, setSelectedItemForClaim] =
    useState<IItem | null>(null);
  const [claimComment, setClaimComment] = useState('');
  const [createClaimSuccess, setCreateClaimSuccess] = useState(false);
  const [claimSearchOpen, setClaimSearchOpen] = useState(false);
  const [claimSearchQuery, setClaimSearchQuery] = useState('');
  const claimSearchRef = useRef<HTMLDivElement>(null);

  // Your Reports state
  const [userReports, setUserReports] = useState<ISubmission[]>([]);
  const [selectedUserReport, setSelectedUserReport] = useState<ISubmission>();
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageData, setSelectedImageData] = useState<string>('');

  // Your Claims state
  const [userClaims, setUserClaims] = useState<IClaimForm[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<IClaimForm>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedPhotos(Array.from(e.target.files));
  };

  const getUnclaimedItems = async () => {
    try {
      const { data: response } = await a.get('/items/unclaimed');
      setUnclaimedItems(response);
      if (response.length > 0) {
        setSelectedItem(response[0]);
      }
      console.log(response[0]);
    } catch (error) {
      console.error('Error fetching unclaimed items:', error);
    }
  };

  const getUserReports = async () => {
    try {
      const { data: response } = await a.get(
        `/submissionForms/user/${JSON.parse(localStorage.getItem('user') || '{}').id}`,
      );
      setUserReports(response);
      if (response.length > 0) {
        setSelectedUserReport(response[0]);
      }
    } catch (error) {
      console.error('Error fetching user reports:', error);
    }
  };

  const getUserClaims = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
      const { data: response } = await a.get(`/claimForms/user/${userId}`);
      setUserClaims(response);
      if (response.length > 0) {
        setSelectedClaim(response[0]);
      }
    } catch (error) {
      console.error('Error fetching user claims:', error);
    }
  };

  useEffect(() => {
    (async () => {
      await getUserReports();
      await getUnclaimedItems();
      await getUserClaims();
    })();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        claimSearchRef.current &&
        !claimSearchRef.current.contains(event.target as Node)
      ) {
        setClaimSearchOpen(false);
      }
    };

    if (claimSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [claimSearchOpen]);

  const createSubmissionForm = async () => {
    console.log('what');
    const { data: response } = await a.post('/submissionForms', {
      itemName: newItemName,
      description: newItemDescription,
      userId: JSON.parse(localStorage.getItem('user') || '{}').id,
    });

    const formData = new FormData();
    if (selectedPhotos !== null) {
      for (let i = 0; i < selectedPhotos?.length; i++) {
        formData.append('photos', selectedPhotos[i]);
      }
      formData.append('submissionFormId', response.id.toString());
      const { data: photoResponse } = await a.post('/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    setSelectedPhotos(null);
    setNewItemDescription('');
    setNewItemName('');
    if (response) {
      setCreateSubmissionFormSuccess(true);
      const timer = setTimeout(() => {
        setCreateSubmissionFormSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  };

  const createClaimForm = async () => {
    if (!selectedItemForClaim) return;
    try {
      const { data: response } = await a.post('/claimForms/create', {
        userId: JSON.parse(localStorage.getItem('user') || '{}').id,
        itemId: selectedItemForClaim.id,
        comment: claimComment,
      });
      setClaimComment('');
      setSelectedItemForClaim(null);
      setClaimSearchQuery('');
      if (response) {
        setCreateClaimSuccess(true);
        const timer = setTimeout(() => {
          setCreateClaimSuccess(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error creating claim form:', error);
    }
  };

  return (
    <div className='bg-grid h-screen w-full overflow-hidden bg-white flex'>
      <div className='absolute pointer-events-none'>
        <Success
          title={'Success!'}
          description={'Submission form created'}
          show={createSubmissionFormSuccess}
          setShow={setCreateSubmissionFormSuccess}
        />
        <Success
          title={'Success!'}
          description={'Claim submitted'}
          show={createClaimSuccess}
          setShow={setCreateClaimSuccess}
        />
      </div>
      <div className='w-fit h-screen'>
        <SideNav current={current} setCurrent={setCurrent} type={'user'} />
      </div>
      <div className='w-full h-screen overflow-hidden'>
        {current === 'All Items' && (
          <div className='w-full h-full flex flex-col'>
            <div className='flex w-full h-full p-8 space-x-4'>
              <div className='flex flex-col space-y-4 overflow-auto text-black'>
                {unclaimedItems.length ? (
                  unclaimedItems.map((item: IItem, i) => {
                    return (
                      <div key={i} className='group'>
                        <div
                          onClick={() => {
                            setSelectedItem(item);
                          }}
                          className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                        >
                          <div className='group-hover:cursor-pointer'>
                            <p className='font-bold group-hover:underline text-black'>
                              {item.itemName}
                            </p>
                            <p className='font-medium mt-2 text-sm/6 text-black'>
                              {truncate(item.description, 50)}
                            </p>
                            <p className='font-medium text-xs mt-2 text-gray-500'>
                              Posted by: {item.author?.name || 'Unknown'}
                            </p>
                            <p className='font-medium text-xs mt-1 text-gray-500'>
                              Posted on{' '}
                              {dayjs(item.createdAt).format('MM/DD/YYYY')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className='font-semibold text-black'>
                    No items available
                  </div>
                )}
              </div>
              <div className='w-full h-full bg-white rounded-lg border overflow-auto border-gray-300 shadow-md'>
                {selectedItem ? (
                  <>
                    <div className='border-b h-fit'>
                      <div className='px-6 py-6'>
                        <p className='font-bold text-2xl text-black'>
                          {selectedItem.itemName}
                        </p>
                        <p className='font-medium text-gray-600 mt-1 text-sm'>
                          Posted by: {selectedItem.author?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                        <p className='text-lg font-bold text-black'>
                          Date Posted
                        </p>
                        <p className='text-sm text-gray-600'>
                          On {dayjs(selectedItem.createdAt).format('dddd')}
                          {', '}
                          {dayjs(selectedItem.createdAt).format(
                            'MM/DD/YYYY',
                          )}{' '}
                          at {dayjs(selectedItem.createdAt).format('h:mm a')}
                        </p>
                      </div>
                      <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                        <p className='text-lg font-bold text-black'>
                          Description
                        </p>
                        <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                          {selectedItem.description}
                        </p>
                      </div>
                      {selectedItem.photos &&
                        selectedItem.photos.length > 0 && (
                          <div className='space-y-3 px-6 py-8'>
                            <p className='text-lg font-bold text-black'>
                              Photos ({selectedItem.photos.length})
                            </p>
                            <div className='grid grid-cols-3 gap-3'>
                              {selectedItem.photos.map((photo) => (
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
                  <div className='p-4 font-semibold text-black'>
                    No items selected
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {current === 'Submit Reports' && (
          <div className='w-full h-full'>
            <div className='m-8 bg-white flex flex-col rounded-lg border border-gray-300 shadow-md'>
              <div className='border-b h-fit'>
                <div className='px-6 py-6'>
                  <p className='font-bold text-2xl text-black'>
                    Create a submission form to report an item
                  </p>
                </div>
              </div>
              <div className='p-6 space-y-4 flex flex-col'>
                <div className='space-y-2'>
                  <div>
                    <label className='block text-sm/6 font-bold text-gray-900'>
                      Item name*
                    </label>
                    <div className='mt-2'>
                      <input
                        type='text'
                        onChange={(v) => setNewItemName(v.target.value)}
                        value={newItemName}
                        required
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm/6 font-bold text-gray-900'>
                      Item description*
                    </label>
                    <div className='mt-2'>
                      <textarea
                        onChange={(v) => setNewItemDescription(v.target.value)}
                        value={newItemDescription}
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                      />
                    </div>
                  </div>

                  <div className=''>
                    <label className='block text-sm/6 font-bold text-gray-900'>
                      Photos
                    </label>
                    <div className='flex'>
                      <label>
                        <input
                          onChange={handleFileChange}
                          type='file'
                          accept='.png, .jpg, .jpeg'
                          hidden
                          multiple
                        />
                        <div className='flex w-28 h-9 px-2 flex-col bg-indigo-500 rounded-md shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer focus:outline-none'>
                          Choose Photos
                        </div>
                      </label>
                    </div>
                    <div className='text-black text-xs font-semibold mt-1'>
                      Selected photos:{' '}
                      {selectedPhotos?.length
                        ? selectedPhotos?.map((file) => file.name).join(', ')
                        : 'None'}
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => createSubmissionForm()}
                  className='bg-indigo-500 w-fit hover:bg-indigo-600 hover:cursor-pointer font-bold text-lg text-white rounded-md px-4 py-2'
                >
                  Report
                </div>
              </div>
            </div>
          </div>
        )}
        {current === 'Submit Claims' && (
          <div className='w-full h-full'>
            <div className='m-8 bg-white flex flex-col rounded-lg border border-gray-300 shadow-md'>
              <div className='border-b h-fit'>
                <div className='px-6 py-6'>
                  <p className='font-bold text-2xl text-black'>
                    Submit a claim for an item
                  </p>
                </div>
              </div>
              <div className='p-6 space-y-4 flex flex-col'>
                <div className='space-y-2'>
                  <div>
                    <label className='block text-sm/6 font-bold text-gray-900'>
                      Select an item*
                    </label>
                    <div className='mt-2 relative' ref={claimSearchRef}>
                      <input
                        type='text'
                        placeholder='Search items...'
                        value={claimSearchQuery}
                        onChange={(e) => setClaimSearchQuery(e.target.value)}
                        onFocus={() => setClaimSearchOpen(true)}
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-xs text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                      />
                      {claimSearchOpen && (
                        <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'>
                          {unclaimedItems
                            .filter((item) =>
                              `${item.itemName} ${item.author?.name || 'Unknown'}`
                                .toLowerCase()
                                .includes(claimSearchQuery.toLowerCase()),
                            )
                            .map((item) => (
                              <div
                                key={item.id}
                                onClick={() => {
                                  setSelectedItemForClaim(item);
                                  setClaimSearchQuery(
                                    `${item.itemName} - ${item.author?.name || 'Unknown'}`,
                                  );
                                  setClaimSearchOpen(false);
                                }}
                                className='px-3 py-2 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0'
                              >
                                <p className='font-medium text-black'>
                                  {item.itemName}
                                </p>
                                <p className='text-xs text-gray-500'>
                                  {item.author?.name || 'Unknown'}
                                </p>
                              </div>
                            ))}
                          {unclaimedItems.filter((item) =>
                            `${item.itemName} ${item.author?.name || 'Unknown'}`
                              .toLowerCase()
                              .includes(claimSearchQuery.toLowerCase()),
                          ).length === 0 && (
                            <div className='px-3 py-2 text-gray-500 text-sm'>
                              No items found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedItemForClaim && (
                    <div className='mt-4 p-4 bg-gray-50 rounded-md border border-gray-200'>
                      <p className='font-bold text-black'>
                        {selectedItemForClaim.itemName}
                      </p>
                      <p className='text-sm text-gray-600 mt-1'>
                        {selectedItemForClaim.description}
                      </p>
                      <p className='text-xs text-gray-500 mt-2'>
                        Posted by:{' '}
                        {selectedItemForClaim.author?.name || 'Unknown'}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className='block text-sm/6 font-bold text-gray-900'>
                      Claim comment/explanation*
                    </label>
                    <div className='mt-2'>
                      <textarea
                        onChange={(v) => setClaimComment(v.target.value)}
                        value={claimComment}
                        placeholder='Explain why this item belongs to you...'
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                      />
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => createClaimForm()}
                  className='bg-indigo-500 w-fit hover:bg-indigo-600 hover:cursor-pointer font-bold text-lg text-white rounded-md px-4 py-2'
                >
                  Submit Claim
                </div>
              </div>
            </div>
          </div>
        )}
        {current === 'Your Reports' && (
          <div className='w-full h-full flex flex-col'>
            <div className='flex w-full h-full p-8 space-x-4'>
              <div className='flex flex-col space-y-4 overflow-auto text-black'>
                {userReports.length ? (
                  userReports.map((v: ISubmission, i) => {
                    return (
                      <div key={i} className='group'>
                        <div
                          onClick={() => {
                            setSelectedUserReport(v);
                          }}
                          className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                        >
                          <div className='group-hover:cursor-pointer'>
                            <p className='font-bold group-hover:underline text-black'>
                              {v.itemName}
                            </p>
                            <p className='font-medium mt-2 text-sm/6 text-black'>
                              {truncate(v.description, 50)}
                            </p>
                            <p className='font-medium text-xs mt-2 text-gray-500'>
                              Status: {v.approvalStatus}
                            </p>
                            <p className='font-medium text-xs mt-1 text-gray-500'>
                              Created on{' '}
                              {dayjs(v.createdAt).format('MM/DD/YYYY')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className='font-semibold text-black'>
                    No reports found
                  </div>
                )}
              </div>
              <div className='w-full h-full bg-white rounded-lg border overflow-auto border-gray-300 shadow-md'>
                {selectedUserReport ? (
                  <>
                    <div className='border-b h-fit'>
                      <div className='px-6 py-6'>
                        <p className='font-bold text-2xl text-black'>
                          {selectedUserReport.itemName}
                        </p>
                        <p className='font-medium text-gray-600 mt-1 text-sm'>
                          {selectedUserReport.user?.name || 'You'}
                        </p>
                        <div className='flex space-x-2 mt-4'>
                          {selectedUserReport.approvalStatus === 'PENDING' && (
                            <div className='w-fit h-fit px-4 py-2 font-bold text-center rounded-md bg-orange-500 text-white'>
                              Status: Pending
                            </div>
                          )}
                          {selectedUserReport.approvalStatus === 'APPROVED' && (
                            <div className='w-fit h-fit px-4 py-2 font-bold text-center rounded-md bg-green-500 text-white'>
                              Status: Approved
                            </div>
                          )}
                          {selectedUserReport.approvalStatus === 'REJECTED' && (
                            <div className='w-fit h-fit px-4 py-2 font-bold text-center rounded-md bg-red-500 text-white'>
                              Status: Rejected
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                        <p className='text-lg font-bold text-black'>
                          Date Submitted
                        </p>
                        <p className='text-sm text-gray-600'>
                          On{' '}
                          {dayjs(selectedUserReport.createdAt).format('dddd')}
                          {', '}
                          {dayjs(selectedUserReport.createdAt).format(
                            'MM/DD/YYYY',
                          )}{' '}
                          at{' '}
                          {dayjs(selectedUserReport.createdAt).format('h:mm a')}
                        </p>
                      </div>
                      <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                        <p className='text-lg font-bold text-black'>
                          Description
                        </p>
                        <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                          {selectedUserReport.description}
                        </p>
                      </div>
                      {selectedUserReport.photos &&
                        selectedUserReport.photos.length > 0 && (
                          <div className='space-y-3 px-6 py-8'>
                            <p className='text-lg font-bold text-black'>
                              Photos ({selectedUserReport.photos.length})
                            </p>
                            <div className='grid grid-cols-3 gap-3'>
                              {selectedUserReport.photos.map((photo) => (
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
                  <div className='p-4 font-semibold text-black'>
                    No reports selected
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {current === 'Your Claims' && (
          <div className='w-full h-full flex flex-col'>
            <div className='flex w-full h-full p-8 space-x-4'>
              <div className='flex flex-col space-y-4 overflow-auto text-black'>
                {userClaims.length ? (
                  userClaims.map((v: IClaimForm, i) => {
                    return (
                      <div key={i} className='group'>
                        <div
                          onClick={() => {
                            setSelectedClaim(v);
                          }}
                          className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                        >
                          <div className='group-hover:cursor-pointer'>
                            <p className='font-bold group-hover:underline text-black'>
                              {v.item?.itemName}
                            </p>
                            <p className='font-medium mt-2 text-sm/6 text-black'>
                              {truncate(v.comment, 50)}
                            </p>
                            <p className='font-medium text-xs mt-2 text-gray-500'>
                              Status: {v.isOpen ? 'Open' : 'Closed'}
                            </p>
                            <p className='font-medium text-xs mt-1 text-gray-500'>
                              Claimed on{' '}
                              {dayjs(v.createdAt).format('MM/DD/YYYY')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className='font-semibold text-black'>
                    No claims found
                  </div>
                )}
              </div>
              <div className='w-full h-full bg-white rounded-lg border overflow-auto border-gray-300 shadow-md'>
                {selectedClaim ? (
                  <>
                    <div className='border-b h-fit'>
                      <div className='px-6 py-6'>
                        <p className='font-bold text-2xl text-black'>
                          {selectedClaim.item?.itemName}
                        </p>
                        <p className='font-medium text-gray-600 mt-1 text-sm'>
                          Posted by:{' '}
                          {selectedClaim.item?.author?.name || 'Unknown'}
                        </p>
                        <div className='flex space-x-2 mt-4'>
                          {selectedClaim.isOpen && (
                            <div className='w-fit h-fit px-4 py-2 font-bold text-center rounded-md bg-blue-500 text-white'>
                              Status: Open
                            </div>
                          )}
                          {!selectedClaim.isOpen && (
                            <div className='w-fit h-fit px-4 py-2 font-bold text-center rounded-md bg-gray-500 text-white'>
                              Status: Closed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                        <p className='text-lg font-bold text-black'>
                          Date Claimed
                        </p>
                        <p className='text-sm text-gray-600'>
                          On {dayjs(selectedClaim.createdAt).format('dddd')}
                          {', '}
                          {dayjs(selectedClaim.createdAt).format(
                            'MM/DD/YYYY',
                          )}{' '}
                          at {dayjs(selectedClaim.createdAt).format('h:mm a')}
                        </p>
                      </div>
                      <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                        <p className='text-lg font-bold text-black'>
                          Your Claim
                        </p>
                        <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                          {selectedClaim.comment}
                        </p>
                      </div>
                      <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                        <p className='text-lg font-bold text-black'>
                          Item Details
                        </p>
                        <p className='text-sm text-gray-600 whitespace-pre-wrap'>
                          {selectedClaim.item?.description}
                        </p>
                      </div>
                      {selectedClaim.item?.photos &&
                        selectedClaim.item.photos.length > 0 && (
                          <div className='space-y-3 px-6 py-8'>
                            <p className='text-lg font-bold text-black'>
                              Photos ({selectedClaim.item.photos.length})
                            </p>
                            <div className='grid grid-cols-3 gap-3'>
                              {selectedClaim.item.photos.map((photo) => (
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
                  <div className='p-4 font-semibold text-black'>
                    No claims selected
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Image Modal */}
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
                className='px-4 hover:cursor-pointer py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md transition-colors'
              >
                Close
              </button>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
