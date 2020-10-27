
import { RNInfo } from "../module"
import { Platform } from "react-native"
let deviceId;
export async function getDeviceId() {
    if (Platform.OS === 'android' || Platform.OS === 'windows') {
        deviceId = await RNInfo.getDeviceId();
    } else if (Platform.OS === 'ios') {
        deviceId = await RNInfo.deviceId;
    } else {
        deviceId = 'unknown';
    }
    return deviceId;
}

let Package_name;
export async function getBundleId() {
    if (Platform.OS === 'android') {
        Package_name = await RNInfo.getBundleId();
    } else if (Platform.OS === 'ios') {
        Package_name = await RNInfo.bundleId;
    } else {
        Package_name = 'unknown';
    }
    return Package_name;
}

let Version_code;
export async function getVersionCode() {
    if (Platform.OS === 'android') {
        Version_code = await RNInfo.appVersion();
    } else if (Platform.OS === 'ios') {
        Version_code = await RNInfo.appVersion;
    } else {
        Version_code = 'unknown';
    }
    return Version_code;
}

let Brand;
export async function getBrand() {
    if (Platform.OS === 'android') {
        Brand = await RNInfo.brand();
    } else if (Platform.OS === 'ios') {
        Brand = await RNInfo.brand;
    }
    return Brand;
}

let Model;
export async function getModel() {
    if (Platform.OS === 'android') {
        Model = await RNInfo.getModel();
    } else if (Platform.OS === 'ios') {
        Model = await RNInfo.model;
    } else {
        Model = 'unknown';
    }
    return Model;
}

let Manufacturer;
export async function getManufacturer() {
    if (Platform.OS === 'android') {
        Manufacturer = await RNInfo.getManufacturer();
    } else if (Platform.OS === 'ios') {
        Manufacturer = 'Apple';
    } else {
        Manufacturer = 'unknown';
    }
    return Manufacturer;
}

let DeviceName;
export async function getDeviceName() {
    if (Platform.OS === 'android' || Platform.OS === 'ios' ) {
        DeviceName = await RNInfo.getDeviceName();
    } else {
        DeviceName = 'unknown';
    }
    return DeviceName;
}
let netWorkInfo;
export async function getNetworkInfo() {
    if (Platform.OS === 'android') {
        netWorkInfo = await RNInfo.getNetworkInfo();
    } else {
        netWorkInfo = 'unknown';
    }
    return netWorkInfo;
}
const deviceInfoModule = {
    getDeviceId,
    getBundleId,
    getVersionCode,
    getBrand,
    getModel,
    getManufacturer,
    getDeviceName
};
export default deviceInfoModule;