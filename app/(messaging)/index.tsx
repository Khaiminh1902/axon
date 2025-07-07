import Loader from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Text, View } from "react-native";

export default function Index() {
  useAuth();
  const posts = useQuery(api.posts.getFeedPosts);

  if (posts === undefined) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AXON CHAT</Text>
        <View style={{ flexDirection: "row", gap: 14 }}>
          <View>
            <Ionicons name="search" size={24} color={COLORS.primary} />
          </View>
          <View>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={COLORS.primary}
            />
          </View>
        </View>
      </View>
      <View>
        <Text style={styles.chatTitle}>Chat</Text>
      </View>
    </View>
  );
}
