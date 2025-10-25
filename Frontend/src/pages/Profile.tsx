import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Button from "../components/Button";
import { auth } from "../firebaseConfig";
import { getIdToken } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

import {
  UserIcon,
  HeartIcon,
  FlameIcon,
  AwardIcon,
  CalendarIcon,
  CheckCircleIcon,
} from "lucide-react";

// Dropdown options
const dietaryPreferences = [
  "No Restrictions",
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Keto",
  "Paleo",
  "Low Carb",
  "Mediterranean",
  "Gluten-Free",
];
const commonAllergies = [
  "Dairy",
  "Eggs",
  "Peanuts",
  "Tree nuts",
  "Soy",
  "Wheat/Gluten",
  "Fish",
  "Shellfish",
];
const goals = [
  { id: "lose-weight", title: "Lose Weight" },
  { id: "gain-muscle", title: "Gain Muscle" },
  { id: "maintain-weight", title: "Maintain Weight" },
  { id: "improve-energy", title: "Improve Energy Levels" },
  { id: "eat-healthier", title: "Eat Healthier" },
];

const Profile: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setError("No user logged in");
          setLoading(false);
          return;
        }

        const token = await getIdToken(currentUser, true);
        const res = await fetch(
          `http://localhost:5000/api/users/${currentUser.uid}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch user data");
        setUserData(data.user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Pre-fill editData when opening the modal
  useEffect(() => {
    if (isEditing && userData) {
      setEditData({
        ...userData,
        allergies: userData.allergies || [],
        goal: userData.onboarding?.goal || "",
      });
    }
  }, [isEditing, userData]);

  // Handle input/select changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, options } = e.target as HTMLSelectElement;

    if (name === "allergies" && options) {
      const selectedAllergies: string[] = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selectedAllergies.push(options[i].value);
      }
      setEditData({ ...editData, [name]: selectedAllergies });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  // Save updated profile to Firestore
  const handleSave = async () => {
    try {
      if (!auth.currentUser) return;

      const updatedData = {
        ...editData,
        onboarding: { ...userData.onboarding, goal: editData.goal },
      };

      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, updatedData);

      setUserData(updatedData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Try again.");
    }
  };

  if (loading) return <Layout>Loading your profile...</Layout>;
  if (error) return <Layout>Error: {error}</Layout>;
  if (!userData) return <Layout>No user data found.</Layout>;

  const {
    firstName,
    lastName,
    email,
    age,
    gender,
    dietPreference,
    allergies,
    onboarding,
    points,
    badges,
    createdAt,
    quizAnswers,
  } = userData;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2 rounded-full">
                <UserIcon className="text-emerald-500 w-12 h-12" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{firstName} {lastName}</h1>
                <p className="text-sm opacity-80">{email}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="bg-white text-emerald-600 hover:bg-gray-100 shadow-md"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
              <Button
                className="bg-red-500 text-white hover:bg-red-600 shadow-md"
                onClick={() => {
                  auth.signOut().then(() => {
                    alert("Logged out successfully!");
                    window.location.href = "/"; // redirect to home or login page
                  });
                }}
              >
                Log Out
              </Button>
            </div>
          </div>


        {/* Personal & Dietary Info Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Personal Info</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-400" /> Age: {age}
              </li>
              <li className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-gray-400" /> Gender: {gender}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-green-500" /> Onboarding Completed: {onboarding?.completedAt ? "Yes" : "No"}
              </li>
              <li className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-gray-400" /> Joined: {new Date(createdAt).toLocaleDateString()}
              </li>
            </ul>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Dietary Info</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <HeartIcon className="w-5 h-5 text-pink-500" /> Diet Preference: {dietPreference}
              </li>
              <li className="flex items-center gap-2">
                <FlameIcon className="w-5 h-5 text-orange-400" /> Goal: {onboarding?.goal}
              </li>
              <li><strong>Allergies:</strong> {allergies?.join(", ") || "None"}</li>
            </ul>
          </div>
        </div>

        {/* Points & Badges */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-gradient-to-r from-yellow-100 to-yellow-200 shadow-md rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-100">
            <HeartIcon className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm font-semibold opacity-80">Points</p>
            <p className="text-3xl font-bold">{points}</p>
          </div>
          <div className="flex-1 bg-white shadow-md rounded-2xl p-6 border border-gray-100">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AwardIcon className="w-5 h-5 text-yellow-500" /> Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              {badges?.length > 0 ? badges.map((badge: string, idx: number) => (
                <span key={idx} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <AwardIcon className="w-4 h-4" /> {badge}
                </span>
              )) : <p className="text-gray-500">No badges yet.</p>}
            </div>
          </div>
        </div>

        {/* Quiz Answers Accordion */}
        {quizAnswers && Object.keys(quizAnswers).length > 0 && (
          <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
            <h3 className="text-xl font-semibold mb-3">Quiz Answers</h3>
            {Object.entries(quizAnswers).map(([question, answer], idx) => (
              <div key={idx} className="mb-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-600"><strong>{question.replace(/-/g, " ")}</strong></p>
                <p className="text-gray-800">{answer}</p>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
{isEditing && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-y-auto max-h-[90vh] p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-emerald-600">Edit Profile</h2>

      {/* Sections */}
      <div className="space-y-6">
        {/* Name */}
        <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-emerald-500" /> Name
          </h3>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-500 text-sm mb-1">Current: {firstName}</label>
              <input
                type="text"
                name="firstName"
                value={editData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-emerald-300 focus:ring-2 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Current: {lastName}</label>
              <input
                type="text"
                name="lastName"
                value={editData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-emerald-300 focus:ring-2 outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Personal Info */}
        <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-500" /> Personal Info
          </h3>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-500 text-sm mb-1">Current: {age}</label>
              <input
                type="number"
                name="age"
                value={editData.age}
                onChange={handleChange}
                placeholder="Age"
                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-blue-300 focus:ring-2 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Current: {gender}</label>
              <select
                name="gender"
                value={editData.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-blue-300 focus:ring-2 outline-none transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Diet & Goal */}
        <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <FlameIcon className="w-5 h-5 text-orange-500" /> Diet & Goal
          </h3>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-500 text-sm mb-1">Current: {dietPreference}</label>
              <select
                name="dietPreference"
                value={editData.dietPreference}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-orange-300 focus:ring-2 outline-none transition"
              >
                {dietaryPreferences.map((diet) => (
                  <option key={diet} value={diet}>{diet}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Current: {onboarding?.goal}</label>
              <select
                name="goal"
                value={editData.goal}
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-2 rounded-xl focus:ring-orange-300 focus:ring-2 outline-none transition"
              >
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.title}>{goal.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <HeartIcon className="w-5 h-5 text-pink-500" /> Allergies
          </h3>
          <label className="block text-gray-500 text-sm mb-2">Current: {allergies?.join(", ") || "None"}</label>
          <select
            name="allergies"
            value={editData.allergies}
            onChange={handleChange}
            multiple
            className="w-full border border-gray-300 px-4 py-2 rounded-xl h-28 focus:ring-pink-300 focus:ring-2 outline-none transition"
          >
            {commonAllergies.map((allergy) => (
              <option key={allergy} value={allergy}>{allergy}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <Button
          className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
        <Button
          className="bg-emerald-500 text-white hover:bg-emerald-600"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  </div>
)}



      </div>
    </Layout>
  );
};

export default Profile;
