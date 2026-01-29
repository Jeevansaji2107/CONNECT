"use client";

import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { BarChart3, Users, TrendingUp, Zap, ArrowUpRight } from "lucide-react";

const engagementData = [
    { name: "Mon", likes: 400, comments: 240, reach: 2400 },
    { name: "Tue", likes: 300, comments: 139, reach: 2210 },
    { name: "Wed", likes: 200, comments: 980, reach: 2290 },
    { name: "Thu", likes: 278, comments: 390, reach: 2000 },
    { name: "Fri", likes: 189, comments: 480, reach: 2181 },
    { name: "Sat", likes: 239, comments: 380, reach: 2500 },
    { name: "Sun", likes: 349, comments: 430, reach: 2100 },
];

export default function AnalyticsPage() {
    return (
        <div className="space-y-12">
            <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Performance Insights</h1>
                <p className="text-muted font-medium">Detailed analytics for your and engagement activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={<Users className="w-5 h-5" />} label="Total Reach" value="24,812" change="+12.5%" />
                <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Engagement" value="4.2%" change="+0.8%" />
                <StatCard icon={<Zap className="w-5 h-5" />} label="AI Optimal" value="98%" change="Healthy" />
                <StatCard icon={<BarChart3 className="w-5 h-5" />} label="Followers" value="+128" change="+24.2%" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card-simple p-8 md:p-10"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                            <h2 className="text-xl font-bold">Engagement Trends</h2>
                            <p className="text-xs text-muted font-medium">Daily interaction volume</p>
                        </div>
                        <div className="flex space-x-4 text-xs font-bold uppercase tracking-wider">
                            <span className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded-full bg-primary" /> <span className="text-muted">Likes</span></span>
                            <span className="flex items-center space-x-2"><div className="w-2.5 h-2.5 rounded-full bg-primary/30" /> <span className="text-muted">Comments</span></span>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={engagementData}>
                                <defs>
                                    <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1a73e8" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#1a73e8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
                                <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="var(--muted)" fontSize={11} axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                                />
                                <Area type="monotone" dataKey="likes" stroke="var(--primary)" fillOpacity={1} fill="url(#colorLikes)" strokeWidth={4} />
                                <Area type="monotone" dataKey="comments" stroke="var(--primary)" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" opacity={0.3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="card-simple p-8 md:p-10"
                >
                    <div className="space-y-1 mb-8">
                        <h2 className="text-xl font-bold">Weekly Reach</h2>
                        <p className="text-xs text-muted font-medium">Growth across entire network</p>
                    </div>2.0
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={engagementData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
                                <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} axisLine={false} tickLine={false} dy={10} />
                                <YAxis stroke="var(--muted)" fontSize={11} axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)", borderRadius: "16px" }}
                                />
                                <Line type="monotone" dataKey="reach" stroke="var(--foreground)" strokeWidth={4} dot={{ r: 0 }} activeDot={{ r: 6, fill: "var(--primary)" }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="card-simple p-8 md:p-10 bg-primary/5 border-primary/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp className="w-32 h-32" />
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 text-center md:text-left">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-foreground">Content Advisor</h3>
                        <p className="text-sm text-muted font-medium max-w-lg leading-relaxed">
                            Connectivity analysis suggests posting between <span className="text-primary font-bold">7PM - 9PM</span> for maximum engagement today.
                        </p>
                    </div>
                    <button className="btn-primary flex items-center space-x-2">
                        <span>Get Full Report</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    change: string;
}

const StatCard = ({ icon, label, value, change }: StatCardProps) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="card-simple p-6 space-y-4"
    >
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
        </div>
        <div>
            <div className="text-[10px] text-muted font-bold uppercase tracking-widest mb-1">{label}</div>
            <div className="flex items-end justify-between">
                <div className="text-2xl font-extrabold text-foreground">{value}</div>
                <div className="text-xs text-primary font-bold">{change}</div>
            </div>
        </div>
    </motion.div>
);
