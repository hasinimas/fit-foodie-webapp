// src/pages/AdminReports.tsx
import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { BarChart2, Users, Calendar, Eye, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

type MonthlyItem = { month: string; count: number };
type UserInfo = {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastLogged: string;    // formatted string (may be fallback to created)
  creationDate: string;  // formatted string
};

const AdminReports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ totalUsers: number; totalSummaries: number; avg: number }>({
    totalUsers: 0,
    totalSummaries: 0,
    avg: 0,
  });
  const [monthlyUsage, setMonthlyUsage] = useState<MonthlyItem[]>([]);
  const [userInfos, setUserInfos] = useState<UserInfo[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Helper: robust parse -> Date | null
  const parseToDate = (v: any): Date | null => {
    if (!v && v !== 0) return null;
    try {
      // Firestore Timestamp with .seconds
      if (typeof v === "object" && v !== null) {
        if (typeof v.seconds === "number") return new Date(v.seconds * 1000);
        if (typeof v.toDate === "function") {
          const d = v.toDate();
          if (d instanceof Date && !isNaN(d.getTime())) return d;
        }
      }
      // numeric unix millis or seconds
      if (typeof v === "number") {
        // heuristics: > 1e12 => millis; else seconds
        if (v > 1e12) return new Date(v);
        return new Date(v * 1000);
      }
      // string
      if (typeof v === "string") {
        const d = new Date(v);
        if (!isNaN(d.getTime())) return d;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // Format date to "YYYY-MM-DD HH:mm" (24-hour)
  const format24 = (d: Date | null): string => {
    if (!d || isNaN(d.getTime())) return "";
    const YYYY = d.getFullYear();
    const MM = String(d.getMonth() + 1).padStart(2, "0");
    const DD = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${YYYY}-${MM}-${DD} ${hh}:${mm}`;
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const users = usersSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const userData: UserInfo[] = [];
        const monthly: Record<string, number> = {};
        let totalSummaries = 0;

        // Loop users sequentially (Firestore calls per-user) - kept simple and robust
        for (const u of users) {
          const uid: string = u.id;
          const rawCreated = (u as any).createdAt ?? (u as any).creationDate ?? (u as any).created; // try common keys
          const createdDateObj = parseToDate(rawCreated);
          const creationDateStr = createdDateObj ? format24(createdDateObj) : "";

          // lastLogged from user doc fields if present
          const rawLastLogged = (u as any).lastLoggedIn ?? (u as any).lastLogin ?? (u as any).lastLogged;
          const lastLoggedFromDoc = parseToDate(rawLastLogged);

          // fetch dailySummaries for fallback & monthly tally
          const sumsSnap = await getDocs(collection(db, `users/${uid}/dailySummaries`));
          const sums = sumsSnap.docs.map((d) => d.data());
          // compute latest summary date for lastLogged fallback
          let latestSummaryDate: Date | null = null;
          for (const s of sums) {
            const sDateRaw = s.date ?? s.dateString ?? s.createdAt ?? s.created; // common possibilities
            const sd = parseToDate(sDateRaw);
            if (sd && (!latestSummaryDate || sd.getTime() > latestSummaryDate.getTime())) {
              latestSummaryDate = sd;
            }
            // monthly count
            if (sd) {
              const monthLabel = sd.toLocaleString("default", { month: "short", year: "numeric" });
              monthly[monthLabel] = (monthly[monthLabel] || 0) + 1;
            }
          }

          const userSummaryCount = sums.length;
          totalSummaries += userSummaryCount;

          // Determine final lastLogged value:
          // priority: doc field -> latestSummaryDate -> createdDate
          const finalLastLoggedDate =
            lastLoggedFromDoc ?? latestSummaryDate ?? createdDateObj ?? null;
          const finalLastLoggedStr = finalLastLoggedDate ? format24(finalLastLoggedDate) : "";

          // firstName mapping
          const firstName = (u as any).firstName ?? (u as any).displayName ?? (u as any).name ?? null;

          userData.push({
            uid,
            email: (u as any).email ?? null,
            firstName,
            lastLogged: finalLastLoggedStr,
            creationDate: creationDateStr || "",
          });
        }

        const totalUsers = users.length;
        const avg = totalUsers ? Number((totalSummaries / totalUsers).toFixed(1)) : 0;

        setStats({ totalUsers, totalSummaries, avg });
        setMonthlyUsage(
          Object.entries(monthly)
            .map(([month, count]) => ({ month, count }))
            .sort((a, b) => {
              // sort by parsed month-year; fallback to string compare
              const da = new Date(a.month);
              const db = new Date(b.month);
              return isNaN(da.getTime()) ? a.month.localeCompare(b.month) : da.getTime() - db.getTime();
            })
        );
        setUserInfos(userData);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- CSV export ----------
  const exportCSV = () => {
    try {
      Swal.fire({ title: "Generating CSV...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      const rows: string[] = [];
      rows.push(["UID", "Email", "FirstName", "LastLogged", "Creation"].join(","));
      userInfos.forEach((u) =>
        rows.push(
          [
            `"${u.uid}"`,
            `"${u.email ?? ""}"`,
            `"${u.firstName ?? ""}"`,
            `"${u.lastLogged ?? ""}"`,
            `"${u.creationDate ?? ""}"`,
          ].join(",")
        )
      );

      const csvString = rows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `admin-users-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      Swal.close();
      Swal.fire({ icon: "success", title: "CSV downloaded", timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error("CSV export error:", err);
      Swal.fire("Error", "CSV export failed", "error");
    }
  };

  // ---------- PDF export ----------
  const exportPDF = () => {
    try {
      Swal.fire({ title: "Generating PDF...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
      const margin = 36;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("FitFoodie — User Accounts Report", doc.internal.pageSize.getWidth() / 2, margin, { align: "center" });

      (autoTable as any)(doc, {
        startY: margin + 14,
        head: [["UID", "Email", "FirstName", "LastLogged", "Creation"]],
        body: userInfos.map((u) => [u.uid, u.email ?? "", u.firstName ?? "", u.lastLogged ?? "", u.creationDate ?? ""]),
        styles: { font: "helvetica", fontSize: 9, cellPadding: 4 },
        headStyles: { fillColor: [6, 95, 70], textColor: 255 },
        theme: "striped",
        margin: { left: margin, right: margin },
      });

      doc.save(`admin-users-${new Date().toISOString().slice(0, 10)}.pdf`);
      Swal.close();
      Swal.fire({ icon: "success", title: "PDF downloaded", timer: 1500, showConfirmButton: false });
    } catch (err) {
      console.error("PDF export error:", err);
      Swal.fire("Error", "PDF export failed", "error");
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        {/* header + controls */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Reports & Analytics</h1>
            <p className="text-gray-500">Account info — UID, Email, Name, Last activity, Created date</p>
          </div>    

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-sky-300 text-white font-medium hover:scale-105 transition"
            >
              <Eye className="inline mr-2" size={18} />
              View Report
            </button>

            <button
              onClick={exportCSV}
              className="px-4 py-2 rounded-lg bg-orange-500 text-white font-medium hover:scale-105 transition"
            >
              Export CSV
            </button>

            <button
              onClick={exportPDF}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium hover:scale-105 transition"
            >
              Export PDF
            </button>
          </div>
        </div>

        {/* three stat cards */}
        <div className="grid sm:grid-cols-3 gap-6">
                            <motion.div whileHover={{ scale: 1.02 }} className="p-5 bg-emerald-100 rounded-xl shadow-md text-center">
                                <Users size={36} className="mx-auto text-emerald-700 mb-2" />
                                <p className="text-green-500 text-xl font-semibold">Total Users</p>
                                <h3 className="text-xl font-bold">{stats.totalUsers}</h3>                                
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }} className="p-5 bg-blue-100 rounded-xl shadow-md text-center">
                                <BarChart2 size={36} className="mx-auto text-blue-700 mb-2" />
                                <p className="text-blue-500 text-xl font-semibold">Total Daily Summaries</p>
                                <h3 className="text-xl font-bold">{stats.totalSummaries}</h3>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }} className="p-5 bg-purple-100 rounded-xl shadow-md text-center">
                                <Calendar size={36} className="mx-auto text-purple-700 mb-2" />
                                <p className="text-purple-700 text-xl font-semibold">Avg Entries per User</p>
                                <h3 className="text-xl font-bold">{stats.avg}</h3>
                            </motion.div>
        </div>
        <br></br>
        <br></br>
        {/* table */}
        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-hidden border">
            <h2 className="px-6 py-3 bg-gray-50 font-semibold text-gray-700 border-b">User Accounts</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-emerald-50 text-emerald-700">
                  <tr>
                    <th className="py-3 px-4 border-b">UID</th>
                    <th className="py-3 px-4 border-b">Email</th>
                    <th className="py-3 px-4 border-b">First Name</th>
                    <th className="py-3 px-4 border-b">Last Logged</th>
                    <th className="py-3 px-4 border-b">Created</th>
                  </tr>
                </thead>

                <tbody>
                  {userInfos.length ? (
                    userInfos.map((u) => (
                      <tr key={u.uid} className="hover:bg-emerald-50 border-b">
                        <td className="py-3 px-4">{u.uid}</td>
                        <td className="py-3 px-4">{u.email}</td>
                        <td className="py-3 px-4">{u.firstName}</td>
                        <td className="py-3 px-4">{u.lastLogged}</td>
                        <td className="py-3 px-4">{u.creationDate}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-xl font-semibold text-emerald-700">User Report Preview</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-600 hover:text-red-600">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 max-h-[70vh] overflow-y-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-emerald-100 text-emerald-700">
                    <tr>
                      <th className="py-2 px-3 border-b">UID</th>
                      <th className="py-2 px-3 border-b">Email</th>
                      <th className="py-2 px-3 border-b">First Name</th>
                      <th className="py-2 px-3 border-b">Last Logged</th>
                      <th className="py-2 px-3 border-b">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userInfos.map((u) => (
                      <tr key={u.uid} className="border-b hover:bg-emerald-50">
                        <td className="py-2 px-3">{u.uid}</td>
                        <td className="py-2 px-3">{u.email}</td>
                        <td className="py-2 px-3">{u.firstName}</td>
                        <td className="py-2 px-3">{u.lastLogged}</td>
                        <td className="py-2 px-3">{u.creationDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3 p-4 border-t">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-gray-200">
                  Close
                </button>
                <button
                  onClick={() => {
                    exportPDF();
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
                >
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminReports;
