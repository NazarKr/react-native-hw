import React, { useState, useEffect } from "react";

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    ImageBackground,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/Feather";

import { Feather } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { authLogOutUser } from "../../redux/auth/authOperations";
import { db } from "../../firebase/config";

const ProfileScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const [userPosts, setUserPosts] = useState(null);
    const [commentsCount, setCommentsCount] = useState({});
    const { userID, login } = useSelector((state) => state.auth);

    useEffect(() => {
        if (route.params?.commentsCount) {
            setCommentsCount((prev) => ({
                ...prev,
                [route.params.postID]: route.params.commentsCount,
            }));
        }
    }, [route.params]);

    const getCommentsCount = async (postID) => {
        try {
            const commentsRef = collection(db, `posts/${postID}/comments`);
            const queryRef = query(commentsRef);
            const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
                const commentsCount = querySnapshot.docs.length;
                setCommentsCount((prev) => ({ ...prev, [postID]: commentsCount }));
                console.log("PostID", postID);
            });
            return () => unsubscribe();
        } catch (error) {
            console.log(error);
            setCommentsCount((prev) => ({ ...prev, [postID]: 0 }));
        }
    };

    const getUserPosts = async () => {
        try {
            const userPostsRef = collection(db, "posts");
            const queryRef = query(userPostsRef, where("userID", "==", userID));
            const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
                const userPosts = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setUserPosts(userPosts);

                if (userPosts && userPosts.length > 0) {
                    userPosts.forEach((post) => {
                        getCommentsCount(post.id.toString());
                    });
                }
            });
            return () => unsubscribe();
        } catch (error) {
            console.log(error);
        }
    };

    const signOut = () => {
        dispatch(authLogOutUser());
    };

    useEffect(() => {
        getUserPosts();
        return () => getUserPosts();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                style={styles.image}
                source={require("../../assets/images/photo-bg2x.jpg")}
            >
                <View style={styles.contentWrapprer}>
                    <TouchableOpacity style={styles.btn} onPress={signOut}>
                        <Feather name="log-out" size={24} color="#BDBDBD" />
                    </TouchableOpacity>
                    <Text style={styles.userName}>{login}</Text>
                    {userPosts && userPosts.length > 0 && (
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={userPosts}
                                keyExtractor={(item) => item.id.toString()}
                                showsVerticalScrollIndicator={true}
                                contentContainerStyle={{
                                    paddingBottom: 20,
                                    paddingTop: 20,
                                }}
                                renderItem={({ item }) => {
                                    return (
                                        <View
                                            style={{
                                                marginBottom: 10,
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
                                                        <Icon
                                                            name="message-circle"
                                                            size={24}
                                                            color="#FF6C00"
                                                        />
                                                    </TouchableOpacity>
                                                    <Text>{commentsCount[item.id] || 0}</Text>
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
                                    );
                                }}
                            />
                        </View>
                    )}
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "flex-end",
    },

    contentWrapprer: {
        marginTop: 100,
        flex: 1,
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },

    userName: {
        fontFamily: "Roboto",
        fontSize: 30,
        lineHeight: 36,
        fontWeight: "semibold",
        color: "#000000",
        textAlign: "center",
        marginTop: 92,
        marginBottom: 33,
    },

    titleWrapper: {
        marginTop: 8,
        marginBottom: 11,
        width: 300,
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

    btn: {
        position: "absolute",
        right: 16,
        top: 22,
    },

    commentsCountWrapper: {
        flexDirection: "row",
        flexGrow: 2,
    },
});