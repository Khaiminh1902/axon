import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type CommentProps = {
  comment: {
    _id: Id<"comments">;
    _creationTime: number;
    content: string;
    userId: Id<"users">;
    user: {
      fullname: string;
      image: string;
    };
  };
  onDelete: (commentId: Id<"comments">) => void;
  currentUserId?: Id<"users">;
};

export default function Comment({
  comment,
  onDelete,
  currentUserId,
}: CommentProps) {
  return (
    <View style={styles.commentContainer}>
      <Image
        source={{ uri: comment.user.image }}
        style={styles.commentAvatar}
      />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUsername}>{comment.user.fullname}</Text>
          {currentUserId === comment.userId && (
            <TouchableOpacity onPress={() => onDelete(comment._id)}>
              <Ionicons name="trash-outline" size={18} color="red" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.commentText}>{comment.content}</Text>
        <Text style={styles.commentTime}>
          {formatDistanceToNow(comment._creationTime, { addSuffix: true })}
        </Text>
      </View>
    </View>
  );
}
