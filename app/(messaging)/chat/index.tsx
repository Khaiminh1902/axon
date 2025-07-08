import { COLORS } from "@/constants/theme";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { api } from "../../../convex/_generated/api";

export default function Chat() {
  const { userId } = useAuth();
  const [text, setText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const messages = useQuery(api.messages.getMessages);
  const sendMessage = useMutation(api.messages.sendMessage);

  const handleSend = async () => {
    if (!text.trim() || !userId) return;
    await sendMessage({ text, sender: userId });
    setText("");

    // Scroll to end after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black", padding: 10 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages ?? []}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 4,
              alignSelf: item.sender === userId ? "flex-end" : "flex-start",
              backgroundColor:
                item.sender === userId ? COLORS.grey : COLORS.grey,
              borderRadius: 8,
              padding: 10,
              maxWidth: "75%",
            }}
          >
            <Text style={{ color: "white" }}>{item.text}</Text>
          </View>
        )}
      />

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
      >
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          value={text}
          onChangeText={setText}
          style={{
            flex: 1,
            backgroundColor: "#222",
            color: "white",
            borderRadius: 10,
            paddingHorizontal: 10,
            height: 44,
          }}
        />
        <TouchableOpacity onPress={handleSend} style={{ marginLeft: 10 }}>
          <Ionicons name="send" size={24} color={COLORS.grey} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
