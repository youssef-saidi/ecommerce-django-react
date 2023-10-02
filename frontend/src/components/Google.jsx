import GoogleLogin from 'react-google-login';

function Login() {
  const responseGoogle = (response) => {
    // Send the access token to the backend for verification
    fetch('http://127.0.0.1:8000/api/google-signin/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: response.tokenId }),
    });
  };

  return (
    <GoogleLogin
      clientId={"597108938911-epftobp6kh9gtv66ah7tano9r4q2jkt2.apps.googleusercontent.com"}
      buttonText="Sign in with Google"
      onSuccess={responseGoogle}
      onFailure={responseGoogle}
    />
  );
}

export default Login;
