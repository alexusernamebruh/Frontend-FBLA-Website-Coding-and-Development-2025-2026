export default function Navbar() {
  return (
    <div className='flex bg-grid bg-white border-gray-300 border-b text-gray-900 items-center rounded-lg px-14 h-16 py-4'>
      <p className='font-bold'>South Western High School</p>
      <div className='ml-auto flex space-x-8'>
        <a href='/signup' className='font-bold hover:cursor-pointer'>
          Get Started
        </a>
        <a href='/userGuide' className='font-bold hover:cursor-pointer'>
          User Guide
        </a>
        <a href='/citations' className='font-bold hover:cursor-pointer'>
          Citations
        </a>
      </div>
    </div>
  );
}
