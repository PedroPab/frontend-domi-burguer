import { LogoProps } from "@/components/ui/icons";

export interface Complement {
  id: number;
  name?: string;
  quantity: number;
  icon?: React.FC<LogoProps>;
  price?: string | null;
  type?: "removable" | "special" | "addable";
  additionId?: number; 
  minusId?: number;
}

export type Product = {
  id: number;
  name: string;
  price: number;
  body: string;
  image: string;
  icons: React.FC<LogoProps>[];
  complements: Complement[];
};
