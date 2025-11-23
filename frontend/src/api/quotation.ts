import api from "../lib/axios";
import { toast } from "sonner";
import type {
  ClientActionDto,
  CreateQuotationDto,
  UpdateQuotationDto,
} from "@/types/api";

export const quotationApi = {
  create: async (data: CreateQuotationDto) => {
    const res = await api.post("/quotations", data);
    toast.success("Quotation created!");
    return res.data;
  },

  listForAdmin: (take = 50, skip = 0) =>
    api.get(`/quotations/admin?take=${take}&skip=${skip}`),

  getOne: (id: string) => api.get(`/quotations/${id}`),

  update: async (id: string, dto: UpdateQuotationDto) => {
    const res = await api.put(`/quotations/${id}`, dto);
    toast.success("Quotation updated!");
    return res.data;
  },

  remove: async (id: string) => {
    await api.delete(`/quotations/${id}`);
    toast.success("Quotation deleted");
  },

  sendEmail: async (id: string, email: string) => {
    const res = await api.post(`/quotations/${id}/send`, { email });
    toast.success("Email sent to client!");
    return res.data;
  },

  stats: () => api.get("/quotations/admin/stats"),

  publicView: (id: string) => api.get(`/quotations/${id}/public`),

  clientRespond: async (id: string, dto: ClientActionDto) => {
    const res = await api.post(`/quotations/${id}/respond`, dto);

    toast.success(
      dto.status === "APPROVED" ? "Quotation approved!" : "Quotation rejected!"
    );
    return res.data;
  },
};
