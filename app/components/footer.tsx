const navigation = {
  contact: [
    { name: '717-632-2500', href: '#' },
    { name: '225 Bowman Road, Hanover, Pennsylvania', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className='w-full rounded-b-lg bg-indigo-900 text-white bg-grid py-10 px-4 sm:px-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid gap-8 md:grid-cols-2 items-center'>
          <div>
            <h3 className='text-lg font-semibold'>Contact Us</h3>
            <ul role='list' className='mt-6 space-y-4 text-sm font-semibold'>
              {navigation.contact.map((item) => (
                <li key={item.name} className='text-md'>
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
