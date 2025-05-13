export const mockProfiles = [
  {
    id: "sched-001",
    bedId: "bed-001",
    daysOfWeek: "1,3,5",
    startTime: { hour: 8, minute: 0, second: 0, nano: 0 },
    requiredVolumeLiters: 5,
    isActive: true,
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sched-002",
    bedId: "bed-002",
    daysOfWeek: "2,4,6",
    startTime: { hour: 18, minute: 30, second: 0, nano: 0 },
    requiredVolumeLiters: 7,
    isActive: false,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
