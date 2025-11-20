import type {
  ClientActionDto,
  CreateQuotationDto,
  UpdateQuotationDto,
} from "@/types/api";
import api from "../lib/axios";

export const quotationApi = {
  create: (data: CreateQuotationDto) => api.post("/quotations", data),

  listForAdmin: (take = 50, skip = 0) =>
    api.get(`/quotations/admin?take=${take}&skip=${skip}`),

  getOne: (id: string) => api.get(`/quotations/${id}`),

  update: (id: string, dto: UpdateQuotationDto) =>
    api.put(`/quotations/${id}`, dto),

  remove: (id: string) => api.delete(`/quotations/${id}`),

  sendEmail: (id: string, email: string) =>
    api.post(`/quotations/${id}/send`, { email }),

  stats: () => api.get("/quotations/admin/stats"),

  publicView: (id: string) => api.get(`/quotations/${id}/public`),

  clientRespond: (id: string, dto: ClientActionDto) =>
    api.post(`/quotations/${id}/respond`, dto),
};
