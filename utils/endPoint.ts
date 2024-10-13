const baseURL = "http://34.81.244.146:8080";
const endPoint = {
  user: {
    updateUserById: (userId: any) => `/v1/api/users/update/${userId}`,
    getUserById: (userId: any) => `/v1/api/users/update/${userId}`,
    signUp: `/v1/api/users/sign-up`,
    signIn: `/v1/api/auth/sign-in`,
    info: `/v1/api/users/my-info`,
    update: `/v1/api/users/update`,
  },
  admin: {
    ///user mangament
    getAllUser: `/v1/api/users`,

    ///role management
    createNewRole: `/v1/api/roles`,
    deleteRole: (id: any) => `/v1/api/roles/${id}`,
  },
};

export { endPoint, baseURL };
