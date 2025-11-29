export interface IText {
  id?: number;
  title?: string;
  image_url?: string;
  description?: string;
  price?: number;
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
export interface BreadcrumbsProps {
  crumbs: ICrumb[];
}

export interface TextCardProps {
    factor: IText;
}
export interface FilterState {
  serviceFilter: string;
}