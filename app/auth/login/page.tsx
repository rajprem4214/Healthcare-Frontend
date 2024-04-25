'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@radix-ui/react-label';
import { NextPage } from 'next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  useLazyGetOtpQuery,
  useLoginUserMutation,
} from '@/app/redux/apis/authApiQ';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { cn, isLocalStorageAvailable, safeDecodeJson } from '@/lib/utils';
import { Loader, Loader2Icon } from 'lucide-react';
import { useSnapshot } from 'valtio';
import { authStore, setAuthData } from '@/store/auth/Auth';
import { loginRedirectMessage } from '@/app/redux/utils';
import Link from 'next/link'
import getGoogleOAuthURL from '@/utils/getGoogleUrl';

const emailValidator = z.string().email();

const Login: NextPage = () => {
  const router = useRouter();
  const auth = useSnapshot(authStore);

  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );
  const [getOtp, getOtpStatus] = useLazyGetOtpQuery();
  const [loginUser, loginUserStatus] = useLoginUserMutation();

  const onSendOtp = async () => {
    const result = emailValidator.safeParse(email);

    if (!result.success) {
      // console.error(result.error);
      setValidationMessage('Please enter a valid email.');
      return;
    }
    toast.promise(getOtp(email).unwrap(), {
      pending: 'Sending otp request',
      success: 'Otp request sent. Please check your email',
      error: "Couldn't send otp.",
    });
  };

  const onLoginSubmit = async () => {
    if (!otp || otp.split('').some((val) => isNaN(parseInt(val)))) {
      setValidationMessage('Please enter valid otp.');
    }
    toast
      .promise(
        loginUser({
          email,
          otp,
        }).unwrap(),
        {
          success: 'Login Successfull.',
          pending: 'Verifying otp...',
          error: 'Unable to verfiy otp. Please try again.',
        }
      )
      .then((data: LoginResponse) => {
        setAuthData(
          {
            id: data.user,
            email: data.email,
          },
          data.accessToken
        );
        router.push('/dashboard/questionnaires');
      });
  };

  useEffect(() => {
    if (isLocalStorageAvailable) {
      const redirectionMessage = localStorage.getItem(loginRedirectMessage);

      if (redirectionMessage) {
        toast.info(redirectionMessage);
        localStorage.removeItem(loginRedirectMessage);
      }
    }
  }, []);

  return (
    <section className="relative flex flex-col justify-center items-center min-h-screen overflow-hidden bg-linear-gradient">
      <div className="absolute top-0 left-2 flex items-center gap-4 m-2 ">
        <Image
          src="/assets/icons/inuwell_icon.svg"
          alt="Inuwell"
          width={10}
          height={10}
          className="w-10"
        />
        <Image
          src="/assets/icons/inuwell_text.svg"
          alt="Inuwell"
          width={10}
          height={10}
          className="w-24"
        />
      </div>
      <Card className="w-96 shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email to login
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-gray-500">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder=""
              value={email}
              onChange={(e) => {
                e.preventDefault();
                setEmail(e.target.value ?? '');
              }}
            />
            <span
              className={cn('text-red-500 text-sm', {
                hidden: !validationMessage,
              })}
            >
              {validationMessage}
            </span>
          </div>
          {getOtpStatus.isSuccess && (
            <div className="grid gap-2">
              <Label htmlFor="otp" className="text-gray-500">
                OTP
              </Label>
              <Input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value ?? '')}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          {!getOtpStatus.isSuccess ? (
            <Button
              className={cn('w-full', {
                'disabled:opacity-40': getOtpStatus.isLoading,
              })}
              onClick={onSendOtp}
              disabled={getOtpStatus.isLoading}
            >
              {getOtpStatus.isLoading ? (
                <>
                  <Loader2Icon className="animate-spin me-3" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>
          ) : (
            <Button className="w-full" onClick={onLoginSubmit}>
              Login
            </Button>
          )} 
          <Button className='mt-3 flex'> <Link href={getGoogleOAuthURL()} className='flex items-center p-4 gap-2'> <Image
            src="/assets/icons/google-icon.svg"
            alt="Google"
            width={8}
            height={8}
            className="w-8"
          /> Sign In with Google </Link>  </Button>
        </CardFooter>
      </Card>
    </section>
  );
};
export default Login;
