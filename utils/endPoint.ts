const baseURL = "http://34.81.244.146:8080";
const coreURL = "http://34.81.244.146:5005";
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
  region: {
    getProvinces: `/region/provinces`,
    getDistricts: (id: string) => `/region/districts/${id}`,
    getWards: (id: string) => `/region/wards/${id}`,
  },
  type: {
    getTypes: `/residences/types`,
  },
  icon: {
    getIcons: `/amenities/icon`,
  },
};

export { endPoint, baseURL, coreURL };
