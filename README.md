Description of the Project___

Our app is meant to serve as a tool for groups of friends trying to decide where to meet up in person.
Each user can choose whether to join a group or create their own. If they create their own, they are shown an invite code
which they can send to their friends. Their friends, who are joining another persons group, simply paste this code in to the join
input field and press enter.

Once users are in a group with each other, they will see one another on embedded google map. Now, if they search
for places on google maps such as "Bars" or "Ramen restaurants" they will be shown markers on the map. They can click on
those markers to see more detailed information about them. If they "pin" those markers, they appear for the entire group and everyone
can partake in the suggested meeting place.

Importantly, the search results given by the engine are tailored to be somewhere near the middle of all group members. This way, a
group of friends can find a place to meet up that is a fair distance from all of them.

Future implementations____

We are not sure yet how difficult it would be to incorporate some sort of travel time API into the search results, and calculate the travel time
(or even travel methods) for each group member to a suggested destination, but if it turns out to be simple it is something that we would love to do.

We also have not yet made the UI look the way we want it to, and most things are largely placeholder. We want it to be more intuitive than it currently is
at the mid-way point of the project.

Some code has yet to be refactored in some files as well, and we have views such as "SearchBar.vue" which is currently performing tasks that should be emitted
to the presenter and then asked to be handled in the model. Additionally, "store.js" has a lot of duplicate
code in it as well as mutations and actions that are no longer used and need to be removed. This is also a priority of ours.

Known bugs____

There are some known bugs that we have yet to sort out. Chief among them is the fact that upon initially loading the page it sometimes does not properly retrieve
the logged in user's group information on the map. This works on localhost but not on deployment, which we are looking into.

Additionally, logging out while being in a group sometimes can cause pretty serious errors. Logging out while being in a group and then attempting to add a pin to the group's
collection (which they shuold not be able to do, since they are logged out and  thus not part of any group) will throw a firebase error which, although it is checked, sometimes
makes it so that the user can't then log back in again. Sometimes the logged out user can still see the group information of the group they left as well, which should not be the
case.

Project File Structure_____
./src
../components            <-- Where we keep our .vue components. These are our views.
...Details.vue           <-- View responsible for showing information about a retrieved "place" from the Google.maps.Place api. Updated by clicking on a map marker.
...Map.vue               <-- View responsible for containing the embedded google maps "map" object.
...Navbar.vue            <-- View responsible for containing the navbar/banner on top of the page with the login/logout button.
...SearchBar.vue         <-- View responsible for searching up places on google maps using an input container. NOT COMPLETE! Currently, this view communicates directly with the model which is not allowed.
...SidebarTest.vue       <-- View responsible for containing information regarding the current group and pinned places on the map. Also for create/joinining groups.
../css  
.../fonts                <-- Contains fonts used in the app.
...style.css             <-- Style document responsible for the css of the whole app. Some bits of css are scattered across views as well but will be refactored into this file.
../images                <-- Images used in the app.
../js                    <-- Where we keep all helper methods and javascript files. Including the vuex model.
...Data.js               <-- Contains helper methods used by the model.
...firebaseAuth.js       <-- Contains helper methods used for authenticating the user with firebase.
...firebaseConfig.js     <-- Contains important code for configuring and initilizating firebase.
...store.js              <-- Contains our vuex model. Contains a state, getters, mutations and actions. Actions commit mutations. Getters are used by presenters to pass information to views.
../presenters            <-- Contains the presenters that communicate with the model and views.
...DetailsPresenter.vue  <-- Presenter for the Details.vue view. Communicates what place the user has clicked on to the view, and relays user interest in places to the model.
...MapPresenter.vue      <-- Presenter for both the Map.vue and SearchBar.vue views. Retrieves the user's coordinates and the map instance for the model. Not yet well implemented with SearchBar.vue.
...NavbarPresenter.vue   <-- Presenter for the Navbar.vue view. Relays user's wishes to login/logout to the model.
...SidebarPresenter.vue  <-- Presenter for the SidebarTest.vue view. Relays user's wishes to join/create groups to model, and information about the current group from the model to the view.
../views                 <-- Deprecated folder for views. Not used and will be deleted.
..index.jsx              <-- Bootstrapping file. Creates the app and binds the vuex store as well as the external library Vue3Geolocation to it. The latter is used to fetch user's coordinates.
..VueRoot.jsx            <-- Root div used when bootstrapping. Initializes all presenters.
.index.html              <-- Root document for browser access. Defines mounting point for the vue app. Also configures and loads the Google Maps Javascript API.
.package-lock.json
.package.json
.vite.config.js          <-- npm/vite related files for building the app.

