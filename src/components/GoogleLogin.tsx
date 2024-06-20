import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd'

const GoogleLogin = () => {
    const [messageApi] = message.useMessage()
    const navigate = useNavigate();


    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const result = await axios.post(
                    'https://api.loudy.in/api/users/auth-receiver',
                    {
                        credential: tokenResponse.access_token,
                    }
                );

                if (result.status === 200) {
                    localStorage.setItem('access_token', result.data.data.access);
                    localStorage.setItem('refresh_token', result.data.data.refresh);
                    messageApi.success('Google Sign-In successful!');
                    setTimeout(() => {
                        navigate('/search');
                    }, 1000);
                }
            } catch (error) {
                console.error('Error during Google Sign-In:', error);
                messageApi.warning('Google Sign-In failed. Please try again.');
            }

        }});
    return (
        <button className="h-[72px] w-full rounded-[20px] border-2 border-white bg-white/30 p-4 text-2xl text-white backdrop-blur-sm"
            onClick={() => googleLogin()}>
            使用Gmail登入
        </button>
    );
};

export default GoogleLogin;