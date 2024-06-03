/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import parseMenu from './parseMenu'
import cheerio from 'cheerio';

// The Cloud Functions for Firebase SDK to set up triggers and logging.
const {onSchedule} = require("firebase-functions/v2/scheduler");

// The Firebase Admin SDK to delete inactive users.
const admin = require("firebase-admin");
admin.initializeApp();

// Run once a day at midnight, to clean up the users
// Manually run the task here https://console.cloud.google.com/cloudscheduler
exports.updateMenu = onSchedule("every day 00:00", async () => {
    const restaurant_list: string[] = ['east1', 'east2', 'emp', 'fctl', 'west']
    const db = admin.firestore();
    const menuCollection = db.collection('weeklyMenus');
    const today = new Date();

    let data_parsed
    try {
      for (const restaurant of restaurant_list){
        for (let dayOffset =0; dayOffset < 7; dayOffset++)
          {
            const date = new Date(today);
            date.setDate(today.getDate() + dayOffset);
            const dateString = date.toISOString().split('T')[0]; //'YYYY-MM-DD' 형식
            const url = `https://www.kaist.ac.kr/kr/html/campus/053001.html?dvs_cd=${restaurant}&stt_dt=${dateString}`
            const data = await getData(url); //데이터 스크래핑 

            if(data){
              data_parsed = parseMenu(data, restaurant) //데이터 파싱(output 형식은 Cafeteria[])
              await menuCollection.add({ //firestore에 저장 
                date: dateString,
                restaurant: restaurant,
                data: data_parsed
              })
            } 
          }
      }
        } catch (error) {
            console.error("Error scraping menu data:", error);
        }
  });

  const getData = async (url: string) => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
  
      /* Find <th>s, which contain the time, such as "조식 8:00~9:00" */
      const timeList = $("thead th").toArray().map((el) => $(el).text());
      /* Find <tbody>s, which contain the menu of each time */
      const menuList = $("tbody td").toArray().map((el) => {
        return $(el).find('.list-1st').text() !== "" ? $(el).find('.list-1st').text() : $(el).text();
      });
      const contentList = timeList.map((time, i) => {
        return { menu: menuList[i], time };
      });
      return contentList;
    } catch (error) {
      console.error(error);
      return null;
      // res.status(500).json({ success: false });
    }
  }
  