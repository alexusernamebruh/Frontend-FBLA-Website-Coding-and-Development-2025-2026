export default function Footer() {
  return (
    <footer
      className='w-full rounded-b-lg bg-indigo-900 text-white bg-grid py-10 px-4 sm:px-6'
      role='contentinfo'
      aria-label='Footer'
    >
      <div className='mx-auto max-w-7xl'>
        <div className='grid gap-8 md:grid-cols-2 items-center'>
          <div>
            <h3 className='text-lg font-semibold'>Contact Us</h3>
            <address className='mt-6 space-y-4 text-sm font-semibold not-italic'>
              <p className='text-md'>Phone: 717-632-2500</p>
              <p className='text-md'>
                Address: 225 Bowman Road, Hanover, Pennsylvania
              </p>
            </address>
          </div>
        </div>
      </div>
    </footer>
  );
}
