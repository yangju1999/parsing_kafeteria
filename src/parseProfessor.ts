import { Cafeteria, CAFETERIAS, MealInfo, Meal, Dish, MealType, MealTime, ALLERGENS } from "./type";

const parseProfessor = (data: MealInfo[]): Cafeteria[] => {
  let mealList:Meal[] = [];
  let mealInfoList:MealInfo[] = [];

  //lunch에 3개의 메뉴를 각각 분리해줌 

  data = data.filter(item => item.menu.trim() !== ''); //교수회관에는 조식 없음 
  if (data.length === 0) //주말에 운영안함  
    {
      return [
        {
          name: CAFETERIAS["faculty_cafeteria"].name,
          location: CAFETERIAS["faculty_cafeteria"].location,
          meals: mealList,
          operatingHours: CAFETERIAS["faculty_cafeteria"].operatingHours,
        }, 
      ];
    }
  const sections = data[0]['menu'].split('2층 자율배식')
  const temp1: MealInfo = {menu:sections[0], time:data[0]['time']};
  mealInfoList.push(temp1);
  const temp2: MealInfo = {menu: '2층 자율배식'+ sections[1], time:data[0]['time']};
  mealInfoList.push(temp2);

  mealInfoList.push(data[1]); //석식 

  mealList=parseProfessorMeals(mealInfoList);

  return [
    {
      name: CAFETERIAS["faculty_cafeteria"].name,
      location: CAFETERIAS["faculty_cafeteria"].location,
      meals: mealList,
      operatingHours: CAFETERIAS["faculty_cafeteria"].operatingHours,
    }, 
  ];
}

function parseProfessorMeals(mealInfos: MealInfo[]): Meal[] {
  return mealInfos.map((mealInfo): Meal => {
    const { menu, time } = mealInfo;
    const lines = menu.split('\n').map(line => line.trim()).filter(line => line);

    let name = '자율배식';
    let price: number | undefined;
    let dishes: Dish[] = [];
    let calorie: number | undefined;
    let mealTime: MealTime = time.includes('조식') ? '조식' : time.includes('중식') ? '중식' : '석식';
    let mealType: MealType = '자율'; // Default value

    lines.forEach(line => {
      if (line.includes("자율배식")) {
        if (line.includes("1층") ||  line.includes("2층")){
          name = line;
        }
        else{
          const temp=line.match(/\d{1,3}(,\d{3})*/);
          if(temp)
            {
              price = parseInt(temp[0].replace(/,/g, ''));
            }
          name = '자율배식'
        }
          
      }
      else if(line.startsWith('(')){
        const match = line.match(/\(([\d,]+)\)/)
        if(match)
          {
            price= parseInt(match[1].replace(/,/g, ''));
          }
      }
      else if (line.includes("kcal")) {
        const calorieMatch = line.match(/\d+/);
        if (calorieMatch) {
          calorie = parseInt(calorieMatch[0]); // 추출된 숫자 문자열을 정수로 변환
        } else {
          calorie = 0; // 매치가 없을 경우 기본값으로 0 설정
        }
      } 
      else if (line.includes("학생들") || line.includes("제공합니다") || line.includes("아침밥") || line.includes("드립니다")){
        
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

export default parseProfessor;