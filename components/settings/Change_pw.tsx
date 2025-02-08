"use client";
import { useMutation } from "@tanstack/react-query";
import { Button, Input } from "@material-tailwind/react";
import { useMemo, useState } from "react";
import { createBrowserSupabaseClient } from "utils/supabase/client";
import * as Yup from "yup";
import { useFormik } from "formik";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Change_pw() {
  const supabase = createBrowserSupabaseClient();
  const [alertMessage, setAlertMessage] = useState(null);
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      newPassword: Yup.string()
        .min(8, "비밀번호는 최소 8자리 입니다.")
        .required("새 비밀번호를 입력해주세요."),
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      changeMutation.mutate();
    },
  });

  const changeMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.auth.updateUser({
        password: formik.values.newPassword,
      });
      if (data) {
        setAlertMessage({
          type: "success",
          message: "비밀번호가 성공적으로 변경되었습니다.",
        });
        setOpen(true);
        formik.setFieldValue("newPassword", "");
      }
      if (error) {
        setAlertMessage({
          type: "error",
          message: error.message,
        });
        setOpen(true);
      }
    },
  });

  return (
    <main className="h-full w-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-light-blue-50">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
        <div className="pt-10 pb-6 px-10 w-full flex flex-col items-center justify-center max-w-lg border border-gray-400 bg-white gap-2">
          <div className="flex flex-row">
            <Input
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              label="새 비밀번호"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              className="w-full rounded-sm"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="px-2"
            >
              {showPassword ? (
                <VisibilityOff fontSize="small" />
              ) : (
                <Visibility fontSize="small" />
              )}
            </button>
          </div>
          {formik.errors.newPassword && (
            <span className="text-red-700">{formik.errors.newPassword}</span>
          )}

          <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
            {alertMessage && (
              <Alert
                severity={alertMessage.type}
                onClose={handleClose}
                variant="filled"
                sx={{ width: "100%" }}
              >
                {alertMessage.message}
              </Alert>
            )}
          </Snackbar>

          <Button
            type="submit"
            loading={changeMutation.isPending}
            disabled={changeMutation.isPending}
            color="light-blue"
            className="w-full text-md py-1"
          >
            변경하기
          </Button>
        </div>
      </form>
    </main>
  );
}
