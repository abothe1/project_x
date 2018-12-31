document.getElementById("searchButton").addEventListener('click',searchHit);
document.getElementById("loginButton").addEventListener('click',loginHit);
document.getElementById("signInButton").addEventListener('click',signInHit);
var searchField=document.getElementById('searchText');

//classes
class User{
  constructor(){
    this.name="";
    this.password="";
    this.type="";
    this.bandID="";
    this.events=[];
    this.email="";
    this.phone="";
    this.sessionID="";
    this.lat=0.0;
    this.lng=0.0;
    this.address="";
  }
}
class Sample{
  constructor(pic,audio){
    this.pic=pic;
    this.audio=audio;
  }
}
class Band{
  constructor(json){
    this.memebers=json["members"];
    this.name=json["name"];
    this.id=json["id"];
    this.gigs=json["gigs"];
    this.instruments=json["instruments"];
    this.rating=json["rating"];
    this.genres=json["genres"];
    this.samples=json["samples"]
    this.profPic=json["profPic"];
  }

}
class Gig{
  constructor(json){
    this.date=json["date"];
    this.price=json["price"];
    this.isOpen=json["open"];
    this.id=json["id"];
    this.bandID=json["bandID"];
    this.posterID=json["posterID"];
    this.genres=json["genres"];
    this.type=json["type"];
    this.isDone=json["done"];
    this.isAlc=json["isAlc"];
  }
}

//global vars
var samples = [];
var musicBlocks = [];
var searchMode="bands";

console.log("script was loaded int the htmllll!");
//register goes here
function loginHit(){
  console.log("got into login hit");
};
function signInHit(){
  console.log("got into signInHit");
};
//sessions go here

// this is the code for getting our bands, then converitng them into music blocks
$.get('/bands', function(data){
  $.each(data, function(key,val){
    samples.push(val['samples']);
  });
});
for (var s in samples){
  var musicBlock = {
   pic:s["pic"],
   audio:s["audio"]
 };
  musicBlocks.push(musicBlock);
}

//this is the function to handle the search bar
function searchHit(){
  var bands=[];
  var gigs=[];
  searchText=searchField.value;
  switch(searchMode){
    case "bands":
    $.get('/bands', {query:searchText}function(data){
      $.each(data, function(key,val){
        var band = new Band(val);
        bands.push(band);
      });
    });
    //Now we gotta take this the bands a pass them to the next page, and display them
    break;
    case "gigs":
    $.get('/gigs', {query:searchText}function(data){
      $.each(data, function(key,val){
        var gig = new Gig(val);
        gigs.push(gig);
      });
    });
    //Now we gotta take this the gigs a pass them to the next page, and display them
    break;
    case "postEvent":
    $.post('/gigs', {query:searchText});
    break;
  }
};
