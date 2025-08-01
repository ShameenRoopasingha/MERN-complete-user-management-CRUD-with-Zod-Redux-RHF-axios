import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../services/axiosBaseQuery";

//Setup RTKQ Api
export const userApi = createApi({
  // key that assign reducer of redux store
  reducerPath: "userApi",

  //Save axios base query function
  baseQuery: axiosBaseQuery({
    baseUrl: "http://localhost:5000/api/users",
  }),

  // define tag for support caching
  tagTypes: ["User"],

  // define Api endpoints
  endpoints: (builder) => ({
    //Get/Api/users
    getUsers: builder.query<any, void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["User"], //cache control,
    }),

    //POST/api/users
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        data: newUser,
      }),
      invalidatesTags: ["User"],
    }),

    // PUT / api/users/:id
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["User"],
    }),

    //DELETE/api/users/:id
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    //POST/api/users/login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        data: credentials,
      }),
    }),
  }),
});

// export auto generated hooks
export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useLoginMutation,
} = userApi;
