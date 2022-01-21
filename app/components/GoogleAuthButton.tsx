import { REALM_APP_ID, WEB_CLIENT_ID } from "../../realm.config.json";
import { useState } from "react";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import Realm from "realm";

// Instantiate Realm app
const realm = new Realm.App({
  id: REALM_APP_ID,
});
const googleConf = {
  webClientId: WEB_CLIENT_ID,
};

function GoogleSignIn() {
  const [signinInProgress, setSigninInProgress] = useState<boolean>();

  const signIn = async () => {
    setSigninInProgress(true);
    try {
      // sign into Google
      await GoogleSignin.configure(googleConf);
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();

      // use Google ID token to sign into Realm
      const credential = Realm.Credentials.google({ idToken });
      const user = await realm.logIn(credential);
      console.log("signed in as Realm user", user.id);
    } catch (error) {
      // handle errors
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    } finally {
      setSigninInProgress(false);
    }
  };

  return (
    <GoogleSigninButton
      style={{ width: 192, height: 48 }}
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={signIn}
      disabled={signinInProgress}
    />
  );
}

export default GoogleSignIn;
