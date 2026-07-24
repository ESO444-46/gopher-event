import { useState } from "react";
import Spinner from "./SpinnerComponent";
import api from "../api/axios";
import GopherMessage from "./GopherMessage";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const SignUpComponenet = ({
  firstName, setFirstName,
  lastName, setLastName,
  email, setEmail,
  password, setPassword

}) =>{
    const navigate = useNavigate()
    const { showToast } = useToast()
    const [isLoading, setLoading] = useState(false)

    const onSignupSubmit = async (event) =>{
        event.preventDefault();
        setLoading(true)

        try{
            const result = await api.post("/auth/signup",{
                firstName,lastName,email,password
            })
            // token saved to the local storage

            showToast("success", "Verification code sent to your email!")
            setLoading(false)
            navigate("/verify-email", {state:{email}})

        } catch(error){
            setLoading(false)
            const errorMessage = error.response?.data?.message ?? "Something went wrong"

            showToast("error", errorMessage)
        }

    }

    
    return (
    <div className="auth-page min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="w-full max-w-5xl">
        
        {/* Card */}
        <div className="auth-card signup-card rounded-2xl overflow-hidden">
          
          {/* Header */}
          <div className="auth-brand px-8 py-8 text-center">
            <div className="mx-auto h-14 w-14 bg-white rounded-xl flex items-center justify-center shadow-lg mb-3">
              <span className="text-[#7a0019] font-bold text-xl">M</span>
            </div>
            <h2 className="font-sans text-xl font-bold text-white">University of Minnesota</h2>
            <p className="mt-1 text-[#ffcc33] text-xs font-semibold uppercase tracking-wider">Gopher Events</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <div className="mb-5">
              <GopherMessage
                type="info"
                message="Only @umn.edu emails are allowed for now!"
              />
            </div>
            <form className="space-y-7" onSubmit={onSignupSubmit}>
              
              {/* First Name & Last Name — Side by Side */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>

                    <input
                      id="firstName"
                      name="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      type="text"
                      placeholder="Goldy"
                      required
                      className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
                    />
                  </div>

                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Gopher"
                      required
                      className="block w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
                    />
                  </div>
                </div>

              </div>

              {/* University Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  University Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="x500@umn.edu"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
                  />
                </div>
              </div>
              
              {/* Submit */}
              <button
                type="submit"
                disabled = {isLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-[#7a0019] hover:bg-[#5a0012] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7a0019] transition-colors disabled:opacity-50"
              >

                {/*This to excecute when isloading is true! If not no*/}

                {isLoading && (<Spinner></Spinner>)}
                {isLoading ? "Signing up..." : "Create Account"}



              </button>

            </form>
            <p className="mt-6 text-center text-sm text-ink-soft">
              Already have an account? <Link to="/login" className="font-semibold text-maroon">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default SignUpComponenet
