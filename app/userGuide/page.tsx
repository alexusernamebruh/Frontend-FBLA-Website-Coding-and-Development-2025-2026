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
                      ? 'text-white underline underline-offset-2'
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
        <div className='w-full flex flex-col p-10 overflow-auto'>
          {selected === 'Students' && (
            <div className='w-full rounded-lg border border-gray-300 min-h-screen'>
              <div className='bg-white rounded-lg w-full h-full min-h-screen flex flex-col'>
                <div className='border-b border-gray-300 px-8 py-6'>
                  <p className='text-2xl font-bold text-black'>
                    Welcome to Lost &amp; Found
                  </p>
                  <p className='text-sm text-gray-500 mt-1'>
                    A guide for students and staff
                  </p>
                </div>

                <div className='px-8 py-8 flex flex-col space-y-8'>
                  <GuideSection title='Overview'>
                    <p className='text-sm text-gray-700'>
                      This application allows students and staff to report found
                      items, browse the inventory of unclaimed items, and submit
                      claims for items that belong to them.
                    </p>
                  </GuideSection>

                  <GuideSection title='Getting Started'>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Navigate to the sign-up page and create an account using
                        your name, email address, and a secure password.
                      </Step>
                      <Step n={2}>
                        Sign in to your account. You will be directed to the
                        home dashboard, where all currently available lost and
                        found items are displayed.
                      </Step>
                    </div>
                  </GuideSection>

                  <GuideSection title='Browsing and Searching for Items'>
                    <p className='text-sm text-gray-700'>
                      The <strong>All Items</strong> page displays all unclaimed
                      items currently in the system. There are three methods
                      available for searching:
                    </p>
                    <div className='space-y-2'>
                      <div className='flex gap-3 items-start'>
                        <span className='bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shrink-0'>
                          Text
                        </span>
                        <p className='text-sm text-gray-700'>
                          Enter a brief description of the item (e.g.,
                          &quot;blue backpack&quot;). The system will return
                          items with similar descriptions, even if the wording
                          does not match exactly.
                        </p>
                      </div>
                      <div className='flex gap-3 items-start'>
                        <span className='bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shrink-0'>
                          Image
                        </span>
                        <p className='text-sm text-gray-700'>
                          Upload a photo of the item or a similar one. The
                          system will identify visually similar items in the
                          database.
                        </p>
                      </div>
                      <div className='flex gap-3 items-start'>
                        <span className='bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shrink-0'>
                          Location
                        </span>
                        <p className='text-sm text-gray-700'>
                          Filter items by the location where they were found.
                        </p>
                      </div>
                    </div>
                    <Tip>
                      Click on any item in the list to view its full details,
                      including photographs and the location where it was found.
                    </Tip>
                  </GuideSection>

                  <GuideSection title='Reporting a Found Item'>
                    <p className='text-sm text-gray-700'>
                      If you have found an item and wish to report it, submit an
                      item report so it can be reviewed and added to the system.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Navigate to <strong>Reports → Submit Reports</strong> in
                        the sidebar.
                      </Step>
                      <Step n={2}>
                        Enter the item name and a detailed description.
                      </Step>
                      <Step n={3}>
                        Optionally, attach photographs and specify the location
                        where the item was found.
                      </Step>
                      <Step n={4}>
                        Click <strong>Report</strong> to submit. Your submission
                        will be reviewed by an administrator before it is made
                        visible to other users.
                      </Step>
                    </div>
                    <Tip>
                      You can monitor the status of your submissions under{' '}
                      <strong>Reports → Your Reports</strong>. Each submission
                      will display a status of Pending, Approved, or Rejected.
                    </Tip>
                  </GuideSection>

                  <GuideSection title='Claiming an Item'>
                    <p className='text-sm text-gray-700'>
                      If you identify an item in the system that belongs to you,
                      you may submit a claim for its return.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Locate the item on the <strong>All Items</strong> page
                        and click on it, then select{' '}
                        <strong>Claim This Item</strong>.
                      </Step>
                      <Step n={2}>
                        Alternatively, navigate to{' '}
                        <strong>Claims → Submit Claims</strong>, search for the
                        item, and complete the claim form.
                      </Step>
                      <Step n={3}>
                        Provide a brief explanation of why the item belongs to
                        you. Include any identifying details, such as &quot;my
                        name is written inside&quot; or &quot;it has a scratch
                        on the bottom-left corner.&quot;
                      </Step>
                      <Step n={4}>
                        Submit the claim. An administrator will review it and
                        follow up with you. If approved, the item will be
                        returned to you.
                      </Step>
                    </div>
                    <Tip>
                      Track your claims under{' '}
                      <strong>Claims → Your Claims</strong>. A status of{' '}
                      <strong>Open</strong> indicates the claim is under review;{' '}
                      <strong>Closed</strong> indicates it has been resolved.
                    </Tip>
                  </GuideSection>

                  <GuideSection title='Setting Up an Item Lookout'>
                    <p className='text-sm text-gray-700'>
                      An Item Lookout functions as a standing alert for a lost
                      item. You describe what you lost, and the system
                      automatically checks for matches whenever new items are
                      added. If a similar item is found, you will be notified
                      via email.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Navigate to <strong>Item Lookouts</strong> in the
                        sidebar.
                      </Step>
                      <Step n={2}>
                        Click <strong>Create Item Lookout</strong> and describe
                        the lost item in as much detail as possible.
                      </Step>
                      <Step n={3}>
                        Optionally, attach a photograph of the item or a similar
                        one.
                      </Step>
                      <Step n={4}>
                        The system will display any matching items it
                        identifies. You may submit a claim directly from the
                        lookout page.
                      </Step>
                      <Step n={5}>
                        Once your item has been found, mark the lookout as{' '}
                        <strong>Closed</strong>.
                      </Step>
                    </div>
                  </GuideSection>

                  <GuideSection title='Chats'>
                    <p className='text-sm text-gray-700'>
                      The <strong>Chats</strong> section allows you to message
                      other users directly to ask questions about a specific
                      item or to clarify the circumstances under which it was
                      found. Click on any item and select <strong>Chat</strong>{' '}
                      to start a conversation with the person who reported it.
                    </p>
                  </GuideSection>

                  <GuideSection title='Understanding Notifications'>
                    <p className='text-sm text-gray-700'>
                      The system sends you notifications for important events
                      related to your reports, claims, and lookouts. You can
                      view all notifications in the Notifications panel.
                    </p>
                    <div className='space-y-3 mt-3'>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Report Approved
                        </p>
                        <p className='text-sm text-gray-700'>
                          Your submitted item report has been reviewed and
                          approved by an administrator. The item is now visible
                          to other users.
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Report Rejected
                        </p>
                        <p className='text-sm text-gray-700'>
                          Your submitted item report did not meet the system
                          requirements and was rejected. Check your report for
                          details and consider resubmitting with more
                          information.
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Claim Approved
                        </p>
                        <p className='text-sm text-gray-700'>
                          Your claim for an item has been approved. The item
                          owner will contact you to arrange pickup or return.
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          New Chat Message
                        </p>
                        <p className='text-sm text-gray-700'>
                          Someone has sent you a message about an item. Visit
                          the Chats section to view and respond to the message.
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Lookout Match Found
                        </p>
                        <p className='text-sm text-gray-700'>
                          An item matching one of your active Item Lookouts has
                          been added to the system. Visit your Item Lookouts to
                          view and claim the item.
                        </p>
                      </div>
                    </div>
                  </GuideSection>

                  <GuideSection title='Tracking Your Activity'>
                    <p className='text-sm text-gray-700'>
                      You can track all your submissions and claims in dedicated
                      sections accessible from the sidebar:
                    </p>
                    <div className='space-y-3 mt-3'>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Your Reports
                        </p>
                        <p className='text-sm text-gray-700'>
                          View all items you have reported. Each report displays
                          its current status: Pending (awaiting review),
                          Approved (visible to users), or Rejected (not
                          accepted).
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Your Claims
                        </p>
                        <p className='text-sm text-gray-700'>
                          View all claims you have submitted. Each claim shows
                          its status: Open (under review) or Closed (resolved).
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Your Item Lookouts
                        </p>
                        <p className='text-sm text-gray-700'>
                          Monitor all your active Item Lookouts. You can view
                          matched items and manage the status of each lookout
                          from this section.
                        </p>
                      </div>
                    </div>
                    <Tip>
                      Check your notifications regularly to stay updated on the
                      status of your reports, claims, and lookouts.
                    </Tip>
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
                    Managing the Lost &amp; Found system
                  </p>
                </div>

                <div className='px-8 py-8 flex flex-col space-y-8'>
                  <GuideSection title='Accessing the Admin Panel'>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Navigate to <strong>/admin</strong> in your browser.
                      </Step>
                      <Step n={2}>
                        Enter the administrator password to access the panel.
                      </Step>
                    </div>
                  </GuideSection>

                  <GuideSection title='Reviewing Submitted Reports'>
                    <p className='text-sm text-gray-700'>
                      When a student or staff member reports a found item, it
                      enters the system as a pending submission. Each submission
                      must be reviewed before it is published.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Navigate to <strong>Reports → Pending Reports</strong>.
                      </Step>
                      <Step n={2}>
                        Select a submission to review its details, description,
                        and any attached photographs.
                      </Step>
                      <Step n={3}>
                        Click <strong>Approve</strong> to publish the item,
                        making it visible and claimable by users.
                      </Step>
                      <Step n={4}>
                        Click <strong>Reject</strong> if the submission is
                        invalid, a duplicate, or lacks sufficient information.
                      </Step>
                    </div>
                    <Tip>
                      You may edit a submission before approving it. Use the{' '}
                      <strong>Edit</strong> button to correct the name or
                      description, or to remove inappropriate photographs.
                    </Tip>
                  </GuideSection>

                  <GuideSection title='Managing Claims'>
                    <p className='text-sm text-gray-700'>
                      When a user submits a claim for an item, you are
                      responsible for reviewing their explanation and
                      determining whether to approve it.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Navigate to <strong>Claims → Pending Claims</strong>.
                      </Step>
                      <Step n={2}>
                        Review the claim details, including the submitting user,
                        the item being claimed, and their written explanation.
                      </Step>
                      <Step n={3}>
                        Click <strong>Approve Claim</strong> to mark the item as
                        claimed and close the claim.
                      </Step>
                      <Step n={4}>
                        Click <strong>Delete Claim</strong> if the claim is
                        determined to be invalid.
                      </Step>
                    </div>
                  </GuideSection>

                  <GuideSection title='Managing Items'>
                    <p className='text-sm text-gray-700'>
                      The <strong>All Items</strong> page displays every active
                      item in the system. You may filter by location, edit item
                      details, or permanently remove items. Similarity searches
                      by text or image are also available.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Navigate to <strong>All Items</strong> and select any
                        item to view its full details.
                      </Step>
                      <Step n={2}>
                        Use <strong>Edit</strong> to update the item name,
                        description, or attached photographs.
                      </Step>
                      <Step n={3}>
                        Use <strong>Delete</strong> to permanently remove an
                        item from the system.
                      </Step>
                      <Step n={4}>
                        Use the search filters to narrow results by text, image
                        similarity, location, or date.
                      </Step>
                    </div>
                  </GuideSection>

                  <GuideSection title='Managing Locations'>
                    <p className='text-sm text-gray-700'>
                      Maintaining an accurate list of locations helps users
                      filter and locate items more efficiently.
                    </p>
                    <div className='space-y-3'>
                      <Step n={1}>
                        Navigate to <strong>Locations → Add Location</strong> to
                        create a new location. Provide a name and, if
                        applicable, the name of the supervising teacher.
                      </Step>
                      <Step n={2}>
                        Navigate to <strong>Locations → All Locations</strong>{' '}
                        to view and edit existing location entries.
                      </Step>
                    </div>
                    <Tip>
                      Associating a teacher&apos;s name with a location
                      significantly improves discoverability, as students can
                      search by teacher name within the location filter.
                    </Tip>
                  </GuideSection>

                  <GuideSection title='Viewing Approved and Declined Reports'>
                    <p className='text-sm text-gray-700'>
                      Use <strong>Reports → Approved Reports</strong> and{' '}
                      <strong>Reports → Declined Reports</strong> to review the
                      history of past decisions. A record of approved claims is
                      also available under{' '}
                      <strong>Claims → Approved Claims</strong>.
                    </p>
                  </GuideSection>

                  <GuideSection title='Analytics Dashboard'>
                    <p className='text-sm text-gray-700'>
                      The <strong>Analytics Dashboard</strong> provides a
                      comprehensive overview of the Lost &amp; Found system.
                      This is your go-to resource for understanding system
                      trends, managing inventory, and monitoring user activity.
                    </p>
                    <div className='space-y-3 mt-3'>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Key Metrics
                        </p>
                        <p className='text-sm text-gray-700'>
                          The dashboard displays critical statistics including
                          total items in the system, items returned vs.
                          unclaimed, total reports, pending submissions, claims
                          status, and item lookout summaries. Use these metrics
                          to monitor the overall health of the system.
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Items by Location
                        </p>
                        <p className='text-sm text-gray-700'>
                          A visual breakdown showing which locations have the
                          most lost and found items. This helps identify problem
                          areas and hotspots where items are frequently lost.
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Most Common Item Types
                        </p>
                        <p className='text-sm text-gray-700'>
                          Displays the most frequently reported item types and
                          categories. This data is derived from item names and
                          descriptions and helps you understand what types of
                          items users commonly lose.
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Submission Trend
                        </p>
                        <p className='text-sm text-gray-700'>
                          A graph showing the number of reports submitted per
                          day over the last 30 days. Use this to identify busy
                          periods and ensure adequate administrative support
                          during peak times.
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Item Lookouts Summary
                        </p>
                        <p className='text-sm text-gray-700'>
                          A summary of all active Item Lookouts in the system,
                          including the total number and how many are currently
                          open vs. closed.
                        </p>
                      </div>
                    </div>
                    <Tip>
                      Review the analytics dashboard regularly to identify
                      trends and areas where system improvements might be
                      needed.
                    </Tip>
                  </GuideSection>

                  <GuideSection title='Searching and Filtering Items'>
                    <p className='text-sm text-gray-700'>
                      In addition to basic item browsing, the admin panel
                      provides advanced search capabilities to help you quickly
                      locate specific items or groups of items.
                    </p>
                    <div className='space-y-3 mt-3'>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Text Search
                        </p>
                        <p className='text-sm text-gray-700'>
                          Search for items by name or description keywords. The
                          system uses semantic matching, so items with similar
                          descriptions will be found even if keywords don&apos;t
                          match exactly.
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Image Search
                        </p>
                        <p className='text-sm text-gray-700'>
                          Upload an image to find visually similar items in the
                          database. This is useful for locating duplicates or
                          finding items with similar characteristics.
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Location Filter
                        </p>
                        <p className='text-sm text-gray-700'>
                          Filter items by the location where they were found.
                          This is particularly useful for managing items by
                          school area.
                        </p>
                      </div>
                      <div>
                        <p className='font-semibold text-sm text-gray-800 mb-1'>
                          Date Filter
                        </p>
                        <p className='text-sm text-gray-700'>
                          Search for items reported within a specific date
                          range. This helps when managing recent submissions or
                          investigating patterns.
                        </p>
                      </div>
                    </div>
                  </GuideSection>

                  <GuideSection title='Managing Item Lookouts'>
                    <p className='text-sm text-gray-700'>
                      Item Lookouts are a system feature that allows users to
                      create standing alerts for lost items. You can monitor and
                      manage these from the analytics dashboard.
                    </p>
                    <div className='space-y-3 mt-3'>
                      <Step n={1}>
                        Use the <strong>Item Lookouts</strong> section in the
                        analytics dashboard to view all active lookouts.
                      </Step>
                      <Step n={2}>
                        Monitor the number of open vs. closed lookouts to
                        understand user engagement with this feature.
                      </Step>
                      <Step n={3}>
                        When items match a lookout, users receive automatic
                        notifications to encourage claims and item returns.
                      </Step>
                    </div>
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
          <p className='text-xs text-indigo-100 mt-1'>Lost &amp; Found</p>
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
                  Welcome to Lost &amp; Found
                </p>
                <p className='text-sm text-gray-500 mt-1'>
                  A guide for students and staff
                </p>
              </div>

              <GuideSection title='Overview'>
                <p className='text-sm text-gray-700'>
                  This application allows students and staff to report found
                  items, browse the inventory of unclaimed items, and submit
                  claims for items that belong to them.
                </p>
              </GuideSection>

              <GuideSection title='Getting Started'>
                <div className='space-y-3'>
                  <Step n={1}>
                    Navigate to the sign-up page and create an account using
                    your name, email address, and a secure password.
                  </Step>
                  <Step n={2}>
                    Sign in to your account. You will be directed to the home
                    dashboard, where all currently available lost and found
                    items are displayed.
                  </Step>
                </div>
              </GuideSection>

              <GuideSection title='Browsing and Searching for Items'>
                <p className='text-sm text-gray-700'>
                  The <strong>All Items</strong> page displays all unclaimed
                  items currently in the system. Three search methods are
                  available:
                </p>
                <div className='space-y-2'>
                  <div className='flex gap-3 items-start'>
                    <span className='bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shrink-0'>
                      Text
                    </span>
                    <p className='text-sm text-gray-700'>
                      Enter a brief description of the item (e.g., &quot;blue
                      backpack&quot;). The system will return items with similar
                      descriptions, even if the wording does not match exactly.
                    </p>
                  </div>
                  <div className='flex gap-3 items-start'>
                    <span className='bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shrink-0'>
                      Image
                    </span>
                    <p className='text-sm text-gray-700'>
                      Upload a photograph of the item or a similar one. The
                      system will identify visually similar items in the
                      database.
                    </p>
                  </div>
                  <div className='flex gap-3 items-start'>
                    <span className='bg-gray-100 text-gray-700 text-xs font-bold px-2 py-1 rounded shrink-0'>
                      Location
                    </span>
                    <p className='text-sm text-gray-700'>
                      Filter items by the location where they were found.
                    </p>
                  </div>
                </div>
                <Tip>
                  Tap any item in the list to view its full details, including
                  photographs and the location where it was found.
                </Tip>
              </GuideSection>

              <GuideSection title='Reporting a Found Item'>
                <p className='text-sm text-gray-700'>
                  If you have found an item, submit an item report so it can be
                  reviewed and added to the system.
                </p>
                <div className='space-y-3'>
                  <Step n={1}>
                    Navigate to <strong>Reports → Submit Reports</strong>.
                  </Step>
                  <Step n={2}>
                    Enter the item name, a detailed description, and the
                    location where it was found.
                  </Step>
                  <Step n={3}>
                    Optionally, attach clear photographs of the item.
                  </Step>
                  <Step n={4}>
                    Submit the report. It will be reviewed by an administrator
                    before being published.
                  </Step>
                </div>
                <Tip>
                  Photographs taken from multiple angles help others identify
                  the item more easily.
                </Tip>
              </GuideSection>

              <GuideSection title='Claiming an Item'>
                <p className='text-sm text-gray-700'>
                  If you identify an item in the system that belongs to you, you
                  may submit a claim for its return.
                </p>
                <div className='space-y-3'>
                  <Step n={1}>
                    Tap the item you wish to claim from the All Items list.
                  </Step>
                  <Step n={2}>
                    In the item details, tap the <strong>Claim Item</strong>{' '}
                    button.
                  </Step>
                  <Step n={3}>
                    Provide an explanation of why the item belongs to you,
                    including any identifying details.
                  </Step>
                  <Step n={4}>
                    Submit the claim. An administrator will review it and follow
                    up with you.
                  </Step>
                </div>
                <Tip>
                  Be as specific as possible in your explanation. The more
                  detail you provide, the faster your claim can be processed.
                </Tip>
              </GuideSection>

              <GuideSection title='Viewing Your Reports and Claims'>
                <p className='text-sm text-gray-700'>
                  Use <strong>Your Reports</strong> and{' '}
                  <strong>Your Claims</strong> to monitor the status of items
                  you have reported or claimed.
                </p>
              </GuideSection>
            </div>
          )}

          {selected === 'Admins' && (
            <div className='space-y-6'>
              <div className='text-center mb-6'>
                <p className='text-xl font-bold text-black'>Admin Guide</p>
                <p className='text-sm text-gray-500 mt-1'>
                  Managing the Lost &amp; Found system
                </p>
              </div>

              <GuideSection title='Overview'>
                <p className='text-sm text-gray-700'>
                  As an administrator, you are responsible for managing item
                  reports, user claims, and system locations. Your primary tasks
                  are reviewing submissions and approving or rejecting claims.
                </p>
              </GuideSection>

              <GuideSection title='Reviewing Item Reports'>
                <p className='text-sm text-gray-700'>
                  All new item reports must be reviewed before they appear in
                  the public system.
                </p>
                <div className='space-y-3'>
                  <Step n={1}>
                    Navigate to <strong>Pending Reports</strong> to view new
                    submissions.
                  </Step>
                  <Step n={2}>
                    Tap any report to view its details, including photographs
                    and description.
                  </Step>
                  <Step n={3}>
                    Approve or reject the report. Approved items will be
                    published to the public inventory.
                  </Step>
                </div>
                <Tip>
                  Verify that photographs are clear and that descriptions are
                  sufficiently detailed for identification purposes.
                </Tip>
              </GuideSection>

              <GuideSection title='Managing Claims'>
                <p className='text-sm text-gray-700'>
                  When a user submits a claim for an item, you must verify their
                  explanation before taking action.
                </p>
                <div className='space-y-3'>
                  <Step n={1}>
                    Navigate to <strong>Pending Claims</strong> to view new
                    claims.
                  </Step>
                  <Step n={2}>
                    Review the claim details and any comments provided by the
                    user.
                  </Step>
                  <Step n={3}>
                    Approve or reject the claim. Approving a claim will mark the
                    item as claimed and close it.
                  </Step>
                </div>
                <Tip>
                  If there is insufficient evidence to support a claim, request
                  additional information from the user before approving.
                </Tip>
              </GuideSection>

              <GuideSection title='Managing Locations'>
                <p className='text-sm text-gray-700'>
                  Keeping the location list accurate helps users filter and
                  locate items more efficiently.
                </p>
                <div className='space-y-3'>
                  <Step n={1}>
                    Navigate to <strong>Locations → Add Location</strong> to
                    create a new location. Provide a name and, if applicable,
                    the supervising teacher&apos;s name.
                  </Step>
                  <Step n={2}>
                    Navigate to <strong>Locations → All Locations</strong> to
                    view and edit existing entries.
                  </Step>
                </div>
                <Tip>
                  Associating a teacher&apos;s name with a location
                  significantly improves discoverability, as students can search
                  by teacher name within the location filter.
                </Tip>
              </GuideSection>

              <GuideSection title='Viewing Approved and Declined Reports'>
                <p className='text-sm text-gray-700'>
                  Use <strong>Reports → Approved Reports</strong> and{' '}
                  <strong>Reports → Declined Reports</strong> to review the
                  history of past decisions. A record of approved claims is also
                  available under <strong>Claims → Approved Claims</strong>.
                </p>
              </GuideSection>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
