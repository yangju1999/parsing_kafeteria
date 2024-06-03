import { Cafeteria, CAFETERIAS, MealInfo, Meal, Dish, MealType, MealTime, EXTENDED_ALLERGENS } from "./type";

const parseEast2 = (data: MealInfo[]): Cafeteria[] => {
  let mealList:Meal[] = [];
  let mealInfoList:MealInfo[] = [];

  // 동측 교직원 식당은 조식 없음 

  //중식
  if(data[1].menu.replace('미운영','').trim() != "")
    {
      splitLunch(data[1], mealInfoList);
    } 
  //석식
  if(data[2].menu.replace('미운영','').trim() != "")
    {
      splitDinner(data[2], mealInfoList);
    } 

  mealList=parseEast2Meals(mealInfoList);

  /*
  console.log('\n\nmealList:');
  console.log(mealList);
  console.log(mealList[0]['dishes']);
*/

  return [
    {
      name: CAFETERIAS["east_employee"].name,
      location: CAFETERIAS["east_employee"].location,
      meals: mealList,
      operatingHours: CAFETERIAS["east_employee"].operatingHours,
    }, 
  ];
}

function parseEast2Meals(mealInfos: MealInfo[]): Meal[] {
  return mealInfos.map((mealInfo): Meal => {
    const { menu, time } = mealInfo;
    const lines = menu.split('\n').map(line => line.trim()).filter(line => line);

    let name = '자율'; //Default value 
    let price: number | undefined;
    let dishes: Dish[] = [];
    let calorie = 0;
    let mealTime: MealTime = time.includes('조식') ? '조식' : time.includes('중식') ? '중식' : '석식';
    let mealType: MealType = '자율'; // Default value

    lines.forEach(line => {
      if (line.includes("-교수전용-")){
        //-교수전용- 라인 제거 
      } 
      else if (line.includes('<') && line.includes('원>')) {
        const match = line.match(/<([^>]+) (\d+[,]?\d*)원>/);
        if (match) {
          name = match[1].trim().replace(/,/g, '');
          price = parseInt(match[2].replace(/,/g, ''));
          mealType = name as MealType;
        }
      } 

      else {
        let isHalal = false;
        if (line.includes('(할랄)'))
          {
            isHalal = true;
            line = line.replace('(할랄)', '').trim();
          }
          if (line.includes('(비건)'))
            {
              isHalal = true;
              line = line.replace('(비건)', '').trim();
            }

        const dishNameMatch = line.match(/^[^\(\d\)]+/);
        const dishName = dishNameMatch ? dishNameMatch[0].trim() : "Unknown Dish";
        const allergensMatch = line.match(/\(([\d,]+)\)/);
        const allergens = allergensMatch ? allergensMatch[1].split(',').map(Number) : [];
        const allergensList = allergens.map(index => EXTENDED_ALLERGENS[index - 1]);
        

        dishes.push({
          name: dishName,
          allergens: allergensList,
          isHalal: isHalal,
        });
      }
    });

    return {
      name,
      price,
      dishes,
      calorie,
      mealTime,
      mealType,
    };
  });
}

export default parseEast2;


function splitLunch(lunch: MealInfo, mealInfoList: MealInfo[]){
  const menu = lunch.menu;
  //평일
  if (menu.includes('<교수전용')){
    const special = menu.substring(menu.indexOf('<특식'), menu.indexOf('<셋트'));
    const setmenu = menu.substring(menu.indexOf('<셋트'), menu.indexOf('<교수전용')-2); // ** 때문에 -2 
    const professor = menu.substring(menu.indexOf('<교수전용'));

    const temp1: MealInfo = {menu:special, time:lunch['time']};
    const temp2: MealInfo = {menu:setmenu, time:lunch['time']};
    const temp3: MealInfo = {menu:professor, time:lunch['time']};

    mealInfoList.push(temp1);
    mealInfoList.push(temp2);
    mealInfoList.push(temp3);
  }
  //주말
  else{
    const special = menu.substring(menu.indexOf('<특식'), menu.indexOf('<셋트'));
    const setmenu = menu.substring(menu.indexOf('<셋트'));  

    const temp1: MealInfo = {menu:special, time:lunch['time']};
    const temp2: MealInfo = {menu:setmenu, time:lunch['time']};

    mealInfoList.push(temp1);
    mealInfoList.push(temp2);
  }
}

function splitDinner(dinner: MealInfo, mealInfoList: MealInfo[]){
  const menu = dinner.menu;
  //평일
  if (menu.includes('<셋트')){
    const setmenu = menu.substring(menu.indexOf('<셋트'));

    const temp1: MealInfo = {menu:setmenu, time:dinner['time']};

    mealInfoList.push(temp1);
  }
}