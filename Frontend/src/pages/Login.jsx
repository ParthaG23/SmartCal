
import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

import { loginUser } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Login() {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [focus,setFocus] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname ?? "/";

  /* ============================
     EMAIL LOGIN
  ============================ */

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const res = await loginUser({ email,password });

      login({
        token: res.data.token,
        ...res.data.user
      });

      navigate(from,{ replace:true });

    } catch(err) {

      setError(err?.response?.data?.message ?? "Invalid email or password.");

    } finally {

      setLoading(false);

    }

  };


  /* ============================
     GOOGLE LOGIN
  ============================ */

  const handleGoogleSuccess = (credentialResponse) => {

    const decoded = jwtDecode(credentialResponse.credential);

    login({
      token: credentialResponse.credential,
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture
    });

    navigate(from,{ replace:true });

  };

  const handleGoogleError = () => {
    setError("Google login failed. Try again.");
  };


  return (

    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#09090b] px-4 overflow-hidden">

      <motion.div
        initial={{ opacity:0,y:40,scale:0.96 }}
        animate={{ opacity:1,y:0,scale:1 }}
        transition={{ duration:0.5 }}
        className="relative w-full max-w-md"
      >

        <div className="p-8 rounded-3xl border border-gray-200 dark:border-white/10
        bg-white/90 dark:bg-[#111116]/80 shadow-2xl backdrop-blur-xl">

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Welcome back
          </h1>

          <p className="text-sm text-gray-500 dark:text-white/50 mb-6">
            Login to your SmartCalc account
          </p>


          {/* GOOGLE LOGIN */}

          <div className="mb-6 flex justify-center">

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
            />

          </div>


          <div className="flex items-center gap-3 mb-6">

            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />

          </div>


          {/* ERROR MESSAGE */}

          {error && (

            <motion.div
              initial={{ opacity:0,y:-8 }}
              animate={{ opacity:1,y:0 }}
              className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
            >
              <FiAlertCircle/>
              {error}
            </motion.div>

          )}


          {/* LOGIN FORM */}

          <form onSubmit={handleSubmit} className="space-y-5">


            {/* EMAIL */}

            <div className="relative">

              <FiMail className="absolute left-4 top-4 text-gray-400"/>

              <input
                type="email"
                required
                value={email}
                onFocus={()=>setFocus("email")}
                onBlur={()=>setFocus("")}
                onChange={(e)=>setEmail(e.target.value)}
                className={`w-full pl-11 pr-4 pt-5 pb-2 rounded-xl border
                bg-white dark:bg-[#111116] text-sm outline-none transition
                ${focus==="email"
                  ? "border-indigo-500 ring-2 ring-indigo-500/20"
                  : "border-gray-200 dark:border-white/10"
                }`}
              />

              <label className={`absolute left-11 text-gray-400 text-sm transition-all
              ${email || focus==="email" ? "top-1 text-xs" : "top-3.5"}`}>
                Email address
              </label>

            </div>


            {/* PASSWORD */}

            <div className="relative">

              <FiLock className="absolute left-4 top-4 text-gray-400"/>

              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onFocus={()=>setFocus("password")}
                onBlur={()=>setFocus("")}
                onChange={(e)=>setPassword(e.target.value)}
                className={`w-full pl-11 pr-12 pt-5 pb-2 rounded-xl border
                bg-white dark:bg-[#111116] text-sm outline-none transition
                ${focus==="password"
                  ? "border-indigo-500 ring-2 ring-indigo-500/20"
                  : "border-gray-200 dark:border-white/10"
                }`}
              />

              <label className={`absolute left-11 text-gray-400 text-sm transition-all
              ${password || focus==="password" ? "top-1 text-xs" : "top-3.5"}`}>
                Password
              </label>

              <button
                type="button"
                onClick={()=>setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showPassword ? <FiEyeOff/> : <FiEye/>}
              </button>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              hover:scale-[1.02] active:scale-[0.98] transition"
            >
              {loading ? "Logging in…" : "Login"}
            </button>

          </form>


          <p className="text-sm text-gray-500 dark:text-white/50 mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold">
              Sign up
            </Link>
          </p>

        </div>

      </motion.div>

    </div>
  );
}

