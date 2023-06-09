import { useParams } from 'react-router-dom';
import { ReactComponent as EDIT_ICON } from '@/assets/edit.svg';
import { API_ENDPOINT } from '@/constant/api';
import COLORS from '@/constant/color';
import useTourById from '@/hooks/tour/useTourById';
import styles from './DetailTourPage.module.scss';
import ImageButton from '@/components/ImageButton/ImageButton';
import EditTourModal, { useEditTourModalState } from '@/components/EditTourModal/EditTourModal';
import moment from 'moment';
import PageTitle from '@/components/PageTitle/PageTitle';

import { ReactComponent as ADD_ICON } from '@/assets/add.svg';
import { ReactComponent as EXPAND_ICON } from '@/assets/expand.svg';
import useTourNotification from '@/hooks/notification/useTourNotification';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import EditNotificationModal, {
    useEditNotificationState,
} from '@/components/EditNotificationModal/EditNotificationModal';
import Loading from '@/components/Loading/Loading';
import useGetAPI from '@/hooks/useCallAPI';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function DetailTourPage() {
    const { id } = useParams();

    const { data: ticketList } = useGetAPI('filter-ticket', 'filter-ticket-result', { tourId: id });

    const { data, error } = useTourById(id);
    const { data: notifications } = useTourNotification(id);

    if (error?.status == '403')
        throw new Error('You do not have permission to view this tour', {
            cause: '403 - Forbidden',
        });

    const { modalState, openModal: openEditNotificationModal } = useEditNotificationState(id);

    const { modalState: editTourModalState, openModal } = useEditTourModalState(id);

    return data ? (
        <>
            <div className={styles.container}>
                <PageTitle>Tour detail</PageTitle>
                <div className={styles.header}>
                    {data?.image ? <img src={`${API_ENDPOINT.IMAGE}/${data.image}`} /> : <p></p>}
                    <p className={styles.title}>Tour name</p>
                    <h1 className={styles.tourName}>{data?.name}</h1>
                    <p>{moment(data?.from).format('h:mm:ss a, DD MMMM YYYY')}</p>
                    <p className={styles.title}>Description</p>
                    <p>{data?.description}</p>
                    <p className={styles.title}>Tour type</p>
                    <p>{data?.type} </p>
                    <ImageButton
                        onClick={() => openModal(data)}
                        backgroundColor={COLORS.lightEditBackground}
                        color={COLORS.editBackground}
                        icon={EDIT_ICON}
                        style={{
                            position: 'absolute',
                            top: 330,
                            right: 30,
                            padding: '20px 15px 20px 30px',
                        }}
                    >
                        {''}
                    </ImageButton>
                </div>
                <div className={styles.notification}>
                    <h1>Notification list</h1>
                    <ImageButton
                        icon={ADD_ICON}
                        color={COLORS.editBackground}
                        backgroundColor={COLORS.lightEditBackground}
                        onClick={() => openEditNotificationModal({})}
                        fullWidth
                    >
                        Add notification
                    </ImageButton>
                    <div className={styles['notification-list']}>
                        {notifications.map((notification) => (
                            <Accordion fullWidth>
                                <AccordionSummary
                                    expandIcon={<EXPAND_ICON />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        {notification?.title}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>
                                        {moment(notification?.createdAt).format(
                                            'DD MMMM YYYY, h:mm:ss a'
                                        )}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>{notification?.content}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>
                </div>
                <div className={styles.ticketList}>
                    <h1>Ticket list</h1>
                    <div>
                        {ticketList.map((ticket) => (
                            <Accordion fullWidth>
                                <AccordionSummary
                                    expandIcon={<EXPAND_ICON />}
                                    aria-controls="panel1bh-content"
                                    id="panel1bh-header"
                                >
                                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                        {ticket?.fullName}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }}>
                                        {moment(ticket?.createdAt).format(
                                            'DD MMMM YYYY, h:mm:ss a'
                                        )}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className={styles.ticketInfo}>
                                        <div className={styles.field}>
                                            <p className={styles.title}>Full name</p>
                                            <p className={styles.content}>{ticket?.fullName}</p>
                                        </div>
                                        <div className={styles.field}>
                                            <p className={styles.title}>Phone number</p>
                                            <p className={styles.content}>{ticket?.phoneNumber}</p>
                                        </div>
                                        <div className={styles.field}>
                                            <p className={styles.title}>Email</p>
                                            <p className={styles.content}>{ticket?.email}</p>
                                        </div>
                                        <div className={styles.field}>
                                            <p className={styles.title}>Special requirement</p>
                                            <p className={styles.content}>
                                                {ticket?.specialRequirement}
                                            </p>
                                        </div>
                                        <div className={styles.field}>
                                            <p className={styles.title}>Pickup location</p>
                                            <p className={styles.content}>
                                                {ticket?.pickupLocation}
                                            </p>
                                        </div>
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </div>
                </div>
            </div>
            <EditNotificationModal {...modalState} />
            <EditTourModal {...editTourModalState} />
        </>
    ) : (
        <Loading />
    );
}
