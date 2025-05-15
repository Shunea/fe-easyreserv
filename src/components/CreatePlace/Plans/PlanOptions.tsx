export const usePlanOptions = (t: (arg0: string) => any) => {
  const BasicPlanItems = [
    {
      text: t("PriceSubscriptionCard1D1"),
    },
    {
      text: t("PriceSubscriptionCard1D2"),
    },
    {
      text: t("PriceSubscriptionCard1D3"),
    },
    {
      text: t("PriceSubscriptionCard1D4"),
    },
  ];
  const StandardPlanItems = [
    {
      text: t("PriceSubscriptionCard2D1"),
    },
    {
      text: t("PriceSubscriptionCard2D2"),
    },
    {
      text: t("PriceSubscriptionCard2D3"),
    },
  ];
  const ProPlanItems = [
    {
      text: t("PriceSubscriptionCard3D1"),
    },
    {
      text: t("PriceSubscriptionCard3D2"),
    },
    {
      text: t("PriceSubscriptionCard3D3"),
    },
    {
      text: t("PriceSubscriptionCard3D4"),
    },
    {
      text: t("PriceSubscriptionCard3D5"),
    },
    {
      text: t("PriceSubscriptionCard3D6"),
    },
  ];
  const UltimatePlanItems = [
    {
      text: t("PriceSubscriptionCard4D1"),
    },
    {
      text: t("PriceSubscriptionCard4D2"),
    },
    {
      text: t("PriceSubscriptionCard4D3"),
    },
    {
      text: t("PriceSubscriptionCard4D4"),
    },
    {
      text: t("PriceSubscriptionCard4D5"),
    },
  ];
  return { BasicPlanItems, StandardPlanItems, ProPlanItems, UltimatePlanItems };
};

export default function PlanOptions() {
  return null;
}
