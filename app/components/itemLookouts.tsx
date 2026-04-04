'use client';

import { useEffect, useState } from 'react';
import CreateItemLookoutModal from './createItemLookouts';
import Modal from './modal';
import { a } from '../config';
import Success from './success';
import { truncate } from '../helpers';
import dayjs from 'dayjs';

const ItemLookouts = () => {
  const [userLookouts, setUserLookouts] = useState<IItemLookout[]>([]);
  const [selectedLookout, setSelectedLookout] = useState<IItemLookout>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [showItemDetailsModal, setShowItemDetailsModal] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState<IItem | null>(
    null,
  );
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedItemForClaim, setSelectedItemForClaim] =
    useState<IItem | null>(null);
  const [claimComment, setClaimComment] = useState('');
  const [createClaimSuccess, setCreateClaimSuccess] = useState(false);
  const [isMarkingDone, setIsMarkingDone] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageData, setSelectedImageData] = useState<string | null>(
    null,
  );

  const currentUserId = JSON.parse(
    typeof window !== 'undefined' ? localStorage.getItem('user') || '{}' : '{}',
  ).id;

  const hasClaim = (item: IItem) =>
    item.claims?.some((c) => c.userId === currentUserId);

  const getUserLookouts = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
      const { data: response } = await a.get(`/users/${userId}`);
      if (response.itemLookouts) {
        setUserLookouts(response.itemLookouts);
        if (response.itemLookouts.length > 0) {
          setSelectedLookout(response.itemLookouts[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching user lookouts:', error);
    }
  };

  useEffect(() => {
    const fetchLookouts = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
        const { data: response } = await a.get(`/users/${userId}`);
        if (response.itemLookouts) {
          setUserLookouts(response.itemLookouts);
          if (response.itemLookouts.length > 0) {
            setSelectedLookout(response.itemLookouts[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching user lookouts:', error);
      }
    };
    fetchLookouts();
  }, []);

  const handleCreateSuccess = async () => {
    setCreateSuccess(true);
    await getUserLookouts();
    const timer = setTimeout(() => {
      setCreateSuccess(false);
    }, 3000);
    return () => clearTimeout(timer);
  };

  const markLookoutAsDone = async () => {
    if (!selectedLookout) return;
    try {
      setIsMarkingDone(true);
      await a.put(`/itemLookouts/${selectedLookout.id}`, { status: 'CLOSED' });
      await getUserLookouts();
      setCreateSuccess(true);
      const timer = setTimeout(() => {
        setCreateSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error marking lookout as done:', error);
      alert('Error marking lookout as done');
    } finally {
      setIsMarkingDone(false);
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
      setShowClaimModal(false);
      if (response) {
        setCreateClaimSuccess(true);
        const fetchLookouts = async () => {
          try {
            const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
            const { data: response } = await a.get(`/users/${userId}`);
            if (response.itemLookouts) {
              setUserLookouts(response.itemLookouts);
              if (response.itemLookouts.length > 0) {
                setSelectedLookout(response.itemLookouts[0]);
              }
            }
          } catch (error) {
            console.error('Error fetching user lookouts:', error);
          }
        };
        fetchLookouts();
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
      <div className='absolute top-0 right-0 pointer-events-none z-0'>
        <Success
          title={'Success!'}
          description={
            createClaimSuccess ? 'Claim submitted' : 'Item lookout created'
          }
          show={createSuccess || createClaimSuccess}
          setShow={
            createClaimSuccess ? setCreateClaimSuccess : setCreateSuccess
          }
        />
      </div>

      {/* Desktop Version */}
      <div className='hidden lg:flex h-screen w-full overflow-hidden'>
        <div className='w-full h-screen flex flex-col space-y-8 p-8'>
          {/* Header */}
          <div className='bg-white rounded-lg border border-gray-300 shadow-md'>
            <div className='border-b border-gray-300 px-6 py-6 flex justify-between items-center'>
              <p className='font-bold text-2xl text-black'>My Item Lookouts</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className='bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer font-bold text-white rounded-md px-4 py-2'
              >
                Create Item Lookout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className='flex flex-1 gap-4 overflow-hidden'>
            {/* Lookouts List */}
            <div className='w-1/3 bg-white rounded-lg border border-gray-300 shadow-md overflow-y-auto'>
              {userLookouts && userLookouts.length > 0 ? (
                <div>
                  {userLookouts.map((lookout) => (
                    <div
                      key={lookout?.id}
                      onClick={() => setSelectedLookout(lookout)}
                      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                        selectedLookout?.id === lookout?.id
                          ? 'bg-indigo-50 border-l-4 border-l-indigo-500'
                          : ''
                      }`}
                    >
                      <div className='flex justify-between items-start'>
                        <div>
                          <p className='font-semibold text-indigo-800'>
                            Item Lookout {lookout?.id}
                          </p>
                          <p className='text-indigo-600 text-xs mt-2'>
                            Created on{' '}
                            {dayjs(lookout?.createdAt).format('MMM D, YYYY')}
                          </p>
                          <p className='text-indigo-600 text-xs mt-2'>
                            {lookout?.items?.length || 0} matches
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded ${
                            lookout?.status === 'CLOSED'
                              ? 'bg-gray-200 text-gray-700'
                              : 'bg-green-200 text-green-700'
                          }`}
                        >
                          {lookout?.status === 'CLOSED' ? 'Closed' : 'Open'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='p-8 text-center text-gray-500'>
                  <p className='text-sm'>No lookouts yet</p>
                </div>
              )}
            </div>

            {/* Lookout Details */}
            <div className='w-2/3 bg-white rounded-lg border border-gray-300 shadow-md overflow-y-auto'>
              {selectedLookout ? (
                <div className='p-6'>
                  <div className='space-y-6'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <h2 className='font-bold text-2xl text-black mb-4'>
                          Item Lookout {selectedLookout.id}
                        </h2>
                        <p className='text-gray-700 text-sm whitespace-pre-wrap'>
                          {selectedLookout.description}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded whitespace-nowrap ${
                          selectedLookout?.status === 'CLOSED'
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-green-200 text-green-700'
                        }`}
                      >
                        {selectedLookout?.status === 'CLOSED'
                          ? 'Closed'
                          : 'Open'}
                      </span>
                    </div>

                    <div>
                      <p className='font-bold text-gray-900 mb-2'>
                        Created:{' '}
                        {dayjs(selectedLookout.createdAt).format('MMM D, YYYY')}
                      </p>
                      {selectedLookout?.status !== 'CLOSED' && (
                        <button
                          onClick={() => markLookoutAsDone()}
                          disabled={isMarkingDone}
                          className='mt-4 hover:cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold disabled:bg-gray-400'
                        >
                          {isMarkingDone ? 'Marking...' : 'Mark as Closed'}
                        </button>
                      )}
                    </div>

                    {/* Matched Items */}
                    {selectedLookout.items &&
                      selectedLookout.items.length > 0 && (
                        <div>
                          <h3 className='font-bold text-lg text-black mb-4'>
                            Matched Items ({selectedLookout.items.length})
                          </h3>
                          <div className='space-y-3'>
                            {selectedLookout.items.map((item) => (
                              <div
                                key={item.id}
                                className='p-3 border border-gray-300 rounded-lg'
                              >
                                <p className='font-semibold text-black text-sm'>
                                  {item.itemName}
                                </p>
                                <p className='text-gray-600 text-xs mt-1'>
                                  {truncate(item.description, 100)}
                                </p>
                                <div className='flex gap-2 mt-3'>
                                  <button
                                    onClick={() => {
                                      setSelectedItemDetail(item);
                                      setShowItemDetailsModal(true);
                                    }}
                                    className='text-xs hover:cursor-pointer font-semibold bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded'
                                  >
                                    View Details
                                  </button>
                                  {hasClaim(item) ? (
                                    <span className='text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-300 px-3 py-1 rounded'>
                                      Claim Submitted
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setSelectedItemForClaim(item);
                                        setShowClaimModal(true);
                                      }}
                                      className='text-xs hover:cursor-pointer font-semibold bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded'
                                    >
                                      Claim Item
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {!selectedLookout.items ||
                    selectedLookout.items.length === 0 ? (
                      <div className='p-4 bg-gray-50 rounded-lg text-center'>
                        <p className='text-gray-500 text-sm'>
                          No matches found yet
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className='flex items-center justify-center h-full'>
                  <p className='text-gray-500'>
                    Select a lookout to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className='lg:hidden flex flex-col bg-white h-screen overflow-hidden'>
        {/* Mobile Header */}
        <div className='m-4 bg-white rounded-lg border border-gray-300 shadow-md flex-shrink-0'>
          <div className='px-4 py-4 flex justify-between items-center'>
            <p className='font-bold text-xl text-black'>My Item Lookouts</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className='bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-md px-3 py-2'
            >
              + Create
            </button>
          </div>
        </div>

        {!selectedLookout ? (
          /* Mobile Lookouts List */
          <div className='flex-1 overflow-y-auto px-4 pb-4 space-y-3'>
            {userLookouts.length > 0 ? (
              userLookouts.map((lookout) => (
                <div
                  key={lookout.id}
                  onClick={() => setSelectedLookout(lookout)}
                  className='p-4 bg-white rounded-lg border border-gray-300 shadow-sm cursor-pointer'
                >
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='font-semibold text-indigo-800'>
                        Item Lookout {lookout.id}
                      </p>
                      <p className='text-gray-500 text-xs mt-1'>
                        {dayjs(lookout.createdAt).format('MMM D, YYYY')}
                      </p>
                      <p className='text-indigo-600 text-xs mt-1'>
                        {lookout.items?.length || 0} matches
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded ${
                        lookout.status === 'CLOSED'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-green-200 text-green-700'
                      }`}
                    >
                      {lookout.status === 'CLOSED' ? 'Closed' : 'Open'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center py-12'>
                <p className='text-gray-500 text-sm'>No lookouts yet</p>
              </div>
            )}
          </div>
        ) : (
          /* Mobile Lookout Detail */
          <div className='flex-1 overflow-y-auto px-4 pb-4'>
            <button
              onClick={() => setSelectedLookout(undefined)}
              className='flex items-center text-indigo-600 text-sm font-semibold mb-4'
            >
              ← Back
            </button>
            <div className='bg-white rounded-lg border border-gray-300 shadow-sm p-4 space-y-4'>
              <div className='flex justify-between items-start'>
                <h2 className='font-bold text-xl text-black'>
                  Item Lookout {selectedLookout.id}
                </h2>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    selectedLookout.status === 'CLOSED'
                      ? 'bg-gray-200 text-gray-700'
                      : 'bg-green-200 text-green-700'
                  }`}
                >
                  {selectedLookout.status === 'CLOSED' ? 'Closed' : 'Open'}
                </span>
              </div>
              <p className='text-gray-700 text-sm whitespace-pre-wrap'>
                {selectedLookout.description}
              </p>
              <p className='text-gray-500 text-xs'>
                Created:{' '}
                {dayjs(selectedLookout.createdAt).format('MMM D, YYYY')}
              </p>
              {selectedLookout.status !== 'CLOSED' && (
                <button
                  onClick={markLookoutAsDone}
                  disabled={isMarkingDone}
                  className='w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md font-semibold text-sm disabled:bg-gray-400'
                >
                  {isMarkingDone ? 'Marking...' : 'Mark as Closed'}
                </button>
              )}

              {/* Mobile Matched Items */}
              {selectedLookout.items && selectedLookout.items.length > 0 ? (
                <div>
                  <h3 className='font-bold text-base text-black mb-3'>
                    Matched Items ({selectedLookout.items.length})
                  </h3>
                  <div className='space-y-3'>
                    {selectedLookout.items.map((item) => (
                      <div
                        key={item.id}
                        className='p-3 border border-gray-300 rounded-lg'
                      >
                        <p className='font-semibold text-black text-sm'>
                          {item.itemName}
                        </p>
                        <p className='text-gray-600 text-xs mt-1'>
                          {truncate(item.description, 80)}
                        </p>
                        <div className='flex gap-2 mt-3'>
                          <button
                            onClick={() => {
                              setSelectedItemDetail(item);
                              setShowItemDetailsModal(true);
                            }}
                            className='text-xs font-semibold bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded'
                          >
                            View Details
                          </button>
                          {hasClaim(item) ? (
                            <span className='text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-300 px-3 py-1 rounded'>
                              Claim Submitted
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedItemForClaim(item);
                                setShowClaimModal(true);
                              }}
                              className='text-xs font-semibold bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded'
                            >
                              Claim Item
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='p-4 bg-gray-50 rounded-lg text-center'>
                  <p className='text-gray-500 text-sm'>No matches found yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <CreateItemLookoutModal
        open={showCreateModal}
        setOpen={setShowCreateModal}
        onSuccess={handleCreateSuccess}
      />

      {/* Item Details Modal */}
      <Modal open={showItemDetailsModal} setOpen={setShowItemDetailsModal}>
        <div className='max-w-2xl mx-auto bg-white rounded-lg p-6'>
          {selectedItemDetail && (
            <>
              <h2 className='text-2xl font-bold text-black mb-4'>
                {selectedItemDetail.itemName}
              </h2>
              <div className='space-y-4'>
                <div>
                  <p className='text-sm font-bold text-gray-900 mb-2'>
                    Description
                  </p>
                  <p className='text-gray-700 text-sm whitespace-pre-wrap'>
                    {selectedItemDetail.description}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-bold text-gray-900 mb-2'>
                    Date Posted
                  </p>
                  <p className='text-gray-700 text-sm'>
                    {dayjs(selectedItemDetail.createdAt).format('MMM D, YYYY')}
                  </p>
                </div>
                {selectedItemDetail.photos &&
                  selectedItemDetail.photos.length > 0 && (
                    <div>
                      <p className='text-sm font-bold text-gray-900 mb-3'>
                        Photos
                      </p>
                      <div className='grid grid-cols-2 gap-4'>
                        {selectedItemDetail.photos.map((photo) => (
                          <div
                            key={photo.id}
                            onClick={() => {
                              setSelectedImageData(
                                `data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`,
                              );
                              setShowImageModal(true);
                            }}
                            className='bg-gray-50 w-fit p-2 rounded-lg hover:cursor-pointer'
                          >
                            <img
                              src={`data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`}
                              alt='photo'
                              className='max-h-40 rounded-md'
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                <button
                  onClick={() => setShowItemDetailsModal(false)}
                  className='w-full hover:cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-md font-semibold'
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

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
                className='px-4 hover:cursor-pointer py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md'
              >
                Close
              </button>
            </>
          )}
        </div>
      </Modal>

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
    </div>
  );
};

export default ItemLookouts;
