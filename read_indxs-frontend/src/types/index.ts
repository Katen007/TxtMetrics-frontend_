export interface IText {
  id: number;
  title: string;
  imageUrl?: string;
  description?: string;
  price: number;
  status?: boolean;
}

export interface IPaginatedTexts {
  items: IText[];
  total: number;
}

export interface ICrumb {
  label: string;
  path?: string;
  active?: boolean;
}

export interface CartIcon{
  draft_readIndxs_id?: number;
  texts_count: number;
}