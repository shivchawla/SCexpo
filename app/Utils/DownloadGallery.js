import {SQLite} from "expo-sqlite";
import {StyleSheet, AsyncStorage, Platform, ActivityIndicator, Text, Modal, View} from "react-native";
import * as FileSystem from 'expo-file-system';
const db  =SQLite.openDatabase("SemsarCity.db");
export async function DownloadImage(url, ui) {
    let fileName = url.replace("https://www.semsar.city/manage/img/properties/", "");
    return FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + fileName
    ).then(uri => {
        return {res: FileSystem.documentDirectory + fileName, url: url};
    }).catch(err => {
        return {message: err.message, url: url};
    })
}

const CustomProgressBar = ({visible}) => (
    <Modal onRequestClose={() => null} visible={visible}>
        <View style={{flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{borderRadius: 10, backgroundColor: 'white', padding: 25}}>
                <Text style={{fontSize: 20, fontWeight: '200'}}>Loading</Text>
                <ActivityIndicator size="large"/>
            </View>
        </View>
    </Modal>
);

export function DownloadGallery(gallery, ui) {
    return new Promise(function (resolve, reject) {
        let downloaded_image = "";
        // CustomProgressBar({visible: true})
        for (let i = 0; i < gallery.length; i++) {
            if (gallery[i].includes("https://www.semsar.city/manage/img/properties/")) {
                DownloadImage(gallery[i]).then(res => {
                    try {
                        if (!downloaded_image) {
                            downloaded_image = res.res;
                        } else {
                            downloaded_image = downloaded_image + ", " + res.res;
                        }
                        if (downloaded_image.split(",").length === gallery.length) {
                            // CustomProgressBar({visible: false})
                        }
                        updateImagePathSQLite(ui, downloaded_image);
                        console.log(downloaded_image);

                    } catch (e) {
                        console.log(e.message)
                        console.log("There is no connection")
                    }
                })
            }
        }
    });
}

export function updateImagePathSQLite(ui, filepath) {
    db.transaction(tx => {
        executeUpdate(tx, ui, filepath).then(res => {
            return {message: res.message}
        })
    })
}

export function executeUpdate(tx, ui, filepath) {
    return new Promise(function (resolve, reject) {
        tx.executeSql('UPDATE home_props ' +
            'SET downloaded_image="' + filepath + '" WHERE created_at="' + ui + '"', [], (tx, results) => {
            resolve({message: "done"})
        })
    })
}

