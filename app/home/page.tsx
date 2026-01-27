'use client';

import { useEffect, useRef, useState } from 'react';
import ItemChats from '../components/itemChats';
import SideNav from '../components/sidenav';
import { a } from '../config';
import Success from '../components/success';
import { truncate } from '../helpers';
import dayjs from 'dayjs';
import Modal from '../components/modal';

const HomePage = () => {
  const [current, setCurrent] = useState('All Items');
  const [mobileTab, setMobileTab] = useState(() => {
    // Initialize based on current value
    return 'Reports';
  });
  const [showItemModal, setShowItemModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [createSubmissionFormSuccess, setCreateSubmissionFormSuccess] =
    useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[] | null>(null);

  // All Items state
  const [unclaimedItems, setUnclaimedItems] = useState<IItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<IItem>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);

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
      setFilteredItems(response);
      if (response.length > 0) {
        setSelectedItem(response[0]);
      }
    } catch (error) {
      console.error('Error fetching unclaimed items:', error);
    }
  };

  const searchItems = async (query: string) => {
    if (!query.trim()) {
      setFilteredItems(unclaimedItems);
      return;
    }
    try {
      const { data: response } = await a.get('/items/search', {
        params: { itemName: query, description: query },
      });
      const unclaimedOnly = response.filter((item: IItem) => !item.claimed);
      setFilteredItems(unclaimedOnly);
    } catch (error) {
      console.error('Error searching items:', error);
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

  const hasUserClaimedItem = (itemId: number) => {
    return userClaims.some(
      (claim) => claim.item?.id === itemId && claim.isOpen,
    );
  };

  const handleCurrentChange = (newCurrent: string) => {
    setCurrent(newCurrent);
    if (newCurrent === 'Reports') {
      setMobileTab('Reports');
    } else if (newCurrent === 'Claims') {
      setMobileTab('Claims');
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
    <div className='w-full h-screen'>
      {/* Desktop Version */}
      <div className='hidden lg:flex bg-grid h-screen w-full overflow-hidden bg-white'>
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
          <SideNav
            current={current}
            setCurrent={handleCurrentChange}
            type={'user'}
          />
        </div>
        <div className='w-full h-screen'>
          {current === 'All Items' && (
            <div className='w-full h-full flex flex-col'>
              <div className='flex w-full h-full p-8 space-x-4'>
                <div className='flex flex-col space-y-4 overflow-auto text-black'>
                  <div className='mb-4'>
                    <input
                      type='text'
                      placeholder='Search items...'
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        searchItems(e.target.value);
                      }}
                      className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none'
                    />
                  </div>
                  {filteredItems.length ? (
                    filteredItems.map((item: IItem, i) => {
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
                          <div className='mt-4'>
                            {selectedItem.author?.id ===
                            JSON.parse(localStorage.getItem('user') || '{}')
                              .id ? (
                              <button
                                disabled
                                className='bg-gray-400 text-white font-bold px-4 py-2 rounded-md cursor-not-allowed'
                              >
                                Your Item
                              </button>
                            ) : hasUserClaimedItem(selectedItem.id) ? (
                              <button
                                disabled
                                className='bg-gray-400 text-white font-bold px-4 py-2 rounded-md cursor-not-allowed'
                              >
                                Claim Pending
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedItemForClaim(selectedItem);
                                  setShowClaimModal(true);
                                }}
                                className='bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white font-bold px-4 py-2 rounded-md'
                              >
                                Claim This Item
                              </button>
                            )}
                          </div>
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
                          onChange={(v) =>
                            setNewItemDescription(v.target.value)
                          }
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
                      <div
                        className='mt-2 relative border border-gray-300 rounded-md'
                        ref={claimSearchRef}
                      >
                        <input
                          type='text'
                          placeholder='Search items...'
                          value={claimSearchQuery}
                          onChange={(e) => setClaimSearchQuery(e.target.value)}
                          onFocus={() => setClaimSearchOpen(true)}
                          className='block w-full rounded-md bg-white px-3 py-1.5 text-xs text-gray-900 outline-none placeholder:text-gray-400 sm:text-sm/6'
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
                          className='block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 sm:text-sm/6'
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
                            {selectedUserReport.approvalStatus ===
                              'PENDING' && (
                              <div className='w-fit h-fit px-4 py-2 font-bold text-center rounded-md bg-orange-500 text-white'>
                                Status: Pending
                              </div>
                            )}
                            {selectedUserReport.approvalStatus ===
                              'APPROVED' && (
                              <div className='w-fit h-fit px-4 py-2 font-bold text-center rounded-md bg-green-500 text-white'>
                                Status: Approved
                              </div>
                            )}
                            {selectedUserReport.approvalStatus ===
                              'REJECTED' && (
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
                            {dayjs(selectedUserReport.createdAt).format(
                              'h:mm a',
                            )}
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
                    <div className='p-4 font-semibold text-black'>
                      No claims selected
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {current === 'Chats' && (
            <div className='p-8 w-full h-screen'>
              <ItemChats />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Version */}
      <div className='lg:hidden h-full flex flex-col flex-1 bg-white min-h-screen pb-20'>
        <div className='absolute pointer-events-none z-50'>
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

        {/* Mobile Header */}
        <div className='bg-indigo-600 h-fit text-white p-4 shadow-lg'>
          <h1 className='text-xl font-bold'>{current}</h1>
        </div>

        {/* Mobile Content */}
        <div className='p-4 h-full'>
          {current === 'All Items' && (
            <div className='space-y-4'>
              <div className='mb-4'>
                <input
                  type='text'
                  placeholder='Search items...'
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchItems(e.target.value);
                  }}
                  className='w-full outline-none rounded-md border border-gray-300 px-3 py-2 text-sm'
                />
              </div>
              {filteredItems.length ? (
                filteredItems.map((item: IItem, i) => (
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
                      </div>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowItemModal(true);
                        }}
                        className='bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer font-semibold text-white px-3 py-1 rounded text-sm'
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-8 text-gray-500'>
                  No items available
                </div>
              )}
            </div>
          )}

          {current === 'Reports' && (
            <div className='space-y-4'>
              {/* Tab Switcher */}
              <div className='flex bg-gray-100 rounded-lg p-1'>
                <button
                  onClick={() => setMobileTab('Reports')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                    mobileTab === 'Reports'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Submit Report
                </button>
                <button
                  onClick={() => setMobileTab('Your Reports')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                    mobileTab === 'Your Reports'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Your Reports
                </button>
              </div>

              {mobileTab === 'Reports' && (
                <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-bold text-gray-900 mb-2'>
                        Item name*
                      </label>
                      <input
                        type='text'
                        onChange={(v) => setNewItemName(v.target.value)}
                        value={newItemName}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-bold text-gray-900 mb-2'>
                        Description*
                      </label>
                      <textarea
                        onChange={(v) => setNewItemDescription(v.target.value)}
                        value={newItemDescription}
                        rows={4}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-bold text-gray-900 mb-2'>
                        Photos
                      </label>
                      <label className='block'>
                        <input
                          onChange={handleFileChange}
                          type='file'
                          accept='.png, .jpg, .jpeg, .webp'
                          hidden
                          multiple
                        />
                        <div className='bg-indigo-500 text-white text-center py-3 rounded-md font-semibold'>
                          Choose Photos
                        </div>
                      </label>
                      <p className='text-xs text-gray-600 mt-1'>
                        Selected:{' '}
                        {selectedPhotos?.length
                          ? selectedPhotos.map((f) => f.name).join(', ')
                          : 'None'}
                      </p>
                    </div>
                    <button
                      onClick={() => createSubmissionForm()}
                      className='w-full bg-indigo-600 text-white py-3 rounded-md font-bold'
                    >
                      Submit Report
                    </button>
                  </div>
                </div>
              )}

              {mobileTab === 'Your Reports' && (
                <div className='space-y-4'>
                  {userReports.length ? (
                    userReports.map((report: ISubmission, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'
                      >
                        <div className='flex justify-between items-start'>
                          <div className='flex-1'>
                            <h3 className='font-bold text-black'>
                              {report.itemName}
                            </h3>
                            <p className='text-sm text-gray-600 mt-1'>
                              {truncate(report.description, 80)}
                            </p>
                            <p className='text-xs text-gray-500 mt-2'>
                              {dayjs(report.createdAt).format('MM/DD/YYYY')}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              report.approvalStatus === 'APPROVED'
                                ? 'bg-green-100 text-green-800'
                                : report.approvalStatus === 'REJECTED'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {report.approvalStatus}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      No reports found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {current === 'Claims' && (
            <div className='space-y-4'>
              {/* Tab Switcher */}
              <div className='flex bg-gray-100 rounded-lg p-1'>
                <button
                  onClick={() => setMobileTab('Claims')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                    mobileTab === 'Claims'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Submit Claim
                </button>
                <button
                  onClick={() => setMobileTab('Your Claims')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                    mobileTab === 'Your Claims'
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Your Claims
                </button>
              </div>

              {mobileTab === 'Claims' && (
                <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-bold text-gray-900 mb-2'>
                        Select an item*
                      </label>
                      <div className='relative' ref={claimSearchRef}>
                        <input
                          type='text'
                          placeholder='Search items...'
                          value={claimSearchQuery}
                          onChange={(e) => setClaimSearchQuery(e.target.value)}
                          onFocus={() => setClaimSearchOpen(true)}
                          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none'
                        />
                        {claimSearchOpen && (
                          <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto'>
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
                                  className='px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100'
                                >
                                  <p className='font-medium text-black text-sm'>
                                    {item.itemName}
                                  </p>
                                  <p className='text-xs text-gray-500'>
                                    {item.author?.name || 'Unknown'}
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {selectedItemForClaim && (
                      <div className='p-3 bg-gray-50 rounded-md'>
                        <p className='font-bold text-sm'>
                          {selectedItemForClaim.itemName}
                        </p>
                        <p className='text-xs text-gray-600 mt-1'>
                          {truncate(selectedItemForClaim.description, 80)}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className='block text-sm font-bold text-gray-900 mb-2'>
                        Claim explanation*
                      </label>
                      <textarea
                        onChange={(v) => setClaimComment(v.target.value)}
                        value={claimComment}
                        rows={4}
                        placeholder='Explain why this item belongs to you...'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm'
                      />
                    </div>
                    <button
                      onClick={() => createClaimForm()}
                      className='w-full bg-indigo-600 text-white py-3 rounded-md font-bold'
                    >
                      Submit Claim
                    </button>
                  </div>
                </div>
              )}

              {mobileTab === 'Your Claims' && (
                <div className='space-y-4'>
                  {userClaims.length ? (
                    userClaims.map((claim: IClaimForm, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'
                      >
                        <div className='flex justify-between items-start'>
                          <div className='flex-1'>
                            <h3 className='font-bold text-black'>
                              {claim.item?.itemName}
                            </h3>
                            <p className='text-sm text-gray-600 mt-1'>
                              {truncate(claim.comment, 80)}
                            </p>
                            <p className='text-xs text-gray-500 mt-2'>
                              {dayjs(claim.createdAt).format('MM/DD/YYYY')}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              claim.isOpen
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {claim.isOpen ? 'Open' : 'Closed'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-8 text-gray-500'>
                      No claims found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {current === 'Chats' && (
            <div className='bg-white flex flex-col flex-1 w-full h-full rounded-lg border border-gray-200 shadow-sm p-4'>
              <ItemChats />
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
                    className='w-5 h-5'
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
                name: 'Reports',
                icon: (
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                ),
              },
              {
                name: 'Claims',
                icon: (
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                    />
                  </svg>
                ),
              },
              {
                name: 'Chats',
                icon: (
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    />
                  </svg>
                ),
              },
            ].map((tab) => (
              <button
                key={tab.name}
                onClick={() => handleCurrentChange(tab.name)}
                className={`flex flex-col hover:cursor-pointer items-center py-1 px-2 rounded ${
                  current === tab.name ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                <div className='mb-1'>{tab.icon}</div>
                <div className='text-xs font-medium'>{tab.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <Modal open={showClaimModal} setOpen={setShowClaimModal}>
        <div className='max-w-md mx-auto bg-white rounded-lg p-6'>
          <h2 className='text-xl font-bold text-black mb-4'>
            Claim Item: {selectedItemForClaim?.itemName}
          </h2>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-bold text-black mb-2'>
                Claim explanation*
              </label>
              <textarea
                onChange={(v) => setClaimComment(v.target.value)}
                value={claimComment}
                rows={4}
                placeholder='Explain why this item belongs to you...'
                className='w-full placeholder-gray-400 text-black rounded-md border border-gray-300 px-3 py-2 text-sm'
              />
            </div>
            <div className='flex space-x-3'>
              <button
                onClick={() => {
                  createClaimForm();
                  setShowClaimModal(false);
                }}
                className='flex-1 bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white py-2 rounded-md font-semibold'
              >
                Submit Claim
              </button>
              <button
                onClick={() => {
                  setShowClaimModal(false);
                  setClaimComment('');
                }}
                className='flex-1 bg-gray-400 hover:bg-gray-500 hover:cursor-pointer text-white py-2 rounded-md font-semibold'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Mobile Item Modal */}
      <Modal open={showItemModal} setOpen={setShowItemModal}>
        {selectedItem && (
          <div className='max-w-md mx-auto bg-white rounded-lg p-6'>
            <h2 className='text-xl font-bold text-black mb-4'>
              {selectedItem.itemName}
            </h2>
            <div className='space-y-4'>
              <div>
                <p className='text-sm font-semibold text-black'>Description:</p>
                <p className='text-sm text-black'>{selectedItem.description}</p>
              </div>
              <div>
                <p className='text-sm font-semibold text-black'>Posted by:</p>
                <p className='text-sm text-black'>
                  {selectedItem.author?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <p className='text-sm font-semibold text-black'>Date:</p>
                <p className='text-sm text-black'>
                  {dayjs(selectedItem.createdAt).format('MM/DD/YYYY h:mm a')}
                </p>
              </div>
              {selectedItem.photos && selectedItem.photos.length > 0 && (
                <div>
                  <p className='text-sm font-semibold text-black mb-2'>
                    Photos ({selectedItem.photos.length}):
                  </p>
                  <div className='grid grid-cols-2 gap-2'>
                    {selectedItem.photos.map((photo) => (
                      <img
                        key={photo.id}
                        src={`data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`}
                        alt='photo'
                        className='w-full h-24 object-cover rounded cursor-pointer'
                        onClick={() => {
                          setSelectedImageData(
                            `data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`,
                          );
                          setShowImageModal(true);
                          setShowItemModal(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={() => setShowItemModal(false)}
                className='w-full bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white py-2 rounded-md font-semibold'
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Shared Modal */}
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
                className='px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md'
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
