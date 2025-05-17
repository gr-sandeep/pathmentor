import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../utils/Firebase";
import { Avatar, Button, message, Modal, Table } from "antd";
import { IoEyeOutline } from "react-icons/io5";
import { AiOutlineEye } from "react-icons/ai";
import { MdOutlineDelete } from "react-icons/md";
import moment from "moment/moment";
import secureLocalStorage from "react-secure-storage";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
} from "react-icons/io";

const Progress = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [viewModal, setviewModal] = useState(false);
  const [currentRoadmap, setcurrentRoadmap] = useState([]);
  const [selectedPhases, setselectedPhases] = useState(new Set());
  const [deleteModal, setdeleteModal] = useState(false);

  const handleSelectPhase = (id) => {
    const phases = new Set(selectedPhases);

    if (phases.has(id)) {
      phases.delete(id);
    } else {
      phases.add(id);
    }
    setselectedPhases(phases);
  };

  useEffect(() => {
    fetchRoadmaps();
    const storedRoadmaps = secureLocalStorage.getItem("allRoadmaps");
    setRoadmaps(storedRoadmaps);
  }, []);

  const fetchRoadmaps = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "roadmaps"));
      const roadmapsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRoadmaps(roadmapsData);
      secureLocalStorage.setItem("allRoadmaps", roadmapsData);
    } catch (error) {
      console.error("Error fetching Roadmaps: ", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteDoc(doc(db, "roadmaps", currentRoadmap[0]?.id));
      message.success("Document successfully deleted!");
    } catch (error) {
      message.error("Error removing document: ", error);
    } finally {
      setcurrentRoadmap([]);
      setdeleteModal(false);
      fetchRoadmaps();
    }
  };

  const columns = [
    {
      title: "S. No",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Complexity",
      dataIndex: "complexity",
      render: (text, record) => <span>{text}</span>,
    },
    {
      title: "No of Phases",
      dataIndex: "numberofPhases",
      render: (text, record) => <span>{text + " phases"}</span>,
    },
    {
      title: "Duration in Months",
      dataIndex: "durationInMonths",
      render: (text, record) => <span>{text + " months"}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => (
        <span>{moment(record).format("DD-MM-YYYY, hh:mm:ss a")}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => (
        <div
          className="flex items-center gap-4"
          onClick={() =>
            setcurrentRoadmap(
              roadmaps.filter((roadmap) => roadmap.id == record.id)
            )
          }
        >
          <AiOutlineEye
            onClick={() => setviewModal(true)}
            title="View Roadmap"
            className="text-3xl border border-blue-500 text-blue-500 p-1 rounded cursor-pointer hover:opacity-70"
          />
          <MdOutlineDelete
            onClick={() => setdeleteModal(true)}
            title="Delete Roadmap"
            className="text-3xl border p-1 rounded border-red-500 text-red-500 cursor-pointer hover:opacity-70"
          />
        </div>
      ),
      key: "view",
    },
  ];

  return (
    <div>
      <Table
        dataSource={roadmaps}
        columns={columns}
        pagination={{
          position: ["bottomcenter"],
          total: roadmaps?.length || 0,
        }}
      />

      <Modal
        width="60%"
        open={viewModal}
        onCancel={() => setviewModal(false)}
        footer={null}
        title={currentRoadmap[0]?.role?.toUpperCase()}
      >
        <div className="flex flex-col gap-10 w-full p-5">
          {currentRoadmap[0]?.roadmap?.map((phase) => (
            <div
              className="border-2 p-4 border-gray-200 shadow-md rounded-md  flex flex-col items-center justify-between"
              key={phase.phase}
            >
              <div
                onClick={() => handleSelectPhase(phase.phase)}
                className="flex items-center justify-between w-full cursor-pointer"
              >
                <p className="text-lg">
                  Phase {phase.phase} - {phase.topic}
                </p>
                {selectedPhases.has(phase.phase) ? (
                  <IoIosArrowDropupCircle
                    className="text-[#535353]"
                    fontSize={20}
                  />
                ) : (
                  <IoIosArrowDropdownCircle
                    className="text-[#535353]"
                    fontSize={20}
                  />
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
      </Modal>

      <Modal
        open={deleteModal}
        onCancel={() => setdeleteModal(false)}
        footer={null}
        title="Delete a roadmap"
      >
        <p>Are you sure you want to delete this roadmap?</p>

        <div className="flex justify-center gap-3 my-5">
          <Button
            onClick={() => {
              setdeleteModal(false);
              setcurrentRoadmap([]);
            }}
          >
            Cancel
          </Button>
          <Button danger onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Progress;
