import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { setBasicInformation } from '@/features/staffSlice';
import useAuthenticationNavigate from '@/hooks/useAuthenticationNavigate';
import useStaffInformation from '@/hooks/useStaffInformation';

import LOGO from '@/assets/logo.svg';
import { ReactComponent as Route } from '@/assets/route.svg';
import { ReactComponent as Tour } from '@/assets/tour.svg';
import { ReactComponent as HOME } from '@/assets/home.svg';

import ENDPOINT from '@/constant/endponint';
import styles from './BasePage.module.scss';
import NavigationButton from '@/components/NavigationButton/NavigationButton';
import { setRoutes, setGetListTouristRouteError } from '@/features/touristRouteSlice';
import useTouristRoute from '@/hooks/touristRoute/useTouristRoute';
import { STATUS } from '@/constant/status';
import SocketContext from '@/contexts/SocketContext';
import useCallAPIToast from '@/hooks/useCallAPIToast';
import { isPathNameInNeedToAuthPage } from '@/constant/need-to-auth-page';
import useCompanyInformation from '@/hooks/useCompanyInformation';

export default function BasePage() {
    const location = useLocation();
    const { socket, setSocket } = useContext(SocketContext);
    const [status, setStatus] = useState(STATUS.PENDING);
    const navigate = useNavigate();
    useAuthenticationNavigate();

    const dispatch = useDispatch();
    const { data, isError, error } = useStaffInformation();
    const { data: companyData } = useCompanyInformation();

    useEffect(() => {
        if (data) dispatch(setBasicInformation(data));
    }, [data]);

    useEffect(() => {
        if (socket) setStatus(STATUS.SUCCESS);
    }, [socket]);

    // useCallAPIToast({
    // 	status,
    // 	message: {
    // 		pending: "Connecting...",
    // 		success: "Connect successfully",
    // 		fail: "Fail to connect to server",
    // 	},
    // });

    const { data: routes, error: routeError } = useTouristRoute({
        route: [],
        keyword: '',
    });
    useEffect(() => {
        dispatch(setRoutes(routes));
        dispatch(setGetListTouristRouteError({ error: routeError }));
    }, [routes, routeError]);

    return (
        <div className={styles.container}>
            {isPathNameInNeedToAuthPage(location.pathname) ||
            (companyData && !companyData.isApproveToActive) ? null : (
                <div className={styles.drawer}>
                    <button
                        type="button"
                        className={styles.logo}
                        onClick={() => navigate(ENDPOINT.HOME)}
                    >
                        <img src={LOGO} alt="" />
                    </button>
                    <div className={styles.navButtonGroup}>
                        <NavigationButton
                            onClick={() => navigate(ENDPOINT.HOME)}
                            isHighlighted={location.pathname == ENDPOINT.HOME}
                            icon={HOME}
                            style={{
                                width: '260px',
                                height: 'fit-content',
                                //   padding: '0.5rem 2rem',
                            }}
                        >
                            Home
                        </NavigationButton>
                        <NavigationButton
                            onClick={() => navigate(ENDPOINT.TOURIST_ROUTE)}
                            isHighlighted={location.pathname == ENDPOINT.TOURIST_ROUTE}
                            icon={Route}
                            style={{
                                width: '260px',
                                height: 'fit-content',
                                //   padding: '0.5rem 2rem',
                            }}
                        >
                            Tourist route
                        </NavigationButton>
                        <NavigationButton
                            onClick={() => navigate(ENDPOINT.TOUR)}
                            isHighlighted={location.pathname == ENDPOINT.TOUR}
                            icon={Tour}
                            style={{
                                width: '260px',
                                height: 'fit-content',
                                //   padding: '0.5rem 2rem',
                            }}
                        >
                            Tour
                        </NavigationButton>
                    </div>
                </div>
            )}
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}
