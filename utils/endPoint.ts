import { getPrice, getResidence } from "@/apis/residences";
import { transform } from "@babel/core";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const baseURL = "http://34.81.244.146:8080";
const coreURL = "http://34.81.244.146:5005";
const socketURL = "http://34.81.244.146:3333";
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
  residences: {
    post: "/residences",
    get: (page_size: number, page: number) =>
      `/residences?page_size=${page_size}&page=${page}`,
    getResidenceById: (id: string) => `/residences/${id}`,
    getImages: (id: string) => `/residences/${id}/images`,
    getPrice: (id: string) => `/residences/${id}/prices`,
    delete: `/residences`,
    getCalendar: (ids: string, time: string) =>
      `/residences/calendar/?ids=${ids}&month=${time}`,
    getBlocks: (id: string) => `/residences/block/${id}`,
    postBlock: `/residences/block`,
    deleteBlock: (id: string) => `/residences/block?ids=${id}`,
    getResidencesBySeller: (page: number, checkin: string, checkout: string) =>
      `/residences/seller?page=${page}&checkin=${checkin}&checkout=${checkout}`,
  },
  booking: {
    book: "/booking",
    hold: "/booking/hold",
    getPrice: `/booking/price_quotation`,
    getHoldsForHost: (page: number) => `/booking/hold/host?page=${page}`,
    getBooksForHost: (page: number) => `/booking/host?page=${page}`,
    acceptHold: `/booking/hold/accept`,
    getHold: (page: number) => `/booking/hold?page=${page}`,
    getBooking: (page: number) => `/booking?page=${page}`,
    getDetailBooking: (id: string) => `/booking/${id}`,
    acceptBooking: `/booking/accept`,
    sellerTransfer: `/booking/transfer`,
    hostReceive: `/booking/receive`,
    sellerCancel: `/booking/cancel`,
  },
  customer: {
    create: `/customers`,
    getAll: `/customers`,
    update: (id: string) => `/customers/${id}`,
    delete: (id: string) => `/customers/${id}`,
  },
};

export { endPoint, baseURL, coreURL, socketURL };
