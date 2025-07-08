import Loader from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Menu, Provider } from "react-native-paper";

export default function Index() {
  const router = useRouter();
  useAuth();
  const posts = useQuery(api.posts.getFeedPosts);
  const [menuVisible, setMenuVisible] = useState(false);
  const [anchorCoords, setAnchorCoords] = useState({ x: 0, y: 0 });

  const onDotsPress = (event: {
    nativeEvent: { pageX: number; pageY: number };
  }) => {
    const { pageX, pageY } = event.nativeEvent;
    setAnchorCoords({ x: pageX, y: pageY });
    setMenuVisible(true);
  };

  if (posts === undefined) return <Loader />;

  return (
    <Provider>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AXON CHAT</Text>
          <View style={{ flexDirection: "row", gap: 14 }}>
            <Ionicons name="search" size={24} color={COLORS.primary} />
            <TouchableOpacity onPress={onDotsPress}>
              <Ionicons
                name="ellipsis-vertical"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Custom Dropdown Menu */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={{ x: anchorCoords.x, y: anchorCoords.y }}
          contentStyle={{
            backgroundColor: "black",
            borderWidth: 1,
            borderColor: COLORS.primary,
            width: 140,
            paddingVertical: 0,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setMenuVisible(false);
              router.back();
            }}
            style={{
              paddingVertical: 13,
              paddingHorizontal: 16,
              backgroundColor: "transparent",
            }}
            activeOpacity={0.6}
          >
            <Text
              style={{ color: COLORS.primary, fontSize: 14, fontWeight: "600" }}
            >
              Go back
            </Text>
          </TouchableOpacity>
        </Menu>

        {/* Main Content */}
        <View>
          <Text style={styles.chatTitle}>Chat</Text>
        </View>
      </View>
    </Provider>
  );
}
