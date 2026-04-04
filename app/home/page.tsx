'use client';

import { useEffect, useRef, useState } from 'react';
import ItemChats from '../components/itemChats';
import SideNav from '../components/sidenav';
import { a } from '../config';
import Success from '../components/success';
import { truncate } from '../helpers';
import dayjs from 'dayjs';
import Modal from '../components/modal';
import { DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/solid';
import ItemLookouts from '../components/itemLookouts';
import { MapPinIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const [current, setCurrent] = useState('All Items');
  const [mobileTab, setMobileTab] = useState(() => {
    // Initialize based on current value
    return 'Reports';
  });
  const [showItemModal, setShowItemModal] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemLocation, setNewItemLocation] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [createSubmissionFormSuccess, setCreateSubmissionFormSuccess] =
    useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[] | null>(null);

  // Locations state
  const [locations, setLocations] = useState<ILocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(
    null,
  );
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // All Items state
  const [unclaimedItems, setUnclaimedItems] = useState<IItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<IItem>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [searchType, setSearchType] = useState<'text' | 'image' | 'location'>(
    'text',
  );
  const [selectedSearchImage, setSelectedSearchImage] =
    useState<string>('None');
  const imageSearchRef = useRef<HTMLInputElement>(null);
  const [locationFilter, setLocationFilter] = useState<number | null>(null);
  const [showLocationFilterModal, setShowLocationFilterModal] = useState(false);
  const [filterSearchQuery, setFilterSearchQuery] = useState('');

  // Submit Claims state
  const [selectedItemForClaim, setSelectedItemForClaim] =
    useState<IItem | null>(null);
  const [claimComment, setClaimComment] = useState('');
  const [createClaimSuccess, setCreateClaimSuccess] = useState(false);
  const [claimSearchOpen, setClaimSearchOpen] = useState(false);
  const [claimSearchQuery, setClaimSearchQuery] = useState('');
  const claimSearchRef = useRef<HTMLDivElement>(null);

  const [userReports, setUserReports] = useState<ISubmission[]>([]);
  const [selectedUserReport, setSelectedUserReport] = useState<ISubmission>();
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCreateItemLookout, setShowCreateItemLookout] = useState(false);
  const [createItemLookoutSuccess, setCreateItemLookoutSuccess] =
    useState(false);
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

  const searchItemByText = async (query: string) => {
    if (!query.trim()) {
      setFilteredItems(unclaimedItems);
      return;
    }
    try {
      const { data: response } = await a.post('/items/search/text', {
        query: query,
      });
      console.log(response);
      const unclaimedOnly = response.filter((item: IItem) => !item.claimed);
      setFilteredItems(unclaimedOnly);
    } catch (error) {
      console.error('Error searching items:', error);
    }
  };

  const searchItemsByLocation = async () => {
    if (locationFilter === null) {
      return;
    }
    try {
      const { data: response } = await a.post('/items/search/location', {
        locationId: locationFilter,
      });
      const unclaimedOnly = response.filter((item: IItem) => !item.claimed);
      setFilteredItems(unclaimedOnly);
    } catch (error) {
      console.error('Error searching items by location:', error);
    }
  };

  const searchItemsByImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data: response } = await a.post('/items/search/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      const unclaimedOnly = response.filter((item: IItem) => !item.claimed);
      setFilteredItems(unclaimedOnly);
    } catch (error) {
      console.error('Error searching items by image:', error);
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

  const getLocations = async () => {
    try {
      const { data: response } = await a.get('/locations');
      setLocations(response);
      console.log(response);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const closeLocationFilterModal = () => {
    setShowLocationFilterModal(false);
    setFilterSearchQuery('');
  };

  const hasUserClaimedItem = (itemId: number) => {
    return userClaims.some(
      (claim) => claim.item?.id === itemId && claim.isOpen,
    );
  };

  const handleCurrentChange = (newCurrent: string) => {
    setCurrent(newCurrent);
    setLocationFilter(null);
    setFilterSearchQuery('');
    setSearchQuery('');
    setSearchType('text');
    setFilteredItems(unclaimedItems);
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
      await getLocations();
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
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setLocationDropdownOpen(false);
      }
    };

    if (claimSearchOpen || locationDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [claimSearchOpen, locationDropdownOpen]);

  const createSubmissionForm = async () => {
    const { data: response } = await a.post('/submissionForms', {
      itemName: newItemName,
      description: newItemDescription,
      userId: JSON.parse(localStorage.getItem('user') || '{}').id,
      locationId: selectedLocation?.id,
    });

    const formData = new FormData();
    if (selectedPhotos !== null) {
      for (let i = 0; i < selectedPhotos?.length; i++) {
        formData.append('photos', selectedPhotos[i]);
      }
      formData.append('submissionFormId', response.id.toString());
      await a.post('/photos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    setSelectedPhotos(null);
    setNewItemDescription('');
    setNewItemName('');
    setSelectedLocation(null);
    setLocationSearchQuery('');
    if (response) {
      await getUserReports();
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
        await getUserClaims();
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

  const selectedLocationName =
    locationFilter !== null
      ? (locations.find((loc) => loc.id === locationFilter)?.name ?? 'None')
      : 'None';

  return (
    <div className='w-full h-screen'>
      {/* Desktop Version */}
      <div className='hidden lg:flex bg-grid h-screen w-full overflow-hidden bg-white'>
        <div className='absolute top-0 right-0 pointer-events-none'>
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
                <div className='w-fit min-w-44 flex flex-col space-y-4 overflow-y-auto text-black'>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => {
                        setSearchType('text');
                        setSearchQuery('');
                        setSelectedSearchImage('None');
                        setLocationFilter(null);
                        setFilteredItems(unclaimedItems);
                      }}
                      className={`p-2 rounded-md transition-colors hover:cursor-pointer ${
                        searchType === 'text'
                          ? 'bg-indigo-500'
                          : 'bg-gray-400 hover:bg-gray-500'
                      }`}
                    >
                      <DocumentTextIcon className='w-5 h-5 text-gray-100' />
                    </button>
                    <button
                      onClick={() => {
                        setSearchType('image');
                        setSelectedSearchImage('None');
                        setFilteredItems(unclaimedItems);
                        if (imageSearchRef.current) {
                          imageSearchRef.current.value = '';
                        }
                      }}
                      className={`p-2 rounded-md transition-colors hover:cursor-pointer ${
                        searchType === 'image'
                          ? 'bg-indigo-500'
                          : 'bg-gray-400 hover:bg-gray-500'
                      }`}
                    >
                      <PhotoIcon className='w-5 h-5 text-gray-100' />
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        setSearchType('location');
                        setFilteredItems(unclaimedItems);
                        setSearchQuery('');
                      }}
                      className={`p-2 rounded-md transition-colors hover:cursor-pointer ${
                        searchType === 'location'
                          ? 'bg-indigo-500'
                          : 'bg-gray-400 hover:bg-gray-500'
                      }`}
                    >
                      <MapPinIcon className='w-5 h-5 text-gray-100' />
                    </button>
                  </div>
                  <div className='mb-4'>
                    {searchType === 'text' && (
                      <div className='flex gap-2'>
                        <input
                          type='text'
                          placeholder='Search items...'
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            searchItemByText(e.target.value);
                          }}
                          className='flex-1 w-fit rounded-md border border-gray-300 px-3 py-2 text-sm outline-none'
                        />
                      </div>
                    )}
                    {searchType === 'image' && (
                      <div className='flex flex-col gap-2'>
                        <label>
                          <input
                            ref={imageSearchRef}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setSelectedSearchImage(e.target.files[0].name);
                                searchItemsByImage(e.target.files[0]);
                              }
                            }}
                            type='file'
                            accept='.png, .jpg, .jpeg, .webp'
                            hidden
                          />
                          <div className='flex w-full h-10 px-3 flex-col bg-indigo-500 rounded-md shadow text-white text-sm font-semibold items-center justify-center hover:cursor-pointer hover:bg-indigo-600'>
                            Select Image
                          </div>
                        </label>
                        <div className='text-black text-xs font-semibold'>
                          Selected Image: {selectedSearchImage}
                        </div>
                      </div>
                    )}
                    {searchType === 'location' && (
                      <div className='flex flex-col gap-2'>
                        <div
                          onClick={() => setShowLocationFilterModal(true)}
                          className='flex w-full h-10 px-3 flex-col bg-indigo-500 rounded-md shadow text-white text-sm font-semibold items-center justify-center hover:cursor-pointer hover:bg-indigo-600'
                        >
                          Select Location
                        </div>
                        <div className='text-black text-xs font-semibold'>
                          Selected Location: {selectedLocationName}
                        </div>
                      </div>
                    )}
                  </div>

                  {filteredItems.filter(
                    (item) =>
                      locationFilter === null ||
                      item.location?.id === locationFilter,
                  ).length ? (
                    filteredItems
                      .filter(
                        (item) =>
                          locationFilter === null ||
                          item.location?.id === locationFilter,
                      )
                      .map((item: IItem, i) => {
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
                                <p className='font-medium text-xs mt-2  text-gray-500'>
                                  Posted by: {item.author?.name || 'Unknown'}
                                </p>
                                <p className='font-medium text-xs mt-1  text-gray-500'>
                                  Posted on{' '}
                                  {dayjs(item.createdAt).format('MM/DD/YYYY')}
                                </p>
                                {item.location && (
                                  <p className='font-medium text-xs mt-1 text-gray-500'>
                                    {item.location.name}
                                    {item.location.teacher
                                      ? ` — ${item.location.teacher}`
                                      : ''}
                                  </p>
                                )}
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
                      <div className='border-b border-gray-300 h-fit'>
                        <div className='px-6 py-6'>
                          <p className='font-bold text-2xl text-black'>
                            {selectedItem.itemName}
                          </p>
                          <p className='font-medium text-gray-500 mt-1 text-sm'>
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
                          <p className='text-sm text-gray-500'>
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
                          <p className='text-sm text-gray-500 whitespace-pre-wrap'>
                            {selectedItem.description}
                          </p>
                        </div>
                        <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                          <p className='text-lg font-bold text-black'>
                            Location
                          </p>
                          <p className='text-sm text-gray-500'>
                            {selectedItem.location?.name || 'Unknown'}
                            {selectedItem.location?.teacher && (
                              <span className=' text-gray-500'>
                                {' '}
                                &mdash; {selectedItem.location.teacher}
                              </span>
                            )}
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
                                    <p className='text-xs  text-gray-500'>
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
                <div className='border-b border-gray-300 h-fit'>
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
                    <div>
                      <label className='block text-sm/6 font-bold text-gray-900'>
                        Location Found*
                      </label>
                      <div className='mt-2 relative' ref={locationDropdownRef}>
                        <button
                          type='button'
                          onClick={() =>
                            setLocationDropdownOpen(!locationDropdownOpen)
                          }
                          className='block w-full text-gray-600 rounded-md bg-white px-3 py-1.5 text-left text-sm outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 hover:cursor-pointer'
                        >
                          {selectedLocation
                            ? selectedLocation.name
                            : 'Select a location...'}
                        </button>
                        {locationDropdownOpen && (
                          <div className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto border border-gray-300 sm:text-sm'>
                            <div className='px-3 py-2'>
                              <input
                                type='text'
                                placeholder='Search locations...'
                                value={locationSearchQuery}
                                onChange={(e) =>
                                  setLocationSearchQuery(e.target.value)
                                }
                                className='block w-full rounded-md bg-gray-50 px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
                              />
                            </div>
                            <div className='border-t border-gray-200'>
                              {locations
                                .filter((location) => {
                                  const q = locationSearchQuery.toLowerCase();
                                  return (
                                    location.name.toLowerCase().includes(q) ||
                                    (location.teacher ?? '')
                                      .toLowerCase()
                                      .includes(q)
                                  );
                                })
                                .map((location) => (
                                  <button
                                    key={location.id}
                                    type='button'
                                    onClick={() => {
                                      setSelectedLocation(location);
                                      setLocationDropdownOpen(false);
                                      setLocationSearchQuery('');
                                    }}
                                    className='w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none hover:cursor-pointer'
                                  >
                                    <div className='font-medium text-gray-900'>
                                      {location.name}
                                    </div>
                                    {location.teacher && (
                                      <div className='text-sm text-gray-600'>
                                        Teacher: {location.teacher}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              {locations.filter((location) => {
                                const q = locationSearchQuery.toLowerCase();
                                return (
                                  location.name.toLowerCase().includes(q) ||
                                  (location.teacher ?? '')
                                    .toLowerCase()
                                    .includes(q)
                                );
                              }).length === 0 && (
                                <div className='px-3 py-2 text-sm text-gray-500'>
                                  No locations found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
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
                            accept='.png, .jpg, .jpeg, .webp'
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
                <div className='border-b border-gray-300 h-fit'>
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
                                  <p className='text-xs  text-gray-500'>
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
                        <p className='text-sm text-gray-500 mt-1'>
                          {selectedItemForClaim.description}
                        </p>
                        <p className='text-xs  text-gray-500 mt-2'>
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
                              <p className='font-medium text-xs mt-2  text-gray-500'>
                                Status: {v.approvalStatus}
                              </p>
                              <p className='font-medium text-xs mt-1  text-gray-500'>
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
                      <div className='border-b border-gray-300 h-fit'>
                        <div className='px-6 py-6'>
                          <p className='font-bold text-2xl text-black'>
                            {selectedUserReport.itemName}
                          </p>
                          <p className='font-medium text-gray-500 mt-1 text-sm'>
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
                          <p className='text-sm text-gray-500'>
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
                          <p className='text-sm text-gray-500 whitespace-pre-wrap'>
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
                                    <p className='text-xs  text-gray-500'>
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
                              <p className='font-medium text-xs mt-2  text-gray-500'>
                                Status: {v.isOpen ? 'Open' : 'Closed'}
                              </p>
                              <p className='font-medium text-xs mt-1  text-gray-500'>
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
                      <div className='border-b border-gray-300 h-fit'>
                        <div className='px-6 py-6'>
                          <p className='font-bold text-2xl text-black'>
                            {selectedClaim.item?.itemName}
                          </p>
                          <p className='font-medium text-gray-500 mt-1 text-sm'>
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
                          <p className='text-sm text-gray-500'>
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
                            Comment
                          </p>
                          <p className='text-sm text-gray-500 whitespace-pre-wrap'>
                            {selectedClaim.comment}
                          </p>
                        </div>
                        <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                          <p className='text-lg font-bold text-black'>
                            Item Details
                          </p>
                          <p className='text-sm text-gray-500 whitespace-pre-wrap'>
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
                                    <p className='text-xs  text-gray-500'>
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
          {current === 'Item Lookouts' && (
            <div className='w-full h-full'>
              <ItemLookouts />
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
              <div className='mb-4 space-y-2'>
                <button
                  type='button'
                  onClick={() => setShowLocationFilterModal(true)}
                  className='block w-full rounded-md bg-white px-3 py-2 text-left text-sm text-gray-900 border border-gray-300 hover:cursor-pointer'
                >
                  {locationFilter
                    ? (() => {
                        const loc = locations.find(
                          (l) => l.id === locationFilter,
                        );
                        return loc
                          ? `${loc.name}${loc.teacher ? ` — ${loc.teacher}` : ''}`
                          : 'All Locations';
                      })()
                    : 'All Locations'}
                </button>
                <input
                  type='text'
                  placeholder='Search items...'
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchItemByText(e.target.value);
                  }}
                  className='w-full outline-none rounded-md border border-gray-300 px-3 py-2 text-sm'
                />
              </div>
              {filteredItems.filter(
                (item) =>
                  locationFilter === null ||
                  item.location?.id === locationFilter,
              ).length ? (
                filteredItems
                  .filter(
                    (item) =>
                      locationFilter === null ||
                      item.location?.id === locationFilter,
                  )
                  .map((item: IItem, i) => (
                    <div
                      key={i}
                      className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'
                    >
                      <h3 className='font-bold text-lg text-black'>
                        {item.itemName}
                      </h3>
                      <p className='text-sm text-gray-500 mt-2'>
                        {truncate(item.description, 100)}
                      </p>
                      <div className='flex justify-between items-center mt-3'>
                        <div>
                          <p className='text-xs  text-gray-500'>
                            By: {item.author?.name || 'Unknown'}
                          </p>
                          <p className='text-xs  text-gray-500'>
                            {dayjs(item.createdAt).format('MM/DD/YYYY')}
                          </p>
                          {item.location && (
                            <p className='text-xs text-indigo-600'>
                              {item.location.name}
                              {item.location.teacher
                                ? ` — ${item.location.teacher}`
                                : ''}
                            </p>
                          )}
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
                <div className='text-center py-8  text-gray-500'>
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
                        Location Found*
                      </label>
                      <div className='relative' ref={locationDropdownRef}>
                        <button
                          type='button'
                          onClick={() =>
                            setLocationDropdownOpen(!locationDropdownOpen)
                          }
                          className='w-full text-gray-300 rounded-md border border-gray-300 px-3 py-2 text-left text-sm bg-white hover:cursor-pointer'
                        >
                          {selectedLocation
                            ? selectedLocation.name
                            : 'Select a location...'}
                          <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                            <svg
                              className='h-4 w-4 text-gray-400'
                              viewBox='0 0 20 20'
                              fill='currentColor'
                            >
                              <path
                                fillRule='evenodd'
                                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </span>
                        </button>
                        {locationDropdownOpen && (
                          <div className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                            <div className='px-3 py-2'>
                              <input
                                type='text'
                                placeholder='Search locations...'
                                value={locationSearchQuery}
                                onChange={(e) =>
                                  setLocationSearchQuery(e.target.value)
                                }
                                className='block w-full rounded-md bg-gray-50 px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600'
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                            <div className='border-t border-gray-200'>
                              {locations
                                .filter((location) => {
                                  const q = locationSearchQuery.toLowerCase();
                                  return (
                                    location.name.toLowerCase().includes(q) ||
                                    (location.teacher ?? '')
                                      .toLowerCase()
                                      .includes(q)
                                  );
                                })
                                .map((location) => (
                                  <button
                                    key={location.id}
                                    type='button'
                                    onClick={() => {
                                      setSelectedLocation(location);
                                      setLocationDropdownOpen(false);
                                      setLocationSearchQuery('');
                                    }}
                                    className='w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none hover:cursor-pointer'
                                  >
                                    <div className='font-medium text-gray-900'>
                                      {location.name}
                                    </div>
                                    {location.teacher && (
                                      <div className='text-sm text-gray-600'>
                                        Teacher: {location.teacher}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              {locations.filter((location) => {
                                const q = locationSearchQuery.toLowerCase();
                                return (
                                  location.name.toLowerCase().includes(q) ||
                                  (location.teacher ?? '')
                                    .toLowerCase()
                                    .includes(q)
                                );
                              }).length === 0 && (
                                <div className='px-3 py-2 text-sm text-gray-500'>
                                  No locations found
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
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
                      <p className='text-xs text-gray-500 mt-1'>
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
                            <p className='text-sm text-gray-500 mt-1'>
                              {truncate(report.description, 80)}
                            </p>
                            <p className='text-xs  text-gray-500 mt-2'>
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
                    <div className='text-center py-8  text-gray-500'>
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
                                  <p className='text-xs  text-gray-500'>
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
                        <p className='text-xs text-gray-500 mt-1'>
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
                            <p className='text-sm text-gray-500 mt-1'>
                              {truncate(claim.comment, 80)}
                            </p>
                            <p className='text-xs  text-gray-500 mt-2'>
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
                    <div className='text-center py-8  text-gray-500'>
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
                  current === tab.name ? 'text-indigo-600' : ' text-gray-500'
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

      <Modal open={showLocationFilterModal} setOpen={closeLocationFilterModal}>
        <div className='max-w-md mx-auto bg-white rounded-lg p-6 space-y-5'>
          <h2 className='text-xl font-bold text-black'>Filter by Location</h2>
          <div>
            <input
              type='text'
              placeholder='Search locations...'
              value={filterSearchQuery}
              onChange={(e) => setFilterSearchQuery(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none mb-2'
            />
            <div className='border border-gray-200 rounded-md max-h-64 overflow-y-auto'>
              <button
                type='button'
                onClick={() => {
                  setLocationFilter(null);
                  closeLocationFilterModal();
                }}
                className={`w-full text-left px-3 py-2 hover:bg-gray-50 hover:cursor-pointer text-sm border-b border-gray-100 ${
                  locationFilter === null
                    ? 'bg-indigo-50 font-semibold text-indigo-700'
                    : 'text-gray-700'
                }`}
              >
                All Locations
              </button>
              {locations
                .filter((loc) => {
                  const q = filterSearchQuery.toLowerCase();
                  return (
                    loc.name.toLowerCase().includes(q) ||
                    (loc.teacher ?? '').toLowerCase().includes(q)
                  );
                })
                .map((loc) => (
                  <button
                    key={loc.id}
                    type='button'
                    onClick={() => {
                      setLocationFilter(loc.id);
                      closeLocationFilterModal();
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 hover:cursor-pointer border-b border-gray-100 last:border-b-0 ${
                      locationFilter === loc.id ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div className='font-medium text-gray-900 text-sm'>{loc.name}</div>
                    {loc.teacher && (
                      <div className='text-xs text-gray-500'>Teacher: {loc.teacher}</div>
                    )}
                  </button>
                ))}
              {locations.filter((loc) => {
                const q = filterSearchQuery.toLowerCase();
                return (
                  loc.name.toLowerCase().includes(q) ||
                  (loc.teacher ?? '').toLowerCase().includes(q)
                );
              }).length === 0 && (
                <div className='px-3 py-2 text-sm text-gray-500'>No locations found</div>
              )}
            </div>
          </div>
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => { setLocationFilter(null); setFilterSearchQuery(''); }}
              className='flex-1 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer text-gray-700 font-semibold py-2 rounded-md text-sm'
            >
              Clear
            </button>
            <button
              type='button'
              onClick={closeLocationFilterModal}
              className='flex-1 bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white font-semibold py-2 rounded-md text-sm'
            >
              Done
            </button>
          </div>
        </div>
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
                className='px-4 hover:cursor-pointer py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md'
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
