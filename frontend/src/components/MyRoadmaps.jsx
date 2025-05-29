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
import { Timeline } from "antd";
import RoadmapTimeline from "./RoadmapTimeline";

const MyRoadmaps = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [viewModal, setviewModal] = useState(false);
  const [currentRoadmap, setcurrentRoadmap] = useState([]);
  const [selectedPhases, setselectedPhases] = useState(new Set());
  const [deleteModal, setdeleteModal] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });


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
      render: (text, record, index) => (
        <span>
          {index + 1 + (pagination.current - 1) * pagination.pageSize}
        </span>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '',
      sorter: (a, b) => (a.role || '').localeCompare(b.role || ''),
    },
    {
      title: "Complexity",
      dataIndex: "complexity",
      key: "complexity",

      render: (text) => text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '',
      sorter: (a, b) => (a.complexity || '').localeCompare(b.complexity || ''),
    },
    {
      title: "No of Phases",
      dataIndex: "numberofPhases",
      key: "numberofPhases",

      render: (text, record) => <span>{text + " phases"}</span>,
    },
    {
      title: "Duration in Months",
      dataIndex: "durationInMonths",
      key: "durationInMonths",
      render: (text, record) => <span>{text + " months"}</span>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => {
        const date = text?.toDate ? text.toDate() : text;
        return <span>{moment(date).format("DD-MM-YYYY, hh:mm:ss a")}</span>;
      },
      sorter: (a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateA - dateB;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
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
    },
  ];

  return (
    <>
      <Table className="overflow-scroll p-10"
        dataSource={roadmaps}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: roadmaps?.length || 0,

          pageSizeOptions: [5, 10, 20],
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize }),
          showSizeChanger: true,
        }}
      />

      <Modal
        className="min-w-1/2"
        open={viewModal}
        onCancel={() => setviewModal(false)}
        footer={null}
        title={currentRoadmap[0]?.role?.toUpperCase()}
      ><div className="pt-10"></div>
        <RoadmapTimeline roadmap={currentRoadmap[0]} />
      </Modal>

      <Modal
        centered
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
    </>
  );
};

export default MyRoadmaps;
