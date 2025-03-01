export type Article = {
  id: string;
  title: string;
  description: string;
  image: string;
  labels?: Labels;
};

export type Labels = {
  label_name: string;
  label_catagory: string;
  label_color?: any;
};

export interface ArticlesFilter {
  filter: string;
  setFilter: (value: string) => void;
  articlesPerPage: number;
  setArticlesPerPage: (value: number) => void;
  view: "grid" | "row";
  setView: (value: "grid" | "row") => void;
}