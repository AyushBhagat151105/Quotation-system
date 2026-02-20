import { Quotation, QuotationItem } from '../generated/prisma/client';

export type FullQuotation = Quotation & {
  items: QuotationItem[];
};
