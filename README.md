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
FIREBASE_API_KEY="*******************"
FIREBASE_AUTHDOMAIN="*******************"
FIREBASE_PROJECTID="*******************"
FIREBASE_STORAGEBUCKET="*******************"
FIREBASE_MESSAGINGSENDERID="*******************"
FIREBASE_APPID="*******************"
FIREBASE_MEASUREMENTID="*******************"
```

### Set the actions

Actions are simple. You just put the route from which you want to move something and the new route.

**The actions are set in the actions.json file**

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

### Execute

```node app```