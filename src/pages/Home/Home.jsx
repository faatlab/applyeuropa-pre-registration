import React, { useEffect, useRef } from "react";
import mainlogo from "../../assets/applyeuropa-logo.svg";

import {
   Button,
   Checkbox,
   Label,
   Modal,
   ModalBody,
   ModalHeader,
   TextInput,
   ThemeConfig,
} from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useFrappeCreateDoc } from "frappe-react-sdk";

function Home() {
   const [openModal, setOpenModal] = useState(false);
   const [open2Modal, setOpen2Modal] = useState(false);
   const [formData, setFormData] = useState({});
   const [isRegistered, setIsRegistered] = useState(false);
   const length = 6;
   const [otp, setOtp] = useState("".padStart(length, " "));
   const inputRefs = useRef([]);

   const { createDoc } = useFrappeCreateDoc();

   function onCloseModal() {
      setOpenModal(false);
      setFormData({});
   }

   function onClose2Modal() {
      setOpen2Modal(false);
      setFormData({});
   }

   const getFormData = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const getOtp = (index, value) => {
      if (!isNaN(value) && value !== "") {
         let newOtp = otp.split(""); // Convert string to array
         newOtp[index] = value.charAt(0); // Replace the character
         setOtp(newOtp.join(""));

         // Move to the next input
         if (index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
         }
      }
   };

   const handleKeyDown = (index, e) => {
      if (e.key === "Backspace") {
         const newOtp = [...otp];
         newOtp[index] = " ";
         setOtp(newOtp);

         // Move to the previous input
         if (index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
         }
      }
   };

   const requestOTP = async () => {
      setOpen2Modal(true);
      try {
         await axios.post(
            `${
               import.meta.env.VITE_FRAPPE_URL
            }/api/method/applyeuropa.applyeuropa.doctype.student.student.send_otp_email`,
            { email: formData.email }
         );
      } catch (err) {
         console.error(err);
      }
   };

   const verifyOTP = async () => {
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
               {isRegistered ? (
                  <h1 className="lg:mx-[25%] mx-6 lg:text-5xl text-4xl text-center font-semibold text-gray-700">
                     <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Congratulations!
                     </span>{" "}
                     You’ve successfully registered. We’re thrilled to have you
                     onboard.
                  </h1>
               ) : (
                  <>
                     <h1 className="lg:mx-[25%] mx-6 lg:text-5xl text-4xl text-center font-semibold text-gray-700">
                        Study in{" "}
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                           Europe{" "}
                        </span>
                        with expert guidance and endless opportunities.
                        Pre-register today
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

         {/* modal */}

         {/* <!-- Main modal --> */}
         <>
            <ThemeConfig dark={false} />
            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
               <ModalHeader />
               <ModalBody>
                  <div className="space-y-4">
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
                           placeholder="Enter Full Name"
                           onChange={getFormData}
                           required
                        />
                     </div>
                     <div>
                        <div className="mb-2 block">
                           <Label htmlFor="email" className="font-medium">
                              Mail
                           </Label>
                        </div>
                        <TextInput
                           id="email"
                           name="email"
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
                           onChange={getFormData}
                           placeholder="⁕ ⁕ ⁕ ⁕ ⁕ ⁕"
                           required
                        />
                     </div>

                     <div className="w-full pt-2 flex justify-center">
                        <Button
                           className="cursor-pointer text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:outline-none  shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-400/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                           onClick={requestOTP}
                        >
                           Register now
                        </Button>
                     </div>
                  </div>
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
                     <div class="flex flex-col items-center justify-center text-center space-y-2">
                        <div class="text-center font-semibold text-2xl text-purple-700">
                           <p>Email Verification</p>
                        </div>
                        <div class="flex flex-row text-sm font-medium text-gray-400">
                           <p>We have sent a code to {formData.email}</p>
                        </div>
                     </div>

                     <form id="otp-form">
                        <div class="flex items-center justify-center gap-3">
                           {[...otp].map((digit, index) => (
                              <input
                                 key={index}
                                 type="number"
                                 class="w-12 h-12 text-center text-xl font-extrabold text-purple-800 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded  outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                 pattern="\d*"
                                 maxLength={1}
                                 name="otp1"
                                 value={digit}
                                 ref={(el) => (inputRefs.current[index] = el)}
                                 onChange={(e) => getOtp(index, e.target.value)}
                                 onKeyDown={(e) => handleKeyDown(index, e)}
                              />
                           ))}
                        </div>
                        <div class="max-w-[260px] mx-auto mt-4">
                           <Button
                              // type="submit"
                              class="cursor-pointer w-full inline-flex justify-center whitespace-nowrap px-3.5 py-2.5 text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:outline-none  shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-400/80 font-medium rounded-lg text-sm hover:bg-indigo-600 transition-colors duration-150"
                              onClick={verifyOTP}
                           >
                              Verify OTP
                           </Button>
                        </div>
                        <div class="text-center text-sm text-slate-500 mt-4">
                           Didn't receive code?{" "}
                           <a
                              class="font-medium text-indigo-500 hover:text-indigo-600"
                              href="#0"
                           >
                              Resend
                           </a>
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
