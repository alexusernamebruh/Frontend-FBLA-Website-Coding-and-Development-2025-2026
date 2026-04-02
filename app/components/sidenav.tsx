'use client';
import {
  BriefcaseIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  DocumentIcon,
  DocumentMagnifyingGlassIcon,
  DocumentPlusIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  MagnifyingGlassPlusIcon,
  MapPinIcon,
  MegaphoneIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type NavItem = { name: string; icon: React.ElementType };
type NavGroup = { group: string; icon: React.ElementType; children: NavItem[] };
type NavEntry = NavItem | NavGroup;

const isGroup = (entry: NavEntry): entry is NavGroup => 'children' in entry;

const userLayout: NavEntry[] = [
  { name: 'All Items', icon: BriefcaseIcon },
  {
    group: 'Reports',
    icon: DocumentIcon,
    children: [
      { name: 'Your Reports', icon: DocumentTextIcon },
      { name: 'Submit Reports', icon: DocumentPlusIcon },
    ],
  },
  {
    group: 'Claims',
    icon: MagnifyingGlassIcon,
    children: [
      { name: 'Your Claims', icon: DocumentMagnifyingGlassIcon },
      { name: 'Submit Claims', icon: MagnifyingGlassPlusIcon },
    ],
  },
  { name: 'Item Lookouts', icon: MapPinIcon },
  { name: 'Chats', icon: ChatBubbleLeftEllipsisIcon },
];

const adminLayout: NavEntry[] = [
  { name: 'All Items', icon: BriefcaseIcon },
  {
    group: 'Reports',
    icon: EnvelopeIcon,
    children: [
      { name: 'Pending Reports', icon: DocumentTextIcon },
      { name: 'Declined Reports', icon: XCircleIcon },
      { name: 'Approved Reports', icon: CheckBadgeIcon },
    ],
  },
  {
    group: 'Claims',
    icon: CheckBadgeIcon,
    children: [
      { name: 'Pending Claims', icon: DocumentTextIcon },
      { name: 'Approved Claims', icon: CheckBadgeIcon },
    ],
  },
];

const itemCls =
  'flex font-semibold items-center gap-2 px-2 py-2 rounded-md cursor-pointer text-sm font-medium w-full text-left';
const activeCls = 'bg-indigo-600 text-white';
const inactiveCls = 'text-indigo-200 hover:bg-indigo-600 hover:text-white';

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
  const [name, setName] = useState('Loading...');
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      queueMicrotask(() => {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) setName(parsed.name);
      });
    }
  }, []);

  // Auto-open the group that contains the active item
  useEffect(() => {
    const layout = type === 'admin' ? adminLayout : userLayout;
    layout.forEach((entry) => {
      if (isGroup(entry) && entry.children.some((c) => c.name === current)) {
        setOpenGroups((prev) =>
          prev.includes(entry.group) ? prev : [...prev, entry.group],
        );
      }
    });
  }, [current, type]);

  const toggleGroup = (group: string) =>
    setOpenGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group],
    );

  const layout = type === 'admin' ? adminLayout : userLayout;

  return (
    <div className='flex flex-col bg-indigo-500 h-full py-6 px-4 w-60'>
      <p className='font-bold text-white text-sm mb-4 px-1'>Home</p>

      <nav className='flex flex-col gap-0.5 flex-1'>
        {layout.map((entry) => {
          if (isGroup(entry)) {
            const Icon = entry.icon;
            const isOpen = openGroups.includes(entry.group);
            const hasActive = entry.children.some((c) => c.name === current);
            return (
              <div key={entry.group}>
                <button
                  onClick={() => toggleGroup(entry.group)}
                  className={`${itemCls} ${hasActive && !isOpen ? activeCls : inactiveCls} justify-between`}
                >
                  <span className='flex items-center gap-2'>
                    <Icon className='w-4 h-4 shrink-0' />
                    {entry.group}
                  </span>
                  {isOpen ? (
                    <ChevronDownIcon className='w-3 h-3' />
                  ) : (
                    <ChevronRightIcon className='w-3 h-3' />
                  )}
                </button>
                {isOpen && (
                  <div className='ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-indigo-400 pl-2'>
                    {entry.children.map((child) => {
                      const CIcon = child.icon;
                      return (
                        <button
                          key={child.name}
                          onClick={() => setCurrent(child.name)}
                          className={`${itemCls} ${current === child.name ? activeCls : inactiveCls}`}
                        >
                          <CIcon className='w-4 h-4 shrink-0' />
                          {child.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const Icon = entry.icon;
          return (
            <button
              key={entry.name}
              onClick={() => setCurrent(entry.name)}
              className={`${itemCls} ${current === entry.name ? activeCls : inactiveCls}`}
            >
              <Icon className='w-4 h-4 shrink-0' />
              {entry.name}
            </button>
          );
        })}
      </nav>

      <div className='mt-auto flex flex-col items-center gap-2 pt-4'>
        <p className='font-bold text-white text-sm'>
          {type === 'admin' ? 'Admin' : name}
        </p>
        {type !== 'admin' && (
          <button
            onClick={() => {
              localStorage.removeItem('user');
              router.push('/login');
            }}
            className='w-full text-center text-sm font-bold text-white border border-white px-3 py-1 rounded-md hover:text-red-400 hover:border-red-400'
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
