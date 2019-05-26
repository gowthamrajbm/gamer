(() => {

	//Coming soon countdown
  const deadlineDate = new Date('May 31, 2019 23:59:59').getTime();
  
  const countdownDays = document.querySelector('.countdown_days .number');
  const countdownHours= document.querySelector('.countdown_hours .number');
  const countdownMinutes= document.querySelector('.countdown_minutes .number');
  const countdownSeconds= document.querySelector('.countdown_seconds .number');

  setInterval(() => {    
    const currentDate = new Date().getTime();

    const distance = deadlineDate - currentDate;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownDays.innerHTML = days;
    countdownHours.innerHTML = hours;
    countdownMinutes.innerHTML = minutes;
    countdownSeconds.innerHTML = seconds;
  }, 1000);
  
  //Premier Modal
  document.querySelector('.premier-btn').addEventListener("click", function(){
	  document.querySelector('.modal-cont').style.display = 'block';
	  document.getElementById("modal-close").addEventListener("click", function(){
		  document.querySelector('.modal-cont').style.display = 'none';
	  });
	  document.querySelector(".modal-overlay").addEventListener("click", function(){
		  document.querySelector('.modal-cont').style.display = 'none';
	  });
  });
  
})();