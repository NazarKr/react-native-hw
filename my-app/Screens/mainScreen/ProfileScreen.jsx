import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, FlatList, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import { authLogOutUser } from "../../redux/auth/authOperations";
import { db } from "../../firebase/config";

const ProfileScreen = () => {
    const dispatch = useDispatch();
    const [userPosts, setUserPosts] = useState([]);
    const [unsubscribe, setUnsubscribe] = useState(null);
    const { userID } = useSelector((state) => state.auth);

    const getUserPosts = async () => {
        try {
            const querySnapshot = await getDocs(
                query(collection(db, "posts"), where("userID", "==", userID))
            );
            const userPosts = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setUserPosts(userPosts);
        } catch (error) {
            console.log(error);
        }
    };

    const signOut = () => {
        dispatch(authLogOutUser());
    };

    useEffect(() => {
        getUserPosts();
    }, [userID]);

    return (
        <View style={styles.container}>
            <Button style={styles.btn} title="signOut" onPress={signOut} />
            {userPosts.length > 0 && (
                <View>
                    <FlatList
                        data={userPosts}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => {
                            console.log("renderItem", item);
                            return (
                                <View
                                    style={{
                                        marginBottom: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Image
                                        source={{ uri: item.photo }}
                                        style={{ width: 350, height: 200 }}
                                    />
                                </View>
                            );
                        }}
                    />
                </View>
            )}
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btn: {
        marginTop: 50,
    },
});
