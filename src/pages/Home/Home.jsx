import React, { useEffect } from "react";
import mainlogo from "../../assets/applyeuropa-logo.svg";
import germany from "../../assets/Germany.svg";
import italy from "../../assets/Italy.svg";
import france from "../../assets/France.svg";
import latvia from "../../assets/Latvia.svg";
import lithuania from "../../assets/Lithuania.svg";
import hungary from "../../assets/Hungary.svg";
import austria from "../../assets/Austria.svg";
import uk from "../../assets/uk.svg";

import {
   Button,
   HelperText,
   Label,
   Modal,
   ModalBody,
   ModalHeader,
   TextInput,
   ThemeConfig,
} from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import { useFrappeCreateDoc, useFrappeGetDocList } from "frappe-react-sdk";
import { toast } from "sonner";
import OTPInput from "react-otp-input";

function Home() {
   const [openModal, setOpenModal] = useState(false);
   const [open2Modal, setOpen2Modal] = useState(false);
   const [formData, setFormData] = useState({
      full_name: "",
      email: "",
      phone_number: "",
      location: "",
      password: "",
   });
   const [validity, setValidity] = useState({
      email: null,
      phone: null,
      password: null,
   });
   const [isRegistered, setIsRegistered] = useState(false);
   const [otp, setOtp] = useState("");
   const [counter, setCounter] = useState(300); // Delay in seconds
   const [isResend, setIsResend] = useState(false);

   const { createDoc } = useFrappeCreateDoc();
   const { data } = useFrappeGetDocList("Student", {
      fields: ["email"],
   });

   function onCloseModal() {
      setOpenModal(false);
      setFormData({});
   }

   function onClose2Modal() {
      setOpen2Modal(false);
      setOtp(Array(length).fill(""));
   }

   const getFormData = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      switch (name) {
         case "email":
            setValidity((prev) => ({
               ...prev,
               email:
                  value === ""
                     ? null
                     : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            }));
            break;
         case "phone_number":
            setValidity((prev) => ({
               ...prev,
               phone: value === "" ? null : /^[0-9]{10}$/.test(value),
            }));
            break;
         case "password":
            setValidity((prev) => ({
               ...prev,
               password:
                  value === ""
                     ? null
                     : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value),
            }));
            break;
         default:
            break;
      }
   };

   const requestOTP = async (e) => {
      e.preventDefault();
      setIsResend(false);
      setCounter(30);
      const { full_name, email, password, phone_number, location } = formData;
      const isUser = data.filter((item) => item.email == email);
      if (!full_name || !email || !password || !phone_number || !location) {
         toast.error("Please fill all the fields");
      } else if (isUser.length > 0) {
         toast.warning(`E-mail already registered`);
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
         const response = await axios.post(
            `${
               import.meta.env.VITE_FRAPPE_URL
            }/api/method/applyeuropa.applyeuropa.doctype.student.student.verify_otp`,
            {
               email: formData.email,
               entered_otp: otp,
            }
         );

         const { status } = response.data.message;
         if (status == 200) {
            createDoc("Student", formData).then(() => {
               setIsRegistered(true);
               localStorage.setItem("AE", "true");
               setOpen2Modal(false);
               setOpenModal(false);
            });
         } else if (status == 401) {
            toast.warning("Invalid OTP");
         } else if (status == 404) {
            toast.warning("Expired OTP");
         }
      } catch (err) {
         console.error(err);
      }
   };

   useEffect(() => {
      if (localStorage.getItem("AE")) {
         setIsRegistered(true);
      }
   }, []);

   useEffect(() => {
      if (counter > 0) {
         const timer = setTimeout(() => {
            setCounter(counter - 1);
         }, 1000);
         console.log(counter);
         return () => clearTimeout(timer);
      } else {
         setIsResend(true);
      }
   }, [counter]);

   return (
      <div className="relative overflow-hidden lg:h-dvh">
         <div className="absolute hidden lg:block -bottom-110 -left-70 w-[700px] h-[700px] bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 divBg animation-delay-4000 "></div>
         <div className="navBar w-27 mx-3 mt-5">
            <img src={mainlogo} alt="" />
         </div>
         <div className="heroContainer mt-6 gap-5 lg:gap-20 flex flex-col lg:flex-row lg:mx-20 justify-center text-center lg:text-left px-2 lg:px-0">
            <div className="heroContent flex items-center w-full lg:ps-10">
               <div className="">
                  {isRegistered ? (
                     <h1 className=" text-2xl md:text-4xl lg:text-5xl/16 font-semibold text-gray-700 mt-4 lg:mt-0 px-6  ">
                        <span
                           style={{ fontFamily: "myFont2" }}
                           className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-5xl/20 lg:text-6xl"
                        >
                           Congratulations! <br className=" lg:hidden" />
                        </span>{" "}
                        You're all set with <br /> pre-registration! We're
                        thrilled to have you onboard.
                     </h1>
                  ) : (
                     <>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl/15 font-semibold text-gray-700 mt-5 lg:mt-0 px-6 lg:px-0 ">
                           Why settle for a mediocre agent{" "}
                           <br className="hidden lg:block" /> if you can
                           directly connect with{" "}
                           <br className="hidden lg:block" /> experts
                           <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                              {" "}
                              Worldwide
                           </span>
                        </h1>
                        <h1 className="animated-bg curve  p-1 selection:bg-purple-300  text-2xl md:text-4xl lg:text-[40px] font-semibold   text-gray-700 mt-5 ">
                           Pre-register today!
                        </h1>
                        <div className="mt-7">
                           <button
                              type="button"
                              onClick={() => setOpenModal(true)}
                              className="cursor-pointer text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:outline-none  shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-400/80 font-medium rounded-lg  px-10 py-3 text-center me-2 mb-2"
                           >
                              Register Now
                           </button>
                        </div>
                     </>
                  )}
               </div>
            </div>
            <div className="heroCarouselContainer relative flex justify-center w-full lg:w-1/2">
               <div className="absolute -z-10 bottom-7 left-20 lg:-bottom-7 lg:left-0 w-30 h-30 lg:w-90  lg:h-90  bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 divBg"></div>
               <div className="absolute -z-10 top-12 left-25 lg:-top-10 lg:left-5 w-40 h-40 lg:w-100  lg:h-100 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 divBg animation-delay-2000"></div>
               <div className="absolute -z-10 bottom-10 right-25 lg:hidden w-30 h-30 lg:w-90  lg:h-90  bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 divBg animation-delay-4000"></div>

               <div className="flex justify-end">
                  <iframe
                     width="250"
                     height="444"
                     src="https://www.youtube.com/embed/bF2xL8Xsj-E?controls=1"
                     title="Meet Our Mentors | ApplyEuropa"
                     frameborder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                     referrerpolicy="strict-origin-when-cross-origin"
                     allowfullscreen
                     className="rounded-xl shadow-xl shadow-pink-300/70 my-6"
                  ></iframe>
               </div>
            </div>
         </div>

         <div className="w-full max-w-2xl mx-auto px-4 md:px-6">
            <div className="">
               <h2 className="text-center text-[18px]  md:text-2xl  font-bold text-gray-600">
                  Explore our locations
               </h2>
            </div>
            <div className="mt-5 text-center ">
               <div className="w-full inline-flex  flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                  <ul
                     x-ref="logos"
                     className="flex items-center justify-center md:justify-start [&_img]:max-w-none marqueeDiv"
                  >
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={germany} alt="" />
                        Germany
                     </li>
                     <li className="h-10 text-gray-900  bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={italy} alt="" />
                        Italy
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={france} alt="" />
                        France
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={latvia} alt="" />
                        Latvia
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={lithuania} alt="" />
                        Lithuania
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={hungary} alt="" />
                        Hungary
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={austria} alt="" />
                        Austria
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={uk} alt="" />
                        UK
                     </li>
                  </ul>
                  <ul
                     x-ref="logos"
                     className="flex items-center justify-center md:justify-start [&_img]:max-w-none marqueeDiv"
                  >
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={germany} alt="" />
                        Germany
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={italy} alt="" />
                        Italy
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={france} alt="" />
                        France
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={latvia} alt="" />
                        Latvia
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={lithuania} alt="" />
                        Lithuania
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={hungary} alt="" />
                        Hungary
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={austria} alt="" />
                        Austria
                     </li>
                     <li className="h-10 text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm p-2 text-center inline-flex items-center dark:focus:ring-gray-500 me-2 mb-2">
                        <img className="h-full p-1" src={uk} alt="" />
                        UK
                     </li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="text-sm lg:text-base flex justify-end items-center p-2 lg:p-5 text-purple-700">
            <i className="fa-brands fa-instagram "></i>
            <a
               className="ps-2"
               href="https://www.instagram.com/applyeuropa/profilecard/?igsh=MXVwY29uY2JnaTU2Mw=="
            >
               applyeuropa
            </a>
         </div>

         {/* modal */}

         {/* <!-- Main modal --> */}
         <>
            <ThemeConfig dark={false} />
            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
               <ModalHeader />
               <ModalBody>
                  <form onSubmit={requestOTP} className="">
                     <h2 className="text-center font-semibold text-2xl text-purple-700">
                        Sign Up for Pre-Registration
                     </h2>

                     <div className="mb-1">
                        <div className="mb-1 block">
                           <Label htmlFor="name" className="font-medium">
                              Name
                           </Label>
                        </div>
                        <TextInput
                           id="name"
                           name="full_name"
                           type={"text"}
                           placeholder="Enter Full Name"
                           onChange={getFormData}
                        />
                     </div>
                     <div className="mb-1">
                        <div className="mb-1 block">
                           <Label htmlFor="email" className="font-medium">
                              E-Mail
                           </Label>
                        </div>
                        <TextInput
                           id="email"
                           name="email"
                           type={"email"}
                           pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                           title="Must be a valid email id"
                           placeholder="Enter Your Email"
                           onChange={getFormData}
                           color={
                              validity.email === null
                                 ? undefined
                                 : validity.email
                                 ? undefined
                                 : "failure"
                           }
                        />
                     </div>
                     <div className="mb-1">
                        <div className="mb-1 block">
                           <Label htmlFor="number" className="font-medium">
                              Phone
                           </Label>
                        </div>
                        <TextInput
                           id="number"
                           name="phone_number"
                           pattern="[0-9]+"
                           type={"number"}
                           title="Must be a valid mobile number"
                           placeholder="Enter Your Mobile Number"
                           onChange={getFormData}
                           color={
                              validity.phone === null
                                 ? undefined
                                 : validity.phone
                                 ? undefined
                                 : "failure"
                           }
                        />
                     </div>
                     <div className="mb-1">
                        <div className="mb-1 block">
                           <Label htmlFor="location" className="font-medium">
                              Location
                           </Label>
                        </div>
                        <TextInput
                           id="location"
                           name="location"
                           type={"text"}
                           placeholder="Enter Your Location"
                           onChange={getFormData}
                        />
                     </div>
                     <div className="mb-1">
                        <div className="mb-1 block">
                           <Label htmlFor="country" className="font-medium">
                              Preferred Country
                           </Label>
                        </div>
                        <TextInput
                           id="preferred_country"
                           name="preferred_country"
                           type={"text"}
                           placeholder="Enter Preferred Country"
                           onChange={getFormData}
                        />
                     </div>
                     <div className="mb-1">
                        <div className="mb-1 block">
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
                           color={
                              validity.password === null
                                 ? undefined
                                 : validity.password
                                 ? undefined
                                 : "failure"
                           }
                        />
                        <HelperText className="text-xs text-red-400">
                           {validity.password === false &&
                              "* Password must contain at least one number, one uppercase and lowercase, and at least 8 characters"}
                        </HelperText>
                     </div>

                     <div className="w-full pt-2 flex justify-center">
                        <Button
                           type={"submit"}
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
                        <div className="text-sm font-medium text-gray-400">
                           <p>
                              We have sent a code to{" "}
                              <span className="font-bold">
                                 {formData.email}
                              </span>
                              .
                           </p>
                           <p className="text-xs">
                              Please chek your spam if you haven't received OTP
                              mail yet.
                           </p>
                        </div>
                     </div>

                     <form id="otp-form">
                        <OTPInput
                           value={otp}
                           onChange={setOtp}
                           numInputs={6}
                           containerStyle={"w-full flex justify-evenly"}
                           inputStyle={
                              "w-12 h-12 text-center text-xl font-extrabold text-purple-800 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded  outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                           }
                           inputType={"number"}
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
                        {isResend ? (
                           <div className="text-center text-sm text-slate-500 mt-4">
                              Didn't receive code?{" "}
                              <button
                                 className="cursor-pointer font-medium text-indigo-500 hover:text-indigo-600"
                                 onClick={requestOTP}
                              >
                                 Resend
                              </button>
                           </div>
                        ) : (
                           <div className="text-center text-sm text-slate-500 mt-4">
                              Didn't receive code? Request in{" "}
                              <span className="text-indigo-500 font-bold">{counter}</span>
                           </div>
                        )}
                     </form>
                  </div>
               </ModalBody>
            </Modal>
         </>
      </div>
   );
}

export default Home;
