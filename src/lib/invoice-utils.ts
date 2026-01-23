
export const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
    "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
] as const;

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}

export function formatDate(dateStr: string): string {
    if (!dateStr) return "-"
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    })
}

export function calculateGST(subtotal: number, rate: number, isInterState: boolean) {
    const gstAmount = (subtotal * rate) / 100;

    if (isInterState) {
        return {
            cgst: 0,
            sgst: 0,
            igst: gstAmount,
            totalTax: gstAmount
        };
    } else {
        return {
            cgst: gstAmount / 2,
            sgst: gstAmount / 2,
            igst: 0,
            totalTax: gstAmount
        };
    }
}

export function generateNextInvoiceNumber(lastNumber: string | null, agencyPrefix: string = "INV") {
    const year = new Date().getFullYear();
    const prefix = `${agencyPrefix}/${year}/`;

    if (!lastNumber || !lastNumber.startsWith(prefix)) {
        return `${prefix}0001`;
    }

    const parts = lastNumber.split("/");
    const lastSeq = parseInt(parts[parts.length - 1]);

    if (isNaN(lastSeq)) return `${prefix}0001`;

    const nextSeq = (lastSeq + 1).toString().padStart(4, "0");
    return `${prefix}${nextSeq}`;
}
