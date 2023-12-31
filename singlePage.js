const artist = JSON.parse(artists);
const genre = JSON.parse(genres);
const song = JSON.parse(songs);

//adding api to read songs 

  document.addEventListener("DOMContentLoaded", () =>{
    
   //hiding single song view
    document.querySelector("#singleSongPage").hidden = true;
    //hiding close button view 
    document.querySelector("header").hidden = true; 
       //showing credits 
   function showCredits(){
    document.querySelector("#groupNames").hidden = false;
    document.querySelector("#github").hidden = false;
   }
   function hideCredits(timer){
    setTimeout(document.querySelector("#groupNames").hidden = true, timer);
    setTimeout(document.querySelector("#github").hidden = true, timer);
   }
   document.querySelector("#credits").addEventListener("click", () =>{
    showCredits();
    setTimeout(document.querySelector("#groupNames").hidden = true, 6000);
    setTimeout(document.querySelector("#github").hidden = true, 6000);
   });
    
   //playlist to store songs
    let songPlaylist = [];
    let sortedSongs = [];
    const url = 
   "https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php";
 
   //checking if local storage has data 
   if (localStorage.getItem("songData")){
    console.log("data is in local storage");
    sortedSongs = JSON.parse(localStorage.getItem("songData"));

    // Adding songs from api to song select tag
   fillSelect(sortedSongs);
   //Adding artist and genre to select tag
   populate(artist,"#artistSelect");
   populate(genre,"#genreSelect");
   //Displaying All songs initially
   populateTable(sortedSongs,songPlaylist);
   headerSort(sortedSongs,songPlaylist);
  /**
   * Helper function  for finding specific genre selected
   */
  searchResult(sortedSongs, songPlaylist);

  showView(sortedSongs,songPlaylist);
  }
  else{
     //grabbing song data from api 
   fetch(url)
   .then(resp => resp.json())
   .then(songs => {
     
    // sorting songs by title
     const sortedSongs = songs.sort( (a,b) => {
      if (a.title < b.title){
        return -1;
      }
      else{
        return 1;
      }
   });
   // Adding songs from api to song select tag
   fillSelect(sortedSongs);
   //Adding artist and genre to select tag
   populate(artist,"#artistSelect");
   populate(genre,"#genreSelect");
   //Displaying All songs initially
   populateTable(sortedSongs,songPlaylist);
   headerSort(sortedSongs,songPlaylist);
  /**
   * Helper function  for finding specific genre selected
   */
  searchResult(sortedSongs, songPlaylist);

  showView(sortedSongs,songPlaylist);

  let JSONData = JSON.stringify(sortedSongs);
  localStorage.setItem("songData", JSONData);
   })
   .catch(error => console.log(error));
    
  }

  //CREDITS
  const showNames = document.querySelectorAll("a[href='#groupNames']");
  for (let names of showNames){
  names.addEventListener("click", function(){
     window.alert("The Group Members Are: Ben Harris-Eze, and Matthew Anand")
  })}
  const showGit = document.querySelectorAll("a[href = '#github']");
  for(Git of showGit){
  Git.addEventListener("click", function(){
     window.alert("https://github.com/MatthewAnand/COMP3512ASG2BENMATT");
  })}
   //end of dom content loaded 
  });
// method for filling song select with songs
  function fillSelect(list){
    list.forEach(s =>{
      const select = document.querySelector("#songSelect");
      const option = document.createElement("option");
      option.textContent = s.title;
      option.value = s.song_id;
      option.className = "song-option";
      select.appendChild(option);
    });
  }

  function searchResult(songAPI, songPlaylist){
    //Filter Songs based on choice (radio buttons)  
 const filterBtn = document.querySelector("#filter");

 //adding handler for filter button
 filterBtn.addEventListener("click",()=>{
 // clearing previous search 
 clear();

 // getting all the radio buttons 
 const buttons = document.querySelectorAll("input[type=radio]");

   // checking for home of radio button to see which one is chosen 
   let foundhome = 0;
   let found = false;
   for (let i =0; i < buttons.length; i++){
     if (buttons[i].checked){
         foundhome = i;
         found = true;
     }
 }
     const btn = buttons[foundhome];
     // filtering process depending on the selected radio button
     
     // variable for songs that will be displayed on table
     let songList = [];

     if (btn.value == "song" && found == true){
       const songChoice = document.querySelector("#songSelect");
       songList = searchSong(songChoice.value,songAPI);
       populateTable(songList,songPlaylist);
     }
     else if (btn.value== "genre" && found == true){
       const genreChoice = document.querySelector("#genreSelect");
       songList = searchGenres(genreChoice.value,songAPI);
       populateTable(songList,songPlaylist);
     }
     else if (btn.value == "artist" && found == true){
       const artistChoice = document.querySelector("#artistSelect");
       songList = searchArtists(artistChoice.value,songAPI);
       populateTable(songList,songPlaylist);
     }
     else{
         alert("Nothing Selected");
     }
     headerSort(songList,songPlaylist);
   
 });

 }

  //method for searching and returning all songs of a specific genre
  function searchGenres(id,list){
    const songList = list.filter(s =>{
      return id == s.genre.id;
    });
    
    return songList;
  }
   /**
   * Helper function for finding song selected
  */
   function searchSong(id,list){
    const songList = list.filter(s =>{
      return id == s.song_id;
    });

    return songList;
  }
  /**
   * Helper function  for finding specific artist selected
   */
  function searchArtists(id,list){
    const songList = list.filter(s =>{
      return id == s.artist.id;
    });
    return songList;
  }

  //SWITCHING TO SONG SEARCH or PLAYLIST VIEW
function showView (sortedSongs,songPlaylist){
  //close view button
  const close = document.querySelector("#return");
  //view header
  const viewHeader = document.querySelector("#viewDescription");
 //buttons that will be used to change  websites view
  const header = document.querySelector("#websiteTitle");
  const playlistButton = document.querySelector("#playlist a");
  //sections of the website
  const searchPage = document.querySelector("#home");
  const playlistPage = document.querySelector("#playlistPage");
  const singleSongPage = document.querySelector("#singleSongPage");

  //event listener for search view
    close.addEventListener("click", ()=>{
      close.hidden = true;
      playlistButton.hidden = false;
      populateTable(sortedSongs,songPlaylist);
      viewHeader.textContent = "Song Search";
      searchPage.hidden = false;
      playlistPage.hidden = true;
      singleSongPage.hidden = true;

    });
 //event listener for playlist view
    playlistButton.addEventListener("click", () =>{
      close.hidden = false;
      playlistButton.hidden = true;
      viewHeader.textContent = "Playlist";
      populatePlaylist(songPlaylist);
      playlistPage.hidden = false;
      searchPage.hidden = true;
      singleSongPage.hidden = true;
    });
   
}

  function populateTable(songList,playlist){
    //getting tbody that row will be added to
    clear();
    const tbody = document.querySelector("tbody");
    // loop to go through every song from the api  
    for(s of songList){
      const row = document.createElement("tr");
      row.className = "song-entry";
      row.dataset.id = s.song_id;
  
       fillRow(s,row,"title","song-column", "#search-tbody");
       fillRow(s.artist,row,"name","artist-column","#search-tbody");
       fillRow(s,row,"year","year-column","#search-tbody");
       fillRow(s.genre,row,"name","genre-column","#search-tbody");
       fillRow(s.details,row,"popularity","popularity-column","#search-tbody");
      addSongButton(row);
       
      //event listener for single song page and adding songs to playlist 
       row.addEventListener("click", (e) =>{
        //event listener for single song page and adding songs to playlist 
       if (e.target.className == "song-column"){
        const selectedSong = songList.find((s) => {
          return s.song_id == e.target.parentNode.dataset.id;
        });
        buildViewSongButton(selectedSong);
       }
        //showing details of single song 
        if (e.target.nodeName.toLowerCase() == "button"){

          const songToAdd = songList.find((s) =>{
            return s.song_id == e.target.parentNode.dataset.id
          })
         setTimeout(alert(`${songToAdd.title} by ${songToAdd.artist.name} has been added to your playlist`), 5000);
         playlist.push(songToAdd);
         }
       });
  
    }
  }
  // METHOD adds to plalist array and displays it in a table
  function populatePlaylist(list){
    clear();
    //clearing previous playlist details
    for (detail of document.querySelectorAll("#playlist-details h2")){
      detail.remove();
    }
    
    const tbody = document.querySelector("#playlistBody");
    const duration = document.createElement("h2");
    const avgPopularity = document.createElement("h2");
    let avg = 0;
    let totalDuration = 0;
    const divDetails = document.querySelector("#playlist-details");
    
    list.forEach((s) =>{
      avg += s.details.popularity;
      totalDuration += s.details.duration;

      const row = document.createElement("tr");
      row.className = "song-entry";
      row.dataset.id = s.song_id;
      
      fillRow(s,row,"title","song-column","#playlistBody");
      fillRow(s.artist,row,"name","artist-column","#playlistBody");
      fillRow(s,row,"year","year-column","#playlistBody");
      fillRow(s.genre,row,"name","genre-column","#playlistBody");
      fillRow(s.details,row,"popularity","popularity-column","#playlistBody");
      createClearButton(row);
      row.addEventListener("click",(e)=>{
        if (e.target.nodeName.toLowerCase() == "button"){
          let index = 0;
          for (let i = 0; i<list.length; i++){
            if (e.target.parentNode.dataset.id == list[i].song_id){
              index = i;
              list.splice(index);
              break;
            }
          }
          
          row.remove();
        }
      });

    });

    avg = (avg/list.length).toFixed(1);
    avgPopularity.textContent = `Average Popularity: ${avg}`;
    if (avg>0)  divDetails.appendChild(avgPopularity);
    
    
    let minutes = (totalDuration /60).toFixed(0);
    let seconds = totalDuration %60;
    totalDuration =  `${minutes} Minutes ${seconds} Seconds`;
    duration.textContent = `Playlist Length: ${totalDuration}`;
    if (totalDuration != '0:0')  divDetails.appendChild(duration);

    document.querySelector("#clearAll-button").addEventListener("click", (e)=>{
      list.length = 0;
      let rows = document.querySelectorAll("#playlistBody tr");
      for (let row of rows){
          row.remove();
      }
    });
  }
  // This method sorts songs based on the header clicked of a table
  function headerSort(songList,playlist){
    //artist filter 
   document.querySelector(".artist-filter").addEventListener("click", (e) =>{
    const sorted = songList.sort((a,b) =>{
      //checking if a filter search has happened in the past
      if (!e.target.classList.contains("on")){
        if (a.artist.name.toLowerCase() < b.artist.name.toLowerCase()) return -1;
        else return 1;
      }
      else {
        if (a.artist.name.toLowerCase() < b.artist.name.toLowerCase()) return 1;  
        else return -1;
      }
    });
    //making sure classname is swiched to on/off
    e.target.classList.toggle("on");
    populateTable(sorted,playlist);
   });

    //popularity filter 
   document.querySelector(".popularity-filter").addEventListener("click", (e) =>{
    //checking if a filter search has happened 
    const sorted = songList.sort((a,b) =>{
      if (!e.target.classList.contains("on")){
        if (a.details.popularity < b.details.popularity) return -1;
        else return 1;
      }
      else{
        if (a.details.popularity < b.details.popularity) return 1;
        else return -1;
      }
      
    });
    populateTable(sorted,playlist);
    e.target.classList.toggle("on");
    
   });     

   //genre filter 
   document.querySelector(".genre-filter").addEventListener("click", (e) =>{
    //checking if a filter search has happened 
    const sorted = songList.sort((a,b) =>{
      if (e.target.classList.contains("on")){
        if (a.genre.name.toLowerCase() < b.genre.name.toLowerCase()) return -1;
        
        else return 1;
        
      }
      else{
        if (a.genre.name.toLowerCase() < b.genre.name.toLowerCase()) return 1;
        else return -1;
      }
    
    });
    populateTable(sorted,playlist);
    e.target.classList.toggle("on")
   });
   // title filter 
   document.querySelector(".title-filter").addEventListener("click", (e) =>{
    //sorting list of songs by title 
    const sorted = songList.sort((a,b) =>{
        //checking if a filter search has happened in the past
      if (!e.target.classList.contains("on")){
        if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
        else return 1;
      }
      //reverse sorting lists of songs by title
      else{
        if (a.title.toLowerCase() < b.title.toLowerCase()) return 1;
        else return -1;
      }
    });
    //making sure sort has been noticed 
    e.target.classList.toggle("on");
    populateTable(sorted,playlist);
   });

   //year filter
   document.querySelector(".year-filter").addEventListener("click", (e) =>{
    const sorted = songList.sort((a,b) =>{
      //case for if sort hasnt happened 
      if (!e.target.classList.contains("on")){
        if (a.year < b.year) return -1;
        else return 1;
      }
      //case for if sort has already happened before
      else {
        if (b.year < a.year) return -1;
        else return 1;
      }
    });
    //toggling header to keep track of a sort that has just happened
    e.target.classList.toggle("on");
    //updating table with sorted array
    populateTable(sorted,playlist);
   });
   
   window.addEventListener("click", function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  })

  }
/**
 * function for filling out the select with options from a list 
 */
function populate(list,selectID){
const select = document.querySelector(selectID);
//iterating through all of list 
list.forEach(obj =>{
  const option = document.createElement("option");
  //adding name to option
  option.textContent = obj["name"];
  //adding id to option
  option.value = obj["id"];
  //adding created option to select
  select.appendChild(option);
});
}

/**
 * Fills row based on object pased and property name passed
 * @param {*} obj the song object
 * @param {*} row 
 * @param {*} songProp property of the sog object you want
 */
function fillRow(song, row, songProp, rowClassName,bodyID){
  //getting tbody 
  const tbody = document.querySelector(bodyID);
  //selecting table row 
  //creating a table description
  const entry = document.createElement("td");
  entry.textContent = song[songProp];
  entry.className = rowClassName;
  //adding table description to table row 
  row.appendChild(entry);
  //adding row to tbody
  tbody.appendChild(row);
}
//creates a clear song button for the playlist table
function createClearButton(row){
  const tbody = document.querySelector("#playlistBody");
  const button = document.createElement("button");
  button.textContent = "Remove";
  row.appendChild(button);
  tbody.appendChild(row);
  button.className="removeButton";
}
//Adds a add song button for a song in row in a table
function addSongButton(row){
  //adding an add song button
  const tbody = document.querySelector("tbody");
  const button = document.createElement("button");
  button.textContent = "➕";
  row.appendChild(button);
  tbody.appendChild(row);
  button.className="addButton";

}
// This function clears all songs in a table
function clear(){
    let rows = document.querySelectorAll(".song-entry");
    for (let row of rows ){
        row.remove();
    }
}

//clear event listener 
const clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click",clear);


//SWITCHING TO SINGLESONG
function buildViewSongButton(song){
    const viewHeader = document.querySelector("#viewDescription");
    viewHeader.textContent = "Song Information";
     singleSong = document.querySelector("#singleSongPage");
     home = document.querySelector("#home");
     singleSong.hidden = false;
     home.hidden=true;

     // calc duration
     const songLength = document.querySelector("#duration");
     let minutes = (song.details.duration / 60).toFixed(0);
     let seconds = (song.details.duration % 60);
     songLength.textContent= `${minutes}:${seconds}`;

     const songTitle = document.querySelector("#titleSong");
     songTitle.textContent = song.title;
     const songArtist = document.querySelector("#artist");
     songArtist.textContent = song.artist.name;
     const songYear = document.querySelector("#year");
     songYear.textContent = song.year;
     const songGenre = document.querySelector("#genre");
     songGenre.textContent = song.genre.name;
     const bpm = document.querySelector("#bpm");
     const energy = document.querySelector("#energy");
     const dance = document.querySelector("#danceability");
     const live = document.querySelector("#liveness");
     const valence= document.querySelector("#valence");
     const acoustic = document.querySelector("#acousticness");
     const speech = document.querySelector("#speechiness");
     const pop = document.querySelector("#popularity");
     bpm.textContent = "BPM: " +song.details.bpm;

     //Energy
     energy.textContent = "Energy: \u00A0 \u00A0 \u00A0\u00A0\u00A0\u00A0 ";
     let energyBar = document.createElement(`progress`);
     energyBar.setAttribute(`max`, 100);
     energyBar.setAttribute(`value`, song.analytics.energy);
     energy.appendChild(energyBar);

     //Danceability
     dance.textContent = "Danceability: ";
     let danceabilityBar = document.createElement(`progress`);
     danceabilityBar.setAttribute(`max`, 100);
     danceabilityBar.setAttribute(`value`, song.analytics.danceability);
     dance.appendChild(danceabilityBar);

     //Liveness
     live.textContent = "Liveness:\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00a0";
     let livenessBar = document.createElement(`progress`);
     livenessBar.setAttribute(`max`, 100);
     livenessBar.setAttribute(`value`, song.analytics.liveness);
     live.appendChild(livenessBar);

     //Valence
     valence.textContent = "Valence:\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0";
     let valenceBar = document.createElement(`progress`);
     valenceBar.setAttribute(`max`, 100);
     valenceBar.setAttribute(`value`, song.analytics.valence);
     valence.appendChild(valenceBar);

     //Acousticness
     acoustic.textContent = "Acousticness: ";
     let acousticBar = document.createElement(`progress`);
     acousticBar.setAttribute(`max`, 100);
     acousticBar.setAttribute(`value`, song.analytics.acousticness);
     acoustic.appendChild(acousticBar);

     //Speechiness
     speech.textContent = "Speechiness: \u00a0\u00a0";
     let speechBar = document.createElement(`progress`);
     speechBar.setAttribute(`max`, 100);
     speechBar.setAttribute(`value`, song.analytics.speechiness);
     speech.appendChild(speechBar);

     //Popularity
     pop.textContent = "Popularity: \u00a0\u00a0\u00a0\u00a0\u00a0";
     let popBar = document.createElement(`progress`);
     popBar.setAttribute(`max`, 100);
     popBar.setAttribute(`value`, song.details.popularity);
     pop.appendChild(popBar);

     //radarChart
     buildChart(song.details.bpm, song.analytics.energy, song.analytics.danceability, song.analytics.liveness, song.analytics.valence, song.analytics.acousticness, song.analytics.speechiness, song.details.popularity);
  
     function buildChart(bpm, energy, dance, live, valence, acoustic, speech, pop){
      // if chart exists, destroy.
      if(typeof radarChart != "undefined"){
         radarChart.destroy();
      }
      
   
          const ctx = document.getElementById('song-chart');
          radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
              labels: ['BPM', 'Energy', 'Danceability', 'Liveness', 'Valence', 'Acousticness', 'Speechiness',
                'Popularity'
              ],
              datasets: [{
                label: 'Song Data',
                data: [bpm, energy, dance, live, valence, acoustic, speech, pop],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
               tension: 0.15,
                borderColor: 'rgba(0,175,236,255)',
                pointBackgroundColor: 'rgba(11,49,86,255)',
                pointBorderColor: 'rgba(11,49,86,255)',
                pointHoverBackgroundColor: '#ffff',
                pointHoverBorderColor: '#0b88c3'
              }]
            },
            options: {
               maintainAspectRatio: false,
            },
            scale: {
               angleLines: {
                  color: 'rgba(240, 240, 240,0.5)',
              },
   
              grid: {
                  color: "lightgreen",
              },
             },
          });
}
}

