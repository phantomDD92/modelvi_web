import { Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import PageMetaData from "@/components/common/PageMetaData";
import AuthLayout from "../AuthLayout";
import { verifyAgency } from "@/redux/v2/actions";

const Verification = () => {
  const [sec, setSec] = useState(-10);
  const [verified, setVerified] = useState(false)
  const location = useLocation();
  const nativate = useNavigate();
  const dispatch = useDispatch();
  const params = new URLSearchParams(location.search);
  const token = params.get('token');

  useEffect(() => {
    if (!token || verified) return;
    dispatch(verifyAgency( { token }, (result) => {
      setSec(5)
      setVerified(result)
    }));
    }, [token, verified]);

  useEffect(() => {
    if(!verified) return
  
    if (sec === 0) {
      nativate('/sign-in');
      return;
    }
  
    const timer = setTimeout(() => {
      setSec(prev => prev - 1);
    }, 1000);
  
    return () => clearTimeout(timer);
  }, [sec, verified]);

  return (
    <AuthLayout>
      <PageMetaData title="Email Verification" />
      <p className="shrink text-center text-zinc-200 text-[20px]">
        {verified === true ? 'Verified!' : 'Failed to verify your email'}
      </p>
      {verified === true &&
        <p className="shrink text-center text-zinc-200">
          Page will redirect automatically after <b className='text-red-600'>{sec}</b> seconds
        </p>
      }
      {verified === false && 
        <p className="shrink text-center text-zinc-200 mt-4">
          Go to
          <Link to="/sign-in" className="ms-1 text-primary">
            <b>Login</b>
          </Link>
        </p>
      }

    </AuthLayout>
  );
};

export default Verification;
