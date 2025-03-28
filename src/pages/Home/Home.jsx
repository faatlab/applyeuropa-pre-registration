import React from 'react';
import mainlogo from '../../assets/applyeuropa-logo.svg';

import {
  Button,
  Checkbox,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  ThemeConfig,
} from 'flowbite-react';
import { useState } from 'react';

function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');

  function onCloseModal() {
    setOpenModal(false);
    setEmail('');
  }

  return (
    <div className="relative">
      <div className="h-dvh relative overflow-hidden">
        <div class="absolute -top-50 -right-50 w-[550px] h-[550px] bg-pink-300 rounded-full mix-blend-multiply filter blur-xl divBg opacity-70 "></div>
        <div class="absolute -bottom-100 right-10 w-[550px] h-[550px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 divBg animation-delay-2000 hidden md:block"></div>
        <div class="absolute -bottom-100 -left-50 w-[700px] h-[700px] bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 divBg animation-delay-4000 "></div>
      </div>
      <div className="heroContent absolute top-0">
        <div className="w-20 mx-3 mt-5 absolute top-0 left-0">
          <img src={mainlogo} alt="" />
        </div>
        <div className="flex flex-col items-center justify-center  h-dvh ">
          <h1 className="lg:mx-[25%] mx-6 lg:text-5xl text-4xl text-center text-gray-800">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nesciunt,
            quisquam dignissimos ipsam sunt
          </h1>
          <div className="mt-7">
            <button
              type="button"
              onClick={() => setOpenModal(true)}
              className=" cursor-pointer text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:outline-none  shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-400/80 font-medium rounded-lg  px-10 py-3 text-center me-2 mb-2"
            >
              Register Now
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 p-5 text-purple-700">
          <i className="fa-brands fa-instagram "></i>
          <a className='ps-2' href="https://www.instagram.com/applyeuropa/profilecard/?igsh=MXVwY29uY2JnaTU2Mw==">applyeuropa</a>
        </div>
      </div>

      {/* modal */}

      {/* <!-- Main modal --> */}
      <>
        <ThemeConfig dark={false} />
        <Modal show={openModal} size="md" onClose={onCloseModal} popup>
          <ModalHeader />
          <ModalBody>
            <div className="space-y-4">
              <h2 className=" text-center font-semibold text-3xl text-purple-700">
                sign up
              </h2>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" className='font-medium'>Name</Label>
                </div>
                <TextInput id="name" placeholder="Enter Full Name" required />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" className='font-medium'>Mail</Label>
                </div>
                <TextInput
                  id="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="number" className='font-medium'>Phone</Label>
                </div>
                <TextInput
                  id="number"
                  placeholder="Enter Your Mobile Number"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="location" className='font-medium'>Location</Label>
                </div>
                <TextInput
                  id="location"
                  placeholder="Enter Your Location"
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" className='font-medium'>Your password</Label>
                </div>
                <TextInput
                  id="password"
                  type="password"
                  placeholder="⁕ ⁕ ⁕ ⁕ ⁕ ⁕"
                  required
                />
              </div>

              <div className="w-full pt-2">
                <Button className="cursor-pointer text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:outline-none  shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-400/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                  Register now
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </>
    </div>
  );
}

export default Home;
