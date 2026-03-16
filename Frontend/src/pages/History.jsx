
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";

export default function History() {

  const [history,setHistory] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    loadHistory();
  },[]);

 const loadHistory = async () => {

  try {

    const token = localStorage.getItem("token");

    const res = await axios.get("/api/history/my-history",{
      headers:{
        Authorization:`Bearer ${token}`
      }
    });

    // FIX HERE
    setHistory(res.data.data || res.data.history || res.data);

  } catch(err) {

    console.error(err);

  }

};

  return(

    <div className="max-w-6xl mx-auto px-4 py-16">

      <h1 className="text-3xl font-bold mb-10 flex items-center gap-2">
        <FiClock/>
        Calculation History
      </h1>

      {loading && <p className="text-gray-400">Loading...</p>}

      {!loading && history.length === 0 && (
        <p className="text-gray-500">
          No calculations yet.
        </p>
      )}

      <div className="space-y-4">

        {history.map(item=>(
          
          <motion.div
            key={item.id}
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            className="border rounded-xl p-5 bg-white dark:bg-zinc-900"
          >

            <div className="flex justify-between">

              <div>
                <p className="text-sm text-gray-400">
                  {item.calculatorName || item.calculatorType}
                </p>

                <p className="font-semibold mt-1">
                  {item.summary || JSON.stringify(item.result)}
                </p>
              </div>

              <p className="text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleString()}
              </p>

            </div>

          </motion.div>

        ))}

      </div>

    </div>

  );
}

