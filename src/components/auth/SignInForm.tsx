import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField"; // Ton composant mis à jour
import Button from "../ui/button/Button";
import {axiosPrivate} from "../../services/api.ts";
import useAuth from "../../hooks/useAuth.ts";
import {Link, useNavigate} from "react-router";
import {ApiError} from "../../types/types.ts";
import Cookies from "js-cookie";

const signInSchema = z.object({
  email: z.string().min(1, "L’email est requis").email("L’email doit être valide"),
  password: z.string().min(4, "Le mot de passe doit contenir au moins 4 caractères"),
  keepLoggedIn: z.boolean().default(false),
});

type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
// Stocker un cookie

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string|undefined>("");
  const navigate = useNavigate();
  const {auth, setAuth} = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      keepLoggedIn: false,
    },
  });

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    console.log("Données soumises :", data);
    try {
      const response = await axiosPrivate.post('/login', data);
      console.log(response.data)
      setAuth({
        ...auth,
        accessToken: response.data.body.accessToken,
        role: response.data.body.role,
      });
      Cookies.set('role', response.data.body.role, {
        expires: 7, // Expire dans 7 jours
        secure: true, // Seulement en HTTPS
        sameSite: 'strict', // Protection contre les attaques CSRF
        path: '/', // Accessible sur tout le site
      });
      if (response.data.body.role==="admin"){
        navigate("/admin/home");
      } else{
        navigate("/user/home");
      }
    } catch (err) {
      console.log(err)
      const error = err as ApiError;
      if(error.response?.status === 403) {
        setErrorMessage(error.response?.data.message)
      }
      if(error.response?.status === 401) {
        navigate("/user/deactivate");
      }
    }
  };

  return (
      <div className="flex flex-col flex-1">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Sign In
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enter your email and password to sign in!
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                      placeholder="info@gmail.com"
                      {...register("email")}
                      error={!!errors.email} // Passe la prop error si erreur
                      hint={errors.email?.message} // Affiche le message d’erreur comme hint
                  />
                </div>

                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password")}
                        error={!!errors.password}
                        hint={errors.password?.message}
                    />
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                    {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5"/>
                    ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5"/>
                    )}
                  </span>
                  </div>
                  <p className="text-red-600">{errorMessage}</p>
                </div>
                <div className="flex items-center justify-end">
                  {/*<div className="flex items-center gap-3">*/}
                  {/*  <Checkbox checked={isChecked} onChange={setIsChecked} />*/}
                  {/*  <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">*/}
                  {/*    Keep me logged in*/}
                  {/*  </span>*/}
                  {/*</div>*/}
                  <Link
                      to="/reset-password"
                      className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div>
                  <Button
                      className="w-full"
                      size="sm"
                      disabled={isSubmitting}
                  >
                    {isSubmitting ? "Connexion en cours..." : "Sign in"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}