import { useForm } from "react-hook-form";
import { useCreateUserMutation } from "../../features/users/userApiSlice";
import { UserFormValues, userSchema } from "../../forms/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  const [createUser, { isLoading, isSuccess }] = useCreateUserMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      await createUser(data).unwrap();
      alert("✅ User created");
      reset();
      navigate("/login");
    } catch (err) {
      alert("❌ Failed to register user");
      console.error("Create user error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 🧍 Username Field */}
      <div>
        <label htmlFor="username">Name</label>
        <input
          {...register("username")}
          className="text-black"
          type="text"
          placeholder="Enter your name"
        />
        <p className="text-red-500">{errors.username?.message}</p>
      </div>

      {/* 🧑‍💼 Role Dropdown */}
      <div>
        <label htmlFor="role">Role</label>
        <select
          {...register("role")}
          className="text-black"
          defaultValue="" // 👈 Force placeholder option
        >
          <option value="" disabled>
            -- Select Role --
          </option>
          <option value="admin-seller">Admin Seller</option>
          <option value="seller">Seller</option>
          <option value="supplier">Supplier</option>
          <option value="customer">Customer</option>
        </select>
        <p className="text-red-500">{errors.role?.message}</p>
      </div>

      {/* 📧 Email Field */}
      <div>
        <label htmlFor="email">Email</label>
        <input
          {...register("email")}
          className="text-black"
          type="email"
          placeholder="example@mail.com"
        />
        <p className="text-red-500">{errors.email?.message}</p>
      </div>

      {/* 🔐 Password Field */}
      <div>
        <label htmlFor="password">Password</label>
        <input
          {...register("password")}
          className="text-black"
          type="password"
          placeholder="********"
        />
        <p className="text-red-500">{errors.password?.message}</p>
      </div>

      {/* 🚀 Submit Button */}
      <div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Connecting..." : "Register"}
        </button>
      </div>

      {/* ✅ Success Message */}
      {isSuccess && <p className="text-green-500">User added successfully</p>}
    </form>
  );
};

export default UserForm;
