import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { FileText, BarChart2, Calendar, ChevronLeft, Shield } from "lucide-react";
import { auth } from "../firebaseConfig";
import { CalendarIcon, HistoryIcon, PieChartIcon, ShieldAlertIcon } from "lucide-react";

const reportCards = [
    {
        title: "7-Day Meal Plan (PDF)",
        description: "Download your weekly personalized AI meal plan.",
        icon: <Calendar size={26} className="text-emerald-600" />,
        action: "/reports/meal-plan"
    },
    {
        title: "Meal Log History",
        description: "View all logged meals and export them.",
        icon: <FileText size={26} className="text-blue-600" />,
        action: "/reports/meal-log"
    },
    {
        title: "Nutrition Summary",
        description: "Charts + insights based on your eating habits.",
        icon: <BarChart2 size={26} className="text-purple-600" />,
        action: "/reports/nutrition"
    },
];

const Reports: React.FC = () => {
    const navigate = useNavigate();
    const userEmail = auth.currentUser?.email;
    const isAdmin = userEmail === "admin@gmail.com";

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-6 space-y-6">
                
                {/* Page Heading */}
                <h1 className="text-3xl font-bold text-gray-800">User Reports & Analytics</h1>
                <p className="text-gray-500">Access your meal plans, nutrition summary, and more.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">

                    {/* 7-Day Meal Plan */}
                    <motion.div
                        onClick={async () => {
                            try {
                                const uid = auth.currentUser?.uid;
                                if (!uid) {
                                    alert("Please log in first!");
                                    return;
                                }

                                const res = await fetch(`http://localhost:5000/api/reports/meal-plan/${uid}`);
                                if (!res.ok) {
                                    alert("Failed to generate report");
                                    return;
                                }

                                const blob = await res.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "7-Day-Meal-Plan.pdf";
                                a.click();
                                window.URL.revokeObjectURL(url);
                            } catch (err) {
                                console.error("Download error:", err);
                                alert("Error generating report");
                            }
                        }}

                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer p-6 rounded-2xl text-white shadow-xl bg-emerald-500/70 backdrop-blur-lg border border-white/20 flex flex-col items-start space-y-3"
                    >
                        <CalendarIcon size={40} className="opacity-90" />
                        <h3 className="font-bold text-lg">7-Day Meal Plan</h3>
                        <p className="text-sm opacity-90">View & download weekly plan</p>
                    </motion.div>

                    {/* Meal Log Report */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate("/reports/meal-log")}
                        className="cursor-pointer p-6 rounded-2xl text-white shadow-xl bg-blue-500/70 backdrop-blur-lg border border-white/20 flex flex-col items-start space-y-3"
                    >
                        <HistoryIcon size={40} className="opacity-90" />
                        <h3 className="font-bold text-lg">Meal Log History</h3>
                        <p className="text-sm opacity-90">Track your logged meals</p>
                    </motion.div>

                    {/* Nutrition Summary */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        onClick={() => navigate("/reports/nutrition")}
                        className="cursor-pointer p-6 rounded-2xl text-white shadow-xl bg-purple-500/70 backdrop-blur-lg border border-white/20 flex flex-col items-start space-y-3"
                    >
                        <PieChartIcon size={40} className="opacity-90" />
                        <h3 className="font-bold text-lg">Nutrition Summary</h3>
                        <p className="text-sm opacity-90">View insights and charts</p>
                    </motion.div>

                    {/* Admin Analytics — Only for Admin */}
                    {isAdmin && (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigate("/reports/admin")}
                            className="cursor-pointer p-6 rounded-2xl text-white shadow-xl bg-red-500/70 backdrop-blur-lg border border-white/20 flex flex-col items-start space-y-3"
                        >
                            <ShieldAlertIcon size={40} className="opacity-90" />
                            <h3 className="font-bold text-lg">Admin System Analytics</h3>
                            <p className="text-sm opacity-90">System-wide statistics</p>
                        </motion.div>
                    )}

                </div>
            </div>
            {/* Glassmorphism Style */}
            <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(12px) saturate(130%);
        }
      `}</style>
        </Layout >
    );
};

export default Reports;
