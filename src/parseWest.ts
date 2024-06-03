import { Cafeteria, CAFETERIAS, MealInfo, Meal, Dish, MealType, MealTime, ALLERGENS } from "./type";

const parseWest = (data: MealInfo[]): Cafeteria[] => {
  let mealList:Meal[] = [];
  let mealInfoList:MealInfo[] = [];

  //lunch에 3개의 메뉴를 각각 분리해줌 
  mealInfoList.push(data[0]);

  if (data[1]['menu'].includes('\n\n')){
    const sections = data[1]['menu'].split('\n\n').map(section => section.trim())
    const temp1: MealInfo = {menu:sections[0], time:data[1]['time']};
    mealInfoList.push(temp1);
    const temp2: MealInfo = {menu:sections[1], time:data[1]['time']};
    mealInfoList.push(temp2);
  }

  else{
    mealInfoList.push(data[1]);
  }

  if (data[2]['menu'].includes('\n\n')){
    const sections = data[2]['menu'].split('\n\n').map(section => section.trim())
    const temp1: MealInfo = {menu:sections[0], time:data[2]['time']};
    mealInfoList.push(temp1);
    const temp2: MealInfo = {menu:sections[1], time:data[2]['time']};
    mealInfoList.push(temp2); 

  }

  else {
    mealInfoList.push(data[2]);
  }

  mealList=parseWestMeals(mealInfoList);

  console.log('\n\nmealList:');
  console.log(mealList);
  console.log(mealList[0]['dishes']);


  return [
    {
      name: CAFETERIAS["west"].name,
      location: CAFETERIAS["west"].location,
      meals: mealList,
      operatingHours: CAFETERIAS["west"].operatingHours,
    }, 
  ];
}

function parseWestMeals(mealInfos: MealInfo[]): Meal[] {
  return mealInfos.map((mealInfo): Meal => {
    const { menu, time } = mealInfo;
    const lines = menu.split('\n').map(line => line.trim()).filter(line => line);

    let name = '자율';
    let price: number | undefined;
    let dishes: Dish[] = [];
    let calorie: number | undefined;
    let mealTime: MealTime = time.includes('8:00') ? '조식' : time.includes('11:30') ? '중식' : '석식';
    let mealType: MealType = '자율'; // Default value

    lines.forEach(line => {
      if (line.includes("일품") || line.includes("한식") || line.includes("자율") || line.includes("한삭")) {
        const match = line.match(/([^\[]+)\[(\d+)원\]/);
        if (match) {
          name = match[1].trim(); // 첫 번째 캡쳐 그룹: 이름
          price = parseInt(match[2].replace(/원/g, '')); // 두 번째 캡쳐 그룹: 가격에서 콤마 제거 후 숫자 변환
          mealType = name as MealType;
      } else {
          name = '자율';
          price = 0; //서측 식당 자율 메뉴 가격? 
      }

      } else if (line.includes("kcal")) {
        const calorieMatch = line.match(/\d+/);
        if (calorieMatch) {
          calorie = parseInt(calorieMatch[0]); // 추출된 숫자 문자열을 정수로 변환
      } else {
          calorie = 0; // 매치가 없을 경우 기본값으로 0 설정
      }
      } else if (line.includes("학생들") || line.includes("제공합니다") || line.includes("아침밥") || line.includes("드립니다")){
        
      } 
      else {
        let match = line.match(/[^\d\.]+/)
        const dishName = match ? match[0].trim() : line; // 숫자와 점을 제외한 모든 문자를 추출, 없다면 그대로 dishName 
        match = line.match(/[\d\.]+/)
        const allergensListNumber = match ? match[0].split('.').map(Number) : []; // 점으로 구분된 숫자들을 배열로 변환
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

export default parseWest;


