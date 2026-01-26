export default function Citations() {
  return (
    <>
      {/* Desktop Version */}
      <div className='hidden lg:flex bg-grid h-screen w-full overflow-hidden bg-white'>
        <div className='w-full h-screen overflow-hidden'>
          <div className='w-full h-full flex flex-col'>
            <div className='flex w-full h-full p-8'>
              <div className='w-full h-full bg-white rounded-lg border border-gray-300 shadow-md p-8'>
                <h1 className='text-3xl font-bold text-black mb-8'>Citations</h1>
                <div className='space-y-6'>
                  <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                    <h3 className='font-bold text-lg text-black mb-2'>Compass Video</h3>
                    <p className='text-sm text-gray-600 mb-1'>https://www.pexels.com/download/video/1793508/</p>
                    <p className='text-sm text-gray-500'>By Miguel Á. Padriñán</p>
                  </div>
                  <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                    <h3 className='font-bold text-lg text-black mb-2'>Binocular Picture</h3>
                    <p className='text-sm text-gray-600 mb-1'>https://images.pexels.com/photos/63901/pexels-photo-63901.jpeg</p>
                    <p className='text-sm text-gray-500'>By ClickHappy</p>
                  </div>
                  <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                    <h3 className='font-bold text-lg text-black mb-2'>Magnifying Glass Picture</h3>
                    <p className='text-sm text-gray-600 mb-1'>https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg</p>
                    <p className='text-sm text-gray-500'>By lil artsy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className='lg:hidden bg-white min-h-screen pb-4'>
        <div className='bg-indigo-600 text-white p-4 shadow-lg'>
          <h1 className='text-xl font-bold'>Citations</h1>
        </div>
        <div className='p-4'>
          <div className='space-y-4'>
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
              <h3 className='font-bold text-black mb-2'>Compass Video</h3>
              <p className='text-sm text-gray-600 mb-1'>https://www.pexels.com/download/video/1793508/</p>
              <p className='text-sm text-gray-500'>By Miguel Á. Padriñán</p>
            </div>
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
              <h3 className='font-bold text-black mb-2'>Binocular Picture</h3>
              <p className='text-sm text-gray-600 mb-1'>https://images.pexels.com/photos/63901/pexels-photo-63901.jpeg</p>
              <p className='text-sm text-gray-500'>By ClickHappy</p>
            </div>
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
              <h3 className='font-bold text-black mb-2'>Magnifying Glass Picture</h3>
              <p className='text-sm text-gray-600 mb-1'>https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg</p>
              <p className='text-sm text-gray-500'>By lil artsy</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
