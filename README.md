### Set the enviroment variables

Configure the keys in the enviroment variables.

To get those variables:

1. Go to your project in firebase.

2. Then select the configuration icon:

![configuration](img/conf.png)

3. Then select "configuracion del proyecto":

![configuration](img/conf-proy.png)

4. Scroll and take the keys from this object:

```js
const firebaseConfig = {
  apiKey: "***********",
  authDomain: "***********",
  projectId: "***********",
  storageBucket: "***********",
  messagingSenderId: "***********",
  appId: "***********",
  measurementId: "***********",
};
```

5. Paste them like this in the .env:

```env
FIREBASE_API_KEY="AIzaSyDDJVkUI-eQIermNX1HzP5EjzjvDtiQY98"
FIREBASE_AUTHDOMAIN="komaku.firebaseapp.com"
FIREBASE_PROJECTID="komaku"
FIREBASE_STORAGEBUCKET="komaku.appspot.com"
FIREBASE_MESSAGINGSENDERID="28796959005"
FIREBASE_APPID="1:28796959005:web:b8334406bee3274a7ec9f4"
FIREBASE_MEASUREMENTID="G-RZ66Y5CNL0"
```

### Set the actions

Actions are simple. You just put the route from which you want to move something and the new route.

For example:

```json
[
  {
    "takeFrom": "/test1/test2",
    "moveTo": "/moveTest"
  },
  {
    "takeFrom": "/test",
    "moveTo": "/moveTest"
  }
]
```
