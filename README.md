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

We are not sure yet how difficult it would be to incorporate some sort of travel time API into the search results, and calculate the travel time
(or even travel methods) for each group member to a suggested destination, but if it turns out to be simple it is something that we would love to do.

We also have not yet made the UI look the way we want it to, and most things are largely placeholder. We want it to be more intuitive than it currently is
at the mid-way point of the project.

Some code has yet to be refactored in some files as well, and we have views such as "SearchBar.vue" which is currently performing tasks that should be emitted
to the presenter and then asked to be handled in the model. Additionally, "store.js" has a lot of duplicate
code in it as well as mutations and actions that are no longer used and need to be removed. This is also a priority of ours.

## Known Bugs

There are some known bugs that we have yet to sort out. Chief among them is the fact that upon initially loading the page it sometimes does not properly retrieve
the logged in user's group information on the map. This works on localhost but not on deployment, which we are looking into.

Additionally, logging out while being in a group sometimes can cause pretty serious errors. Logging out while being in a group and then attempting to add a pin to the group's
collection (which they should not be able to do, since they are logged out and  thus not part of any group) will throw a firebase error which, although it is checked, sometimes
makes it so that the user can't then log back in again. Sometimes the logged out user can still see the group information of the group they left as well, which should not be the
case.

## Project File Structure
/src<br/>
├── components  <-- Where we keep our .vue components. These are our views.<br/>
│   ├── Details.vue       <-- View displaying Google.maps.Place info, updated via map marker click.<br/>
│   ├── Map.vue           <-- View responsible for containing the embedded Google Maps "map" object.<br/>
│   ├── Navbar.vue        <-- View responsible for containing the navbar/banner on top of the page with the login/logout button.<br/>
│   ├── SearchBar.vue     <-- View handling Google Maps searches via input, improperly linked directly to the model.<br/>
│   └── SidebarTest.vue   <-- View managing current group info, pinned places, and group creation/joining.<br/>
├── css<br/>
│   ├── fonts             <-- Contains fonts used in the app.<br/>
│   └── style.css         <-- Style document handling app-wide CSS, with scattered CSS to be refactored here.<br/>
├── images                <-- Images used in the app.<br/>
├── js                    <-- Where we keep all helper methods and JavaScript files, including the Vuex model.<br/>
│   ├── Data.js           <-- Contains helper methods used by the model.<br/>
│   ├── firebaseAuth.js   <-- Contains helper methods used for authenticating the user with Firebase.<br/>
│   ├── firebaseConfig.js <-- Contains important code for configuring and initializing Firebase.<br/>
│   └── store.js          <-- Vuex model with state, getters, mutations, and actions. Actions commit mutations; getters pass info to views.<br/>
├── presenters            <-- Contains the presenters that communicate with the model and views.<br/>
│   ├── DetailsPresenter.vue   <-- Presenter for Details.vue, linking clicked places to view and user interest to model.<br/>
│   ├── MapPresenter.vue       <-- Presenter for Map.vue and SearchBar.vue, retrieving user coordinates and map instance, not fully integrated.<br/>
│   ├── NavbarPresenter.vue    <-- Presenter for the Navbar.vue view. Relays user's wishes to login/logout to the model.<br/>
│   └── SidebarPresenter.vue   <-- Presenter for SidebarTest.vue, relaying group actions to the model and passing current group info to the view.<br/>
├── views                 <-- Deprecated folder for views. Not used and will be deleted.<br/>
├── index.jsx             <-- Bootstrapping file creating the app, binding the Vuex store and Vue3Geolocation for fetching user coordinates.<br/>
├── VueRoot.jsx           <-- Root div used when bootstrapping. Initializes all presenters.<br/>
├── index.html            <-- Root document for browser access, defining the Vue app mounting point and loading the Google Maps JavaScript API.<br/>
├── package-lock.json<br/>
├── package.json<br/>
└── vite.config.js        <-- npm/Vite related files for building the app.<br/>


