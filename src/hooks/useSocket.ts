import { useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

// import { API } from '@/constant/api';
import useAccessToken from './useAccessToken';
import { useSelector } from 'react-redux';
import { selectSocket, setSocket } from '@/features/appSlice';
import { useDispatch } from 'react-redux';
import SocketContext from '@/contexts/SocketContext';
import { STATUS } from '@/constant/status';
import useCallAPIToast from './useCallAPIToast';
import { API } from '@/constant/api';

export default function useSocket(onConnect: (socket: Socket) => void, dependencies) {
    const token = useAccessToken();
    const { socket, setSocket } = useContext(SocketContext);

    useEffect(() => {
        if (socket && socket.connected) return;
        let socket_: Socket;
        if (!token) return;
        socket_ = io(`${API.base}`, {
            path: '/socket',
            query: {
                type: 'staff',
                token,
            },
        });

        socket_.on('connect', () => {
            setSocket((prev) => {
                if (prev) {
                    socket_.disconnect();
                    return prev;
                } else return socket_;
            });
        });
    }, [token, socket, ...(dependencies || [])]);

    useEffect(() => {
        if (socket) onConnect?.(socket);
    }, [!!socket, ...(dependencies || [])]);

    return socket;
}
