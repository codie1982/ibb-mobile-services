# ibb-mobile-services

## Getting started

`$ npm install ibb-mobile-services --save`

### Mostly automatic installation

`$ react-native link ibb-mobile-services`

### Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `ibb-mobile-services` and add `RNIbbMobileServices.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNIbbMobileServices.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`

- Add `import com.reactlibrary.RNIbbMobileServicesPackage;` to the imports at the top of the file
- Add `new RNIbbMobileServicesPackage()` to the list returned by the `getPackages()` method

2. Append the following lines to `android/settings.gradle`:
   ```
   include ':ibb-mobile-services'
   project(':ibb-mobile-services').projectDir = new File(rootProject.projectDir, 	'../node_modules/ibb-mobile-services/android')
   ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
   ```
     compile project(':ibb-mobile-services')
   ```

#### Windows

[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNIbbMobileServices.sln` in `node_modules/ibb-mobile-services/windows/RNIbbMobileServices.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app

- Add `using Ibb.Mobile.Services.RNIbbMobileServices;` to the usings at the top of the file
- Add `new RNIbbMobileServicesPackage()` to the `List<IReactPackage>` returned by the `Packages` method

## Usage

```javascript
import IBB from 'ibb-mobile-services';

  const config = {
    endpoint: "",
    port: "",
  }
// Modulu en dış katmana ekleyin
// application_uuid  = Servis tarafından veril uygulama ID UUID Formatında
//config parametleri
	<IBB application_uuid={""} config={config} >
      <Provider store={store}>
        <AppNavigator />
        <Message Toast={Toast} />
        <ImageModal />
      </Provider>
    </IBB>
```

Modulu React native üzerinde en dış kataman ekleyin.
Config ayarları bağlantı kurulacak enpointi ve port numarasını tanımlar
application_uuid servis tarafından uygulamanıza verilen uniqID UUID formatında olmalıdır.
