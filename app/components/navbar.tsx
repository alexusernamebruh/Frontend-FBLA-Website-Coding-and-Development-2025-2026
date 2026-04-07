export default function Navbar() {
  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 bg-grid bg-white border-b border-gray-300 text-gray-900 rounded-lg px-4 sm:px-6 py-4'>
      <p className='font-bold'>South Western High School</p>
      <div className='flex flex-wrap gap-4 text-sm font-semibold'>
        <a href='/signup' className='hover:underline hover:text-indigo-600'>
          Get Started
        </a>
        <a href='/userGuide' className='hover:underline hover:text-indigo-600'>
          User Guide
        </a>
        <a href='/citations' className='hover:underline hover:text-indigo-600'>
          Citations
        </a>
      </div>
    </div>
  );
}
