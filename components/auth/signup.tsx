"use client";
import { Button, Input } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";
import * as Yup from "yup";

export default function SignUp({ setView }) {
  // const [email, setEmail] = useState("");
  // const [otp, setOtp] = useState("");
  // const [password, setPassword] = useState("");
  const [confirmmationRequired, setConfirmationRequired] = useState(false);

  const supabase = createBrowserSupabaseClient();

  const validationSchema = useMemo(() => {
    if (confirmmationRequired) {
      return Yup.object().shape({
        otp: Yup.string().required().length(6, "6자리를 입력해주세요."),
      });
    } else {
      return Yup.object().shape({
        email: Yup.string()
          .email("이메일 형식이 올바르지 않습니다.")
          .required("이메일을 입력해주세요."),
        password: Yup.string()
          .min(8, "8자 이상 입력해주세요.")
          .required("비밀번호를 입력해주세요."),
      });
    }
  }, [confirmmationRequired]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      otp: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (confirmmationRequired) {
        verifyOtpMutation.mutate();
      } else {
        signupMutation.mutate();
      }
    },
  });

  const signInWithKaKao = async () => {
    const {} = await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_VERCEL_URL
          ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback`
          : "http://localhost:3000/auth/callback",
      },
    });
  };

  const signupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signUp({
        email: formik.values.email,
        password: formik.values.password,
        options: {
          emailRedirectTo: "http://localhost:3000/signup/confirm",
        },
      });
      if (data) {
        setConfirmationRequired(true);
      }
      if (error) {
        alert(error.message);
      }
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.verifyOtp({
        type: "signup",
        email: formik.values.email,

        token: formik.values.otp,
      });
      if (data) {
        setConfirmationRequired(true);
      }
      if (error) {
        alert(error.message);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
      <div className="pt-10 pb-6 px-10 w-full flex flex-col items-center justify-center max-w-lg border border-gray-400 bg-white gap-2">
        <img src={"/images/inflearngram.png"} className="w-60 mb-6" />
        {confirmmationRequired ? (
          <>
            <Input
              value={formik.values.otp}
              onChange={formik.handleChange}
              label="otp"
              name="otp"
              type="text"
              placeholder="OTP 6자리를 입력해주세요."
              className="w-full rounded-sm"
            />
            <span className="text-red-700">{formik.errors.otp}</span>
          </>
        ) : (
          <>
            <Input
              value={formik.values.email}
              onChange={formik.handleChange}
              label="email"
              name="email"
              type="email"
              className="w-full rounded-sm"
            />
            <span className="text-red-700">{formik.errors.email}</span>

            <Input
              value={formik.values.password}
              onChange={formik.handleChange}
              label="password"
              name="password"
              type="password"
              className="w-full rounded-sm"
            />
            <span className="text-red-700">{formik.errors.password}</span>
          </>
        )}
        <Button
          type="submit"
          loading={
            confirmmationRequired
              ? verifyOtpMutation.isPending
              : signupMutation.isPending
          }
          disabled={
            confirmmationRequired
              ? verifyOtpMutation.isPending
              : signupMutation.isPending
          }
          color="light-blue"
          className="w-full text-md py-1"
        >
          {confirmmationRequired ? "인증하기" : "가입하기"}
        </Button>
        <Button
          onClick={() => signInWithKaKao()}
          className="w-full text-md py-1 bg-yellow-700 "
        >
          카카오 로그인
        </Button>
      </div>

      <div className="py-4 w-full text-center max-w-lg border border-gray-400 bg-white">
        이미 계정이 있으신가요?{" "}
        <button
          className="text-light-blue-600 font-bold"
          onClick={() => setView("SIGNIN")}
        >
          로그인하기
        </button>
      </div>
    </form>
  );
}
