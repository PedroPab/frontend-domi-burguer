import { LogoProps } from "@/components/ui/icons";

export interface Complement {
  id: number;
  name?: string;
  quantity: number;
  icon?: React.FC<LogoProps>;
  price?: number | null;
  type?: "removable" | "special" | "addable";
  additionId?: number; 
  minusId?: number;
}

export type Product = {
  id: number;
  name: string;
  price: number;
  body: string;
  bigImage: string;
  image1: string;
  image2?: string | null;
  quantity: number;
  icons: React.FC<LogoProps>[];
  complements: Complement[];
};
