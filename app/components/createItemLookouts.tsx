'use client';

import { useState } from 'react';
import { a } from '../config';
import Modal from './modal';

interface CreateItemLookoutModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateItemLookouts = ({
  open,
  setOpen,
  onSuccess,
}: CreateItemLookoutModalProps) => {
  const [lookoutDescription, setLookoutDescription] = useState('');
  const [selectedPhotos, setSelectedPhotos] = useState<File[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedPhotos(Array.from(e.target.files));
  };

  const createItemLookout = async () => {
    if (!lookoutDescription.trim()) {
      alert('Please enter a description');
      return;
    }

    try {
      setIsLoading(true);
      const userId = JSON.parse(localStorage.getItem('user') || '{}').id;

      const photoIds: number[] = [];

      if (selectedPhotos !== null && selectedPhotos.length > 0) {
        const formData = new FormData();
        for (let i = 0; i < selectedPhotos.length; i++) {
          formData.append('photos', selectedPhotos[i]);
        }

        try {
          const { data: photoResponse } = await a.post('/photos', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          for (let i = 0; i < photoResponse.length; i++) {
            photoIds.push(photoResponse[i]);
          }
        } catch (photoError) {
          console.error('Error uploading photos:', photoError);
          alert('Error uploading photos');
          setIsLoading(false);
          return;
        }
      }
      const { data: response } = await a.post('/itemLookouts', {
        description: lookoutDescription,
        photoIds: photoIds,
        userId: userId,
      });

      if (response) {
        setSelectedPhotos(null);
        setLookoutDescription('');
        setIsLoading(false);
        setOpen(false);
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating item lookout:', error);
      alert('Error creating item lookout');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPhotos(null);
    setLookoutDescription('');
    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={handleClose}>
      <div className='max-w-md mx-auto bg-white rounded-lg p-6'>
        <h2 className='text-xl font-bold text-black mb-4'>
          Create Item Lookout
        </h2>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-bold text-black mb-2'>
              Item description*
            </label>
            <textarea
              onChange={(v) => setLookoutDescription(v.target.value)}
              value={lookoutDescription}
              rows={4}
              placeholder='Describe the item you are looking for...'
              className='w-full placeholder-gray-400 text-black rounded-md border border-gray-300 px-3 py-2 text-sm'
            />
          </div>

          <div>
            <label className='block text-sm font-bold text-black mb-2'>
              Photos (optional)
            </label>
            <label>
              <input
                onChange={handleFileChange}
                type='file'
                accept='.png, .jpg, .jpeg, .webp'
                hidden
                multiple
              />
              <div className='flex w-28 h-9 px-2 flex-col bg-indigo-500 rounded-md shadow text-white text-xs font-semibold leading-4 items-center justify-center cursor-pointer hover:bg-indigo-600'>
                Choose Photos
              </div>
            </label>
            <div className='text-black text-xs font-semibold mt-1'>
              Selected photos:{' '}
              {selectedPhotos?.length
                ? selectedPhotos?.map((file) => file.name).join(', ')
                : 'None'}
            </div>
          </div>

          <div className='flex space-x-3'>
            <button
              onClick={() => createItemLookout()}
              disabled={isLoading}
              className='flex-1 bg-indigo-500 hover:bg-indigo-600 hover:cursor-pointer text-white py-2 rounded-md font-semibold disabled:bg-gray-400'
            >
              {isLoading ? 'Creating...' : 'Create Lookout'}
            </button>
            <button
              onClick={handleClose}
              className='flex-1 bg-gray-400 hover:bg-gray-500 hover:cursor-pointer text-white py-2 rounded-md font-semibold'
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateItemLookouts;
