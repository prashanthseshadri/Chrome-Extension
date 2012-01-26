var userReq;
var lecturesReq;
var lecturesList;
var latestUpdateReq;
var currentPosition=0;
var latestUpdatesListLS;
if(localStorage["notification"]!="false")
localStorage["notification"]="true";
function showNotification(text)
{
	var notification=webkitNotifications.createNotification(
	'images/icon.png',
	'Kurukshetra 2012',
	text
	);
	notification.show();
	setTimeout(function(){
						notification.cancel();
						},'5000');
	notification.onclick=function(){
	notification.cancel();
	}
}

function getMajorUpdates()
{
	userReq = new XMLHttpRequest();
	userReq.open(
    "GET",
    "http://extension.kurukshetra.org.in/api/chromeextensionapi.php?method=getMajorUpdates&jsoncallback=?",
	//"http://localhost/kurukNotification_New/api/chromeextensionapi.php?method=getMajorUpdates&format=json",
    true);
	userReq.onload = showMajorUpdates;
	userReq.send(null);
}

function showMajorUpdates()
{
	document.getElementById("mupdate_loading").style.display="none";
	var userList=JSON.parse(userReq.responseText);
	var users="";
	for(i=0;i<userList.length;i++)
	{
		users=users+"<div class='update'>"+userList[i].updates+"</div>";
	}
	document.getElementById('mupdate').innerHTML=users;
}

function getLectures()
{
	lecturesReq = new XMLHttpRequest();
	lecturesReq.open(
    "GET",
    "http://extension.kurukshetra.org.in/api/chromeextensionapi.php?method=getGuestLectures&jsoncallback=?",
	//"http://localhost/kurukNotification_New/api/chromeextensionapi.php?method=getGuestLectures&format=json",
    true);
	lecturesReq.onload = showLectures;
	lecturesReq.send(null);
}
function showLectures()
{
	document.getElementById("iupdate_loading").style.display="none";
	lecturesList=JSON.parse(lecturesReq.responseText);
	var lectures="";
	if(lecturesList.length>0)
	document.getElementById('iupdateTable').style.display="block";
/*	for(i=0;i<lecturesList.length;i++)
	{*/
		lectures=lectures+"<div><table class='tableText'><tr><td><img src='"+ lecturesList[0].url +"'></td><td>"+ lecturesList[0].description +"</td></tr></table></div>";
		/*lectures=lectures+'<td><img src="images/up.jpg" class="navigation" onClick="updateLectures(1)"><br><br><img src="images/down.jpg" class="navigation" onClick="updateLectures(-1)"></td>';*/
	//}
	document.getElementById('iupdate').innerHTML=lectures;
}

function updateLectures(sign)
{
	
		var lectures="";
		currentPosition=(currentPosition+parseInt(sign))%(lecturesList.length);
		if(currentPosition==-1)
		currentPosition+=lecturesList.length;
		$('#iupdate').fadeOut('slow',function()
		{
			lectures=lectures+"<div><table class='tableText'><tr><td><img src='"+ lecturesList[currentPosition].url +"' class='lectures_photo'></td><td>"+ lecturesList[currentPosition].description +"</td></tr></table></div>";
/*			lectures=lectures+'<td><img src="images/up.jpg" class="navigation" onClick="updateLectures(1)"><br><br><img src="images/down.jpg" class="navigation" onClick="updateLectures(-1)"></td>';*/
			document.getElementById('iupdate').innerHTML=lectures;
			$('#iupdate').fadeIn('slow');
		});

}

function showLatestUpdates()
{
	document.getElementById("lupdate_loading").style.display="none";
//	var response = latestUpdateReq.responseText;
	var response = localStorage.getItem('latestupdates');
	var latestUpdatesList=JSON.parse(response);
	var latestUpdates="";
	var finalResponse = [];
	var lscount = 0;
	var respcount = 0;
	//First time
	var newmessagesidcount = 0;
	var newmessagesid = localStorage.getItem('boldupdates');
	if(newmessagesid!=null)
	{
		newmessagesid = JSON.parse(newmessagesid);
	}
	else
		newmessagesid=[];
	while(respcount<latestUpdatesList.length)
		{
			if(newmessagesidcount<newmessagesid.length && latestUpdatesList[respcount].messageid==newmessagesid[newmessagesidcount].messageid)
			{
		latestUpdates+="<div class='latestUpdateText'><img src='images/icon.png' class='icon15x15' name='"+ respcount +"' onClick='toggleUpdate(this)'><a href='"+ latestUpdatesList[respcount].url +"' target='_blank'><b>"+ latestUpdatesList[respcount].heading +"</b></a></div>"
				latestUpdates+="<p style='display:none;' id='lupdate_"+ respcount +"'>"+ latestUpdatesList[respcount].update +"</p>";
				finalResponse.push({id:latestUpdatesList[respcount].id,heading:latestUpdatesList[respcount].heading,update:latestUpdatesList[respcount].update,url:latestUpdatesList[respcount].url,messageid:latestUpdatesList[respcount].messageid});
				newmessagesidcount++;
			}
			else
			{
				latestUpdates+="<div class='latestUpdateText'><img src='images/icon.png' class='icon15x15' name='"+ respcount +"' onClick='toggleUpdate(this)'><a href='"+ latestUpdatesList[respcount].url +"' target='_blank'>"+ latestUpdatesList[respcount].heading +"</a></div>"
				latestUpdates+="<p style='display:none;' id='lupdate_"+ respcount +"'>"+ latestUpdatesList[respcount].update +"</p>";
				finalResponse.push({id:latestUpdatesList[respcount].id,heading:latestUpdatesList[respcount].heading,update:latestUpdatesList[respcount].update,url:latestUpdatesList[respcount].url,messageid:latestUpdatesList[respcount].messageid});
				
			}
			respcount++;
		}
		//localStorage.setItem("latestupdates",JSON.stringify(finalResponse));
	document.getElementById('lupdate').innerHTML=latestUpdates;
	var bup=[];
	localStorage.setItem('boldupdates',JSON.stringify(bup));
	chrome.browserAction.setBadgeText({text:""});
	return;
}

function showSponsors()
{
/*	$.ajax({
	  url: "http://extension.kurukshetra.org.in/sponsors.html",
	  dataType: "html",
	  success: function(data)
	  {
		$('#sponsorsList').html(data);		  
		$('#sponsorsList').cycle({
		fx:'fade',
		timeout: 2000,
		delay: -1000,
		});
	  }
	});	*/
	sponsorsReq = new XMLHttpRequest();
	sponsorsReq.open(
    "GET",
    "http://extension.kurukshetra.org.in/sponsors.html",
    true);
	sponsorsReq.onload = function(){
		$('#sponsorsList').html(sponsorsReq.responseText);		  
		$('#sponsorsList').cycle({
		fx:'fade',
		timeout: 2000,
		delay: -1000,
		});
	};
	sponsorsReq.send(null);
}

function toggleUpdate(element)
{
	var id="lupdate_"+element.name;
	$('#'+id).slideToggle('medium');
}

function loadData()
{
	getMajorUpdates();
	getLectures();
	showLatestUpdates();
	showSponsors();
}
