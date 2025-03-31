import React, { useEffect, useRef } from "react";
import mainlogo from "../../assets/applyeuropa-logo.svg";

import {
   Button,
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

function Home() {
   const [openModal, setOpenModal] = useState(false);
   const [open2Modal, setOpen2Modal] = useState(false);
   const [formData, setFormData] = useState({});
   const [isRegistered, setIsRegistered] = useState(true);
   const length = 6;
   const [otp, setOtp] = useState(new Array(length).fill(""));
   const inputRefs = useRef([]);

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
   };

   const getOtp = (index, value) => {
      if (!isNaN(value) && value.length === 1) {
         const newOtp = [...otp];
         newOtp[index] = value.charAt(0); // Ensure only one character is stored
         setOtp(newOtp);

         if (index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
         }
      }
   };

   const handleKeyDown = (index, e) => {
      if (e.key === "Backspace") {
         const newOtp = [...otp];
         newOtp[index] = "";
         setOtp(newOtp);

         if (index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
         }
      }
   };

   const requestOTP = async (e) => {
      e.preventDefault();
      const { full_name, email, password, phone_number, location } = formData;
      if (!full_name || !email || !password || !phone_number || !location) {
         toast.error("Please fill all the fields");
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
         let entered_otp = "";
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
         console.log(response);

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
            <div className="absolute -top-50 -right-50 w-[550px] h-[550px] bg-pink-300 rounded-full mix-blend-multiply filter blur-xl divBg opacity-70 "></div>
            <div className="absolute -bottom-100 right-10 w-[550px] h-[550px] bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 divBg animation-delay-2000 hidden md:block"></div>
            <div className="absolute -bottom-100 -left-50 w-[700px] h-[700px] bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 divBg animation-delay-4000 "></div>
         </div>
         <div className="heroContent absolute top-0">
            <div className="w-20 mx-3 mt-5 absolute top-0 left-0">
               <img src={mainlogo} alt="" />
            </div>
            <div className="flex flex-col items-center justify-center  h-dvh ">
               {isRegistered ? (
                  <h1 className="lg:mx-[25%] mx-6 lg:text-5xl text-4xl text-center font-semibold text-gray-700">
                     <span
                        style={{ fontFamily: "myFont2" }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent text-6xl"
                     >
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
                        Pre-register Today!
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
                              E-Mail
                           </Label>
                        </div>
                        <TextInput
                           id="email"
                           name="email"
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
                           pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                           title="Must contain at least one  number and one uppercase and lowercase letter, and at least 8 or more characters"
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
                     <div className="flex flex-col items-center justify-center text-center space-y-2">
                        <div className="text-center font-semibold text-2xl text-purple-700">
                           <p>Email Verification</p>
                        </div>
                        <div className="flex flex-row text-sm font-medium text-gray-400">
                           <p>We have sent a code to {formData.email}</p>
                        </div>
                     </div>

                     <form id="otp-form">
                        <div className="flex items-center justify-center gap-3">
                           {otp.map((digit, index) => (
                              <input
                                 class="w-12 h-12 text-center text-xl font-extrabold text-purple-800 bg-slate-100 border border-transparent hover:border-slate-200 appearance-none rounded  outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                 key={index}
                                 type="number"
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
                           Didn't receive code?{" "}
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
