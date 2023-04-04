import React from "react";
import { useState, useEffect } from "react";

import { onSnapshot, collection } from "firebase/firestore";

import { db } from "../../firebase/config";


import {
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";

const PostScreen = ({ route, navigation }) => {
  const [posts, setPosts] = useState([]);

  const getAllPost = async () => {
    try {
      onSnapshot(collection(db, "posts"), (data) => {
        const posts = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setPosts(posts);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPost();
  }, []);



  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item, indx) => indx.toString()}
        renderItem={({ item }) => (
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
                  onPress={() => navigation.navigate("Comments", { postID: item.id, photo: item.photo })}
                >
                  <Feather name="message-circle" size={24} color="black" />
                </TouchableOpacity>
                <Text>0</Text>
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
                  <Feather
                    name="map-pin"
                    size={18}
                    color="#BDBDBD"
                    style={styles.mapIcon}
                  />
                </TouchableOpacity>

                <Text style={styles.locationText}>
                  {item.formValues.location}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default PostScreen;

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
