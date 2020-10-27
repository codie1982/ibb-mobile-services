/*
package com.reactlibrary.helper;

import android.content.DialogInterface;
import android.content.pm.PackageManager;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.ReactContextBaseJavaModule;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.reactlibrary.helper.PermissionHelper;
import com.reactlibrary.resolver.DeviceIdResolver;
import com.reactlibrary.resolver.DeviceTypeResolver;
public abstract class PermissionHelper extends ReactContextBaseJavaModule {

    public PermissionHelper(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);
    }



    public void izinIste(final String[] istenilenIzinler, final int requestCode) {

        int izinKontrol = PackageManager.PERMISSION_GRANTED;
        boolean mazeretGoster = false;

        //izinkontrol=0 ise izin/izinler verilmiştir
        //aksi durumda izin/izinler verilmemiştir.
        //mazeret göster = false ise ilk defa izin sorulmustur
        //mazeret goster= true ise kullanıcı izni reddetmiştir, ona bir mazeret sunabiliriz.
        for (String izin : istenilenIzinler) {
            izinKontrol = izinKontrol + ContextCompat.checkSelfPermission(getReactApplicationContext(), izin);
            mazeretGoster = mazeretGoster || ActivityCompat.shouldShowRequestPermissionRationale(getCurrentActivity(), izin);
        }

        if (izinKontrol != PackageManager.PERMISSION_GRANTED) {

            if (mazeretGoster) {
                AlertDialog.Builder builder = new AlertDialog.Builder(getReactApplicationContext());
                builder.setTitle("Neden İzin Vermelisin?");
                builder.setMessage("Arama yapmak istiyorsan bu izni vermen gerekiyor");
                builder.setNegativeButton("IZIN YOK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.cancel();
                    }
                });

                builder.setPositiveButton("IZIN VERMEK ISTIYORUM", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        ActivityCompat.requestPermissions(getCurrentActivity(), istenilenIzinler, requestCode);
                    }
                });
                builder.show();
            } else {
                ActivityCompat.requestPermissions(getCurrentActivity(), istenilenIzinler, requestCode);
            }

        } else {
            izinVerildi(requestCode);
        }

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        int izinKontrol = PackageManager.PERMISSION_GRANTED;
        //izinkontrol=0 ise tüm izinler verilmiştir
        for (int izinDurumu : grantResults) {
            izinKontrol = izinKontrol + izinDurumu;
        }
        if ((grantResults.length > 0) && izinKontrol == PackageManager.PERMISSION_GRANTED) {

            izinVerildi(requestCode);
        } else {

            AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
            builder.setTitle("IZIN LAZIM");
            builder.setMessage("Ayarladan tüm izinleri vermen gerekiyor");
            builder.setNegativeButton("OLMAZ", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {
                    dialog.cancel();
                }
            });

            builder.setPositiveButton("IZIN VERICEM", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialog, int which) {

                    Intent intent = new Intent();
                    intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    intent.addCategory(Intent.CATEGORY_DEFAULT);
                    intent.setData(Uri.parse("package:" + getActivity().getPackageName()));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                    intent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
                    startActivity(intent);

                }
            });
            builder.show();
        }
    }
    public abstract void izinVerildi(int requestCode);
}
*/
