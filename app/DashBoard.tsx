import { createDrawerNavigator } from "@react-navigation/drawer";
import { DashBoardTag1 } from "@/screens";
import { View } from "react-native";

const Drawer = createDrawerNavigator();

const DashBoard = () => {
  return (
    <View>
      <Drawer.Navigator>
        <Drawer.Screen name="tab1" component={DashBoardTag1} />
      </Drawer.Navigator>
    </View>
  );
};

export default DashBoard;
