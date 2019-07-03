import {AsyncStorage} from "react-native";

removeData = async () => {
    try {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('id');
        await AsyncStorage.removeItem('password');


    } catch (error) {
        alert(error.message)
        // Error retrieving data
    }
};
export default function Logout(token) {
    let data = {token: token};
    return fetch("http://www.semsar.city/api/users/logout", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then((apiResponse) => {
            removeData();
            console.log(apiResponse)
            return {
                done: "done"
            }
        })
        .catch(function (error) {
            return {
                error: error.message
            }
        })
}