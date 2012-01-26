var count=1;
localStorage.setItem('notification',"true");
$(document).ready(function(){
checkForUpdates();
var minutes = 1;
setInterval("checkForUpdates()",minutes*60*1000);
});

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

function setBadgeText(txt)
{
	chrome.browserAction.setBadgeText({text:txt});
	if(localStorage.getItem('notification')=="true")
	showNotification("You have got "+ txt + " new message(s)");
}

function checkForUpdates()
{
	var url="http://extension.kurukshetra.org.in/api/chromeextensionapi.php";
	//var url="http://localhost/kurukNotification_New/api/chromeextensionapi.php";
	var storedData = localStorage.getItem('latestupdates');
	var data="";
	if(storedData==null || JSON.parse(storedData).length==0)
	{
		data="method=getLatestUpdates&messageid=-1&updateid=-1";
	}
	else
	{
		var messageid="";
		var updateid="";
		storedData=JSON.parse(storedData);
		for(i=0;i<storedData.length-1;i++)
		{
			messageid=messageid+storedData[i].messageid+"_";
			updateid=updateid+storedData[i].id+"_";
		}
		messageid=messageid+storedData[i].messageid;
		updateid=updateid+storedData[i].id;
		data="method=getLatestUpdates&messageid="+messageid+"&updateid="+updateid;
	}
	$.ajax({
  		url: url,
  		dataType: 'json',
		data:data,
	  success: processData
	});
}

function processData(data)
{
	var newmsgcount;
	var boldupdates=[];
	if(localStorage.getItem('latestupdates')==null)
	{	
		localStorage.setItem('latestupdates',JSON.stringify(data));
		for(i=0;i<data.length;i++)
			boldupdates.push({messageid:data[i].messageid});
		localStorage.setItem('boldupdates',JSON.stringify(boldupdates));
		if(data.length>0)
		setBadgeText(data.length.toString());
	}
	else
	{
		//check what all the updates
		var isEmpty = localStorage.getItem('boldupdates')==null;
		var lupdatesLS = JSON.parse(localStorage.getItem('latestupdates'));
		var ctr=0;
		var count=0;
		var finalResponse=[];
		var finalBoldUpdates=[];
		var bupctr = 0;
		var boldupdatelist=JSON.parse(localStorage.getItem('boldupdates'));
		for(i=0;ctr<lupdatesLS.length && i<data.length;)
		{
			
			if(data[i].messageid==lupdatesLS[ctr].messageid)
			{
				if(data[i].id>lupdatesLS[ctr].id && !isEmpty)
				{
					while(bupctr<boldupdatelist.length && boldupdatelist[bupctr].messageid<data[i].messageid)
					{
						boldupdates.push({messageid:boldupdatelist[bupctr].messageid});
						bupctr++;
					}
					if(bupctr<boldupdatelist.length && boldupdatelist[bupctr].messageid>data[i].messageid)
						boldupdates.push({messageid:data[i].messageid});
				}
				if(!isEmpty && boldupdatelist.length==bupctr)
				boldupdates.push({messageid:data[i].messageid});
				finalResponse.push({id:data[i].id,heading:data[i].heading,url:data[i].url,update:data[i].update,messageid:data[i].messageid});
				ctr++;
				i++;
			}
			else if(lupdatesLS[ctr].messageid<data[i].messageid)
			{
		       finalResponse.push({id:lupdatesLS[ctr].id,heading:lupdatesLS[ctr].heading,url:lupdatesLS[ctr].url,update:lupdatesLS[ctr].update,messageid:lupdatesLS[ctr].messageid});
			   ctr++;
			}
		}
//		var newdata=[];
		while(i<data.length)
		{
			boldupdates.push({messageid:data[i].messageid});
			finalResponse.push({id:data[i].id,heading:data[i].heading,url:data[i].url,update:data[i].update,messageid:data[i].messageid});
			i++;
		}
		while(ctr<lupdatesLS.length)
		{
			finalResponse.push({id:lupdatesLS[ctr].id,heading:lupdatesLS[ctr].heading,url:lupdatesLS[ctr].url,update:lupdatesLS[ctr].update,messageid:lupdatesLS[ctr].messageid});
			ctr++;
		}
		while(boldupdatelist!=null && bupctr<boldupdatelist.length)
		{
			boldupdates.push({messageid:boldupdatelist[bupctr].messageid});
			bupctr++;
		}
		localStorage.setItem('boldupdates',JSON.stringify(boldupdates));
		if(data.length>0)
		localStorage.setItem('latestupdates',JSON.stringify(finalResponse));
		var len =JSON.parse(localStorage.getItem('boldupdates')).length.toString()
		if(len>0)
		setBadgeText(len);
	}
}
