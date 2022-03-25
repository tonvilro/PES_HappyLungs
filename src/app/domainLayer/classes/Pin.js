export default class Pin {
    constructor(name, location, description, media, rating, public) {
      this.name = name;
      this.location = location;
      this.description = description;
      this.media = media;
      this.rating = rating;
      this.public = public;

      //add to data base function
      
      addCalendarEvent(name, location, description);
    }
  
    create_pin(name, location, description, media, rating, public) {}

    edit_pin(name, location, description, media, rating, public) {
      //consultar pin a la base de dades i enviar i guardar info nova amb la funció d'editar
    }
    
    //Getters
    get recomended_IDs() {
        return this.show_recomended_IDs;
    }

    get charts() {
        return this.show_charts;
    }

      //returns true if public pin
    get public() {
        return this.public;
    }

    show_recomended_IDs(){}
  
    show_charts() {}

    addCalendarEvent(pinName, location, description) {
      var gapi = window.gapi
      var CLIENT_ID = "940094993561-ul26es9rio610t1gj6161n2n1oqo6nc0.apps.googleusercontent.com"
      var API_KEY = "AIzaSyDnGgm8vf2p1rWoEQPb2OxXREvhIh2-CJk"
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"]
      var SCOPES = "https://www.googleapis.com/auth/calendar.readonly"

      gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'))

      gapi.auth2.getAuthInstance().signIn().then(() => {
        var event = {
          'summary': pinName,
          'location': location,
          'description': description,
          'start': {
            'dateTime': '2020-06-28T09:00:00-07:00',
          },
          'end': {
            'dateTime': '2020-06-28T17:00:00-07:00',
          }
        }

        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
        })

        request.execute(event => {
          console.log(event)
          window.open(event.htmlLink)
        })
        

        /*
        // get events
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(response => {
          const events = response.result.items
          console.log('EVENTS: ', events)
        })
        */
      })
    }

    getActualDate() {

    }
}