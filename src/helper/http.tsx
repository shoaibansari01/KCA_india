import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { accessTokenKey, storageAuthKey } from './config';
import Snackbar from 'react-native-snackbar';
import RNRestart from 'react-native-restart';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { ToastMessage } from './normConsistent';
import { encryptToken, decryptToken } from './encryption';


// FOR LOCAL
// const BASE_URL = 'http://192.168.1.49:4000/';
// export const UPLOAD_DATA = true;
// export const RAZORPAY_KEY = "rzp_test_LhqQON5Dt2dvIw";
// export const appUpdateTrigger = false;

// FOR PRODUCTION
const BASE_URL = 'http://3.110.6.169:4000/';
export const UPLOAD_DATA = false
export const RAZORPAY_KEY = "rzp_live_ysttfup0RthEbp";
export const appUpdateTrigger = true;

// FOR APK
// const BASE_URL = 'http://3.110.6.169:4000/';
// export const UPLOAD_DATA = false
// export const RAZORPAY_KEY = "rzp_live_ysttfup0RthEbp";
// export const appUpdateTrigger = false;

const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    
};

const Formheaders = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
};
const TIMEOUT = 300000;

let GuestApi = Axios.create({
    baseURL: BASE_URL,
    headers: headers,
    timeout: TIMEOUT
});

let AuthGApi = Axios.create({
    baseURL: BASE_URL,
    headers: headers,
    timeout: TIMEOUT
});

let AuthApi = Axios.create({
    baseURL: BASE_URL,
    headers: headers,
    timeout: TIMEOUT
});

let FormApi = Axios.create({
    baseURL: BASE_URL,
    headers: Formheaders,
    timeout: TIMEOUT
});

// const setClientToken = (token: any) => {
//     AuthApi.interceptors.request.use(function (config) {
//         config.headers.Authorization = `Bearer ${token}`;
//         return config;
//     });
// };

const token = async () => {
    const res: any = await AsyncStorage.getItem(accessTokenKey);
    const data = JSON.parse(res);
    return data?.accessToken;
}

export const postReq = async ({ url, data, returnKey, errorCallback = () => null, isAuthApi = true }: any) => {
    try {
        console.log('postReq called with:', { url, isAuthApi, dataType: data instanceof FormData ? 'FormData' : typeof data });
        
        const headers = {
            headers: {
                ...(data instanceof FormData
                    ? {} // Don't set Content-Type for FormData, let React Native handle it
                    : { 'Content-Type': 'application/json' }),
            },
        };
        
        console.log('Headers:', headers);
        
        let res: any = null;
        if (isAuthApi) res = await AuthApi.post(`${url}`, data, headers);
        if (!isAuthApi) res = await GuestApi.post(`${url}`, data, headers);
        
        console.log('Response received:', { 
            status: res?.status, 
            hasData: !!res?.data,
            fullResponse: res
        });
        
        if (returnKey && res?.data) return res?.data[returnKey]
        
        // Check for successful response
        if (res && (res.status === 200 || res.status === 201)) {
            if (res.data?.message) {
                Snackbar.show({
                    text: `${res.data.message}`,
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: "#04b20cf0",
                    marginBottom: 8
                });
            }
            return res.data;
        }
        
        return res?.data;
    } catch (e: any) {
        console.log('postReq catch block:', e);
        const { response }: any = e;
        console.log('Response in catch:', response?.status, response?.data);
        
        if (!response) {
            console.log('No response in error');
            return false;
        }
        if (response && response.status === 400 && response?.data?.errors && response?.data?.errors.length) {
            const errorObj: any = response?.data?.errors.reduce((acc: any, cur: any) => {
                cur?.field && (acc[cur?.field] = cur?.message);
                return acc;
            }, {});
            if (Object.keys(errorObj).length) return errorCallback(errorObj);
            return null;
        }
        if (response && response.status === 500) {
            return { statusCode: response.status, ...response.data };
        }
        console.log('Unhandled error case, returning false');
        return false;
    }
}

const getReq = async ({ url, returnKey, errorCallback = () => null, isAuthApi = true }: any) => {
    try {
        const headers = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        let res: any = null;
        if (isAuthApi) res = await AuthApi.get(`${url}`, headers);
        if (!isAuthApi) res = await GuestApi.get(`${url}`, headers);
        if (returnKey && res?.data) return res?.data[returnKey]
        if ((res.status === 200 || res.status === 201) && res?.data?.message) {
            Snackbar.show({
                text: `${res?.data?.message}`,
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: "#04b20cf0",
                marginBottom: 8
            });
            return res.data;
        }
        return res?.data;
    } catch (e: any) {
        const { response }: any = e;
        if (!response) return false;
        if (response && response.status === 400 && response?.data?.errors && response?.data?.errors.length) {
            const errorObj: any = response?.data?.errors.reduce((acc: any, cur: any) => {
                cur?.field && (acc[cur?.field] = cur?.message);
                return acc;
            }, {});
            if (Object.keys(errorObj).length) return errorCallback(errorObj);
            return null;
        }
        if (response && response.status === 500) {
            return { statusCode: response.status, ...response.data };
        }
        // return false;
    }
}

AuthApi.interceptors.request.use(
    async (config) => {
        const accessToken = await token();
        if (accessToken) {
            console.log('Original token:', accessToken?.substring(0, 20) + '...');
            // Using encryptToken (which currently returns plain token)
            const encryptedToken = encryptToken(accessToken);
            console.log('Token after encryption function:', encryptedToken?.substring(0, 20) + '...');
            config.headers["authorization"] = encryptedToken;
        }
        return config;
    },
    (error) => {
        console.log(error)
        Promise.reject(error);
    }
);

// Add authentication interceptors for FormApi
FormApi.interceptors.request.use(
    async (config) => {
        const accessToken = await token();
        console.log('FormApi - Token exists:', !!accessToken);
        if (accessToken) {
            console.log('FormApi - Original token:', accessToken?.substring(0, 20) + '...');
            // The token might be encrypted - try decrypting it first
            try {
                const decryptedToken = decryptToken(accessToken);
                if (decryptedToken && decryptedToken !== accessToken) {
                    console.log('FormApi - Token appears encrypted, using decrypted version:', decryptedToken.substring(0, 20) + '...');
                    config.headers["authorization"] = decryptedToken;
                } else {
                    console.log('FormApi - Token not encrypted or decryption failed, using as-is');
                    config.headers["authorization"] = accessToken;
                }
            } catch (error) {
                console.log('FormApi - Decryption error, using token as-is:', error);
                config.headers["authorization"] = accessToken;
            }
        } else {
            console.log('FormApi - No token available');
        }
        return config;
    },
    (error) => {
        console.log('FormApi request interceptor error:', error)
        Promise.reject(error);
    }
);

// Add response interceptor for FormApi to handle 401 errors
FormApi.interceptors.response.use(
    async (response) => response,
    async function (error) {
        let originalRequest = error.config;
        const { response: errRes } = error;
        const { status, data } = errRes || {};
        
        console.log('FormApi response error:', { status, data, message: data?.errors?.[0]?.message });
        
        if (status === 401 && (data?.errors?.[0]?.message === "jwt expired" || data?.errors?.[0]?.message === "TokenNotMatched") && !originalRequest._retry) {
            console.log('FormApi: Token expired/invalid, attempting refresh...');
            originalRequest._retry = true;
            
            const itemData: any = await AsyncStorage.getItem(accessTokenKey);
            const x = JSON.parse(itemData);
            const { refreshToken } = x;
            
            try {
                const tokenResponse = await GuestApi.post(`/refresh-token`, { refresh_token: refreshToken });
                const { status: ref_status, data: ref_data } = tokenResponse;
                
                if (ref_status === 201 && ref_data.status) {
                    const { accessToken } = ref_data?.data;
                    console.log('FormApi: Token refreshed successfully, new token:', accessToken?.substring(0, 20) + '...');
                    
                    // Update stored token
                    let upData = x;
                    upData.accessToken = accessToken; // Fix: use consistent key name
                    await AsyncStorage.setItem(accessTokenKey, JSON.stringify(upData));
                    
                    // Retry original request with new token - don't go through interceptor again
                    originalRequest.headers['authorization'] = accessToken;
                    originalRequest._retry = true; // Prevent infinite loop
                    return FormApi(originalRequest);
                } else {
                    console.log('FormApi: Token refresh failed, redirecting to login');
                    // Handle failed refresh - could navigate to login
                }
            } catch (refreshError) {
                console.log('FormApi: Token refresh error:', refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

AuthApi.interceptors.response.use(
    async (response) => ({ ...response, data: response?.data }),
    async function (error) {
        let originalRequest = error.config;
        const { response: errRes } = error;
        const { status, data } = errRes;
        if ([400, 404].includes(status)) {
            Snackbar.show({
                text: `${data.errors[0]?.message}`,
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: "#d7281b",
                marginBottom: 8
            });
            return data.errors;
        }
        if (status == 401 && (data.errors[0]?.message == "jwt expired" || data.errors[0]?.message == "TokenNotMatched")) {
            const itemData: any = await AsyncStorage.getItem(accessTokenKey);
            const x = JSON.parse(itemData);
            const userRefLocalStorage = x;
            const { refreshToken } = x;
            try {
                const tokenResponse = await GuestApi.post(`/refresh-token`, { refresh_token: refreshToken });
                const { status: ref_status, data: ref_data } = tokenResponse;
                if (ref_status === 201 && ref_data.status) {
                    const { accessToken } = ref_data?.data;
                    // Using encryptToken (which currently returns plain token)
                    originalRequest.headers['authorization'] = encryptToken(accessToken);
                    let upData = userRefLocalStorage;
                    upData.access_token = accessToken;
                    await AsyncStorage.setItem(accessTokenKey, JSON.stringify(upData));
                    return Axios(originalRequest);
                }
            } catch (error) {
                const { response }: any = error;
                if (response.status === 403) {
                    try {
                        await AsyncStorage.setItem(storageAuthKey, JSON.stringify({}));
                        await AsyncStorage.setItem(accessTokenKey, JSON.stringify({}));
                        RNRestart.restart();
                    } catch (error) {
                        console.error("Error clearing AsyncStorage or navigating:", error);
                    }
                }
            }
        }
        return Promise.reject(error);
    },
);


// const fileDownloader = (url: any) => new Promise((resolve, reject) => {
//     ReactNativeBlobUtil.config({
//         fileCache: true,
//         appendExt: 'xlsx' // Ensure the file has the correct extension
//     })
//         .fetch('GET', url.includes("http") ? url : `https://kca-bucket.s3.ap-south-1.amazonaws.com/${url}`, {
//             // Add headers if necessary
//         })
//         .then(async (res) => {
//             const result = await ReactNativeBlobUtil.MediaCollection.copyToMediaStore({
//                 name: res.path().split("/").pop(), // name of the file
//                 parentFolder: '', // subdirectory in the Media Store
//                 mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' // MIME type for xlsx
//             },
//                 'Download', // Media Collection to store the file in ("Audio" | "Image" | "Video" | "Download")
//                 res.path() // Path to the file being copied in the apps own storage
//             );

//             ToastMessage("Download Complete");
//             resolve(result);
//         })
//         .catch(error => {
//             ToastMessage("Download Failed");
//             reject(error);
//         });
// });

const fileDownloader = (url: any) => new Promise((resolve, reject) => {
    if (!url) return null;
    console.log(url)
    const fileType = url.split('.').pop()
    // Determine the file extension and MIME type based on the file type
    let extension = '';
    let mimeType = '';

    switch (fileType) {
        case 'pdf':
            extension = 'pdf';
            mimeType = 'application/pdf';
            break;
        case 'xlsx':
            extension = 'xlsx';
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;
        case 'jpg':
            extension = 'jpg';
            mimeType = 'image/jpeg';
            break;
        case 'png':
            extension = 'png';
            mimeType = 'image/png';
            break;
        default:
            reject(new Error('Unsupported file type'));
            return;
    }

    ReactNativeBlobUtil.config({
        // fileCache: true,
        // appendExt: extension , // Ensure the file has the correct extension
        addAndroidDownloads: {
            useDownloadManager: true,
            title: url.split('/').pop(),
            mime: mimeType,
            mediaScannable: true,
            notification: true,
        }
    })
        .fetch('GET', url.includes("http") ? url : `https://kca-bucket.s3.ap-south-1.amazonaws.com/${url}`, {
            // Add headers if necessary
        })
        .then(async (res) => {
            console.log(res, "res");

            // const result = await ReactNativeBlobUtil.MediaCollection.copyToMediaStore({
            //     name: url.split('/').pop(), // name of the file
            //     parentFolder: '', // subdirectory in the Media Store
            //     mimeType: mimeType // MIME type for the file
            // },

            //     'Download', // Media Collection to store the file in ("Audio" | "Image" | "Video" | "Download")
            //     res.path() // Path to the file being copied in the app's own storage
            // );
            // console.log(result);

            // Linking.openURL(`content://media/external_primary/downloads/globalBrochure.pdf`)
            //     .then(() => console.log('File opened successfully'))
            //     .catch(err => {
            //         Alert.alert('Error', 'Failed to open file: ' + err.message);
            //     });
            ToastMessage("Download Complete");
            // resolve(result);
        })
        .catch(error => {
            console.log(error, "error");

            ToastMessage("Download Failed");
            reject(error);
        });
});


export { BASE_URL, GuestApi, AuthApi, FormApi, AuthGApi, fileDownloader, getReq };
