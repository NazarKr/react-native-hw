import React from "react";
import { useState, useEffect } from "react";

import { onSnapshot, collection, getDocs } from "firebase/firestore";

import { db } from "../../firebase/config";

import { Feather } from "@expo/vector-icons";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";


const PostItem = ({ item, navigation }) => {
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `posts/${item.id}/comments`),
      (data) => {
        setCommentsCount(data.docs.length);
      }
    );
    return () => unsubscribe();
  }, [item.id]);

  return (
    <View
      style={{
        marginBottom: 20,
        marginHorizontal: 16,
      }}
    >
      <Image
        source={{ uri: item.photo }}
        style={{ width: 350, height: 200, marginTop: 10 }}
      />
      <View style={styles.titleWrapper}>
        <Text>{item.formValues.title}</Text>
      </View>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={styles.commentsCountWrapper}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Comments", {
                postID: item.id,
                photo: item.photo,
              })
            }
          >
            <Feather name="message-circle" size={24} color="black" />
          </TouchableOpacity>
          <Text>{commentsCount}</Text>
        </View>
        <View style={styles.locationWrapper}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Map", {
                location: item.location,
                title: item.formValues.title,
              })
            }
          >
            <Feather name="map-pin" size={18} color="#BDBDBD" />
          </TouchableOpacity>

          <Text style={styles.locationText}>{item.formValues.location}</Text>
        </View>
      </View>
    </View>
  );
};

const PostsScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "posts"), (data) => {
      const posts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setPosts(posts);
    });
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostItem item={item} navigation={navigation} />
        )}
      />
    </SafeAreaView>
  );
};

export default PostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  locationWrapper: {
    flex: 1,
    flexDirection: "row",
    width: 300,
  },
  locationText: {
    marginLeft: 5,
    fontSize: 16,
    lineHeight: 19,
  },
  titleWrapper: {
    marginTop: 8,
    marginBottom: 11,
    width: 300,
  },
  commentsCountWrapper: {
    flexDirection: "row",
    flexGrow: 2,
  },
});