export interface AffiliateLink {
  cardName: string;
  issuer: string;
  url: string;
  commission: string;
}

export const affiliateLinks: Record<string, AffiliateLink> = {
  "amex-business-platinum": {
    cardName: "Amex Business Platinum",
    issuer: "American Express",
    url: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/",
    commission: "$200-$450 per approval",
  },
  "amex-business-gold": {
    cardName: "Amex Business Gold",
    issuer: "American Express",
    url: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-gold-card-amex/",
    commission: "$100-$300 per approval",
  },
  "amex-gold": {
    cardName: "Amex Gold Card",
    issuer: "American Express",
    url: "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
    commission: "$75-$200 per approval",
  },
  "chase-ink-preferred": {
    cardName: "Chase Ink Business Preferred",
    issuer: "Chase",
    url: "https://creditcards.chase.com/business-credit-cards/ink/business-preferred",
    commission: "$100-$250 per approval",
  },
  "chase-sapphire-reserve": {
    cardName: "Chase Sapphire Reserve",
    issuer: "Chase",
    url: "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
    commission: "$100-$200 per approval",
  },
  "chase-sapphire-preferred": {
    cardName: "Chase Sapphire Preferred",
    issuer: "Chase",
    url: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
    commission: "$50-$150 per approval",
  },
  "capital-one-venture-x": {
    cardName: "Capital One Venture X",
    issuer: "Capital One",
    url: "https://www.capitalone.com/credit-cards/venture-x/",
    commission: "$75-$200 per approval",
  },
  "capital-one-venture": {
    cardName: "Capital One Venture",
    issuer: "Capital One",
    url: "https://www.capitalone.com/credit-cards/venture/",
    commission: "$50-$150 per approval",
  },
  "capital-one-spark-cash": {
    cardName: "Capital One Spark Cash Plus",
    issuer: "Capital One",
    url: "https://www.capitalone.com/small-business/credit-cards/spark-cash-plus/",
    commission: "$75-$200 per approval",
  },
};

export function getAffiliateUrl(cardName: string): string | null {
  const key = Object.keys(affiliateLinks).find((k) => {
    const link = affiliateLinks[k];
    return link.cardName.toLowerCase() === cardName.toLowerCase();
  });
  if (key) return affiliateLinks[key].url;

  const issuerMatch = cardName.toLowerCase();
  if (issuerMatch.includes("amex") || issuerMatch.includes("american express")) {
    return "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/";
  }
  if (issuerMatch.includes("chase")) {
    return "https://creditcards.chase.com/business-credit-cards";
  }
  if (issuerMatch.includes("capital one")) {
    return "https://www.capitalone.com/credit-cards/";
  }
  return null;
}
