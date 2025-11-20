import { Quotation, QuotationItem } from '@prisma/client';

export type FullQuotation = Quotation & {
  items: QuotationItem[];
};
