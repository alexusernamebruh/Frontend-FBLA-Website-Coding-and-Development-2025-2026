'use client';
import { useState } from 'react';

import { a } from '../config';
import { useRouter } from 'next/navigation';

export default function Signup() {
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const signup = async () => {
    const { data: response } = await a.post('/users', {
      password: password,
      name: fullname,
      email: email,
    });
    if (response) {
      localStorage.setItem('user', JSON.stringify(response));
      router.push('/home');
    }
  };

  return (
    <>
      <div className='flex flex-col lg:flex-row min-h-screen h-full bg-white'>
        <div className='bg-grid flex-1 lg:w-1/2 bg-white'>
          <div className='mx-auto max-w-120 h-full w-full my-auto'>
            <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
              <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                <h2 className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>
                  Sign Up
                </h2>
              </div>

              <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-sm'>
                <div className='space-y-6'>
                  <div>
                    <div className='flex items-center justify-between'>
                      <label
                        htmlFor='email'
                        className='block text-sm/6 font-bold text-gray-900'
                      >
                        Email*
                      </label>
                    </div>
                    <div className='mt-2'>
                      <input
                        type='email'
                        onChange={(v) => setEmail(v.target.value)}
                        value={email}
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                      />
                    </div>
                  </div>
                  <div>
                    <div className='flex items-center justify-between'>
                      <label
                        htmlFor='fullname'
                        className='block text-sm/6 font-bold text-gray-900'
                      >
                        Name*
                      </label>
                    </div>
                    <div className='mt-2'>
                      <input
                        type='text'
                        onChange={(v) => setFullname(v.target.value)}
                        value={fullname}
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                      />
                    </div>
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
                        value={password}
                        className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6'
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => signup()}
                      className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                    >
                      Sign Up
                    </button>
                  </div>
                  <p
                    onClick={() => router.push('/login')}
                    className='text-indigo-500 w-fit font-semibold hover:cursor-pointer hover:underline'
                  >
                    Or Login instead
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='hidden lg:block h-screen w-1/2'>
          <img
            src='https://images.pexels.com/photos/63901/pexels-photo-63901.jpeg'
            className='w-full h-full object-cover'
          />
        </div>
      </div>
    </>
  );
}
