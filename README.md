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

5. Paste them like this in the .env (create a file called .env):

```env
FIREBASE_API_KEY="*******************"
FIREBASE_AUTHDOMAIN="*******************"
FIREBASE_PROJECTID="*******************"
FIREBASE_STORAGEBUCKET="*******************"
FIREBASE_MESSAGINGSENDERID="*******************"
FIREBASE_APPID="*******************"
FIREBASE_MEASUREMENTID="*******************"
```

6. Create a user in the authentication field of firebase. This is to **ignore the rules** you have created.

    6.1. Go to the authentication menu:
  
    ![auth-folder](img/auth.png)

    6.2. Click on add user and put an email and a password:
    
    ![add-user](img/add-user.png)
    ![set-user](img/set-user.png)

    6.3. Take the userID.

    ![user-id](img/user-id.png)

    6.4 Go to the storage, to the rules section and add the following rule (**Do not forget to remove the rule after moving your files!!**):
    ```
      match /{allPaths=**} {
        allow read, write: if request.auth.uid == "<USER_ID_COPIED>";
      }
    ```

    6.5. Add the user and the password into the .env:
    ```env
    FIREBASE_AUTH_EMAIL="*******************"
    FIREBASE_AUTH_PASSWORD="*******************"
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

The action is the object which is within a list, you can put as many actions as you want in the list, so that in one execution you move everything you want.

### Execute

```
node app
```