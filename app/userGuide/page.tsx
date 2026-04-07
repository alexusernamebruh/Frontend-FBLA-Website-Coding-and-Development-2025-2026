'use client';
import { BriefcaseIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const GuideSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className='space-y-3'>
    <div className='border-b border-gray-200 pb-2'>
      <p className='text-lg font-bold text-black'>{title}</p>
    </div>
    {children}
  </div>
);

const Step = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <div className='flex gap-3'>
    <span className='flex-shrink-0 w-7 h-7 rounded-full bg-indigo-500 text-white text-sm font-bold flex items-center justify-center'>
      {n}
    </span>
    <p className='text-gray-700 text-sm pt-0.5'>{children}</p>
  </div>
);

const Tip = ({ children }: { children: React.ReactNode }) => (
  <div className='flex gap-2 bg-indigo-50 border border-indigo-200 rounded-md px-4 py-3 text-sm text-indigo-800'>
    <span className='font-bold shrink-0'>💡 Tip:</span>
    <span>{children}</span>
  </div>
);

export default function UserGuide() {
  const [selected, setSelected] = useState('Students');

  return (
    <>
      {/* Desktop Version */}
      <div className='w-full h-full min-h-screen bg-grid bg-white hidden lg:flex'>
        {/* Sidebar */}
        <div className='bg-indigo-500 flex flex-col px-4 w-fit h-screen max-h-screen sticky top-0'>
          <div className='flex flex-col text-white space-y-2 items-center h-full py-8'>
            <p className='font-bold mb-2'>User Guide</p>
            <div className='flex flex-col space-y-1 w-52'>
              {(['Students', 'Admins'] as const).map((tab) => (
                <div
                  key={tab}
                  onClick={() => setSelected(tab)}
                  className={`flex items-center gap-2 px-2 py-2.5 rounded-md cursor-pointer font-semibold text-sm ${
                    selected === tab
                      ? 'bg-indigo-600 text-white'
                      : 'text-indigo-200 hover:bg-indigo-600 hover:text-white'
                  }`}
                >
                  <div className='w-5 h-5 shrink-0'>
                    {tab === 'Students' ? <BriefcaseIcon /> : <ScaleIcon />}
                  </div>
                  <p>{tab === 'Students' ? 'Students & Staff' : 'Admins'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='w-full flex flex-col max-h-screen p-8 overflow-auto'>
          {selected === 'Students' && (
            <div className='w-full rounded-lg border border-gray-300 min-h-screen bg-grid'>
              <div className='bg-white rounded-lg w-full h-full min-h-screen flex flex-col'>
                <div className='border-b border-gray-300 px-8 py-6'>
                  <p className='text-2xl font-bold text-black'>
                    Welcome to Lost & Found
                  </p>
                  <p className='text-sm text-gray-500 mt-1'>
                    A guide for students and staff
                  </p>
                </div>

                <div className='px-8 py-8 flex flex-col space-y-8'>
                  <GuideSection title='Overview'>
                    <p className='text-sm text-gray-700'>
                      This app provides a place for students and staff to report
                      lost items, browse found items, and claim them.
                    </p>
                  </GuideSection>

                  <GuideSection title='Getting started'>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Go to the sign-up page and create an account with your
                        name, email, and a password.
                      </Step>
                      <Step n={2}>
                        Sign in. You&apos;ll then see the home dashboard where
                        you can see currently available lost & found items.
                      </Step>
                    </div>
                  </GuideSection>

                  <GuideSection title='Browsing & searching for items'>
                    <p className='text-sm text-gray-700'>
                      The <strong>All Items</strong> page shows all unclaimed
                      found items. There are three ways to search:
                    </p>
                    <div className='space-y-2'>
                      <div className='flex gap-3 items-start'>
                        <span className='bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shrink-0'>
                          Text
                        </span>
                        <p className='text-sm text-gray-700'>
                          Type a short description of the item (such as
                          &quot;blue backpack&quot;). The app will find items
                          with similar descriptions even if the wording
                          doesn&apos;t match exactly.
                        </p>
                      </div>
                      <div className='flex gap-3 items-start'>
                        <span className='bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shrink-0'>
                          Image
                        </span>
                        <p className='text-sm text-gray-700'>
                          Upload a photo of the item (or a similar one) and the
                          app will find visually similar items in the system.
                        </p>
                      </div>
                      <div className='flex gap-3 items-start'>
                        <span className='bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shrink-0'>
                          Location
                        </span>
                        <p className='text-sm text-gray-700'>
                          Filter items by where they were found.
                        </p>
                      </div>
                    </div>
                    <Tip>
                      Click on any item in the list to see its full details,
                      including photos and where it was found.
                    </Tip>
                  </GuideSection>

                  <GuideSection title='Reporting a found item'>
                    <p className='text-sm text-gray-700'>
                      If you found something and want to report it, submit an
                      item report so it can be added to the system.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Go to <strong>Reports → Submit Reports</strong> in the
                        sidebar.
                      </Step>
                      <Step n={2}>Fill in the item name, a description.</Step>
                      <Step n={3}>
                        Optionally add photos and where you found the item.
                      </Step>
                      <Step n={4}>
                        Click <strong>Report</strong>. Your submission will be
                        reviewed by an admin before others can see it.
                      </Step>
                    </div>
                    <Tip>
                      You can check the status of your submissions under{' '}
                      <strong>Reports → Your Reports</strong>. It will show
                      Pending, Approved, or Rejected.
                    </Tip>
                  </GuideSection>

                  <GuideSection title='Claiming an item that belongs to you'>
                    <p className='text-sm text-gray-700'>
                      If you see an item in the system that you think is yours,
                      you can submit a claim.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Find the item in <strong>All Items</strong> and click on
                        it, then press <strong>Claim This Item</strong>.
                      </Step>
                      <Step n={2}>
                        Or go to <strong>Claims → Submit Claims</strong>, search
                        for the item, and fill in your explanation.
                      </Step>
                      <Step n={3}>
                        Write a short explanation of why the item belongs to
                        you; include any identifying details (e.g. &quot;my name
                        is written inside&quot;, &quot;it has a scratch on the
                        corner&quot;).
                      </Step>
                      <Step n={4}>
                        Submit the claim. An admin will review it and get back
                        to you. If approved, the item will be returned to you.
                      </Step>
                    </div>
                    <Tip>
                      Track your claims under{' '}
                      <strong>Claims → Your Claims</strong>. Open means
                      it&apos;s still being reviewed; Closed means it&apos;s
                      been resolved.
                    </Tip>
                  </GuideSection>

                  <GuideSection title='Setting up an Item Lookout'>
                    <p className='text-sm text-gray-700'>
                      An Item Lookout is like a &quot;wanted&quot; alert. You
                      describe what you lost, and the system will automatically
                      check for matches whenever new items are added. If
                      something similar shows up, you&apos;ll be notified
                      through email.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Go to <strong>Item Lookouts</strong> in the sidebar.
                      </Step>
                      <Step n={2}>
                        Click <strong>Create Item Lookout</strong> and describe
                        what you lost in as much detail as possible.
                      </Step>
                      <Step n={3}>
                        Optionally, add a photo of the item or something
                        similar.
                      </Step>
                      <Step n={4}>
                        The system will show you any matching items it finds.
                        You can claim directly from the lookout page.
                      </Step>
                      <Step n={5}>
                        Once you&apos;ve found your item, mark the lookout as{' '}
                        <strong>Closed</strong>.
                      </Step>
                    </div>
                  </GuideSection>

                  <GuideSection title='Chats'>
                    <p className='text-sm text-gray-700'>
                      The <strong>Chats</strong> section lets you message other
                      users directly to ask questions about the item, or to
                      clarify the location where it was found.
                    </p>
                  </GuideSection>
                </div>
              </div>
            </div>
          )}

          {selected === 'Admins' && (
            <div className='w-full min-h-screen border border-gray-300 rounded-lg'>
              <div className='bg-white w-full h-full min-h-screen rounded-lg flex flex-col'>
                <div className='border-b border-gray-300 px-8 py-6'>
                  <p className='text-2xl font-bold text-black'>Admin Guide</p>
                  <p className='text-sm text-gray-500 mt-1'>
                    How to manage the Lost & Found system
                  </p>
                </div>

                <div className='px-8 py-8 flex flex-col space-y-8'>
                  <GuideSection title='Accessing the admin panel'>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Go to <strong>/admin</strong> in your browser.
                      </Step>
                      <Step n={2}>
                        Enter the admin password to unlock the panel.
                      </Step>
                    </div>
                  </GuideSection>

                  <GuideSection title='Reviewing submitted reports'>
                    <p className='text-sm text-gray-700'>
                      When a student or staff member reports a found item, it
                      comes in as a pending submission. You need to review it
                      before it goes live.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Go to <strong>Reports → Pending Reports</strong>.
                      </Step>
                      <Step n={2}>
                        Click on a submission to see its details, description,
                        and any photos.
                      </Step>
                      <Step n={3}>
                        Click <strong>Approve</strong> to publish it as a live
                        item that users can find and claim.
                      </Step>
                      <Step n={4}>
                        Click <strong>Reject</strong> if the submission is
                        invalid, a duplicate, or doesn&apos;t have enough
                        information.
                      </Step>
                    </div>
                    <Tip>
                      You can edit a submission before approving it: use the{' '}
                      <strong>Edit</strong> button to fix the name, description,
                      or remove unwanted photos.
                    </Tip>
                  </GuideSection>

                  <GuideSection title='Managing claims'>
                    <p className='text-sm text-gray-700'>
                      When a user claims an item, you review their explanation
                      and decide whether to approve it.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Go to <strong>Claims → Pending Claims</strong>.
                      </Step>
                      <Step n={2}>
                        Review the claim; you can see who submitted it, which
                        item they&apos;re claiming, and their explanation.
                      </Step>
                      <Step n={3}>
                        Click <strong>Approve Claim</strong> to mark the item as
                        claimed and close the claim.
                      </Step>
                      <Step n={4}>
                        Click <strong>Delete Claim</strong> if the claim is
                        invalid.
                      </Step>
                    </div>
                  </GuideSection>

                  <GuideSection title='Managing items'>
                    <p className='text-sm text-gray-700'>
                      The <strong>All Items</strong> page shows every live item
                      in the system. You can filter by location, edit items, or
                      delete items. You can also run a similarity search by text
                      or image.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Go to <strong>All Items</strong> and click on any item
                        to see its full details.
                      </Step>
                      <Step n={2}>
                        Use <strong>Edit</strong> to update the name,
                        description, or remove photos.
                      </Step>
                      <Step n={3}>
                        Use <strong>Delete</strong> to permanently remove an
                        item from the system.
                      </Step>
                      <Step n={4}>
                        Use the <strong>Filter by Location</strong> button to
                        narrow down items by where they were found.
                      </Step>
                    </div>
                  </GuideSection>

                  <GuideSection title='Managing locations'>
                    <p className='text-sm text-gray-700'>
                      Keeping locations up to date helps users filter and find
                      items more easily.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Go to <strong>Locations → Add Location</strong> to
                        create a new location. Give it a name and a
                        teacher&apos;s name if applicable.
                      </Step>
                      <Step n={2}>
                        Go to <strong>Locations → All Locations</strong> to see
                        existing locations and edit their names.
                      </Step>
                    </div>
                    <Tip>
                      Adding a teacher name to a location makes it much easier
                      for students to find; they can search by teacher name in
                      the location filter.
                    </Tip>
                  </GuideSection>

                  <GuideSection title='Viewing approved & declined reports'>
                    <p className='text-sm text-gray-700'>
                      Use <strong>Reports → Approved Reports</strong> and{' '}
                      <strong>Reports → Declined Reports</strong> to review the
                      history of past decisions. Approved Claims are also
                      available under <strong>Claims → Approved Claims</strong>.
                    </p>
                  </GuideSection>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Version */}
      <div className='lg:hidden bg-white min-h-screen text-black w-full'>
        {/* Mobile Header */}
        <div className='sticky top-0 bg-indigo-600 text-white p-4 shadow-lg z-40'>
          <h1 className='text-lg font-bold'>User Guide</h1>
          <p className='text-xs text-indigo-100 mt-1'>Lost & Found App</p>
        </div>

        {/* Mobile Tab Switcher */}
        <div className='bg-white border-b border-gray-200 p-4'>
          <div className='flex gap-2'>
            {(['Students', 'Admins'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelected(tab)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  selected === tab
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className='w-4 h-4 shrink-0'>
                  {tab === 'Students' ? <BriefcaseIcon /> : <ScaleIcon />}
                </div>
                <span>
                  {tab === 'Students' ? 'Students & Staff' : 'Admins'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Content */}
        <div className='p-4 pb-8'>
          {selected === 'Students' && (
            <div className='space-y-6'>
              <div className='text-center mb-6'>
                <p className='text-xl font-bold text-black'>
                  Welcome to Lost & Found
                </p>
                <p className='text-sm text-gray-500 mt-1'>
                  A guide for students and staff
                </p>
              </div>

              <GuideSection title='Overview'>
                <p className='text-sm text-gray-700'>
                  This app provides a place for students and staff to report
                  lost items, browse found items, and claim them.
                </p>
              </GuideSection>

              <GuideSection title='Getting started'>
                <div className='space-y-3'>
                  <Step n={1}>
                    Go to the sign-up page and create an account with your name,
                    email, and a password.
                  </Step>
                  <Step n={2}>
                    Sign in. You&apos;ll then see the home dashboard where you
                    can see currently available lost & found items.
                  </Step>
                </div>
              </GuideSection>

              <GuideSection title='Browsing & searching for items'>
                <p className='text-sm text-gray-700'>
                  The <strong>All Items</strong> page shows all unclaimed found
                  items. There are three ways to search:
                </p>
                <div className='space-y-2'>
                  <div className='flex gap-3 items-start'>
                    <span className='bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shrink-0'>
                      Text
                    </span>
                    <p className='text-sm text-gray-700'>
                      Type a short description of the item (such as &quot;blue
                      backpack&quot;). The app will find items with similar
                      descriptions even if the wording doesn&apos;t match
                      exactly.
                    </p>
                  </div>
                  <div className='flex gap-3 items-start'>
                    <span className='bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shrink-0'>
                      Image
                    </span>
                    <p className='text-sm text-gray-700'>
                      Upload a photo of the item (or a similar one) and the app
                      will find visually similar items in the system.
                    </p>
                  </div>
                  <div className='flex gap-3 items-start'>
                    <span className='bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shrink-0'>
                      Location
                    </span>
                    <p className='text-sm text-gray-700'>
                      Filter items by where they were found.
                    </p>
                  </div>
                </div>
                <Tip>
                  Click on any item in the list to see its full details,
                  including photos and where it was found.
                </Tip>
              </GuideSection>

              <GuideSection title='Reporting a found item'>
                <p className='text-sm text-gray-700'>
                  If you found something and want to report it, submit an item
                  report so it can be added to the system.
                </p>
                <div className='space-y-3'>
                  <Step n={1}>
                    Go to <strong>Reports → Submit Reports</strong> in the
                    sidebar.
                  </Step>
                  <Step n={2}>
                    Fill out the form with details about the item, including
                    photos, description, and where you found it.
                  </Step>
                  <Step n={3}>
                    Submit the report. It will be reviewed by an admin before
                    being published.
                  </Step>
                </div>
                <Tip>
                  Take clear photos from multiple angles to help others identify
                  the item.
                </Tip>
              </GuideSection>

              <GuideSection title='Claiming an item'>
                <p className='text-sm text-gray-700'>
                  If you see an item that belongs to you, you can claim it.
                </p>
                <div className='space-y-3'>
                  <Step n={1}>
                    Click on the item you want to claim from the All Items list.
                  </Step>
                  <Step n={2}>
                    In the item details, click the <strong>Claim Item</strong>{' '}
                    button.
                  </Step>
                  <Step n={3}>
                    Add a comment explaining why you think it&apos;s yours
                    (optional but helpful).
                  </Step>
                  <Step n={4}>
                    Submit the claim. It will be reviewed by an admin.
                  </Step>
                </div>
                <Tip>
                  Claims are processed quickly, but you may need to provide
                  additional proof if requested by an admin.
                </Tip>
              </GuideSection>

              <GuideSection title='Viewing your reports & claims'>
                <p className='text-sm text-gray-700'>
                  Use <strong>Your Reports</strong> and{' '}
                  <strong>Your Claims</strong> to track the status of items
                  you&apos;ve reported or claimed.
                </p>
              </GuideSection>
            </div>
          )}

          {selected === 'Admins' && (
            <div className='space-y-6'>
              <div className='text-center mb-6'>
                <p className='text-xl font-bold text-black'>Admin Guide</p>
                <p className='text-sm text-gray-500 mt-1'>
                  Managing the Lost & Found system
                </p>
              </div>

              <GuideSection title='Overview'>
                <p className='text-sm text-gray-700'>
                  As an admin, you manage item reports, claims, and system
                  locations. Your main tasks are reviewing submissions and
                  approving/rejecting claims.
                </p>
              </GuideSection>

              <GuideSection title='Reviewing item reports'>
                <p className='text-sm text-gray-700'>
                  New item reports need to be reviewed before they appear in the
                  system.
                </p>
                <div className='space-y-3'>
                  <Step n={1}>
                    Go to <strong>Pending Reports</strong> to see new
                    submissions.
                  </Step>
                  <Step n={2}>
                    Click on any report to view its details, including photos
                    and description.
                  </Step>
                  <Step n={3}>
                    Approve or reject the report. Approved items will appear in
                    the public system.
                  </Step>
                </div>
                <Tip>
                  Check that photos are clear and descriptions are detailed
                  enough for identification.
                </Tip>
              </GuideSection>

              <GuideSection title='Managing claims'>
                <p className='text-sm text-gray-700'>
                  Users can claim items they believe are theirs. You need to
                  verify these claims.
                </p>
                <div className='space-y-3'>
                  <Step n={1}>
                    Go to <strong>Pending Claims</strong> to see new claims.
                  </Step>
                  <Step n={2}>
                    Review the claim details and any comments from the user.
                  </Step>
                  <Step n={3}>
                    Approve or reject the claim. Approved claims will mark the
                    item as claimed.
                  </Step>
                </div>
                <Tip>
                  If you&apos;re unsure about a claim, ask the user for more
                  proof before approving.
                </Tip>
              </GuideSection>

              <GuideSection title='Managing locations'>
                <p className='text-sm text-gray-700'>
                  Locations help users find items by where they were found.
                </p>
                <div className='space-y-3'>
                  <Step n={1}>
                    Go to <strong>Locations → Add Location</strong> to create a
                    new location. Give it a name and a teacher&apos;s name if
                    applicable.
                  </Step>
                  <Step n={2}>
                    Go to <strong>Locations → All Locations</strong> to see
                    existing locations and edit their names.
                  </Step>
                </div>
                <Tip>
                  Adding a teacher name to a location makes it much easier for
                  students to find; they can search by teacher name in the
                  location filter.
                </Tip>
              </GuideSection>

              <GuideSection title='Viewing approved & declined reports'>
                <p className='text-sm text-gray-700'>
                  Use <strong>Reports → Approved Reports</strong> and{' '}
                  <strong>Reports → Declined Reports</strong> to review the
                  history of past decisions. Approved Claims are also available
                  under <strong>Claims → Approved Claims</strong>.
                </p>
              </GuideSection>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
