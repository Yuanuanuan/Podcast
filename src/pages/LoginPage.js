
import Login from '../components/Login';
import '../styles/login.scss';

const LoginPage = ({ token, setToken, userInfo, setUserInfo, authToken, setAuthToken }) => {

  return (
    <div className='login'>
      123
      <Login token={token} setToken={setToken} userInfo={userInfo} setUserInfo={setUserInfo} authToken={authToken} setAuthToken={setAuthToken} />
    </div>
  )
}

export default LoginPage;