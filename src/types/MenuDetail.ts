export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_available: boolean;
  created_at: string;
}
export interface Item {
  id: string;
  menu_item_id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
export interface Reviews {
  items: Item[];
  total: number;
  averageRating: number;
}

export interface MenuDetailResponse {
  menuItem: MenuItem;
  reviews: Reviews;
}
