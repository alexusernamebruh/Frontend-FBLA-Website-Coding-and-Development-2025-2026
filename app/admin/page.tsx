'use client';

import { useEffect, useRef, useState } from 'react';
import { a } from '../config';
import SideNav from '../components/sidenav';
import { truncate } from '../helpers';
import dayjs from 'dayjs';
import Success from '../components/success';
import Modal from '../components/modal';
import {
  DocumentTextIcon,
  PhotoIcon,
  HomeIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { useTutorial } from '../hooks/useTutorial';
import AdminCharts from '../components/adminCharts';

interface IAnalytics {
  totalItems: number;
  claimedItems: number;
  unclaimedItems: number;
  returnRate: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  totalClaims: number;
  openClaims: number;
  approvedClaims: number;
  totalLookouts: number;
  openLookouts: number;
  closedLookouts: number;
  locationStats: {
    id: number;
    name: string;
    itemCount: number;
    items: string[];
  }[];
  topKeywords: { word: string; count: number }[];
  submissionTrend: { date: string; count: number }[];
}

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [analytics, setAnalytics] = useState<IAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [currentPage, setCurrentPage] = useState('Analytics');
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

  const [locations, setLocations] = useState<ILocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<ILocation>();
  const [locationFilter, setLocationFilter] = useState<number | null>(null);
  const [filterSearchQuery, setFilterSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchType, setSearchType] = useState<'text' | 'image' | 'location'>(
    'text',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchImage, setSelectedSearchImage] =
    useState<string>('None');
  const [isSearchingImage, setIsSearchingImage] = useState(false);
  const [isSearchingText, setIsSearchingText] = useState(false);
  const [isSearchingDate, setIsSearchingDate] = useState(false);
  const imageSearchRef = useRef<HTMLInputElement>(null);
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationTeacher, setNewLocationTeacher] = useState('');
  const [editLocationName, setEditLocationName] = useState('');
  const [editLocationTeacher, setEditLocationTeacher] = useState('');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [locationCreateSuccess, setLocationCreateSuccess] = useState(false);
  const [locationEditSuccess, setLocationEditSuccess] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [locationItemSearchQuery, setLocationItemSearchQuery] = useState('');
  const [sortLocationsByItems, setSortLocationsByItems] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<ILocation[]>([]);

  // Filter modal states
  const [showTextFilterModal, setShowTextFilterModal] = useState(false);
  const [showImageFilterModal, setShowImageFilterModal] = useState(false);
  const [showLocationFilterModal, setShowLocationFilterModal] = useState(false);
  const [showDateFilterModal, setShowDateFilterModal] = useState(false);
  const [showAllLocationsFilterModal, setShowAllLocationsFilterModal] =
    useState(false);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [customDate, setCustomDate] = useState<string>('');

  const [isEditing, setIsEditing] = useState(false);
  const [editItemName, setEditItemName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRemovePhotoIds, setEditRemovePhotoIds] = useState<number[]>([]);
  const [editLocationId, setEditLocationId] = useState<number | null>(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageData, setSelectedImageData] = useState<string>('');

  const [showMobileDetailModal, setShowMobileDetailModal] = useState(false);
  const [mobileDetailType, setMobileDetailType] = useState<
    'item' | 'submission' | 'claim'
  >('item');
  const [showMobileEditModal, setShowMobileEditModal] = useState(false);
  const [gridMargins, setGridMargins] = useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = useState(false);

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
      } else {
        setSelectedPendingClaim(undefined);
      }
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
        await getPendingClaims();
        await getApprovedClaims();
        await getAllItemsData();
        if (selectedPendingClaim?.id === claimId) {
          setSelectedPendingClaim(undefined);
        }
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
        await getPendingClaims();
        await getApprovedClaims();
        await getAllItemsData();
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
      } else {
        setSelectedPending(undefined);
      }
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
        await getPendingSubmissions();
        await getApprovedSubmissions();
        await getRejectedSubmissions();
        await getAllItemsData();
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
        await getPendingSubmissions();
        await getApprovedSubmissions();
        await getRejectedSubmissions();
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
          locationId: editLocationId,
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
    setEditLocationId(submission.locationId || null);
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
    setEditLocationId(null);
  };

  const getAllItemsData = async () => {
    try {
      const { data: response } = await a.get('/items/all');
      setAllItems(response);
      setFilteredItems(response);
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

  const searchItemByText = async (query: string) => {
    if (!query.trim()) {
      setFilteredItems(allItems);
      return;
    }

    try {
      setIsSearchingText(true);
      const { data: response } = await a.post('/items/search/text', {
        query,
      });
      setFilteredItems(response);
    } catch (error) {
      console.error('Error searching items:', error);
    } finally {
      setIsSearchingText(false);
    }
  };

  const searchItemsByImage = async (file: File) => {
    try {
      setIsSearchingImage(true);
      const formData = new FormData();
      formData.append('image', file);

      const { data: response } = await a.post('/items/search/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setFilteredItems(response);
      setSelectedSearchImage(file.name);
    } catch (error) {
      console.error('Error searching items by image:', error);
    } finally {
      setIsSearchingImage(false);
    }
  };

  const searchItemsByDate = async (filter: string) => {
    try {
      setIsSearchingDate(true);
      const { data: response } = await a.post('/items/search/date', {
        filter,
      });
      setFilteredItems(response);
    } catch (error) {
      console.error('Error searching items by date:', error);
    } finally {
      setIsSearchingDate(false);
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

  const getLocations = async () => {
    try {
      const { data: response } = await a.get('/locations');
      setLocations(response);
      if (response.length > 0) {
        setSelectedLocation(response[0]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const createLocation = async () => {
    try {
      const { data: response } = await a.post('/locations', {
        name: newLocationName,
        teacher: newLocationTeacher,
      });
      if (response) {
        getLocations();
        setNewLocationName('');
        setNewLocationTeacher('');
        setLocationCreateSuccess(true);
        const timer = setTimeout(() => setLocationCreateSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  const editLocation = async (locationId: number) => {
    try {
      const { data: response } = await a.put(`/locations/${locationId}`, {
        name: editLocationName,
        teacher: editLocationTeacher,
      });
      if (response) {
        getLocations();
        setIsEditingLocation(false);
        setEditLocationName('');
        setEditLocationTeacher('');
        setLocationEditSuccess(true);
        const timer = setTimeout(() => setLocationEditSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error editing location:', error);
    }
  };

  const startEditLocation = (location: ILocation) => {
    setEditLocationName(location.name);
    setEditLocationTeacher(location.teacher || '');
    setIsEditingLocation(true);
  };

  const searchLocations = async (
    nameOrTeacher: string,
    itemName: string,
    sortByItems: boolean,
  ) => {
    try {
      const params = new URLSearchParams();
      if (nameOrTeacher.trim()) {
        params.append('searchTerm', nameOrTeacher);
      }
      if (itemName.trim()) {
        params.append('itemSearchTerm', itemName);
      }
      if (sortByItems) {
        params.append('sortByItems', 'true');
      }

      const { data: response } = await a.get(
        `/locations/search?${params.toString()}`,
      );
      setFilteredLocations(response);
      if (response.length > 0) {
        setSelectedLocation(response[0]);
      } else {
        setSelectedLocation(undefined);
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    }
  };

  const cancelEditLocation = () => {
    setIsEditingLocation(false);
    setEditLocationName('');
    setEditLocationTeacher('');
  };

  const startEditItem = (item: IItem) => {
    setEditItemName(item.itemName);
    setEditDescription(item.description);
    setEditRemovePhotoIds([]);
    setIsEditing(true);
  };

  const handleCurrentPageChange = (newPage: string) => {
    setCurrentPage(newPage);
    setLocationFilter(null);
    setFilterSearchQuery('');
  };

  const { startTutorial } = useTutorial([
    {
      element:
        '.bg-white.rounded-lg.border.border-gray-300.shadow-md.px-8.py-6 > p:first-child',
      intro:
        'Welcome to the Analytics Dashboard. This is your central hub for monitoring all Lost & Found activity.',
      position: 'bottom',
    },
    {
      element: '.grid.grid-cols-4.gap-5',
      intro:
        'These stat cards give you a quick overview: total items, return rate, pending reports, open claims, and more.',
      position: 'top',
    },
    {
      element: '#analytics-charts',
      intro:
        'Visual charts help you understand item claims, location distribution, and submission trends at a glance.',
      position: 'top',
    },
    {
      element:
        '.bg-white.rounded-lg.border.border-gray-300.shadow-md.px-8.py-6:nth-of-type(3) .grid',
      intro:
        'The Items by Location section shows which areas have the most lost-and-found activity.',
      position: 'top',
    },
    {
      element:
        '.bg-white.rounded-lg.border.border-gray-300.shadow-md.px-8.py-6:nth-of-type(4)',
      intro:
        'Common item types are derived from descriptions, helping you spot patterns.',
      position: 'top',
    },
    {
      element:
        '.bg-white.rounded-lg.border.border-gray-300.shadow-md.px-8.py-6:nth-of-type(5)',
      intro:
        'The submission trend chart shows how many reports have been filed over the last 30 days.',
      position: 'top',
    },
    {
      element: '.bg-indigo-500.w-fit.h-full',
      intro:
        'Use the sidebar to navigate between Analytics, Items, Reports, Claims, and Locations management.',
      position: 'right',
    },
  ]);

  useEffect(() => {
    (async () => {
      await getPendingSubmissions();
      await getApprovedSubmissions();
      await getRejectedSubmissions();
      await getPendingClaims();
      await getApprovedClaims();
      await getAllItemsData();
      await getLocations();
      setAnalyticsLoading(true);
      try {
        const { data } = await a.get('/analytics');
        setAnalytics(data);
      } catch {}
      setAnalyticsLoading(false);
    })();
  }, []);

  useEffect(() => {
    setFilteredLocations(locations);
  }, [locations]);

  useEffect(() => {
    setIsMounted(true);

    const calculateMargins = () => {
      const cardWidth = 440;
      const cardHeight = 280;
      const gridSize = 40;

      const top =
        Math.round((window.innerHeight / 2 - cardHeight / 2) / gridSize) *
        gridSize;
      const left =
        Math.round((window.innerWidth / 2 - cardWidth / 2) / gridSize) *
        gridSize;

      setGridMargins({ top, left });
    };

    calculateMargins();

    window.addEventListener('resize', calculateMargins);
    return () => window.removeEventListener('resize', calculateMargins);
  }, []);

  return (
    <div className='h-screen bg-white'>
      {authenticated === false ? (
        <div className='bg-grid h-screen w-full flex'>
          <div
            style={{
              marginTop: isMounted ? `${gridMargins.top}px` : '20%',
              marginLeft: isMounted ? `${gridMargins.left}px` : 'auto',
              marginRight: isMounted ? '0' : 'auto',
            }}
            className='w-[440px] h-[280px] p-6 border border-gray-300 shadow-md bg-white rounded-lg flex flex-col justify-between box-border'
          >
            <div className='text-center text-black text-2xl font-bold'>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') authenticate();
                  }}
                  value={password}
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                />
              </div>
            </div>

            <div
              onClick={() => authenticate()}
              className='bg-indigo-500 text-center hover:bg-indigo-600 hover:cursor-pointer text-white font-semibold rounded-md px-3 py-2'
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
            <Success
              title={'Success'}
              description={'Successfully created a new location.'}
              show={locationCreateSuccess}
              setShow={setLocationCreateSuccess}
            />
            <Success
              title={'Success'}
              description={'Successfully edited the location.'}
              show={locationEditSuccess}
              setShow={setLocationEditSuccess}
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

            {currentPage === 'Analytics' && (
              <div className='w-full h-full overflow-auto p-10'>
                {analyticsLoading || !analytics ? (
                  <div className='flex items-center justify-center h-64 text-gray-400 text-sm'>
                    Loading analytics…
                  </div>
                ) : (
                  <div className='space-y-6'>
                    {/* Header */}
                    <div className='bg-white rounded-lg border border-gray-300 shadow-md px-8 py-6'>
                      <p className='text-2xl font-bold text-black'>
                        Analytics Dashboard
                      </p>
                      <p className='text-sm text-gray-500 mt-1'>
                        Overview of the Lost &amp; Found system
                      </p>
                    </div>

                    {/* Stat cards */}
                    <div className='grid grid-cols-4 gap-5'>
                      {[
                        {
                          label: 'Total Items',
                          value: analytics.totalItems,
                          sub: 'in system',
                          color: 'text-indigo-600',
                        },
                        {
                          label: 'Items Returned',
                          value: analytics.claimedItems,
                          sub: `${analytics.returnRate}% return rate`,
                          color: 'text-green-600',
                        },
                        {
                          label: 'Unclaimed Items',
                          value: analytics.unclaimedItems,
                          sub: 'still available',
                          color: 'text-yellow-600',
                        },
                        {
                          label: 'Total Reports',
                          value: analytics.totalSubmissions,
                          sub: `${analytics.approvedSubmissions} approved`,
                          color: 'text-blue-600',
                        },
                        {
                          label: 'Pending Reports',
                          value: analytics.pendingSubmissions,
                          sub: 'awaiting review',
                          color: 'text-orange-500',
                        },
                        {
                          label: 'Rejected Reports',
                          value: analytics.rejectedSubmissions,
                          sub: 'declined',
                          color: 'text-red-500',
                        },
                        {
                          label: 'Open Claims',
                          value: analytics.openClaims,
                          sub: 'under review',
                          color: 'text-purple-600',
                        },
                        {
                          label: 'Approved Claims',
                          value: analytics.approvedClaims,
                          sub: 'resolved',
                          color: 'text-green-600',
                        },
                      ].map(({ label, value, sub, color }) => (
                        <div
                          key={label}
                          className='bg-white rounded-lg border border-gray-300 shadow-sm px-6 py-5'
                        >
                          <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                            {label}
                          </p>
                          <p className={`text-3xl font-bold mt-1 ${color}`}>
                            {value}
                          </p>
                          <p className='text-xs text-gray-400 mt-1'>{sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* Chart.js charts */}
                    <div id='analytics-charts'>
                      <AdminCharts analytics={analytics} />
                    </div>

                    <div className='grid grid-cols-2 gap-5'>
                      {/* Location heatmap */}
                      <div className='bg-white rounded-lg border border-gray-300 shadow-md px-8 py-6'>
                        <p className='text-lg font-bold text-black mb-4'>
                          Items by Location
                        </p>
                        {analytics.locationStats.length === 0 ? (
                          <p className='text-sm text-gray-400'>
                            No location data yet
                          </p>
                        ) : (
                          <div className='space-y-3'>
                            {analytics.locationStats.slice(0, 10).map((loc) => {
                              const max =
                                analytics.locationStats[0]?.itemCount || 1;
                              const pct = Math.round(
                                (loc.itemCount / max) * 100,
                              );
                              return (
                                <div key={loc.id}>
                                  <div className='flex justify-between text-sm mb-1'>
                                    <span className='font-semibold text-gray-800 truncate max-w-[70%]'>
                                      {loc.name}
                                    </span>
                                    <span className='text-gray-500 font-medium'>
                                      {loc.itemCount} item
                                      {loc.itemCount !== 1 ? 's' : ''}
                                    </span>
                                  </div>
                                  <div className='w-full bg-gray-100 rounded-full h-2.5'>
                                    <div
                                      className='bg-indigo-500 h-2.5 rounded-full transition-all'
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Top keywords / categories */}
                      <div className='bg-white rounded-lg border border-gray-300 shadow-md px-8 py-6'>
                        <p className='text-lg font-bold text-black mb-1'>
                          Most Common Item Types
                        </p>
                        <p className='text-xs text-gray-400 mb-4'>
                          Derived from item names and descriptions
                        </p>
                        {analytics.topKeywords.length === 0 ? (
                          <p className='text-sm text-gray-400'>No data yet</p>
                        ) : (
                          <div className='space-y-3'>
                            {analytics.topKeywords.map(({ word, count }) => {
                              const max = analytics.topKeywords[0]?.count || 1;
                              const pct = Math.round((count / max) * 100);
                              return (
                                <div key={word}>
                                  <div className='flex justify-between text-sm mb-1'>
                                    <span className='font-semibold text-gray-800 capitalize'>
                                      {word}
                                    </span>
                                    <span className='text-gray-500 font-medium'>
                                      {count}×
                                    </span>
                                  </div>
                                  <div className='w-full bg-gray-100 rounded-full h-2.5'>
                                    <div
                                      className='bg-purple-500 h-2.5 rounded-full transition-all'
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submission trend */}
                    <div className='bg-white rounded-lg border border-gray-300 shadow-md px-8 py-6'>
                      <p className='text-lg font-bold text-black mb-1'>
                        Submission Trend
                      </p>
                      <p className='text-xs text-gray-400 mb-6'>
                        Reports submitted per day over the last 30 days
                      </p>
                      {analytics.submissionTrend.length === 0 ? (
                        <p className='text-sm text-gray-400'>
                          No submissions in the last 30 days
                        </p>
                      ) : (
                        (() => {
                          const maxCount = Math.max(
                            ...analytics.submissionTrend.map((d) => d.count),
                          );
                          return (
                            <div className='flex items-end gap-1 h-32'>
                              {analytics.submissionTrend.map(
                                ({ date, count }) => (
                                  <div
                                    key={date}
                                    className='flex-1 flex flex-col items-center gap-1 group relative'
                                  >
                                    <div
                                      className='w-full bg-indigo-400 hover:bg-indigo-500 rounded-t transition-all'
                                      style={{
                                        height: `${Math.max(4, Math.round((count / maxCount) * 100))}%`,
                                      }}
                                    />
                                    <div className='absolute bottom-full mb-1 hidden group-hover:flex bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10'>
                                      {dayjs(date).format('MMM D')}: {count}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          );
                        })()
                      )}
                      <div className='flex justify-between mt-2 text-xs text-gray-400'>
                        <span>
                          {analytics.submissionTrend[0]
                            ? dayjs(analytics.submissionTrend[0].date).format(
                                'MMM D',
                              )
                            : ''}
                        </span>
                        <span>
                          {analytics.submissionTrend[
                            analytics.submissionTrend.length - 1
                          ]
                            ? dayjs(
                                analytics.submissionTrend[
                                  analytics.submissionTrend.length - 1
                                ].date,
                              ).format('MMM D')
                            : ''}
                        </span>
                      </div>
                    </div>

                    {/* Lookouts summary */}
                    <div className='bg-white rounded-lg border border-gray-300 shadow-md px-8 py-6'>
                      <p className='text-lg font-bold text-black mb-4'>
                        Item Lookouts
                      </p>
                      <div className='flex gap-8'>
                        <div>
                          <p className='text-3xl font-bold text-indigo-600'>
                            {analytics.totalLookouts}
                          </p>
                          <p className='text-xs text-gray-400 mt-1'>
                            Total lookouts
                          </p>
                        </div>
                        <div>
                          <p className='text-3xl font-bold text-green-600'>
                            {analytics.openLookouts}
                          </p>
                          <p className='text-xs text-gray-400 mt-1'>Open</p>
                        </div>
                        <div>
                          <p className='text-3xl font-bold text-gray-400'>
                            {analytics.closedLookouts}
                          </p>
                          <p className='text-xs text-gray-400 mt-1'>
                            Closed (resolved)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentPage === 'All Items' && (
              <div className='flex w-full h-full p-10 gap-10'>
                <div className='w-[240px] shrink-0 flex flex-col space-y-4 overflow-y-auto text-black'>
                  <div className='flex space-x-2'>
                    <button
                      type='button'
                      onClick={() => setShowTextFilterModal(true)}
                      disabled={isSearchingText}
                      className='p-2 rounded-md bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      title='Search by text'
                      aria-label='Search by text'
                    >
                      <DocumentTextIcon className='w-5 h-5 text-gray-100' />
                    </button>
                    <button
                      type='button'
                      onClick={() => setShowImageFilterModal(true)}
                      disabled={isSearchingImage}
                      className='p-2 rounded-md bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      title='Search by image'
                      aria-label='Search by image'
                    >
                      <PhotoIcon className='w-5 h-5 text-gray-100' />
                    </button>
                    <button
                      type='button'
                      onClick={() => setShowLocationFilterModal(true)}
                      className='p-2 rounded-md bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer transition-colors'
                      title='Filter by location'
                      aria-label='Filter by location'
                    >
                      <MapPinIcon className='w-5 h-5 text-gray-100' />
                    </button>
                    <button
                      type='button'
                      onClick={() => setShowDateFilterModal(true)}
                      disabled={isSearchingDate}
                      className='p-2 rounded-md bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                      title='Filter by date'
                      aria-label='Filter by date'
                    >
                      <CalendarDaysIcon className='w-5 h-5 text-gray-100' />
                    </button>
                  </div>

                  {filteredItems.length ? (
                    filteredItems.map((v: IItem, i) => (
                      <div key={i} className='group'>
                        <div
                          onClick={() => {
                            setSelectedItem(v);
                            setIsEditing(false);
                          }}
                          className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                        >
                          <div className='group-hover:cursor-pointer'>
                            <div className='flex items-center gap-2 flex-wrap'>
                              <p className='font-bold group-hover:underline overflow-x-auto scrollbar-hide'>
                                {v.itemName}
                              </p>
                              {v.similarity !== undefined && (
                                <span
                                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                    v.similarity >= 75
                                      ? 'bg-green-100 text-green-700'
                                      : v.similarity >= 50
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {Math.round(v.similarity)}% match
                                </span>
                              )}
                            </div>
                            <p className='font-medium mt-2 text-sm/6 text-black'>
                              {truncate(v.description, 50)}
                            </p>
                            <p className='font-medium text-xs mt-2 text-gray-500'>
                              Posted by: {v.author?.name || 'Unknown User'}
                            </p>
                            <p className='font-medium text-xs mt-1 text-gray-500'>
                              Posted on{' '}
                              {dayjs(v.createdAt).format('MM/DD/YYYY')}
                            </p>
                            {v.location && (
                              <p className='font-medium text-xs mt-1 text-gray-500'>
                                {v.location.name}
                                {v.location.teacher
                                  ? ` — ${v.location.teacher}`
                                  : ''}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
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
                            at {dayjs(selectedItem.createdAt).format('h:mm a')}
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
                        <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                          <p className='text-lg font-bold'>Location</p>
                          <p className='text-sm text-gray-600'>
                            {selectedItem.location?.name || 'Unknown'}
                            {selectedItem.location?.teacher && (
                              <span className='text-gray-500'>
                                {' '}
                                &mdash; {selectedItem.location.teacher}
                              </span>
                            )}
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
                                      alt={`Photo of ${selectedItem.itemName} - ID: ${photo.id}`}
                                      className='max-h-96 rounded-md'
                                    />
                                    <p className='text-xs text-gray-500'>
                                      ID: {photo.id}
                                    </p>
                                    <p className='text-xs text-gray-600 text-center'>
                                      Uploaded{' '}
                                      {dayjs(photo.createdAt).format('M/D/YY')}
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
            )}

            {currentPage === 'Pending Reports' && (
              <div className='flex w-full h-full p-10 gap-10'>
                <div className='w-[240px] shrink-0 flex flex-col space-y-4 overflow-y-auto text-black'>
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
                              <p className='font-bold group-hover:underline overflow-x-auto scrollbar-hide'>
                                {v.itemName}
                              </p>
                              <p className='font-medium mt-2 text-sm/6'>
                                {truncate(v.description, 12)}
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
                              <div>
                                <label className='block text-sm font-bold text-gray-900 mb-2'>
                                  Location
                                </label>
                                <select
                                  value={editLocationId || ''}
                                  onChange={(e) =>
                                    setEditLocationId(
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : null,
                                    )
                                  }
                                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                                >
                                  <option value=''>Select a location...</option>
                                  {locations.map((loc) => (
                                    <option key={loc.id} value={loc.id}>
                                      {loc.name}
                                      {loc.teacher ? ` — ${loc.teacher}` : ''}
                                    </option>
                                  ))}
                                </select>
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
                            On {dayjs(selectedPending.createdAt).format('dddd')}
                            {', '}
                            {dayjs(selectedPending.createdAt).format(
                              'MM/DD/YYYY',
                            )}{' '}
                            at{' '}
                            {dayjs(selectedPending.createdAt).format('h:mm a')}
                          </p>
                        </div>
                        {selectedPending.location && (
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Location Found</p>
                            <p className='text-sm text-gray-600'>
                              {selectedPending.location.name}
                              {selectedPending.location.teacher
                                ? ` — ${selectedPending.location.teacher}`
                                : ''}
                            </p>
                          </div>
                        )}
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
                                      alt={`Photo from pending report: ${selectedPending.itemName} - ID: ${photo.id}`}
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
                    <div className='p-4 font-semibold'>No pending reports</div>
                  )}
                </div>
              </div>
            )}

            {currentPage === 'Pending Claims' && (
              <div className='flex w-full h-full p-10 gap-10'>
                <div className='w-60 shrink-0 flex flex-col space-y-4 overflow-y-auto'>
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
                                {truncate(c.item?.itemName, 20)}
                              </p>
                              <p className='font-medium mt-2 text-sm/6'>
                                {truncate(c.comment, 12)}
                              </p>
                              <p className='font-medium text-xs mt-2 text-gray-500'>
                                By: {c.user?.name}
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
                <div className='w-full h-full bg-white overflow-y-auto rounded-lg border border-gray-300 shadow-md'>
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
                            {selectedPendingClaim.user?.name || 'Unknown User'}
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
                                        alt={`Photo of claimed item: ${selectedPendingClaim.item.itemName} - ID: ${photo.id}`}
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
            )}

            {currentPage === 'Approved Reports' && (
              <div className='flex w-full h-full p-10 gap-10'>
                <div className='w-60 shrink-0 flex flex-col space-y-4 overflow-y-auto text-black'>
                  {approvedSubmissions.length ? (
                    approvedSubmissions.map((v: ISubmission, i) => {
                      return (
                        <div key={i} className='group'>
                          <div
                            onClick={() => setSelectedApproved(v)}
                            className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                          >
                            <div className='group-hover:cursor-pointer'>
                              <p className='font-bold group-hover:underline overflow-x-auto scrollbar-hide'>
                                {v.itemName}
                              </p>
                              <p className='font-medium mt-2 text-sm/6'>
                                {truncate(v.description, 12)}
                              </p>
                              <p className='font-medium text-xs mt-2 text-gray-500'>
                                Name: {v?.user?.name}
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
                <div className='w-full h-full bg-white overflow-y-auto rounded-lg border border-gray-300 shadow-md'>
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
                            {dayjs(selectedApproved.createdAt).format('h:mm a')}
                          </p>
                        </div>
                        {selectedApproved.location && (
                          <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                            <p className='text-lg font-bold'>Location Found</p>
                            <p className='text-sm text-gray-600'>
                              {selectedApproved.location.name}
                              {selectedApproved.location.teacher
                                ? ` — ${selectedApproved.location.teacher}`
                                : ''}
                            </p>
                          </div>
                        )}
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
                                      alt={`Photo from approved report: ${selectedApproved.itemName} - ID: ${photo.id}`}
                                      className='max-h-96 rounded-md'
                                    />
                                    <p className='text-xs text-gray-500'>
                                      ID: {photo.id}
                                    </p>
                                    <p className='text-xs text-gray-600 text-center'>
                                      Uploaded{' '}
                                      {dayjs(photo.createdAt).format('M/D/YY')}
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
            )}

            {currentPage === 'Declined Reports' && (
              <div className='flex w-full h-full p-10 gap-10'>
                <div className='w-\[calc\(\(100\%-\(2_*_)\)\/_6\)\] shrink-0 flex flex-col space-y-4 overflow-y-auto'>
                  {rejectedSubmissions.length ? (
                    rejectedSubmissions.map((v: ISubmission, i) => {
                      return (
                        <div key={i} className='group'>
                          <div
                            onClick={() => setSelectedRejected(v)}
                            className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-60 h-fit rounded-lg border border-gray-300 px-8 py-6'
                          >
                            <div className='group-hover:cursor-pointer'>
                              <p className='font-bold group-hover:underline overflow-x-auto scrollbar-hide'>
                                {v.itemName}
                              </p>
                              <p className='font-medium mt-2 text-sm/6'>
                                {truncate(v.description, 12)}
                              </p>
                              <p className='font-medium text-xs mt-2 text-gray-500'>
                                {v?.user?.name}
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
                <div className='w-full h-full bg-white overflow-y-auto rounded-lg border border-gray-300 shadow-md'>
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
                            {dayjs(selectedRejected.createdAt).format('h:mm a')}
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
                                      alt={`Photo from rejected report: ${selectedRejected.itemName} - ID: ${photo.id}`}
                                      className='max-h-96 rounded-md'
                                    />
                                    <p className='text-xs text-gray-500'>
                                      ID: {photo.id}
                                    </p>
                                    <p className='text-xs text-gray-600 text-center'>
                                      Uploaded{' '}
                                      {dayjs(photo.createdAt).format('M/D/YY')}
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
            )}

            {currentPage === 'Approved Claims' && (
              <div className='flex w-full h-full p-10 gap-10'>
                <div className='w-60 shrink-0 flex flex-col space-y-4 overflow-auto'>
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
                                {truncate(c.comment, 12)}
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
                <div className='w-full h-full bg-white overflow-y-auto rounded-lg border border-gray-300 shadow-md'>
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
                            {selectedApprovedClaim.user?.name || 'Unknown User'}
                          </p>
                          <p className='font-medium text-gray-600 mt-1 text-sm'>
                            Item owner:{' '}
                            {selectedApprovedClaim.item?.author?.name ||
                              'Unknown User'}
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
                                        alt={`Photo of claimed item: ${selectedApprovedClaim.item.itemName} - ID: ${photo.id}`}
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
            )}

            {currentPage === 'All Locations' && (
              <div className='flex w-full h-full p-10 gap-10'>
                <div className='shrink-0 flex flex-col space-y-4 overflow-y-auto text-black'>
                  <div className='mb-4'>
                    <button
                      onClick={() => setShowAllLocationsFilterModal(true)}
                      className='p-2 rounded-md bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer transition-colors'
                      title='Filter locations'
                    >
                      <DocumentTextIcon className='w-5 h-5 text-gray-100' />
                    </button>
                  </div>
                  {filteredLocations.length ? (
                    filteredLocations.map((v: ILocation, i) => {
                      return (
                        <div key={i} className='group w-60'>
                          <div
                            onClick={() => {
                              setSelectedLocation(v);
                              setIsEditingLocation(false);
                            }}
                            className='shadow-sm group-hover:cursor-pointer group-hover:shadow-md flex flex-col bg-white w-full h-fit rounded-lg border border-gray-300 px-8 py-6'
                          >
                            <div className='group-hover:cursor-pointer'>
                              <p className='font-bold group-hover:underline'>
                                {v.name}
                              </p>
                              <p className='font-medium text-xs mt-2 text-gray-500'>
                                Items: {v.items.length}
                              </p>
                              <p className='font-medium text-xs text-gray-500'>
                                Teacher: {v.teacher || 'No teacher'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className='font-semibold text-gray-500'>
                      No locations found
                    </div>
                  )}
                </div>
                <div className='w-full h-full bg-white overflow-auto rounded-lg border border-gray-300 shadow-md'>
                  {selectedLocation ? (
                    <>
                      <div className='border-b border-gray-300 h-fit'>
                        <div className='px-6 py-6'>
                          {isEditingLocation ? (
                            <div className='space-y-4'>
                              <div>
                                <label className='block text-sm font-bold text-gray-900 mb-2'>
                                  Location Name
                                </label>
                                <input
                                  type='text'
                                  value={editLocationName}
                                  onChange={(e) =>
                                    setEditLocationName(e.target.value)
                                  }
                                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                                />
                              </div>
                              <div>
                                <label className='block text-sm font-bold text-gray-900 mb-2'>
                                  Teacher (Optional)
                                </label>
                                <input
                                  type='text'
                                  value={editLocationTeacher}
                                  onChange={(e) =>
                                    setEditLocationTeacher(e.target.value)
                                  }
                                  placeholder='Enter teacher name'
                                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                                />
                              </div>
                              <div className='space-x-2 flex'>
                                <div
                                  onClick={() =>
                                    selectedLocation?.id !== undefined &&
                                    editLocation(selectedLocation.id)
                                  }
                                  className='w-fit h-fit px-4 py-2 rounded-md bg-indigo-500 hover:cursor-pointer hover:bg-indigo-600 text-white font-bold text-center'
                                >
                                  Save Changes
                                </div>
                                <div
                                  onClick={() => cancelEditLocation()}
                                  className='w-fit h-fit px-4 py-2 rounded-md bg-gray-400 hover:cursor-pointer hover:bg-gray-500 text-white font-bold text-center'
                                >
                                  Cancel
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className='font-bold text-2xl'>
                                {selectedLocation.name}
                              </p>
                              <div className='space-x-2 flex flex-wrap'>
                                <div
                                  onClick={() =>
                                    startEditLocation(selectedLocation)
                                  }
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
                          <p className='text-lg font-bold'>Teacher</p>
                          <p className='text-sm text-gray-600'>
                            {selectedLocation.teacher || 'No teacher assigned'}
                          </p>
                        </div>
                        <div className='space-y-1 px-6 py-8 border-b border-gray-300'>
                          <p className='text-lg font-bold'>
                            Unclaimed items found at this location
                          </p>
                          <p className='text-sm text-gray-600'>
                            {selectedLocation?.items.length} item
                            {selectedLocation?.items.length === 1 ? '' : 's'}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className='p-8 text-gray-500 text-center'>
                      Select a location to view details
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentPage === 'Add Location' && (
              <div className='w-full h-full'>
                <div className='m-10 bg-white flex flex-col rounded-lg border border-gray-300 shadow-md'>
                  <div className='border-b border-gray-300 h-fit'>
                    <div className='px-6 py-6'>
                      <p className='font-bold text-2xl text-black'>
                        Add a new location
                      </p>
                    </div>
                  </div>
                  <div className='p-6 space-y-4 flex flex-col'>
                    <div className='space-y-2'>
                      <div>
                        <label className='block text-sm/6 font-bold text-gray-900'>
                          Location name*
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            value={newLocationName}
                            onChange={(e) => setNewLocationName(e.target.value)}
                            placeholder='Main Office, Room 204...'
                            className='block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 sm:text-sm/6'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div>
                        <label className='block text-sm/6 font-bold text-gray-900'>
                          Location teacher
                        </label>
                        <div className='mt-2'>
                          <input
                            type='text'
                            value={newLocationTeacher}
                            onChange={(e) =>
                              setNewLocationTeacher(e.target.value)
                            }
                            placeholder='Mr. Smith, Ms. Johnson... (optional)'
                            className='block w-full rounded-md bg-white px-3 py-1.5 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 sm:text-sm/6'
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      onClick={() => newLocationName.trim() && createLocation()}
                      className={`bg-indigo-500 w-fit hover:bg-indigo-600 hover:cursor-pointer font-bold text-lg text-white rounded-md px-4 py-2 ${
                        !newLocationName.trim()
                          ? 'opacity-50 pointer-events-none'
                          : ''
                      }`}
                    >
                      Add Location
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Desktop Ends here */}

          {/* Mobile Version */}
          <div className='lg:hidden bg-white min-h-screen pb-24 text-black w-full'>
            <div className='fixed pointer-events-none top-0 right-0 z-50'>
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
              <Success
                title={'Success'}
                description={'Successfully created a new location.'}
                show={locationCreateSuccess}
                setShow={setLocationCreateSuccess}
              />
              <Success
                title={'Success'}
                description={'Successfully edited the location.'}
                show={locationEditSuccess}
                setShow={setLocationEditSuccess}
              />
            </div>

            {/* Mobile Header */}
            <div className='sticky top-0 bg-indigo-600 text-white p-4 shadow-lg z-40'>
              <h1 className='text-lg font-bold'>{currentPage}</h1>
              <p className='text-xs text-indigo-100 mt-1'>Admin Panel</p>
            </div>

            {/* Mobile Search/Filter Bar */}
            {currentPage === 'All Items' && (
              <div className='bg-white border-b border-gray-200 p-4 space-y-3'>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => {
                      setSearchType('text');
                      setSearchQuery('');
                    }}
                    className={`flex-1 p-2 rounded-md transition-colors flex items-center justify-center space-x-1 ${
                      searchType === 'text'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <DocumentTextIcon className='w-4 h-4' />
                    <span className='text-xs font-medium'>Text</span>
                  </button>
                  <button
                    onClick={() => {
                      setSearchType('image');
                      setSelectedSearchImage('None');
                    }}
                    className={`flex-1 p-2 rounded-md transition-colors flex items-center justify-center space-x-1 ${
                      searchType === 'image'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <PhotoIcon className='w-4 h-4' />
                    <span className='text-xs font-medium'>Image</span>
                  </button>
                  <button
                    onClick={() => setSearchType('location')}
                    className={`flex-1 p-2 rounded-md transition-colors flex items-center justify-center space-x-1 ${
                      searchType === 'location'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <MapPinIcon className='w-4 h-4' />
                    <span className='text-xs font-medium'>Location</span>
                  </button>
                </div>
                {searchType === 'text' && (
                  <input
                    type='text'
                    placeholder='Search items...'
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      searchItemByText(e.target.value);
                    }}
                    className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none'
                  />
                )}
                {searchType === 'image' && (
                  <label className='block'>
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
                      disabled={isSearchingImage}
                    />
                    <div
                      className={`text-white text-sm font-semibold p-2 rounded-md text-center ${
                        isSearchingImage
                          ? 'bg-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-500 cursor-pointer hover:bg-indigo-600'
                      }`}
                    >
                      {isSearchingImage ? 'Searching...' : 'Select Image'}
                    </div>
                    <p className='text-xs text-gray-500 mt-1'>
                      {isSearchingImage
                        ? 'Searching for similar items...'
                        : selectedSearchImage}
                    </p>
                  </label>
                )}
                {searchType === 'location' && (
                  <button
                    onClick={() => setShowFilterModal(true)}
                    className='w-full bg-indigo-500 text-white text-sm font-semibold p-2 rounded-md hover:bg-indigo-600'
                  >
                    Select Location:{' '}
                    {locations.find((loc) => loc.id === locationFilter)?.name ||
                      'All'}
                  </button>
                )}
              </div>
            )}

            {/* Mobile Content */}
            <div className='p-4 space-y-3'>
              {currentPage === 'Analytics' && (
                <div className='space-y-4'>
                  {analyticsLoading || !analytics ? (
                    <div className='p-8 text-center text-gray-400 text-sm'>
                      Loading analytics…
                    </div>
                  ) : (
                    <>
                      <div className='grid grid-cols-2 gap-3'>
                        {[
                          {
                            label: 'Total Items',
                            value: analytics.totalItems,
                            color: 'text-indigo-600',
                          },
                          {
                            label: 'Returned',
                            value: `${analytics.claimedItems} (${analytics.returnRate}%)`,
                            color: 'text-green-600',
                          },
                          {
                            label: 'Unclaimed',
                            value: analytics.unclaimedItems,
                            color: 'text-yellow-600',
                          },
                          {
                            label: 'Pending Reports',
                            value: analytics.pendingSubmissions,
                            color: 'text-orange-500',
                          },
                          {
                            label: 'Open Claims',
                            value: analytics.openClaims,
                            color: 'text-purple-600',
                          },
                          {
                            label: 'Lookouts Open',
                            value: analytics.openLookouts,
                            color: 'text-blue-600',
                          },
                        ].map(({ label, value, color }) => (
                          <div
                            key={label}
                            className='bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-4'
                          >
                            <p className='text-xs text-gray-500 font-semibold'>
                              {label}
                            </p>
                            <p className={`text-2xl font-bold mt-1 ${color}`}>
                              {value}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className='bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-4'>
                        <p className='font-bold text-black mb-3'>
                          Items by Location
                        </p>
                        <div className='space-y-2'>
                          {analytics.locationStats.slice(0, 8).map((loc) => {
                            const max =
                              analytics.locationStats[0]?.itemCount || 1;
                            const pct = Math.round((loc.itemCount / max) * 100);
                            return (
                              <div key={loc.id}>
                                <div className='flex justify-between text-xs mb-1'>
                                  <span className='font-semibold text-gray-800 truncate max-w-[70%]'>
                                    {loc.name}
                                  </span>
                                  <span className='text-gray-500'>
                                    {loc.itemCount}
                                  </span>
                                </div>
                                <div className='w-full bg-gray-100 rounded-full h-2'>
                                  <div
                                    className='bg-indigo-500 h-2 rounded-full'
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className='bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-4'>
                        <p className='font-bold text-black mb-3'>
                          Most Common Item Types
                        </p>
                        <div className='space-y-2'>
                          {analytics.topKeywords.map(({ word, count }) => {
                            const max = analytics.topKeywords[0]?.count || 1;
                            const pct = Math.round((count / max) * 100);
                            return (
                              <div key={word}>
                                <div className='flex justify-between text-xs mb-1'>
                                  <span className='font-semibold text-gray-800 capitalize'>
                                    {word}
                                  </span>
                                  <span className='text-gray-500'>
                                    {count}×
                                  </span>
                                </div>
                                <div className='w-full bg-gray-100 rounded-full h-2'>
                                  <div
                                    className='bg-purple-500 h-2 rounded-full'
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {currentPage === 'All Items' && (
                <div className='space-y-3'>
                  {filteredItems.length ? (
                    filteredItems.map((item: IItem, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow min-h-[220px] flex flex-col'
                      >
                        <div className='p-4 flex flex-col flex-1 justify-between'>
                          <div className='flex justify-between items-start gap-2'>
                            <div className='flex-1 min-w-0'>
                              <h3 className='font-bold text-base text-black truncate'>
                                {item.itemName}
                              </h3>
                              <p className='text-xs text-gray-600 mt-1 line-clamp-2'>
                                {truncate(item.description, 50)}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                item.claimed
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {item.claimed ? 'Claimed' : 'Unclaimed'}
                            </span>
                          </div>
                          <div className='mt-2 flex flex-wrap gap-1 text-xs text-gray-500'>
                            <span>By: {item.author?.name || 'Unknown'}</span>
                            <span>•</span>
                            <span>
                              {dayjs(item.createdAt).format('MM/DD/YY')}
                            </span>
                          </div>
                          {item.location && (
                            <p className='text-xs text-indigo-600 mt-1'>
                              {item.location.name}
                            </p>
                          )}
                          <div className='flex gap-2 mt-3'>
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setMobileDetailType('item');
                                setShowMobileDetailModal(true);
                              }}
                              className='flex-1 bg-indigo-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-indigo-600 transition-colors'
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                startEditItem(item);
                                setShowMobileEditModal(true);
                              }}
                              className='flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-semibold hover:bg-gray-300 transition-colors'
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => item.id && deleteItemData(item.id)}
                              className='px-3 py-2 bg-red-100 text-red-600 rounded text-sm font-semibold hover:bg-red-200 transition-colors'
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-12 text-gray-500'>
                      <p className='text-sm font-medium'>No items found</p>
                    </div>
                  )}
                </div>
              )}

              {currentPage === 'Pending Reports' && (
                <div className='space-y-3'>
                  {pendingSubmissions.length ? (
                    pendingSubmissions.map((submission: ISubmission, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow'
                      >
                        <div className='p-4'>
                          <div className='flex items-start justify-between gap-2'>
                            <div className='flex-1 min-w-0'>
                              <h3 className='font-bold text-base text-black truncate'>
                                {submission.itemName}
                              </h3>
                              <p className='text-xs text-gray-600 mt-1 line-clamp-2'>
                                {truncate(submission.description, 50)}
                              </p>
                            </div>
                            <span className='px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 whitespace-nowrap'>
                              PENDING
                            </span>
                          </div>
                          <div className='mt-2 text-xs text-gray-500'>
                            By: {submission.user?.name || 'Unknown'} •{' '}
                            {dayjs(submission.createdAt).format('MM/DD/YY')}
                          </div>
                          <div className='flex gap-2 mt-3'>
                            <button
                              onClick={() => {
                                setSelectedPending(submission);
                                setMobileDetailType('submission');
                                setShowMobileDetailModal(true);
                              }}
                              className='flex-1 bg-indigo-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-indigo-600 transition-colors'
                            >
                              View
                            </button>
                            <button
                              onClick={() =>
                                submission.id &&
                                approveSubmission(submission.id)
                              }
                              className='flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-green-600 transition-colors'
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                submission.id && rejectSubmission(submission.id)
                              }
                              className='px-3 py-2 bg-red-100 text-red-600 rounded text-sm font-semibold hover:bg-red-200 transition-colors'
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-12 text-gray-500'>
                      <p className='text-sm font-medium'>No pending reports</p>
                    </div>
                  )}
                </div>
              )}

              {currentPage === 'Approved Reports' && (
                <div className='space-y-3'>
                  {approvedSubmissions.length ? (
                    approvedSubmissions.map((submission: ISubmission, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow'
                      >
                        <div className='p-4'>
                          <div className='flex items-start justify-between gap-2'>
                            <div className='flex-1 min-w-0'>
                              <h3 className='font-bold text-base text-black truncate'>
                                {submission.itemName}
                              </h3>
                              <p className='text-xs text-gray-600 mt-1 line-clamp-2'>
                                {truncate(submission.description, 50)}
                              </p>
                            </div>
                            <span className='px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 whitespace-nowrap'>
                              APPROVED
                            </span>
                          </div>
                          <div className='mt-2 text-xs text-gray-500'>
                            By: {submission.user?.name || 'Unknown'} •{' '}
                            {dayjs(submission.createdAt).format('MM/DD/YY')}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedApproved(submission);
                              setMobileDetailType('submission');
                              setShowMobileDetailModal(true);
                            }}
                            className='w-full mt-3 bg-indigo-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-indigo-600 transition-colors'
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-12 text-gray-500'>
                      <p className='text-sm font-medium'>No approved reports</p>
                    </div>
                  )}
                </div>
              )}

              {currentPage === 'Declined Reports' && (
                <div className='space-y-3'>
                  {rejectedSubmissions.length ? (
                    rejectedSubmissions.map((submission: ISubmission, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow'
                      >
                        <div className='p-4'>
                          <div className='flex items-start justify-between gap-2'>
                            <div className='flex-1 min-w-0'>
                              <h3 className='font-bold text-base text-black truncate'>
                                {submission.itemName}
                              </h3>
                              <p className='text-xs text-gray-600 mt-1 line-clamp-2'>
                                {truncate(submission.description, 50)}
                              </p>
                            </div>
                            <span className='px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-800 whitespace-nowrap'>
                              DECLINED
                            </span>
                          </div>
                          <div className='mt-2 text-xs text-gray-500'>
                            By: {submission.user?.name || 'Unknown'} •{' '}
                            {dayjs(submission.createdAt).format('MM/DD/YY')}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedRejected(submission);
                              setMobileDetailType('submission');
                              setShowMobileDetailModal(true);
                            }}
                            className='w-full mt-3 bg-indigo-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-indigo-600 transition-colors'
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-12 text-gray-500'>
                      <p className='text-sm font-medium'>No declined reports</p>
                    </div>
                  )}
                </div>
              )}

              {currentPage === 'Pending Claims' && (
                <div className='space-y-3'>
                  {pendingClaims.length ? (
                    pendingClaims.map((claim: IClaimForm, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow'
                      >
                        <div className='p-4'>
                          <div className='flex items-start justify-between gap-2'>
                            <div className='flex-1 min-w-0'>
                              <h3 className='font-bold text-base text-black truncate'>
                                {claim.item?.itemName || 'Unknown Item'}
                              </h3>
                              <p className='text-xs text-gray-600 mt-1 line-clamp-2'>
                                {truncate(claim.comment, 50)}
                              </p>
                            </div>
                            <span className='px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-800 whitespace-nowrap'>
                              PENDING
                            </span>
                          </div>
                          <div className='mt-2 text-xs text-gray-500'>
                            Claimed by: {claim.user?.name || 'Unknown'}
                          </div>
                          <div className='flex gap-2 mt-3'>
                            <button
                              onClick={() => {
                                setSelectedPendingClaim(claim);
                                setMobileDetailType('claim');
                                setShowMobileDetailModal(true);
                              }}
                              className='flex-1 bg-indigo-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-indigo-600 transition-colors'
                            >
                              View
                            </button>
                            <button
                              onClick={() => claim.id && approveClaim(claim.id)}
                              className='flex-1 bg-green-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-green-600 transition-colors'
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => claim.id && deleteClaim(claim.id)}
                              className='px-3 py-2 bg-red-100 text-red-600 rounded text-sm font-semibold hover:bg-red-200 transition-colors'
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-12 text-gray-500'>
                      <p className='text-sm font-medium'>No pending claims</p>
                    </div>
                  )}
                </div>
              )}

              {currentPage === 'Approved Claims' && (
                <div className='space-y-3'>
                  {approvedClaims.length ? (
                    approvedClaims.map((claim: IClaimForm, i) => (
                      <div
                        key={i}
                        className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow'
                      >
                        <div className='p-4'>
                          <div className='flex items-start justify-between gap-2'>
                            <div className='flex-1'>
                              <h3 className='font-bold text-base text-black'>
                                {claim.item?.itemName || 'Unknown Item'}
                              </h3>
                              <p className='text-xs text-gray-600 mt-1 line-clamp-2'>
                                {truncate(claim.comment, 50)}
                              </p>
                            </div>
                            <span className='px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800 whitespace-nowrap'>
                              APPROVED
                            </span>
                          </div>
                          <div className='mt-2 text-xs text-gray-500'>
                            Claimed by: {claim.user?.name || 'Unknown'}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedApprovedClaim(claim);
                              setMobileDetailType('claim');
                              setShowMobileDetailModal(true);
                            }}
                            className='w-full mt-3 bg-indigo-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-indigo-600 transition-colors'
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-12 text-gray-500'>
                      <p className='text-sm font-medium'>No approved claims</p>
                    </div>
                  )}
                </div>
              )}

              {currentPage === 'All Locations' && (
                <div className='space-y-3'>
                  {locations.length ? (
                    <>
                      <button
                        onClick={() => {
                          setNewLocationName('');
                          setNewLocationTeacher('');
                          setIsEditing(false);
                          setShowMobileEditModal(true);
                        }}
                        className='w-full bg-green-500 text-white px-4 py-3 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors'
                      >
                        + Add New Location
                      </button>
                      {locations.map((location: ILocation, i) => (
                        <div
                          key={i}
                          className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow'
                        >
                          <div className='p-4'>
                            <div className='flex justify-between items-start'>
                              <div className='flex-1'>
                                <h3 className='font-bold text-base text-black'>
                                  {location.name}
                                </h3>
                                {location.teacher && (
                                  <p className='text-xs text-gray-600 mt-1'>
                                    {location.teacher}
                                  </p>
                                )}
                                <p className='text-xs text-gray-500 mt-2'>
                                  ID: {location.id}
                                </p>
                              </div>
                            </div>
                            <div className='flex gap-2 mt-3'>
                              <button
                                onClick={() => {
                                  startEditLocation(location);
                                  setSelectedLocation(location);
                                  setShowMobileEditModal(true);
                                }}
                                className='flex-1 bg-indigo-500 text-white px-3 py-2 rounded text-sm font-semibold hover:bg-indigo-600 transition-colors'
                              >
                                Edit
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className='text-center py-12 text-gray-500'>
                      <p className='text-sm font-medium'>No locations found</p>
                      <button
                        onClick={() => {
                          setNewLocationName('');
                          setNewLocationTeacher('');
                          setShowMobileEditModal(true);
                        }}
                        className='mt-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600'
                      >
                        Create First Location
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation */}
            <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40'>
              <div className='grid grid-cols-4 gap-1 p-2'>
                {[
                  {
                    name: 'Analytics',
                    label: 'Analytics',
                    icon: <CalendarDaysIcon className='w-5 h-5' />,
                    active: currentPage === 'Analytics',
                  },
                  {
                    name: 'All Items',
                    label: 'Items',
                    icon: <HomeIcon className='w-5 h-5' />,
                    active: currentPage === 'All Items',
                  },
                  {
                    name: 'Pending Reports',
                    label: 'Reports',
                    icon: <DocumentTextIcon className='w-5 h-5' />,
                    active: currentPage.includes('Reports'),
                  },
                  {
                    name: 'Pending Claims',
                    label: 'Claims',
                    icon: <CheckBadgeIcon className='w-5 h-5' />,
                    active: currentPage.includes('Claims'),
                  },
                  {
                    name: 'All Locations',
                    label: 'Locations',
                    icon: <MapPinIcon className='w-5 h-5' />,
                    active: currentPage === 'All Locations',
                  },
                ].map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => handleCurrentPageChange(tab.name)}
                    className={`flex flex-col items-center justify-center gap-1 rounded py-2 text-xs font-semibold transition-colors ${
                      tab.active
                        ? 'bg-indigo-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Detail Modal */}
            <Modal
              open={showMobileDetailModal}
              setOpen={setShowMobileDetailModal}
            >
              <div className='bg-white rounded-lg p-6 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto'>
                {mobileDetailType === 'item' && selectedItem && (
                  <div className='space-y-4'>
                    <div>
                      <h2 className='text-2xl font-bold text-black'>
                        {selectedItem.itemName}
                      </h2>
                      <p className='text-sm text-gray-600 mt-1'>
                        Submitted by:{' '}
                        {selectedItem.author?.name || 'Unknown User'}
                      </p>
                    </div>
                    <div className='space-y-3 border-t border-gray-200 pt-4'>
                      <div>
                        <p className='font-semibold text-black text-sm'>
                          Date Created
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>
                          {dayjs(selectedItem.createdAt).format(
                            'dddd, MMMM D, YYYY',
                          )}{' '}
                          at {dayjs(selectedItem.createdAt).format('h:mm a')}
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-black text-sm'>
                          Description
                        </p>
                        <p className='text-sm text-gray-600 mt-1 whitespace-pre-wrap'>
                          {selectedItem.description}
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-black text-sm'>
                          Status
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>
                          {selectedItem.claimed ? '✓ Claimed' : 'Unclaimed'}
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-black text-sm'>
                          Location
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>
                          {selectedItem.location?.name || 'Unknown'}
                          {selectedItem.location?.teacher && (
                            <span className='block text-xs text-gray-500'>
                              {selectedItem.location.teacher}
                            </span>
                          )}
                        </p>
                      </div>
                      {selectedItem.photos &&
                        selectedItem.photos.length > 0 && (
                          <div>
                            <p className='font-semibold text-black text-sm'>
                              Photos ({selectedItem.photos.length})
                            </p>
                            <div className='grid grid-cols-2 gap-2 mt-2'>
                              {selectedItem.photos.map((photo) => (
                                <div
                                  key={photo.id}
                                  className='cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow'
                                  onClick={() => {
                                    setSelectedImageData(
                                      `data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`,
                                    );
                                    setShowImageModal(true);
                                  }}
                                >
                                  <img
                                    src={`data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`}
                                    alt={`Photo of ${selectedItem.itemName} - ID: ${photo.id}`}
                                    className='w-full h-32 object-cover'
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                    <div className='flex gap-2 border-t border-gray-200 pt-4'>
                      <button
                        onClick={() => {
                          setShowMobileDetailModal(false);
                          startEditItem(selectedItem);
                          setShowMobileEditModal(true);
                        }}
                        className='flex-1 bg-indigo-500 text-white px-3 py-2 rounded font-semibold hover:bg-indigo-600 transition-colors'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setShowMobileDetailModal(false);
                          selectedItem.id && deleteItemData(selectedItem.id);
                        }}
                        className='flex-1 bg-red-500 text-white px-3 py-2 rounded font-semibold hover:bg-red-600 transition-colors'
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setShowMobileDetailModal(false)}
                        className='flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded font-semibold hover:bg-gray-300 transition-colors'
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {mobileDetailType === 'submission' &&
                  (selectedPending || selectedApproved || selectedRejected) && (
                    <div className='space-y-4'>
                      {(() => {
                        const submission =
                          selectedPending ||
                          selectedApproved ||
                          selectedRejected;
                        return (
                          <>
                            <div>
                              <h2 className='text-2xl font-bold text-black'>
                                {submission?.itemName}
                              </h2>
                              <p className='text-sm text-gray-600 mt-1'>
                                Submitted by:{' '}
                                {submission?.user?.name || 'Unknown User'}
                              </p>
                              <span
                                className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
                                  submission?.approvalStatus === 'PENDING'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : submission?.approvalStatus === 'APPROVED'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {submission?.approvalStatus}
                              </span>
                            </div>
                            <div className='space-y-3 border-t border-gray-200 pt-4'>
                              <div>
                                <p className='font-semibold text-black text-sm'>
                                  Date Submitted
                                </p>
                                <p className='text-sm text-gray-600 mt-1'>
                                  {dayjs(submission?.createdAt).format(
                                    'dddd, MMMM D, YYYY',
                                  )}{' '}
                                  at{' '}
                                  {dayjs(submission?.createdAt).format(
                                    'h:mm a',
                                  )}
                                </p>
                              </div>
                              <div>
                                <p className='font-semibold text-black text-sm'>
                                  Description
                                </p>
                                <p className='text-sm text-gray-600 mt-1 whitespace-pre-wrap'>
                                  {submission?.description}
                                </p>
                              </div>
                              {submission?.photos &&
                                submission.photos.length > 0 && (
                                  <div>
                                    <p className='font-semibold text-black text-sm'>
                                      Photos ({submission.photos.length})
                                    </p>
                                    <div className='grid grid-cols-2 gap-2 mt-2'>
                                      {submission.photos.map((photo) => (
                                        <div
                                          key={photo.id}
                                          className='cursor-pointer rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow'
                                          onClick={() => {
                                            setSelectedImageData(
                                              `data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`,
                                            );
                                            setShowImageModal(true);
                                          }}
                                        >
                                          <img
                                            src={`data:image/jpeg;base64,${Buffer.from(Object.values(photo.data)).toString('base64')}`}
                                            alt={`Photo from submission: ${submission?.itemName} - ID: ${photo.id}`}
                                            className='w-full h-32 object-cover'
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                            {submission?.approvalStatus === 'PENDING' && (
                              <div className='flex gap-2 border-t border-gray-200 pt-4'>
                                <button
                                  onClick={() => {
                                    setShowMobileDetailModal(false);
                                    submission.id &&
                                      approveSubmission(submission.id);
                                  }}
                                  className='flex-1 bg-green-500 text-white px-3 py-2 rounded font-semibold hover:bg-green-600 transition-colors'
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setShowMobileDetailModal(false);
                                    submission.id &&
                                      rejectSubmission(submission.id);
                                  }}
                                  className='flex-1 bg-red-500 text-white px-3 py-2 rounded font-semibold hover:bg-red-600 transition-colors'
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() =>
                                    setShowMobileDetailModal(false)
                                  }
                                  className='flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded font-semibold hover:bg-gray-300 transition-colors'
                                >
                                  Close
                                </button>
                              </div>
                            )}
                            {submission?.approvalStatus !== 'PENDING' && (
                              <button
                                onClick={() => setShowMobileDetailModal(false)}
                                className='w-full bg-gray-200 text-gray-700 px-3 py-2 rounded font-semibold hover:bg-gray-300 transition-colors'
                              >
                                Close
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}

                {mobileDetailType === 'claim' &&
                  (selectedPendingClaim || selectedApprovedClaim) && (
                    <div className='space-y-4'>
                      {(() => {
                        const claim =
                          selectedPendingClaim || selectedApprovedClaim;
                        return (
                          <>
                            <div>
                              <h2 className='text-2xl font-bold text-black'>
                                {claim?.item?.itemName || 'Unknown Item'}
                              </h2>
                              <p className='text-sm text-gray-600 mt-1'>
                                Claimed by:{' '}
                                {claim?.user?.name || 'Unknown User'}
                              </p>
                              <p className='text-sm text-gray-600'>
                                Original owner:{' '}
                                {claim?.item?.author?.name || 'Unknown User'}
                              </p>
                              <span
                                className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold ${
                                  claim?.isOpen
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {claim?.isOpen ? 'PENDING' : 'APPROVED'}
                              </span>
                            </div>
                            <div className='space-y-3 border-t border-gray-200 pt-4'>
                              <div>
                                <p className='font-semibold text-black text-sm'>
                                  Claim Comment
                                </p>
                                <p className='text-sm text-gray-600 mt-1 whitespace-pre-wrap'>
                                  {claim?.comment}
                                </p>
                              </div>
                              <div>
                                <p className='font-semibold text-black text-sm'>
                                  Date Submitted
                                </p>
                                <p className='text-sm text-gray-600 mt-1'>
                                  {dayjs(claim?.createdAt).format(
                                    'dddd, MMMM D, YYYY',
                                  )}{' '}
                                  at {dayjs(claim?.createdAt).format('h:mm a')}
                                </p>
                              </div>
                            </div>
                            {claim?.isOpen && (
                              <div className='flex gap-2 border-t border-gray-200 pt-4'>
                                <button
                                  onClick={() => {
                                    setShowMobileDetailModal(false);
                                    claim.id && approveClaim(claim.id);
                                  }}
                                  className='flex-1 bg-green-500 text-white px-3 py-2 rounded font-semibold hover:bg-green-600 transition-colors'
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setShowMobileDetailModal(false);
                                    claim.id && deleteClaim(claim.id);
                                  }}
                                  className='flex-1 bg-red-500 text-white px-3 py-2 rounded font-semibold hover:bg-red-600 transition-colors'
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() =>
                                    setShowMobileDetailModal(false)
                                  }
                                  className='flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded font-semibold hover:bg-gray-300 transition-colors'
                                >
                                  Close
                                </button>
                              </div>
                            )}
                            {!claim?.isOpen && (
                              <button
                                onClick={() => setShowMobileDetailModal(false)}
                                className='w-full bg-gray-200 text-gray-700 px-3 py-2 rounded font-semibold hover:bg-gray-300 transition-colors'
                              >
                                Close
                              </button>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
              </div>
            </Modal>

            {/* Mobile Edit Modal */}
            <Modal open={showMobileEditModal} setOpen={setShowMobileEditModal}>
              <div className='bg-white rounded-lg p-6 max-w-2xl mx-auto max-h-[90vh] overflow-y-auto'>
                {currentPage === 'All Items' && selectedItem && (
                  <div className='space-y-4'>
                    <h2 className='text-2xl font-bold text-black'>Edit Item</h2>
                    <div>
                      <label className='block text-sm font-bold text-gray-900 mb-2'>
                        Item Name
                      </label>
                      <input
                        type='text'
                        value={editItemName}
                        onChange={(e) => setEditItemName(e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-bold text-gray-900 mb-2'>
                        Description
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500'
                      />
                    </div>
                    {selectedItem.photos && selectedItem.photos.length > 0 && (
                      <div>
                        <label className='block text-sm font-bold text-gray-900 mb-3'>
                          Photos - Check to remove
                        </label>
                        <div className='space-y-2'>
                          {selectedItem.photos.map((photo) => (
                            <div
                              key={photo.id}
                              className='flex items-center space-x-2 p-2 border border-gray-300 rounded-md'
                            >
                              <input
                                type='checkbox'
                                id={`photo-${photo.id}`}
                                checked={editRemovePhotoIds.includes(photo.id)}
                                onChange={() => togglePhotoRemoval(photo.id)}
                                className='w-4 h-4'
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
                    <div className='flex gap-2 border-t border-gray-200 pt-4'>
                      <button
                        onClick={() => {
                          selectedItem.id && updateItemData(selectedItem.id);
                          setShowMobileEditModal(false);
                        }}
                        className='flex-1 bg-indigo-500 text-white px-3 py-2 rounded font-semibold hover:bg-indigo-600 transition-colors'
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          cancelEdit();
                          setShowMobileEditModal(false);
                        }}
                        className='flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded font-semibold hover:bg-gray-300 transition-colors'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {currentPage === 'All Locations' && (
                  <div className='space-y-4'>
                    <h2 className='text-2xl font-bold text-black'>
                      {isEditingLocation ? 'Edit Location' : 'Add New Location'}
                    </h2>
                    <div>
                      <label className='block text-sm font-bold text-gray-900 mb-2'>
                        Location Name *
                      </label>
                      <input
                        type='text'
                        value={
                          isEditingLocation ? editLocationName : newLocationName
                        }
                        onChange={(e) =>
                          isEditingLocation
                            ? setEditLocationName(e.target.value)
                            : setNewLocationName(e.target.value)
                        }
                        placeholder='e.g., Room 101, Library'
                        className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500'
                      />
                    </div>
                    {!isEditingLocation && (
                      <div>
                        <label className='block text-sm font-bold text-gray-900 mb-2'>
                          Teacher/Supervisor (Optional)
                        </label>
                        <input
                          type='text'
                          value={newLocationTeacher}
                          onChange={(e) =>
                            setNewLocationTeacher(e.target.value)
                          }
                          placeholder='e.g., Mr. Smith'
                          className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500'
                        />
                      </div>
                    )}
                    <div className='flex gap-2 border-t border-gray-200 pt-4'>
                      {isEditingLocation ? (
                        <>
                          <button
                            onClick={() => {
                              selectedLocation?.id &&
                                editLocation(selectedLocation.id);
                              setShowMobileEditModal(false);
                            }}
                            className='flex-1 bg-indigo-500 text-white px-3 py-2 rounded font-semibold hover:bg-indigo-600 transition-colors'
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              cancelEditLocation();
                              setShowMobileEditModal(false);
                            }}
                            className='flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded font-semibold hover:bg-gray-300 transition-colors'
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              newLocationName.trim() && createLocation();
                              setShowMobileEditModal(false);
                            }}
                            disabled={!newLocationName.trim()}
                            className='flex-1 bg-green-500 text-white px-3 py-2 rounded font-semibold hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            Create Location
                          </button>
                          <button
                            onClick={() => setShowMobileEditModal(false)}
                            className='flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded font-semibold hover:bg-gray-300 transition-colors'
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Modal>
          </div>

          {/* Filter Modal */}
          <Modal open={showFilterModal} setOpen={setShowFilterModal}>
            <div className='bg-white rounded-lg p-6 w-full max-w-md mx-auto space-y-5'>
              <h2 className='text-xl font-bold text-black'>
                Filter by Location
              </h2>
              <div>
                <input
                  type='text'
                  placeholder='Search locations...'
                  value={filterSearchQuery}
                  onChange={(e) => setFilterSearchQuery(e.target.value)}
                  className='w-full text-gray-700 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none mb-2'
                />
                <div className='border border-gray-200 rounded-md max-h-64 overflow-y-auto'>
                  <button
                    type='button'
                    onClick={() => setLocationFilter(null)}
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
                        onClick={() => setLocationFilter(loc.id)}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-50 hover:cursor-pointer border-b border-gray-100 last:border-b-0 ${
                          locationFilter === loc.id ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <div className='font-medium text-gray-900 text-sm'>
                          {loc.name}
                        </div>
                        {loc.teacher && (
                          <div className='text-xs text-gray-500'>
                            Teacher: {loc.teacher}
                          </div>
                        )}
                      </button>
                    ))}
                </div>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => {
                    setLocationFilter(null);
                    setFilterSearchQuery('');
                  }}
                  className='flex-1 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer text-gray-700 font-semibold py-2 rounded-md text-sm'
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className='flex-1 bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white font-semibold py-2 rounded-md text-sm'
                >
                  Done
                </button>
              </div>
            </div>
          </Modal>

          {/* Modals */}
          <div>
            {/* Text Filter Modal */}
            <Modal open={showTextFilterModal} setOpen={setShowTextFilterModal}>
              <div className='bg-white rounded-lg p-6 w-full max-w-md mx-auto space-y-5'>
                <h2 className='text-xl font-bold text-black'>Search by Text</h2>
                <div>
                  <input
                    type='text'
                    placeholder='Search items...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full text-gray-700 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none'
                  />
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      getAllItemsData();
                      setShowTextFilterModal(false);
                    }}
                    className='flex-1 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer text-gray-700 font-semibold py-2 rounded-md text-sm'
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      searchItemByText(searchQuery);
                      setShowTextFilterModal(false);
                    }}
                    className='flex-1 bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white font-semibold py-2 rounded-md text-sm'
                  >
                    Search
                  </button>
                </div>
              </div>
            </Modal>

            {/* Image Filter Modal */}
            <Modal
              open={showImageFilterModal}
              setOpen={setShowImageFilterModal}
            >
              <div className='bg-white rounded-lg p-6 w-full max-w-md mx-auto space-y-5'>
                <h2 className='text-xl font-bold text-black'>
                  Search by Image
                </h2>
                <div className='flex flex-col gap-2'>
                  <label>
                    <input
                      ref={imageSearchRef}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setSelectedSearchImage(e.target.files[0].name);
                          searchItemsByImage(e.target.files[0]);
                          setShowImageFilterModal(false);
                        }
                      }}
                      type='file'
                      accept='.png, .jpg, .jpeg, .webp'
                      hidden
                      disabled={isSearchingImage}
                    />
                    <div
                      className={`flex w-full h-10 px-3 flex-col rounded-md shadow text-white text-sm font-semibold items-center justify-center ${
                        isSearchingImage
                          ? 'bg-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-500 hover:cursor-pointer hover:bg-indigo-600'
                      }`}
                    >
                      {isSearchingImage ? 'Searching...' : 'Select Image'}
                    </div>
                  </label>
                  <div className='text-black text-xs font-semibold'>
                    {isSearchingImage
                      ? 'Searching for similar items...'
                      : `Selected Image: ${selectedSearchImage}`}
                  </div>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => {
                      setSelectedSearchImage('None');
                      getAllItemsData();
                      if (imageSearchRef.current) {
                        imageSearchRef.current.value = '';
                      }
                      setShowImageFilterModal(false);
                    }}
                    className='flex-1 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer text-gray-700 font-semibold py-2 rounded-md text-sm'
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowImageFilterModal(false)}
                    className='flex-1 bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white font-semibold py-2 rounded-md text-sm'
                  >
                    Done
                  </button>
                </div>
              </div>
            </Modal>

            {/* Location Filter Modal */}
            <Modal
              open={showLocationFilterModal}
              setOpen={setShowLocationFilterModal}
            >
              <div className='bg-white rounded-lg p-6 w-full max-w-md mx-auto space-y-5'>
                <h2 className='text-xl font-bold text-black'>
                  Filter by Location
                </h2>
                <div>
                  <input
                    type='text'
                    placeholder='Search locations...'
                    value={filterSearchQuery}
                    onChange={(e) => setFilterSearchQuery(e.target.value)}
                    className='w-full text-gray-700 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none mb-2'
                  />
                  <div className='border border-gray-200 rounded-md max-h-64 overflow-y-auto'>
                    <button
                      type='button'
                      onClick={() => {
                        setLocationFilter(null);
                        getAllItemsData();
                        setShowLocationFilterModal(false);
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
                            // Filter items by location
                            const filtered = allItems.filter(
                              (item) => item.locationId === loc.id,
                            );
                            setFilteredItems(filtered);
                            setShowLocationFilterModal(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-gray-50 hover:cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            locationFilter === loc.id ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <div className='font-medium text-gray-900 text-sm'>
                            {loc.name}
                          </div>
                          {loc.teacher && (
                            <div className='text-xs text-gray-500'>
                              Teacher: {loc.teacher}
                            </div>
                          )}
                        </button>
                      ))}
                  </div>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => {
                      setLocationFilter(null);
                      setFilterSearchQuery('');
                      getAllItemsData();
                      setShowLocationFilterModal(false);
                    }}
                    className='flex-1 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer text-gray-700 font-semibold py-2 rounded-md text-sm'
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowLocationFilterModal(false)}
                    className='flex-1 bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white font-semibold py-2 rounded-md text-sm'
                  >
                    Done
                  </button>
                </div>
              </div>
            </Modal>

            {/* Date Filter Modal */}
            <Modal open={showDateFilterModal} setOpen={setShowDateFilterModal}>
              <div className='bg-white rounded-lg p-6 w-full max-w-md mx-auto space-y-5'>
                <h2 className='text-xl font-bold text-black'>Filter by Date</h2>
                <div className='space-y-3'>
                  <button
                    onClick={() => {
                      searchItemsByDate('3days');
                      setDateFilter('3days');
                      setShowDateFilterModal(false);
                    }}
                    className='text-gray-700 w-full hover:cursor-pointer text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium'
                  >
                    Last 3 days
                  </button>
                  <button
                    onClick={() => {
                      searchItemsByDate('1week');
                      setDateFilter('1week');
                      setShowDateFilterModal(false);
                    }}
                    className='text-gray-700 w-full hover:cursor-pointer text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium'
                  >
                    Last week
                  </button>
                  <button
                    onClick={() => {
                      searchItemsByDate('1month');
                      setDateFilter('1month');
                      setShowDateFilterModal(false);
                    }}
                    className='text-gray-700 w-full hover:cursor-pointer text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium'
                  >
                    Last month
                  </button>
                  <div className='border-t pt-3'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Custom Date (YYYY-MM-DD)
                    </label>
                    <input
                      type='date'
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      className='w-full text-gray-700 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none'
                    />
                  </div>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => {
                      setDateFilter('');
                      setCustomDate('');
                      getAllItemsData();
                      setShowDateFilterModal(false);
                    }}
                    className='flex-1 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer text-gray-700 font-semibold py-2 rounded-md text-sm'
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      if (customDate) {
                        searchItemsByDate(customDate);
                        setDateFilter(customDate);
                      }
                      setShowDateFilterModal(false);
                    }}
                    className='flex-1 bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white font-semibold py-2 rounded-md text-sm'
                  >
                    Apply
                  </button>
                </div>
              </div>
            </Modal>

            <Modal open={showImageModal} setOpen={setShowImageModal}>
              <div className='flex flex-col items-center justify-center space-y-4'>
                {selectedImageData && (
                  <>
                    <img
                      src={selectedImageData}
                      alt='Enlarged view of selected item or report photo'
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

            <Modal
              open={showAllLocationsFilterModal}
              setOpen={setShowAllLocationsFilterModal}
            >
              <div className='bg-white rounded-lg p-6 w-full max-w-md mx-auto space-y-5'>
                <h2 className='text-xl font-bold text-black'>
                  Filter Locations
                </h2>
                <div className='space-y-4'>
                  <input
                    type='text'
                    placeholder='Search by name or teacher...'
                    value={locationSearchQuery}
                    onChange={(e) => {
                      setLocationSearchQuery(e.target.value);
                      searchLocations(
                        e.target.value,
                        locationItemSearchQuery,
                        sortLocationsByItems,
                      );
                    }}
                    className='w-full text-gray-700 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none'
                  />
                  <input
                    type='text'
                    placeholder='Search by items found...'
                    value={locationItemSearchQuery}
                    onChange={(e) => {
                      setLocationItemSearchQuery(e.target.value);
                      searchLocations(
                        locationSearchQuery,
                        e.target.value,
                        sortLocationsByItems,
                      );
                    }}
                    className='w-full text-gray-700 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none'
                  />
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id='sortByItemsModal'
                      checked={sortLocationsByItems}
                      onChange={(e) => {
                        setSortLocationsByItems(e.target.checked);
                        searchLocations(
                          locationSearchQuery,
                          locationItemSearchQuery,
                          e.target.checked,
                        );
                      }}
                      className='h-4 w-4 rounded border-gray-300 text-indigo-600'
                    />
                    <label
                      htmlFor='sortByItemsModal'
                      className='text-sm font-semibold text-gray-900'
                    >
                      Most items found
                    </label>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => {
                      setLocationSearchQuery('');
                      setLocationItemSearchQuery('');
                      setSortLocationsByItems(false);
                      setFilteredLocations(locations);
                      if (locations.length > 0) {
                        setSelectedLocation(locations[0]);
                      }
                      setShowAllLocationsFilterModal(false);
                    }}
                    className='flex-1 bg-gray-100 hover:bg-gray-200 hover:cursor-pointer text-gray-700 font-semibold py-2 rounded-md text-sm'
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowAllLocationsFilterModal(false)}
                    className='flex-1 bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white font-semibold py-2 rounded-md text-sm'
                  >
                    Apply
                  </button>
                </div>
              </div>
            </Modal>
          </div>
        </div>
      )}

      {/* Tutorial button */}
      <button
        onClick={startTutorial}
        className='fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-indigo-500 text-white font-bold text-lg shadow-lg hover:bg-indigo-600 transition-colors flex items-center justify-center cursor-pointer'
        title='Take a tour'
      >
        ?
      </button>
    </div>
  );
}
