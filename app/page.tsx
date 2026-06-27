'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/navbar';
import Footer from './components/footer';
import {
  MagnifyingGlassCircleIcon,
  BellAlertIcon,
  BookOpenIcon,
  MegaphoneIcon,
  CheckCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useTutorial } from './hooks/useTutorial';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { startTutorial } = useTutorial([
    {
      element: 'header h1, .animate-hero-text > p:first-child',
      intro:
        'Welcome to the Lost & Found portal! This is where you can report or find lost items at South Western High School.',
      position: 'bottom',
    },
    {
      element: 'a[href="/signup"]',
      intro:
        'Click "Get Started" to create an account and start using the system.',
      position: 'bottom',
    },
    {
      element: '.animate-features',
      intro:
        'Explore the key features: Smart search, User Guide, Item Lookouts, Chats, Notifications, and Claims.',
      position: 'top',
    },
    {
      element: '.animate-how',
      intro:
        'Learn how the system works in 4 simple steps: Report or Search, Connect & Verify, Submit Claim, and Get It Back.',
      position: 'top',
    },
    {
      element: '.animate-cta',
      intro: 'Ready to get started? Sign up today and find your lost items!',
      position: 'top',
    },
    {
      element: '.animate-hero-video',
      intro: 'Watch a quick demo video to see the platform in action.',
      position: 'left',
    },
  ]);

  useEffect(() => {
    // ensure plugin registered on client
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const heroTexts = gsap.utils.toArray('.animate-hero-text');
      if (heroTexts.length) {
        gsap.from(heroTexts, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.08,
        });
      }

      const heroVideos = gsap.utils.toArray('.animate-hero-video');
      if (heroVideos.length) {
        gsap.from(heroVideos, {
          opacity: 0,
          x: 40,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          stagger: 0.08,
        });
      }

      const featureEls = gsap.utils.toArray('.animate-features');
      featureEls.forEach((el) => {
        gsap.from(el as HTMLElement, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el as HTMLElement, start: 'top 85%' },
        });
      });

      const howEls = gsap.utils.toArray('.animate-how');
      howEls.forEach((el) => {
        gsap.from(el as HTMLElement, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el as HTMLElement, start: 'top 85%' },
        });
      });

      const ctaEls = gsap.utils.toArray('.animate-cta');
      ctaEls.forEach((el) => {
        gsap.from(el as HTMLElement, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el as HTMLElement, start: 'top 85%' },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <div className='md:hidden lg:flex flex-col min-h-screen h-full max-w-screen overflow-x-clip p-4 bg-indigo-50'>
        <div className='w-full h-full sticky top-0 z-2'>
          <Navbar />
          <div className='h-4 w-full bg-indigo-100 blur-2xl' />
        </div>
        <div className='flex flex-col w-full h-full bg-grid bg-white rounded-lg shadow'>
          {/* Hero Section */}
          <div className='flex w-full space-x-6 px-14 items-center py-22'>
            <div className='text-left w-1/2 flex flex-col space-y-3 h-full animate-hero-text'>
              <div className='space-y-3 h-full flex flex-col justify-center'>
                <p className='font-bold text-6xl text-black'>
                  Lost and <span className='text-indigo-500'>Found</span>
                </p>
                <div className='text-gray-600'>
                  <p className='font-bold text-xl'>
                    For students of South Western High School
                  </p>
                  <p className='font-bold text-md'>
                    Create an account to claim or report lost items in your
                    school community.
                  </p>
                </div>

                <div></div>
                <a
                  href='/signup'
                  className='bg-[#5a5df0] hover:bg-indigo-600 px-4 py-2 text-white hover:cursor-pointer rounded-lg w-fit font-bold'
                >
                  Get Started
                </a>
              </div>
            </div>
            <div className='w-1/2 flex-col my-auto p-6 rounded-xl bg-indigo-50 shadow-lg shadow-indigo-200 animate-hero-video'>
              <video
                src='/assets/compass.mp4'
                className='rounded-xl'
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
          {/* Features Section */}
          <div className='grid grid-cols-3 gap-x-8 gap-y-8 py-14 px-10 animate-features'>
            <div className='shadow overflow-hidden shadow-indigo-200 px-4 py-6 flex bg-white border border-gray-200 rounded-lg text-black font-semibold justify-between'>
              <div className='pr-4'>
                <p>Smart search</p>
                <p className='text-sm mt-4 text-gray-600'>
                  Find lost items quickly with similarity searching and location
                  searching.
                </p>
                <p className='text-sm mt-4 text-gray-600'>
                  the item, or a short description.
                </p>
              </div>
              <div className='flex justify-center bg-indigo-100 -mr-20 rounded-full'>
                <MagnifyingGlassCircleIcon className='h-62 w-62 text-indigo-500' />
              </div>
            </div>
            <div className='shadow text-white overflow-hidden shadow-indigo-200 px-4 py-6 flex bg-[#5a5df0] rounded-lg font-semibold justify-between'>
              <div className='pr-4'>
                <p>User Guide</p>
                <p className='text-sm mt-4 text-white'>
                  Read a comprehensive user guide with step by step
                  instructions.
                </p>
                <p className='text-sm mt-4 text-white'>
                  Learn how to use effectively use every feature.
                </p>
              </div>
              <div className='flex shrink-0 justify-center items-center bg-white -mr-20 h-62 w-62 rounded-full'>
                <BookOpenIcon className='h-42 w-42 text-indigo-500' />
              </div>
            </div>
            <div className='shadow overflow-hidden shadow-indigo-200 px-4 py-6 flex bg-white border border-gray-200 rounded-lg text-black font-semibold justify-between'>
              <div className='pr-4'>
                <p>Item Lookouts</p>
                <p className='text-sm mt-4 text-gray-600'>
                  Get notified when an item matching your lost item is reported.
                </p>
                <p className='text-sm mt-4 text-gray-600'>
                  You will get notified in the website and by email when an item
                  matching your lost item is reported. Matching can happen by a
                  description or a photo.
                </p>
              </div>
              <div className='flex shrink-0 justify-center items-center bg-indigo-100 h-62 w-62 -mr-20 rounded-full'>
                <MegaphoneIcon className='h-38 w-38 text-indigo-500' />
              </div>
            </div>

            <div className='shadow text-white overflow-hidden shadow-indigo-200 px-4 py-6 flex bg-[#5a5df0] rounded-lg font-semibold justify-between'>
              <div className='pr-4'>
                <p>Chats</p>
                <p className='text-sm mt-4 text-white'>
                  Communicate directly with other users to ask questions about
                  items.
                </p>
                <p className='text-sm mt-4 text-white'>
                  The chat helps you verify details about lost items.
                </p>
              </div>
              <div className='flex shrink-0 justify-center items-center bg-white -mr-20 h-62 w-62 rounded-full'>
                <ChatBubbleOvalLeftEllipsisIcon className='h-38 w-38 text-indigo-500' />
              </div>
            </div>

            <div className='shadow overflow-hidden shadow-indigo-200 px-4 py-6 flex bg-white border border-gray-200 rounded-lg text-black font-semibold justify-between'>
              <div className='pr-4'>
                <p>Notifications</p>
                <p className='text-sm mt-4 text-gray-600'>
                  View the notification page in the website or get email
                  notifications about your lookouts.
                </p>
                <p className='text-sm mt-4 text-gray-600'>
                  The notification page quickly updates you on claims, reports,
                  chats, and lookouts.
                </p>
              </div>
              <div className='flex shrink-0 justify-center items-center bg-indigo-100 -mr-20 h-62 w-62 rounded-full'>
                <BellAlertIcon className='h-36 w-36 text-indigo-500' />
              </div>
            </div>
            <div className='shadow text-white overflow-hidden shadow-indigo-200 px-4 py-6 flex bg-[#5a5df0] rounded-lg font-semibold justify-between'>
              <div className='pr-4'>
                <p>Claims</p>
                <p className='text-sm mt-4 text-white'>
                  Use our streamlined claim system and get your items back
                  quickly.
                </p>
                <p className='text-sm mt-4 text-white'>
                  Claims should be submitted with verifying details about why
                  the item belongs to you.
                </p>
              </div>
              <div className='flex shrink-0 justify-center items-center bg-white -mr-20 h-62 w-62 rounded-full'>
                <CheckCircleIcon className='h-62 w-62 text-indigo-500' />
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className='bg-indigo-900 rounded-lg mx-14 mb-10 animate-how'>
            <div className='px-14 py-12'>
              <p className='text-4xl font-bold text-white mb-2'>How It Works</p>
              <p className='text-indigo-100 mb-8'>
                Get your lost items back in four simple steps. Learn more in the{' '}
                <span
                  className='text-indigo-300 hover:underline cursor-pointer'
                  onClick={() => router.push('/userGuide')}
                >
                  user guide
                </span>
                .
              </p>

              <div className='grid grid-cols-4 gap-6'>
                <div className='text-center'>
                  <div className='w-16 h-16 bg-[#5a5df0] rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-2xl font-bold text-white'>1</span>
                  </div>
                  <h3 className='font-bold text-white mb-2'>
                    Report or Search
                  </h3>
                  <p className='text-sm text-indigo-50'>
                    Found an item? Report it. Lost something? Search our
                    inventory or use photo matching.
                  </p>
                </div>

                <div className='text-center'>
                  <div className='w-16 h-16 bg-[#5a5df0] rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-2xl font-bold text-white'>2</span>
                  </div>
                  <h3 className='font-bold text-white mb-2'>
                    Connect & Verify
                  </h3>
                  <p className='text-sm text-indigo-50'>
                    Message other users directly to ask questions and verify
                    details about items you&apos;re interested in.
                  </p>
                </div>

                <div className='text-center'>
                  <div className='w-16 h-16 bg-[#5a5df0] rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-2xl font-bold text-white'>3</span>
                  </div>
                  <h3 className='font-bold text-white mb-2'>Submit Claim</h3>
                  <p className='text-sm text-indigo-50'>
                    Submit a detailed claim explaining why an item belongs to
                    you. Include identifying details or marks.
                  </p>
                </div>

                <div className='text-center'>
                  <div className='w-16 h-16 bg-[#5a5df0] rounded-full flex items-center justify-center mx-auto mb-4'>
                    <span className='text-2xl font-bold text-white'>4</span>
                  </div>
                  <h3 className='font-bold text-white mb-2'>Get It Back</h3>
                  <p className='text-sm text-indigo-50'>
                    Once your claim is approved, the admin will contact you to
                    arrange pickup of your item.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className='px-14'>
            <div className='text-center flex space-y-3 w-full h-full space-x-6 px-14 items-center py-16 rounded-lg mb-10 animate-cta'>
              <div className='space-y-3 w-full h-full text-black flex text-center flex-col justify-center'>
                <p className='font-bold text-6xl text-black'>
                  Ready to Get Started?
                </p>
                <div className=''>
                  <p className='font-bold text-xl'>
                    Join our community and start{' '}
                    <span className='text-indigo-500'>finding</span> your lost
                    items today.
                  </p>
                </div>

                <div className='flex gap-4 justify-center mt-4'>
                  <a
                    href='/signup'
                    className='bg-[#5a5df0] hover:bg-indigo-600 px-6 py-3 text-white hover:cursor-pointer rounded-lg font-bold'
                  >
                    Create Account
                  </a>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>

      {/* Mobile view */}
      <div className='lg:hidden md:flex flex-col min-h-screen h-full pt-4 bg-indigo-50'>
        <div className='w-full h-full pb-4'>
          <Navbar />
        </div>
        <div className='w-full h-full bg-grid bg-white rounded-lg shadow'>
          {/* Hero Section Mobile */}
          <div className='flex flex-col w-full px-6 pt-8 pb-8 space-y-8'>
            <div className='space-y-6 animate-hero-text'>
              <p className='font-bold text-5xl text-black'>
                Lost and <span className='text-indigo-500'>Found</span>
              </p>
              <div className='text-gray-600'>
                <p className='font-bold text-xl'>
                  For students of South Western High School
                </p>
                <p className='font-bold text-md pt-1'>
                  Create an account to claim or report lost items in your school
                  community.
                </p>
              </div>
              <a
                href='/signup'
                className='bg-[#5a5df0] hover:bg-indigo-600 px-4 py-3 text-white hover:cursor-pointer rounded-lg w-full font-bold text-center'
              >
                Get Started
              </a>
            </div>

            <div className='w-full rounded-xl bg-indigo-50 p-4 shadow-lg shadow-indigo-200 animate-hero-video'>
              <video
                src='/assets/compass.mp4'
                className='rounded-xl w-full'
                autoPlay
                loop
                muted
                playsInline
              />
            </div>

            {/* Features Mobile */}
            <div className='space-y-4 animate-features'>
              <div className='shadow overflow-hidden shadow-indigo-200 px-4 py-6 flex flex-col bg-white border border-gray-200 rounded-lg text-black font-semibold'>
                <div className='mb-4'>
                  <p className='text-xl font-bold'>Smart search</p>
                  <p className='text-sm mt-4 text-gray-600'>
                    Find lost items quickly with similarity searching and
                    location searching.
                  </p>
                  <p className='text-sm mt-4 text-gray-600'>
                    You can find your lost items by searching with a picture of
                    the item, or a short description.
                  </p>
                </div>
                <div className='flex justify-center bg-indigo-100 rounded-full p-4'>
                  <MagnifyingGlassCircleIcon className='h-12 w-12 text-indigo-500' />
                </div>
              </div>

              <div className='shadow text-white overflow-hidden shadow-indigo-200 px-4 py-6 flex flex-col bg-[#5a5df0] rounded-lg font-semibold'>
                <div className='mb-4'>
                  <p className='text-xl font-bold'>User Guide</p>
                  <p className='text-sm mt-4 text-white'>
                    Read a comprehensive user guide with step by step
                    instructions.
                  </p>
                  <p className='text-sm mt-4 text-white'>
                    Learn how to use effectively use every feature.
                  </p>
                </div>
                <div className='flex shrink-0 justify-center items-center bg-white h-16 w-16 rounded-full mx-auto'>
                  <BookOpenIcon className='h-8 w-8 text-indigo-500' />
                </div>
              </div>

              <div className='shadow overflow-hidden shadow-indigo-200 px-4 py-6 flex flex-col bg-white border border-gray-200 rounded-lg text-black font-semibold'>
                <div className='mb-4'>
                  <p className='text-xl font-bold'>Item Lookouts</p>
                  <p className='text-sm mt-4 text-gray-600'>
                    Get notified when an item matching your lost item is
                    reported.
                  </p>
                  <p className='text-sm mt-4 text-gray-600'>
                    You will get notified in the website and by email when an
                    item matching your lost item is reported. Matching can
                    happen by a description or a photo.
                  </p>
                </div>
                <div className='flex shrink-0 justify-center items-center bg-indigo-100 h-16 w-16 rounded-full mx-auto'>
                  <MegaphoneIcon className='h-8 w-8 text-indigo-500' />
                </div>
              </div>

              <div className='shadow text-white overflow-hidden shadow-indigo-200 px-4 py-6 flex flex-col bg-[#5a5df0] rounded-lg font-semibold'>
                <div className='mb-4'>
                  <p className='text-xl font-bold'>Chats</p>
                  <p className='text-sm mt-4 text-white'>
                    Communicate directly with other users to ask questions about
                    items.
                  </p>
                  <p className='text-sm mt-4 text-white'>
                    The chat helps you verify details about lost items.
                  </p>
                </div>
                <div className='flex shrink-0 justify-center items-center bg-white h-16 w-16 rounded-full mx-auto'>
                  <ChatBubbleOvalLeftEllipsisIcon className='h-8 w-8 text-indigo-500' />
                </div>
              </div>

              <div className='shadow overflow-hidden shadow-indigo-200 px-4 py-6 flex flex-col bg-white border border-gray-200 rounded-lg text-black font-semibold'>
                <div className='mb-4'>
                  <p className='text-xl font-bold'>Notifications</p>
                  <p className='text-sm mt-4 text-gray-600'>
                    View the notification page in the website or get email
                    notifications about your lookouts.
                  </p>
                  <p className='text-sm mt-4 text-gray-600'>
                    The notification page quickly updates you on claims,
                    reports, chats, and lookouts.
                  </p>
                </div>
                <div className='flex shrink-0 justify-center items-center bg-indigo-100 h-16 w-16 rounded-full mx-auto'>
                  <BellAlertIcon className='h-8 w-8 text-indigo-500' />
                </div>
              </div>

              <div className='shadow text-white overflow-hidden shadow-indigo-200 px-4 py-6 flex flex-col bg-[#5a5df0] rounded-lg font-semibold'>
                <div className='mb-4'>
                  <p className='text-xl font-bold'>Claims</p>
                  <p className='text-sm mt-4 text-white'>
                    Use our streamlined claim system and get your items back
                    quickly.
                  </p>
                  <p className='text-sm mt-4 text-white'>
                    Claims should be submitted with verifying details about why
                    the item belongs to you.
                  </p>
                </div>
                <div className='flex shrink-0 justify-center items-center bg-white h-16 w-16 rounded-full mx-auto'>
                  <CheckCircleIcon className='h-12 w-12 text-indigo-500' />
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Mobile */}
          <div className='px-6 py-8 bg-indigo-900 rounded-lg mx-6 animate-how'>
            <p className='text-3xl font-bold text-white mb-2'>How It Works</p>
            <p className='text-indigo-100 mb-8'>
              Get your lost items back in four simple steps. Learn more in the{' '}
              <span
                className='text-indigo-300 hover:underline cursor-pointer'
                onClick={() => router.push('/userGuide')}
              >
                user guide
              </span>
              .
            </p>

            <div className='space-y-6'>
              <div className='text-center'>
                <div className='w-16 h-16 bg-[#5a5df0] rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl font-bold text-white'>1</span>
                </div>
                <h3 className='font-bold text-white mb-2'>Report or Search</h3>
                <p className='text-sm text-indigo-50'>
                  Found an item? Report it. Lost something? Search our inventory
                  or use photo matching.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-[#5a5df0] rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl font-bold text-white'>2</span>
                </div>
                <h3 className='font-bold text-white mb-2'>Connect & Verify</h3>
                <p className='text-sm text-indigo-50'>
                  Message other users directly to ask questions and verify
                  details about items you&apos;re interested in.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-[#5a5df0] rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl font-bold text-white'>3</span>
                </div>
                <h3 className='font-bold text-white mb-2'>Submit Claim</h3>
                <p className='text-sm text-indigo-100'>
                  Submit a detailed claim explaining why an item belongs to you.
                  Include identifying details or marks.
                </p>
              </div>

              <div className='text-center'>
                <div className='w-16 h-16 bg-[#5a5df0] rounded-full flex items-center justify-center mx-auto mb-4'>
                  <span className='text-2xl font-bold text-white'>4</span>
                </div>
                <h3 className='font-bold text-white mb-2'>Get It Back</h3>
                <p className='text-sm text-indigo-50'>
                  Once your claim is approved, the admin will contact you to
                  arrange pickup of your item.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Mobile */}
          <div className='px-6'>
            <div className='text-center flex flex-col space-y-3 w-full h-full px-6 items-center py-16 rounded-lg mb-10 animate-cta'>
              <div className='space-y-3 w-full h-full text-black flex flex-col justify-center'>
                <p className='font-bold text-5xl text-black'>
                  Ready to Get Started?
                </p>
                <div>
                  <p className='font-bold text-xl'>
                    Join our community and start{' '}
                    <span className='text-indigo-500'>finding</span> your lost
                    items today.
                  </p>
                </div>

                <div className='flex gap-4 flex-col mt-4'>
                  <a
                    href='/signup'
                    className='bg-[#5a5df0] hover:bg-indigo-600 px-6 py-3 text-white hover:cursor-pointer rounded-lg w-full font-bold'
                  >
                    Create Account
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tutorial button */}
      <button
        onClick={startTutorial}
        className='fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-[#5a5df0] text-white font-bold text-lg shadow-lg hover:bg-indigo-600 transition-colors flex items-center justify-center cursor-pointer'
        title='Take a tour'
      >
        ?
      </button>
    </div>
  );
}
