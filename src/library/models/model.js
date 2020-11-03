import Info from "./info"
import { Platform } from "react-native"

export default class Model {
    constructor() {
        return true;
    }
    async createInitModel(application_uuid) {
        let model = await Info.getModel()
        let device_id = await Info.getDeviceId()
        let package_name = await Info.getBundleId()
        let version_number = await Info.getVersionCode()
        let platform = Platform.OS
        let sdkVersion = Platform.Version
        let brand = await Info.getBrand()
        let deviceName = await Info.getDeviceName()
        let manufacturer = await Info.getManufacturer()

        return {
            application_uuid,
            model, device_id,
            package_name,
            version_number,
            platform,
            sdkVersion,
            brand,
            manufacturer,
            deviceName
        }

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
        //let package_name = await Info.getBundleId()
        let brand = await Info.getBrand()
        let model = await Info.getModel()
        let deviceName = await Info.getDeviceName()
        let manufacturer = await Info.getManufacturer()
        //const state = await NetInfo.fetch()
        return { device_id, brand, model, deviceName, manufacturer }
        /* let device_id = ""
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
    async  createVersionModel(application_info) {
        console.log("application_info", application_info)

        let device_id = await Info.getDeviceId()
        let package_name = await Info.getBundleId()
        let current_version_number = await Info.getVersionCode()
        let brand = await Info.getBrand()
        let model = await Info.getModel()
        let deviceName = await Info.getDeviceName()
        let manufacturer = await Info.getManufacturer()
        //const state = await NetInfo.fetch()
        return {
            application_uuid: application_info.application.application_uuid,
            package_name: application_info.application_package.package_name,
            package_uuid: application_info.application_package.package_uuid,
            current_version_uuid: application_info.current_version.version_uuid,
            current_version_number,
            device_id,
            brand,
            model,
            manufacturer,
            deviceName,
            max_count: application_info.current_version.max_count
        }
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