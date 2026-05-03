import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { BowlMap } from "./components/BowlMap";
import { NGODonation } from "./components/NGODonation";
import { AnimalHomes } from "./components/AnimalHomes";
import { FoodGuide } from "./components/FoodGuide";
import { VacancyBoard } from "./components/VacancyBoard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: BowlMap },
      { path: "donate", Component: NGODonation },
      { path: "homes", Component: AnimalHomes },
      { path: "food-guide", Component: FoodGuide },
      { path: "vacancies", Component: VacancyBoard },
    ],
  },
]);
