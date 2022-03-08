day = 2;
month = "March";
year = 2001;

step1 = year-2000;
step2 = parseInt(step1/4);
step3 = step2 + step1;
step4 = 3; // February - Mod(x,7)
step6 = step4 + step3;
step7 = day + step6;
step8 = step7;
step9 = step8 - 1;
step10 = step9%7;

console.log(step10);