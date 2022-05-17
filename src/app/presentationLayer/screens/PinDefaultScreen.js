import React, { useState, useContext } from "react";
import {
	StyleSheet,
	View,
	Text,
	SafeAreaView,
	TouchableOpacity,
} from "react-native";

import COLORS from "../../config/stylesheet/colors";
import i18n from "../../config/translation";
import UserContext from "../../domainLayer/UserContext";

import { Rating } from "react-native-ratings";
import ImageCarousel from "../components/ImageCarousel";
import { Ionicons } from "@expo/vector-icons";

const PresentationCtrl = require("../PresentationCtrl.js");

function PinDefaultScreen({ navigation, route }) {
	let presentationCtrl = new PresentationCtrl();
	const [user] = useContext(UserContext);

	const { pin } = route.params;
	const saved = route.params;
	const [bookmark, setBookmark] = useState(
		saved ? "bookmark" : "bookmark-outline"
	);
	const handleSeeOnMap = () => {
		navigation.navigate("MapScreen", {
			latitude: pin.location.latitude,
			longitude: pin.location.longitude,
		});
	};

	const handleSave = () => {
		if (bookmark) {
			presentationCtrl.removeFromSaved(pin._id, user.email);
		} else {
			presentationCtrl.savePin(pin._id, user.email);
		}
		setBookmark(bookmark === "bookmark" ? "bookmark-outline" : "bookmark");
	};

	const handleShare = () => console.log("Share clicked");

	return (
		<SafeAreaView
			style={{
				flex: 1,
				flexDirection: "column",
				backgroundColor: COLORS.white,
			}}
		>
			<View
				style={[{ height: 200, borderBottomLeftRadius: 50 }, styles.shadow]}
			>
				<ImageCarousel media={pin.media} />
			</View>
			<View
				style={{
					flex: 1,
					marginTop: 25,
					marginHorizontal: 20,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						marginTop: 10,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<Text style={[styles.title, { flex: 1 }]}>{pin.title}</Text>
					<TouchableOpacity
						style={[
							{
								flexDirection: "row",
								backgroundColor: COLORS.green1,
								height: 45,
								alignItems: "center",
								borderRadius: 7,
								padding: 5,
							},
							styles.shadow,
						]}
						onPress={async () => {
							let data = await presentationCtrl.getDataStatistics(
								"24hours",
								pin.location.latitude,
								pin.location.longitude
							);
							navigation.navigate("Statistics", { data: data });
						}}
					>
						<Text
							style={{
								paddingHorizontal: 5,
								fontWeight: "bold",
								fontSize: 15,
								color: COLORS.white,
							}}
						>
							{i18n.t("seeStatistics")}
						</Text>
						<Ionicons
							name="bar-chart"
							style={{ alignSelf: "center" }}
							color={COLORS.white}
							size={25}
						/>
					</TouchableOpacity>
				</View>
				<Text
					style={[
						styles.body,
						{ marginTop: 10, alignSelf: "flex-start", flexShrink: 1 },
					]}
				>
					{pin.description}
				</Text>
				<View
					style={{
						flexDirection: "row",
						paddingVertical: 10,
						marginTop: 10,
					}}
				>
					<Ionicons
						name="location-sharp"
						size={30}
						style={{ alignSelf: "center" }}
						color={COLORS.secondary}
					/>
					<Text style={[styles.body, { marginStart: 10, flexShrink: 1 }]}>
						{pin.locationTitle}
					</Text>
				</View>
				<TouchableOpacity
					style={{
						alignSelf: "flex-start",
						paddingVertical: 10,
					}}
					onPress={handleSeeOnMap}
				>
					<Text style={styles.highlight}>{i18n.t("seeOnMap")}</Text>
				</TouchableOpacity>
				<View
					style={{
						flexDirection: "row",
						paddingVertical: 10,
						marginTop: 10,
					}}
				>
					<Ionicons name="md-calendar" color={COLORS.secondary} size={30} />
					<Text style={[styles.body, { marginStart: 10 }]}>{pin.date}</Text>
				</View>
				<Rating
					type={"custom"}
					imageSize={20}
					fractions={0}
					startingValue={pin.rating}
					ratingBackgroundColor={COLORS.secondary}
					ratingColor={COLORS.green1}
					tintColor={COLORS.white}
					readonly={true}
					style={{
						paddingVertical: 10,
						marginTop: 10,
						alignSelf: "flex-start",
					}}
				/>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginTop: 10,
					}}
				>
					<View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
						<TouchableOpacity
							style={{ flexDirection: "row" }}
							onPress={handleShare}
						>
							<Ionicons
								name="share-social-sharp"
								color={COLORS.secondary}
								size={35}
							/>
							<Text style={[styles.body, { marginStart: 10 }]}>
								{i18n.t("share")}
							</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						style={[
							{
								flexDirection: "row",
								backgroundColor: COLORS.blue2,
								height: 45,
								alignItems: "center",
								borderRadius: 7,
								padding: 5,
							},
							styles.shadow,
						]}
						onPress={handleSave}
					>
						<Text
							style={{
								paddingHorizontal: 5,
								fontWeight: "bold",
								fontSize: 15,
								color: COLORS.white,
							}}
						>
							{i18n.t("savePin")}
						</Text>
						<Ionicons
							name={bookmark}
							style={{ alignSelf: "center" }}
							color={COLORS.white}
							size={30}
						/>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	title: {
		fontSize: 20,
		fontWeight: "bold",
		alignSelf: "center",
		color: COLORS.secondary,
	},
	body: {
		alignSelf: "center",
		fontSize: 15,
		color: COLORS.secondary,
	},
	highlight: {
		fontSize: 15,
		fontWeight: "bold",
		color: COLORS.green1,
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
});

export default PinDefaultScreen;
