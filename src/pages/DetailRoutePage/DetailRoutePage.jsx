import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
	Button,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import CHEVRON from "../../assets/chevron-down.svg";
import CLOSE from "../../assets/close.svg";
import SEARCH from "../../assets/search.svg";
import ROUTE from "../../assets/taxi.svg";
import COLORS from "../../constant/color";

import { toast } from "react-toastify";
import CenteredModal from "../../components/CenteredModal/CenteredModal";
import RouteList from "../../components/RouteList/RouteList";
import useCreateRoute from "../../hooks/useCreateRoute";
import usePersistentState from "../../hooks/usePersistentState";
import useTouristRoute from "../../hooks/useTouristRoute";
import styles from "./DetailRoutePage.module.scss";
import useTourByRouteId from "../../hooks/useTourByRouteId";
import useRouteById from "../../hooks/useRouteById";

export default function DetailRoutePage() {
	const navigate = useNavigate();
	const {
		createRoute,
		data: createdData,
		error: createdError,
	} = useCreateRoute();

	const { id } = useParams();
	const {
		data: routeInformation,
		isError: isRouteInformationError,
		error: routeInformationError,
	} = useRouteById(id);

	const {
		data: tours,
		isError: isRetrieveTourError,
		error: retrieveTourError,
	} = useTourByRouteId(id);

	useEffect(() => {
		console.log({ tours, routeInformation });
	}, [id, tours, !routeInformation]);

	const searchRef = useRef();
	const [searchValue, setSearchValue] = usePersistentState(
		"tour-route-search",
		""
	);

	const [routeName, setRouteName] = useState("");
	const [reservationFee, setReservationFee] = useState(0);
	const [description, setDescription] = useState("");
	const [type, setType] = useState("");
	const [route, setRoute] = useState([]);

	const [isOpenCreateBox, setIsOpenCreateBox] = useState(false);

	const { data, isError, error } = useTouristRoute({
		route: [],
		keyword: searchValue,
	});

	useEffect(() => {
		if (isError) {
			toast(`An error occur when retrieve tourist route: ${error.message}`);
		}
	}, [isError]);

	useEffect(() => {
		if (createdError)
			toast.error(`Fail to create tourist route: ${createdError.message}`);
	}, [createdError]);

	useEffect(() => {
		if (createdData) toast.success("Successfully create route");
	}, [createdData]);

	function handleSubmit() {
		setIsOpenCreateBox(false);
		const data = {
			name: routeName,
			description,
			reservationFee,
			type,
			route: route.map(({ content }) => content),
		};
		createRoute(data);
	}

	return (
		<>
			<div className={styles.container}>
				<div>
					<h1>{routeInformation?.name}</h1>
					<p>{routeInformation?.description}</p>
					<p>
						Reservation fee:{" "}
						<span>{routeInformation?.reservationFee}</span>
					</p>
					<p>Route: {routeInformation?.route?.join(" - ")} </p>
				</div>
				<Button
					onClick={() => setIsOpenCreateBox(true)}
					variant="outlined"
					sx={{
						borderRadius: "8px",
						padding: "8px",
						width: "100%",
					}}
				>
					<p className={styles.create}>Create new tour</p>
				</Button>
				{/* <div className={styles.command}>
					<div className={styles.search}>
						<input
							ref={searchRef}
							onKeyDown={(e) => {
								if (e.key === "Enter")
									setSearchValue(searchRef.current.value);
							}}
							type="text"
							placeholder="Find tour by name..."
						/>
						<Button
							onClick={() => setSearchValue(searchRef.current.value)}
							variant="contained"
							sx={{
								backgroundColor: COLORS.primary,
								borderRadius: "8px",
								height: "40px",
								width: "200px",
							}}
						>
							<p>Search</p>
						</Button>
					</div>
					<div className={styles.filter}>
						{searchValue ? (
							<div className={styles.item}>
								<img src={SEARCH} alt="" />
								<p>{searchValue}</p>
								<img
									className={styles.close}
									onClick={() => {
										searchRef.current.value = "";
										setSearchValue("");
									}}
									src={CLOSE}
								/>
							</div>
						) : null}
						<div className={styles.item}>
							<img src={ROUTE} alt="" />
							<p>Filter route</p>
							<img className={styles.clickable} src={CHEVRON} alt="" />
						</div>
					</div>
				</div> */}
				<div className={styles.data}>
					<div className={styles.table}>
						<div className={styles.line}>
							<p>From</p>
							<p>To</p>
							<p>Type</p>
							<p>Customers</p>
						</div>
						{tours?.map?.(({ from, to, type }, index) => (
							<div key={index}>
								<hr />
								<div
									onClick={() => {
										navigate(_id);
									}}
									className={styles.line}
								>
									<p>
										{new Intl.DateTimeFormat("en-GB", {
											dateStyle: "full",
											timeStyle: "short",
											timeZone: "Australia/Sydney",
										}).format(new Date(from))}
									</p>
									<p>
										{new Intl.DateTimeFormat("en-GB", {
											dateStyle: "full",
											timeStyle: "short",
											timeZone: "Australia/Sydney",
										}).format(new Date(to))}
									</p>
									<p>{type}</p>
									<p>{0}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<CenteredModal
				isOpen={isOpenCreateBox}
				onClose={() => setIsOpenCreateBox(false)}
			>
				<div className={styles.createBox}>
					<h1>Create new tour</h1>
					<div className={styles.form}>
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker label="From" />
							<DatePicker label="To" />
						</LocalizationProvider>
						<FormControl sx={{ mt: 2, minWidth: 120 }}>
							<InputLabel id="demo-simple-select-helper-label">
								Type
							</InputLabel>
							<Select
								labelId="demo-simple-select-helper-label"
								id="demo-simple-select-helper"
								label="Age"
								value={type}
								onChange={(e) => setType(e.target.value)}
							>
								<MenuItem value={"country"}>Normal</MenuItem>
								<MenuItem value={"foreign"}>Promotion</MenuItem>
							</Select>
							<FormHelperText>Normal nè</FormHelperText>
							<FormHelperText>Promotion nè</FormHelperText>
						</FormControl>
					</div>
					<Button
						onClick={handleSubmit}
						variant="contained"
						sx={{
							backgroundColor: COLORS.primary,
							borderRadius: "8px",
							height: "40px",
							width: "100%",
						}}
					>
						<p className={styles.buttonText}>Submit</p>
					</Button>
				</div>
			</CenteredModal>
		</>
	);
}
