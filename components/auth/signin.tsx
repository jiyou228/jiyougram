"use client";
import { useMutation } from "@tanstack/react-query";
import { Button, Input } from "@material-tailwind/react";
import { useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";
import * as Yup from "yup";
import { useFormik } from "formik";

export default function SignIn({ setView }) {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const supabase = createBrowserSupabaseClient();

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      email: Yup.string()
        .email("이메일 형식이 올바르지 않습니다.")
        .required("이메일을 입력해주세요."),
      password: Yup.string()
        .min(8, "비밀번호는 최소 8자리 입니다.")
        .required("비밀번호를 입력해주세요."),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      signInMutation.mutate();
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

  const signInMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formik.values.email,
        password: formik.values.password,
      });
      if (data) {
        console.log(data);
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

        <Input
          value={formik.values.email}
          onChange={formik.handleChange}
          label="email"
          name="email"
          type="email"
          className="w-full rounded-sm"
        />
        {formik.errors.email && (
          <span className="text-red-700">{formik.errors.email}</span>
        )}

        <Input
          value={formik.values.password}
          onChange={formik.handleChange}
          label="password"
          type="password"
          name="password"
          className="w-full rounded-sm"
        />
        {formik.errors.password && (
          <span className="text-red-700">{formik.errors.password}</span>
        )}

        <Button
          type="submit"
          loading={signInMutation.isPending}
          disabled={signInMutation.isPending}
          color="light-blue"
          className="w-full text-md py-1"
        >
          로그인
        </Button>
        <Button
          onClick={() => signInWithKaKao()}
          className="w-full text-md py-1 bg-yellow-700 "
        >
          카카오 로그인
        </Button>
      </div>

      <div className="py-4 w-full text-center max-w-lg border border-gray-400 bg-white">
        아직 계정이 없으신가요?{" "}
        <button
          className="text-light-blue-600 font-bold"
          onClick={() => setView("SIGNUP")}
        >
          가입하기
        </button>
      </div>
    </form>
  );
}
