import { useState } from "react";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";

function FacebookChat() {
  const [profile, setProfile] = useState(null);

  return (
    <div>
      {!profile ? (
        <LoginSocialFacebook
          appId="496935592972104"
          onResolve={(response) => {
            console.log(response);
            setProfile(response);
          }}
          onReject={(error) => {
            console.log(error);
          }}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>
      ) : (
        ""
      )}

      {profile ? (
        <div>
          <h1>{profile.data.name}</h1>
          <img src={profile.data.picture.data.url} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default FacebookChat;
