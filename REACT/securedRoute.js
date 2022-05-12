import { lazy } from 'react';
const HostDash = lazy(() => import('../../src/components/host/HostDash'));
const PageNotFound = lazy(() => import('../pages/error/PageNotFound'));
const Attendance = lazy(() => import('../components/attendance/AttendanceDropdown'));

const dashboardRoutes = [
    {
        path: '/dashboard',
        name: 'Dashboards',
        icon: 'uil-home-alt',
        header: 'Navigation',
        children: [
            {
                path: '/dashboard/host',
                name: 'Host',
                element: HostDash,
                roles: ['Host'],
                exact: true,
                isAnonymous: false,
                children: [
                    {
                        path: '/dashboard/host/attendance',
                        name: 'Host',
                        element: Attendance,
                        roles: ['Host'],
                        exact: true,
                        isAnonymous: false,
                    },
                ],
            },
        ],
    },
];

const errorRoutes = [
    {
        path: '*',
        name: 'Error - 404',
        element: PageNotFound,
        roles: [],
        exact: true,
        isAnonymous: false,
    },
];

const allRoutes = [...dashboardRoutes, ...test, ...errorRoutes];

export default allRoutes;
