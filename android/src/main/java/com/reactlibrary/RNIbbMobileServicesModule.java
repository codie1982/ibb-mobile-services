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

import androidx.annotation.RequiresApi;
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
    Long LASTDOWNLOAD = null;

    private final DeviceTypeResolver deviceTypeResolver;
    private final DeviceIdResolver deviceIdResolver;
    private BroadcastReceiver receiver;
    private PermissionListener mPermissionListener;

    private double mLastBatteryLevel = -1;
    private String mLastBatteryState = "";
    private boolean mLastPowerSaveState = false;

    private static String BATTERY_STATE = "batteryState";
    private static String BATTERY_LEVEL = "batteryLevel";
    private static String LOW_POWER_MODE = "lowPowerMode";
    public  static String FILEPATH = "";
    public  static String DIRECTORY = "";
    public  static String FILENAME = "";
    private String msg = "???";
    private int downloadStatus;
    private String applicationurl;
    public DownloadFile downloadFile;
    public RNIbbMobileServicesModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.deviceTypeResolver = new DeviceTypeResolver(reactContext);
        this.deviceIdResolver = new DeviceIdResolver(reactContext);
        PermissionAwareActivity activity = (PermissionAwareActivity) getCurrentActivity();
        reactContext.registerReceiver(onDownloadComplete, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));

    }
    @Override
    public String getName() {
        return "RNIbbMobileServices";
    }
    public void setApplicationurl(String url) {
        this.applicationurl = url;
    }
    public String getApplicationurl() {
        return applicationurl;
    }

    @ReactMethod
    public void setFile(String filename,int version_number) {
        downloadFile = new DownloadFile(filename,version_number).prepare();
        System.out.println("downloadFile.getDirectory() " + downloadFile.getDirectory());
        System.out.println("downloadFile.getFilename() " + downloadFile.getFilename());
        System.out.println("downloadFile.getFilepath(true) " + downloadFile.getFilepath(true));
    }
    @ReactMethod
    public void checkDestination(Promise promise) {
        try {
            File downloadFolder = downloadFile.getPureDirectory(getReactApplicationContext());
            if(!downloadFolder.exists()){
                downloadFolder.mkdir();
            }
            if(this.checkDownloadFile()){
                promise.resolve(true);
            }else {
                promise.resolve(false);
            }
        }catch (Exception e){
            promise.reject("Dosya Oluşturma Hatası", e);
        }
    }

    //Dosya yerini kontrol ediyor
    public Boolean checkDownloadFile() {
        try {
            File downloadfile = downloadFile.getPureFile(getReactApplicationContext());
            if(downloadfile.exists()){
                return true;
            }else{
                return false;
            }
        }catch (Exception e){
            return false;
        }
    }
    @ReactMethod //Dosya Doğruluğunu kontrol ediyor.
    public void checkFileAccuracy(Integer fileSize ,Promise promise) {
        try {
            if(this.checkDownloadFile()){
                File df = downloadFile.getPureFile(getReactApplicationContext());
                Long dfSize = df.length();
                Long _fileSize = new Long(fileSize);
                if(dfSize.equals(_fileSize)){
                    promise.resolve(true);
                }else {
                    promise.resolve(false);
                }
            }else {
                promise.resolve(false);
            }
        }catch (Exception e){
            promise.reject("Dosya Oluşturma Hatası", e);
        }
    }

    @ReactMethod
    public void setDownload(String URL) {
        this.setApplicationurl(URL);
        if (this.checkPermission()) {
            startDownload(getApplicationurl());
        }
    }
    @ReactMethod
    public void deleteFile(Promise promise) {
        System.out.println("deleteFile");
        try {
            if(this.checkDownloadFile()){
                System.out.println("Dosya Yerinde Bulunuyor... Siliniyor");
                this.deleteDownloadFile();
            }else {
                System.out.println("Dosya Yerinde Bulunamıyor");
            }
        }catch (Exception e){
            promise.reject("Dosya Bulunamıyor", e);
        }
    }
    public void deleteDownloadFile() {
        System.out.println(" Siliniyor");
        try {
            File file = downloadFile.getPureFile(getReactApplicationContext());
            file.delete();
        }catch (Exception e){
            System.out.println("Error : "+e.getMessage());
        }
    }

    @ReactMethod
    public void installApplication() {
        System.out.println("INSTALL Başla");
        setupApplication(getReactApplicationContext());
    }

    private boolean checkPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
            if (ContextCompat.checkSelfPermission(getCurrentActivity(),Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED) {
                System.out.println("İzin Verilmiş");
                return true;
            } else {
                this.getPermission(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, STORAGE_PERMISSION_CODE);
                System.out.println("İzin Verilmemiş");
                return false;
            }
        }else {return true;
        }

    }

    public void getPermission(String[] permissions, int requestCode){
        PermissionAwareActivity activity = (PermissionAwareActivity) getCurrentActivity();
        if (activity != null)
            activity.requestPermissions(permissions, requestCode, (PermissionListener) this);
    }
    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        // callback to native module
        System.out.println("requestCode :" + requestCode + "URL : " + this.getApplicationurl());
        if (requestCode == STORAGE_PERMISSION_CODE) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startDownload(this.getApplicationurl());
                return true;
            } else {
                Toast.makeText(reactContext, "Uygulamanızın yeni güncellemelerini almak için uygulamanıza izinleri vermeniz gerekmektedir.", Toast.LENGTH_SHORT).show();
                return false;
            }
        }
        return false;
    }

    public void startDownload(String URL) {
        System.out.println("Build.VERSION.SDK_INT :" + Build.VERSION.SDK_INT);
        if (Build.VERSION.SDK_INT >= 24) {
            if(!this.checkDownloadFile()){
                if (LASTDOWNLOAD == null){
                    System.out.println("Uri.parse(URL)" + Uri.parse(URL));

                    android.app.DownloadManager.Request request = new android.app.DownloadManager.Request(Uri.parse(URL))
                            .setTitle(downloadFile.getDownloadTitle())
                            .setDescription(downloadFile.getDownloadDescription())
                            .setAllowedNetworkTypes(android.app.DownloadManager.Request.NETWORK_WIFI | android.app.DownloadManager.Request.NETWORK_MOBILE)
                            .setAllowedOverMetered(true)
                            .setAllowedOverRoaming(true)
                            .setNotificationVisibility(android.app.DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                            .setDestinationInExternalFilesDir(getCurrentActivity(),
                                    Environment.DIRECTORY_DOWNLOADS, downloadFile.getFilepath(false));
                    System.out.println("request" + request.toString());
                    final android.app.DownloadManager downloadManager = (android.app.DownloadManager) getCurrentActivity().getSystemService(getCurrentActivity().DOWNLOAD_SERVICE);
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
                                try {
                                    if(cursor !=null && cursor.moveToFirst()){

                                        System.out.println("downloadManager ERROR" + cursor.getInt(cursor.getColumnIndex(android.app.DownloadManager.COLUMN_STATUS)));
                                        if (cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS)) == DownloadManager.STATUS_SUCCESSFUL) {
                                            downloading = false;
                                        }
                                        if (cursor.getInt(cursor.getColumnIndex(DownloadManager.COLUMN_STATUS)) == DownloadManager.STATUS_FAILED) {
                                            downloading = false;
                                        }
                                        if(downloading){
                                            double downloaded_bytes = cursor.getDouble(cursor.getColumnIndex(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR));
                                            final WritableMap params = Arguments.createMap();
                                            params.putDouble("downloaded_bytes", downloaded_bytes);

                                            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                                    .emit("eventProgress", params);
                                        }
                                        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                                .emit("eventStatus", statusMessage(cursor));
                                    }else {
                                        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                                .emit("eventStatus", DownloadManager.STATUS_FAILED);
                                    }

                                }catch (Exception ex){
                                    System.out.println("Download Fail :" + ex.getMessage());
                                    getReactApplicationContext()
                                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                            .emit("eventStatus", DownloadManager.STATUS_FAILED);
                                }finally {
                                    cursor.close();
                                }
                            }

                        }
                    }).start();

                }
            }
        }
    }

    private Integer statusMessage(Cursor c) {
        Integer msg;
        switch (c.getInt(c.getColumnIndex(DownloadManager.COLUMN_STATUS))) {
            case DownloadManager.STATUS_FAILED:
                msg = DownloadManager.STATUS_FAILED;
                break;
            case DownloadManager.STATUS_PAUSED:
                msg = DownloadManager.STATUS_PAUSED;
                break;
            case DownloadManager.STATUS_PENDING:
                msg = DownloadManager.STATUS_PENDING;
                break;
            case DownloadManager.STATUS_RUNNING:
                msg =DownloadManager.STATUS_RUNNING;
                break;
            case DownloadManager.STATUS_SUCCESSFUL:
                msg = DownloadManager.STATUS_SUCCESSFUL;
                break;
            default:
                msg = DownloadManager.STATUS_PENDING;
                break;
        }
        return (msg);
    }

    public BroadcastReceiver onDownloadComplete = new BroadcastReceiver() {
        @RequiresApi(api = Build.VERSION_CODES.KITKAT)
        @Override
        public void onReceive(Context context, Intent intent) {
            long id = intent.getLongExtra(android.app.DownloadManager.EXTRA_DOWNLOAD_ID, -1);
            System.out.println("LASTDOWNLOAD " + LASTDOWNLOAD + " " + id);
            if (LASTDOWNLOAD != null)
                if (LASTDOWNLOAD == id) {
                    switch (downloadStatus) {
                        case android.app.DownloadManager.STATUS_FAILED:
                            Toast.makeText(reactContext, "İndirme Başarısız. Lütfen tekrar deneyin", Toast.LENGTH_SHORT).show();
                            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit("eventStatus", android.app.DownloadManager.STATUS_FAILED);
                            System.out.println("İndirme Tamamlandı "+android.app.DownloadManager.STATUS_FAILED);
                            break;
                        case android.app.DownloadManager.STATUS_SUCCESSFUL:
                            Toast.makeText(reactContext, "İndirme Başarılı gerçekleşti.Uygulama kurulumu otomatik başlatılacaktır.", Toast.LENGTH_SHORT).show();
                            getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                    .emit("eventStatus", android.app.DownloadManager.STATUS_SUCCESSFUL);
                            System.out.println("İndirme Tamamlandı "+ android.app.DownloadManager.STATUS_SUCCESSFUL);
                            break;
                        default: break;
                    }
                }
            context.unregisterReceiver(this);
        }
    };
    public void setupApplication(Context context) {
        File file = downloadFile.getPureFile(context);
        System.out.println("FILE : "+file);
        System.out.println("exists : " + file.exists());
        System.out.println("getName : " + file.getName());
        System.out.println("getPath : " + file.getPath());
        System.out.println("Build.VERSION.SDK_INT " + Build.VERSION.SDK_INT);
        if (file.exists()) {
            if (Build.VERSION.SDK_INT <= 23) {
                Uri uri = Uri.fromFile(file);
                Intent install = new Intent(Intent.ACTION_VIEW);
                install.setDataAndType(uri, "application/vnd.android.package-archive");
                context.startActivity(install);
            } else {
                String authority = getReactApplicationContext().getPackageName() + ".provider";
                //String authority = "com.mobilestore.eng.provider";
                System.out.println("file" + file);
                Uri contentUri = FileProvider.getUriForFile(context, authority, file);
                Intent install = new Intent(Intent.ACTION_INSTALL_PACKAGE);
                install.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                install.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                install.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                install.putExtra(Intent.EXTRA_NOT_UNKNOWN_SOURCE, true);
                install.setDataAndType(contentUri, "application/vnd.android.package-archive");
                context.startActivity(install);
            }
        } else {
            Toast.makeText(reactContext, "Indirilen dosyaya Erişilemiyor. Lütfen Tekrar deneyin", Toast.LENGTH_SHORT).show();
        }
    }
}