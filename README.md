## Description of the Project

Our app is meant to serve as a tool for groups of friends trying to decide where to meet up in person.
Each user can choose whether to join a group or create their own. If they create their own, they are shown an invite code
which they can send to their friends. Their friends, who are joining another person's group, then simply paste this code into the join
input field and press enter.

Once users are in a group together, they will see one another on the embedded google map. Now, if they search
for places on google maps such as "Bars" or "Ramen restaurants" they will be shown markers on the map. They can click on
those markers to see more detailed information about them. If they "pin" those markers, they appear for the entire group and everyone
can partake in the suggested meeting place.

Importantly, the search results given by the engine are tailored to be somewhere near the middle of all group members. This way, a
group of friends can find a place to meet up that is a fair distance from all of them.

## Future Implementations

In the future we would like to make the user interface more responsive, especially on mobile devices, and to allow the user to choose
their preferred travel method. Right now, the app calculates travel distances assuming that the user will use public transport, but
the API also allows us to request travel information for users that might want to drive a car to the destination or walk the entire way.

## Known Bugs

If the user is using an adblocker such as uBlock or AdguardExtra, the page will initially not load and the user has to manually refresh 
the page.

The CSS sometimes does not show the map properly when on a mobile device and inside of a group. This can make it incredibly difficult
or impossible to even perform a search as the search bar is hidden by the sidebar view.

## Project File Structure
/src<br/>
├── components            <-- Where we keep our .vue components. These are our views.<br/>
│   ├── Details.vue       <-- View displaying Google.maps.Place API info, updated via map marker click.<br/>
|   ├── GroupDetails.vue  <-- View displaying Google.maps.Directions API info, updated via group pin click.<br/>
│   ├── Map.vue           <-- View responsible for containing the embedded Google Maps "map" object.<br/>
|   ├── MapError.vue      <-- Fallback view responsible for telling the user to enable device location tracking.<br/>
│   ├── Navbar.vue        <-- View responsible for containing the navbar/banner on top of the page with the login/logout button.<br/>
│   ├── SearchBar.vue     <-- View handling Google Maps searches via input, improperly linked directly to the model.<br/>
|   ├── SidebarTest.vue   <-- View managing current group info, pinned places, and group creation/joining. "Test" is inaccurate.<br/>
│   └── Start.vue         <-- View for a start page which lets the user log in. User is redirected here if logged out. <br/>
├── css<br/>
│   ├── fonts             <-- Contains fonts used in the app.<br/>
│   └── style.css         <-- Style document handling app-wide CSS, with scattered CSS to be refactored here.<br/>
├── images                <-- Images used in the app.<br/>
├── js                    <-- Where we keep all helper methods and JavaScript files, including the Vuex model.<br/>
│   ├── Data.js           <-- Contains helper methods used by the model.<br/>
│   ├── firebaseAuth.js   <-- Contains helper methods used for authenticating the user with Firebase.<br/>
│   ├── firebaseConfig.js <-- Contains important code for configuring and initializing Firebase.<br/>
|   ├── polylinestore.js  <-- Contains the currently rendered polylines on the map which are incompatible with vuex.<br/>
|   ├── router.js         <-- Router for the app. Redirects user if not authenticated with a google account.<br/>
│   └── store.js          <-- Vuex model with state, getters, mutations, and actions. Actions commit mutations; getters pass info to views.<br/>
├── presenters            <-- Contains the presenters that communicate info from the views to the model and vice versa.<br/>
│   ├── DetailsPresenter.vue        <-- Presenter for Details.vue.<br/>
│   ├── GroupDetailsPresenter.vue   <-- Presenter for GroupDetails.vue.<br/>
│   ├── MapPresenter.vue            <-- Presenter for Map.vue and SearchBar.vue.<br/>
│   ├── NavbarPresenter.vue         <-- Presenter for the Navbar.vue.<br/>
|   ├── SidebarPresenter.vue        <-- Presenter for SidebarTest.vue, relaying group actions to the model and passing current group info to the view.<br/>
│   └── StartPresenter.vue          <-- Presenter for the startpage Start.vue.<br/>
├── views                 <-- Deprecated folder for views. We use the components directory instead. Not used and will be deleted.<br/>
├── index.jsx             <-- Bootstrapping file creating the app, binding the Vuex store and Vue3Geolocation for fetching user coordinates.<br/>
├── VueRoot.jsx           <-- Root div used when bootstrapping. Initializes all presenters.<br/>
├── index.html            <-- Root document for browser access, defining the Vue app mounting point and loading the Google Maps JavaScript API.<br/>
├── package-lock.json<br/>
├── package.json<br/>
└── vite.config.js        <-- npm/Vite related files for building the app.<br/>


