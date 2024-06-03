import { Cafeteria, CAFETERIAS, MealInfo, Meal, Dish, MealType, MealTime, EXTENDED_ALLERGENS } from "./type";

const parseEast1 = (data: MealInfo[]): Cafeteria[] => {
  let mealList:Meal[] = [];
  let mealInfoList:MealInfo[] = [];

  
  // 조식
  if(data[0].menu.replace('미운영','').trim() != "")
  {
    splitBreakfast(data[0], mealInfoList);
  } 
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

  mealList=parseEast1Meals(mealInfoList);

  return [
    {
      name: CAFETERIAS["east_student"].name,
      location: CAFETERIAS["east_student"].location,
      meals: mealList,
      operatingHours: CAFETERIAS["east_student"].operatingHours,
    }, 
  ];
}

function parseEast1Meals(mealInfos: MealInfo[]): Meal[] {
  return mealInfos.map((mealInfo): Meal => {
    //<cafeteria>일때 
    if(mealInfo.menu.includes("<Cafeteria>"))
      {
        const { menu, time } = mealInfo;
        const lines = menu.split('\n').map(line => line.trim()).filter(line => line);
    
        let name = 'Cafeteria';
        let price = 0;
        let dishes: Dish[] = [];
        let calorie = 0;
        let mealTime: MealTime = time.includes('조식') ? '조식' : time.includes('중식') ? '중식' : '석식';
        let mealType: MealType = 'SELECTIVE_MEAL'; // Default value
    
        lines.forEach(line => {
          if (line.includes("<Cafeteria>")) {
            //<Cafeteria> 라인 제거
          }

          else if (line.includes("<Self") || line.includes("<수요") || line.includes("과일")){
            //<self bar>> 라인 제거 
          } 

          else {
            //dish 정보 
            let dishName = 'Unknwon Dish';
            let allergens: number[] = [];
            let isHalal = false;
            //dish 할랄 여부
            if (line.includes('할랄'))
              {
                isHalal = true;
                line = line.replace('(할랄)', '').trim();
              }
              if (line.includes('비건'))
                {
              
                  line = line.replace('(비건)', '').trim();
                }
            // dish 이름 
            if (line.includes('->'))
              {
                const parts = line.split('->');
                line = parts[parts.length-1].replace('변경', '').trim() + "원";
              }    

            let temp = line.match(/^[^\d\(\)]+/);
            if (temp)
              {
                dishName = temp[0].trim();
                dishName = dishName.replace('학생', '').trim();
              }
            if (line.includes('3구세트'))
              {
                dishName = '3구세트'
              }
            // 알러지 
            let allergensMatch = line.match(/\(([\d,]+)\)/);
            allergens = allergensMatch ? allergensMatch[1].split(',').map(Number) : [];
            
            // dish 가격 
            let priceMatch = line.match(/[\d,]+원/);
            let dishPrice = priceMatch ? parseInt(priceMatch[0].replace(/[^\d]/g, ''), 10) : 0;

            const allergensList = allergens.map(index => EXTENDED_ALLERGENS[index - 1]);
    
            dishes.push({
              name: dishName,
              allergens: allergensList,
              isHalal: isHalal,
              price: dishPrice,
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
      }
      // <cafeteria> 가 아닐때 
    else{ 
      const { menu, time } = mealInfo;
      const lines = menu.split('\n').map(line => line.trim()).filter(line => line);

      let name = '자율'; //Default value 
      let price: number | undefined;
      let dishes: Dish[] = [];
      let calorie = 0;
      let mealTime: MealTime = time.includes('조식') ? '조식' : time.includes('중식') ? '중식' : '석식';
      let mealType: MealType = '자율'; // Default value

      lines.forEach(line => {
        if (line.includes("<Self") || line.includes("<수요") || line.includes("과일") || line.includes("품 절")){
          //<self bar>> 라인 제거 
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
    }
  });
}

export default parseEast1;


function splitBreakfast(breakfast: MealInfo, mealInfoList: MealInfo[]){
  const menu = breakfast.menu;

  if (menu.includes('<아메')){
    const korean = menu.substring(menu.indexOf('<한식'), menu.indexOf('<아메'));
    const american = menu.substring(menu.indexOf('<아메'), menu.indexOf('<하루'));

    const temp1: MealInfo = {menu:korean, time:breakfast['time']};
    const temp2: MealInfo = {menu:american, time:breakfast['time']};
    mealInfoList.push(temp1);
    mealInfoList.push(temp2);
  }
  
  else if(menu.includes('<하루')){
    const korean = menu.substring(menu.indexOf('<한식'), menu.indexOf('<하루'));
    const temp1: MealInfo = {menu:korean, time:breakfast['time']};
    mealInfoList.push(temp1);
  }

  else{
    mealInfoList.push(breakfast);
  }
}

function splitLunch(lunch: MealInfo, mealInfoList: MealInfo[]){
  const menu = lunch.menu;
  //평일
  if (menu.includes('<Cafe')){
    const korean = menu.substring(menu.indexOf('<Cafe'), menu.indexOf('<일품코너 1'));
    const single1 = menu.substring(menu.indexOf('<일품코너 1'), menu.indexOf('<일품코너 2'));
    const single2 = menu.substring(menu.indexOf('<일품코너 2'));

    const temp1: MealInfo = {menu:korean, time:lunch['time']};
    const temp2: MealInfo = {menu:single1, time:lunch['time']};
    const temp3: MealInfo = {menu:single2, time:lunch['time']};

    mealInfoList.push(temp1);
    mealInfoList.push(temp2);
    mealInfoList.push(temp3);
  }
  //주말
  else{
    mealInfoList.push(lunch);
  }
}

function splitDinner(dinner: MealInfo, mealInfoList: MealInfo[]){
  const menu = dinner.menu;
  //평일
  if (menu.includes('<일품')){
    const korean = menu.substring(menu.indexOf('<Cafe'), menu.indexOf('<일품코너'));
    const single = menu.substring(menu.indexOf('<일품코너'));

    const temp1: MealInfo = {menu:korean, time:dinner['time']};
    const temp2: MealInfo = {menu:single, time:dinner['time']};
    mealInfoList.push(temp1);
    mealInfoList.push(temp2);
  }
  
  //주말
  else{
    mealInfoList.push(dinner);
  }
}


