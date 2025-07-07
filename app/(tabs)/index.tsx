import Loader from "@/components/Loader";
import Post from "@/components/Post";
import StoriesSection from "@/components/Stories";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { Link } from "expo-router";
import { useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";

export default function Index() {
  useAuth();
  const posts = useQuery(api.posts.getFeedPosts);
  const [refreshing, setRefreshing] = useState(false);

  if (posts === undefined) return <Loader />;
  if (posts.length === 0) return <NoPostsFound />;

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AXON</Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Link href={`/(messaging)`} asChild>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={COLORS.primary}
            />
          </Link>
        </View>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={<StoriesSection />}
      />
    </View>
  );
}

const NoPostsFound = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
  </View>
);
