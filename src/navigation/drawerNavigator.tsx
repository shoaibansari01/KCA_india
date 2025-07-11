import { createDrawerNavigator } from "@react-navigation/drawer";
import DrawerScreen from "../views/drawerScreen/drawerScreen";
import BottomTabNavigator from "./bottomNavigationStack";

const Drawer = createDrawerNavigator()
const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{ drawerPosition: "left" }}
            drawerType="back"
            drawerPosition="left"
            initialRouteName="BottomTabNavigator"
            drawerContent={(props) => <DrawerScreen {...props} />}>
            <Drawer.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{ headerShown: false }} />
        </Drawer.Navigator>
    )
}
export default DrawerNavigator  