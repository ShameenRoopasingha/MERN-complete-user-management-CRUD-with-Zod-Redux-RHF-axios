import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../features/users/userApiSlice";
import { LoginFormValues, loginSchema } from "../../forms/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // call Login RTKQ mutations
      const response = await login(data).unwrap();
      console.log("🟡 Login Form Data:", data);

      //save token to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.role); // ✅ Save role
      localStorage.setItem("userId", response._id); // Optional: helpful for self-updates

      console.log("token");

      navigate("/users");
      // when login success - show message or redirect
      console.log("Login success");
    } catch (err: any) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email Field */}
        <input
          type="email"
          {...register("email")}
          placeholder="Email"
          className="text-black"
        />
        <p>{errors.email?.message}</p>

        {/* Password Field */}
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="text-black"
        />
        <p>{errors.password?.message}</p>

        {/* submit */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading" : "Login"}
        </button>

        {/* Error */}
        {error && <p>Login Error!</p>}
      </form>
    </div>
  );
};

export default LoginForm;
