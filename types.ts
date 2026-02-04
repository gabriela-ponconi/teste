
export enum BagType {
  SECA = 'SECA',
  GELADA = 'GELADA',
  GENERICO = 'GENERICO'
}

export enum LabelMode {
  IFOOD = 'IFOOD',
  COMPRA = 'COMPRA',
  PLACA = 'PLACA'
}

export interface LabelData {
  title: string;       // Número do pedido, Número da compra ou Título da Placa
  clientName?: string; // Nome do cliente
  type: BagType;
  currentVolume: number;
  totalVolumes: number;
  dryTotal: number;    
  coldTotal: number;   
  mode: LabelMode;
}
