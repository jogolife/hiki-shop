/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  category: string;
  affiliateLink: string;
  rating: number;
  reviewsCount: number;
  isDailyDeal?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  reviews?: Review[];
  brand?: string;
  attributes?: Record<string, string>;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AffiliateClick {
  productId: string;
  productTitle: string;
  clickCount: number;
  lastClicked: string;
}
