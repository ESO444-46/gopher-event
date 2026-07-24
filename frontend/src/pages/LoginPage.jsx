import { useState } from "react"
import api from "../api/axios";
import { useToast } from "../context/ToastContext";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isLoading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { showToast } = useToast()
  const navigate = useNavigate()

async function loginRequest(event){
    event.preventDefault();
    setLoading(true)

    try{
        const result = await api.post("/auth/login",{
          email,password
      })

      const {accessToken} = result.data
      localStorage.setItem("token",accessToken)

      showToast("success", "Welcome back, Gopher!")
      navigate('/events')

    }catch(error){
        /*
        We're assuming this only triggers when the backend return status other than 200
        Infact it throw the error when the User internet is down or server is down
        If any of those true! we would not have the error.message (undefined)
        In that case looking for data in undefiend will throw an erro and crashes it!
      */

      setPassword("")

      let displayMessage = ""
      if(error.code == "ERR_NETWORK"){
        displayMessage = "Network error. Please check your internet connection or try again later.";

      } else if(error.response?.data?.message){
        displayMessage = error.response.data.message;
      }
      else{
        displayMessage = "Something went wrong. Please try again.";
      }
      showToast("error", displayMessage)
    }

    finally{
      setLoading(false)
    }

  }

  return (
    <div className="auth-page min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <div className="w-full max-w-5xl">
        
        {/* Card */}
        <div className="auth-card login-card rounded-2xl overflow-hidden">
          
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

            <form className="space-y-5" onSubmit={loginRequest}>
              
              {/* Email */}
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
                    placeholder="x500@umn.edu"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
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
                    placeholder="Enter your password"
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7a0019] focus:border-[#7a0019] transition-colors sm:text-sm"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />

                </div>
              </div>
              
              
              {/* Submit */}
              <button
                disabled = {isLoading}
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-[#7a0019] hover:bg-[#5a0012] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7a0019] transition-colors"
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>

            </form>
            <p className="mt-6 text-center text-sm text-ink-soft">
              New to Gopher Events? <Link to="/signup" className="font-semibold text-maroon">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
