package com.reactlibrary;

import android.content.Context;
import android.os.Environment;

import java.io.File;

public class DownloadFile {
    private int versionNumber;
    private String filename;
    private String directory;
    private String filepath;

    private String title;
    private String description;

    private static String EXTENTION = "apk";
    private static String DOT = ".";
    private static String SLASH = "/";
    private static String DASH = "-";
    private String chr;

    public DownloadFile(String filename, int versionNumber) {
        this.versionNumber = versionNumber;
        this.filename = trtoEng(filename.replaceAll("\\s+","").toLowerCase());
    }

    public DownloadFile prepare() {
        this.setDirectory(filename);
        this.setFilename(filename,versionNumber);
        this.setFilepath();
        return this;
    }

    public String getDownloadTitle() {
        return this.title;
    }

    public String getDownloadDescription() {
        return this.description;
    }

    private int getVersionNumber() {
        return versionNumber;
    }

    private void setFilepath() {
        this.filepath = this.getDirectory() + SLASH + getFilename();
    }

    public String getFilename() {
        return filename;
    }

    private void setFilename(String filename,int versionnumber) {
        this.filename = filename + DASH + "V" + versionnumber + DOT + EXTENTION;
    }

    public String getDirectory() {
        return this.directory;
    }

    public File getPureDirectory(Context context) {
        File folder = new File(context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS).toString(), this.getDirectory());
        return folder;
    }

    public File getPureFile(Context context) {
        File file = new File(context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS).toString() + SLASH + this.getDirectory(), this.getFilename());
        return file;
    }

    private void setDirectory(String directory) {
        this.directory = directory;
    }

    public String getFilepath(boolean pre) {
        this.chr = chr;
        if (pre) {
            return SLASH + filepath;
        } else {
            return filepath;
        }
    }


    public static String trtoEng(String text)
    {
        //fonksiyona gelen kelimeyi alıyoruz
        String _text = text;
        //sonuç için vir değişken belirledik
        String result = "";
        //iki tane dizi oluşturuyoruz biri türkçe karakterler için diğeri ing
        char[] firstLetter = new char[] { 'İ', 'ı','ü', 'Ü', 'ç', 'Ç','Ğ', 'ğ','Ş', 'ş','ö','Ö' };
        char[] newLetter = new char[] { 'I', 'i', 'u','U','c','C','G','g','S', 's','o','O', };
        //for döngüsü açıp kelimenin harflerine tek tek bakıp
        //tr varsa replace metodu ile değiştiriyoruz.
        for (int i = 0; i < firstLetter.length; i++)
        {
            _text = _text.replace(firstLetter[i], newLetter[i]);
        }
        //burada sonuc değişkenini kullanmasınızda olur
        //direk sysout(metin) de denebilir
        result = _text;
        return result;
    }

}
