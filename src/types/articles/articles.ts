import type { Dispatch, SetStateAction } from "react";

export interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  labels?: Labels;
}

export interface Labels {
  label_name: string;
  label_catagory: string;
  label_color?: string;
}

export interface ArticlesFilter {
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  articlesPerPage: number;
  setArticlesPerPage: Dispatch<SetStateAction<number>>;
  view: "grid" | "row";
  setView: Dispatch<SetStateAction<"grid" | "row">>;
}
