import React, { useEffect } from 'react';
import mainlogo from '../../assets/applyeuropa-logo.svg';
import img1 from '../../assets/img-1.png';
import img2 from '../../assets/img-2.png';
import img3 from '../../assets/img-3.png';
import germany from '../../assets/Ger.webp';
import quote from '../../assets/quote.svg';

import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  TextInput,
  ThemeConfig,
} from 'flowbite-react';
import { useState } from 'react';
import axios from 'axios';
import { useFrappeCreateDoc, useFrappeGetDocList } from 'frappe-react-sdk';
import { toast } from 'sonner';
import OTPInput from 'react-otp-input';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [open2Modal, setOpen2Modal] = useState(false);
  const [formData, setFormData] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const length = 6;
  const [otp, setOtp] = useState('');

  const { createDoc } = useFrappeCreateDoc();
  const { data } = useFrappeGetDocList('Student', {
    fields: ['email'],
  });

  function onCloseModal() {
    setOpenModal(false);
    setFormData({});
  }

  function onClose2Modal() {
    setOpen2Modal(false);
    setOtp(Array(length).fill(''));
  }

  const getFormData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const requestOTP = async (e) => {
    e.preventDefault();
    const { full_name, email, password, phone_number, location } = formData;
    if (!full_name || !email || !password || !phone_number || !location) {
      toast.error('Please fill all the fields');
    } else if (data.length > 0) {
      let isUser = data.filter((item) => item.email == email);
      if (isUser) toast.warning(`E-mail already registered`);
    } else {
      setOpen2Modal(true);
      try {
        await axios.post(
          `${
            import.meta.env.VITE_FRAPPE_URL
          }/api/method/applyeuropa.applyeuropa.doctype.student.student.send_otp_email`,
          { email }
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    try {
      let entered_otp = '';
      otp.map((num) => {
        entered_otp = entered_otp + num;
      });

      const response = await axios.post(
        `${
          import.meta.env.VITE_FRAPPE_URL
        }/api/method/applyeuropa.applyeuropa.doctype.student.student.verify_otp`,
        {
          email: formData.email,
          entered_otp,
        }
      );

      const { status } = response.data.message;
      if (status == 200) {
        createDoc('Student', formData).then(() => {
          setIsRegistered(true);
          localStorage.setItem('AE', 'true');
          setOpen2Modal(false);
          setOpenModal(false);
        });
      } else if (status == 401) {
        toast.warning('Invalid OTP');
      } else if (status == 404) {
        toast.warning('Expired OTP');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('AE')) {
      setIsRegistered(true);
    }
  }, []);

  const settings = {
    fade: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    pauseOnHover: false,
    arrows: false,
  };

  return (
    <div className="relative overflow-hidden h-dvh">
      <div className="absolute hidden lg:block -bottom-90 -left-70 w-[700px] h-[700px] bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 divBg animation-delay-4000 "></div>
      <div className="navBar w-20 mx-3 mt-5">
        <img src={mainlogo} alt="" />
      </div>
      <div className="heroContainer gap-5 lg:gap-20 flex flex-col-reverse lg:flex-row text-center lg:text-left px-2 lg:px-0">
        <div className="heroContent my-auto w-full lg:w-1/2 lg:ms-40">
          <div className="">
            {isRegistered ? (
              <h1 className=" lg:text-5xl text-2xl  font-semibold text-gray-700">
                <span
                  style={{ fontFamily: 'myFont2' }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-6xl"
                >
                  Congratulations!
                </span>{' '}
                You’ve successfully registered. We’re thrilled to have you
                onboard.
              </h1>
            ) : (
              <>
                <h1 className="lg:text-5xl text-2xl  font-semibold text-gray-700">
                  Study in{' '}
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Europe{' '}
                  </span>
                  with expert guidance and endless opportunities.
                </h1>
                <h1 className="lg:text-5xl text-2xl  font-semibold text-gray-700">
                  Pre-register today!
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
              </>
            )}
          </div>
          <div className="absolute bottom-0 right-0 p-5 text-purple-700">
            <i className="fa-brands fa-instagram "></i>
            <a
              className="ps-2"
              href="https://www.instagram.com/applyeuropa/profilecard/?igsh=MXVwY29uY2JnaTU2Mw=="
            >
              applyeuropa
            </a>
          </div>
        </div>
        <div className="heroCarouselContainer relative h-80 lg:h-135 lg:w-[40%]">
          <div className="absolute bottom-7 left-20 lg:-bottom-7 lg:-left-30 w-30 h-30 lg:w-90  lg:h-90  bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 divBg"></div>
          <div className="absolute top-12 left-25 lg:top-10 lg:left-0 w-40 h-40 lg:w-100  lg:h-100 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 divBg animation-delay-2000"></div>
          <div className="absolute bottom-10 right-25 lg:-bottom-10 lg:left-22 w-30 h-30 lg:w-90  lg:h-90  bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 divBg animation-delay-4000"></div>
          <Slider {...settings}>
            <div className="lg:h-140 h-80">
              <div className="relative h-full">
                <div className="w-40 lg:w-60 bg-purple-400/20 p-3 rounded-xl absolute top-0 right-2 lg:right-20 backdrop-blur-lg z-10">
                  <img src={quote} className="h-3 lg:h-5" alt="quote" />
                  <p className="text-gray-800 text-xs">Hi I am Catherine. I can help you with education</p>
                </div>
                <div className="absolute bottom-0 flex justify-center lg:w-100">
                  <img
                    src={img1}
                    className="w-1/2 lg:w-full [mask-image:_linear-gradient(to_bottom,rgba(0,0,0,1)_90%,rgba(0,0,0,0)_100%)]"
                    alt="Slide 1"
                  />
                </div>
              </div>
            </div>
            <div className="lg:h-140 h-80">
              <div className="relative h-full">
                <div className="w-40 lg:w-60 bg-purple-400/20 p-3 rounded-xl absolute top-0 right-2 lg:right-20 backdrop-blur-lg z-10">
                  <img src={quote} className="h-3 lg:h-5" alt="quote" />
                  <p className="text-gray-800 text-sm">Hi I am Sorav</p>
                </div>
                <div className="absolute bottom-0 flex justify-center lg:w-100">
                  <img
                    src={img2}
                    className="w-1/2 lg:w-full [mask-image:_linear-gradient(to_bottom,rgba(0,0,0,1)_90%,rgba(0,0,0,0)_100%)]"
                    alt="Slide 2"
                  />
                </div>
              </div>
            </div>
            <div className="lg:h-140 h-80">
              <div className="relative h-full">
                <div className="w-40 lg:w-60 bg-purple-400/20 p-3 rounded-xl absolute top-0 right-2 lg:right-20 backdrop-blur-lg z-10">
                  <img src={quote} className="h-3 lg:h-5" alt="quote" />
                  <p className="text-gray-800 text-sm">Hi I am Riyas</p>
                </div>
                <div className="absolute bottom-0 flex justify-center lg:w-100">
                  <img
                    src={img3}
                    className="w-1/2 lg:w-full [mask-image:_linear-gradient(to_bottom,rgba(0,0,0,1)_90%,rgba(0,0,0,0)_100%)]"
                    alt="Slide 3"
                  />
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
      <div className="w-full max-w-2xl mx-auto px-4 md:px-6 mt-4 lg:mt-12">
        <div className="">
          <h2 className="text-center text-xl lg:text-2xl font-bold text-gray-600">
            Explore your education
          </h2>
        </div>
        <div className="mt-5 text-center ">
          <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul
              x-ref="logos"
              className="flex items-center gap-1.7 mx-1.7 justify-center md:justify-start [&_img]:max-w-none marqueeDiv"
            >
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
            </ul>
            <ul
              x-ref="logos"
              className="flex items-center gap-1.7   justify-center md:justify-start [&_img]:max-w-none marqueeDiv"
            >
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
              <li className="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                <img className="w-9 p-1" src={germany} alt="" />
                germany
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* modal */}

      {/* <!-- Main modal --> */}
      <>
        <ThemeConfig dark={false} />
        <Modal show={openModal} size="md" onClose={onCloseModal} popup>
          <ModalHeader />
          <ModalBody>
            <form onSubmit={requestOTP} className="space-y-4">
              <h2 className="text-center font-semibold text-2xl text-purple-700">
                Sign Up for Pre-Registration
              </h2>

              <div>
                <div className="mb-2 block">
                  <Label htmlFor="name" className="font-medium">
                    Name
                  </Label>
                </div>
                <TextInput
                  id="name"
                  name="full_name"
                  type={'text'}
                  placeholder="Enter Full Name"
                  onChange={getFormData}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" className="font-medium">
                    E-Mail
                  </Label>
                </div>
                <TextInput
                  id="email"
                  name="email"
                  type={'email'}
                  pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                  title="Must be a valid email id"
                  placeholder="Enter Your Email"
                  onChange={getFormData}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="number" className="font-medium">
                    Phone
                  </Label>
                </div>
                <TextInput
                  id="number"
                  name="phone_number"
                  pattern="[0-9]+"
                  type={'number'}
                  title="Must be a valid mobile number"
                  placeholder="Enter Your Mobile Number"
                  onChange={getFormData}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="location" className="font-medium">
                    Location
                  </Label>
                </div>
                <TextInput
                  id="location"
                  name="location"
                  type={'text'}
                  placeholder="Enter Your Location"
                  onChange={getFormData}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" className="font-medium">
                    Your password
                  </Label>
                </div>
                <TextInput
                  id="password"
                  type="password"
                  name="password"
                  pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                  title="Must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
                  onChange={getFormData}
                  placeholder="⁕ ⁕ ⁕ ⁕ ⁕ ⁕"
                  required
                />
              </div>

              <div className="w-full pt-2 flex justify-center">
                <Button
                  type={'submit'}
                  className="cursor-pointer text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:outline-none  shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-400/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  Register now
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>

        <Modal
          show={open2Modal}
          size="md"
          onClose={onClose2Modal}
          popup
          position="center"
        >
          <ModalHeader />
          <ModalBody>
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="text-center font-semibold text-2xl text-purple-700">
                  <p>Email Verification</p>
                </div>
                <div className="flex flex-row text-sm font-medium text-gray-400">
                  <p>We have sent a code to {formData.email}</p>
                </div>
              </div>

              <form id="otp-form">
                <OTPInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  containerStyle={'w-full flex justify-evenly'}
                  inputStyle={
                    'w-12 h-12 text-center text-xl font-extrabold text-purple-800 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded  outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
                  }
                  inputType={'number'}
                  shouldAutoFocus
                  renderInput={(props) => <input {...props} />}
                  skipDefaultStyles
                />

                <div className="max-w-[260px] mx-auto mt-4">
                  <Button
                    // type="submit"
                    className="cursor-pointer w-full inline-flex justify-center whitespace-nowrap px-3.5 py-2.5 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:outline-none  shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-400/80 font-medium rounded-lg text-sm hover:bg-indigo-600 transition-colors duration-150"
                    onClick={verifyOTP}
                  >
                    Verify OTP
                  </Button>
                </div>
                <div className="text-center text-sm text-slate-500 mt-4">
                  Didn't receive code?{' '}
                  <button
                    className="font-medium text-indigo-500 hover:text-indigo-600"
                    onClick={requestOTP}
                  >
                    Resend
                  </button>
                </div>
              </form>
            </div>
          </ModalBody>
        </Modal>
      </>
    </div>
  );
}

export default Home;
