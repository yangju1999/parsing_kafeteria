import { Cafeteria, MealInfo } from "./type";
import parseKaimaru from "./parseKaimaru";
import parseWest from "./parseWest";
import parseEast1 from "./parseEast1";
import parseEast2 from "./parseEast2";
import parseProfessor from "./parseProfessor";

const parseMenu = (data:MealInfo[], cafeteriaId: string): Cafeteria[] => {
  if (cafeteriaId == "fclt") //카이마루 
    {
      return parseKaimaru(data);
    }
  
  else if(cafeteriaId == "west") //서측 학생식당 
    {
      return parseWest(data);
    }

  else if(cafeteriaId == "east1") //동측 학생식당 
    {
      return parseEast1(data);
    }

  else if(cafeteriaId == "east2") //동측 교직원식당
    {
      return parseEast2(data);
    }

  else if(cafeteriaId == "emp") //교수회관 
    {
      return parseProfessor(data);
    }
    
  else{
    return parseKaimaru(data);
  }
}

export default parseMenu;

