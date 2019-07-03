import {Alert, AsyncStorage} from "react-native";

saveUser = async (key, data) => {
    try {
        await AsyncStorage.setItem(key, data);
    } catch (error) {
        alert(error.message +key)
        // Error saving data
    }
};

export default function reauthenticate(data) {
    return fetch("http://www.semsar.city/api/users/login", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then((apiResponse) => {
                console.log(apiResponse);
                if (apiResponse.message) {
                    this.saveUser("email", apiResponse.data.userInfo.email)
                    this.saveUser("name", apiResponse.data.userInfo.name);
                    this.saveUser("token", apiResponse.data.token);
                    this.saveUser("password", data.password);
                    this.saveUser("id", apiResponse.data.userInfo.id + "");
                    return ({token: apiResponse.data.token});
                } else {
                    return ({errors: "Ero"});
                }

            }
        )
}