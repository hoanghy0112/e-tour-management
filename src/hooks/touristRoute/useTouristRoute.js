import { useState } from 'react';
import useSocket from '../useSocket';

export default function useTouristRoute({ route, keyword }) {
    const [routes, setRoutes] = useState([]);
    const [error, setError] = useState(null);

    useSocket(
        (socket) => {
            socket.emit('view-company-route', { route, keyword });
            socket.on('company-route', (data) => {
                setRoutes(data.data);
            });
            socket.on('new-route', (data) => {
                setRoutes((prev) => [data.data, ...prev]);
            });
            socket.on('error', (error) => {
                setError(error);
            });
        },
        [route.join(''), keyword]
    );

    return { data: routes, isError: error !== null, error };
}
