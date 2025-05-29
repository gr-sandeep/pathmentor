import { useEffect, useState, useRef } from "react";
import axios from "axios";
import React from "react";
import { PiSparkleBold } from "react-icons/pi";
import secureLocalStorage from "react-secure-storage";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { IoIosArrowDropupCircle } from "react-icons/io";
import { headers, OPENAI_URL, Roadmap_System_Prompt } from "../utils/Config";
import { db } from "../utils/Firebase";
import { collection, addDoc } from "firebase/firestore";
import { Button, Input, Select } from "antd";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import RoadmapTimeline from "./RoadmapTimeline";

const Home = () => {
  const [role, setrole] = useState("");
  const [complexity, setcomplexity] = useState("Beginner");
  const [phasesCount, setphasesCount] = useState(6);
  const [duration, setduration] = useState(3);
  const [roadmap, setRoadmap] = useState([]);
  const [goal, setgoal] = useState("");
  const [learningType, setlearningType] = useState("All");
  const [selectedPhases, setselectedPhases] = useState(new Set());
  const [generating, setgenerating] = useState(false);
  const navigate = useNavigate();
  const roadmapRef = useRef(null);

  // useEffect(() => {
  //   setRoadmap(JSON.parse(secureLocalStorage.getItem('roadmap')))
  // }, [])

  useEffect(() => {
    if (roadmap && roadmapRef.current) {
      roadmapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [roadmap]);

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

  const learningTypeOptions = [
    { label: "All", value: "all video, article and interactive" },
    { label: "Video", value: "video" },
    { label: "Article", value: "article" },
    { label: "Interactive", value: "interactive" },
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
              content: `Generate a roadmap for the role ${role} with ${complexity} complexity, ${phasesCount} phases and ${duration} months of duration. The goal of the user is to ${goal} and his favourite way of learning is ${learningType}`,
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
        roadmap: JSON.parse(result)?.roadmap,
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
    <div className="rounded-lg flex flex-col items-center h-full overflow-auto pb-10">
      <div className="w-full md:w-3/4 text-center pt-10">
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
        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center w-3/4 gap-5 md:gap-10">
          <div className="">
            <label htmlFor="">Complexity level</label> <br />
            <Select
              className="w-full"
              options={complexityOptions}
              onChange={setcomplexity}
              value={complexity}
            />
          </div>

          <div className="">
            <label htmlFor="">Number of phases</label> <br />
            <Select
              className="w-full"
              options={phaseOptions}
              onChange={setphasesCount}
              value={phasesCount}
            />
          </div>

          <div className="">
            <label htmlFor="">Duration in months</label> <br />
            <Select
              className="w-full"
              options={durationOptions}
              onChange={setduration}
              value={duration}
            />
          </div>

          <div className="">
            <label htmlFor="">Learning Type</label> <br />
            <Select
              className="w-full"
              options={learningTypeOptions}
              onChange={setlearningType}
              value={learningType}
            />
          </div>

        </div>
        <div className="w-3/4">
          <label htmlFor="">Enter your goal</label> <br />
          <Input
            className="w-full"
            placeholder="Get a job, Pass a certification, Switch careers..."
            onChange={e => setgoal(e.target.value)}
            value={goal}
          />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-5 mt-5">
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
        <div className="pt-5 w-3/4" ref={roadmapRef}>
          {roadmap &&
            <RoadmapTimeline roadmap={roadmap} />}
        </div>
      </div>

    </div>
  );
};

export default Home;
