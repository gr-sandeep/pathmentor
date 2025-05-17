import { useState } from "react";
import axios from "axios";
import React from "react";
import { PiSparkleBold } from "react-icons/pi";
import secureLocalStorage from "react-secure-storage";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropupCircle } from "react-icons/io";
import {
  headers,
  OPENAI_URL,
  Roadmap_System_Prompt,
  systemPrompt,
} from "../utils/Config";
import { db } from "../utils/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button, Select } from "antd";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Chat from "./Chat";
import chatBot from "../assets/chatbot.png";
import { useNavigate } from "react-router-dom";
import { RiRobot2Line } from "react-icons/ri";

const Home = () => {
  const [role, setrole] = useState("");
  const [complexity, setcomplexity] = useState("Beginner");
  const [phasesCount, setphasesCount] = useState(6);
  const [duration, setduration] = useState(3);
  const [roadmap, setRoadmap] = useState([]);
  const [selectedPhases, setselectedPhases] = useState(new Set());
  const [generating, setgenerating] = useState(false);
  const navigate = useNavigate();

  const phaseOptions = [];
  for (let i = 5; i <= 10; i++) {
    const value = i;
    phaseOptions.push({
      label: value,
      value,
    });
  }

  const durationOptions = [];
  for (let i = 1; i <= 6; i++) {
    const value = i;
    durationOptions.push({
      label: value,
      value,
    });
  }

  const complexityOptions = [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ];

  const fetchRoadmap = async () => {
    setgenerating(true);
    setRoadmap([]);
    try {
      const response = await axios.post(
        OPENAI_URL,
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: Roadmap_System_Prompt,
            },
            {
              role: "user",
              content: `Generate a roadmap for the role ${role} with ${complexity} complexity, ${phasesCount} phases and ${duration} months of duration`,
            },
          ],
        },
        headers
      );

      // Update response state with the fetched data
      const result = response.data.choices[0].message.content;
      secureLocalStorage.setItem("roadmap", result);
      setRoadmap(JSON.parse(result));

      const roadmapToStore = {
        role: role,
        complexity: complexity,
        numberofPhases: phasesCount,
        durationInMonths: duration,
        createdAt: new Date(),
        roadmap: JSON.parse(result)?.roadmap_steps,
      };

      await addDoc(collection(db, "roadmaps"), roadmapToStore);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setgenerating(false);
    }
  };

  const handleSelectPhase = (id) => {
    const phases = new Set(selectedPhases);

    if (phases.has(id)) {
      phases.delete(id);
    } else {
      phases.add(id);
    }
    setselectedPhases(phases);
  };

  const handleReset = () => {
    setcomplexity("Beginner");
    setphasesCount(6);
    setrole("");
    setduration("3");
    setRoadmap([]);
  };

  return (
    <>
      <div className="m-5 sm:m-10 md:m-20 shadow-xl drop-shadow-xl rounded-lg p-5 sm:p-10 md:p-20 flex flex-col items-center justify-center h-full">
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
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-10 lg:gap-20 w-full">
            <div className="w-1/2 md:w-1/3">
              <label htmlFor="">Complexity level</label> <br />
              <Select
                className="w-full"
                options={complexityOptions}
                onChange={setcomplexity}
                value={complexity}
              />
            </div>

            <div className="w-1/2 md:w-1/3">
              <label htmlFor="">Number of phases</label> <br />
              <Select
                className="w-full"
                options={phaseOptions}
                onChange={setphasesCount}
                value={phasesCount}
              />
            </div>

            <div className="w-1/2 md:w-1/3">
              <label htmlFor="">Duration in months</label> <br />
              <Select
                className="w-full"
                options={durationOptions}
                onChange={setduration}
                value={duration}
              />
            </div>
          </div>
          <div className="flex items-center gap-5 mt-5">
            <Button size="large" type="primary" onClick={fetchRoadmap}>
              {generating ? (
                <div className="flex items-center gap-3">
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Generating
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <PiSparkleBold /> Generate Roadmap
                </div>
              )}
            </Button>

            {!generating && (
              <Button size="large" danger onClick={handleReset}>
                Reset
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-10 w-full">
            {roadmap &&
              roadmap?.roadmap_steps?.map((phase) => (
                <div
                  className="border-2 p-4 border-gray-200 shadow-md rounded-md  flex flex-col items-center justify-between"
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
        </div>

        <div
          onClick={() => navigate("/chat-with-ai")}
          className="fixed bottom-10 right-10 cursor-pointer"
        >
          <RiRobot2Line
            title="Chat with Pathmentor AI"
            className="rounded-full text-[#0f4583] font-bold size-12 hover:scale-105 p-2 border-2 border-[#0f4583] animate-pulse hover:animate-none"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
