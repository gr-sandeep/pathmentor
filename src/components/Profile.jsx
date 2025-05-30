import React from "react";
import { Card } from "antd";
import secureLocalStorage from "react-secure-storage";

const profile = {
  firstName: "Sandeep",
  lastName: "Gr",
  dateOfBirth: "23-03-2001",
  address: "Chennai, Tamilnadu, India",
  phoneNumber: "+918754225785",
  personalEmail: "grsandeep87@gmail.com",
  professionalEmail: "2000080669@hexaware.com",
  currentRole: "React Frontend Developer",
  experience: "3 years at Hexaware Technologies Ltd",
  education: "B.E. Computer Science and Engineering",
  linkedin: "https://www.linkedin.com/in/gr-sandeep",
  github: "https://www.github.com/gr-sandeep",
  skills:
    "ReactJS, JavaScript, HTML, CSS, Tailwind, Ant Design, Material UI, Redux",
};

const userInfo = secureLocalStorage.getItem("userInfo");

const Profile = () => (
  <div className="p-10 m-10 rounded-lg shadow-lg max-w-4xl mx-auto text-base bg-white">
    <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
      My Profile
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
      <div>
        <span className="font-semibold text-gray-700">First Name:</span>{" "}
        <span className="text-gray-900">{profile.firstName}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-700">Last Name:</span>{" "}
        <span className="text-gray-900">{profile.lastName}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-700">Date of Birth:</span>{" "}
        <span className="text-gray-900">{profile.dateOfBirth}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-700">Address:</span>{" "}
        <span className="text-gray-900">{profile.address}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-700">Phone Number:</span>{" "}
        <span className="text-gray-900">{profile.phoneNumber}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-700">Personal Email:</span>{" "}
        <span className="text-gray-900">{profile.personalEmail}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-700">Professional Email:</span>{" "}
        <span className="text-gray-900">{profile.professionalEmail}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-700">Current Role:</span>{" "}
        <span className="text-gray-900">{profile.currentRole}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-700">Experience:</span>{" "}
        <span className="text-gray-900">{profile.experience}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-700">Education:</span>{" "}
        <span className="text-gray-900">{profile.education}</span>
      </div>
      <div>
        <span className="font-semibold text-gray-700">LinkedIn:</span>{" "}
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all"
        >
          {profile.linkedin}
        </a>
      </div>
      <div>
        <span className="font-semibold text-gray-700">GitHub:</span>{" "}
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all"
        >
          {profile.github}
        </a>
      </div>
      <div className="md:col-span-2">
        <span className="font-semibold text-gray-700">Skills:</span>{" "}
        <span className="text-gray-900">{profile.skills}</span>
      </div>
    </div>
  </div>
);

export default Profile;
