'use client';

import { useEffect, useState } from 'react';
import SideNav from '../components/sidenav';
import { a } from '../config';

const HomePage = () => {
  const [current, setCurrent] = useState('All Reports');

  const getUnclaimedItems = async () => {
    const { data: response } = await a.get('/items/unclaimed');
    console.log(response);
  };
  useEffect(() => {
    getUnclaimedItems();
  }, []);

  return (
    <div className='bg-grid h-screen w-full overflow-hidden bg-white flex'>
      <div className='w-fit h-screen'>
        <SideNav current={current} setCurrent={setCurrent} type={'user'} />
      </div>
      <div className='w-full h-screen overflow-hidden'></div>
    </div>
  );
};

export default HomePage;
