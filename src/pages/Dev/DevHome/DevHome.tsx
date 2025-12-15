// DevHome.tsx
import React, { useState } from 'react';
import { Calendar, Clock, PartyPopper } from 'lucide-react';
import './DevHome.css';

interface EmploymentWidgetData {
    totalDays: number;
    remainingDays: number;
    joinDate: string;
}

const DevHome: React.FC = () => {
    const [employmentData] = useState<EmploymentWidgetData>({
        totalDays: 360,
        remainingDays: 45,
        joinDate: '2023-01-15'
    });

    return (
        <div className="main-content p-6">
            <div className="dev-home space-y-6">
                <div className="welcome-section">
                    <h1 className="welcome-title text-2xl font-bold">Welcome Back, Developer</h1>
                    <p className="welcome-subtitle text-gray-500">Here's your dashboard overview</p>
                </div>

                <div className="widgets-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Employment Duration Widget */}
                    <div className="glass-widget employment-widget p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                        <div className="widget-header flex justify-between items-center mb-4">
                            <h2 className="widget-title font-semibold">Employment Duration</h2>
                            <Calendar className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="employment-content">
                            <div className="days-display mb-2">
                                <span className="days-count text-3xl font-bold">{employmentData.totalDays}</span>
                                <span className="days-label text-gray-500 ml-2">Days</span>
                            </div>
                            <div className="employment-details text-sm space-y-1">
                                <p className="detail-item flex justify-between">
                                    <span className="detail-label text-gray-500">Join Date:</span>
                                    <span className="detail-value">{employmentData.joinDate}</span>
                                </p>
                                <p className="detail-item flex justify-between">
                                    <span className="detail-label text-gray-500">Days Remaining:</span>
                                    <span className="detail-value highlight text-blue-600 font-medium">{employmentData.remainingDays} days</span>
                                </p>
                                <div className="progress-bar mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="progress-fill h-full bg-blue-500"
                                        style={{ width: `${(employmentData.totalDays / 365) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Widget */}
                    <div className="glass-widget activity-widget p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                        <div className="widget-header flex justify-between items-center mb-4">
                            <h2 className="widget-title font-semibold">Recent Activity</h2>
                            <Clock className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="activity-list space-y-3">
                            <div className="activity-item flex gap-3">
                                <div className="activity-icon text-green-500">✓</div>
                                <div className="activity-content">
                                    <p className="activity-text text-sm font-medium">Completed project milestone</p>
                                    <p className="activity-time text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <div className="activity-item flex gap-3">
                                <div className="activity-icon text-blue-500">📁</div>
                                <div className="activity-content">
                                    <p className="activity-text text-sm font-medium">Submitted weekly report</p>
                                    <p className="activity-time text-xs text-gray-500">Yesterday</p>
                                </div>
                            </div>
                            <div className="activity-item flex gap-3">
                                <div className="activity-icon text-orange-500">🎯</div>
                                <div className="activity-content">
                                    <p className="activity-text text-sm font-medium">Achieved performance target</p>
                                    <p className="activity-time text-xs text-gray-500">3 days ago</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Holidays Widget */}
                    <div className="glass-widget holidays-widget p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                        <div className="widget-header flex justify-between items-center mb-4">
                            <h2 className="widget-title font-semibold">Upcoming Holidays</h2>
                            <PartyPopper className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="holidays-list space-y-3">
                            <div className="holiday-item flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                <div className="holiday-date font-bold text-gray-700">Dec 25</div>
                                <div className="holiday-name text-sm text-gray-600">Christmas Day</div>
                            </div>
                            <div className="holiday-item flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                <div className="holiday-date font-bold text-gray-700">Jan 1</div>
                                <div className="holiday-name text-sm text-gray-600">New Year's Day</div>
                            </div>
                            <div className="holiday-item flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                <div className="holiday-date font-bold text-gray-700">Jan 26</div>
                                <div className="holiday-name text-sm text-gray-600">Republic Day</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DevHome;