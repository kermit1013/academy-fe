import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

declare global {
    interface Window {
      Tally: any
    }
  }
  interface TallyPopupProps {
    getPersonData: () => Promise<void>;
  }
  
  const TallyPopup: React.FC<TallyPopupProps> = ({ getPersonData }) => {
    const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.onload = () => {
      if (window.Tally) {
        window.Tally.openPopup('n0x5Z6', {
          doNotShowAfterSubmit: true,
          overlay: true,
          onSubmit: async (payload: any) => {
            const access_token = localStorage.getItem('access_token');
            if (access_token == null) {
              navigate('/');
            }
            const data = JSON.stringify(payload);
            let encoded = encodeURI(data);
            const result = await axios.post(
              'https://api.loudy.in/api/graphs/thoughts',
              {
                data: encoded,
              },
              {
                headers: {
                  Authorization: `Bearer ${access_token}`,
                },
              }
            );
            if (result.status === 200) {
              await getPersonData();
            }
          },
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [navigate]);

  return null;
};

export default TallyPopup;