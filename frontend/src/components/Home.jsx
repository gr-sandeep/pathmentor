import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { generateRoadmap } from "../config/Config";
import { PiPlusBold, PiPlusCircleBold, PiSparkleBold } from "react-icons/pi";
import Header from "./Header";
import secureLocalStorage from "react-secure-storage";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import Chat from "./Chat";

const Home = () => {
  const [role, setrole] = useState("");
  const [response, setresponse] = useState([]);
  const [selectedPhases, setselectedPhases] = useState(new Set());
  const [generating, setgenerating] = useState(false);
  const [adding, setadding] = useState(false);

  useEffect(() => {
    const storedResponse = secureLocalStorage.getItem("roadmap");
    console.log("stored resp", JSON.parse(storedResponse));

    setresponse(JSON.parse(storedResponse));
  }, []);

  const fetchRoadmap = useCallback(async () => {
    if (generating) return;

    setresponse([]);
    setselectedPhases(new Set());
    setgenerating(true);

    try {
      const payload = {
        role: role,
      };
      const response = await axios({
        method: "post",
        url: generateRoadmap,
        data: payload,
      });

      const roadmap = response?.data;
      secureLocalStorage.setItem("roadmap", JSON.stringify(roadmap));
      setresponse(roadmap);
      console.log(roadmap);
    } catch (error) {
      console.log(error);
    } finally {
      setgenerating(false);
    }
  });

  const addRoadmap = useCallback(async () => {
    setadding(true);

    try {
    } catch (error) {
    } finally {
      setadding(false);
    }
  });

  const handleSelectPhase = (id) => {
    const phases = new Set(selectedPhases);

    if (phases.has(id)) {
      phases.delete(id);
    } else {
      phases.add(id);
    }
    console.log(phases);

    setselectedPhases(phases);
  };

  return (
    <>
      <div className="m-5 sm:m-10 md:m-20 border-2 border-gray-200 drop-shadow-xl rounded-lg p-5 sm:p-10 md:p-20 flex flex-col items-center justify-center">
        <div className="w-full md:w-3/4 text-center">
          <p className="text-xl py-2">Want to simplify career planning?</p>
          <p className="">
            <span className="bg-gradient-to-r text-xl font-semibold pr-1 from-blue-500 to-red-500 bg-clip-text text-transparent">
              Pathmentor
            </span>
            <span>
              helps you create a personalized learning roadmap in just a few
              steps. Simply enter your desired role or field, and let AI guide
              you toward achieving your career goals.
            </span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-10 my-10 w-full">
          <input
            className="input border border-amber-400 py-3 rounded-md w-3/4 px-3 focus:outline-none text-center"
            placeholder="Eg. Frontend Developer, GenAI Developer, DevOps Engineer, Workday Consultant, Cloud Administrator..."
            onChange={(e) => setrole(e.target.value)}
            value={role}
          />

          <button
            onClick={fetchRoadmap}
            className="btn bg-gradient-to-r from-[#9747ff] hover:from-[#0073e6] hover:to-[#9747ff] to-[#0073e6] text-white px-5 rounded-lg py-2 flex items-center gap-2 hover:scale-105 cursor-pointer transition-all duration-500 tracking wider"
          >
            {generating ? (
              <>
                <span className="loading loading-spinner"></span> Generating
              </>
            ) : (
              <>
                <PiSparkleBold /> Generate Roadmap
              </>
            )}
          </button>

          <div className="flex flex-col gap-10 w-full">
            {response &&
              response?.roadmap_steps?.map((phase) => (
                <div
                  className="border-2 p-3 border-gray-200 shadow-md rounded-md  flex flex-col items-center justify-between"
                  key={phase.phase}
                >
                  <div
                    onClick={() => handleSelectPhase(phase.phase)}
                    className="flex items-center justify-between w-full cursor-pointer"
                  >
                    <p className="text-lg font-semibold">
                      Phase {phase.phase} - {phase.topic}
                    </p>
                    {selectedPhases.has(phase.phase) ? (
                      <IoIosArrowDropupCircle fontSize={20} />
                    ) : (
                      <IoIosArrowDropdownCircle fontSize={20} />
                    )}
                  </div>

                  {selectedPhases.has(phase.phase) && (
                    <div className="flex flex-col w-full p-3 gap-3">
                      <div className="flex flex-wrap gap-1">
                        <span className="font-semibold pr-2">Topics:</span>
                        {phase?.subtopics?.map((topic) => (
                          <span>{topic + ","}</span>
                        ))}
                      </div>
                      <p>
                        <span className="font-semibold pr-2">
                          Estimated Duration:
                        </span>
                        {phase?.estimated_duration_weeks} weeks
                      </p>
                      <div>
                        <span className="font-semibold">Resources:</span>
                        <div className="flex flex-wrap gap-2">
                          {phase?.resources?.map((res, index) => (
                            <a
                              key={index}
                              className="text-blue-600 hover:scale-105 text-sm border rounded-md px-2 py-0.5 cursor-pointer"
                              href={res.url}
                              target="_blank"
                            >
                              {res.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
          {response && (
            <button
              onClick={addRoadmap}
              className="btn bg-gradient-to-r from-[#9747ff] hover:from-[#0073e6] hover:to-[#9747ff] to-[#0073e6] text-white px-5 rounded-lg py-2 flex items-center gap-2 hover:scale-105 cursor-pointer transition-all duration-500 tracking-wide"
            >
              {generating ? (
                <>
                  <span className="loading loading-spinner"></span> Adding this
                  roadmap
                </>
              ) : (
                <>
                  <PiPlusBold /> Add this roadmap to "My Progress"
                </>
              )}
            </button>
          )}
        </div>
      </div>
      {/* <Chat /> */}
    </>
  );
};

export default Home;
