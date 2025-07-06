export interface Advertisement {
  id: string;
  created_at: string;
  image_url: string | null;
  promo_text: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
}

export interface AdvertisementResponse {
  data: Advertisement[] | null;
  error: any;
}

