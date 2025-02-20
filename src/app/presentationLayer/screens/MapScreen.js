import React, { useState, useRef, useEffect, useContext } from "react";

import {
	Text,
	StyleSheet,
	View,
	SafeAreaView,
	TouchableOpacity,
	Pressable,
	Image,
} from "react-native";

import COLORS from "../../config/stylesheet/colors";
import PinPreview from "../components/PinPreview";
import i18n from "../../config/translation";
import UserContext from "../../domainLayer/UserContext";
import {
	Ionicons,
	MaterialIcons,
	MaterialCommunityIcons,
	AntDesign,
} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import CustomToast from "../components/CustomToast";
import Modal from "react-native-modal";
import * as Animatable from "react-native-animatable";

import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker, Heatmap, PROVIDER_GOOGLE } from "react-native-maps";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

import * as Location from "expo-location";
//import {toggle} from "yarn/lib/cli";

//import customPin from 'https://i.ibb.co/vXZrNbB/A.png';

const PresentationCtrl = require("../PresentationCtrl.js");

async function callGeocodeAPI(latitude, longitude) {
	const location = await fetch(
		`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&sensor=true&key=AIzaSyDdWVzzuo-fZWsgpyc8t2TykdvvtfBfR9c`
	);
	if (!location.ok) return "";
	const result = await location.json();
	return result.results[0].formatted_address;
}

/**
 * Map screen, with all its components
 * @param {navigation} [ parameter to navigate to the other screens or controllers ]
 * @param {route} [ route to navigate to the other screens or controllers ]
 */
function MapScreen({ navigation, route }) {
	let presentationCtrl = new PresentationCtrl();
	const { latitude, longitude } = route.params;
	const toast = route.params.toast;

	const [modalPinVisible, setModalPinVisible] = useState(false);
	const [modalFilterVisible, setModalFilterVisible] = useState(false);
	const [pinsShown, setPinsShown] = useState(true);
	const [pinPreview, setPinPreview] = useState(false);
	const [pins, setPins] = useState([]);
	const [houses, setHouses] = useState([]);
	const [housesByCertificate, setHousesByCertificate] = useState([]);
	const [byCertificate, setByCertificate] = useState(false);
	const [multiSliderValue, setMultiSliderValue] = useState([0, 2]);
	const [markers, setMarkers] = useState([]);
	const [selected, setSelected] = useState(null);
	const [dangerOffset, setDangerOffset] = useState(0);
	const [dangerMessage, setDangerMessage] = useState("");
	const [pollutionLevel, setPollutionLevel] = useState(0);

	/**
	 * Function to set a default region
	 * @param {latitude} [ parameter to set a default latitude ]
	 * @param {longitude} [ parameter to set a default longitude ]
	 * @param {latitudeDelta} [ parameter to set a max distance to the central point in terms of latitude ]
	 * @param {longitudeDelta} [ parameter to set a max distance to the central point in terms of longitude ]
	 */
	const [region, setRegion] = useState({
		latitude: 41.366531,
		longitude: 2.019336,
		latitudeDelta: 0.3,
		longitudeDelta: 1.5,
	});

	/**
	 * Function to set a default hetpoint
	 * @param {latitude} [ parameter to set a default latitude ]
	 * @param {longitude} [ parameter to set a default longitude ]
	 * @param {weight} [  ]
	 */
	const [heatpoints, setHeatpoints] = useState([
		{
			latitude: 41.366531,
			longitude: 2.019336,
			weight: 0,
		},
	]);
	const [Calculating, toggleCalculating] = useState(true);

	const [actualMarker, setActualMarker] = useState({
		latitude: 41.366531,
		longitude: 2.019336,
		title: "inexistente",
	});

	const [user] = useContext(UserContext);
	const [savedPins, setSavedPins] = useState([]);
	const [lastZoom, setLastZoom] = useState(0);
	const [lastCoords, setCoords] = useState({
		latitude: 0,
		longitude: 0,
	});

	const showToast = (message, type) => {
		Toast.show({
			position: "bottom",
			type: type,
			text1: message,
		});
	};

	const fetchHouses = (values) => {
		let letter = ["A", "B", "C", "D", "E", "F", "G"];
		getHouses(letter[values[0]], letter[values[1]]);
	};

	const multiSliderValuesChange = (values) => {
		setByCertificate(true);
		setMultiSliderValue(values);
		fetchHouses(values);
	};

	// S'executa a cada rerender
	useEffect(async () => {
		calculateDangerLevel();
		if (toast) {
			showToast(i18n.t("pinCreateSuccess"), "successToast");
			navigation.setParams({ toast: false });
		}
		if (latitude !== null && longitude !== null) {
			const tmpLocation = {
				latitude: latitude,
				longitude: longitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01,
			};
			navigation.setParams({
				latitude: null,
				longitude: null,
			});
			mapRef.current.animateToRegion(tmpLocation, 2.5 * 1000);
		}

		//console.log(camera);
		if (!Calculating) {
			toggleCalculating(true);
			const camera = await mapRef.current.getCamera();
			const cz = Math.round(camera.zoom);
			//console.log(camera.zoom);
			const cords = {
				latitude: camera.center.latitude,
				longitude: camera.center.longitude,
			};
			//console.log(lastCoords, cords)
			if (
				cz !== lastZoom ||
				(cz >= 9 &&
					lastCoords.latitude !== cords.latitude &&
					lastCoords.longitude !== cords.longitude)
			) {
				let aux = await presentationCtrl.getHeatPoints(cz, camera);
				setHeatpoints(aux);
				setLastZoom(cz);
				setCoords(cords);
			}
			toggleCalculating(false);
		}
	});

	/*
	useEffect(() => {
	}, [savedPins]);
	*/

	// onMount (només s'executa una vegada, al carregar la '	vista')
	useEffect(async () => {
		const unsubscribe = navigation.addListener("focus", async () => {
			const fetchTrendingPins = async () => {
				const data = await presentationCtrl.fetchTrendingPins(user.email);
				setPins(data);
				let fetchedMarkers = [];
				for (let marker of Object.keys(data)) {
					fetchedMarkers.push({
						latitude: data[marker].latitude,
						longitude: data[marker].longitude,
					});
				}
				setMarkers(fetchedMarkers);
			};
			const fetchPins = async () => {
				const data = await presentationCtrl.fetchPins(user.email);
				let tmp = [];
				data.savedPins.forEach((item) => {
					tmp.push(item._id);
				});
				setSavedPins(tmp);
			};
			await fetchTrendingPins();
			await fetchPins();
		});
		await presentationCtrl.initMeasureStations();
		toggleCalculating(false);
		return unsubscribe;
	}, [navigation]);

	useEffect(() => {
		const unsubscribe = navigation.addListener("tabPress", async (e) => {
			// add your business logic here
			const fetchPins = async () => {
				const data = await presentationCtrl.fetchPins(user.email);
				let tmp = [];
				data.savedPins.forEach((item) => {
					tmp.push(item._id);
				});
				setSavedPins(tmp);
			};

			await fetchPins();
		});
		// Unsubscribe to event listener when component unmount
		return () => unsubscribe();
	}, [navigation]);

	const isSavedPin = (pin) => {
		return savedPins.includes(pin);
	};

	const onMapPress = React.useCallback((e) => {
		//e.persist()
		navigation.navigate("CreatePin", {
			coords: {
				latitude: actualMarker.latitude,
				longitude: actualMarker.longitude,
				title: actualMarker.title,
			},
		});
		//falta condicionar això perq només passi quan realment es crea un pin
		setModalPinVisible(!modalPinVisible);
	});

	const onModal = async (event) => {
		event.persist();
		const latitude = event.nativeEvent.coordinate.latitude;
		const longitude = event.nativeEvent.coordinate.longitude;
		let level = await presentationCtrl.getPollutionLevelLastHour(
			latitude,
			longitude
		);
		setPollutionLevel(level);
		const title = await callGeocodeAPI(latitude, longitude);
		setActualMarker({
			latitude,
			longitude,
			title,
		});
		setModalPinVisible(true);
	};

	/**
	 * Function to set a reference point of the map
	 */
	const mapRef = useRef(null);

	let housesImgages = [
		"https://i.ibb.co/yShfsG6/A.png",
		"https://i.ibb.co/sJtSG9v/B.png",
		"https://i.ibb.co/fQJTpFL/C.png",
		"https://i.ibb.co/D7nt50T/D.png",
		"https://i.ibb.co/BPWjqC4/E.png",
		"https://i.ibb.co/GTdNLQ8/F.png",
		"https://i.ibb.co/CmWbn9f/G.png",
	];

	const onMapLoad = React.useCallback((map) => {
		mapRef.current = map;
	});

	/**
	 * Function to go with zoom in, to the requested location
	 * @param {lat} [ parameter to recive a latitude ]
	 * @param {lng} [ parameter to recive a longitude ]
	 */
	const panTo = React.useCallback(({ lat, lng }) => {
		const location = {
			latitude: lat,
			longitude: lng,
			latitudeDelta: 0.01,
			longitudeDelta: 0.01,
		};
		mapRef.current.animateToRegion(location, 2.5 * 1000);
	}, []);

	const handleSave = () => {
		if (isSavedPin(selected._id)) {
			presentationCtrl.unsavePin(selected._id, user.email);
			let tmp = savedPins.filter((item) => item !== selected._id);
			setSavedPins(tmp);
			showToast(i18n.t("pinUnsaveSuccess"), "pinFailureToast");
		} else {
			presentationCtrl.savePin(selected._id, user.email);
			setSavedPins((savedPins) => [...savedPins, selected._id]);
			showToast(i18n.t("pinSaveSuccess"), "pinSuccessToast");
		}
	};

	const getHouses = async (range1, range2) => {
		//const fetchHouses = async () => {
		const energyMap = await presentationCtrl.getQualifationMap(range1, range2);
		setHouses(energyMap);
		let fetchedHouses = [];
		for (let house of Object.keys(energyMap)) {
			fetchedHouses.push({
				latitude: energyMap[house].latitud,
				longitude: energyMap[house].longitud,
				value: energyMap[house].value,
			});
		}
		setHousesByCertificate(fetchedHouses);
	};

	const calculateDangerLevel = () => {
		if (user.healthStatus[0]) {
			if (user.healthStatus[1]) {
				setDangerOffset(100);
				setDangerMessage(i18n.t("recommended5"));
			} else if (user.healthStatus[2]) {
				setDangerOffset(80);
				setDangerMessage(i18n.t("recommended4"));
			} else {
				setDangerOffset(60);
				setDangerMessage(i18n.t("recommended3"));
			}
		} else if (user.healthStatus[1]) {
			setDangerOffset(80);
			setDangerMessage(i18n.t("recommended4"));
		} else if (user.healthStatus[2]) {
			setDangerOffset(40);
			setDangerMessage(i18n.t("recommended2"));
		} else {
			setDangerOffset(20);
			setDangerMessage(i18n.t("recommended1"));
		}
	};

	function renderHeader(user) {
		return (
			<View
				style={[
					{
						height: 70,
						width: "100%",
						paddingHorizontal: 20,
						alignItems: "center",
						justifyContent: "space-between",
						flexDirection: "row",
						backgroundColor: COLORS.green1,
						borderBottomLeftRadius: 20,
						borderBottomRightRadius: 20,
					},
					styles.shadow,
				]}
			>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							navigation.navigate("Profile", { toast: true });
						}}
						style={[styles.shadow, { borderRadius: 30 }]}
					>
						<Image
							source={{ uri: user.profilePicture }}
							style={[{ borderRadius: 30, width: 40, height: 40 }]}
						></Image>
					</TouchableOpacity>
					<View
						style={{
							flexDirection: "column",
							marginStart: 15,
						}}
					>
						<Text
							style={[
								{
									fontSize: 20,
									fontWeight: "bold",
									color: COLORS.white,
								},
							]}
						>
							{user.name}
						</Text>
						<Text
							style={[
								{
									fontSize: 18,
									fontWeight: "normal",
									color: COLORS.white,
								},
							]}
						>
							{i18n.t("welcome")}
						</Text>
					</View>
				</View>
				<TouchableOpacity
					activeOpacity={0.8}
					style={[
						{
							backgroundColor: COLORS.white,
							padding: 5,
							borderRadius: 12,
							alignSelf: "center",
							justifyContent: "flex-end",
						},
						styles.shadow,
					]}
					onPress={() => {
						navigation.navigate("RankingScreen", { scroll: true });
					}}
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<View
							style={{
								width: 25,
								height: 25,
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 20,
								backgroundColor: COLORS.lightGrey,
							}}
						>
							<AntDesign name="Trophy" size={18} color={COLORS.secondary} />
						</View>
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	/**
	 *
	 */
	function renderFilter() {
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalFilterVisible}
				onRequestClose={() => {
					setModalFilterVisible(false);
				}}
				onBackdropPress={() => {
					setModalFilterVisible(false);
				}}
			>
				<View style={styles.centeredView}>
					<View style={[styles.modalView, styles.shadow]}>
						<Text
							style={[
								styles.modalText,
								{ fontWeight: "bold", alignSelf: "center", fontSize: 17 },
							]}
						>
							{i18n.t("filter")}
						</Text>
						<View
							style={{
								flexDirection: "column",
								marginTop: 5,
							}}
						>
							<Pressable
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
								onPress={() => {
									setPinsShown(!pinsShown);
								}}
							>
								<View
									activeOpacity={0.8}
									style={{
										backgroundColor: COLORS.green1,
										borderRadius: 10,
										padding: 5,
										margin: 5,
										alignItems: "center",
									}}
								>
									<AntDesign
										name={pinsShown ? "pushpin" : "pushpino"}
										size={22}
										color={COLORS.white}
									/>
								</View>
								<Text style={styles.subtitle}>{i18n.t("showPins")}</Text>
							</Pressable>
							<Pressable
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginTop: 10,
								}}
								onPress={() => {
									if (!byCertificate) {
										fetchHouses(multiSliderValue);
									}
									setByCertificate(!byCertificate);
								}}
							>
								<View
									style={{
										backgroundColor: COLORS.green1,
										borderRadius: 10,
										padding: 5,
										margin: 5,
										alignItems: "center",
									}}
								>
									<Ionicons
										name={byCertificate ? "home" : "home-outline"}
										size={22}
										color={COLORS.white}
									/>
								</View>
								<Text style={styles.subtitle}>{i18n.t("showHouses")}</Text>
							</Pressable>
							<Text style={[styles.subtitle2, { marginTop: 10 }]}>
								{i18n.t("filterByCertificate")}
							</Text>
							<View style={{ flexDirection: "row", alignSelf: "center" }}>
								<Text
									style={[
										styles.subtitle2,
										{ margin: 10, marginHorizontal: 15 },
									]}
								>
									A
								</Text>
								<MultiSlider
									sliderLength={100}
									onValuesChange={multiSliderValuesChange}
									min={0}
									max={6}
									step={1}
									snapped
									showSteps
									values={[multiSliderValue[0], multiSliderValue[1]]}
									allowOverlap={true}
									//enableLabel
									//customLabel={CustomLabel}
									stepLabelStyle={{
										color: "blue",
									}}
									markerStyle={{
										backgroundColor: COLORS.green1,
										borderRadius: 5,
										height: 13,
										width: 13,
										bottom: -3,
									}}
									stepLabel={{
										backgroundColor: "red",
										height: 20,
										width: 20,
										fontSize: 10,
									}}
									pressedMarkerStyle={{
										height: 10,
										width: 10,
										borderRadius: 5,
									}}
									selectedStyle={{
										backgroundColor: COLORS.green1,
									}}
									unselectedStyle={{
										backgroundColor: COLORS.secondary,
									}}
									containerStyle={{
										height: 40,
									}}
									trackStyle={{
										height: 5,
										borderRadius: 2,
									}}
								></MultiSlider>
								<Text
									style={[
										styles.subtitle2,
										{ margin: 10, marginHorizontal: 15 },
									]}
								>
									G
								</Text>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		);
	}

	function renderPinPreview() {
		return (
			<Modal
				visible={pinPreview}
				animationType="fade"
				transparent={true}
				onRequestClose={() => {
					setPinPreview(false);
				}}
				onBackdropPress={() => {
					setPinPreview(false);
				}}
			>
				<View
					style={{
						justifyContent: "center",
						alignSelf: "center",
					}}
				>
					<Pressable
						onPress={() => {
							navigation.navigate("DefaultPin", {
								pin: selected,
								saved: isSavedPin(selected._id),
							});
							setPinPreview(false);
						}}
					>
						<PinPreview item={selected}></PinPreview>
						<Animatable.View
							animation="pulse"
							duration={1000}
							style={{
								height: 30,
								flexDirection: "row",
								backgroundColor: COLORS.secondary,
								borderBottomEndRadius: 10,
								borderBottomStartRadius: 10,
							}}
						>
							<TouchableOpacity
								style={{
									flex: 1,
									flexDirection: "row",
									backgroundColor: isSavedPin(selected._id)
										? COLORS.green1
										: COLORS.secondary,
									justifyContent: "space-evenly",
									borderRadius: 10,
									alignItems: "center",
								}}
								onPress={handleSave}
							>
								<Text style={styles.containerTxt}>
									{isSavedPin(selected._id)
										? i18n.t("savePin")
										: i18n.t("unsavePin")}
								</Text>
							</TouchableOpacity>
						</Animatable.View>
					</Pressable>
				</View>
			</Modal>
		);
	}

	function renderPinCreate() {
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalPinVisible}
				onRequestClose={() => {
					setModalPinVisible(false);
				}}
				onBackdropPress={() => {
					setModalPinVisible(false);
				}}
			>
				<View style={styles.centeredView}>
					<View style={[styles.modalView, styles.shadow]}>
						<Text style={[styles.modalText, { fontWeight: "bold" }]}>
							{i18n.t("selectedLocation")}
						</Text>
						<Text style={styles.highlight}> {actualMarker.title}</Text>
						<View style={{ flexDirection: "column", marginTop: 10 }}>
							<TouchableOpacity
								activeOpacity={0.8}
								style={{
									flexDirection: "row",
									margin: 5,
									alignItems: "center",
								}}
								onPress={onMapPress}
							>
								<AntDesign name="pushpino" size={35} color={COLORS.secondary} />
								<Text style={[styles.subtitle, { marginStart: 5 }]}>
									{i18n.t("createPin")}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								activeOpacity={0.8}
								style={{
									flexDirection: "row",
									margin: 5,
									alignItems: "center",
								}}
								onPress={() => {
									setModalPinVisible(!modalPinVisible);
									navigation.navigate("Statistics", {
										coords: {
											latitude: actualMarker.latitude,
											longitude: actualMarker.latitude,
										},
									});
								}}
							>
								<MaterialIcons
									name="scatter-plot"
									color={COLORS.secondary}
									size={35}
								/>
								<Text style={[styles.subtitle, { marginStart: 5 }]}>
									{i18n.t("seeStatistics")}
								</Text>
							</TouchableOpacity>
							<View
								style={{
									marginTop: 20,
									flexDirection: "row",
									alignSelf: "flex-start",
									right: pollutionLevel * -10,
								}}
							>
								<Text style={styles.subtitle2}>Actual</Text>
							</View>
							<View
								style={{
									marginTop: 10,
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<LinearGradient
									flex={1}
									colors={[
										"green",
										"yellow",
										"orange",
										"red",
										"purple",
										"brown",
									]}
									start={{ x: 0, y: 0.5 }}
									end={{ x: 1, y: 1 }}
									style={{ borderRadius: 5 }}
								>
									<View
										style={{
											backgroundColor: COLORS.secondary,
											alignSelf: "flex-start",
											height: 15,
											top: -3,
											borderRadius: 20,
											width: 5,
											right: pollutionLevel * -20,
										}}
									/>
									<View
										style={{
											backgroundColor: COLORS.secondary,
											alignSelf: "flex-start",
											height: 15,
											bottom: -3,
											borderRadius: 20,
											width: 5,
											left: dangerOffset,
										}}
									/>
								</LinearGradient>
							</View>
							<View
								style={{
									alignSelf: "flex-start",
									marginTop: 5,
									left: dangerOffset - 10,
								}}
							>
								<Text style={styles.subtitle2}>{dangerMessage}</Text>
							</View>
						</View>
					</View>
				</View>
			</Modal>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, alignItems: "center" }}>
			<View
				style={{
					marginTop: 55,
					...StyleSheet.absoluteFillObject,
				}}
			>
				<MapView
					ref={mapRef}
					provider={PROVIDER_GOOGLE}
					style={{ ...StyleSheet.absoluteFillObject }}
					initialRegion={{
						latitude: 41.366531,
						longitude: 2.019336,
						latitudeDelta: 0.3,
						longitudeDelta: 1.5,
					}}
					onRegionChangeComplete={(region) => setRegion(region)}
					onPress={onModal}
					showsCompass={false}
					onLoad={onMapLoad}
				>
					{pinsShown &&
						markers.map((marker, idx) => (
							<Marker
								key={idx}
								coordinate={{
									latitude: marker.latitude,
									longitude: marker.longitude,
								}}
								onPress={() => {
									setPinPreview(true);
									setSelected(pins[idx]);
								}}
							/>
						))}

					{byCertificate &&
						housesByCertificate.map((house, idx2) => (
							<Marker
								key={idx2}
								coordinate={{
									latitude: parseFloat(house.latitude),
									longitude: parseFloat(house.longitude),
								}}
							>
								<Image
									source={{ uri: housesImgages[house.value] }}
									style={[{ borderRadius: 0, width: 40, height: 40 }]}
								></Image>
							</Marker>
						))}

					<Heatmap
						points={heatpoints}
						radius={50}
						opacity={0.6}
						gradient={{
							colors: ["green", "yellow", "orange", "red", "purple"],
							startPoints: [0.01, 0.25, 0.5, 0.75, 0.9],
							colorMapSize: 500,
						}}
					/>
				</MapView>
			</View>
			{renderHeader(user)}
			<View
				style={{
					alignSelf: "flex-end",
					flexDirection: "column",
					justifyContent: "space-between",
					marginVertical: 25,
					marginEnd: 15,
					flex: 1,
				}}
			>
				<View style={[styles.container, styles.shadow]}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							setModalFilterVisible(true);
						}}
					>
						<MaterialCommunityIcons
							name="filter-menu"
							color={COLORS.secondary}
							size={35}
						/>
					</TouchableOpacity>
				</View>
				<View style={[styles.container, styles.shadow, { marginBottom: 70 }]}>
					<TouchableOpacity
						activeOpacity={0.8}
						onPress={() => {
							Location.installWebGeolocationPolyfill();
							navigator.geolocation.getCurrentPosition((position) => {
								panTo({
									lat: position.coords.latitude,
									lng: position.coords.longitude,
								});
							});
						}}
					>
						<MaterialCommunityIcons
							name="compass"
							color={COLORS.secondary}
							size={35}
						/>
					</TouchableOpacity>
				</View>
			</View>
			{pinPreview && renderPinPreview()}
			{renderPinCreate()}
			{renderFilter()}
			<CustomToast />
		</SafeAreaView>
	);
}
/**
 * Function to define all the styles needed in this screen
 */
const styles = StyleSheet.create({
	container: {
		backgroundColor: COLORS.white,
		width: 50,
		height: 50,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	body: {
		fontSize: 15,
		marginStart: 10,
		color: COLORS.darkGrey,
	},
	highlight: {
		marginTop: 5,
		fontSize: 13,
		color: COLORS.green1,
		textAlign: "center",
	},
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		width: "80%",
	},
	modalView: {
		margin: 20,
		backgroundColor: COLORS.white,
		borderRadius: 15,
		padding: 15,
		alignItems: "center",
	},
	textStyle: {
		color: COLORS.white,
		fontWeight: "bold",
		fontSize: 15,
		textAlign: "center",
	},
	subtitle: {
		color: COLORS.secondary,
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
		padding: 5,
	},
	subtitle2: {
		fontSize: 14,
		fontWeight: "bold",
		color: COLORS.secondary,
		textAlign: "center",
	},
	modalText: {
		textAlign: "center",
		fontSize: 16,
	},
	shadow: {
		shadowColor: COLORS.black,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	btn: {
		justifyContent: "center",
		borderRadius: 5,
		borderBottomWidth: 5,
		width: 100,
		height: 50,
		borderBottomColor: COLORS.darkGrey,
		backgroundColor: COLORS.secondary,
	},
	containerTxt: {
		fontSize: 15,
		color: COLORS.white,
		fontWeight: "bold",
	},
});

export default MapScreen;
