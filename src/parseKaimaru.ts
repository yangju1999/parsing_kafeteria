import { Cafeteria, CAFETERIAS, MealInfo, Meal, Dish, MealType, MealTime, ALLERGENS } from "./type";

const parseKaimaru = (data: MealInfo[]): Cafeteria[] => {
  let mealList:Meal[] = [];
  let mealInfoList:MealInfo[] = [];

  //lunch에 3개의 메뉴를 각각 분리해줌 
  let lunch = data[1];
  if (lunch['menu'].includes('A코너')){
    mealInfoList.push(data[0]);

    const sections = lunch['menu'].split(/(?=A코너|B코너)/);
    const temp1: MealInfo = {menu:sections[0], time:lunch['time']};
    mealInfoList.push(temp1);
    const temp2: MealInfo = {menu:sections[1], time:lunch['time']};
    mealInfoList.push(temp2);
    const temp3: MealInfo = {menu:sections[2], time:lunch['time']};
    mealInfoList.push(temp3);

    mealInfoList.push(data[2]);

  }
  else {
    mealInfoList = data; 
  }

  mealList=parseKaimaruMeals(mealInfoList);



  return [
    {
      name: CAFETERIAS["kaimaru"].name,
      location: CAFETERIAS["kaimaru"].location,
      meals: mealList,
      operatingHours: CAFETERIAS["kaimaru"].operatingHours,
    }, 
  ];
}

function parseKaimaruMeals(mealInfos: MealInfo[]): Meal[] {
  return mealInfos.map((mealInfo): Meal => {
    const { menu, time } = mealInfo;
    const lines = menu.split('\n').map(line => line.trim()).filter(line => line);

    let name = '';
    let price: number | undefined;
    let dishes: Dish[] = [];
    let calorie: number | undefined;
    let mealTime: MealTime = time.includes('8:00') ? '조식' : time.includes('11:30') ? '중식' : '석식';
    let mealType: MealType = '자율'; // Default value

    lines.forEach(line => {
      if (line.includes("A코너") || line.includes("B코너") || line.includes("자율") || line.includes("조식") ) {
        const match = line.match(/([^\(]+)\(([\d,]+)\)/);
        if (match) {
          name = match[1].trim(); // 첫 번째 캡쳐 그룹: 이름
          price = parseInt(match[2].replace(/,/g, '')); // 두 번째 캡쳐 그룹: 가격에서 콤마 제거 후 숫자 변환
          mealType = name as MealType;
      } else {
          name = '';
          price = 0;
      }

      } else if (line.includes("kcal")) {
        const calorieMatch = line.match(/\d+/);
        if (calorieMatch) {
          calorie = parseInt(calorieMatch[0]); // 추출된 숫자 문자열을 정수로 변환
      } else {
          calorie = 0; // 매치가 없을 경우 기본값으로 0 설정
      }
      } else if (line.includes("학생들의") || line.includes("제공합니다") || line.includes("부탁드립니다")){
        
      } 
      else {
        const dishParts = line.split('(');
        const dishName = dishParts[0].trim();
        const allergensListNumber = dishParts[1] ? dishParts[1].match(/\d+/g)!.map(Number) : [];
        const allergensList = allergensListNumber.map(index => ALLERGENS[index - 1]);

        dishes.push({
          name: dishName,
          allergens: allergensList,
          isHalal: false,
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

export default parseKaimaru;


