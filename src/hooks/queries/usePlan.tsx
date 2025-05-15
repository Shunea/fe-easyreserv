// usePlanAnnually.ts
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import api from "../../auth/api/apiInstance";
import { PlanBody } from "../../auth/types/index";

export const getPlanAnnually = async () => {
  const { data } = await api.get<PlanBody[]>(
    `/plan?businessType=RESTAURANT&billingPeriod=ANNUALLY`,
    {}
  );
  return data;
};

export const usePlanAnnually = (options?: UseQueryOptions<PlanBody[], Error>) => {
  return useQuery<PlanBody[], Error>(["plan", "annually"], () => getPlanAnnually(), options);
};

// usePlanMonthly.ts

export const getPlanMonthly = async () => {
  const { data } = await api.get<PlanBody[]>(
    `/plan?businessType=RESTAURANT&billingPeriod=MONTHLY`,
    {}
  );
  return data;
};

export const usePlanMonthly = (options?: UseQueryOptions<PlanBody[], Error>) => {
  return useQuery<PlanBody[], Error>(["plan", "monthly"], () => getPlanMonthly(), options);
};
