
import { Platform } from "react-native"
export default class Model {
    reactNativeDeviceInfo
    constructor(reactNativeDeviceInfo) {
        this.reactNativeDeviceInfo = reactNativeDeviceInfo;//react native device info paketi
        return true;
    }

    setTokenModel = async (application_uuid) => {
        let device = {}
        //burada cache hazırlayabiliriz. herseferinde büyük zaman kaybı
        device.device_id = await this.reactNativeDeviceInfo.getUniqueId();
        device.package_name = await this.reactNativeDeviceInfo.getBundleId()
        return {
            deviceid: device.device_id,
            package_name: device.package_name,
            application_uuid: application_uuid,
            platform: Platform.OS
        }
    }
    getDeviceID = async () => {
        return await this.reactNativeDeviceInfo.getUniqueId();
    }
    getPackageName = async () => {
        return await this.reactNativeDeviceInfo.getBundleId();
    }
    getVersionNumner = async () => {
        return await this.reactNativeDeviceInfo.getBuildNumber()

    }
    setRegisterModel = async () => {
        let device = {}
        //burada cache hazırlayabiliriz. herseferinde büyük zaman kaybı
        device.device_id = await this.reactNativeDeviceInfo.getUniqueId();
        device.version_number = await this.reactNativeDeviceInfo.getBuildNumber()
        device.package_name = await this.reactNativeDeviceInfo.getBundleId()
        device.getApplicationName = await this.reactNativeDeviceInfo.getApplicationName();
        device.getBuildId = await this.reactNativeDeviceInfo.getBuildId();
        device.getBrand = await this.reactNativeDeviceInfo.getBrand();
        device.getCarrier = await this.reactNativeDeviceInfo.getCarrier()
        device.getDeviceId = await this.reactNativeDeviceInfo.getDeviceId()
        device.getDeviceName = await this.reactNativeDeviceInfo.getDeviceName()
        device.getFontScale = await this.reactNativeDeviceInfo.getFontScale()
        device.getFreeDiskStorage = await this.reactNativeDeviceInfo.getFreeDiskStorage()
        device.getFreeDiskStorageOld = await this.reactNativeDeviceInfo.getFreeDiskStorageOld()
        device.getMacAddress = await this.reactNativeDeviceInfo.getMacAddress()
        device.getManufacturer = await this.reactNativeDeviceInfo.getManufacturer()
        device.getModel = await this.reactNativeDeviceInfo.getModel()
        device.getPowerState = await this.reactNativeDeviceInfo.getPowerState()
        device.getReadableVersion = await this.reactNativeDeviceInfo.getReadableVersion()
        device.getSystemName = await this.reactNativeDeviceInfo.getSystemName()
        device.getSystemVersion = await this.reactNativeDeviceInfo.getSystemVersion()
        device.getTotalDiskCapacity = await this.reactNativeDeviceInfo.getTotalDiskCapacity()
        device.getTotalDiskCapacityOld = await this.reactNativeDeviceInfo.getTotalDiskCapacityOld()
        device.getTotalMemory = await this.reactNativeDeviceInfo.getTotalMemory()
        device.getUsedMemory = await this.reactNativeDeviceInfo.getUsedMemory()
        device.getUserAgent = await this.reactNativeDeviceInfo.getUserAgent()
        device.hasNotch = await this.reactNativeDeviceInfo.hasNotch()
        device.isEmulator = await this.reactNativeDeviceInfo.isEmulator()
        device.isLandscape = await this.reactNativeDeviceInfo.isLandscape()
        device.isPinOrFingerprintSet = await this.reactNativeDeviceInfo.isPinOrFingerprintSet()
        device.isTablet = await this.reactNativeDeviceInfo.isTablet()
        device.supportedAbis = await this.reactNativeDeviceInfo.supportedAbis()
        device.platform = Platform.OS
        return device
    }

    setVersionModel = async () => {
        let device = {}
        //burada cache hazırlayabiliriz. herseferinde büyük zaman kaybı
        /*         
        package_uuid: req.body.package_uuid, //sonradan ekle
        current_version_uuid: req.body.current_version_uuid, //sonradan ekle
        application_uuid: req.body.application_uuid,
        */

        device.device_id = await this.reactNativeDeviceInfo.getUniqueId();
        device.current_version_number = await this.reactNativeDeviceInfo.getBuildNumber()
        device.package_name = await this.reactNativeDeviceInfo.getBundleId()
        device.platform = Platform.OS
        device.getBrand = await this.reactNativeDeviceInfo.getBrand();
        device.getManufacturer = await this.reactNativeDeviceInfo.getManufacturer()
        device.getModel = await this.reactNativeDeviceInfo.getModel()
        device.getDeviceName = await this.reactNativeDeviceInfo.getDeviceName()
        return device
    }
    setConnectionModel = async (application_uuid) => {
        let device = {}
        //burada cache hazırlayabiliriz. herseferinde büyük zaman kaybı
        device.application_uuid = application_uuid;
        device.device_id = await this.reactNativeDeviceInfo.getUniqueId();
        device.getModel = await this.reactNativeDeviceInfo.getModel()
        device.version_number = await this.reactNativeDeviceInfo.getBuildNumber()
        device.package_name = await this.reactNativeDeviceInfo.getBundleId()
        device.platform = Platform.OS
        return device
    }

}