export interface MealInfo {
  menu: string;
  time: string;
}


export interface Cafeteria {
  name: string,
  location: string,
  meals: Meal[],
  operatingHours: OperatingHour[]
}

export interface Meal {
  name: string,
  price?: number,
  dishes: Dish[],
  calorie?: number
  mealTime: MealTime,
  mealType: MealType,
}

export interface Dish {
  name: string,
  allergens: Allergen[],
  isHalal: boolean,
  price?: number
}

export interface OperatingHour {
  dayOfWeek: DayOfWeek,
  mealTime: MealTime,
  start: number,
  end: number
}

export interface UserInfo {
  email: string,
  name: string,
  preferredDish: Dish[],
  preferredCafeteria: Cafeteria[],
  isHalal: boolean,
  allergenGroups: AllergenGroup[],
  selectedAllergens: Allergen[]
}

export interface AllergenGroup {
  name: string,
  allergens: Allergen[]
}


export type Allergen = "난류" | "우유" | "메밀" | "땅콩" | "대두" | "밀" | "고등어" |
  "게" | "새우" | "돼지고기" | "복숭아" | "토마토" | "아황산류" |
  "호두" | "닭고기" | "쇠고기" | "오징어" | "조개류" | "잣"  | "굴" | "전복" | "홍합" | "UNKNOWN"
export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"
export type MealType = "SELF_DISTRIBUTION" | "SINGLE_DISH" | "SELECTIVE_MEAL" | "FREE" | '자율' | 'A코너' | 'B코너' | '일품'
export type MealTime = "조식" | "중식" | "석식" | "기타"

export const ALLERGENS: Allergen[] = [
  "난류", "우유", "메밀", "땅콩", "대두", "밀", "고등어",
  "게", "새우", "돼지고기", "복숭아", "토마토", "아황산류",
  "호두", "닭고기", "쇠고기", "오징어", "조개류", "잣"
]

export const EXTENDED_ALLERGENS: Allergen[] = [
  "난류", "우유", "메밀", "땅콩", "대두", "밀", "고등어",
  "게", "새우", "돼지고기", "복숭아", "토마토", "아황산류",
  "호두", "닭고기", "쇠고기", "오징어", "조개류", "굴", "전복", "홍합", "잣"
]


export const VEGETERIAN_GROUPS: { [key: string]: AllergenGroup } = {
  "락토": {
    name: "락토",
    allergens: ["난류", "돼지고기", "닭고기", "쇠고기"]
  },
  "락토오보": {
    name: "락토오보",
    allergens: ["고등어", "게", "새우", "오징어", "조개류", "돼지고기", "닭고기", "쇠고기"]
  },
  "페스코": {
    name: "페스코",
    allergens: ["돼지고기", "닭고기", "쇠고기"]
  }
}

export const CAFETERIAS:{[key: string]: Cafeteria} = {
  "kaimaru": {
      name: "카이마루",
      location: "TODO",
      meals: [],
      operatingHours: []
  },
  "faculty_cafeteria": {
      name: "교수회관",
      location: "TODO",
      meals: [],
      operatingHours: []
  },
  "west": {
      name: "서측 학생식당",
      location: "TODO",
      meals: [],
      operatingHours: []
  },
  "east_student": {
      name: "동측 학생식당",
      location: "TODO",
      meals: [],
      operatingHours: []
  },
  "east_employee": {
      name: "동측 교직원식당",
      location: "TODO",
      meals: [],
      operatingHours: []
  },
}
