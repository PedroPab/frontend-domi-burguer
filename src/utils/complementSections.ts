import {
  CarneIcon,
  FrenchFriesIcon,
  LechugaIcon,
  PicklesIcon,
  QuesoIcon,
  SouceIcon,
  TocinetaIcon,
  TomateIcon,
  LogoProps,
  AjoIcon,
  CebollaIcon

} from "@/components/ui/icons";
import { Complement } from "@/types/products";
import { CupSoda } from "lucide-react";
const iconMap: { [key: string]: React.FC<LogoProps> } = {
  CarneIcon,
  FrenchFriesIcon,
  LechugaIcon,
  CebollaIcon,
  PicklesIcon,
  QuesoIcon,
  SouceIcon,
  TocinetaIcon,
  TomateIcon,
  CupSoda,
  AjoIcon,
};


// FAVORITOS - Ingredientes principales
const favoritosData: Complement[] = [
  {
    id: 1002,
    name: "Carne",
    price: 6500,
    icon: "CarneIcon",
    quantity: 1,
    type: "special",
    additionId: 4,
    minusId: 20,
    minusComplement: false,
  },
  {
    id: 244,
    name: "Queso americano",
    price: 3000,
    icon: "QuesoIcon",
    quantity: 1,
    type: "special",
    additionId: 5,
    minusId: 24,
    minusComplement: false,
  },
  {
    id: 666,
    name: "Tocineta",
    price: 4000,
    icon: "TocinetaIcon",
    quantity: 1,
    type: "special",
    additionId: 6,
    minusId: 18,
    minusComplement: false,
  },
  {
    id: 7,
    name: "Papas rizadas",
    price: 6000,
    icon: "FrenchFriesIcon",
    quantity: 0,
    type: "addable",
    additionId: 7,
    minusComplement: false,
  },
];

// OTROS - Ingredientes secundarios y vegetales
const otrosData: Complement[] = [
  {
    id: 288,
    name: "Pepinillos",
    price: null,
    icon: "PicklesIcon",
    quantity: 1,
    type: "special",
    additionId: 28,
    minusId: 13,
    minusComplement: false,
  },
  {
    id: 289,
    name: "Cebolla",
    price: null,
    icon: "AjoIcon",
    quantity: 1,
    type: "special",
    additionId: 32,
    minusId: 11,
    minusComplement: false,
  },
  {
    id: 14,
    name: "Lechuga",
    price: null,
    icon: "LechugaIcon",
    quantity: 1,
    type: "special",
    additionId: 29,
    minusId: 14,
    minusComplement: false,
  },
  {
    id: 300,
    name: "Tomate",
    price: null,
    icon: "TomateIcon",
    quantity: 1,
    type: "special",
    additionId: 30,
    minusId: 12,
    minusComplement: false,
  },
  {
    id: 23,
    name: "Sala de Ajo",
    price: null,
    icon: "AjoIcon",
    quantity: 1,
    type: "removable",
    additionId: 3,
    minusId: 23,
    minusComplement: false,
  },
  {
    id: 22,
    name: "Sala Roja",
    price: null,
    icon: "SouceIcon",
    quantity: 1,
    type: "removable",
    additionId: 8,
    minusId: 22,
    minusComplement: false,
  },
  {
    id: 71,
    name: "1 oz Salsa de Ajo",
    price: 2000,
    icon: "AjoIcon",
    quantity: 0,
    type: "addable",
    additionId: 3,
    minusComplement: false,
  },
  {
    id: 72,
    name: "1 oz salsa roja",
    price: 1500,
    icon: "TomateIcon",
    quantity: 0,
    type: "addable",
    additionId: 8,
    minusComplement: false,
  },
  {
    id: 73,
    name: "Sin vegetales",
    price: null,
    icon: "LechugaIcon",
    quantity: 0,
    type: "addable",
    additionId: 19,
    minusComplement: false,
  },

];

// GASEOSAS - Bebidas
const gaseosasData: Complement[] = [
  {
    id: 10,
    name: "Coca-Cola personal",
    price: 4000,
    icon: "CupSoda",
    quantity: 0,
    type: "addable",
    additionId: 10,
    minusComplement: false,
  },
  {
    id: 9,
    name: "Coca-Cola 1/ litro",
    price: 9000,
    icon: "CupSoda",
    quantity: 0,
    type: "addable",
    additionId: 9,
    minusComplement: false,
  },
];


export {
     favoritosData,
     otrosData,
     gaseosasData,
     iconMap
};