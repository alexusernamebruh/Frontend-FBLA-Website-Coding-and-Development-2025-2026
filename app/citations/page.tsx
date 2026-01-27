export default function Citations() {
  return (
    <>
      {/* Desktop Version */}
      <div className='hidden lg:flex bg-grid h-screen w-full overflow-hidden bg-white'>
        <div className='w-full h-screen overflow-hidden'>
          <div className='w-full h-full flex flex-col'>
            <div className='flex w-full h-full p-8'>
              <div className='w-full h-full overflow-auto bg-white rounded-lg border border-gray-300 shadow-md p-8'>
                <h1 className='text-2xl font-bold text-black mb-8'>
                  Citations
                </h1>
                <div className='space-y-6'>
                  {/* Media Citations */}
                  <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                    <h3 className='font-bold text-lg text-black mb-2'>
                      Compass Video
                    </h3>
                    <p className='text-sm text-gray-600 mb-1'>
                      https://www.pexels.com/download/video/1793508/
                    </p>
                    <p className='text-sm text-gray-500'>
                      By Miguel Á. Padriñán
                    </p>
                  </div>
                  <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                    <h3 className='font-bold text-lg text-black mb-2'>
                      Binocular Picture
                    </h3>
                    <p className='text-sm text-gray-600 mb-1'>
                      https://images.pexels.com/photos/63901/pexels-photo-63901.jpeg
                    </p>
                    <p className='text-sm text-gray-500'>By ClickHappy</p>
                  </div>
                  <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                    <h3 className='font-bold text-lg text-black mb-2'>
                      Magnifying Glass Picture
                    </h3>
                    <p className='text-sm text-gray-600 mb-1'>
                      https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg
                    </p>
                    <p className='text-sm text-gray-500'>By lil artsy</p>
                  </div>
                  <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                    <h3 className='font-bold text-lg text-black mb-2'>
                      Miscellaneous
                    </h3>
                    <p className='text-sm text-gray-600 mb-1'>
                      https://m.media-amazon.com/images/I/81rSqsn357L._AC_UY1000_.jpg
                    </p>
                    <p className='text-sm text-gray-500 mb-1'>
                      https://covenantsecurityequipment.com/cdn/shop/files/CSE-AS-ExtraKeys_700x700.png?v=1713479233
                    </p>
                    <p className='text-sm text-gray-500 mb-1'>
                      https://m.media-amazon.com/images/I/41tp0JPPlmL.jpg
                    </p>
                    <p className='text-sm text-gray-500 mb-1'>
                      https://cdn.arstechnica.net/wp-content/uploads/2019/09/iPhone-11-back-hand-scaled.jpg
                    </p>
                    <p className='text-sm text-gray-500'>
                      https://m.media-amazon.com/images/I/61BygHH-M2L._AC_UY1000_.jpg
                    </p>
                  </div>
                  <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
                    <h3 className='font-bold text-lg text-black mb-2'>
                      Presentation Citations
                    </h3>
                    <p className='text-sm text-gray-600 mb-1'>Color Theory</p>
                    <p className='text-sm text-gray-500'>
                      https://octet.design/journal/indigo-color-meaning/
                    </p>
                  </div>
                  {/* Library Citations */}
                  <div className='mt-8'>
                    <h2 className='text-2xl font-bold text-black mb-6'>
                      Library Citations
                    </h2>

                    <div className='space-y-6'>
                      <div>
                        <h3 className='text-xl font-bold text-black mb-4'>
                          Backend Dependencies
                        </h3>
                        <div className='space-y-3'>
                          <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <h4 className='font-bold text-black'>
                              Production Dependencies
                            </h4>
                            <div className='mt-2 space-y-2 text-sm'>
                              <p>
                                <strong>@prisma/adapter-pg</strong> (v7.3.0) -
                                PostgreSQL adapter for Prisma ORM (Apache-2.0)
                              </p>
                              <p>
                                <strong>@prisma/client</strong> (v7.3.0) -
                                Auto-generated database client for Prisma
                                (Apache-2.0)
                              </p>
                              <p>
                                <strong>express</strong> (v5.1.0) - Fast web
                                framework for Node.js (MIT)
                              </p>
                              <p>
                                <strong>multer</strong> (v1.4.5-lts.1) -
                                Middleware for handling multipart/form-data
                                (MIT)
                              </p>
                              <p>
                                <strong>pg</strong> (v8.17.2) - PostgreSQL
                                client for Node.js (MIT)
                              </p>
                            </div>
                          </div>
                          <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <h4 className='font-bold text-black'>
                              Development Dependencies
                            </h4>
                            <div className='mt-2 space-y-2 text-sm'>
                              <p>
                                <strong>@types/cors</strong> (v2.8.19) -
                                TypeScript definitions for cors (MIT)
                              </p>
                              <p>
                                <strong>@types/express</strong> (v5.0.5) -
                                TypeScript definitions for Express (MIT)
                              </p>
                              <p>
                                <strong>@types/multer</strong> (v1.4.12) -
                                TypeScript definitions for multer (MIT)
                              </p>
                              <p>
                                <strong>@types/node</strong> (v24.10.1) -
                                TypeScript definitions for Node.js (MIT)
                              </p>
                              <p>
                                <strong>@types/pg</strong> (v8.16.0) -
                                TypeScript definitions for pg (MIT)
                              </p>
                              <p>
                                <strong>prisma</strong> (v7.3.0) - Database
                                toolkit and ORM (Apache-2.0)
                              </p>
                              <p>
                                <strong>ts-node-dev</strong> (v2.0.0) -
                                TypeScript execution with hot reload (MIT)
                              </p>
                              <p>
                                <strong>typescript</strong> (v5.9.3) -
                                TypeScript language and compiler (Apache-2.0)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className='text-xl font-bold text-black mb-4'>
                          Frontend Dependencies
                        </h3>
                        <div className='space-y-3'>
                          <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <h4 className='font-bold text-black'>
                              Production Dependencies
                            </h4>
                            <div className='mt-2 space-y-2 text-sm'>
                              <p>
                                <strong>next</strong> (v16.1.1) - React
                                framework for production (MIT)
                              </p>
                              <p>
                                <strong>react</strong> (v19.2.3) - JavaScript
                                library for building user interfaces (MIT)
                              </p>
                              <p>
                                <strong>react-dom</strong> (v19.2.3) - React
                                package for working with the DOM (MIT)
                              </p>
                              <p>
                                <strong>@headlessui/react</strong> (v2.2.0) -
                                Unstyled, accessible UI components (MIT)
                              </p>
                              <p>
                                <strong>@heroicons/react</strong> (v2.2.0) -
                                Beautiful SVG icons for React (MIT)
                              </p>
                              <p>
                                <strong>axios</strong> (v1.7.9) - Promise-based
                                HTTP client (MIT)
                              </p>
                              <p>
                                <strong>dayjs</strong> (v1.11.13) - Minimalist
                                JavaScript date library (MIT)
                              </p>
                            </div>
                          </div>
                          <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <h4 className='font-bold text-black'>
                              Development Dependencies
                            </h4>
                            <div className='mt-2 space-y-2 text-sm'>
                              <p>
                                <strong>@tailwindcss/postcss</strong> (v4) -
                                PostCSS plugin for Tailwind CSS (MIT)
                              </p>
                              <p>
                                <strong>@types/node</strong> (v20) - TypeScript
                                definitions for Node.js (MIT)
                              </p>
                              <p>
                                <strong>@types/react</strong> (v19) - TypeScript
                                definitions for React (MIT)
                              </p>
                              <p>
                                <strong>@types/react-dom</strong> (v19) -
                                TypeScript definitions for React DOM (MIT)
                              </p>
                              <p>
                                <strong>eslint</strong> (v9) - JavaScript and
                                TypeScript linter (MIT)
                              </p>
                              <p>
                                <strong>eslint-config-next</strong> (v16.1.1) -
                                ESLint configuration for Next.js (MIT)
                              </p>
                              <p>
                                <strong>tailwindcss</strong> (v4) -
                                Utility-first CSS framework (MIT)
                              </p>
                              <p>
                                <strong>typescript</strong> (v5) - TypeScript
                                language and compiler (Apache-2.0)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                        <h4 className='font-bold text-black mb-2'>
                          Acknowledgments
                        </h4>
                        <p className='text-sm text-gray-700'>
                          This project was built using open-source libraries and
                          frameworks.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className='lg:hidden bg-white min-h-screen pb-4'>
        <div className='bg-indigo-600 text-white p-4 shadow-lg'>
          <h1 className='text-xl font-bold'>Citations</h1>
        </div>
        <div className='p-4'>
          <div className='space-y-4'>
            {/* Media Citations */}
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
              <h3 className='font-bold text-black mb-2'>Compass Video</h3>
              <p className='text-sm text-gray-600 mb-1'>
                https://www.pexels.com/download/video/1793508/
              </p>
              <p className='text-sm text-gray-500'>By Miguel Á. Padriñán</p>
            </div>
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
              <h3 className='font-bold text-black mb-2'>Binocular Picture</h3>
              <p className='text-sm text-gray-600 mb-1'>
                https://images.pexels.com/photos/63901/pexels-photo-63901.jpeg
              </p>
              <p className='text-sm text-gray-500'>By ClickHappy</p>
            </div>
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
              <h3 className='font-bold text-black mb-2'>
                Magnifying Glass Picture
              </h3>
              <p className='text-sm text-gray-600 mb-1'>
                https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg
              </p>
              <p className='text-sm text-gray-500'>By lil artsy</p>
            </div>

            {/* Library Citations */}
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
              <h2 className='text-lg font-bold text-black mb-4'>
                Library Citations
              </h2>

              <div className='space-y-4'>
                <div>
                  <h3 className='font-bold text-black mb-2'>
                    Backend Dependencies
                  </h3>
                  <div className='text-xs space-y-1'>
                    <p>
                      <strong>@prisma/adapter-pg</strong> (v7.3.0) - PostgreSQL
                      adapter (Apache-2.0)
                    </p>
                    <p>
                      <strong>@prisma/client</strong> (v7.3.0) - Database client
                      (Apache-2.0)
                    </p>
                    <p>
                      <strong>express</strong> (v5.1.0) - Web framework (MIT)
                    </p>
                    <p>
                      <strong>multer</strong> (v1.4.5-lts.1) - File upload
                      middleware (MIT)
                    </p>
                    <p>
                      <strong>pg</strong> (v8.17.2) - PostgreSQL client (MIT)
                    </p>
                    <p>
                      <strong>typescript</strong> (v5.9.3) - TypeScript compiler
                      (Apache-2.0)
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className='font-bold text-black mb-2'>
                    Frontend Dependencies
                  </h3>
                  <div className='text-xs space-y-1'>
                    <p>
                      <strong>next</strong> (v16.1.1) - React framework (MIT)
                    </p>
                    <p>
                      <strong>react</strong> (v19.2.3) - UI library (MIT)
                    </p>
                    <p>
                      <strong>@headlessui/react</strong> (v2.2.0) - UI
                      components (MIT)
                    </p>
                    <p>
                      <strong>@heroicons/react</strong> (v2.2.0) - SVG icons
                      (MIT)
                    </p>
                    <p>
                      <strong>axios</strong> (v1.7.9) - HTTP client (MIT)
                    </p>
                    <p>
                      <strong>dayjs</strong> (v1.11.13) - Date library (MIT)
                    </p>
                    <p>
                      <strong>tailwindcss</strong> (v4) - CSS framework (MIT)
                    </p>
                  </div>
                </div>

                <div className='bg-gray-50 p-3 rounded border border-gray-200'>
                  <p className='text-xs text-gray-700'>
                    This project uses open-source libraries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
