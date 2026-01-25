'use client';
import {
  BriefcaseIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  MegaphoneIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const userLayout = [
  {
    name: 'All Items',
    icon: BriefcaseIcon,
    highlighted:
      'bg-indigo-600 hover:cursor-pointer text-white space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
    notHighlighted:
      'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
  },
  {
    name: 'Your Reports',
    icon: EnvelopeIcon,
    highlighted:
      'bg-indigo-600 hover:cursor-pointer text-white space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
    notHighlighted:
      'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
  },
  {
    name: 'Submit Reports',
    icon: BriefcaseIcon,
    highlighted:
      'bg-indigo-600 hover:cursor-pointer text-white space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
    notHighlighted:
      'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
  },
  {
    name: 'Your Claims',
    icon: BriefcaseIcon,
    highlighted:
      'bg-indigo-600 hover:cursor-pointer text-white space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
    notHighlighted:
      'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
  },
  {
    name: 'Submit Claims',
    icon: BriefcaseIcon,
    highlighted:
      'bg-indigo-600 hover:cursor-pointer text-white space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
    notHighlighted:
      'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
  },
  {
    name: 'Chats',
    icon: MegaphoneIcon,
    highlighted:
      'bg-indigo-600 hover:cursor-pointer text-white space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
    notHighlighted:
      'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
  },
];

const adminLayout = [
  {
    name: 'All Items',
    icon: BriefcaseIcon,
    highlighted:
      'bg-indigo-600 hover:cursor-pointer text-white space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
    notHighlighted:
      'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
  },
  {
    name: 'Pending Reports',
    icon: BriefcaseIcon,
    highlighted:
      'bg-indigo-600 hover:cursor-pointer text-white space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
    notHighlighted:
      'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
  },
  {
    name: 'Pending Claims',
    icon: CheckBadgeIcon,
    highlighted:
      'bg-indigo-600 hover:cursor-pointer text-white space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
    notHighlighted:
      'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
  },
  {
    name: 'Declined Reports',
    icon: XCircleIcon,
    highlighted:
      'bg-indigo-600 hover:cursor-pointer text-white space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
    notHighlighted:
      'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
  },
  {
    name: 'Approved Reports',
    icon: XCircleIcon,
    highlighted:
      'bg-indigo-600 hover:cursor-pointer text-white space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
    notHighlighted:
      'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
  },
  {
    name: 'Approved Claims',
    icon: XCircleIcon,
    highlighted:
      'bg-indigo-600 hover:cursor-pointer text-white space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
    notHighlighted:
      'bg-indigo-500 hover:cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-600 space-x-2 px-2 py-2.5 items-center rounded-md text-left flex',
  },
];

export default function SideNav({
  current,
  setCurrent,
  type,
}: {
  current: string;
  setCurrent: (v: string) => void;
  type: string | undefined | null;
}) {
  const router = useRouter();
  const [name, setName] = useState<string>('Loading...');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      queueMicrotask(() => {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) setName(parsed.name);
      });
    }
  }, []);

  return (
    <div className='flex bg-indigo-500 flex-col text-indigo-600 space-y-2 items-center px-4 h-full py-8'>
      <p className='font-bold mb-2 text-white'>Home</p>
      <div className='flex flex-col space-y-1 font-semibold text-sm w-[15rem]'>
        {type === 'user' && (
          <div className='space-y-1'>
            {userLayout.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className={
                    current === item.name
                      ? item.highlighted
                      : item.notHighlighted
                  }
                  onClick={() => {
                    if (current !== item.name) {
                      setCurrent(item.name);
                    }
                  }}
                >
                  <div className='w-5 h-5'>
                    <Icon />
                  </div>
                  <p className='w-fit'>{item.name}</p>
                </div>
              );
            })}
          </div>
        )}
        {type === 'admin' && (
          <div className='space-y-1'>
            {adminLayout.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className={
                    current === item.name
                      ? item.highlighted
                      : item.notHighlighted
                  }
                  onClick={() => {
                    if (current !== item.name) {
                      setCurrent(item.name);
                    }
                  }}
                >
                  <div className='w-5 h-5'>
                    <Icon />
                  </div>
                  <p>{item.name}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className='flex flex-col items-center mb-6 h-full space-y-2'>
        <div className='font-bold mt-auto text-white'>
          {type === 'user' && name}
          {type === 'admin' && 'Admin'}
        </div>
        {type !== 'admin' && (
          <div
            onClick={() => {
              localStorage.removeItem('user');
              router.push('/login');
            }}
            className='font-bold text-white hover:text-red-500 hover:border-red-500 hover:cursor-pointer border border-white px-3 py-1 rounded-md w-full text-center'
          >
            Logout
          </div>
        )}
      </div>
    </div>
  );
}
