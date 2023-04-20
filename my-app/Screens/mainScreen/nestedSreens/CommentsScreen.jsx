import React from "react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { db } from "../../../firebase/config";
import { collection, addDoc, onSnapshot, query } from "firebase/firestore";

import { AntDesign } from "@expo/vector-icons";

import formatDate from "../../../utils/formatDate";

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
  Platform,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";

const CommentScreen = ({ route, navigation }) => {
  const [comment, setComment] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [commentsArr, setCommentsArr] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);

  const { postID, photo } = route.params;
  const { login } = useSelector((state) => state.auth);

  const keyboardHide = () => {
    Keyboard.dismiss();
    setIsShowKeyboard(false);
  };

  const createComment = async () => {
    const date = formatDate(new Date());
    const commentsRef = collection(db, `posts/${postID}/comments`);
    await addDoc(commentsRef, { comment, login, date });
    setComment("");
  };

  const getAllComments = async () => {
    const commentsQuery = query(collection(db, `posts/${postID}/comments`));
    onSnapshot(commentsQuery, (data) => {
      const commentsData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCommentsArr(commentsData);
      setCommentsCount(commentsData.length);
    });
  };

  useEffect(() => {
    getAllComments();
  }, []);

  useEffect(() => {
    console.log('commentsCount in comments', commentsCount);
    navigation.setParams({ commentsCount: commentsCount });
  }, [commentsCount]);

  return (
    <View style={styles.container}>
      {!isShowKeyboard && (
        <View style={styles.photoWrapper}>
          <Image
            source={{ uri: photo }}
            style={{ width: "100%", height: "100%", borderRadius: 8 }}
          />
        </View>
      )}
      <SafeAreaView style={styles.SafeAreaView}>
        <FlatList
          data={commentsArr}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.commentWrapper}>
              <Text style={styles.comments}>{item.comment}</Text>
              <Text style={styles.commentDate}>{item.date}</Text>
            </View>
          )}
        />
      </SafeAreaView>

      <View style={styles.inputWrapper}>
        <TextInput
          placeholderTextColor="#BDBDBD"
          placeholder="Write a comment..."
          onChangeText={(value) => setComment(value)}
          style={styles.input}
          value={comment}
          onBlur={keyboardHide}
          onFocus={() => setIsShowKeyboard(true)}
        />
        <TouchableOpacity onPress={createComment} style={styles.btnWrap}>
          <AntDesign name="arrowup" size={24} color="#ffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  photoWrapper: {
    marginTop: 32,
    marginBottom: 20,
    marginHorizontal: 16,
    borderRadius: 8,
    height: 240,
  },

  inputWrapper: {
    backgroundColor: "#E8E8E8",
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    left: 16,
    right: 16,
    bottom: 16,
    height: 50,
    borderRadius: 100,
    paddingHorizontal: 16,
  },

  btnWrap: {
    backgroundColor: "#FF6C00",
    width: 34,
    height: 34,
    borderRadius: 17,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  commentWrapper: {
    marginBottom: 12,
    marginTop: 12,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 6,
  },

  comments: {
    color: "#212121",
    fontSize: 13,
    lineHeight: 18,
  },
  commentDate: {
    color: "#bdbdbd",
    fontSize: 10,
    lineHeight: 12,
    textAlign: "right",
  },
});