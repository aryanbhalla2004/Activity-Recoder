const inputForm = document.getElementById('userForm');
const activitiesHolder = document.getElementById('activities-info');
const totalActivity = document.querySelector('#activities-total');
const totalTime = document.querySelector('#time-total');
const averageCaloriesTotal = document.querySelector('#average-calories-total');
const caloriesTotal = document.querySelector('#calories-total');
let count = 0;
let arrayData = [];
let arrayLabel = [];
class Activity{
  constructor(description, lengthOfTime, intensity) {
    this.description = description;
    this.date = moment().format('MMMM D, YYYY');
    this.lengthOfTime = lengthOfTime;
    this.formatedTime = this.getTime(lengthOfTime);
    this.calories = this.getCalories(intensity, lengthOfTime);
    this.intensity = intensity;
    this.id = count;
    count++;
  }

  getTime(time){
    const totalTime = (time / 60);
    const remainingHours = Math.floor(totalTime)
    const remainingMinutes = Math.round((totalTime - remainingHours) * 60);

    if(remainingHours > 0){
      return `${remainingHours}hrs. ${remainingMinutes}mins.`
    } else{
      return `${remainingMinutes}mins.`
    }
  }

  getCalories(intensity, time){
    return (((intensity * 60) / 60) * time).toFixed(0);
  }
}

class ActivityTracker{
  constructor() {
    this.activities = [];
  }

  addActivity(description, time, intensity){
    this.activities.push(new Activity(description, time, intensity));
    this.listActivity();
    this.updateChart();
  }

  listActivity(){
    activitiesHolder.innerHTML = "";
    arrayData = [];
    arrayLabel = [];
    this.activities.find(function(element) {
      arrayLabel.push(element.description);
      arrayData.push(element.calories);
      activitiesHolder.insertAdjacentHTML('afterbegin', `
      <tr class="activity" data-id="${element.id}">
        <td class="description">${element.description}</td>
        <td class="calories">${element.calories}</td>
        <td class="time">${element.formatedTime}</td>
        <td class="date">${element.date}</td>
        <td class="close"><i class="las la-times"></i></i></td>
      </tr>
      `);
    });
    update()
  }

  removeActivity(id) {
    for(let i = 0; i < this.activities.length; i++){  
      if (this.activities[i].id === parseInt(id)) {
        this.activities.splice(i,1);
      }                  
    }

    this.listActivity();
    this.updateChart();
  }

  updateChart() {
    totalActivity.querySelector("H3").innerHTML = this.activities.length;
    let time = 0;
    let calories = 0;
    this.activities.find(function(element) {
      time += parseInt(element.lengthOfTime);
      calories += parseInt((((element.intensity * 60) / 60) * element.lengthOfTime).toFixed(0));
      update();
    });

    const timeTotal = (time / 60);
    const remainingHours = Math.floor(timeTotal)
    const remainingMinutes = Math.round((timeTotal - remainingHours) * 60);
    if(remainingHours > 0){
      totalTime.querySelector("H3").innerHTML = `${remainingHours}hrs. ${remainingMinutes}mins.`;
    } else{
      totalTime.querySelector("H3").innerHTML = `${remainingMinutes}mins.`;
    }
    
    caloriesTotal.querySelector("h3").innerHTML = calories;
    averageCaloriesTotal.querySelector("h3").innerHTML = (calories/this.activities.length);
  }
}

inputForm.addEventListener('submit', e => {
  e.preventDefault();
  const description = document.getElementById('description-input');
  const time = document.getElementById('time-input');
  const intensity = document.getElementById('intensity-input');

  if(description.value !== "" && time.value !== "" && intensity.value !== ""){
    activityTracker.addActivity(description.value, time.value, intensity.value);
    inputForm.reset();
  } else {
    if(description.value === ""){
      description.style.border = "1px solid red";
    } else {
      description.style.border = "none";
    }

    if(time.value === ""){
      time.style.border = "1px solid red";
    } else {
      time.style.border = "none";
    }

    if(intensity.value === ""){
      intensity.style.border = "1px solid red";
    } else {
      intensity.style.border = "none";
    }
  }

  
});

activitiesHolder.addEventListener('click', e => {
  if(e.target.nodeName === "I"){  
    activityTracker.removeActivity(e.path[2].dataset.id);
  }
});

const activityTracker = new ActivityTracker();

function update(){
  var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: arrayLabel,
        datasets: [{
            label: '# of Votes',
            data: arrayData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
}




update();