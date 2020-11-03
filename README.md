
# ibb-mobile-services

## BAŞLARKEN

#### Kullanım Amacı
İstanbul Büyük Şehir Belediyesi üzerinde kurulu mobil uygulamaların IBB Mobil Global servis üzerine erişmesine olanak sağlayan NPM Modulu

Bu modul ile uygulamanızın versiyon kontrolünü kolaylıkla sağlayabilirsiniz.

`$ npm install ibb-mobile-services --save`

### Otomatik Kurulum
## RN > 0.60 => Otomatik kulurum yapılır

`$ react-native link ibb-mobile-services`

### Elle Kurulum
## RN < 0.60 => Elle Kurulum yapılır.

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


## Kullanım Şekli
```javascript
import RNIbbMobileServices from 'ibb-mobile-services';

const App = () => {
  // const message = useSelector((state) => state.message.message);

  const config = {
    url: "",//Bağlantı Noktası 
    port: "",//Bağlantı Portu
  }
 //application_uuid : "Uygulamanıza Global servis tarafından verilen uniq kodu ::UUID
  return (<>
    <IBB application_uuid={"1234-1234-1234-1234"} config={config} >
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </IBB>
  </>
  );
};

// TODO: What to do with the module?
RNIbbMobileServices;
```
  