import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export type Farm = {
  id: number;
  farmer: number;
  farmer_name: string;
  area_ha: number;
  district: string;
  upazila: string;
  land_type: string;
  crop_code: string;
  planting_date: string;
};

export type CreateFarmInput = {
  farmer: number;
  area_ha: number;
  district: string;
  upazila: string;
  land_type: string;
  crop_code: string;
  planting_date: string;
};

export type CreateFarmerInput = {
  name: string;
};

export type Farmer = {
  id: number;
  name: string;
};

export type ScenarioResult = {
  id: number;
  prediction: number;
  scenario_code: string;
  yield_t_per_ha: number;
  total_production_kg: number;
  revenue_bdt: number;
  total_cost_bdt: number;
  net_profit_bdt: number;
};

export type PredictionDetail = {
  prediction: {
    id: number;
    farm: number;
    market_price_bdt_per_kg: number;
    total_cost_bdt: number;
    baseline_yield_t_per_ha: number;
    created_at: string;
  };
  farmer_name: string;
  crop_code: string;
  scenarios: ScenarioResult[];
};

export type CreatePredictionInput = {
  farmer_name: string;
  area_ha: number;
  district: string;
  upazila: string;
  land_type: string;
  crop_code: string;
  planting_date: string;
  market_price_bdt_per_kg: number;
  total_cost_bdt: number;
};

export type CreatePredictionResponse = {
  success: boolean;
  prediction_id: number;
  farmer_name: string;
  crop_code: string;
  farm: {
    area_ha: number;
    district: string;
    upazila: string;
  };
  currency: string;
  scenarios: ScenarioResult[];
  is_prototype_estimate: boolean;
};

export type EconomicsInput = {
  area_ha: number;
  yield_t_per_ha: number;
  market_price_bdt_per_kg: number;
  total_cost_bdt: number;
};

export type EconomicsResult = {
  success: boolean;
  currency: string;
  area_ha: number;
  yield_t_per_ha: number;
  total_production_kg: number;
  revenue_bdt: number;
  total_cost_bdt: number;
  net_profit_bdt: number;
  is_prototype_estimate: boolean;
};

export const farmsApi = {
  health: () => api.get<{ status: string; service: string }>("/api/health/"),
  listFarms: () => api.get<Farm[]>("/api/farms/"),
  createFarm: (data: CreateFarmInput) => api.post<Farm>("/api/farms/", data),
  createFarmer: (data: CreateFarmerInput) =>
    api.post<Farmer>("/api/farmers/", data),
  getFarm: (pk: number) => api.get<Farm>(`/api/farms/${pk}/`),
};

export const predictionsApi = {
  createPrediction: (data: CreatePredictionInput) =>
    api.post<CreatePredictionResponse>("/api/predictions/", data),
  getPrediction: (pk: number) => api.get<PredictionDetail>(`/api/predictions/${pk}/`),
  calculateEconomics: (data: EconomicsInput) =>
    api.post<EconomicsResult>("/api/predictions/economics/calculate/", data),
};
