import moment from "moment";

export const TOURIST_ROUTE_COLUMN = [
	{
		field: "_id",
		headerName: "ID",
		width: 250,
	},
	{
		field: "name",
		headerName: "Tourist route name",
		width: 300,
	},
	{
		field: "type",
		headerName: "Type",
		width: 120,
	},
	{
		field: "reservationFee",
		headerName: "Reservation Fee",
		width: 150,
	},
	{
		field: "route",
		headerName: "Route",
		valueGetter: (param) => param.row.route.join(" - "),
		width: 250,
	},
	{
		field: "createdAt",
		headerName: "Created at",
		width: 280,
		valueGetter: (param) =>
			moment(param.row.createdAt).format("DD MMMM YYYY, h:mm:ss a"),
	},
];