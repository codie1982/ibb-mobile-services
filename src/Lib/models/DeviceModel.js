import Info from "./info"
//import NetInfo from "@react-native-community/netinfo";
export default class DeviceModel {
    async  createInitModel(application_uuid) {
        let device_id = await Info.getDeviceId()
        let package_name = await Info.getBundleId()
        let version_number = await Info.getVersionCode()

       // const state = await NetInfo.fetch()
        return { device_id, package_name ,version_number,application_uuid}
        /*    console.log("SSID", state.details.ssid);
           console.log("BSSID", state.details.bssid);
           console.log("Is connected?", state.isConnected);
           console.log('Initial, type: ' + state.type);
    */

        /*  let location = ""
         let platform = ""
         let currenVversion = ""
         let getBatteryLevel = ""
         let getIpAddress = ""
         let getMacAddress = ""
         let isBatteryCharging = ""
         let isHeadphonesConnected = ""
         let isLocationEnabled = ""
         let isTablet = ""
         let useBatteryLevel = ""
         let usePowerState = ""
         let networkState = "" */

    }
    async  createDeviceModel() {
        let device_id = await Info.getDeviceId()
        let package_name = await Info.getBundleId()
        let brand = await Info.getBrand()
        let model = await Info.getModel()
        let deviceName = await Info.getDeviceName()
        let manufacturer = await Info.getManufacturer()
        //const state = await NetInfo.fetch()
        return { device_id, package_name,brand,model,deviceName,manufacturer }
        /* let deviceId = ""
        let package_name = ""
        let getApiLevel = ""
        let getBaseOs = ""
        let getBrand = ""
        let getBuildId = ""
        let getBuildNumber = ""
        let getDevice = ""
        let getDeviceName = ""
        let getFontScale = ""
        let getFreeDiskStorage = ""
        let getIncremental = ""
        let getHardware = ""
        let getInstallerPackageName = ""
        let getManufacturer = ""
        let getMaxMemory = ""
        let getPhoneNumber = ""
        let getProduct = ""
        let getSerialNumber = ""
        let getModel = ""
        let location = ""
        let platform = ""
        let currenVversion = ""
        let getSystemName = ""
        let getSystemVersion = ""
        let getTags = ""
        let getTotalDiskCapacity = ""
        let getTotalMemory = ""
        let getType = ""
        let getUsedMemory = ""
        let useDeviceName = ""
        let isLandscape = "" */
    }

    async  createVersionModel() {
        let device_id = await Info.getDeviceId()
        let package_name = await Info.getBundleId()
        let current_version_number = await Info.getVersionCode()
        let brand = await Info.getBrand()
        let model = await Info.getModel()
        let deviceName = await Info.getDeviceName()
        let manufacturer = await Info.getManufacturer()
        //const state = await NetInfo.fetch()
        return { device_id, package_name, current_version_number, brand, model,manufacturer,deviceName }
        /* let deviceId = ""
        let package_name = ""
        let getApiLevel = ""
        let getBaseOs = ""
        let getBrand = ""
        let getBuildId = ""
        let getBuildNumber = ""
        let getDevice = ""
        let getDeviceName = ""
        let getFontScale = ""
        let getFreeDiskStorage = ""
        let getIncremental = ""
        let getHardware = ""
        let getInstallerPackageName = ""
        let getManufacturer = ""
        let getMaxMemory = ""
        let getPhoneNumber = ""
        let getProduct = ""
        let getSerialNumber = ""
        let getModel = ""
        let location = ""
        let platform = ""
        let currenVversion = ""
        let getSystemName = ""
        let getSystemVersion = ""
        let getTags = ""
        let getTotalDiskCapacity = ""
        let getTotalMemory = ""
        let getType = ""
        let getUsedMemory = ""
        let useDeviceName = ""
        let isLandscape = "" */
    }
}