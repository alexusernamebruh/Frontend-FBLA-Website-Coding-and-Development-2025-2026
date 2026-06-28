export default function Citations() {
  return (
    <>
      {/* Desktop Version */}
      <div className='hidden lg:flex bg-grid h-screen w-full overflow-hidden bg-white'>
        <div className='w-full h-screen overflow-hidden'>
          <div className='w-full h-full flex flex-col'>
            <div className='flex w-full h-full p-8'>
              <div className='w-full h-full overflow-auto bg-white rounded-lg border border-gray-300 shadow-md p-8'>
                <h1
                  id='citations-title'
                  className='text-2xl font-bold text-black mb-8'
                >
                  Citations
                </h1>
                <div className='space-y-6'>
                  {/* Media Citations */}
                  <div
                    id='citations-media'
                    data-citations-reveal='true'
                    className='bg-gray-50 p-6 rounded-lg border border-gray-200'
                  >
                    <h3 className='font-bold text-lg text-black mb-2'>
                      Compass Video
                    </h3>
                    <p className='text-sm mb-1 text-gray-800'>
                      https://www.pexels.com/download/video/1793508/
                    </p>
                    <p className='text-sm text-gray-800'>
                      By Miguel Á. Padriñán
                    </p>
                  </div>

                  <div
                    data-citations-reveal='true'
                    className='bg-gray-50 p-6 rounded-lg border border-gray-200'
                  >
                    <h3 className='font-bold text-lg text-black mb-2'>
                      Binocular Picture
                    </h3>
                    <p className='text-sm mb-1 text-gray-800'>
                      https://images.pexels.com/photos/63901/pexels-photo-63901.jpeg
                    </p>
                    <p className='text-sm text-gray-800'>By ClickHappy</p>
                  </div>

                  <div
                    data-citations-reveal='true'
                    className='bg-gray-50 p-6 rounded-lg border border-gray-200'
                  >
                    <h3 className='font-bold text-lg text-black mb-2'>
                      Magnifying Glass Picture
                    </h3>
                    <p className='text-sm mb-1 text-gray-800'>
                      https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg
                    </p>
                    <p className='text-sm text-gray-800'>By lil artsy</p>
                  </div>

                  <div
                    data-citations-reveal='true'
                    className='bg-gray-50 p-6 rounded-lg border border-gray-200'
                  >
                    <h3 className='font-bold text-lg text-black mb-2'>
                      Miscellaneous
                    </h3>
                    <p className='text-sm mb-1 text-gray-800'>
                      https://m.media-amazon.com/images/I/81rSqsn357L._AC_UY1000_.jpg
                    </p>
                    <p className='text-sm mb-1 text-gray-800'>
                      https://covenantsecurityequipment.com/cdn/shop/files/CSE-AS-ExtraKeys_700x700.png?v=1713479233
                    </p>
                    <p className='text-sm mb-1 text-gray-800'>
                      https://m.media-amazon.com/images/I/41tp0JPPlmL.jpg
                    </p>
                    <p className='text-sm mb-1 text-gray-800'>
                      https://cdn.arstechnica.net/wp-content/uploads/2019/09/iPhone-11-back-hand-scaled.jpg
                    </p>
                    <p className='text-sm text-gray-800'>
                      https://m.media-amazon.com/images/I/61BygHH-M2L._AC_UY1000_.jpg
                    </p>
                  </div>

                  {/* Presentation Citations */}
                  <div
                    id='citations-presentation'
                    data-citations-reveal='true'
                    className='bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4'
                  >
                    <h3 className='font-bold text-lg text-black mb-2'>
                      Presentation Citations
                    </h3>

                    <div>
                      <p className='text-sm mb-1 text-gray-800'>
                        <span className='font-bold text-black'>
                          Color Theory:
                        </span>{' '}
                        Color contrast reference (WCAG 2.2 minimum contrast) & Cameron Chapman's Color Theory for Designers.
                      </p>
                      <p className='text-sm text-gray-800'>
                        https://octet.design/journal/indigo-color-meaning/
                        <br />
                        https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
                      </p>
                    </div>

                    <div className='border-t border-gray-200 pt-3'>
                      <p className='text-sm mb-1 text-gray-800'>
                        <span className='font-bold text-black'>
                          Machine Learning:
                        </span>{' '}
                        Supervised Similarity Framework and DNN Clustering.
                      </p>
                      <p className='text-sm text-gray-800'>
                        https://developers.google.com/machine-learning/clustering/dnn-clustering/supervised-similarity
                      </p>
                    </div>
                  </div>

                  {/* Library Citations */}
                  <div id='citations-library' className='mt-8'>
                    <h2 className='text-2xl font-bold text-black mb-6'>
                      Library Citations
                    </h2>

                    <div className='space-y-6'>
                      <div data-citations-reveal='true'>
                        <h3 className='text-xl font-bold text-black mb-4'>
                          Backend Dependencies
                        </h3>
                        <div className='space-y-3'>
                          <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <h4 className='font-bold text-black'>
                              Production Dependencies
                            </h4>
                            <div className='mt-2 space-y-2 text-sm text-gray-800'>
                              <p>
                                <span className='font-bold text-black'>
                                  @prisma/adapter-pg
                                </span>{' '}
                                (v7.3.0) - PostgreSQL adapter for Prisma ORM
                                (Apache-2.0)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  @prisma/client
                                </span>{' '}
                                (v7.3.0) - Auto-generated database client for
                                Prisma (Apache-2.0)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  express
                                </span>{' '}
                                (v5.1.0) - Fast web framework for Node.js (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  multer
                                </span>{' '}
                                (v1.4.5-lts.1) - Middleware for handling
                                multipart/form-data (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>pg</span>{' '}
                                (v8.17.2) - PostgreSQL client for Node.js (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  nodemailer
                                </span>{' '}
                                (v8.0.4) - Email sending library for Node.js
                                (MIT)
                              </p>
                            </div>
                          </div>
                          <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <h4 className='font-bold text-black'>
                              Development Dependencies
                            </h4>
                            <div className='mt-2 space-y-2 text-sm text-gray-800'>
                              <p>
                                <span className='font-bold text-black'>
                                  @types/cors
                                </span>{' '}
                                (v2.8.19) - TypeScript definitions for cors
                                (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  @types/express
                                </span>{' '}
                                (v5.0.5) - TypeScript definitions for Express
                                (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  @types/multer
                                </span>{' '}
                                (v1.4.12) - TypeScript definitions for multer
                                (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  @types/node
                                </span>{' '}
                                (v24.10.1) - TypeScript definitions for Node.js
                                (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  @types/pg
                                </span>{' '}
                                (v8.16.0) - TypeScript definitions for pg (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  prisma
                                </span>{' '}
                                (v7.3.0) - Database toolkit and ORM (Apache-2.0)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  ts-node-dev
                                </span>{' '}
                                (v2.0.0) - TypeScript execution with hot reload
                                (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  typescript
                                </span>{' '}
                                (v5.9.3) - TypeScript language and compiler
                                (Apache-2.0)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div data-citations-reveal='true'>
                        <h3 className='text-xl font-bold text-black mb-4'>
                          Python Dependencies
                        </h3>
                        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                          <div className='space-y-2 text-sm text-gray-800'>
                            <p>
                              <span className='font-bold text-black'>
                                torch
                              </span>{' '}
                              (v2.0.0) - Open source machine learning framework
                              (BSD-3-Clause)
                            </p>
                            <p>
                              <span className='font-bold text-black'>
                                torchvision
                              </span>{' '}
                              (v0.15.0) - Computer vision library for PyTorch
                              (BSD-3-Clause)
                            </p>
                            <p>
                              <span className='font-bold text-black'>
                                clip-by-openai
                              </span>{' '}
                              (v0.3.0) - OpenAI CLIP model for image and text
                              embeddings (MIT)
                            </p>
                            <p>
                              <span className='font-bold text-black'>
                                Pillow
                              </span>{' '}
                              (v9.0.0) - Python Imaging Library fork for image
                              processing (HPND)
                            </p>
                            <p>
                              <span className='font-bold text-black'>
                                Flask
                              </span>{' '}
                              (v2.3.0) - Lightweight WSGI web application
                              framework for Python (BSD-3-Clause)
                            </p>
                            <p>
                              <span className='font-bold text-black'>
                                numpy
                              </span>{' '}
                              (v1.24.0) - Fundamental package for scientific
                              computing with Python (BSD-3-Clause)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div data-citations-reveal='true'>
                        <h3 className='text-xl font-bold text-black mb-4'>
                          Frontend Dependencies
                        </h3>
                        <div className='space-y-3'>
                          <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <h4 className='font-bold text-black'>
                              Production Dependencies
                            </h4>
                            <div className='mt-2 space-y-2 text-sm text-gray-800'>
                              <p>
                                <span className='font-bold text-black'>
                                  next
                                </span>{' '}
                                (v16.1.1) - React framework for production (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  react
                                </span>{' '}
                                (v19.2.3) - JavaScript library for building user
                                interfaces (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  react-dom
                                </span>{' '}
                                (v19.2.3) - React package for working with the
                                DOM (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  @headlessui/react
                                </span>{' '}
                                (v2.2.0) - Unstyled, accessible UI components
                                (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  @heroicons/react
                                </span>{' '}
                                (v2.2.0) - Beautiful SVG icons for React (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  axios
                                </span>{' '}
                                (v1.7.9) - Promise-based HTTP client (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  dayjs
                                </span>{' '}
                                (v1.11.13) - Minimalist JavaScript date library
                                (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  gsap
                                </span>{' '}
                                (v3.12.5) - Professional-grade JavaScript
                                animation for the modern web (Standard GreenSock
                                License)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  intro.js
                                </span>{' '}
                                (v7.2.0) - Step-by-step user guide and feature
                                introduction library (MIT / Commercial)
                              </p>
                            </div>
                          </div>
                          <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                            <h4 className='font-bold text-black'>
                              Development Dependencies
                            </h4>
                            <div className='mt-2 space-y-2 text-sm text-gray-800'>
                              <p>
                                <span className='font-bold text-black'>
                                  @tailwindcss/postcss
                                </span>{' '}
                                (v4) - PostCSS plugin for Tailwind CSS (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  @types/node
                                </span>{' '}
                                (v20) - TypeScript definitions for Node.js (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  @types/react
                                </span>{' '}
                                (v19) - TypeScript definitions for React (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  @types/react-dom
                                </span>{' '}
                                (v19) - TypeScript definitions for React DOM
                                (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  eslint
                                </span>{' '}
                                (v9) - JavaScript and TypeScript linter (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  eslint-config-next
                                </span>{' '}
                                (v16.1.1) - ESLint configuration for Next.js
                                (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  tailwindcss
                                </span>{' '}
                                (v4) - Utility-first CSS framework (MIT)
                              </p>
                              <p>
                                <span className='font-bold text-black'>
                                  typescript
                                </span>{' '}
                                (v5) - TypeScript language and compiler
                                (Apache-2.0)
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div data-citations-reveal='true'>
                        <h3 className='text-xl font-bold text-black mb-4'>
                          Runtimes
                        </h3>
                        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                          <div className='space-y-2 text-sm text-gray-800'>
                            <p>
                              <span className='font-bold text-black'>
                                Node.js
                              </span>{' '}
                              - Used to run the backend server. (MIT){' '}
                              <span className='text-gray-600 ml-1'>
                                https://nodejs.org
                              </span>
                            </p>
                            <p>
                              <span className='font-bold text-black'>
                                Python
                              </span>{' '}
                              - Used for the AI embedding service. (PSF License){' '}
                              <span className='text-gray-600 ml-1'>
                                https://www.python.org
                              </span>
                            </p>
                            <p>
                              <span className='font-bold text-black'>
                                React
                              </span>{' '}
                              - Used as the frontend UI runtime. (MIT){' '}
                              <span className='text-gray-600 ml-1'>
                                https://react.dev
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div data-citations-reveal='true'>
                        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
                          <h4 className='font-bold text-black mb-2'>
                            Acknowledgments
                          </h4>
                          <p className='text-sm text-gray-800'>
                            This project was built using open-source libraries
                            and frameworks.
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
      </div>

      {/* Mobile Version */}
      <div className='lg:hidden bg-white min-h-screen pb-4'>
        <div className='bg-indigo-600 text-white p-4 shadow-lg'>
          <h1 id='citations-title' className='text-xl font-bold'>
            Citations
          </h1>
        </div>
        <div className='p-4'>
          <div className='space-y-4'>
            {/* Media Citations */}
            <div
              id='citations-media'
              data-citations-reveal='true'
              className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'
            >
              <h3 className='font-bold text-black mb-2'>Compass Video</h3>
              <p className='text-sm text-gray-800 mb-1'>
                https://www.pexels.com/download/video/1793508/
              </p>
              <p className='text-sm text-gray-600'>By Miguel Á. Padriñán</p>
            </div>

            <div
              className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'
              data-citations-reveal='true'
            >
              <h3 className='font-bold text-black mb-2'>Binocular Picture</h3>
              <p className='text-sm text-gray-800 mb-1'>
                https://images.pexels.com/photos/63901/pexels-photo-63901.jpeg
              </p>
              <p className='text-sm text-gray-600'>By ClickHappy</p>
            </div>

            <div
              className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'
              data-citations-reveal='true'
            >
              <h3 className='font-bold text-black mb-2'>
                Magnifying Glass Picture
              </h3>
              <p className='text-sm text-gray-800 mb-1'>
                https://images.pexels.com/photos/1194775/pexels-photo-1194775.jpeg
              </p>
              <p className='text-sm text-gray-600'>By lil artsy</p>
            </div>

            {/* Presentation Citations (Mobile) */}
            <div 
              id='citations-presentation' 
              data-citations-reveal='true'
              className='bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3'
            >
              <h3 className='font-bold text-black mb-1 text-lg'>
                Presentation Citations
              </h3>
              <div>
                <p id='citations-presentation-link' className='text-sm mb-1 text-black font-semibold'>
                  Color Theory
                </p>
                <p className='text-xs text-gray-800 line-clamp-2 overflow-hidden break-all'>
                  https://octet.design/journal/indigo-color-meaning/
                  <br />
                  https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
                </p>
              </div>
              <div className='border-t border-gray-100 pt-2'>
                <p className='text-sm mb-1 text-black font-semibold'>
                  Machine Learning
                </p>
                <p className='text-xs text-gray-800 break-all'>
                  https://developers.google.com/machine-learning/clustering/dnn-clustering/supervised-similarity
                </p>
              </div>
            </div>

            {/* Library Citations */}
            <div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
              <h2
                className='text-lg font-bold text-black mb-4'
                id='citations-library'
              >
                Library Citations
              </h2>

              <div className='space-y-4'>
                <div>
                  <h3 className='font-bold text-black mb-2'>
                    Backend Dependencies
                  </h3>
                  <div className='text-xs space-y-1 text-gray-800'>
                    <p>
                      <span className='font-bold text-black'>
                        @prisma/adapter-pg
                      </span>{' '}
                      (v7.3.0) - PostgreSQL adapter (Apache-2.0)
                    </p>
                    <p>
                      <span className='font-bold text-black'>
                        @prisma/client
                      </span>{' '}
                      (v7.3.0) - Database client (Apache-2.0)
                    </p>
                    <p>
                      <span className='font-bold text-black'>express</span>{' '}
                      (v5.1.0) - Web framework (MIT)
                    </p>
                    <p>
                      <span className='font-bold text-black'>multer</span>{' '}
                      (v1.4.5-lts.1) - File upload middleware (MIT)
                    </p>
                    <p>
                      <span className='font-bold text-black'>pg</span> (v8.17.2)
                      - PostgreSQL client (MIT)
                    </p>
                    <p>
                      <span className='font-bold text-black'>typescript</span>{' '}
                      (v5.9.3) - TypeScript compiler (Apache-2.0)
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className='font-bold text-black mb-2'>
                    Python / AI Service Dependencies
                  </h3>
                  <div className='text-xs space-y-1 text-gray-800'>
                    <p>
                      <span className='font-bold text-black'>torch</span> (
                      {`>=2.0.0`}) - ML framework (BSD-3-Clause)
                    </p>
                    <p>
                      <span className='font-bold text-black'>torchvision</span>{' '}
                      ({`>=0.15.0`}) - Computer vision for PyTorch
                      (BSD-3-Clause)
                    </p>
                    <p>
                      <span className='font-bold text-black'>
                        clip-by-openai
                      </span>{' '}
                      ({` text-black >= `}0.3.0) - CLIP embeddings (MIT)
                    </p>
                    <p>
                      <span className='font-bold text-black'>Pillow</span> (
                      {`>=9.0.0`}) - Image processing (HPND)
                    </p>
                    <p>
                      <span className='font-bold text-black'>Flask</span> (
                      {`>=2.3.0`}) - Python web framework (BSD-3-Clause)
                    </p>
                    <p>
                      <span className='font-bold text-black'>numpy</span> (
                      {`>=1.24.0`}) - Scientific computing (BSD-3-Clause)
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className='font-bold text-black mb-2'>Runtimes</h3>
                  <div className='text-xs text-gray-800 space-y-1'>
                    <p>
                      <span className='font-bold text-black'>Node.js</span> -
                      JavaScript runtime (MIT)
                    </p>
                    <p>
                      <span className='font-bold text-black'>Python</span> - AI
                      service runtime (PSF License)
                    </p>
                    <p>
                      <span className='font-bold text-black'>React</span> -
                      Frontend UI runtime (MIT)
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className='font-bold text-black mb-2'>
                    Frontend Dependencies
                  </h3>
                  <div className='text-xs text-gray-800 space-y-1'>
                    <p>
                      <span className='font-bold text-black'>next</span>{' '}
                      (v16.1.1) - React framework (MIT)
                    </p>
                    <p>
                      <span className='font-bold text-black'>react</span>{' '}
                      (v19.2.3) - UI library (MIT)
                    </p>
                    <p>
                      <span className='font-bold text-black'>
                        @headlessui/react
                      </span>{' '}
                      (v2.2.0) - UI components (MIT)
                    </p>
                    <p>
                      <span className='font-bold text-black'>
                        @heroicons/react
                      </span>{' '}
                      (v2.2.0) - SVG icons (MIT)
                    </p>
                    <p>
                      <span className='font-bold text-black'>axios</span>{' '}
                      (v1.7.9) - HTTP client (MIT)
                    </p>
                    <p>
                      <span className='font-bold text-black'>dayjs</span>{' '}
                      (v1.11.13) - Date library (MIT)
                    </p>
                    <p>
                      <span className='font-bold text-black'>gsap</span>{' '}
                      (v3.12.5) - Animation framework (Standard GreenSock
                      License)
                    </p>
                    <p>
                      <span className='font-bold text-black'>intro.js</span>{' '}
                      (v7.2.0) - Onboarding tours (MIT)
                    </p>
                    <p>
                      <span className='font-bold text-black'>tailwindcss</span>{' '}
                      (v4) - CSS framework (MIT)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}