import Loader from "@/components/Loader";
import PostForOthers from "@/components/PostForOthers";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function Profile() {
  const { signOut, userId } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );
  const [editedProfile, setEditedProfile] = useState({
    fullname: "",
    username: "",
    bio: "",
    image: "",
  });

  useEffect(() => {
    if (currentUser) {
      setEditedProfile({
        fullname: currentUser.fullname || "",
        username: currentUser.username || "",
        bio: currentUser.bio || "",
        image: currentUser.image || "",
      });
    }
  }, [currentUser]);

  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);
  const posts = useQuery(api.posts.getPostsByUser, {});
  const updateProfile = useMutation(api.users.updateProfile);

  const handleSaveProfile = async () => {
    await updateProfile(editedProfile);
    setIsEditModalVisible(false);
  };

  if (!currentUser || posts === undefined) return <Loader />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser.username}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => signOut()}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        ListHeaderComponent={
          <View style={styles.profileInfo}>
            <View style={styles.avatarAndStats}>
              <View style={styles.avatarContainer}>
                <Image
                  source={currentUser.image}
                  style={styles.avatar}
                  contentFit="cover"
                  transition={200}
                />
              </View>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{currentUser.posts}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{currentUser.followers}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{currentUser.following}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>
            <Text style={styles.name}>{currentUser.fullname}</Text>
            {currentUser.bio && (
              <Text style={styles.bio}>{currentUser.bio}</Text>
            )}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditModalVisible(true)}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton}>
                <Ionicons
                  name="person-add-outline"
                  size={20}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={<NoPostsFound />}
        data={posts}
        renderItem={({ item }) => <PostForOthers post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      />

      <Modal
        visible={!!selectedPost}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedPost(null)}
      >
        <View style={styles.modalBackdrop}>
          {selectedPost && (
            <View style={styles.postDetailContainer}>
              <View style={styles.postDetailHeader}>
                <TouchableOpacity onPress={() => setSelectedPost(null)}>
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <Image
                source={selectedPost.imageUrl}
                cachePolicy={"memory-disk"}
                style={styles.postDetailImage}
              />
            </View>
          )}
        </View>
      </Modal>

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
              <Text style={styles.changeText}>Profile Picture</Text>
              <TouchableOpacity style={styles.imagePicker}>
                <Image
                  source={editedProfile.image}
                  style={styles.imagePickerImage}
                  contentFit="cover"
                />
              </TouchableOpacity>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name </Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.fullname}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, fullname: text }))
                  }
                  placeholderTextColor={COLORS.grey}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username </Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.username}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, username: text }))
                  }
                  placeholderTextColor={COLORS.grey}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={editedProfile.bio}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, bio: text }))
                  }
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={COLORS.grey}
                />
              </View>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

function NoPostsFound() {
  return (
    <View style={{ paddingVertical: 40, alignItems: "center" }}>
      <Ionicons name="images-outline" size={48} color={COLORS.grey} />
      <Text
        style={{
          fontSize: 20,
          color: COLORS.grey,
          paddingTop: 5,
          fontWeight: "600",
        }}
      >
        No posts yet
      </Text>
    </View>
  );
}
