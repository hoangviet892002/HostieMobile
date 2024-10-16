import { ResidencesRequest } from "@/types/request/ResidencesRequest";
import { Residence } from "@/types/response/Residences";
import { endPoint } from "@/utils/endPoint";
import axiosCore from "@/utils/httpCore";

interface InfoResponse<T> {
  data: T;
  msg: string;
  success: boolean;
  error_code: string | null;
}

interface Residences {
  residences: Residence[];
  total_pages: number;
}
interface deleteResidence {
  id: string;
}

//residences
const postResidence = async (
  data: ResidencesRequest
): Promise<InfoResponse<any>> => {
  if (data.step === 5) {
    //multipart/form-data
    const formData = new FormData();
    //  interface ResidencesStep5 {
    //   step: number;
    //   id: string;
    //   files: File[];
    // }

    formData.append("id", data.id);
    data.files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("step", "5");
    console.log("formData", formData);
    return await axiosCore.post(endPoint.residences.post, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
  return await axiosCore.post(endPoint.residences.post, data);
};

const getResidences = async (
  page_size: number,
  page: number
): Promise<InfoResponse<Residences>> => {
  return await axiosCore.get(endPoint.residences.get(page_size, page + 1));
};
const getResidence = async (id: string): Promise<InfoResponse<any>> => {
  return await axiosCore.get(`${endPoint.residences.getResidenceById(id)}`);
};

const getImages = async (id: string): Promise<InfoResponse<any>> => {
  return await axiosCore.get(`${endPoint.residences.getImages(id)}`);
};
const getPrice = async (id: string): Promise<InfoResponse<any>> => {
  return await axiosCore.get(`${endPoint.residences.getPrice(id)}`);
};
const deleteResidenc = async (
  data: deleteResidence
): Promise<InfoResponse<any>> => {
  return await axiosCore.delete(`${endPoint.residences.delete}`);
};
export {
  postResidence,
  getResidences,
  getResidence,
  getImages,
  getPrice,
  deleteResidenc,
};
