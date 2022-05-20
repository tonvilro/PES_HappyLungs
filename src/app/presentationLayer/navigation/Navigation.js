import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	createStackNavigator,
	TransitionPresets,
} from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import "react-native-gesture-handler";

//screens
import MapScreen from "../screens/MapScreen";
import GeneralChatScreen from "../screens/GeneralChatScreen";
import ChatConversation from "../screens/ChatConversation";
import NewChatScreen from "../screens/NewChatScreen";
import PinsScreen from "../screens/PinsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileEditScreen from "../screens/ProfileEditScreen";
import SettingsScreen from "../screens/SettingsScreen";
import StatisticsScreen from "../screens/StatisticsScreen";
import CreatePinScreen from "../screens/CreatePinScreen";
import PinOwnerScreen from "../screens/PinOwnerScreen";
import PinEditScreen from "../screens/PinEditScreen";
import RankingScreen from "../screens/RankingScreen";
import PinDefaultScreen from "../screens/PinDefaultScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import TermsAndConditionsScreen from "../screens/TermsAndConditionsScreen";
import COLORS from "../../config/stylesheet/colors";
import i18n from "../../config/translation";
import { UserContextProvider } from "../../domainLayer/UserContext";
import { TouchableOpacity } from "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

function RootStack() {
	return (
		<Stack.Navigator
			initialRouteName="SignInScreen"
			screenOptions={{
				tabBarActiveTintColor: COLORS.green1,
				tabBarInactiveTintColor: COLORS.secondary,
				tabBarShowLabel: false,
				headerTintColor: COLORS.secondary,
				headerTitleAlign: "center",
				headerTitleStyle: {
					fontWeight: "bold",
					fontSize: 27,
				},
				headerShown: false,
			}}
		>
			<Stack.Screen name="SignInScreen" component={SignInScreen} />
			<Stack.Screen name="SignUpScreen" component={SignUpScreen} />
			<Stack.Screen
				name="TermsAndConditionsScreen"
				component={TermsAndConditionsScreen}
			/>
			<Stack.Screen name="AppTabs" component={AppTabs} />
		</Stack.Navigator>
	);
}

function PinStack() {
	return (
		<Stack.Navigator
			initialRouteName="PinsScreen"
			screenOptions={{
				tabBarActiveTintColor: COLORS.green1,
				tabBarInactiveTintColor: COLORS.secondary,
				tabBarShowLabel: false,
				headerTintColor: COLORS.secondary,
				headerTitleAlign: "center",
				headerTitleStyle: {
					fontWeight: "bold",
					fontSize: 27,
				},
				headerShown: true,
			}}
		>
			<Stack.Screen
				name="PinsScreen"
				component={PinsScreen}
				options={{
					title: i18n.t("myPins"),
					headerShown: true,
					headerLeft: null,
					headerTintColor: COLORS.white,
					headerStyle: {
						shadowColor: "transparent",
						backgroundColor: COLORS.green1,
					},
				}}
			/>
			<Stack.Screen name="Statistics" component={StatisticsScreen} />
			<Stack.Screen
				name="DefaultPin"
				component={PinDefaultScreen}
				options={{
					title: "",
					headerStyle: {
						backgroundColor: COLORS.green1,
					},
					headerTintColor: COLORS.white,
					...TransitionPresets.SlideFromRightIOS,
				}}
			/>
			<Stack.Screen
				name="OwnerPin"
				component={PinOwnerScreen}
				options={({ navigation, route }) => ({
					title: "",
					headerShown: true,
					headerTintColor: COLORS.white,
					headerStyle: {
						backgroundColor: COLORS.green1,
					},
					headerRight: () => (
						<TouchableOpacity
							activeOpacity={0.8}
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginHorizontal: 30,
							}}
							onPress={() => {
								navigation.navigate("EditPinScreen", { pin: route.params.pin });
							}}
						>
							<Text
								style={{
									fontWeight: "bold",
									marginEnd: 10,
									fontSize: 15,
									color: COLORS.white,
								}}
							>
								{i18n.t("edit").toUpperCase()}
							</Text>
							<Feather name="edit-3" size={30} color={COLORS.white} />
						</TouchableOpacity>
					),

					...TransitionPresets.SlideFromRightIOS,
				})}
			/>
			<Stack.Screen
				name="EditPinScreen"
				component={PinEditScreen}
				options={{
					title: i18n.t("editingPin"),
					headerTintColor: COLORS.white,
					headerStyle: {
						backgroundColor: COLORS.green1,
					},
					...TransitionPresets.SlideFromRightIOS,
				}}
			/>
		</Stack.Navigator>
	);
}

function ProfileStack() {
	return (
		<Stack.Navigator
			initialRouteName="ProfileScreen"
			screenOptions={{
				tabBarActiveTintColor: COLORS.green1,
				tabBarInactiveTintColor: COLORS.secondary,
				tabBarShowLabel: false,
				headerTintColor: COLORS.secondary,
				headerTitleAlign: "center",
				headerTitleStyle: {
					fontWeight: "bold",
					fontSize: 27,
				},
				headerShown: true,
			}}
		>
			<Stack.Screen
				name="ProfileScreen"
				component={ProfileScreen}
				options={({ navigation }) => ({
					title: "",
					headerShown: true,
					headerRight: () => (
						<TouchableOpacity
							activeOpacity={0.8}
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginHorizontal: 30,
							}}
							onPress={() => {
								navigation.navigate("ProfileEditScreen");
							}}
						>
							<Text
								style={{
									fontWeight: "bold",
									marginEnd: 10,
									fontSize: 15,
									color: COLORS.white,
								}}
							>
								{i18n.t("edit").toUpperCase()}
							</Text>
							<Feather name="edit-3" size={30} color={COLORS.white} />
						</TouchableOpacity>
					),
					headerLeft: null,
					headerStyle: {
						elevation: 5,
						shadowColor: COLORS.black,
						shadowOffset: {
							width: 0,
							height: 2,
						},
						shadowOpacity: 0.25,
						shadowRadius: 4,
						shadowColor: "black",
						backgroundColor: COLORS.green1,
					},
				})}
			/>
			<Stack.Screen
				name="ProfileEditScreen"
				component={ProfileEditScreen}
				options={{
					title: i18n.t("editingProfile"),
					headerTintColor: COLORS.white,
					headerStyle: {
						backgroundColor: COLORS.green1,
					},
					...TransitionPresets.SlideFromRightIOS,
					gestureEnabled: true,
					gestureDirection: "horizontal",
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="SettingsScreen"
				component={SettingsScreen}
				options={{
					title: i18n.t("settings"),
					headerTintColor: COLORS.white,
					headerStyle: {
						backgroundColor: COLORS.green1,
					},
					...TransitionPresets.SlideFromRightIOS,
					gestureEnabled: true,
					gestureDirection: "horizontal",
					headerShown: true,
				}}
			/>
			<Stack.Screen
				name="RankingScreen"
				component={RankingScreen}
				options={{
					title: i18n.t("ranking"),
					headerTintColor: COLORS.white,
					headerStyle: {
						backgroundColor: COLORS.green1,
					},
					...TransitionPresets.SlideFromRightIOS,
					gestureEnabled: true,
					gestureDirection: "horizontal",
					headerShown: true,
				}}
			/>
		</Stack.Navigator>
	);
}

function ChatStack() {
	return (
		<Stack.Navigator
			initialRouteName="ChatScreen"
			screenOptions={{
				tabBarActiveTintColor: COLORS.green1,
				tabBarInactiveTintColor: COLORS.secondary,
				tabBarShowLabel: false,
				headerTintColor: COLORS.secondary,
				headerTitleAlign: "center",
				headerTitleStyle: {
					fontWeight: "bold",
					fontSize: 27,
				},
				headerShown: true,
			}}
		>
			<Stack.Screen
				name="ChatScreen"
				component={GeneralChatScreen}
				options={{
					title: i18n.t("chat"),
					headerShown: true,
					headerLeft: null,
					headerTintColor: COLORS.white,
					headerStyle: {
						shadowColor: "transparent",
						backgroundColor: COLORS.green1,
					},
				}}
			/>
			<Stack.Screen
				name="ChatConversation"
				component={ChatConversation}
				options={{
					headerShown: false,
				}}
			/>
			<Stack.Screen
				name="NewChat"
				component={NewChatScreen}
				options={{
					title: i18n.t("newChat"),
					headerTintColor: COLORS.white,
					headerStyle: {
						backgroundColor: COLORS.green1,
					},
					...TransitionPresets.SlideFromRightIOS,
					gestureEnabled: true,
					gestureDirection: "horizontal",
					headerShown: true,
				}}
			/>
		</Stack.Navigator>
	);
}

function MapStack() {
	return (
		<Stack.Navigator
			initialRouteName="MapScreen"
			screenOptions={{
				tabBarActiveTintColor: COLORS.green1,
				tabBarInactiveTintColor: COLORS.secondary,
				tabBarShowLabel: false,
				headerTintColor: COLORS.secondary,
				headerTitleAlign: "center",
				headerTitleStyle: {
					fontWeight: "bold",
					fontSize: 27,
				},
				headerShown: true,
			}}
		>
			<Stack.Screen
				name="MapScreen"
				component={MapScreen}
				options={{
					headerShown: false,
				}}
				initialParams={{ latitude: null, longitude: null }}
			/>
			<Stack.Screen name="Statistics" component={StatisticsScreen} />
			<Stack.Screen
				name="CreatePin"
				component={CreatePinScreen}
				options={{
					headerStyle: {
						backgroundColor: COLORS.green1,
					},
					headerTintColor: COLORS.white,
					title: i18n.t("createPin"),
					gestureEnabled: true,
					gestureDirection: "horizontal",
					...TransitionPresets.SlideFromRightIOS,
				}}
			/>
			<Stack.Screen
				name="DefaultPin"
				component={PinDefaultScreen}
				options={{
					title: "",
					headerShown: false,
					headerStyle: {
						backgroundColor: COLORS.green1,
					},
					headerTintColor: COLORS.white,

					...TransitionPresets.SlideFromRightIOS,
				}}
			/>
			<Stack.Screen
				name="OwnerPin"
				component={PinOwnerScreen}
				options={({ navigation }) => ({
					title: "",
					headerShown: true,
					headerTintColor: COLORS.white,
					headerStyle: {
						backgroundColor: COLORS.green1,
					},
					headerRight: () => (
						<TouchableOpacity
							activeOpacity={0.8}
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginHorizontal: 30,
							}}
							onPress={() => {
								navigation.navigate("EditPinScreen");
							}}
						>
							<Text
								style={{
									fontWeight: "bold",
									marginEnd: 10,
									fontSize: 15,
									color: COLORS.white,
								}}
							>
								{i18n.t("edit").toUpperCase()}
							</Text>
							<Feather name="edit-3" size={30} color={COLORS.white} />
						</TouchableOpacity>
					),
					headerLeft: null,
					...TransitionPresets.SlideFromRightIOS,
				})}
			/>
			<Stack.Screen
				name="EditPinScreen"
				component={PinEditScreen}
				options={{
					title: i18n.t("editingPin"),
					headerTintColor: COLORS.white,
					headerStyle: {
						backgroundColor: COLORS.green1,
					},
					...TransitionPresets.SlideFromRightIOS,
				}}
			/>
			<Stack.Screen
				name="RankingScreen"
				component={RankingScreen}
				options={{
					title: i18n.t("ranking"),
					headerTintColor: COLORS.white,
					headerStyle: {
						backgroundColor: COLORS.green1,
					},
					...TransitionPresets.SlideFromRightIOS,
					gestureEnabled: true,
					gestureDirection: "horizontal",
					headerShown: true,
				}}
			/>
		</Stack.Navigator>
	);
}

function AppTabs() {
	return (
		<Tab.Navigator
			initialRouteName="Map"
			backBehavior="initialRoute"
			screenOptions={{
				tabBarActiveTintColor: COLORS.green1,
				tabBarInactiveTintColor: COLORS.secondary,
				tabBarShowLabel: false,
				headerTintColor: COLORS.secondary,
				headerTitleAlign: "center",
				headerTitleStyle: {
					fontWeight: "bold",
					fontSize: 27,
				},
				headerShown: true,
			}}
		>
			<Tab.Screen
				name="Chat"
				component={ChatStack}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="chatbubble-outline" size={size} color={color} />
					),
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="Pins"
				component={PinStack}
				options={{
					tabBarIcon: ({ color, size }) => (
						<AntDesign name="pushpino" size={size} color={color} />
					),
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="Map"
				component={MapStack}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Feather name="map" size={size} color={color} />
					),
					title: "Map",
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="Profile"
				component={ProfileStack}
				options={{
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-outline" size={size} color={color} />
					),
					//title: "Profile",
					headerShown: false,
				}}

				//header username
			/>
		</Tab.Navigator>
	);
}

export default function Navigation() {
	//const [user, setUser] = useState(null);

	//const value = useMemo(() => ({ user, setUser }), [user, setUser]);

	return (
		<NavigationContainer>
			<UserContextProvider>
				<RootStack />
			</UserContextProvider>
		</NavigationContainer>
	);
}
