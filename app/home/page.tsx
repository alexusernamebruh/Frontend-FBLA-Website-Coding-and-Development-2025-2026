'use client';

import { useEffect, useState } from 'react';
import SideNav from '../components/sidenav';
import { a } from '../config';
import Success from '../components/success';

const HomePage = () => {
  const [current, setCurrent] = useState('All Reports');
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [createSubmissionFormSuccess, setCreateSubmissionFormSuccess] =
    useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<File[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedPhotos(Array.from(e.target.files));
  };

  const getUnclaimedItems = async () => {
    const { data: response } = await a.get('/items/unclaimed');
    console.log(response);
  };
  useEffect(() => {
    getUnclaimedItems();
  }, []);

  const createSubmissionForm = async () => {
    const { data: response } = await a.post('/submissionForms', {
      itemName: newItemName,
      itemDescription: newItemDescription,
      userId: JSON.parse(localStorage.getItem('user') || '{}').id,
    });
    if (response) {
      setCreateSubmissionFormSuccess(true);
      const timer = setTimeout(() => {
        setCreateSubmissionFormSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }

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
  };

  return (
    <div className='bg-grid h-screen w-full overflow-hidden bg-white flex'>
      <div className='absolute'>
        <Success
          title={'Success!'}
          description={'Submission form created'}
          show={createSubmissionFormSuccess}
          setShow={setCreateSubmissionFormSuccess}
        />
      </div>
      <div className='w-fit h-screen'>
        <SideNav current={current} setCurrent={setCurrent} type={'user'} />
      </div>
      <div className='w-full h-screen overflow-hidden'>
        {current === 'Submit Reports' && (
          <div className='w-full h-full bg-grid'>
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
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
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
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
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
                      {selectedPhotos?.map((file) => file.name).join(', ')}
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
        {/* create submissionForm */}
      </div>
    </div>
  );
};

export default HomePage;
