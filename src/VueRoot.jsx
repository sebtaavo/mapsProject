import { h } from 'vue';
import { useStore } from 'vuex';
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';
import MapPresenter from './presenters/MapPresenter.vue';
import NavbarPresenter from './presenters/NavbarPresenter.vue';

export function VueRoot(props) {
    return (
        <div>
            <NavbarPresenter class = "navbar"/>
            <div class="main-container">
                <div class="left-section">
                    <MapPresenter id="map"/>
                </div>
                <Sidebar />
            </div>
        </div>
    );

    function handleMapReady(mapInstance) {
        console.log('Received map instance in parent:', mapInstance);
    }
}
