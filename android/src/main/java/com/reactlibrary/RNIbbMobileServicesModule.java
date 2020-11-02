
package com.reactlibrary;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;
import com.reactlibrary.resolver.DeviceIdResolver;
import com.reactlibrary.resolver.DeviceTypeResolver;

import java.io.File;
import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import static android.provider.Settings.Secure.getString;

public class RNIbbMobileServicesModule extends ReactContextBaseJavaModule implements PermissionListener {
    private final int STORAGE_PERMISSION_CODE = 100;
    private final ReactApplicationContext reactContext;

    Long LASTDOWNLOAD;

    private final DeviceTypeResolver deviceTypeResolver;
    private final DeviceIdResolver deviceIdResolver;
    private BroadcastReceiver receiver;

    private double mLastBatteryLevel = -1;
    private String mLastBatteryState = "";
    private boolean mLastPowerSaveState = false;

    private static String BATTERY_STATE = "batteryState";
    private static String BATTERY_LEVEL = "batteryLevel";
    private static String LOW_POWER_MODE = "lowPowerMode";
    public  static String FILEPATH = "";
    public  static String DIRECTORY = "";
    public  static String FILENAME = "";
    public RNIbbMobileServicesModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.deviceTypeResolver = new DeviceTypeResolver(reactContext);
        this.deviceIdResolver = new DeviceIdResolver(reactContext);
        PermissionAwareActivity activity = (PermissionAwareActivity) getCurrentActivity();
        if (activity == null) {
            // Handle null case
        }

        reactContext.registerReceiver(onDownloadComplete, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));

    }

    @Override
    public Map<String, Object> getConstants() {
        String appVersion, buildNumber, appName;
        try {
            //appVersion = getPackageInfo().versionName;
            buildNumber = Integer.toString(getPackageInfo().versionCode);
            appName = getReactApplicationContext().getApplicationInfo().loadLabel(getReactApplicationContext().getPackageManager()).toString();
        } catch (Exception e) {
            //appVersion = "unknown";
            buildNumber = "unknown";
            appName = "unknown";
        }

        final Map<String, Object> constants = new HashMap<>();
        constants.put("uniqueId", getUniqueIdSync());
        constants.put("deviceId", Build.BOARD);
        constants.put("bundleId", getReactApplicationContext().getPackageName());
        constants.put("systemName", "Android");
        constants.put("systemVersion", Build.VERSION.RELEASE);
        //constants.put("appVersion", appVersion);
        constants.put("buildNumber", buildNumber);
        constants.put("isTablet", deviceTypeResolver.isTablet());
        constants.put("appName", appName);
        //constants.put("brand", Build.BRAND);
        constants.put("model", Build.MODEL);
        constants.put("deviceType", deviceTypeResolver.getDeviceType().getValue());
        return constants;
    }

    @Override
    public String getName() {
        return "RNIbbMobileServices";
    }

    private PackageInfo getPackageInfo() throws Exception {
        return getReactApplicationContext().getPackageManager().getPackageInfo(getReactApplicationContext().getPackageName(), 0);
    }

    @ReactMethod
    public void getUniqueId(Promise promise) {
        String android_id = Settings.Secure.getString(getReactApplicationContext().getContentResolver(),
                Settings.Secure.ANDROID_ID);
        promise.resolve(android_id);
    }

    @SuppressLint("HardwareIds")
    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getUniqueIdSync() {
        return getString(getReactApplicationContext().getContentResolver(), Settings.Secure.ANDROID_ID);
    }


    @ReactMethod
    public void getBundleId(Promise promise) {
        String packageName = getReactApplicationContext().getPackageName();
        //System.out.println("package_name : " + packageName);
        promise.resolve(packageName);
    }

    @ReactMethod
    public void appVersion(Promise promise) throws PackageManager.NameNotFoundException {
        PackageInfo packageInfo = getReactApplicationContext().getPackageManager().getPackageInfo(getReactApplicationContext().getPackageName(), 0);
        int versionCode = packageInfo.versionCode;
        promise.resolve(versionCode);
    }
    @ReactMethod
    public void brand(Promise promise) {
        promise.resolve(Build.BRAND);
    }
    @ReactMethod
    public void getModel(Promise promise) {
        promise.resolve(Build.MODEL);
    }
    @ReactMethod
    public void getManufacturer(Promise promise) {
        promise.resolve(Build.MANUFACTURER);
    }
    @ReactMethod
    public void getDeviceName(Promise promise) {
        promise.resolve(Build.DEVICE);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getInstallerPackageNameSync() {
        String packageName = getReactApplicationContext().getPackageName();
        String installerPackageName = getReactApplicationContext().getPackageManager().getInstallerPackageName(packageName);
        if (installerPackageName == null) {
            return "unknown";
        }
        System.out.println("package_name : " + installerPackageName);
        return installerPackageName;
    }

    @ReactMethod
    public void uploadNewFile(String URL ,String filename, Promise promise) {
        System.out.println("URL : " + URL);

        if(ContextCompat.checkSelfPermission(
                getCurrentActivity(),
                Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED){
           this.checkPermission(new String[] {
                   Manifest.permission.WRITE_EXTERNAL_STORAGE,
                   Manifest.permission.ACCESS_FINE_LOCATION,
                   Manifest.permission.CAMERA,
                   Manifest.permission.ACCESS_FINE_LOCATION,
                   Manifest.permission.ACCESS_LOCATION_EXTRA_COMMANDS,
                   Manifest.permission.ACCESS_WIFI_STATE,
           },STORAGE_PERMISSION_CODE);
        }else {
            DIRECTORY = filename;
            FILENAME = filename +".apk";
            FILEPATH = DIRECTORY + "/"+ FILENAME;
            System.out.println(FILEPATH);
            System.out.println(URL);
            startDownload(URL);
        }
    }
    public void checkPermission(String[] permissions, int requestCode){
        ActivityCompat.requestPermissions(getCurrentActivity(),permissions,requestCode);
    }




    public void startDownload(String URL) {
        System.out.println("System Version : " + Build.VERSION.SDK_INT);
        if (Build.VERSION.SDK_INT >= 24) {
            File folder = new File(getReactApplicationContext().getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), DIRECTORY);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            File file = new File(getReactApplicationContext().getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS).toString(), FILEPATH);
            if (file.isFile()) {
                file.delete();
            }

            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(URL))
                    .setAllowedNetworkTypes(DownloadManager.Request.NETWORK_WIFI | DownloadManager.Request.NETWORK_MOBILE)
                    .setAllowedOverMetered(true)
                    .setAllowedOverRoaming(true)
                    .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE)
                    .setDestinationInExternalFilesDir(getCurrentActivity(),
                            Environment.DIRECTORY_DOCUMENTS + "/" + DIRECTORY, FILENAME);

            final DownloadManager downloadManager = (DownloadManager) getCurrentActivity().getSystemService(getCurrentActivity().DOWNLOAD_SERVICE);
            LASTDOWNLOAD = downloadManager.enqueue(request);


            new Thread(new Runnable() {
                @Override
                public void run() {
                    boolean downloading = true;
                    while (downloading) {
                        //System.out.println(downloading);
                        DownloadManager.Query q = new DownloadManager.Query();
                        q.setFilterById(LASTDOWNLOAD);
                        final Cursor cursor = downloadManager.query(q);
                        cursor.moveToFirst();

                        double bytes_downloaded = cursor.getDouble(cursor.getColumnIndex(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));
                        double bytes_total = cursor.getDouble(cursor.getColumnIndex(DownloadManager.COLUMN_TOTAL_SIZE_BYTES));
                        if (cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS)) == DownloadManager.STATUS_SUCCESSFUL) {
                            downloading = false;
                        }
                        final WritableMap params = Arguments.createMap();
                        params.putDouble("bytes_downloaded",bytes_downloaded);
                        params.putDouble("bytes_total",bytes_total);


                        final double dl_progress = (double) ((bytes_downloaded * 100l) / bytes_total) + 0.00001;
                        params.putDouble("progress",dl_progress);
                        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("eventProgress", params);

                        getCurrentActivity().runOnUiThread(new Runnable() {
                            DecimalFormat precision = new DecimalFormat("0.00");
                            @Override
                            public void run() {
                                System.out.println("progress : " + (int) dl_progress);
                               // pgsApplicationDownloading.setProgress((int) dl_progress);
                            }
                        });
                        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit("eventState", statusMessage(cursor));

                        statusMessage(cursor);
                        System.out.println(statusMessage(cursor));
                        cursor.close();
                    }
                }
            }).start();
        }
    }
    private String statusMessage(Cursor c) {
        String msg = "???";

        switch (c.getInt(c.getColumnIndex(DownloadManager.COLUMN_STATUS))) {
            case DownloadManager.STATUS_FAILED:
                //pgsApplicationDownloading.setIndeterminate(true);
                msg = "STATUS_FAILED!";
                break;

            case DownloadManager.STATUS_PAUSED:
                //pgsApplicationDownloading.setIndeterminate(true);

                msg = "STATUS_PAUSED!";
                break;
            case DownloadManager.STATUS_PENDING:
                //pgsApplicationDownloading.setIndeterminate(true);
                msg = "STATUS_PENDING!";
                break;
            case DownloadManager.STATUS_RUNNING:
                //pgsApplicationDownloading.setIndeterminate(false);
                msg = "STATUS_RUNNING!";
                break;
            case DownloadManager.STATUS_SUCCESSFUL:
                //pgsApplicationDownloading.setIndeterminate(false);

                msg = "STATUS_SUCCESSFUL!";
                break;
            default:
                msg = "Download is nowhere in sight";
                break;
        }
        return (msg);
    }
    public BroadcastReceiver onDownloadComplete = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {

            long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
            if (LASTDOWNLOAD == id) {
                setupApplication(context, intent);
                System.out.println("İndirme Tamamlandı");
                Toast.makeText(context, "INDIRME TAMAMLANDI", Toast.LENGTH_SHORT).show();
            }
        }


        public void setupApplication(Context context, Intent intent) {
            String fileProviderName = getReactApplicationContext().getPackageName()+".ibb.provider";
            if (Build.VERSION.SDK_INT >= 22) {
                Uri contentUri = FileProvider.getUriForFile(context, fileProviderName,
                        new File(context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS).toString(),
                                FILEPATH));
                Intent install = new Intent(Intent.ACTION_INSTALL_PACKAGE);
                install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                install.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                install.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                install.putExtra(Intent.EXTRA_NOT_UNKNOWN_SOURCE, true);
                install.setDataAndType(contentUri, "application/vnd.android.package-archive");
                context.startActivity(install);
                context.unregisterReceiver(this);
            } else {
                if (Build.VERSION.SDK_INT >= 23) {
                    Uri uri = Uri.fromFile(new File(context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS).toString(), FILEPATH));
                    Intent install = new Intent(Intent.ACTION_VIEW);
                    install.setDataAndType(uri, "application/vnd.android.package-archive");
                    context.startActivity(install);
                    context.unregisterReceiver(this);
                }
            }
        }
    };
    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        System.out.println("Izin Kabul Edildi" + requestCode);
        return false;
    }
}