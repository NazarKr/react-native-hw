import React from "react";
import { useState, useEffect } from "react";

import { Text, View, FlatList, Image, StyleSheet } from "react-native";

import { Feather } from "@expo/vector-icons";

const PostScreen = ({ route }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (route.params) {
      setPosts((prevState) => [...prevState, route.params]);
    }
  }, [route.params]);

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
            <View style={{flex:1, flexDirection:'row'}}>
              <View style={styles.commentsCountWrapper}>
                <Feather name="message-circle" size={24} color="black" />
                <Text>0</Text>
              </View>
              <View style={styles.locationWrapper}>
                <Feather
                  name="map-pin"
                  size={18}
                  color="#BDBDBD"
                  style={styles.mapIcon}
                />
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
    marginBottom:11,
    width: 300,
  },
  commentsCountWrapper: {
    flexDirection: "row",
    flexGrow:2
  },
});
