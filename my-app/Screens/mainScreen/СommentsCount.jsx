import React, { useState, useEffect } from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { Feather } from "@expo/vector-icons";

import { collection, onSnapshot } from "firebase/firestore";

import { db } from "../../firebase/config";

const CommentsCount = ({ postId, navigation }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, `posts/${postId}/comments`),
            (data) => {
                setCount(data.docs.length);
            }
        );
        return () => unsubscribe();
    }, [postId]);

    return (
        <View style={styles.commentsCountWrapper}>
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("Comments", {
                        postID: postId,
                        photo: item.photo,
                    })
                }
            >
                <Feather name="message-circle" size={24} color="black" />
            </TouchableOpacity>
            <Text>{count}</Text>
        </View>
    );
};

export default CommentsCount;